"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Check, ChevronLeft, ChevronRight, Ear, Gauge, Lightbulb, Loader2,
  Pause, Play, Rabbit, RotateCcw, Sparkles, Star, Turtle, Volume2, X,
} from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { SlideVisual } from "@/components/Visual";
import { useSpeech } from "@/hooks/useSpeech";
import { useTranslate } from "@/hooks/useTranslate";
import { sfx } from "@/lib/sounds";
import { fireConfetti } from "@/components/Confetti";
import { genTutorQuestion, type TutorQuestion } from "@/lib/tutor";
import type { LessonFull } from "@/lib/types";

const RATES = [
  { icon: Turtle, v: 0.65, k: "turtle" },
  { icon: Gauge, v: 0.95, k: "normal" },
  { icon: Rabbit, v: 1.25, k: "rabbit" },
];

export default function LessonPlayer() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { lang, t } = useApp();
  const { say, stop, speaking, supported } = useSpeech(lang);

  const [lesson, setLesson] = useState<LessonFull | null>(null);
  const [mode, setMode] = useState<"slides" | "quiz" | "done" | "bonus">("slides");
  const [slideIdx, setSlideIdx] = useState(0);
  const [easy, setEasy] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const [rateIdx, setRateIdx] = useState(1);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [eliminated, setEliminated] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; xp: number } | null>(null);
  const [bonus, setBonus] = useState<{
    qs: TutorQuestion[];
    idx: number;
    correct: number;
    picked: number | null;
    earned: number;
  } | null>(null);
  const advancing = useRef(false);

  useEffect(() => {
    fetch(`/api/lessons?id=${params.id}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setLesson(d.lesson ?? null))
      .catch(() => undefined);
  }, [params.id]);

  // ---- one-shot batch translation of every visible string ----
  const originals = useMemo(() => {
    if (!lesson) return [] as string[];
    const slideTexts = lesson.slides.flatMap((s) => [s.heading, s.body, s.simple]);
    const quizTexts = lesson.quiz.flatMap((q) => [q.q, ...q.options]);
    return [...slideTexts, ...quizTexts];
  }, [lesson]);
  const { texts: tr, loading: translating } = useTranslate(originals, lang);

  const slideCount = lesson?.slides.length ?? 0;
  const slideTexts = (i: number) => ({
    heading: tr[i * 3] ?? lesson?.slides[i].heading ?? "",
    body: tr[i * 3 + 1] ?? lesson?.slides[i].body ?? "",
    simple: tr[i * 3 + 2] ?? lesson?.slides[i].simple ?? "",
  });
  const quizBase = slideCount * 3;
  const qOffsets = useMemo(() => {
    if (!lesson) return [] as number[];
    const arr: number[] = [];
    let acc = quizBase;
    for (const q of lesson.quiz) {
      arr.push(acc);
      acc += 1 + q.options.length;
    }
    return arr;
  }, [lesson, quizBase]);
  const qText = (i: number) => ({
    q: tr[qOffsets[i] ?? 0] ?? lesson?.quiz[i].q ?? "",
    options:
      lesson?.quiz[i].options.map(
        (_, j) => tr[(qOffsets[i] ?? 0) + 1 + j] ?? lesson.quiz[i].options[j]
      ) ?? [],
  });

  const narrate = useCallback(
    (i: number) => {
      if (!lesson) return;
      const s = slideTexts(i);
      const text = easy ? s.simple : s.body;
      say(`${s.heading}. ${text}`, {
        rate: RATES[rateIdx].v,
        onEnd: () => {
          if (advancing.current && i < slideCount - 1) {
            setSlideIdx(i + 1);
          } else if (advancing.current && i === slideCount - 1) {
            advancing.current = false;
            setAutoplay(false);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson, tr, easy, rateIdx, say, slideCount]
  );

  // autoplay chain
  useEffect(() => {
    advancing.current = autoplay;
    if (autoplay && mode === "slides") narrate(slideIdx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIdx, autoplay, mode]);

  useEffect(() => () => stop(), [stop]);

  // ---------------- quiz (with adaptive hint) ----------------
  const hint = () => {
    if (!lesson || eliminated !== null || picked !== null) return;
    const wrong = lesson.quiz[qIdx].options
      .map((_, i) => i)
      .filter((i) => i !== lesson.quiz[qIdx].a);
    setEliminated(wrong[Math.floor(Math.random() * wrong.length)]);
    sfx.pop();
  };

  const pick = (idx: number) => {
    if (!lesson || picked !== null || idx === eliminated) return;
    setPicked(idx);
    const correct = idx === lesson.quiz[qIdx].a;
    if (correct) sfx.correct();
    else sfx.wrong();
    const newAnswers = [...answers, correct];
    setTimeout(() => {
      setPicked(null);
      setEliminated(null);
      if (qIdx < lesson.quiz.length - 1) {
        setAnswers(newAnswers);
        setQIdx(qIdx + 1);
      } else {
        finish(newAnswers);
      }
    }, 900);
  };

  // ---------------- bonus round (generated adaptive questions) ----------------
  const startBonus = () => {
    if (!lesson) return;
    const levelByBand: Record<string, number> = { early: 1, primary: 2, middle: 3, high: 5, senior: 7 };
    const lvl = levelByBand[lesson.band] ?? 3;
    setBonus({
      qs: [genTutorQuestion("math", lvl), genTutorQuestion("logic", lvl)],
      idx: 0, correct: 0, picked: null, earned: 0,
    });
    setMode("bonus");
    sfx.whoosh();
  };

  const pickBonus = (idx: number) => {
    if (!lesson || !bonus || bonus.picked !== null) return;
    const q = bonus.qs[bonus.idx];
    const correct = idx === q.a;
    if (correct) sfx.correct();
    else sfx.wrong();
    setBonus({ ...bonus, picked: idx });
    const idxNow = bonus.idx;
    setTimeout(async () => {
      let earned = bonus.earned;
      if (correct) {
        try {
          const res = await fetch("/api/xp", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify({ reason: "bonus", refId: `bonus-${lesson.id}-${idxNow}`, amount: 5 }),
          });
          const d = await res.json();
          earned += d.xpAwarded ?? 0;
          if (!d.queued) {
            window.dispatchEvent(new CustomEvent("zehn:progress", {
              detail: { xp: d.totalXp, level: d.level, streak: d.streak },
            }));
          }
        } catch { /* offline ok */ }
      }
      if (idxNow < bonus.qs.length - 1) {
        setBonus({ ...bonus, idx: idxNow + 1, correct: bonus.correct + (correct ? 1 : 0), picked: null, earned });
      } else {
        const finalCorrect = bonus.correct + (correct ? 1 : 0);
        if (finalCorrect === bonus.qs.length) { sfx.win(); fireConfetti(); }
        setBonus({ ...bonus, correct: finalCorrect, picked: null, earned });
        setMode("done");
      }
    }, 950);
  };

  const finish = async (all: boolean[]) => {
    if (!lesson) return;
    const correctCount = all.filter(Boolean).length;
    const score = Math.round((correctCount / lesson.quiz.length) * 100);
    let xp = 0;
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ lessonId: lesson.id, score }),
      });
      const d = await res.json();
      xp = d.xpAwarded ?? 0;
      if (!d.queued) {
        window.dispatchEvent(new CustomEvent("zehn:progress", {
          detail: { xp: d.totalXp, level: d.level, streak: d.streak },
        }));
      }
    } catch { /* offline ok */ }
    setResult({ score, xp });
    setMode("done");
    if (score >= 60) {
      sfx.win();
      setTimeout(() => fireConfetti(), 250);
    }
  };

  if (!lesson) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#150D33]">
        <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
      </div>
    );
  }

  const slide = lesson.slides[slideIdx];
  const sText = slideTexts(slideIdx);

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#150D33] text-white">
      <div className="stage-pattern pointer-events-none absolute inset-0 opacity-30" />

      {/* top bar */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-4">
        <button onClick={() => { stop(); router.push("/learn"); }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
          aria-label={t("common_back")}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-sm font-bold text-violet-200/90">{lesson.title}</div>
          <div className="mt-1.5 flex gap-1">
            {lesson.slides.map((_, i) => (
              <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= slideIdx ? "bg-gradient-to-r from-violet-400 to-fuchsia-400" : "bg-white/15"}`} />
            ))}
          </div>
        </div>
        {translating && <Loader2 className="h-4 w-4 animate-spin text-sky-300" />}
      </div>

      {/* ============ SLIDES ============ */}
      {mode === "slides" && (
        <div className="relative z-10 flex flex-1 flex-col px-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={slideIdx} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              className="flex flex-1 flex-col">
              <SlideVisual visual={slide.visual} color={lesson.color} />

              <h2 className="mt-5 text-center font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                {sText.heading}
              </h2>

              {/* subtitle panel */}
              <AnimatePresence mode="wait">
                <motion.p key={easy ? "simple" : "body" + slideIdx}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mx-auto mt-3 max-w-xl rounded-2xl bg-white/8 px-5 py-4 text-center text-base font-semibold leading-relaxed text-violet-100 backdrop-blur-sm">
                  {easy ? sText.simple : sText.body}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>

          {/* control deck */}
          <div className="mt-auto space-y-3 pt-5">
            <div className="flex items-center justify-center gap-2">
              {/* speed */}
              <button onClick={() => setRateIdx((rateIdx + 1) % RATES.length)}
                className="flex h-11 items-center gap-1.5 rounded-full bg-white/10 px-4 font-display text-xs font-bold backdrop-blur transition hover:bg-white/20">
                {(() => { const I = RATES[rateIdx].icon; return <I className="h-4.5 w-4.5" />; })()}
                {RATES[rateIdx].k === "turtle" ? "0.7x" : RATES[rateIdx].k === "rabbit" ? "1.2x" : "1x"}
              </button>

              {/* narrate */}
              {supported && (
                <button onClick={() => { advancing.current = false; setAutoplay(false); narrate(slideIdx); }}
                  className={`flex h-11 items-center gap-1.5 rounded-full px-4 font-display text-xs font-bold backdrop-blur transition ${
                    speaking ? "bg-amber-400/90 text-[#150D33]" : "bg-white/10 hover:bg-white/20"
                  }`}>
                  {speaking ? <Pause className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                  {t("common_listen")}
                </button>
              )}

              {/* replay */}
              <button onClick={() => narrate(slideIdx)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-white/20"
                aria-label={t("common_replay")}>
                <RotateCcw className="h-4.5 w-4.5" />
              </button>

              {/* easy mode */}
              <button onClick={() => setEasy(!easy)}
                className={`flex h-11 items-center gap-1.5 rounded-full px-4 font-display text-xs font-bold backdrop-blur transition ${
                  easy ? "bg-emerald-400/90 text-[#150D33]" : "bg-white/10 hover:bg-white/20"
                }`}>
                <Ear className="h-4.5 w-4.5" />
                {easy ? t("common_normal") : t("common_easy")}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button onClick={() => slideIdx > 0 && setSlideIdx(slideIdx - 1)} disabled={slideIdx === 0}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur transition hover:bg-white/20 disabled:opacity-30">
                <ChevronLeft className="h-6 w-6" />
              </button>

              {supported && (
                <button
                  onClick={() => {
                    const next = !autoplay;
                    advancing.current = next;
                    setAutoplay(next);
                    if (next) narrate(slideIdx);
                    else stop();
                  }}
                  className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl font-display text-base font-extrabold transition active:scale-95 ${
                    autoplay ? "bg-amber-400 text-[#150D33]" : "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-[0_10px_30px_-8px_rgba(168,85,247,.8)]"
                  }`}>
                  {autoplay ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-white" />}
                  {autoplay ? "…" : t("common_play")}
                </button>
              )}

              <button
                onClick={() => {
                  sfx.pop();
                  if (slideIdx < slideCount - 1) setSlideIdx(slideIdx + 1);
                  else { stop(); setMode("quiz"); }
                }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur transition hover:bg-white/20">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-violet-300/60">
              {t("ls_slide_of", { a: slideIdx + 1, b: slideCount })}
            </p>
          </div>
        </div>
      )}

      {/* ============ QUIZ ============ */}
      {mode === "quiz" && (
        <div className="relative z-10 flex flex-1 flex-col px-4 pb-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-extrabold">{t("ls_quiz_time")}</h2>
            <p className="mt-1 text-sm font-semibold text-violet-200/80">{t("ls_quiz_sub")}</p>
            <p className="chip mx-auto mt-3 bg-white/10 text-violet-100">
              {t("q_of", { a: qIdx + 1, b: lesson.quiz.length })}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={qIdx} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              className="mx-auto mt-6 w-full max-w-xl flex-1">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-bold leading-snug">{qText(qIdx).q}</h3>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={hint} disabled={eliminated !== null || picked !== null}
                      className="flex h-9 items-center gap-1 rounded-full bg-amber-400/15 px-3 font-display text-xs font-bold text-amber-300 ring-1 ring-amber-300/30 transition hover:bg-amber-400/25 disabled:opacity-40">
                      <Lightbulb className="h-4 w-4" /> {t("ls_hint")}
                    </button>
                    {supported && (
                      <button onClick={() => say(qText(qIdx).q, { rate: RATES[rateIdx].v })}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                        <Volume2 className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                {qText(qIdx).options.map((opt, i) => {
                  const isPick = picked === i;
                  const isAnswer = lesson.quiz[qIdx].a === i;
                  const revealed = picked !== null;
                  const gone = eliminated === i;
                  return (
                    <button key={i} onClick={() => pick(i)} disabled={revealed || gone}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start font-display text-base font-bold transition active:scale-[0.98] ${
                        gone
                          ? "border-white/5 bg-white/[0.03] text-white/25 line-through"
                          : revealed && isAnswer
                            ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                            : revealed && isPick
                              ? "shake border-rose-400 bg-rose-400/20 text-rose-200"
                              : "border-white/15 bg-white/8 hover:border-violet-300 hover:bg-white/15"
                      }`}>
                      {opt}
                      {revealed && isAnswer && <Check className="h-5 w-5 text-emerald-300" strokeWidth={3} />}
                      {revealed && isPick && !isAnswer && <X className="h-5 w-5 text-rose-300" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* answer dots */}
          <div className="mt-6 flex justify-center gap-1.5">
            {lesson.quiz.map((_, i) => (
              <span key={i} className={`h-2 w-2 rounded-full ${
                i < answers.length ? (answers[i] ? "bg-emerald-400" : "bg-rose-400") : "bg-white/20"
              }`} />
            ))}
          </div>
        </div>
      )}

      {/* ============ BONUS ROUND ============ */}
      {mode === "bonus" && bonus && (
        <div className="relative z-10 flex flex-1 flex-col px-4 pb-8">
          <div className="text-center">
            <span className="chip mx-auto bg-gradient-to-r from-amber-400/25 to-fuchsia-400/25 px-4 py-2 text-amber-200 ring-1 ring-amber-300/30">
              <Sparkles className="h-3.5 w-3.5" /> {t("ls_bonus")} · +5 XP
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={bonus.idx} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }}
              className="mx-auto mt-6 w-full max-w-xl flex-1">
              <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
                <h3 className="font-display text-xl font-bold leading-snug">{bonus.qs[bonus.idx].q}</h3>
              </div>
              <div className="mt-4 space-y-2.5">
                {bonus.qs[bonus.idx].options.map((opt, i) => {
                  const isPick = bonus.picked === i;
                  const isAnswer = bonus.qs[bonus.idx].a === i;
                  const revealed = bonus.picked !== null;
                  return (
                    <button key={i} onClick={() => pickBonus(i)} disabled={revealed}
                      className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-start font-display text-base font-bold transition active:scale-[0.98] ${
                        revealed && isAnswer
                          ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                          : revealed && isPick
                            ? "shake border-rose-400 bg-rose-400/20 text-rose-200"
                            : "border-white/15 bg-white/8 hover:border-violet-300 hover:bg-white/15"
                      }`}>
                      {opt}
                      {revealed && isAnswer && <Check className="h-5 w-5 text-emerald-300" strokeWidth={3} />}
                      {revealed && isPick && !isAnswer && <X className="h-5 w-5 text-rose-300" strokeWidth={3} />}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-center text-xs font-semibold text-violet-200/70">
                {bonus.picked !== null && bonus.qs[bonus.idx].why}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ============ DONE ============ */}
      {mode === "done" && result && (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            className="flex gap-1.5">
            {[1, 2, 3].map((n) => (
              <motion.div key={n} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25 + n * 0.18, type: "spring", bounce: 0.6 }}>
                <Star className={`h-12 w-12 ${result.score >= n * 33 ? "fill-amber-300 text-amber-400 drop-shadow-[0_0_14px_rgba(252,211,77,.6)]" : "text-white/20"}`} />
              </motion.div>
            ))}
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-6 font-display text-3xl font-extrabold">
            {t("ls_finish_title")}
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            className="mt-2 font-display text-lg font-bold text-violet-200">
            {t("common_score")}: {result.score}%
          </motion.p>

          {result.xp > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
              className="chip mt-4 bg-amber-400/20 px-4 py-2 text-base text-amber-300">
              <Star className="h-4 w-4 fill-amber-300" />
              {t("ls_earned")} +{result.xp} {t("common_xp")}
            </motion.div>
          )}

          {bonus && bonus.correct > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="chip mt-2 bg-emerald-400/15 px-4 py-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              {t("ls_bonus_done")} {bonus.correct}/{bonus.qs.length}{bonus.earned > 0 ? ` · +${bonus.earned} ${t("common_xp")}` : ""}
            </motion.div>
          )}

          {!bonus && result.score >= 60 && (
            <motion.button initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
              onClick={startBonus}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 font-display text-sm font-extrabold text-[#150D33] shadow-[0_10px_30px_-8px_rgba(251,191,36,.7)] transition active:scale-95">
              <Sparkles className="h-4.5 w-4.5" />
              {t("ls_bonus")}
            </motion.button>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="mt-8 flex w-full max-w-sm gap-3">
            <button onClick={() => { setMode("slides"); setSlideIdx(0); setQIdx(0); setAnswers([]); setResult(null); }}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 font-display text-sm font-bold backdrop-blur transition hover:bg-white/20">
              <RotateCcw className="h-4.5 w-4.5" /> {t("learn_restart")}
            </button>
            <button onClick={() => router.push("/learn")}
              className="btn-primary h-12 flex-1 !rounded-2xl !text-sm">
              {t("ls_next_lesson")}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
