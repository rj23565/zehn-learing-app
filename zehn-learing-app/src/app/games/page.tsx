"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles, Trophy, Volume2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { useTranslate } from "@/hooks/useTranslate";
import { GAMES, levelForGrade } from "@/lib/games/catalog";

export default function GamesHub() {
  const { status, profile, stats, lang, t } = useApp();
  const router = useRouter();
  const voice = useVoice();
  const myGrade = profile?.grade ?? 1;
  const [classFilter, setClassFilter] = useState<number | "all">(myGrade);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  useEffect(() => {
    if (profile) setClassFilter(profile.grade);
  }, [profile]);

  const list = useMemo(() => {
    if (classFilter === "all") return GAMES;
    return GAMES.filter((g) => classFilter >= g.minGrade && classFilter <= g.maxGrade);
  }, [classFilter]);

  const { texts: tr } = useTranslate(list.flatMap((g) => [g.title, g.desc, g.skill]), lang);
  const scores = stats?.bestScores ?? {};
  const bestFor = (id: string) =>
    Math.max(0, ...[1, 2, 3].map((l) => scores[`${id}:${l}`] ?? 0));

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            <Brain className="h-5.5 w-5.5 text-indigo-600" /> {t("gm_title")}
          </h1>
          <p className="mt-0.5 text-xs font-medium text-inksoft sm:text-sm">{t("gm_sub")}</p>
        </div>
        <button onClick={voice.toggle}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition ${
            voice.enabled ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-400 ring-slate-200"
          }`}
          aria-label={t("voice_guide")}>
          <Volume2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* class picker */}
      <div className="mt-4">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-inksoft">
          {t("gm_pick_class")}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => setClassFilter("all")}
            className={`chip shrink-0 px-3 py-1.5 transition ${
              classFilter === "all" ? "bg-slate-900 text-white" : "bg-white text-ink ring-1 ring-slate-200"
            }`}>
            {t("gm_all_classes")}
          </button>
          {Array.from({ length: 13 }, (_, i) => i).map((g) => (
            <button key={g} onClick={() => setClassFilter(g)}
              className={`chip shrink-0 px-3 py-1.5 transition ${
                classFilter === g ? "bg-indigo-600 text-white" : "bg-white text-ink ring-1 ring-slate-200"
              }`}>
              {g === 0 ? t("ob_kg") : t("ob_class", { n: g })}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="chip bg-slate-100 text-slate-600">{list.length} {t("gm_all_games")}</span>
        <span className="chip bg-indigo-50 text-indigo-700">
          <Sparkles className="h-3 w-3" /> {t("common_level")} {levelForGrade(typeof classFilter === "number" ? classFilter : myGrade)}
        </span>
      </div>

      {/* grid */}
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {list.map((g, i) => {
          const best = bestFor(g.id);
          return (
            <motion.div key={g.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4), type: "spring", bounce: 0.3 }}>
              <Link href={`/games/${g.id}`}
                className="card group flex h-full flex-col p-3.5 transition hover:-translate-y-1 hover:ring-indigo-200">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${g.tint} shadow-sm`}>
                  {g.emoji}
                </span>
                <h3 className="mt-2.5 font-display text-[13px] font-bold leading-tight text-ink">
                  {tr[i * 3] ?? g.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[10.5px] font-medium leading-snug text-inksoft">
                  {tr[i * 3 + 1] ?? g.desc}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
                  <span className="chip bg-slate-100 !px-2 !py-0.5 text-[9px] text-slate-600">
                    {tr[i * 3 + 2] ?? g.skill}
                  </span>
                  {best > 0 && (
                    <span className="chip bg-amber-50 !px-2 !py-0.5 text-[9px] text-amber-700">
                      <Trophy className="h-2.5 w-2.5" /> {best}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
