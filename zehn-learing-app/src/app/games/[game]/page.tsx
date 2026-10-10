"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/components/providers";
import { GameRunner } from "@/components/games/GameRunner";
import { gameById } from "@/lib/games/catalog";

export default function GamePage() {
  const params = useParams<{ game: string }>();
  const router = useRouter();
  const { status } = useApp();
  const game = gameById(params.game);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
    else if (status === "ready" && !game) router.replace("/games");
  }, [status, game, router]);

  if (!game) return null;
  return <GameRunner gameId={params.game} />;
}
