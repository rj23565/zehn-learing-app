"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2, ChevronRight, Flame, Search, Sparkles, Sprout, Timer, X, Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { IconByName } from "@/components/IconByName";
import { useTranslate } from "@/hooks/useTranslate";
import { gradeToBand, type LessonSeed } from "@/db/curriculum";
import type { LessonListItem } from "@/lib/types";

const BANDS: LessonSeed["band"][] = ["early", "primary", "middle", "high", "senior"];

const LEVELS = [
  { id: "all", key: "lvl_all", icon: Sparkles, tint: "bg-slate-900 text-white", soft: "text-slate-600" },
  { id: "easy", key: "diff_easy", icon: Sprout, tint: "bg-emerald-500 text-white", soft: "text-emerald-600" },
  { id: "normal", key: "lvl_normal", icon: Zap, tint: "bg-amber-500 text-white", soft: "text-amber-600" },
  { id: "hard", key: "diff_hard", icon: Flame, tint: "bg-rose-500 text-white", soft: "text-rose-600" },
];

const LEVEL_BADGE: Record<string, string> = {
  easy: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  normal: "bg-amber-50 text-amber-600 ring-amber-100",
  hard: "bg-rose-50 text-rose-600 ring-rose-100",
};

const COLOR_DOT: Record<string, string> = {
  violet: "from-indigo-500 to-violet-500",
  amber: "from-amber-400 to-orange-500",
  mint: "from-emerald-400 to-teal-500",
  sky: "from-sky-400 to-blue-500",
  pink: "from-pink-400 to-rose-500",
};

