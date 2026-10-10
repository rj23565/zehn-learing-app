"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Brain, Camera, CloudCheck, Gamepad2, Globe2, GraduationCap,
  Languages, Play, Puzzle, Sparkles, Volume2, Wand2,
} from "lucide-react";
import { useApp } from "@/components/providers";
import { Logo } from "@/components/Logo";
import { CharacterCast } from "@/components/Characters";
import { LanguagePicker } from "@/components/LanguagePicker";

const FEATURES = [
  { icon: Gamepad2, t: "feat_play_t", d: "feat_play_d", tint: "from-indigo-500 to-violet-500" },
  { icon: Volume2, t: "feat_voice_t", d: "feat_voice_d", tint: "from-amber-500 to-orange-500" },
  { icon: Brain, t: "feat_brain_t", d: "feat_brain_d", tint: "from-emerald-500 to-teal-500" },
  { icon: Camera, t: "feat_diary_t", d: "feat_diary_d", tint: "from-pink-500 to-rose-500" },
  { icon: Languages, t: "feat_lang_t", d: "feat_lang_d", tint: "from-sky-500 to-blue-500" },
  { icon: CloudCheck, t: "feat_cloud_t", d: "feat_cloud_d", tint: "from-violet-500 to-fuchsia-500" },
];

const BANDS = ["band_early", "band_primary", "band_middle", "band_high", "band_senior"];
const MARQUEE = [
  "Numbers", "Math", "Science", "English", "Physics", "Algebra", "Space",
  "Fractions", "Circuits", "Gravity", "Words", "Data", "Letters", "Logic",
];

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: "spring" as const, bounce: 0.22 },
  }),
};

