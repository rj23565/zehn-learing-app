"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Brain, Cog, GraduationCap, Landmark, Lightbulb, SendHorizonal,
  Sparkles, Square, Star, Volume2,
} from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { gradeToBand } from "@/db/curriculum";
import { useSpeech } from "@/hooks/useSpeech";
import { useTranslate } from "@/hooks/useTranslate";
import { sfx } from "@/lib/sounds";
import {
  genTutorQuestion, produceReply, TUTOR_GREETING, TUTOR_QUIZ_INTRO,
  type TutorAction, type TutorQuestion, type TutorSubject,
} from "@/lib/tutor";

type Msg = {
  id: number;
  role: "user" | "assistant";
  text: string;
  actions?: TutorAction[];
  quiz?: TutorQuestion & { answered?: number | null };
};

const SUBJECTS: { id: TutorSubject; icon: typeof Brain; label: string }[] = [
  { id: "math", icon: Cog, label: "Math" },
  { id: "science", icon: Sparkles, label: "Science" },
  { id: "english", icon: Landmark, label: "English" },
  { id: "logic", icon: Lightbulb, label: "Logic" },
];

export default function TutorPage() {
  const { status, profile, lang, t } = useApp();
  const router = useRouter();
  const { say, stop, supported } = useSpeech(lang);
  const voiceGuide = useVoice();

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [quiz, setQuiz] = useState<{
    mode: "idle" | "pick" | "active";
    subject: TutorSubject;
    level: number;
    streak: number;
    totalCorrect: number;
  }>({ mode: "idle", subject: "math", level: 1, streak: 0, totalCorrect: 0 });

  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextId = () => ++idRef.current;

  const bandLabel = profile ? t(`band_${gradeToBand(profile.grade)}`) : "";
  const name = profile?.name ?? "friend";

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  useEffect(() => {
    if (status === "ready" && msgs.length === 0) {
      setMsgs([{ id: nextId(), role: "assistant", text: TUTOR_GREETING(name) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);



  useEffect(() => () => stop(), [stop]);

  /* translate assistant texts */
  const assistantTexts = useMemo(
    () => msgs.filter((m) => m.role === "assistant").map((m) => m.text),
    [msgs]
  );
  const { texts: trTexts, loading: translating } = useTranslate(assistantTexts, lang);
  const trFor = useCallback(
    (m: Msg) => {
      if (m.role === "user") return m.text;
      const idx = msgs.filter((x) => x.role === "assistant").indexOf(m);
      return trTexts[idx] ?? m.text;
    },
    [msgs, trTexts]
  );

  // read every new tutor reply aloud in the chosen language
  useEffect(() => {
    const lastMsg = msgs[msgs.length - 1];
    if (!lastMsg || lastMsg.role !== "assistant") return;
    const idx = msgs.filter((m) => m.role === "assistant").length - 1;
    voiceGuide.speak(trTexts[idx] ?? lastMsg.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgs, trTexts]);

  const pushAssistant = useCallback((msg: Omit<Msg, "id" | "role">, delay = 650) => {
    setTyping(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMsgs((ms) => [...ms, { ...msg, id: nextId(), role: "assistant" }]);
        setTyping(false);
        resolve();
      }, delay + Math.random() * 350);
    });
  }, []);

  /* ------------------------- quiz engine ------------------------- */
  const askQuestion = useCallback(
    (subject: TutorSubject, level: number) => {
      const q = genTutorQuestion(subject, level);
      void pushAssistant({ text: q.q, quiz: { ...q, answered: null } }, 500);
    },
    [pushAssistant]
  );

  const submitXp = useCallback(async (correct: number, level: number) => {
    if (correct <= 0) return;
    try {
      await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({
          game: `tutor:${Math.min(3, Math.max(1, Math.ceil(level / 2)))}`,
          score: correct * 10,
          level: Math.min(3, Math.max(1, Math.ceil(level / 2))),
          xp: Math.min(20, 4 + correct * 2),
        }),
      });
    } catch { /* ignore */ }
  }, []);

  const answerQuiz = (msgId: number, optIdx: number) => {
    const target = msgs.find((m) => m.id === msgId);
    if (!target?.quiz || target.quiz.answered != null) return;
    const correct = optIdx === target.quiz.a;
    if (correct) sfx.correct();
    else sfx.wrong();

    setMsgs((ms) =>
      ms.map((m) => (m.id === msgId && m.quiz ? { ...m, quiz: { ...m.quiz, answered: optIdx } } : m))
    );

    const newStreak = correct ? quiz.streak + 1 : 0;
    const newTotal = quiz.totalCorrect + (correct ? 1 : 0);
    const newLevel = 1 + Math.floor(newStreak / 2);

    setQuiz((q) => ({ ...q, streak: newStreak, totalCorrect: newTotal, level: newLevel }));

    const feedback = correct
      ? `Correct. ${target.quiz.why}${newStreak > 0 && newStreak % 2 === 0 ? " Level up — getting harder." : ""}`
      : `Not quite — the answer is "${target.quiz.options[target.quiz.a]}". ${target.quiz.why}`;

    void pushAssistant({ text: feedback }, 550).then(() => {
      if (newTotal > 0 && newTotal % 5 === 0) {
        void submitXp(newTotal, newLevel);
        void pushAssistant(
          { text: `Streak checkpoint — ${newTotal} correct so far. I've banked your XP. Keep going or stop anytime.` },
          500
        );
      }
      if (quiz.mode === "active") askQuestion(quiz.subject, newLevel);
    });
  };

  const stopQuiz = useCallback(() => {
    const total = quiz.totalCorrect;
    void pushAssistant({
      text: `Quiz complete — ${total} correct answers, peak streak ${quiz.streak}. ${total >= 8 ? "Outstanding. Your brain is clearly warmed up." : total >= 3 ? "Solid work. Come back tomorrow and beat it." : "Every attempt counts. Try again whenever you're ready."}`,
    });
    void submitXp(total, quiz.level);
    setQuiz((q) => ({ ...q, mode: "idle", streak: 0, totalCorrect: 0, level: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, pushAssistant, submitXp]);

  /* ------------------------- chat input ------------------------- */
  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMsgs((ms) => [...ms, { id: nextId(), role: "user", text }]);
    sfx.pop();
    setTyping(true);
    fetch("/api/tutor", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({
        message: text, name, band: bandLabel,
        grade: profile?.grade ?? 1, language: lang,
      }),
    })
      .then((r) => r.json())
      .then((d: { text?: string; actions?: TutorAction[] }) => {
        setTyping(false);
        const reply = d.text
          ? { text: d.text, actions: d.actions }
          : produceReply(text, { name, gradeBandLabel: bandLabel });
        setMsgs((ms) => [...ms, { ...reply, id: nextId(), role: "assistant" }]);
      })
      .catch(() => {
        setTyping(false);
        const reply = produceReply(text, { name, gradeBandLabel: bandLabel });
        setMsgs((ms) => [...ms, { ...reply, id: nextId(), role: "assistant" }]);
      });
  };

  const startQuizPick = () => {
    setMsgs((ms) => [...ms, { id: nextId(), role: "user", text: t("tutor_quiz") }]);
    void pushAssistant({ text: TUTOR_QUIZ_INTRO });
    setQuiz((q) => ({ ...q, mode: "pick", streak: 0, totalCorrect: 0, level: 1 }));
  };

  const pickSubject = (subject: TutorSubject) => {
    setQuiz((q) => ({ ...q, mode: "active", subject }));
    sfx.whoosh();
    void pushAssistant({
      text: `${subject.charAt(0).toUpperCase() + subject.slice(1)} quiz — starting at level 1. Answer by tapping an option below each question.`,
    }).then(() => askQuestion(subject, 1));
  };

  const chips = [
    { key: "tutor_explain", cmd: () => { setInput("explain "); } },
    { key: "tutor_quiz", cmd: startQuizPick },
    { key: "tutor_tips", cmd: () => send("__tips__") },
    { key: "tutor_motive", cmd: () => send("__motive__") },
    { key: "tutor_plan", cmd: () => send("__plan__") },
  ];

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#070a18] text-slate-100">
      <div className="aurora pointer-events-none absolute inset-x-0 top-[-20%] h-[55vh] opacity-60" />
      <div className="stage-pattern pointer-events-none absolute inset-0 opacity-40" />

      {/* header */}
      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center gap-3 px-4 pt-4">
        <button onClick={() => router.push("/dashboard")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 backdrop-blur ring-1 ring-white/10 transition hover:bg-white/15"
          aria-label={t("common_back")}>
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_8px_24px_-6px_rgba(99,102,241,.6)]">
          <GraduationCap className="h-5.5 w-5.5 text-white" />
        </span>
        <div className="flex-1">
          <h1 className="font-display text-lg font-bold tracking-tight">{t("tutor_title")}</h1>
          <p className="text-xs font-medium text-slate-400">{t("tutor_sub")}</p>
        </div>
        {translating && (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-300">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {t("ls_translating")}
          </span>
        )}
      </header>

      {/* messages */}
      <div ref={scrollRef} className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-5">
        {msgs.map((m) => {
          const isUser = m.role === "user";
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.2 }}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${isUser ? "rounded-3xl rounded-br-md bg-gradient-to-br from-indigo-600 to-violet-600 px-4.5 py-3 shadow-lg" : "rounded-3xl rounded-bl-md bg-white/7 px-4.5 py-3 ring-1 ring-white/10 backdrop-blur"}`}>
                <p className="whitespace-pre-line text-[15px] font-medium leading-relaxed text-slate-100">
                  {trFor(m)}
                </p>

                {/* speak */}
                {!isUser && supported && (
                  <button onClick={() => say(trFor(m), { rate: 0.95 })}
                    className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300 transition hover:text-indigo-200">
                    <Volume2 className="h-3.5 w-3.5" /> {t("common_listen")}
                  </button>
                )}

                {/* actions */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <Link key={a.href} href={a.href}
                        className="chip bg-indigo-500/25 text-indigo-200 ring-1 ring-indigo-400/30 transition hover:bg-indigo-500/40">
                        {a.label} →
                      </Link>
                    ))}
                  </div>
                )}

                {/* quiz options */}
                {m.quiz && (
                  <div className="mt-3 space-y-1.5">
                    {m.quiz.options.map((opt, oi) => {
                      const answered = m.quiz!.answered;
                      const isAns = oi === m.quiz!.a;
                      return (
                        <button key={oi} disabled={answered != null}
                          onClick={() => answerQuiz(m.id, oi)}
                          className={`block w-full rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition active:scale-[0.98] ${
                            answered != null && isAns
                              ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-200"
                              : answered === oi
                                ? "border-rose-400/60 bg-rose-400/15 text-rose-200"
                                : "border-white/10 bg-white/5 text-slate-100 hover:border-indigo-400/50 hover:bg-indigo-500/15"
                          }`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* typing */}
        <AnimatePresence>
          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-3xl rounded-bl-md bg-white/7 px-5 py-3.5 ring-1 ring-white/10">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot h-2 w-2 rounded-full bg-indigo-300" />
                ))}
                <span className="ms-2 text-[11px] font-semibold text-slate-400">{t("tutor_typing")}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* quiz status / subject picker */}
      <div className="relative z-10 mx-auto w-full max-w-2xl px-4">
        {quiz.mode === "pick" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-3 flex flex-wrap gap-1.5">
            {SUBJECTS.map((s) => (
              <button key={s.id} onClick={() => pickSubject(s.id)}
                className="chip bg-white/8 px-4 py-2.5 text-slate-100 ring-1 ring-white/15 backdrop-blur transition hover:bg-indigo-500/30">
                <s.icon className="h-4 w-4 text-indigo-300" /> {s.label}
              </button>
            ))}
          </motion.div>
        )}
        {quiz.mode === "active" && (
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/6 px-4 py-2.5 ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              Lv {quiz.level} · {quiz.totalCorrect} ✓ · streak {quiz.streak}
            </div>
            <button onClick={stopQuiz}
              className="chip bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30 transition hover:bg-rose-500/30">
              <Square className="h-3 w-3 fill-current" /> {t("tutor_stop")}
            </button>
          </div>
        )}

        {/* quick chips */}
        {quiz.mode === "idle" && (
          <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {chips.map((c) => (
              <button key={c.key} onClick={c.cmd}
                className="chip shrink-0 bg-white/7 px-3.5 py-2 text-slate-200 ring-1 ring-white/12 backdrop-blur transition hover:bg-indigo-500/25">
                {t(c.key)}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <form onSubmit={(e) => { e.preventDefault(); send(); }}
          className="mb-4 flex items-center gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={t("tutor_ph")}
            className="flex-1 rounded-2xl border border-white/10 bg-white/7 px-4.5 py-3.5 text-[15px] font-medium text-slate-100 outline-none backdrop-blur transition placeholder:text-slate-500 focus:border-indigo-400/60" />
          <button type="submit" disabled={!input.trim() || typing}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg transition active:scale-95 disabled:opacity-40"
            aria-label={t("tutor_send")}>
            <SendHorizonal className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
