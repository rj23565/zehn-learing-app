"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, BarChart3, BookOpenCheck, Brain, Camera, Check, CheckCircle2,
  ChevronRight, CloudCheck, Gamepad2, Palette, Play, Timer,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { Avatar } from "@/components/Avatar";
import { IconByName } from "@/components/IconByName";
import { gradeToBand } from "@/db/curriculum";
import type { LessonListItem } from "@/lib/types";
import { sfx } from "@/lib/sounds";

const SUBJ_TINT: Record<string, string> = {
  Math: "bg-violet-100 text-violet-600",
  Science: "bg-emerald-100 text-emerald-600",
  English: "bg-sky-100 text-sky-600",
  Physics: "bg-amber-100 text-amber-600",
  Numbers: "bg-amber-100 text-amber-600",
  "Colors & Shapes": "bg-pink-100 text-pink-600",
  "ABC Letters": "bg-sky-100 text-sky-600",
  Animals: "bg-emerald-100 text-emerald-600",
};

export default function Dashboard() {
  const { status, profile, stats, t } = useApp();
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonListItem[]>([]);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  useEffect(() => {
    if (status !== "ready") return;
    fetch("/api/lessons", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setLessons(d.lessons ?? []))
      .catch(() => undefined);
  }, [status]);

  if (status !== "ready" || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-10 w-10 rounded-full border-4 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  const bandKey = `band_${gradeToBand(profile.grade)}`;
  const subjects = [...new Set(lessons.map((l) => l.subject))];
  const nextLesson =
    lessons.find((l) => l.id === stats?.nextLessonId) ?? lessons.find((l) => !l.completed);
  const completedInBand = lessons.filter((lesson) => lesson.completed).length;
  const mastery = lessons.length ? Math.round((completedInBand / lessons.length) * 100) : 0;

  const quests = [
    { key: "q_lesson", done: (stats?.today.lessons ?? 0) >= 1, cur: Math.min(1, stats?.today.lessons ?? 0), max: 1 },
    { key: "q_game", done: (stats?.today.games ?? 0) >= 2, cur: Math.min(2, stats?.today.games ?? 0), max: 2 },
    { key: "q_diary", done: (stats?.today.diary ?? 0) >= 1, cur: Math.min(1, stats?.today.diary ?? 0), max: 1 },
  ];

  return (
    <AppShell>
      {/* greeting */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar id={profile.avatar} size={52} />
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink">
              {t("dash_hi", { name: profile.name })}
            </h1>
            <p className="text-sm font-semibold text-inksoft">{t("dash_sub")}</p>
          </div>
        </div>
        <span className="chip hidden bg-emerald-100 text-emerald-700 sm:flex">
          <CloudCheck className="h-3.5 w-3.5" /> {t("dash_sync")}
        </span>
      </div>

      {/* stats row */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {[
          { v: profile.streak, k: "dash_streak", tint: "text-orange-500" },
          { v: stats?.lessonsDone ?? 0, k: "dash_lessons_done", tint: "text-violet-600" },
          { v: stats?.gamesPlayed ?? 0, k: "dash_games_played", tint: "text-emerald-600" },
        ].map((s) => (
          <div key={s.k} className="card p-4 text-center">
            <div className={`font-display text-2xl font-extrabold ${s.tint}`}>{s.v}</div>
            <div className="text-[11px] font-bold uppercase tracking-wide text-inksoft">{t(s.k)}</div>
          </div>
        ))}
      </div>

      {/* progress preview */}
      <Link href="/progress" className="card group mt-4 flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:ring-indigo-200">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <BarChart3 className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm font-bold text-ink">{t("pg_title")}</span>
            <span className="font-display text-sm font-bold text-indigo-600">{mastery}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${mastery}%` }}
              transition={{ type: "spring", bounce: 0.15 }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-inksoft">
            <span>{completedInBand}/{lessons.length} {t("dash_lessons_done")}</span>
            <span>{t("pg_consistency")}</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
      </Link>

      {/* quests */}
      <div className="card mt-4 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
          <BookOpenCheck className="h-5 w-5 text-violet-600" />
          {t("dash_quests")}
        </h2>
        <div className="mt-3 space-y-2.5">
          {quests.map((q) => (
            <div key={q.key} className="flex items-center gap-3">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                q.done ? "bg-emerald-500 text-white" : "bg-violet-100 text-violet-400"
              }`}>
                <Check className="h-4 w-4" strokeWidth={3} />
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm font-bold text-ink">
                  <span>{t(q.key)}</span>
                  <span className="text-xs font-bold text-inksoft">{q.cur}/{q.max}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-violet-100">
                  <motion.div
                    className={`h-full rounded-full ${q.done ? "bg-emerald-400" : "bg-violet-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(q.cur / q.max) * 100}%` }}
                    transition={{ type: "spring", bounce: 0.2 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* up next */}
      {nextLesson && (
        <Link href={`/learn/${nextLesson.id}`} onClick={() => sfx.whoosh()}
          className="card group relative mt-4 block overflow-hidden bg-[#221746] p-5 !ring-0">
          <div className="stage-pattern absolute inset-0 opacity-30" />
          <div className="relative flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/10 text-sky-300 backdrop-blur-sm">
              <IconByName name={nextLesson.icon} className="h-8 w-8" strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold uppercase tracking-widest text-violet-300/80">
                {t("dash_upnext")} · {t(`subj_${nextLesson.subject}`)}
              </div>
              <h3 className="mt-0.5 truncate font-display text-xl font-bold text-white">
                {nextLesson.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-violet-200/70">
                <Timer className="h-3.5 w-3.5" /> {nextLesson.minutes} {t("common_min")}
                <span>·</span>
                <span>{t(`band_${nextLesson.band}`)}</span>
              </div>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg transition group-hover:scale-110">
              <Play className="h-5 w-5 fill-white" />
            </span>
          </div>
        </Link>
      )}

      {/* subjects */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">
          {t("dash_subjects")} · {t(bandKey)}
        </h2>
        <Link href="/learn" className="flex items-center gap-1 text-sm font-bold text-violet-600">
          {t("nav_learn")} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {subjects.slice(0, 4).map((sub) => {
          const count = lessons.filter((l) => l.subject === sub).length;
          const done = lessons.filter((l) => l.subject === sub && l.completed).length;
          const tint = SUBJ_TINT[sub] ?? "bg-violet-100 text-violet-600";
          return (
            <Link key={sub} href="/learn" className="card p-4 transition hover:-translate-y-1">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}>
                <IconByName name={lessons.find((l) => l.subject === sub)?.icon ?? "BookOpen"} className="h-5.5 w-5.5" />
              </span>
              <div className="mt-2.5 font-display text-sm font-bold text-ink">{t(`subj_${sub}`)}</div>
              <div className="mt-0.5 flex items-center gap-1 text-[11px] font-bold text-inksoft">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {done}/{count} {t("common_lessons")}
              </div>
            </Link>
          );
        })}
      </div>

      {/* quick actions */}
      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        <Link href="/studio" className="card group relative flex items-center gap-3 overflow-hidden p-4 transition hover:-translate-y-0.5 sm:col-span-2">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-amber-400 to-violet-500 text-white">
            <Palette className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold text-ink">{t("st_title")}</div>
            <div className="mt-0.5 line-clamp-1 text-xs font-bold text-pink-600">{t("st_sub")}</div>
          </div>
          <ArrowRight className="ms-auto h-5 w-5 shrink-0 text-pink-400 transition group-hover:translate-x-1" />
        </Link>

        <Link href="/letters" className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 sm:col-span-2">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-600">
            Aa
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold text-ink">{t("lt_title")}</div>
            <div className="mt-0.5 line-clamp-1 text-xs font-bold text-emerald-600">{t("lt_sub")}</div>
          </div>
          <ArrowRight className="ms-auto h-5 w-5 shrink-0 text-emerald-400 transition group-hover:translate-x-1" />
        </Link>
        <Link href="/games" className="card group flex items-center gap-3 overflow-hidden p-0 transition hover:-translate-y-0.5">
          <div className="relative h-full w-24 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/games.webp" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="py-4 pe-4">
            <div className="flex items-center gap-1.5 font-display text-base font-bold text-ink">
              <Brain className="h-4.5 w-4.5 text-violet-600" /> {t("gm_title")}
            </div>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-violet-600">
              {t("dash_brain_cta")} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link href="/diary" className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
            <Camera className="h-6 w-6" />
          </span>
          <div>
            <div className="font-display text-base font-bold text-ink">{t("dy_title")}</div>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-pink-600">
              {t("dash_diary_cta")} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        <Link href="/history" className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl">
            🌍
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold text-ink">{t("hist_title")}</div>
            <div className="mt-0.5 line-clamp-1 text-xs font-bold text-amber-600">{t("hist_pick")}</div>
          </div>
          <ArrowRight className="ms-auto h-5 w-5 shrink-0 text-amber-400 transition group-hover:translate-x-1" />
        </Link>

        <Link href="/cartoons" className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Gamepad2 className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-display text-base font-bold text-ink">{t("ct_title")}</div>
            <div className="mt-0.5 line-clamp-1 text-xs font-bold text-inksoft">{t("ct_sub")}</div>
          </div>
          <ArrowRight className="ms-auto h-5 w-5 shrink-0 text-violet-400 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </AppShell>
  );
}
