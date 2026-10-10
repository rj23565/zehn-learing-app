import { db } from "@/db";
import { lessons } from "@/db/schema";
import { CURRICULUM, levelOf, type LessonSeed } from "@/db/curriculum";
import { CURRICULUM_EXTRA } from "@/db/curriculum-extra";
import { PAK_SUBJECTS, countryLessons } from "@/db/curriculum-world";
import { ensureDatabase } from "@/db/seed";
import { count } from "drizzle-orm";

export const ALL_LESSONS: LessonSeed[] = [
  ...CURRICULUM,
  ...CURRICULUM_EXTRA,
  ...PAK_SUBJECTS,
  ...countryLessons(),
];

let seeded = false;

function rows() {
  return ALL_LESSONS.map((l) => ({
    band: l.band,
    subject: l.subject,
    level: levelOf(l),
    country: l.country ?? "",
    orderIndex: l.orderIndex,
    title: l.title,
    icon: l.icon,
    color: l.color,
    minutes: l.minutes,
    intro: l.intro,
    slides: l.slides,
    quiz: l.quiz,
  }));
}

export async function seedIfNeeded() {
  if (seeded) return;
  // Never let missing tables crash a request — self-heal the schema first.
  await ensureDatabase();
  try {
    const [existing] = await db.select({ c: count() }).from(lessons);
    const have = existing?.c ?? 0;
    if (have !== ALL_LESSONS.length) {
      await db.delete(lessons);
      await db.insert(lessons).values(rows());
      console.log(`[seed] catalogue rebuilt with ${ALL_LESSONS.length} lessons`);
    }
    seeded = true;
  } catch (err) {
    console.warn("[seed] skipped — database not ready yet:", (err as Error).message);
  }
}
