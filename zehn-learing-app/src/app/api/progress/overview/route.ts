import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  dailyLog,
  gamePlays,
  lessons,
  progress,
  students,
  uploads,
} from "@/db/schema";
import { gradeToBand } from "@/db/curriculum";
import { levelForXp, xpForLevel, type ProgressOverview } from "@/lib/types";
import { seedIfNeeded } from "@/server/seed";
import { touchStreak } from "@/server/activity";

const DAY_MS = 86_400_000;

function utcDate(offset = 0) {
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + offset);
  return d;
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET(req: Request) {
  await seedIfNeeded();
  const studentId = req.headers.get("x-device-id");
  if (!studentId) {
    return NextResponse.json({ error: "missing device" }, { status: 401 });
  }

  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);
  if (!student) {
    return NextResponse.json({ error: "student not found" }, { status: 404 });
  }

  await touchStreak(studentId);
  const band = gradeToBand(student.grade);

  const [catalogue, completions, games, plans, logs] = await Promise.all([
    db.select().from(lessons).where(eq(lessons.band, band)).orderBy(asc(lessons.orderIndex)),
    db.select().from(progress).where(eq(progress.studentId, studentId)).orderBy(desc(progress.completedAt)),
    db.select().from(gamePlays).where(eq(gamePlays.studentId, studentId)).orderBy(desc(gamePlays.playedAt)),
    db.select().from(uploads).where(eq(uploads.studentId, studentId)).orderBy(desc(uploads.createdAt)),
    db.select().from(dailyLog).where(eq(dailyLog.studentId, studentId)).orderBy(desc(dailyLog.date)).limit(30),
  ]);

  const lessonById = new Map(catalogue.map((lesson) => [lesson.id, lesson]));
  const bandCompletions = completions.filter((item) => lessonById.has(item.lessonId));
  const completionByLesson = new Map(bandCompletions.map((item) => [item.lessonId, item]));

  const subjects = [...new Set(catalogue.map((lesson) => lesson.subject))]
    .map((subject) => {
      const subjectLessons = catalogue.filter((lesson) => lesson.subject === subject);
      const done = subjectLessons
        .map((lesson) => completionByLesson.get(lesson.id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
      const completed = done.length;
      const averageScore = completed
        ? Math.round(done.reduce((sum, item) => sum + item.score, 0) / completed)
        : 0;
      return {
        subject,
        icon: subjectLessons[0]?.icon ?? "BookOpen",
        color: subjectLessons[0]?.color ?? "violet",
        total: subjectLessons.length,
        completed,
        averageScore,
        mastery: subjectLessons.length
          ? Math.round((completed / subjectLessons.length) * 100)
          : 0,
      };
    })
    .sort((a, b) => b.mastery - a.mastery || b.averageScore - a.averageScore);

  const difficulties = (["easy", "normal", "hard"] as const).map((level) => {
    const levelLessons = catalogue.filter((lesson) => lesson.level === level);
    const completed = levelLessons.filter((lesson) => completionByLesson.has(lesson.id)).length;
    return {
      level,
      total: levelLessons.length,
      completed,
      mastery: levelLessons.length ? Math.round((completed / levelLessons.length) * 100) : 0,
    };
  });

  const logByDate = new Map(logs.map((log) => [log.date, log]));
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = utcDate(index - 6);
    const key = dateKey(date);
    const log = logByDate.get(key);
    const lessonsCount = log?.lessons ?? 0;
    const gamesCount = log?.games ?? 0;
    const diaryCount = log?.diary ?? 0;
    const cartoonsCount = log?.cartoons ?? 0;
    return {
      date: key,
      label: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }).slice(0, 2),
      lessons: lessonsCount,
      games: gamesCount,
      diary: diaryCount,
      cartoons: cartoonsCount,
      xp: log?.xp ?? 0,
      total: lessonsCount + gamesCount + diaryCount + cartoonsCount,
    };
  });

  const completedLessons = bandCompletions.length;
  const averageScore = completedLessons
    ? Math.round(bandCompletions.reduce((sum, item) => sum + item.score, 0) / completedLessons)
    : 0;
  const lessonMinutes = bandCompletions.reduce(
    (sum, item) => sum + (lessonById.get(item.lessonId)?.minutes ?? 0),
    0
  );
  const studyMinutes = lessonMinutes + games.length * 2 + plans.length * 3;
  const activeDays = logs.filter((log) =>
    log.lessons + log.games + log.diary + log.cartoons > 0
  ).length;
  const weeklyActiveDays = week.filter((day) => day.total > 0).length;
  const weeklyActions = week.reduce((sum, day) => sum + day.total, 0);
  const weekTarget = 12;

  const currentLevel = levelForXp(student.xp);
  const floorXp = xpForLevel(currentLevel);
  const nextXp = xpForLevel(currentLevel + 1);
  const xpProgress = Math.min(
    100,
    Math.round(((student.xp - floorXp) / Math.max(1, nextXp - floorXp)) * 100)
  );

  const perfectScores = bandCompletions.filter((item) => item.score >= 100).length;
  const achievements = [
    {
      id: "first-lesson",
      title: "First step",
      description: "Complete your first lesson",
      icon: "Footprints",
      unlocked: completedLessons >= 1,
      current: Math.min(completedLessons, 1),
      target: 1,
    },
    {
      id: "five-lessons",
      title: "Knowledge builder",
      description: "Complete 5 lessons",
      icon: "BookOpenCheck",
      unlocked: completedLessons >= 5,
      current: Math.min(completedLessons, 5),
      target: 5,
    },
    {
      id: "brain-trainer",
      title: "Brain trainer",
      description: "Play 10 brain games",
      icon: "Brain",
      unlocked: games.length >= 10,
      current: Math.min(games.length, 10),
      target: 10,
    },
    {
      id: "perfect-score",
      title: "Perfect recall",
      description: "Score 100% on a lesson quiz",
      icon: "BadgeCheck",
      unlocked: perfectScores >= 1,
      current: Math.min(perfectScores, 1),
      target: 1,
    },
    {
      id: "planner",
      title: "Smart planner",
      description: "Create 3 book or diary plans",
      icon: "CalendarCheck",
      unlocked: plans.length >= 3,
      current: Math.min(plans.length, 3),
      target: 3,
    },
    {
      id: "streak-seven",
      title: "Consistent learner",
      description: "Build a 7-day streak",
      icon: "Flame",
      unlocked: student.streak >= 7,
      current: Math.min(student.streak, 7),
      target: 7,
    },
  ];

  const strengths = subjects
    .filter((item) => item.completed > 0 && (item.averageScore >= 75 || item.mastery >= 60))
    .slice(0, 3)
    .map((item) => item.subject);
  const focusAreas = subjects
    .filter((item) => item.completed < item.total)
    .sort((a, b) => a.mastery - b.mastery || a.averageScore - b.averageScore)
    .slice(0, 3)
    .map((item) => item.subject);

  const recommendationLesson =
    catalogue.find((lesson) => !completionByLesson.has(lesson.id) && lesson.level === "easy") ??
    catalogue.find((lesson) => !completionByLesson.has(lesson.id) && lesson.level === "normal") ??
    catalogue.find((lesson) => !completionByLesson.has(lesson.id)) ??
    null;

  const recommendation = recommendationLesson
    ? {
        id: recommendationLesson.id,
        band: recommendationLesson.band,
        subject: recommendationLesson.subject,
        level: recommendationLesson.level,
        title: recommendationLesson.title,
        icon: recommendationLesson.icon,
        color: recommendationLesson.color,
        minutes: recommendationLesson.minutes,
        intro: recommendationLesson.intro,
        completed: false,
        bestScore: 0,
      }
    : null;

  const response: ProgressOverview = {
    band,
    overview: {
      totalLessons: catalogue.length,
      completedLessons,
      mastery: catalogue.length ? Math.round((completedLessons / catalogue.length) * 100) : 0,
      averageScore,
      studyMinutes,
      gamesPlayed: games.length,
      plansCreated: plans.length,
      activeDays,
      consistency: Math.round((weeklyActiveDays / 7) * 100),
    },
    level: {
      current: currentLevel,
      xp: student.xp,
      floorXp,
      nextXp,
      progress: xpProgress,
    },
    week,
    weekGoal: {
      current: weeklyActions,
      target: weekTarget,
      progress: Math.min(100, Math.round((weeklyActions / weekTarget) * 100)),
    },
    subjects,
    difficulties,
    achievements,
    strengths,
    focusAreas,
    recommendation,
  };

  return NextResponse.json(response);
}
