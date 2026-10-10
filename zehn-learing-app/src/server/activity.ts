import { db } from "@/db";
import { dailyLog, students, xpEvents } from "@/db/schema";
import { levelForXp } from "@/lib/types";
import { and, eq, sql } from "drizzle-orm";

export const todayStr = () => new Date().toISOString().slice(0, 10);

function yesterdayStr() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Updates streak + last-active, and returns fresh xp/level/streak. */
export async function touchStreak(studentId: string) {
  const rows = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  const s = rows[0];
  if (!s) return null;
  const today = todayStr();
  let streak = s.streak;
  if (s.lastActiveDate !== today) {
    streak = s.lastActiveDate === yesterdayStr() ? s.streak + 1 : 1;
    await db
      .update(students)
      .set({ streak, lastActiveDate: today })
      .where(eq(students.id, studentId));
  }
  return { xp: s.xp, level: levelForXp(s.xp), streak };
}

/**
 * Awards XP exactly once per (reason, refId). Returns the amount actually
 * granted plus the student's new totals.
 */
export async function awardXp(studentId: string, reason: string, refId: string, amount: number) {
  if (amount <= 0) {
    const cur = await touchStreak(studentId);
    return { awarded: 0, ...(cur ?? { xp: 0, level: 1, streak: 0 }) };
  }
  const inserted = await db
    .insert(xpEvents)
    .values({ studentId, reason, refId, amount })
    .onConflictDoNothing()
    .returning({ id: xpEvents.id });

  if (inserted.length > 0) {
    await db
      .update(students)
      .set({ xp: sql`${students.xp} + ${amount}` })
      .where(eq(students.id, studentId));
  }
  const rows = await db.select().from(students).where(eq(students.id, studentId)).limit(1);
  const s = rows[0];
  const fresh = await touchStreak(studentId);
  return {
    awarded: inserted.length > 0 ? amount : 0,
    xp: s?.xp ?? 0,
    level: levelForXp(s?.xp ?? 0),
    streak: fresh?.streak ?? s?.streak ?? 0,
  };
}

/** Increments one counter on today's activity log (and optionally xp). */
export async function bumpDaily(
  studentId: string,
  field: "lessons" | "games" | "diary" | "cartoons",
  xp = 0
) {
  const date = todayStr();
  await db
    .insert(dailyLog)
    .values({ studentId, date, [field]: 1, xp } as never)
    .onConflictDoUpdate({
      target: [dailyLog.studentId, dailyLog.date],
      set: {
        [field]: sql`${dailyLog[field]} + 1`,
        xp: sql`${dailyLog.xp} + ${xp}`,
      } as never,
    });
  await db
    .update(dailyLog)
    .set({ [field]: sql`${dailyLog[field]}` } as never)
    .where(and(eq(dailyLog.studentId, studentId), eq(dailyLog.date, date)))
    .catch(() => undefined);
}
