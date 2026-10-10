"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Clapperboard, Loader2, Pause, Play, RotateCcw,
  Sparkles, Star,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { CinematicScene } from "@/components/CinematicScene";
import { useSpeech } from "@/hooks/useSpeech";
import { useTranslate } from "@/hooks/useTranslate";
import { EPISODES, type Episode } from "@/lib/episodes";
import { sfx } from "@/lib/sounds";
import { fireConfetti } from "@/components/Confetti";

export default function Cartoons() {
  const { status, lang, t } = useApp();
  const router = useRouter();
  const { say, stop, supported } = useSpeech(lang);

  const [ep, setEp] = useState<Episode | null>(null);
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // translate every scene line of all episodes in one batch
  const originals = EPISODES.flatMap((e) => [e.title, e.blurb, ...e.scenes.map((s) => s.narration)]);
  const { texts: tr, loading: translating } = useTranslate(originals, lang);

  // base offset of each episode inside the translated batch
  const offsets = useMemo(() => {
    const map = new Map<string, number>();
    let acc = 0;
    for (const e of EPISODES) {
      map.set(e.id, acc);
      acc += e.scenes.length + 2;
    }
    return map;
  }, []);

  const textFor = useCallback((epId: string, field: "title" | "blurb") => {
    const i = EPISODES.findIndex((e) => e.id === epId);
    const base = offsets.get(epId) ?? 0;
    return tr[base + (field === "title" ? 0 : 1)] ??
      (field === "title" ? EPISODES[i].title : EPISODES[i].blurb);
  }, [tr, offsets]);

  const narration = useCallback((e: Episode, i: number) => {
    const base = offsets.get(e.id) ?? 0;
    return tr[base + 2 + i] ?? e.scenes[i].narration;
  }, [tr, offsets]);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  const clearFallback = () => {
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
    fallbackTimer.current = null;
  };

  const advance = useCallback((e: Episode, i: number) => {
    if (i < e.scenes.length - 1) {
      setScene(i + 1);
    } else {
      setEnded(true);
      setPlaying(false);
      sfx.win();
      fireConfetti();
      fetch("/api/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ reason: "cartoon", refId: `cartoon-${e.id}`, amount: 12, daily: "cartoons" }),
      }).catch(() => undefined);
    }
  }, []);

  const playScene = useCallback((e: Episode, i: number) => {
    clearFallback();
    const line = narration(e, i);
    if (supported) {
      say(line, { rate: 0.92, onEnd: () => advance(e, i) });
    } else {
      fallbackTimer.current = setTimeout(() => advance(e, i), 6500);
    }
  }, [narration, supported, say, advance]);

  // chain scenes
  useEffect(() => {
    if (ep && playing && !ended) playScene(ep, scene);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, playing, ep, ended]);

  const startEp = (e: Episode) => {
    sfx.whoosh();
    setEp(e); setScene(0); setEnded(false); setPlaying(true);
  };

  const closeEp = () => {
    stop(); clearFallback();
    setEp(null); setPlaying(false); setEnded(false);
  };

  const toggle = () => {
    if (!ep) return;
    if (playing) {
      setPlaying(false);
      stop(); clearFallback();
    } else {
      setPlaying(true);
    }
  };

  return (
    <AppShell>
      <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold text-ink">
        <Clapperboard className="h-6 w-6 text-amber-500" /> {t("ct_title")}
      </h1>
      <p className="text-sm font-semibold text-inksoft">{t("ct_sub")}</p>

      <div className="mt-5 space-y-3">
        {EPISODES.map((e, i) => (
          <motion.button key={e.id} onClick={() => startEp(e)}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", bounce: 0.3 }}
            className="card group flex w-full items-center gap-4 p-4 text-start transition hover:-translate-y-0.5">
            <span className={`relative flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${e.tint}`}>
              <Image src={e.cover} alt="" fill sizes="112px" className="object-cover transition duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <Play className="relative h-7 w-7 fill-white text-white drop-shadow-lg transition group-hover:scale-125" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold text-ink">{textFor(e.id, "title")}</span>
              <span className="mt-0.5 block text-sm font-semibold leading-snug text-inksoft">{textFor(e.id, "blurb")}</span>
              <span className="chip mt-2 bg-violet-100 text-violet-600">
                {e.scenes.length} {t("nav_cartoons")} · {t("ct_watch")}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-violet-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />
          </motion.button>
        ))}
      </div>

      {/* ============ theater overlay ============ */}
      <AnimatePresence>
        {ep && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#150D33]">
            <div className="stage-pattern pointer-events-none absolute inset-0 opacity-30" />

            {/* top */}
            <div className="relative z-10 mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-4">
              <button onClick={closeEp}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                aria-label={t("common_back")}>
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm font-bold text-violet-200/90">
                  {t("ct_now")}: {textFor(ep.id, "title")}
                </div>
                <div className="mt-1.5 flex gap-1">
                  {ep.scenes.map((_, i) => (
                    <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
                      ended || i < scene ? "bg-gradient-to-r from-violet-400 to-fuchsia-400" : i === scene ? "bg-violet-400/50" : "bg-white/15"
                    }`} />
                  ))}
                </div>
              </div>
              {translating && <Loader2 className="h-4 w-4 animate-spin text-sky-300" />}
            </div>

            {/* stage */}
            <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-4">
              <AnimatePresence mode="wait">
                <motion.div key={scene + (ended ? "-end" : "")}
                  initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: "spring", bounce: 0.2 }}>
                  {!ended ? (
                    <CinematicScene
                      img={ep.scenes[scene].img}
                      visual={ep.scenes[scene].visual}
                      sceneKey={scene}
                    />
                  ) : (
                    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-8 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}>
                        <Star className="h-16 w-16 fill-amber-300 text-amber-300 drop-shadow-[0_0_18px_rgba(252,211,77,.7)]" />
                      </motion.div>
                      <h2 className="mt-5 max-w-sm font-display text-2xl font-extrabold text-white">
                        {t("ct_end")}
                      </h2>
                      <span className="chip mt-4 bg-white/15 px-4 py-2 text-amber-200">
                        <Sparkles className="h-4 w-4" /> +12 {t("common_xp")}
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* subtitles */}
              {!ended && (
                <motion.p key={`sub-${scene}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mx-auto mt-4 max-w-xl rounded-2xl bg-white/8 px-5 py-4 text-center font-display text-base font-bold leading-relaxed text-violet-50 backdrop-blur-sm sm:text-lg">
                  {narration(ep, scene)}
                </motion.p>
              )}

              {/* controls */}
              <div className="mx-auto mt-5 flex w-full max-w-sm items-center gap-3">
                {ended ? (
                  <>
                    <button onClick={() => { setScene(0); setEnded(false); setPlaying(true); }}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 font-display text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
                      <RotateCcw className="h-4.5 w-4.5" /> {t("ct_replay")}
                    </button>
                    <button onClick={closeEp} className="btn-primary h-12 flex-1 !rounded-2xl !text-sm">
                      {t("common_close")}
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => playScene(ep, scene)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                      aria-label={t("common_replay")}>
                      <RotateCcw className="h-5 w-5" />
                    </button>
                    <button onClick={toggle}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-display text-base font-extrabold text-white shadow-[0_10px_30px_-8px_rgba(168,85,247,.8)] transition active:scale-95">
                      {playing ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                      {playing ? t("nav_cartoons") : t("common_play")}
                    </button>
                    <button onClick={() => advance(ep, scene)}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                      aria-label={t("common_next")}>
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