export default function Learn() {
  const { status, profile, lang, t } = useApp();
  const router = useRouter();
  const [band, setBand] = useState<LessonSeed["band"] | null>(null);
  const [level, setLevel] = useState("all");
  const [subject, setSubject] = useState("all");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
    if (status === "ready" && profile && !band) setBand(gradeToBand(profile.grade));
  }, [status, profile, band, router]);

  // debounce the search box
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 280);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!band) return;
    setLoading(true);
    const params = new URLSearchParams({ band, level, subject });
    if (debounced) params.set("q", debounced);
    fetch(`/api/lessons?${params.toString()}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setLessons(d.lessons ?? []);
        setSubjects(d.subjects ?? []);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, [band, level, subject, debounced]);

  // live-translate titles + intros
  const originals = useMemo(() => lessons.flatMap((l) => [l.title, l.intro]), [lessons]);
  const { texts: translated, loading: translating } = useTranslate(originals, lang);

  const bySubject = useMemo(() => {
    const map = new Map<string, LessonListItem[]>();
    lessons.forEach((l) => {
      const arr = map.get(l.subject) ?? [];
      arr.push(l);
      map.set(l.subject, arr);
    });
    return [...map.entries()];
  }, [lessons]);

  const searching = debounced.length > 0;
  const subjLabel = (s: string) => {
    const key = `subj_${s}`;
    const out = t(key);
    return out === key ? s : out;
  };

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{t("learn_title")}</h1>
      <p className="text-sm font-medium text-inksoft">
        {t("learn_sub", { band: band ? t(`band_${band}`) : "" })}
      </p>

      {/* ---------- search ---------- */}
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search_ph")}
          className="input-soft !ps-11 !pe-11 !py-3.5 text-sm"
        />
        <AnimatePresence>
          {query && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label={t("common_close")}>
              <X className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- level path ---------- */}
      <div className="mt-4">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-inksoft">
          {t("learn_path")}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {LEVELS.map((l) => {
            const active = level === l.id;
            return (
              <button key={l.id} onClick={() => setLevel(l.id)}
                className={`flex flex-col items-center gap-1 rounded-2xl px-1 py-2.5 font-display text-[11px] font-semibold transition ${
                  active ? `${l.tint} shadow-md` : `bg-white ring-1 ring-slate-200 ${l.soft} hover:ring-slate-300`
                }`}>
                <l.icon className="h-4 w-4" />
                {t(l.key)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- band switcher (hidden while searching) ---------- */}
      {!searching && (
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BANDS.map((b) => (
            <button key={b} onClick={() => setBand(b)}
              className={`chip shrink-0 px-3.5 py-2 transition ${
                band === b
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-ink ring-1 ring-slate-200 hover:ring-indigo-300"
              }`}>
              {t(`band_${b}`)}
            </button>
          ))}
        </div>
      )}

      {/* ---------- subject filter ---------- */}
      <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button onClick={() => setSubject("all")}
          className={`chip shrink-0 px-3.5 py-1.5 transition ${
            subject === "all" ? "bg-slate-900 text-white" : "bg-white text-ink ring-1 ring-slate-200 hover:ring-slate-300"
          }`}>
          {t("learn_all_subjects")}
        </button>
        {subjects.map((s) => (
          <button key={s} onClick={() => setSubject(s)}
            className={`chip shrink-0 px-3.5 py-1.5 transition ${
              subject === s ? "bg-indigo-600 text-white" : "bg-white text-ink ring-1 ring-slate-200 hover:ring-indigo-300"
            }`}>
            {subjLabel(s)}
          </button>
        ))}
      </div>

      {/* ---------- status line ---------- */}
      <div className="mt-3 flex items-center gap-2">
        <span className="chip bg-slate-100 text-slate-600">
          {t("search_results", { n: lessons.length })}
        </span>
        {translating && (
          <span className="chip bg-sky-50 text-sky-600">
            <Sparkles className="h-3 w-3" /> {t("ls_translating")}
          </span>
        )}
      </div>

      {/* ---------- results ---------- */}
      {loading ? (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-24 animate-pulse bg-slate-50" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <div className="card mt-5 flex flex-col items-center gap-2 p-10 text-center">
          <Search className="h-8 w-8 text-slate-300" />
          <p className="text-sm font-medium text-inksoft">{t("search_none")}</p>
        </div>
      ) : (
        bySubject.map(([subj, items]) => (
          <div key={subj} className="mt-6">
            <h2 className="font-display text-base font-bold tracking-tight text-ink">
              {subjLabel(subj)}
              <span className="ms-2 text-xs font-semibold text-inksoft">
                {items.filter((i) => i.completed).length}/{items.length} {t("common_lessons")}
              </span>
            </h2>
            <div className="mt-2.5 space-y-2.5">
              {items.map((lesson) => {
                const idx = lessons.indexOf(lesson) * 2;
                const title = translated[idx] ?? lesson.title;
                const intro = translated[idx + 1] ?? lesson.intro;
                const lvlKey = lesson.level === "normal" ? "lvl_normal" : lesson.level === "hard" ? "diff_hard" : "diff_easy";
                return (
                  <motion.div key={lesson.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ type: "spring", bounce: 0.25 }}>
                    <Link href={`/learn/${lesson.id}`} className="card group flex items-center gap-3.5 p-4 transition hover:-translate-y-0.5 hover:ring-indigo-200">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm ${COLOR_DOT[lesson.color] ?? COLOR_DOT.violet}`}>
                        <IconByName name={lesson.icon} className="h-7 w-7" strokeWidth={1.9} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-display text-base font-semibold text-ink">{title}</h3>
                          {lesson.completed && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs font-medium text-inksoft">{intro}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {lesson.level && (
                            <span className={`chip ring-1 !py-0.5 text-[10px] ${LEVEL_BADGE[lesson.level] ?? LEVEL_BADGE.easy}`}>
                              {t(lvlKey)}
                            </span>
                          )}
                          <span className="chip bg-slate-100 !py-0.5 text-[10px] text-slate-500">
                            <Timer className="h-3 w-3" /> {lesson.minutes} {t("common_min")}
                          </span>
                          {searching && (
                            <span className="chip bg-indigo-50 !py-0.5 text-[10px] text-indigo-600">
                              {t(`band_${lesson.band}`)}
                            </span>
                          )}
                          {lesson.completed && (
                            <span className="chip bg-amber-50 !py-0.5 text-[10px] text-amber-600">
                              {t("common_best")}: {lesson.bestScore}%
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </AppShell>
  );
}
