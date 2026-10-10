import { db } from "@/db";
import { lessons, progress, students } from "@/db/schema";
import { gradeToBand, type QuizQuestion, type Slide } from "@/db/curriculum";
import { seedIfNeeded } from "@/server/seed";
import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await seedIfNeeded();
  const url = new URL(req.url);
  const deviceId = req.headers.get("x-device-id") ?? "";
  const idParam = url.searchParams.get("id");

  if (idParam) {
    const id = Number(idParam);
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
    if (!lesson) return NextResponse.json({ error: "not found" }, { status: 404 });
    let bestScore = 0;
    let completed = false;
    if (deviceId) {
      const [p] = await db
        .select()
        .from(progress)
        .where(and(eq(progress.studentId, deviceId), eq(progress.lessonId, id)))
        .limit(1);
      completed = !!p;
      bestScore = p?.score ?? 0;
    }
    return NextResponse.json({
      lesson: {
        id: lesson.id,
        band: lesson.band,
        subject: lesson.subject,
        title: lesson.title,
        icon: lesson.icon,
        color: lesson.color,
        minutes: lesson.minutes,
        intro: lesson.intro,
        slides: lesson.slides as Slide[],
        quiz: lesson.quiz as QuizQuestion[],
        completed,
        bestScore,
      },
    });
  }

  let band = url.searchParams.get("band");
  if (!band && deviceId) {
    const [s] = await db.select().from(students).where(eq(students.id, deviceId)).limit(1);
    if (s) band = gradeToBand(s.grade);
  }
  if (!band) band = "primary";

  const level = url.searchParams.get("level") ?? "all"; // all | easy | normal | hard
  const subject = url.searchParams.get("subject") ?? "all";
  const country = url.searchParams.get("country") ?? "";
  const q = (url.searchParams.get("q") ?? "").trim().toLowerCase().slice(0, 60);
  const searching = q.length > 0;

  // Country libraries and searches look across every band so nothing is hidden.
  const scope = searching || country
    ? await db.select().from(lessons).orderBy(asc(lessons.subject), asc(lessons.orderIndex))
    : await db.select().from(lessons).where(eq(lessons.band, band))
        .orderBy(asc(lessons.subject), asc(lessons.orderIndex));

  let rows = scope;
  if (country) rows = rows.filter((l) => l.country === country);
  if (searching) {
    rows = rows.filter((l) =>
      [l.title, l.subject, l.intro].some((f) => f.toLowerCase().includes(q))
    );
  }
  if (level !== "all") rows = rows.filter((l) => l.level === level);
  if (subject !== "all") rows = rows.filter((l) => l.subject === subject);

  const done = deviceId
    ? await db.select().from(progress).where(eq(progress.studentId, deviceId))
    : [];
  const doneMap = new Map(done.map((d) => [d.lessonId, d.score]));

  // facets for the UI
  const all = await db
    .select({ band: lessons.band, subject: lessons.subject, level: lessons.level })
    .from(lessons);
  const counts: Record<string, number> = {};
  const levelCounts: Record<string, number> = { all: 0, easy: 0, normal: 0, hard: 0 };
  const subjectSet = new Set<string>();
  for (const r of all) {
    counts[r.band] = (counts[r.band] ?? 0) + 1;
    if (searching || r.band === band) {
      subjectSet.add(r.subject);
      levelCounts.all += 1;
      levelCounts[r.level] = (levelCounts[r.level] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    band,
    level,
    q,
    counts,
    levelCounts,
    subjects: [...subjectSet].sort(),
    allSubjects: [...new Set(all.map((a) => a.subject))].sort(),
    lessons: rows.map((l) => ({
      id: l.id,
      band: l.band,
      subject: l.subject,
      level: l.level,
      country: l.country,
      title: l.title,
      icon: l.icon,
      color: l.color,
      minutes: l.minutes,
      intro: l.intro,
      completed: doneMap.has(l.id),
      bestScore: doneMap.get(l.id) ?? 0,
    })),
  });
}
