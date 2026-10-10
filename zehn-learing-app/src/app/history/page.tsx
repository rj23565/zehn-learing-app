"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Globe2, Landmark, Play, Timer } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { useTranslate } from "@/hooks/useTranslate";
import { COUNTRIES } from "@/db/curriculum-world";
import type { LessonListItem } from "@/lib/types";

export default function HistoryPage() {
  const { status, lang, t } = useApp();
  const router = useRouter();
  const [country, setCountry] = useState<string | null>(null);
  const [chapters, setChapters] = useState<LessonListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  useEffect(() => {
    const saved = localStorage.getItem("zehn_country");
    if (saved) setCountry(saved);
  }, []);

  useEffect(() => {
    if (!country) return;
    localStorage.setItem("zehn_country", country);
    setLoading(true);
    fetch(`/api/lessons?country=${country}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setChapters(d.lessons ?? []))
      .catch(() => setChapters([]))
      .finally(() => setLoading(false));
  }, [country]);

  const meta = COUNTRIES.find((c) => c.code === country);
  const { texts: tr } = useTranslate(chapters.flatMap((c) => [c.title, c.intro]), lang);
  const nextChapter = useMemo(() => chapters.find((c) => !c.completed), [chapters]);
  const doneCount = chapters.filter((c) => c.completed).length;

  return (
    <AppShell>
      <h1 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
        <Globe2 className="h-5.5 w-5.5 text-amber-600" /> {t("hist_title")}
      </h1>
      <p className="mt-0.5 text-xs font-medium text-inksoft sm:text-sm">{t("hist_sub")}</p>

      {/* country picker */}
      <div className="mt-4">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-inksoft">
          {t("hist_pick")}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COUNTRIES.map((c) => (
            <button key={c.code} onClick={() => setCountry(c.code)}
              className={`flex items-center gap-2 rounded-2xl p-3 text-start transition active:scale-95 ${
                country === c.code
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-ink ring-1 ring-slate-200 hover:ring-indigo-300"
              }`}>
              <span className="text-xl leading-none">{c.flag}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-xs font-bold">{c.name}</span>
                <span className={`block text-[9.5px] font-semibold ${country === c.code ? "text-indigo-200" : "text-inksoft"}`}>
                  {c.chapters.length} ch.
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* continue banner */}
      {country && meta && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="card mt-4 overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-4 !ring-0 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.flag}</span>
            <div className="min-w-0 flex-1">
              <div className="font-display text-base font-bold">{meta.name}</div>
              <div className="text-[11px] font-semibold text-amber-100">
                {t("hist_progress", { a: doneCount, b: chapters.length })}
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/25">
                <motion.div className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${chapters.length ? (doneCount / chapters.length) * 100 : 0}%` }} />
              </div>
            </div>
            {nextChapter && (
              <Link href={`/learn/${nextChapter.id}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow"
                aria-label={t("hist_continue")}>
                <Play className="h-4.5 w-4.5 fill-current" />
              </Link>
            )}
          </div>
        </motion.div>
      )}

      {/* chapters */}
      {loading ? (
        <div className="mt-4 space-y-2.5">
          {[1, 2].map((i) => <div key={i} className="card h-20 animate-pulse bg-slate-50" />)}
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {chapters.map((ch, i) => (
            <Link key={ch.id} href={`/learn/${ch.id}`}
              className="card group flex items-center gap-3 p-3.5 transition hover:-translate-y-0.5 hover:ring-amber-200">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Landmark className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-display text-[13px] font-bold text-ink">
                    {tr[i * 2] ?? ch.title}
                  </h3>
                  {ch.completed && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-inksoft">
                  {tr[i * 2 + 1] ?? ch.intro}
                </p>
                <span className="chip mt-1 bg-slate-100 !px-2 !py-0.5 text-[9px] text-slate-600">
                  <Timer className="h-2.5 w-2.5" /> {ch.minutes} {t("common_min")}
                </span>
              </div>
              <ChevronRight className="h-4.5 w-4.5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-amber-500" />
            </Link>
          ))}
          {!country && (
            <p className="py-8 text-center text-sm font-medium text-inksoft">{t("hist_pick")}</p>
          )}
        </div>
      )}
    </AppShell>
  );
}
