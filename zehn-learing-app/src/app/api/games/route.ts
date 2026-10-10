import { db } from "@/db";
import { gamePlays } from "@/db/schema";
import { awardXp, bumpDaily } from "@/server/activity";
import { and, eq, max } from "drizzle-orm";
import { NextResponse } from "next/server";

import { GAMES } from "@/lib/games/catalog";

const VALID = new Set<string>([...GAMES.map((g) => g.id), "tutor"]);

export async function POST(req: Request) {
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const body = (await req.json()) as { game?: string; score?: number; level?: number; xp?: number };
  // games may carry a difficulty suffix, e.g. "memory:3" — best scores are kept per difficulty
  const [base, lvlRaw] = (body.game ?? "").split(":");
  if (!VALID.has(base)) return NextResponse.json({ error: "bad game" }, { status: 400 });
  const diffNum = Math.min(3, Math.max(1, Math.round(Number(lvlRaw) || 2)));
  const game = `${base}:${diffNum}`;

  const score = Math.max(0, Math.round(body.score ?? 0));
  const level = Math.max(1, Math.min(3, Math.round(body.level ?? diffNum)));

  const [prev] = await db
    .select({ best: max(gamePlays.score) })
    .from(gamePlays)
    .where(and(eq(gamePlays.studentId, studentId), eq(gamePlays.game, game)))
    .limit(1);
  const prevBest = prev?.best ?? 0;
  const isBest = score > prevBest;

  await db.insert(gamePlays).values({ studentId, game, score, level });

  // small XP per play (clamped), unique per saved play
  const amount = Math.max(2, Math.min(20, Math.round(body.xp ?? 6)));
  const res = await awardXp(studentId, "game", `game-${crypto.randomUUID()}`, amount);
  await bumpDaily(studentId, "games", amount);

  return NextResponse.json({
    ok: true,
    best: Math.max(prevBest, score),
    previousBest: prevBest,
    isBest,
    xpAwarded: amount,
    totalXp: res.xp,
    level: res.level,
    streak: res.streak,
  });
}
