import { db } from "@/db";
import { translations } from "@/db/schema";
import { createHash } from "node:crypto";
import { inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

const hash = (target: string, text: string) =>
  createHash("sha256").update(`en::${target}::${text}`).digest("hex");

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'");
}

/** One fast best-effort external request. Never blocks longer than 3.2s. */
async function externalTranslate(text: string, target: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(text.slice(0, 480));
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${q}&langpair=en|${target}`,
      { signal: AbortSignal.timeout(3200), cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { responseData?: { translatedText?: string } };
    const translated = data.responseData?.translatedText;
    if (!translated || translated.toUpperCase().includes("QUERY LENGTH LIMIT")) return null;
    return decodeEntities(translated);
  } catch {
    return null;
  }
}

/** Small concurrency pool: fast, but does not overwhelm the free translator. */
async function mapLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

export async function POST(req: Request) {
  const body = (await req.json()) as { texts?: string[]; target?: string };
  const target = (body.target ?? "en").slice(0, 5);
  const texts = (body.texts ?? []).slice(0, 40).map((t) => String(t).slice(0, 600));

  if (target === "en" || texts.length === 0) {
    return NextResponse.json({ results: texts }, { headers: { "Cache-Control": "private, max-age=86400" } });
  }

  const hashes = texts.map((t) => hash(target, t));
  let cachedRows: { hash: string; result: string }[] = [];
  try {
    cachedRows = await db
      .select({ hash: translations.hash, result: translations.result })
      .from(translations)
      .where(inArray(translations.hash, hashes));
  } catch {
    cachedRows = [];
  }
  const cacheMap = new Map(cachedRows.map((row) => [row.hash, row.result]));

  const missingIndexes = texts
    .map((_, index) => index)
    .filter((index) => !cacheMap.has(hashes[index]));

  // Previously these ran serially (up to 40 × 8 seconds). Now 6 run in
  // parallel with a 3.2-second ceiling, reducing worst-case latency sharply.
  const translatedMissing = await mapLimit(missingIndexes, 6, async (index) => ({
    index,
    result: await externalTranslate(texts[index], target),
  }));

  const writes: { hash: string; source: string; target: string; input: string; result: string }[] = [];
  for (const item of translatedMissing) {
    if (!item.result) continue; // do not cache network failures as translations
    cacheMap.set(hashes[item.index], item.result);
    writes.push({
      hash: hashes[item.index], source: "en", target,
      input: texts[item.index], result: item.result,
    });
  }

  // One bulk write instead of one write per string; do not delay the response.
  if (writes.length) {
    void db.insert(translations).values(writes).onConflictDoNothing().catch(() => undefined);
  }

  return NextResponse.json(
    { results: texts.map((text, index) => cacheMap.get(hashes[index]) ?? text) },
    { headers: { "Cache-Control": "private, max-age=86400, stale-while-revalidate=604800" } }
  );
}
