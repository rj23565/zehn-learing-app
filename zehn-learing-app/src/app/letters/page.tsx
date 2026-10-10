"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, Check, Link2, PartyPopper, RotateCcw, Shuffle, Sparkles,
  Type, Volume2, X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { useSpeech } from "@/hooks/useSpeech";
import type { LangCode } from "@/i18n/dictionaries";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";
import {
  ALPHABETS, alphabetFor, defaultAlphabet, formAt,
  type Alphabet, type Letter, type SpellWord,
} from "@/lib/alphabets";

type Tab = "letters" | "spell" | "join";

export default function LettersLab() {
  const { status, lang, t } = useApp();
  const router = useRouter();
  const voice = useVoice();

  const [alpha, setAlpha] = useState<Alphabet>(() => defaultAlphabet(lang));
  const [tab, setTab] = useState<Tab>("letters");
  const [active, setActive] = useState<Letter | null>(null);

  // a dedicated speech channel that always uses the SCRIPT's own language
  const scriptSpeech = useSpeech(alpha.code as LangCode);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  useEffect(() => {
    setAlpha(defaultAlphabet(lang));
    setActive(null);
  }, [lang]);

  const sayScript = useCallback(
    (text: string) => {
      if (!voice.enabled) return;
      scriptSpeech.say(text, { rate: 0.85 });
    },
    [voice.enabled, scriptSpeech]
  );

  const isRTL = alpha.dir === "rtl";

  return (
    <AppShell>
      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
            <Type className="h-5.5 w-5.5 text-emerald-600" /> {t("lt_title")}
          </h1>
          <p className="mt-0.5 text-xs font-medium text-inksoft sm:text-sm">{t("lt_sub")}</p>
        </div>
      </div>

      {/* script picker */}
      <div className="mt-4">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-inksoft">
          {t("lt_script")}
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ALPHABETS.map((a) => (
            <button key={a.code}
              onClick={() => { setAlpha(alphabetFor(a.code)); setActive(null); sfx.pop(); }}
              className={`chip shrink-0 gap-1.5 px-3.5 py-2 transition ${
                alpha.code === a.code
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-ink ring-1 ring-slate-200 hover:ring-emerald-300"
              }`}>
              <span className="font-display text-sm">{a.native}</span>
              <span className="text-[10px] opacity-70">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* note */}
      <div className="mt-3 flex items-start gap-2 rounded-2xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p className={`text-xs font-semibold leading-relaxed text-emerald-900 ${isRTL ? "text-right" : ""}`}
          dir={alpha.dir}>
          {alpha.note}
        </p>
      </div>

      {/* counts */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="chip bg-slate-100 text-slate-600">
          {t("lt_count", { n: alpha.letters.length })}
        </span>
        <span className="chip bg-violet-50 text-violet-700">
          {alpha.words.length} {t("lt_words")}
        </span>
        {alpha.script === "arabic" && (
          <span className="chip bg-sky-50 text-sky-700">{t("lt_joining")}</span>
        )}
      </div>

      {/* tabs */}
      <div className="mt-4 grid grid-cols-3 gap-1.5 rounded-2xl bg-slate-100 p-1">
        {([
          ["letters", t("lt_tab_letters")],
          ["spell", t("lt_tab_spell")],
          ["join", t("lt_tab_join")],
        ] as [Tab, string][]).map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); sfx.pop(); }}
            className={`rounded-xl py-2 font-display text-[11px] font-bold transition sm:text-xs ${
              tab === id ? "bg-white text-ink shadow-sm" : "text-inksoft"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- LETTERS ---------------- */}
      {tab === "letters" && (
        <>
          <div className="mt-4 grid grid-cols-4 gap-2 xs:grid-cols-5 sm:grid-cols-6">
            {alpha.letters.map((letter) => (
              <motion.button key={letter.char} whileTap={{ scale: 0.9 }}
                onClick={() => { setActive(letter); sayScript(letter.char); sfx.pop(); }}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 transition ${
                  active?.char === letter.char
                    ? "ring-2 ring-emerald-500 bg-emerald-50"
                    : "ring-slate-200 hover:ring-emerald-300"
                }`}>
                <span className="font-display text-2xl font-bold leading-none text-ink sm:text-3xl">
                  {letter.char}
                </span>
                {letter.small && (
                  <span className="mt-0.5 font-display text-sm leading-none text-inksoft">{letter.small}</span>
                )}
                <span className="mt-1 text-base leading-none">{letter.emoji}</span>
              </motion.button>
            ))}
          </div>

          {/* letter detail */}
          <AnimatePresence>
            {active && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                className="card mt-4 overflow-hidden p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 font-display text-3xl font-bold text-white">
                    {active.char}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-base font-bold text-ink">{active.name}</div>
                    <div className="text-xs font-semibold text-inksoft">
                      {t("lt_sound")}: &ldquo;{active.sound}&rdquo;
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-xl">{active.emoji}</span>
                      <span className="font-display text-sm font-bold text-ink" dir={alpha.dir}>{active.word}</span>
                      <span className="text-[10px] font-semibold text-inksoft">({active.meaning})</span>
                    </div>
                  </div>
                  <button onClick={() => { setActive(null); }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* big + small (Latin) or character + pinyin (Chinese) */}
                {active.small && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-indigo-50 p-3 text-center ring-1 ring-indigo-100">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                        {alpha.script === "han" ? t("lt_char") : t("lt_big")}
                      </div>
                      <div className="font-display text-4xl font-bold text-indigo-700">{active.char}</div>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3 text-center ring-1 ring-amber-100">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        {alpha.script === "han" ? t("lt_pinyin") : t("lt_small")}
                      </div>
                      <div className="font-display text-4xl font-bold text-amber-700">{active.small}</div>
                    </div>
                  </div>
                )}

                {/* positional forms */}
                {active.forms && (
                  <div className="mt-3">
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-inksoft">
                      {t("lt_forms")}
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        [t("lt_alone"), active.char, "bg-slate-50 text-slate-700 ring-slate-200"],
                        [t("lt_start"), active.forms.initial, "bg-emerald-50 text-emerald-700 ring-emerald-200"],
                        [t("lt_middle"), active.forms.medial, "bg-sky-50 text-sky-700 ring-sky-200"],
                        [t("lt_end"), active.forms.final, "bg-violet-50 text-violet-700 ring-violet-200"],
                      ].map(([label, glyph, tint]) => (
                        <div key={label} className={`rounded-xl p-2 text-center ring-1 ${tint}`}>
                          <div className="font-display text-2xl font-bold leading-tight" dir="rtl">{glyph}</div>
                          <div className="mt-0.5 text-[9px] font-bold">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => sayScript(`${active.char}. ${active.word}`)}
                  className="btn-primary mt-3 w-full !py-2.5 text-sm">
                  <Volume2 className="h-4 w-4" /> {t("lt_hear")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ---------------- SPELL ---------------- */}
      {tab === "spell" && <SpellBuilder alpha={alpha} sayScript={sayScript} t={t} />}

      {/* ---------------- JOIN ---------------- */}
      {tab === "join" && (
        <div className="mt-4 space-y-2.5">
          {alpha.joinDemo.map((demo, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="card flex items-center gap-2 p-4">
              <span className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-slate-100 px-2 font-display text-xl font-bold text-ink" dir={alpha.dir}>
                {demo.a}
              </span>
              <span className="font-display text-lg font-bold text-emerald-600">+</span>
              <span className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-slate-100 px-2 font-display text-xl font-bold text-ink" dir={alpha.dir}>
                {demo.b}
              </span>
              <span className="font-display text-lg font-bold text-emerald-600">=</span>
              <motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-2 font-display text-2xl font-bold text-white" dir={alpha.dir}>
                {demo.result}
              </motion.span>
              <button onClick={() => sayScript(demo.result)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-slate-200">
                <Volume2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          <div className="flex items-start gap-2 rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100">
            <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
            <p className="text-xs font-semibold leading-relaxed text-sky-900">{t("lt_join_note")}</p>
          </div>
        </div>
      )}
    </AppShell>
  );
}

/* ================================================================== */
/* Spelling builder — a + p + p + l + e = apple 🍎                     */
/* ================================================================== */

function SpellBuilder({
  alpha, sayScript, t,
}: {
  alpha: Alphabet;
  sayScript: (s: string) => void;
  t: (k: string, v?: Record<string, string | number>) => string;
}) {
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [pool, setPool] = useState<string[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const word: SpellWord = alpha.words[index % alpha.words.length];

  const reset = useCallback((w: SpellWord) => {
    setPlaced([]);
    setDone(false);
    setWrong(null);
    setPool([...w.parts].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => { reset(word); }, [word, reset]);
  useEffect(() => { setIndex(0); }, [alpha.code]);

  const letterMeta = (ch: string) => alpha.letters.find((l) => l.char === ch);

  const tap = (poolIdx: number) => {
    if (done) return;
    const ch = pool[poolIdx];
    const expected = word.parts[placed.length];
    if (ch !== expected) {
      setWrong(poolIdx);
      sfx.wrong();
      setTimeout(() => setWrong(null), 500);
      return;
    }
    sfx.pop();
    sayScript(ch);
    const nextPlaced = [...placed, poolIdx];
    setPlaced(nextPlaced);
    if (nextPlaced.length === word.parts.length) {
      setTimeout(() => {
        setDone(true);
        sfx.win();
        fireConfetti();
        sayScript(word.say);
      }, 350);
    }
  };

  const next = () => {
    setIndex((i) => (i + 1) % alpha.words.length);
    sfx.whoosh();
  };

  const isRTL = alpha.dir === "rtl";
  const joins = alpha.script === "arabic";

  return (
    <div className="mt-4 flex flex-col items-center gap-4">
      {/* picture card */}
      <motion.div key={word.joined} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card flex w-full flex-col items-center gap-1 p-5">
        <motion.span animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl sm:text-7xl">{word.emoji}</motion.span>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-inksoft">{word.meaning}</span>
      </motion.div>

      {/* equation */}
      <div className="w-full rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <div className={`flex flex-wrap items-center justify-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
          {word.parts.map((ch, i) => {
            const filled = i < placed.length;
            return (
              <div key={i} className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}>
                <motion.span
                  animate={filled ? { scale: [0.6, 1.15, 1] } : {}}
                  className={`flex h-11 w-10 items-center justify-center rounded-xl font-display text-xl font-bold transition ${
                    filled ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-300"
                  }`}>
                  {filled ? ch : "?"}
                </motion.span>
                {i < word.parts.length - 1 && (
                  <span className="font-display text-base font-bold text-emerald-500">+</span>
                )}
              </div>
            );
          })}

          <span className="mx-1 font-display text-lg font-bold text-slate-400">=</span>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.span key="done" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-2 font-display text-2xl font-bold text-white"
                dir={alpha.dir}>
                {word.joined}
                <span className="text-xl">{word.emoji}</span>
              </motion.span>
            ) : (
              <motion.span key="pending" className="rounded-xl bg-slate-100 px-4 py-2 font-display text-xl font-bold text-slate-300">
                ?
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* joining note for Arabic-script languages */}
        {done && joins && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-2.5 text-center text-[11px] font-semibold leading-relaxed text-sky-700">
            {t("lt_shape_note")}
          </motion.p>
        )}
      </div>

      {/* letter pool */}
      {!done ? (
        <>
          <p className="text-xs font-semibold text-inksoft">{t("lt_tap_letters")}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {pool.map((ch, i) => {
              const used = placed.includes(i);
              const meta = letterMeta(ch);
              return (
                <motion.button key={i} whileTap={{ scale: 0.88 }} onClick={() => tap(i)} disabled={used}
                  className={`flex h-16 w-14 flex-col items-center justify-center rounded-2xl shadow-sm ring-1 transition ${
                    used
                      ? "pointer-events-none bg-emerald-50 text-emerald-300 ring-emerald-100"
                      : wrong === i
                        ? "shake bg-rose-50 text-rose-600 ring-rose-300"
                        : "bg-white text-ink ring-slate-200 hover:ring-emerald-300"
                  }`}>
                  <span className="font-display text-2xl font-bold leading-none">{ch}</span>
                  {meta?.small && <span className="text-[10px] leading-none text-inksoft">{meta.small}</span>}
                </motion.button>
              );
            })}
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex w-full flex-col items-center gap-3">
          <div className="chip bg-emerald-100 px-4 py-2 text-emerald-700">
            <PartyPopper className="h-4 w-4" /> {t("lt_well_done")}
          </div>

          {/* how each letter looked inside the word */}
          {joins && (
            <div className="w-full rounded-2xl bg-sky-50 p-3 ring-1 ring-sky-100">
              <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-sky-700">
                {t("lt_forms")}
              </div>
              <div className="flex flex-wrap justify-center gap-1.5" dir="rtl">
                {word.parts.map((ch, i) => {
                  const meta = letterMeta(ch);
                  const prev = i > 0 ? letterMeta(word.parts[i - 1]) : undefined;
                  const prevJoins = i === 0 ? false : !(prev?.noJoinAfter ?? false);
                  const shape = meta ? formAt(meta, i, word.parts.length, prevJoins) : ch;
                  return (
                    <div key={i} className="rounded-xl bg-white px-2.5 py-1.5 text-center ring-1 ring-sky-200">
                      <div className="font-display text-xl font-bold text-sky-700">{shape}</div>
                      <div className="text-[9px] font-semibold text-slate-400">{ch}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex w-full gap-2">
            <button onClick={() => reset(word)} className="btn-ghost flex-1 !py-3 text-sm">
              <RotateCcw className="h-4 w-4" /> {t("learn_restart")}
            </button>
            <button onClick={next} className="btn-primary flex-1 !py-3 text-sm">
              {t("lt_next_word")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* word switcher */}
      <div className="flex w-full items-center gap-2 pt-1">
        <button onClick={next}
          className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-inksoft ring-1 ring-slate-200">
          <Shuffle className="h-3.5 w-3.5" /> {index + 1}/{alpha.words.length}
        </button>
        <div className="flex flex-1 gap-1">
          {alpha.words.map((w, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i === index ? "bg-emerald-500" : "bg-slate-200"}`} />
          ))}
        </div>
        <button onClick={() => sayScript(word.say)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-slate-200">
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
