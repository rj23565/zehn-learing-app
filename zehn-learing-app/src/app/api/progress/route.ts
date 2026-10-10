import { db } from "@/db";
import { progress } from "@/db/schema";
import { awardXp, bumpDaily } from "@/server/activity";
import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const body = (await req.json()) as { lessonId?: number; score?: number };
  const lessonId = body.lessonId;
  const score = Math.max(0, Math.min(100, Math.round(body.score ?? 0)));
  if (!lessonId) return NextResponse.json({ error: "missing lessonId" }, { status: 400 });

  // upsert progress — keep the best score
  const [existing] = await db
    .select()
    .from(progress)
    .where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId)))
    .limit(1);

  if (!existing) {
    await db.insert(progress).values({ studentId, lessonId, score });
  } else if (score > existing.score) {
    await db
      .update(progress)
      .set({ score })
      .where(and(eq(progress.studentId, studentId), eq(progress.lessonId, lessonId)));
  }

  // XP: 15 base + up to 10 for a perfect quiz — awarded only on first completion,
  // but EVERY completed attempt is counted in the daily activity log.
  const amount = 15 + Math.round(score / 10);
  const res = await awardXp(studentId, "lesson", `lesson-${lessonId}`, amount);
  await bumpDaily(studentId, "lessons", res.awarded);

  return NextResponse.json({
    ok: true,
    xpAwarded: res.awarded,
    bestScore: Math.max(existing?.score ?? 0, score),
    totalXp: res.xp,
    level: res.level,
    streak: res.streak,
  });
}
