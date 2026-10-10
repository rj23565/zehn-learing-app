"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, BookOpenCheck, Brain, Check, Clock3, Flame,
  Gauge, Loader2, Sparkles, Sprout, Star, Target, Timer, Trophy, Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { IconByName } from "@/components/IconByName";
import { authHeaders, useApp } from "@/components/providers";
import { useTranslate } from "@/hooks/useTranslate";
import type { ProgressOverview } from "@/lib/types";

const SUBJECT_TINT: Record<string, string> = {
  violet: "from-indigo-500 to-violet-600",
  amber: "from-amber-400 to-orange-500",
  mint: "from-emerald-400 to-teal-600",
  sky: "from-sky-400 to-blue-600",
  pink: "from-pink-400 to-rose-600",
};

const DIFFICULTY = {
  easy: { key: "diff_easy", icon: Sprout, fill: "bg-emerald-500", tint: "bg-emerald-50 text-emerald-700" },
  normal: { key: "lvl_normal", icon: Zap, fill: "bg-amber-500", tint: "bg-amber-50 text-amber-700" },
  hard: { key: "diff_hard", icon: Flame, fill: "bg-rose-500", tint: "bg-rose-50 text-rose-700" },
} as const;

export default function ProgressPage() {
  const { status, profile, lang, t } = useApp();
  const router = useRouter();
  const [data, setData] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
    if (status !== "ready") return;
    setLoading(true);
    fetch("/api/progress/overview", { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("progress unavailable");
        return res.json();
      })
      .then((payload: ProgressOverview) => setData(payload))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [status, router]);

  const translatable = useMemo(() => {
    if (!data) return [];
    return [
      ...data.achievements.flatMap((item) => [item.title, item.description]),
      ...(data.recommendation ? [data.recommendation.title, data.recommendation.intro] : []),
    ];
  }, [data]);
  const { texts: translated } = useTranslate(translatable, lang);

  if (status !== "ready" || loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-cream">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!profile || !data) {
    return (
      <AppShell>
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <BarChart3 className="h-10 w-10 text-slate-300" />
          <p className="font-display text-base font-semibold text-ink">{t("pg_empty")}</p>
          <Link href="/learn" className="btn-primary mt-2">{t("nav_learn")}</Link>
        </div>
      </AppShell>
    );
  }

  const maxDay = Math.max(1, ...data.week.map((day) => day.total));
  const achievementText = (index: number, field: 0 | 1) =>
    translated[index * 2 + field] ??
    (field === 0 ? data.achievements[index].title : data.achievements[index].description);
  const recommendationOffset = data.achievements.length * 2;
  const recommendationTitle = translated[recommendationOffset] ?? data.recommendation?.title;
  const recommendationIntro = translated[recommendationOffset + 1] ?? data.recommendation?.intro;
  const subjectLabel = (subject: string) => {
    const key = `subj_${subject}`;
    const value = t(key);
    return value === key ? subject : value;
  };
  const overallRing = `conic-gradient(#4f46e5 ${data.overview.mastery * 3.6}deg, #e2e8f0 0deg)`;

  return (
    <AppShell>
      {/* Heading */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{t("pg_title")}</h1>
          <p className="mt-0.5 text-sm font-medium text-inksoft">{t("pg_sub")}</p>
        </div>
        <span className="chip shrink-0 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
          {t(`band_${data.band}`)}
        </span>
      </div>

      {/* Overall + level */}
      <section className="card relative mt-5 overflow-hidden bg-[#10152c] p-5 !ring-0 text-white">
        <div className="stage-pattern pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative grid items-center gap-5 sm:grid-cols-[auto_1fr]">
          <div className="mx-auto h-36 w-36 rounded-full p-2" style={{ background: overallRing }}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#10152c]">
              <span className="font-display text-4xl font-bold tracking-tight">{data.overview.mastery}%</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200/70">
                {t("pg_overall")}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-indigo-200/60">
                  {t("common_level")}
                </div>
                <div className="mt-0.5 font-display text-3xl font-bold">{data.level.current}</div>
              </div>
              <div className="text-right text-xs font-semibold text-indigo-200/70">
                {data.level.xp} / {data.level.nextXp} {t("common_xp")}
              </div>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400"
                initial={{ width: 0 }}
                animate={{ width: `${data.level.progress}%` }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.9 }}
              />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
                <BookOpenCheck className="h-4 w-4 text-indigo-300" />
                <div className="mt-1.5 font-display text-lg font-bold">
                  {data.overview.completedLessons}/{data.overview.totalLessons}
                </div>
                <div className="text-[10px] font-medium text-slate-400">{t("dash_lessons_done")}</div>
              </div>
              <div className="rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
                <Brain className="h-4 w-4 text-emerald-300" />
                <div className="mt-1.5 font-display text-lg font-bold">{data.overview.gamesPlayed}</div>
                <div className="text-[10px] font-medium text-slate-400">{t("dash_games_played")}</div>
              </div>
              <div className="rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
                <Clock3 className="h-4 w-4 text-amber-300" />
                <div className="mt-1.5 font-display text-lg font-bold">{data.overview.studyMinutes}</div>
                <div className="text-[10px] font-medium text-slate-400">{t("pg_minutes")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* metric cards */}
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {[
          { icon: Trophy, value: `${data.overview.averageScore}%`, key: "pg_avg", tint: "text-amber-600", bg: "bg-amber-50" },
          { icon: Timer, value: `${data.overview.studyMinutes}`, key: "pg_time", tint: "text-indigo-600", bg: "bg-indigo-50" },
          { icon: Gauge, value: `${data.overview.consistency}%`, key: "pg_consistency", tint: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((item) => (
          <div key={item.key} className="card p-3.5">
            <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${item.bg} ${item.tint}`}>
              <item.icon className="h-4 w-4" />
            </span>
            <div className={`mt-2 font-display text-xl font-bold ${item.tint}`}>{item.value}</div>
            <div className="mt-0.5 text-[10px] font-semibold leading-tight text-inksoft">{t(item.key)}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <section className="card mt-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 font-display text-base font-bold text-ink">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-600" /> {t("pg_week")}
          </h2>
          <span className="text-xs font-semibold text-inksoft">
            {data.weekGoal.current}/{data.weekGoal.target} {t("pg_actions")}
          </span>
        </div>
        <div className="mt-5 flex h-32 items-end gap-2.5">
          {data.week.map((day, index) => {
            const height = day.total ? Math.max(14, (day.total / maxDay) * 100) : 5;
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                <div className="relative flex h-24 w-full items-end justify-center overflow-hidden rounded-xl bg-slate-100/80">
                  <motion.div
                    className={`w-full rounded-xl ${index === 6 ? "bg-gradient-to-t from-indigo-600 to-violet-400" : "bg-gradient-to-t from-slate-400 to-slate-300"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.06, type: "spring", bounce: 0.18 }}
                  />
                  {day.total > 0 && (
                    <span className="absolute top-1.5 text-[9px] font-bold text-slate-500">{day.total}</span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${index === 6 ? "text-indigo-600" : "text-inksoft"}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="h-4.5 w-4.5" />
          </span>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-ink">
              <span>{t("pg_week_goal")}</span>
              <span>{data.weekGoal.progress}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${data.weekGoal.progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Difficulty path */}
      <section className="mt-6">
        <h2 className="font-display text-base font-bold text-ink">{t("pg_difficulty")}</h2>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
          {data.difficulties.map((item) => {
            const meta = DIFFICULTY[item.level];
            return (
              <div key={item.level} className="card p-4">
                <div className="flex items-center justify-between">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${meta.tint}`}>
                    <meta.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-display text-lg font-bold text-ink">{item.mastery}%</span>
                </div>
                <div className="mt-3 flex justify-between text-xs font-semibold text-ink">
                  <span>{t(meta.key)}</span>
                  <span className="text-inksoft">{item.completed}/{item.total}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div className={`h-full rounded-full ${meta.fill}`}
                    initial={{ width: 0 }} animate={{ width: `${item.mastery}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Subject mastery */}
      <section className="mt-6">
        <h2 className="font-display text-base font-bold text-ink">{t("pg_subjects")}</h2>
        <div className="mt-2.5 space-y-2.5">
          {data.subjects.map((item) => (
            <div key={item.subject} className="card flex items-center gap-3.5 p-4">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${SUBJECT_TINT[item.color] ?? SUBJECT_TINT.violet}`}>
                <IconByName name={item.icon} className="h-5.5 w-5.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-display text-sm font-semibold text-ink">{subjectLabel(item.subject)}</span>
                  <span className="text-xs font-semibold text-inksoft">{item.completed}/{item.total}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    initial={{ width: 0 }} animate={{ width: `${item.mastery}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[10px] font-medium text-inksoft">
                  <span>{item.mastery}% {t("pg_complete")}</span>
                  <span>{t("pg_avg")}: {item.averageScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths and focus */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        <div className="card p-4">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Star className="h-4 w-4 fill-amber-300 text-amber-400" /> {t("pg_strengths")}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.strengths.length ? data.strengths.map((subject) => (
              <span key={subject} className="chip bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Check className="h-3 w-3" /> {subjectLabel(subject)}
              </span>
            )) : <span className="text-xs font-medium text-inksoft">{t("pg_keep_going")}</span>}
          </div>
        </div>
        <div className="card p-4">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold text-ink">
            <Target className="h-4 w-4 text-indigo-500" /> {t("pg_focus")}
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.focusAreas.map((subject) => (
              <Link key={subject} href={`/learn?q=${encodeURIComponent(subject)}`}
                className="chip bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                {subjectLabel(subject)} <ArrowRight className="h-3 w-3" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      {data.recommendation && (
        <section className="card group relative mt-4 overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-5 !ring-0 text-white">
          <div className="stage-pattern pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-indigo-100 ring-1 ring-white/10 backdrop-blur">
              <IconByName name={data.recommendation.icon} className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-200">{t("pg_next")}</div>
              <h3 className="mt-0.5 truncate font-display text-base font-bold">{recommendationTitle}</h3>
              <p className="mt-0.5 line-clamp-1 text-xs font-medium text-indigo-200/80">{recommendationIntro}</p>
            </div>
            <Link href={`/learn/${data.recommendation.id}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg transition group-hover:scale-110"
              aria-label={t("pg_start")}>
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">{t("pg_achievements")}</h2>
          <span className="text-xs font-semibold text-inksoft">
            {data.achievements.filter((item) => item.unlocked).length}/{data.achievements.length} {t("pg_unlocked")}
          </span>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {data.achievements.map((item, index) => (
            <div key={item.id}
              className={`card relative overflow-hidden p-4 ${item.unlocked ? "" : "grayscale opacity-55"}`}>
              {item.unlocked && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />}
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${item.unlocked ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-400"}`}>
                <IconByName name={item.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-2.5 font-display text-xs font-bold text-ink">{achievementText(index, 0)}</h3>
              <p className="mt-1 min-h-8 text-[10px] font-medium leading-snug text-inksoft">{achievementText(index, 1)}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${item.unlocked ? "bg-amber-400" : "bg-slate-300"}`}
                  style={{ width: `${Math.min(100, (item.current / Math.max(1, item.target)) * 100)}%` }} />
              </div>
              <div className="mt-1 text-right text-[9px] font-semibold text-inksoft">{item.current}/{item.target}</div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