export default function Landing() {
  const { status, t } = useApp();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const ready = status === "ready";

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#070a18] text-slate-100">
      {/* ambient background */}
      <div className="aurora pointer-events-none fixed inset-x-0 top-[-25%] h-[60vh] opacity-70" />
      <div className="stage-pattern pointer-events-none fixed inset-0 opacity-30" />

      {/* ── nav ── */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Logo size={38} />
          <span className="font-display text-xl font-bold tracking-tight">
            {t("app_name")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLangOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/12 backdrop-blur transition hover:bg-white/15"
            aria-label={t("lang_picker")}
          >
            <Globe2 className="h-5 w-5 text-indigo-300" />
          </button>
          {ready && (
            <button onClick={() => router.push("/dashboard")}
              className="rounded-2xl bg-white/8 px-4 py-2 font-display text-sm font-semibold ring-1 ring-white/12 backdrop-blur transition hover:bg-white/15">
              {t("hero_resume")}
            </button>
          )}
        </div>
      </header>

      {/* ── hero ── */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-20 pt-8 md:grid-cols-2 md:pt-14">
        <div>
          <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
            className="chip mb-5 bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/25 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero_badge")}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
            className="fun-title font-display text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
            {t("hero_title")}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
            className="mt-6 max-w-lg text-base font-medium leading-relaxed text-slate-400 sm:text-lg">
            {t("hero_sub")}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
            className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push(ready ? "/dashboard" : "/onboarding")}
              className="btn-primary !rounded-xl text-base">
              <Play className="h-4.5 w-4.5 fill-white" />
              {ready ? t("hero_resume") : t("hero_cta")}
              <ArrowUpRight className="h-4.5 w-4.5" />
            </button>
            <div className="chip bg-white/6 px-4 py-2.5 text-slate-300 ring-1 ring-white/10 backdrop-blur">
              <GraduationCap className="h-4 w-4 text-indigo-300" />
              {t("strip_grades")}
            </div>
          </motion.div>

          {/* mini stats */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
            className="mt-12 flex gap-8 border-t border-white/8 pt-7">
            {[
              ["20+", "common_lessons"],
              ["8", "lang_picker"],
              ["5", "nav_games"],
            ].map(([num, key]) => (
              <div key={key}>
                <div className="font-display text-3xl font-bold tracking-tight text-white">{num}</div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">{t(key)}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* hero visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.3, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative overflow-hidden rounded-[2.2rem] ring-1 ring-white/15 shadow-[0_40px_100px_-30px_rgba(99,102,241,.5)]"
          >
            <Image
              src="/images/hero-mature.webp" alt="Knowledge constellation"
              width={720} height={540} priority
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a18] via-[#070a18]/35 to-transparent" />
            {/* full-body cartoon cast standing in front */}
            <div className="absolute inset-x-0 bottom-0 px-2 pb-1">
              <CharacterCast size={78} />
            </div>
          </motion.div>

          {/* floating glass chips */}
          <motion.div
            className="absolute -left-4 top-10 flex items-center gap-2.5 rounded-2xl bg-white/8 px-4 py-2.5 ring-1 ring-white/12 backdrop-blur-xl"
            animate={{ y: [0, -10, 0] }} transition={{ duration: 3.6, repeat: Infinity }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500">
              <Volume2 className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-semibold">{t("feat_voice_t")}</span>
          </motion.div>

          <motion.div
            className="absolute -right-3 bottom-12 flex items-center gap-2.5 rounded-2xl bg-white/8 px-4 py-2.5 ring-1 ring-white/12 backdrop-blur-xl"
            animate={{ y: [0, 10, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.5 }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
              <Puzzle className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-semibold">{t("feat_brain_t")}</span>
          </motion.div>

          <motion.div
            className="absolute -left-3 bottom-24 flex items-center gap-2.5 rounded-2xl bg-white/8 px-4 py-2.5 ring-1 ring-white/12 backdrop-blur-xl"
            animate={{ y: [0, -8, 0] }} transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500">
              <Wand2 className="h-4 w-4 text-white" />
            </span>
            <span className="font-display text-sm font-semibold">{t("feat_diary_t")}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── marquee ── */}
      <div className="relative z-10 border-y border-white/8 bg-white/[0.03] py-4 backdrop-blur">
        <div className="marquee-track gap-3">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="chip bg-white/6 px-4 py-1.5 font-display text-slate-300 ring-1 ring-white/10">
              <Sparkles className="h-3 w-3 text-indigo-300" /> {m}
            </span>
          ))}
        </div>
      </div>

      {/* ── features ── */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20">
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.t} variants={fadeUp} custom={i} initial="hidden"
              whileInView="show" viewport={{ once: true, margin: "-60px" }}
              className="group rounded-3xl bg-white/[0.045] p-6 ring-1 ring-white/10 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.075] hover:ring-white/20">
              <span className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.tint} shadow-lg transition group-hover:scale-110`}>
                <f.icon className="h-5.5 w-5.5 text-white" />
              </span>
              <h3 className="font-display text-lg font-bold tracking-tight">{t(f.t)}</h3>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-400">{t(f.d)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── how it works ── */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="rounded-[2rem] bg-white/[0.04] p-8 ring-1 ring-white/10 backdrop-blur sm:p-12">
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <motion.div key={n} variants={fadeUp} custom={n} initial="hidden"
                whileInView="show" viewport={{ once: true }}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-display text-lg font-bold text-white shadow-lg">
                  {n}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{t(`how_${n}_t`)}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{t(`how_${n}_d`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── grade bands ── */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-20">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {BANDS.map((b, i) => (
            <motion.span key={b} variants={fadeUp} custom={i} initial="hidden"
              whileInView="show" viewport={{ once: true }}
              className="chip bg-white/6 px-5 py-2.5 text-sm text-slate-200 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/12">
              <GraduationCap className="h-4 w-4 text-indigo-300" />
              {t(b)}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ type: "spring", bounce: 0.3 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 p-10 text-center ring-1 ring-white/20 sm:p-14">
          <div className="stage-pattern absolute inset-0 opacity-40" />
          <div className="relative">
            <Logo size={72} className="mx-auto" />
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {t("tagline")}
            </h2>
            <button onClick={() => router.push(ready ? "/dashboard" : "/onboarding")}
              className="mt-7 rounded-2xl bg-white px-8 py-4 font-display text-base font-bold text-indigo-700 shadow-2xl transition active:scale-95">
              {ready ? t("hero_resume") : t("hero_cta")}
            </button>
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 border-t border-white/8 py-7 text-center text-xs font-semibold text-slate-500">
        {t("app_name")} — {t("hero_badge")}
      </footer>

      <LanguagePicker open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
