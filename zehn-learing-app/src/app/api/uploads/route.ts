import { db } from "@/db";
import { lessons, students, uploads } from "@/db/schema";
import { gradeToBand } from "@/db/curriculum";
import { seedIfNeeded } from "@/server/seed";
import { awardXp, bumpDaily } from "@/server/activity";
import type { PlanStep } from "@/lib/types";
import { and, asc, desc, eq, like } from "drizzle-orm";
import { NextResponse } from "next/server";

const SUBJECT_GAME: Record<string, string> = {
  Math: "math-sprint",
  Physics: "math-sprint",
  Science: "science-lab",
  English: "word-builder",
  History: "logic-riddle",
  Story: "word-builder",
  Geography: "habitat-sort",
  Computer: "shape-pattern",
  Art: "shape-pattern",
  Music: "simon-sequence",
  Urdu: "word-builder",
  Islamiat: "opposites",
  PakStudies: "logic-riddle",
  WorldHistory: "logic-riddle",
};

const PLAN_TEMPLATES: PlanStep[] = [
  { icon: "ScanText", text: "Look at your photo and read the topic aloud (tap the narrator).", },
  { icon: "MonitorPlay", text: "Watch the matching animated lesson with voice." },
  { icon: "Brain", text: "Play one brain-gym game to lock it into memory." },
  { icon: "FileQuestion", text: "Write 3 questions this page answers — then quiz yourself." },
  { icon: "CalendarCheck", text: "Revise this plan tomorrow to grow your streak." },
];

const GUIDING: Record<string, string[]> = {
  Math: [
    "What rule or formula does this page use — and why does it work?",
    "Invent one harder version of the toughest problem here and solve it.",
    "Where could you use this exact idea in real life today?",
  ],
  Science: [
    "What is the cause-and-effect chain on this page?",
    "What safe mini-experiment could prove this idea at home?",
    "Explain this page to a 5-year-old in three sentences.",
  ],
  English: [
    "Pick three new words from this page and write your own sentence with each.",
    "Capture the main idea in one single sentence.",
    "Retell the page from a different point of view.",
  ],
  History: [
    "Which date, person and place matter most here — defend your choice.",
    "What caused this event, and what changed right after it?",
    "If you were the main character, what would you have done differently?",
  ],
  Story: [
    "Was the main character's big choice wise? Argue both sides.",
    "Predict the next page in one line.",
    "What lesson does this story quietly teach?",
  ],
  Geography: [
    "Sketch a tiny map from memory of what this page describes.",
    "Which place from this page would you visit and why?",
    "How does this region's climate shape life there?",
  ],
};

async function buildPlan(studentId: string, subject: string, topic: string): Promise<PlanStep[]> {
  // find a matching lesson for their grade band if possible
  const plan = PLAN_TEMPLATES.map((s) => ({ ...s }));
  if (topic) {
    plan[0].text = `Read your page about "${topic}" aloud (tap the narrator to hear it).`;
  }
  const gs = GUIDING[subject] ?? GUIDING.Story;
  const scope = topic ? ` about ${topic}` : " from this page";
  plan[3].text = `Answer 3 guiding questions${scope}: ① ${gs[0]} ② ${gs[1]} ③ ${gs[2]}`;
  try {
    const [student] = await db
      .select({ grade: students.grade })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);
    const band = gradeToBand(student?.grade ?? 1);
    const match = await db
      .select({ id: lessons.id })
      .from(lessons)
      .where(and(eq(lessons.band, band), like(lessons.subject, `${subject}%`)))
      .orderBy(asc(lessons.orderIndex))
      .limit(1);
    const fallback = match.length
      ? match
      : await db
          .select({ id: lessons.id })
          .from(lessons)
          .where(eq(lessons.band, band))
          .orderBy(asc(lessons.orderIndex))
          .limit(1);
    if (fallback[0]) plan[1].lessonId = fallback[0].id;
  } catch {
    /* plan still works without lesson link */
  }
  plan[2].game = SUBJECT_GAME[subject] ?? "memory";
  return plan;
}

export async function GET(req: Request) {
  await seedIfNeeded();
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const rows = await db
    .select()
    .from(uploads)
    .where(eq(uploads.studentId, studentId))
    .orderBy(desc(uploads.createdAt))
    .limit(40);

  return NextResponse.json({
    uploads: rows.map((u) => ({
      id: u.id,
      kind: u.kind,
      subject: u.subject,
      imageData: u.imageData,
      plan: u.plan as PlanStep[],
      doneSteps: (u.doneSteps as number[]) ?? [],
      createdAt: u.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: Request) {
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const body = (await req.json()) as {
    kind?: string;
    subject?: string;
    topic?: string;
    imageData?: string;
  };
  const kind = ["diary", "book", "page", "art"].includes(body.kind ?? "") ? body.kind! : "diary";
  const subject = (body.subject ?? "General").replace(/[<>]/g, "").slice(0, 30) || "General";
  const topic = (body.topic ?? "").replace(/[<>"]/g, "").trim().slice(0, 80);
  const imageData = (body.imageData ?? "").slice(0, 3_000_000);
  if (!imageData.startsWith("data:image")) {
    return NextResponse.json({ error: "bad image" }, { status: 400 });
  }

  // artwork is stored for the gallery and needs no study plan
  const plan = kind === "art" ? [] : await buildPlan(studentId, subject, topic);
  const [row] = await db
    .insert(uploads)
    .values({ studentId, kind, subject, imageData, plan, doneSteps: [] })
    .returning({ id: uploads.id });

  const res = await awardXp(studentId, "upload", `upload-${row.id}`, 8);
  await bumpDaily(studentId, "diary", res.awarded);

  return NextResponse.json({ ok: true, id: row.id, plan, xpAwarded: res.awarded });
}

export async function PATCH(req: Request) {
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const body = (await req.json()) as { id?: number; step?: number };
  if (!body.id || typeof body.step !== "number")
    return NextResponse.json({ error: "bad request" }, { status: 400 });

  const [row] = await db
    .select()
    .from(uploads)
    .where(and(eq(uploads.id, body.id), eq(uploads.studentId, studentId)))
    .limit(1);
  if (!row) return NextResponse.json({ error: "not found" }, { status: 404 });

  const plan = row.plan as PlanStep[];
  let done = new Set((row.doneSteps as number[]) ?? []);
  if (done.has(body.step)) done.delete(body.step);
  else done.add(body.step);
  done = new Set([...done].filter((s) => s >= 0 && s < plan.length));

  await db.update(uploads).set({ doneSteps: [...done] }).where(eq(uploads.id, row.id));

  const allDone = done.size === plan.length;
  let xpAwarded = 0;
  if (allDone) {
    const res = await awardXp(studentId, "plan", `plan-${row.id}`, 15);
    xpAwarded = res.awarded;
  }
  return NextResponse.json({ ok: true, doneSteps: [...done], allDone, xpAwarded });
}
