"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Check, Heart, Lightbulb, Loader2, RotateCcw, Sparkles,
  Star, Trophy, Volume2, X,
} from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { useTranslate } from "@/hooks/useTranslate";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";
import {
  gameById, levelForGrade, type GameDef, type Round, type Tile,
} from "@/lib/games/catalog";

type Phase = "intro" | "play" | "over";

export function GameRunner({ gameId }: { gameId: string }) {
  const router = useRouter();
  const { profile, lang, t } = useApp();
  const voice = useVoice();
  const game = gameById(gameId);

  const baseLevel = levelForGrade(profile?.grade ?? 1);
  const [phase, setPhase] = useState<Phase>("intro");
  const [level, setLevel] = useState(baseLevel);
  const [round, setRound] = useState<Round | null>(null);
  const [roundNo, setRoundNo] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hints, setHints] = useState(3);
  const [hintMask, setHintMask] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<null | { ok: boolean; why?: string }>(null);
  const [levelUp, setLevelUp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ best: number; isBest: boolean; xp: number } | null>(null);
  const startedAt = useRef(Date.now());

  const totalRounds = game?.rounds ?? 8;

  /* ---------- translation of visible strings ---------- */
  const strings = useMemo(() => {
    if (!game) return [];
    const why = round && "why" in round ? (round.why ?? "") : "";
    return [game.title, game.desc, round?.prompt ?? "", round?.spoken ?? "", why];
  }, [game, round]);
  const { texts: tr } = useTranslate(strings.filter(Boolean), lang);
  const title = tr[0] ?? game?.title ?? "";
  const desc = tr[1] ?? game?.desc ?? "";
  const promptText = round ? (tr[2] ?? round.prompt) : "";
  const spokenText = round ? (tr[3] ?? round.spoken) : "";

  /* ---------- round lifecycle ---------- */
  const nextRound = useCallback(
    (lv: number) => {
      if (!game) return;
      setRound(game.make(lv));
      setHintMask([]);
      setFeedback(null);
      startedAt.current = Date.now();
    },
    [game]
  );

  const begin = () => {
    if (!game) return;
    setPhase("play");
    setLevel(baseLevel);
    setRoundNo(1);
    setLives(game.lives);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setAttempts(0);
    setHints(3);
    setResult(null);
    nextRound(baseLevel);
    sfx.whoosh();
  };

  // speak the prompt whenever a new round appears
  useEffect(() => {
    if (phase === "play" && spokenText) voice.speak(spokenText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spokenText, phase]);

  const finish = useCallback(
    async (finalScore: number, finalCorrect: number, finalAttempts: number) => {
      setPhase("over");
      voice.stop();
      const accuracy = finalAttempts ? Math.round((finalCorrect / finalAttempts) * 100) : 0;
      if (accuracy >= 70) { sfx.win(); fireConfetti(); }
      setSaving(true);
      try {
        const res = await fetch("/api/games", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            game: `${gameId}:${Math.min(3, Math.max(1, Math.ceil(level / 2)))}`,
            score: finalScore,
            level: Math.min(3, Math.max(1, Math.ceil(level / 2))),
            xp: Math.min(20, 4 + Math.round(finalScore / 30)),
          }),
        });
        const d = await res.json();
        setResult({ best: d.best ?? finalScore, isBest: Boolean(d.isBest), xp: d.xpAwarded ?? 0 });
        if (!d.queued) {
          window.dispatchEvent(new CustomEvent("zehn:progress", {
            detail: { xp: d.totalXp, level: d.level, streak: d.streak },
          }));
        }
      } catch {
        setResult({ best: finalScore, isBest: false, xp: 0 });
      } finally {
        setSaving(false);
      }
    },
    [gameId, level, voice]
  );

  const advance = useCallback(
    (ok: boolean, why?: string) => {
      if (!game) return;
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const speedBonus = ok ? Math.max(0, 6 - Math.floor(elapsed)) : 0;
      const streakNow = ok ? streak + 1 : 0;
      const gained = ok ? 10 + speedBonus + Math.min(10, streakNow * 2) : 0;
      const nextScore = score + gained;
      const nextCorrect = correctCount + (ok ? 1 : 0);
      const nextAttempts = attempts + 1;
      const nextLives = ok ? lives : lives - 1;

      setScore(nextScore);
      setStreak(streakNow);
      setCorrectCount(nextCorrect);
      setAttempts(nextAttempts);
      setLives(nextLives);
      setFeedback({ ok, why });
      if (ok) sfx.correct(); else sfx.wrong();

      let nextLevel = level;
      if (ok && streakNow > 0 && streakNow % 4 === 0 && level < 5) {
        nextLevel = level + 1;
        setLevel(nextLevel);
        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 1800);
      }

      setTimeout(() => {
        if (nextLives <= 0 || roundNo >= totalRounds) {
          void finish(nextScore, nextCorrect, nextAttempts);
        } else {
          setRoundNo(roundNo + 1);
          nextRound(nextLevel);
        }
      }, why ? 1500 : 850);
    },
    [game, streak, score, correctCount, attempts, lives, level, roundNo, totalRounds, finish, nextRound]
  );

  /* ---------- hints ---------- */
  const useHint = () => {
    if (!round || hints <= 0 || feedback) return;
    setHints((h) => h - 1);
    sfx.pop();
    if (round.kind === "pick" || round.kind === "pattern") {
      const wrong = round.options
        .map((_, i) => i)
        .filter((i) => i !== round.answer && !hintMask.includes(i));
      if (wrong.length) setHintMask([...hintMask, wrong[Math.floor(Math.random() * wrong.length)]]);
    } else if (round.kind === "sort") {
      const wrong = round.bins.map((_, i) => i).filter((i) => i !== round.answer && !hintMask.includes(i));
      if (wrong.length) setHintMask([...hintMask, wrong[0]]);
    } else if (round.kind === "build") {
      // reveal first, then last, then middle letter
      const order = [0, round.word.length - 1, Math.floor(round.word.length / 2)];
      const next = order.find((i) => !hintMask.includes(i));
      if (next !== undefined) setHintMask([...hintMask, next]);
    } else if (round.kind === "memory" || round.kind === "sequence") {
      voice.speak(spokenText);
    }
  };

  if (!game) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <button onClick={() => router.push("/games")} className="btn-primary">{t("common_back")}</button>
      </div>
    );
  }

  const accuracy = attempts ? Math.round((correctCount / attempts) * 100) : 0;
  const stars = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : accuracy >= 35 ? 1 : 0;

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
      {/* ---------------- HUD ---------------- */}
      <header className="flex items-center gap-2">
        <button onClick={() => { voice.stop(); router.push("/games"); }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-slate-200"
          aria-label={t("common_back")}>
          <ArrowLeft className="h-4.5 w-4.5 text-ink" />
        </button>
        <span className="text-xl leading-none">{game.emoji}</span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-sm font-bold leading-tight text-ink sm:text-base">{title}</h1>
          <p className="truncate text-[10px] font-medium text-inksoft">{game.skill}</p>
        </div>
        <button onClick={() => voice.toggle()}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition ${
            voice.enabled ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-slate-400 ring-slate-200"
          }`}
          aria-label={t("voice_guide")}>
          <Volume2 className="h-4.5 w-4.5" />
        </button>
      </header>

      {phase === "play" && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: Math.min(5, game.lives) }, (_, i) => (
              <Heart key={i}
                className={`h-4 w-4 ${i < lives ? "fill-rose-500 text-rose-500" : "text-slate-300"}`} />
            ))}
          </div>
          <span className="chip bg-slate-100 !py-0.5 text-[10px] text-slate-600">
            {t("gm_round")} {Math.min(roundNo, totalRounds)}/{totalRounds}
          </span>
          <span className="chip bg-indigo-50 !py-0.5 text-[10px] text-indigo-700">
            {t("common_level")} {level}
          </span>
          <span className="ms-auto font-display text-base font-bold text-ink">{score}</span>
        </div>
      )}

      {/* ---------------- STAGE ---------------- */}
      <main className="mt-4 flex flex-1 flex-col">
        {phase === "intro" && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="card mx-auto flex w-full max-w-sm flex-col items-center gap-3 p-7 text-center">
            <span className="text-5xl">{game.emoji}</span>
            <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
            <p className="text-sm font-medium leading-relaxed text-inksoft">{desc}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="chip bg-slate-100 text-slate-600">{t("gm_round")} ×{totalRounds}</span>
              <span className="chip bg-rose-50 text-rose-600">{t("gm_lives")} ×{game.lives > 5 ? "∞" : game.lives}</span>
              <span className="chip bg-amber-50 text-amber-600">{t("common_level")} {baseLevel}</span>
            </div>
            <button onClick={begin} className="btn-primary mt-2 w-full">{t("gm_play")}</button>
          </motion.div>
        )}

        {phase === "play" && round && (
          <>
            {/* prompt */}
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
              <p className="font-display text-base font-semibold leading-snug text-ink sm:text-lg">{promptText}</p>
            </div>

            {/* engine */}
            <div className="mt-4 flex-1">
              <Engine
                round={round}
                hintMask={hintMask}
                disabled={Boolean(feedback)}
                onResult={advance}
                speak={(s) => voice.speak(s)}
                t={t}
              />
            </div>

            {/* hint bar */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <button onClick={useHint} disabled={hints <= 0 || Boolean(feedback)}
                className="flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 font-display text-xs font-bold text-amber-700 ring-1 ring-amber-200 transition disabled:opacity-40">
                <Lightbulb className="h-4 w-4" />
                {hints > 0 ? t("gm_hints_left", { n: hints }) : t("gm_no_hints")}
              </button>
              <button onClick={() => voice.speak(spokenText)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-indigo-600 ring-1 ring-slate-200"
                aria-label={t("hint_audio")}>
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {phase === "over" && (
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            className="card mx-auto mt-6 flex w-full max-w-sm flex-col items-center gap-3 p-7 text-center">
            <div className="flex gap-1">
              {[1, 2, 3].map((n) => (
                <Star key={n} className={`h-9 w-9 ${n <= stars ? "fill-amber-300 text-amber-400" : "text-slate-200"}`} />
              ))}
            </div>
            <h2 className="font-display text-xl font-bold text-ink">{t("gm_over")}</h2>
            <div className="font-display text-5xl font-bold text-indigo-600">{score}</div>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="chip bg-emerald-50 text-emerald-700">{t("gm_accuracy")} {accuracy}%</span>
              {result?.isBest && <span className="chip bg-amber-50 text-amber-700"><Trophy className="h-3 w-3" /> {t("gm_new_best")}</span>}
              {result && result.xp > 0 && <span className="chip bg-violet-50 text-violet-700">+{result.xp} {t("common_xp")}</span>}
              {result && <span className="chip bg-slate-100 text-slate-600">{t("common_best")} {result.best}</span>}
            </div>
            {saving && <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />}
            <div className="mt-2 flex w-full gap-2">
              <button onClick={() => router.push("/games")} className="btn-ghost flex-1 !py-3 text-sm">
                {t("common_back")}
              </button>
              <button onClick={begin} className="btn-primary flex-1 !py-3 text-sm">
                <RotateCcw className="h-4 w-4" /> {t("gm_play_again")}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* feedback + level-up toasts */}
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="pointer-events-none fixed inset-x-0 bottom-20 z-40 mx-auto w-fit max-w-[92vw]">
            <div className={`flex items-center gap-2 rounded-2xl px-5 py-3 shadow-xl ${
              feedback.ok ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}>
              {feedback.ok ? <Check className="h-5 w-5" strokeWidth={3} /> : <X className="h-5 w-5" strokeWidth={3} />}
              <span className="font-display text-sm font-bold">
                {feedback.ok ? t("gm_correct_fb") : t("gm_wrong_fb")}
                {feedback.why ? ` — ${tr[4] ?? feedback.why}` : ""}
              </span>
            </div>
          </motion.div>
        )}
        {levelUp && (
          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-x-0 top-24 z-40 mx-auto w-fit">
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-xl">
              <Sparkles className="h-4 w-4" /> {t("gm_levelup")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/* Engines                                                             */
/* ================================================================== */

type EngineProps = {
  round: Round;
  hintMask: number[];
  disabled: boolean;
  onResult: (ok: boolean, why?: string) => void;
  speak: (s: string) => void;
  t: (k: string, v?: Record<string, string | number>) => string;
};

function TileView({ tile, size = "md" }: { tile: Tile; size?: "sm" | "md" | "lg" }) {
  const text = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-3xl";
  if (tile.color && tile.color !== "shadow") {
    return <span className="block h-10 w-10 rounded-xl" style={{ background: tile.color }} />;
  }
  if (tile.emoji) {
    return (
      <span className={`${text} leading-none ${tile.color === "shadow" ? "brightness-0 opacity-80" : ""}`}>
        {tile.emoji}
      </span>
    );
  }
  return <span className="font-display text-lg font-bold">{tile.label}</span>;
}

function Engine(props: EngineProps) {
  const { round } = props;
  switch (round.kind) {
    case "pick": return <PickEngine {...props} round={round} />;
    case "pattern": return <PatternEngine {...props} round={round} />;
    case "memory": return <MemoryEngine {...props} round={round} />;
    case "sequence": return <SequenceEngine {...props} round={round} />;
    case "reaction": return <ReactionEngine {...props} round={round} />;
    case "build": return <BuildEngine {...props} round={round} />;
    case "order": return <OrderEngine {...props} round={round} />;
    case "sort": return <SortEngine {...props} round={round} />;
  }
}

/* ----------------------------- pick ------------------------------- */
function PickEngine({ round, hintMask, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "pick" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => setPicked(null), [round]);
  const many = round.options.length > 4 || round.options.some((o) => !o.label);

  return (
    <div className="flex h-full flex-col gap-4">
      {round.display.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-200">
          {round.display.map((tile, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: i * 0.04, type: "spring", bounce: 0.5 }}>
              <TileView tile={tile} size="lg" />
            </motion.span>
          ))}
        </div>
      )}

      <div className={`grid gap-2 ${many ? "grid-cols-3" : "grid-cols-2"}`}>
        {round.options.map((opt, i) => {
          const hidden = hintMask.includes(i);
          const isAnswer = i === round.answer;
          const state = picked === null
            ? ""
            : isAnswer ? "ring-2 ring-emerald-500 bg-emerald-50"
              : picked === i ? "ring-2 ring-rose-500 bg-rose-50 shake" : "opacity-40";
          return (
            <button key={i} disabled={disabled || hidden}
              onClick={() => { setPicked(i); onResult(i === round.answer, round.why); }}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200 transition active:scale-95 ${state} ${
                hidden ? "pointer-events-none opacity-20 line-through" : ""
              }`}>
              <TileView tile={opt} />
              {opt.emoji && opt.label && <span className="text-[10px] font-semibold text-inksoft">{opt.label}</span>}
              {!opt.emoji && opt.color && <span className="text-[10px] font-semibold text-inksoft">{opt.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------- pattern ------------------------------ */
function PatternEngine({ round, hintMask, disabled, onResult, t }: EngineProps & { round: Extract<Round, { kind: "pattern" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => setPicked(null), [round]);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* THE PATTERN — blue zone */}
      <div className="rounded-2xl border-2 border-sky-300 bg-sky-50/80 p-3">
        <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-sky-700">
          {t("pat_sequence")}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {round.seq.map((tile, i) => (
            <span key={i} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white ring-1 ring-sky-200">
              <TileView tile={tile} />
            </span>
          ))}
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-sky-400 bg-white">
            <span className="font-display text-xl font-bold text-sky-400">?</span>
          </span>
        </div>
      </div>

      {/* CHOICES — orange zone */}
      <div className="rounded-2xl border-2 border-orange-300 bg-orange-50/80 p-3">
        <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-orange-700">
          {t("pat_choose")}
        </div>
        <div className="flex items-center justify-center gap-2.5">
          {round.options.map((tile, i) => {
            const hidden = hintMask.includes(i);
            const isAnswer = i === round.answer;
            const state = picked === null
              ? "ring-orange-200"
              : isAnswer ? "ring-2 ring-emerald-500 bg-emerald-50"
                : picked === i ? "ring-2 ring-rose-500 bg-rose-50 shake" : "opacity-40";
            return (
              <button key={i} disabled={disabled || hidden}
                onClick={() => { setPicked(i); onResult(i === round.answer); }}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white ring-1 transition active:scale-90 ${state} ${
                  hidden ? "pointer-events-none opacity-20" : ""
                }`}>
                <TileView tile={tile} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- memory ------------------------------ */
function MemoryEngine({ round, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "memory" }> }) {
  const [deck, setDeck] = useState<Tile[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const lock = useRef(false);

  useEffect(() => {
    const d = [...round.pairs, ...round.pairs].sort(() => Math.random() - 0.5);
    setDeck(d);
    setOpen([]);
    setDone(new Set());
    lock.current = false;
  }, [round]);

  const flip = (i: number) => {
    if (disabled || lock.current || open.includes(i) || done.has(deck[i].emoji ?? "")) return;
    sfx.flip();
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      lock.current = true;
      const [a, b] = next;
      if (deck[a].emoji === deck[b].emoji) {
        setTimeout(() => {
          const nd = new Set(done);
          nd.add(deck[a].emoji ?? "");
          setDone(nd);
          setOpen([]);
          lock.current = false;
          if (nd.size === round.pairs.length) onResult(true);
        }, 420);
      } else {
        setTimeout(() => { setOpen([]); lock.current = false; }, 700);
      }
    }
  };

  const cols = deck.length <= 8 ? "grid-cols-4" : "grid-cols-4";
  return (
    <div className={`grid ${cols} gap-2`}>
      {deck.map((card, i) => {
        const shown = open.includes(i) || done.has(card.emoji ?? "");
        return (
          <button key={i} onClick={() => flip(i)}
            className="relative aspect-square" style={{ perspective: 600 }}>
            <motion.div animate={{ rotateY: shown ? 180 : 0 }} transition={{ duration: 0.32 }}
              className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white/40 shadow"
                style={{ backfaceVisibility: "hidden" }}>?</div>
              <div className={`absolute inset-0 flex items-center justify-center rounded-2xl text-3xl shadow ${
                done.has(card.emoji ?? "") ? "bg-emerald-100 ring-2 ring-emerald-400" : "bg-white ring-1 ring-slate-200"
              }`} style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                {card.emoji}
              </div>
            </motion.div>
          </button>
        );
      })}
    </div>
  );
}

/* --------------------------- sequence ----------------------------- */
function SequenceEngine({ round, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "sequence" }> }) {
  const [showing, setShowing] = useState(true);
  const [active, setActive] = useState<number | null>(null);
  const [input, setInput] = useState<number[]>([]);

  useEffect(() => {
    setShowing(true);
    setInput([]);
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      if (i >= round.steps.length) {
        timers.push(setTimeout(() => { setActive(null); setShowing(false); }, 400));
        return;
      }
      const step = round.steps[i];
      timers.push(setTimeout(() => { setActive(step); sfx.tick(); }, 0));
      timers.push(setTimeout(() => { setActive(null); i += 1; run(); }, 520));
    };
    timers.push(setTimeout(run, 600));
    return () => timers.forEach(clearTimeout);
  }, [round]);

  const tap = (i: number) => {
    if (showing || disabled) return;
    sfx.pop();
    setActive(i);
    setTimeout(() => setActive(null), 160);
    const next = [...input, i];
    setInput(next);
    const pos = next.length - 1;
    if (next[pos] !== round.steps[pos]) { onResult(false); return; }
    if (next.length === round.steps.length) onResult(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <span className="chip bg-slate-100 text-slate-600">
        {showing ? "👀" : "👆"} {input.length}/{round.steps.length}
      </span>
      <div className="grid grid-cols-2 gap-3">
        {round.palette.map((tile, i) => (
          <motion.button key={i} onClick={() => tap(i)}
            animate={{ scale: active === i ? 1.12 : 1, filter: active === i ? "brightness(1.35)" : "brightness(1)" }}
            className={`flex h-24 w-24 items-center justify-center rounded-3xl text-4xl shadow-md ring-2 transition ${
              active === i ? "bg-amber-100 ring-amber-400" : "bg-white ring-slate-200"
            } ${showing ? "pointer-events-none" : ""}`}>
            {tile.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- reaction ----------------------------- */
function ReactionEngine({ round, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "reaction" }> }) {
  const [shown, setShown] = useState<Tile | null>(null);
  const [isTarget, setIsTarget] = useState(false);

  useEffect(() => {
    setShown(null);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      const useTarget = Math.random() > 0.45;
      const tile = useTarget ? round.target : round.decoys[Math.floor(Math.random() * round.decoys.length)];
      setShown(tile);
      setIsTarget(useTarget);
      timers.push(setTimeout(() => { if (!cancelled) { setShown(null); timers.push(setTimeout(cycle, 350)); } }, 950));
    };
    timers.push(setTimeout(cycle, 700));
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [round]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-200">
        <span className="text-xs font-semibold text-inksoft">🎯</span>
        <span className="text-2xl">{round.target.emoji}</span>
      </div>
      <button disabled={disabled}
        onClick={() => { if (shown) onResult(isTarget); }}
        className="flex h-56 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-inner active:scale-[0.99]">
        <AnimatePresence mode="wait">
          {shown ? (
            <motion.span key={`${shown.emoji ?? "x"}-${isTarget ? 1 : 0}`} initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}
              className="text-7xl">{shown.emoji}</motion.span>
          ) : (
            <motion.span key="wait" initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} exit={{ opacity: 0 }}
              className="text-3xl text-white">···</motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

/* ---------------------------- build ------------------------------- */
function BuildEngine({ round, hintMask, disabled, onResult, t }: EngineProps & { round: Extract<Round, { kind: "build" }> }) {
  const [slots, setSlots] = useState<(string | null)[]>([]);
  const [pool, setPool] = useState<{ ch: string; used: boolean }[]>([]);

  useEffect(() => {
    setSlots(Array(round.word.length).fill(null));
    setPool(round.word.split("").sort(() => Math.random() - 0.5).map((ch) => ({ ch, used: false })));
  }, [round]);

  // hint reveals letters directly into their slot
  useEffect(() => {
    if (!hintMask.length) return;
    setSlots((prev) => {
      const next = [...prev];
      hintMask.forEach((i) => { next[i] = round.word[i]; });
      return next;
    });
    setPool((prev) => {
      const next = prev.map((p) => ({ ...p }));
      hintMask.forEach((i) => {
        const letter = round.word[i];
        const hit = next.find((p) => p.ch === letter && !p.used);
        if (hit) hit.used = true;
      });
      return next;
    });
  }, [hintMask, round.word]);

  const place = (poolIdx: number) => {
    if (disabled || pool[poolIdx].used) return;
    const slotIdx = slots.findIndex((s) => s === null);
    if (slotIdx === -1) return;
    sfx.pop();
    const nextSlots = [...slots];
    nextSlots[slotIdx] = pool[poolIdx].ch;
    const nextPool = pool.map((p, i) => (i === poolIdx ? { ...p, used: true } : p));
    setSlots(nextSlots);
    setPool(nextPool);
    if (nextSlots.every((s) => s !== null)) {
      const guess = nextSlots.join("");
      setTimeout(() => onResult(guess === round.word, guess === round.word ? undefined : round.word), 180);
    }
  };

  const clearSlot = (i: number) => {
    if (disabled || slots[i] === null || hintMask.includes(i)) return;
    const letter = slots[i]!;
    sfx.pop();
    setSlots(slots.map((s, j) => (j === i ? null : s)));
    const idx = pool.findIndex((p) => p.ch === letter && p.used);
    if (idx >= 0) setPool(pool.map((p, j) => (j === idx ? { ...p, used: false } : p)));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <span className="text-6xl">{round.emoji}</span>
      <span className="chip bg-slate-100 text-slate-600">{round.clue}</span>

      <div className="flex flex-wrap justify-center gap-1.5">
        {slots.map((s, i) => (
          <button key={i} onClick={() => clearSlot(i)}
            className={`flex h-12 w-10 items-center justify-center rounded-xl font-display text-xl font-bold transition ${
              hintMask.includes(i)
                ? "bg-amber-400 text-white"
                : s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-300"
            }`}>
            {s ?? "·"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {pool.map((p, i) => (
          <button key={i} onClick={() => place(i)} disabled={p.used}
            className={`flex h-12 w-11 items-center justify-center rounded-xl font-display text-xl font-bold shadow-sm ring-1 transition active:scale-90 ${
              p.used ? "pointer-events-none opacity-25 ring-slate-200" : "bg-white text-ink ring-slate-200"
            }`}>
            {p.ch}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 text-[10px] font-semibold text-inksoft">
        <span className="chip bg-amber-50 text-amber-700">{t("hint_first")}</span>
        <span className="chip bg-amber-50 text-amber-700">{t("hint_last")}</span>
        <span className="chip bg-amber-50 text-amber-700">{t("hint_middle")}</span>
      </div>
    </div>
  );
}

/* ---------------------------- order ------------------------------- */
function OrderEngine({ round, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "order" }> }) {
  const [tapped, setTapped] = useState<number[]>([]);
  useEffect(() => setTapped([]), [round]);

  const sorted = useMemo(
    () => [...round.items].sort((a, b) => (round.ascending ? a.value - b.value : b.value - a.value)),
    [round]
  );

  const tap = (i: number) => {
    if (disabled || tapped.includes(i)) return;
    const expected = sorted[tapped.length].value;
    if (round.items[i].value !== expected) { onResult(false); return; }
    sfx.pop();
    const next = [...tapped, i];
    setTapped(next);
    if (next.length === round.items.length) onResult(true);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex min-h-12 flex-wrap items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-4 py-2 ring-1 ring-emerald-200">
        {tapped.length === 0 && <span className="text-xs font-semibold text-emerald-700">1 → {round.items.length}</span>}
        {tapped.map((i) => (
          <span key={i} className="rounded-lg bg-emerald-500 px-2.5 py-1 font-display text-sm font-bold text-white">
            {round.items[i].label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {round.items.map((item, i) => (
          <button key={i} onClick={() => tap(i)} disabled={tapped.includes(i)}
            className={`flex h-16 items-center justify-center rounded-2xl font-display text-xl font-bold shadow-sm ring-1 transition active:scale-95 ${
              tapped.includes(i) ? "pointer-events-none bg-emerald-100 text-emerald-600 ring-emerald-200" : "bg-white text-ink ring-slate-200"
            }`}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- sort ------------------------------- */
function SortEngine({ round, hintMask, disabled, onResult }: EngineProps & { round: Extract<Round, { kind: "sort" }> }) {
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => setPicked(null), [round]);

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.span key={round.item.emoji} initial={{ scale: 0.4, y: -14 }} animate={{ scale: 1, y: 0 }}
        className="text-7xl">{round.item.emoji}</motion.span>
      <div className="grid w-full grid-cols-3 gap-2.5">
        {round.bins.map((bin, i) => {
          const hidden = hintMask.includes(i);
          const isAnswer = i === round.answer;
          const state = picked === null ? "ring-slate-200"
            : isAnswer ? "ring-2 ring-emerald-500 bg-emerald-50"
              : picked === i ? "ring-2 ring-rose-500 bg-rose-50 shake" : "opacity-40";
          return (
            <button key={i} disabled={disabled || hidden}
              onClick={() => { setPicked(i); onResult(i === round.answer); }}
              className={`flex flex-col items-center gap-1 rounded-2xl bg-white py-4 shadow-sm ring-1 transition active:scale-95 ${state} ${
                hidden ? "pointer-events-none opacity-20" : ""
              }`}>
              <span className="text-3xl">{bin.emoji}</span>
              <span className="font-display text-xs font-bold text-ink">{bin.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
