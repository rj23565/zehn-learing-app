import { db } from "@/db";
import { dailyLog, gamePlays, lessons, progress, students, uploads } from "@/db/schema";
import { gradeToBand } from "@/db/curriculum";
import { seedIfNeeded } from "@/server/seed";
import { ensureDatabase } from "@/db/seed";
import { todayStr, touchStreak } from "@/server/activity";
import { levelForXp } from "@/lib/types";
import { and, asc, count, eq, max } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const started = performance.now();
  await ensureDatabase();
  await seedIfNeeded();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const [initial] = await db.select().from(students).where(eq(students.id, id)).limit(1);
  if (!initial) {
    return NextResponse.json(
      { profile: null, stats: null },
      { headers: { "Cache-Control": "no-store", "Server-Timing": `total;dur=${Math.round(performance.now() - started)}` } }
    );
  }

  await touchStreak(id);
  const band = gradeToBand(initial.grade);

  // These queries do not depend on one another. Parallel execution removes
  // 6–8 sequential database round trips from every app refresh.
  const [
    [lessonsDoneRow], [gamesRow], [uploadsRow], best, [todayRow],
    bandLessons, done, [fresh],
  ] = await Promise.all([
    db.select({ c: count() }).from(progress).where(eq(progress.studentId, id)),
    db.select({ c: count() }).from(gamePlays).where(eq(gamePlays.studentId, id)),
    db.select({ c: count() }).from(uploads).where(eq(uploads.studentId, id)),
    db.select({ game: gamePlays.game, best: max(gamePlays.score) })
      .from(gamePlays).where(eq(gamePlays.studentId, id)).groupBy(gamePlays.game),
    db.select().from(dailyLog)
      .where(and(eq(dailyLog.studentId, id), eq(dailyLog.date, todayStr()))).limit(1),
    db.select({ id: lessons.id }).from(lessons)
      .where(eq(lessons.band, band)).orderBy(asc(lessons.subject), asc(lessons.orderIndex)),
    db.select({ lessonId: progress.lessonId }).from(progress).where(eq(progress.studentId, id)),
    db.select().from(students).where(eq(students.id, id)).limit(1),
  ]);

  const bestScores: Record<string, number> = {};
  for (const item of best) bestScores[item.game] = item.best ?? 0;
  const doneSet = new Set(done.map((item) => item.lessonId));
  const nextLessonId = bandLessons.find((lesson) => !doneSet.has(lesson.id))?.id ?? null;
  const student = fresh ?? initial;

  return NextResponse.json(
    {
      profile: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        language: student.language,
        avatar: student.avatar,
        xp: student.xp,
        level: levelForXp(student.xp),
        streak: student.streak,
        createdAt: student.createdAt.toISOString(),
      },
      stats: {
        lessonsDone: lessonsDoneRow?.c ?? 0,
        gamesPlayed: gamesRow?.c ?? 0,
        uploads: uploadsRow?.c ?? 0,
        bestScores,
        today: {
          lessons: todayRow?.lessons ?? 0,
          games: todayRow?.games ?? 0,
          diary: todayRow?.diary ?? 0,
          cartoons: todayRow?.cartoons ?? 0,
          xp: todayRow?.xp ?? 0,
        },
        nextLessonId,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
        "Server-Timing": `total;dur=${Math.round(performance.now() - started)}`,
      },
    }
  );
}

export async function POST(req: Request) {
  // Onboarding writes must succeed even on a freshly-reset database —
  // otherwise the learner loops at /onboarding forever.
  await ensureDatabase();
  const body = (await req.json()) as {
    id?: string; name?: string; grade?: number; avatar?: string; language?: string;
  };
  if (!body.id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  const grade = Math.max(0, Math.min(12, body.grade ?? 0));
  await db.insert(students).values({
    id: body.id,
    name: (body.name ?? "Learner").slice(0, 40),
    grade,
    avatar: body.avatar ?? "owl",
    language: body.language ?? "en",
    lastActiveDate: todayStr(),
    streak: 1,
  }).onConflictDoUpdate({
    target: students.id,
    set: {
      name: (body.name ?? "Learner").slice(0, 40),
      grade,
      avatar: body.avatar ?? "owl",
      language: body.language ?? "en",
    },
  });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const id = req.headers.get("x-device-id");
  if (!id) return NextResponse.json({ error: "missing device" }, { status: 401 });
  const body = (await req.json()) as Partial<{
    name: string; grade: number; language: string; avatar: string;
  }>;
  const set: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) set.name = body.name.trim().slice(0, 40);
  if (typeof body.grade === "number") set.grade = Math.max(0, Math.min(12, Math.round(body.grade)));
  if (typeof body.language === "string") set.language = body.language;
  if (typeof body.avatar === "string") set.avatar = body.avatar;
  if (Object.keys(set).length) await db.update(students).set(set).where(eq(students.id, id));
  return NextResponse.json({ ok: true });
}
