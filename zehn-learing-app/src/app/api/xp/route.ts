import { awardXp, bumpDaily } from "@/server/activity";
import { NextResponse } from "next/server";

/** Generic idempotent XP award (cartoons, plans, quests…) */
export async function POST(req: Request) {
  const studentId = req.headers.get("x-device-id");
  if (!studentId) return NextResponse.json({ error: "missing device" }, { status: 401 });

  const body = (await req.json()) as {
    reason?: string;
    refId?: string;
    amount?: number;
    daily?: "cartoons" | "diary" | "games" | "lessons";
  };
  const reason = (body.reason ?? "").slice(0, 40);
  const refId = (body.refId ?? "").slice(0, 80);
  const amount = Math.max(0, Math.min(50, Math.round(body.amount ?? 0)));
  if (!reason || !refId) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const res = await awardXp(studentId, reason, refId, amount);
  if (body.daily && (res.awarded > 0 || body.daily === "cartoons")) {
    await bumpDaily(studentId, body.daily, res.awarded);
  }

  return NextResponse.json({
    ok: true,
    xpAwarded: res.awarded,
    totalXp: res.xp,
    level: res.level,
    streak: res.streak,
  });
}
