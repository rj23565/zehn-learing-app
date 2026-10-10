"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, Camera, Check, FileText, ImagePlus, Loader2,
  NotebookPen, PartyPopper, Sparkles, Volume2, X,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { IconByName } from "@/components/IconByName";
import { useSpeech } from "@/hooks/useSpeech";
import { useTranslate } from "@/hooks/useTranslate";
import { sfx } from "@/lib/sounds";
import { fireConfetti } from "@/components/Confetti";
import type { UploadItem } from "@/lib/types";

const KINDS = [
  { id: "diary", icon: NotebookPen, key: "dy_kind_diary" },
  { id: "book", icon: BookOpen, key: "dy_kind_book" },
  { id: "page", icon: FileText, key: "dy_kind_page" },
];

/** Any book is welcome — from school subjects to story books & beyond */
const KNOWN_SUBJECTS = [
  "Math", "Science", "English", "Physics", "History", "Geography",
  "Computer", "Art", "Music", "Story", "General",
];

function compress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, 768 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export default function Diary() {
  const { status, lang, t } = useApp();
  const router = useRouter();
  const { say, supported } = useSpeech(lang);
  const fileRef = useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [kind, setKind] = useState("diary");
  const [subject, setSubject] = useState("Math");
  const [custom, setCustom] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneFlash, setDoneFlash] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch("/api/uploads", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setUploads(d.uploads ?? []))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
    if (status === "ready") load();
  }, [status, router, load]);

  // live-translate every visible plan step into the app language
  const planTexts = useMemo(
    () => uploads.slice(0, 12).flatMap((u) => u.plan.map((p) => p.text)),
    [uploads]
  );
  const { texts: trPlan } = useTranslate(planTexts, lang);
  const stepText = useCallback((upIndex: number, stepIndex: number, fallback: string) => {
    let base = 0;
    for (let i = 0; i < upIndex; i++) base += uploads[i].plan.length;
    return trPlan[base + stepIndex] ?? fallback;
  }, [uploads, trPlan]);

  const subjLabel = (s: string) =>
    KNOWN_SUBJECTS.includes(s) ? t(`subj_${s}`) : s;

  const pickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compress(file);
      setPhoto(dataUrl);
      sfx.pop();
    } catch { /* ignore */ }
    e.target.value = "";
  };

  const resolvedSubject = subject === "__other"
    ? (custom.trim().slice(0, 24) || "General")
    : subject;

  const submit = async () => {
    if (!photo || busy) return;
    setBusy(true);
    try {
      await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ kind, subject: resolvedSubject, topic: topic.trim(), imageData: photo }),
      });
      sfx.correct();
      setPhoto(null);
      setTopic("");
      setCustom("");
      load();
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (up: UploadItem, step: number) => {
    sfx.pop();
    const next = up.doneSteps.includes(step)
      ? up.doneSteps.filter((s) => s !== step)
      : [...up.doneSteps, step];
    setUploads((us) => us.map((u) => (u.id === up.id ? { ...u, doneSteps: next } : u)));
    const res = await fetch("/api/uploads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ id: up.id, step }),
    });
    const d = await res.json();
    if (d.allDone && d.xpAwarded > 0) {
      sfx.win();
      fireConfetti();
      setDoneFlash(up.id);
      setTimeout(() => setDoneFlash(null), 2600);
    }
    load();
  };

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-extrabold text-ink">{t("dy_title")}</h1>
      <p className="text-sm font-semibold text-inksoft">{t("dy_sub")}</p>

      {/* uploader card */}
      <div className="card mt-4 p-4">
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pickFile} />

        {!photo ? (
          <button onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-2xl border-3 border-dashed border-violet-200 bg-violet-50/60 py-9 transition hover:border-violet-400">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-violet-600 shadow-md">
              <Camera className="h-7 w-7" />
            </span>
            <span className="font-display text-base font-bold text-ink">{t("dy_add")}</span>
            <span className="max-w-60 text-center text-xs font-semibold text-inksoft">{t("dy_hint")}</span>
          </button>
        ) : (
          <div className="space-y-3.5">
            <div className="relative overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt="" className="max-h-56 w-full object-cover" />
              <button onClick={() => setPhoto(null)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-inksoft">{t("dy_kind")}</div>
              <div className="flex gap-2">
                {KINDS.map((k) => (
                  <button key={k.id} onClick={() => setKind(k.id)}
                    className={`chip flex-1 justify-center px-2 py-2 transition ${
                      kind === k.id ? "bg-violet-600 text-white" : "bg-violet-50 text-ink ring-1 ring-violet-100"
                    }`}>
                    <k.icon className="h-3.5 w-3.5" /> {t(k.key)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-inksoft">{t("dy_subject")}</div>
              <div className="flex flex-wrap gap-1.5">
                {KNOWN_SUBJECTS.map((s) => (
                  <button key={s} onClick={() => setSubject(s)}
                    className={`chip px-3 py-1.5 transition ${
                      subject === s ? "bg-emerald-500 text-white" : "bg-violet-50 text-ink ring-1 ring-violet-100"
                    }`}>
                    {subjLabel(s)}
                  </button>
                ))}
                <button onClick={() => setSubject("__other")}
                  className={`chip px-3 py-1.5 transition ${
                    subject === "__other" ? "bg-emerald-500 text-white" : "bg-violet-50 text-ink ring-1 ring-violet-100"
                  }`}>
                  {t("dy_other")}
                </button>
              </div>
              {subject === "__other" && (
                <motion.input initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  value={custom} onChange={(e) => setCustom(e.target.value.slice(0, 24))}
                  placeholder={t("dy_topic_ph")} className="input-soft mt-2 !py-2.5 text-sm" />
              )}
            </div>

            <div>
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wide text-inksoft">{t("dy_topic")}</div>
              <input value={topic} onChange={(e) => setTopic(e.target.value.slice(0, 80))}
                placeholder={t("dy_topic_ph")} className="input-soft !py-2.5 text-sm" />
            </div>

            <button onClick={submit} disabled={busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
              {busy ? t("dy_making") : t("dy_make")}
            </button>
          </div>
        )}
      </div>

      {/* uploads list */}
      {uploads.length === 0 && !photo && (
        <div className="card mt-5 flex flex-col items-center gap-2 p-8 text-center">
          <Sparkles className="h-8 w-8 text-violet-300" />
          <p className="text-sm font-semibold text-inksoft">{t("dy_empty")}</p>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {uploads.map((up, upIdx) => {
          const allDone = up.doneSteps.length >= up.plan.length && up.plan.length > 0;
          return (
            <motion.div key={up.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden">
              <div className="flex items-stretch">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={up.imageData} alt="" className="w-24 shrink-0 object-cover" />
                <div className="flex-1 p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="chip bg-violet-100 text-violet-700">{t(`dy_kind_${up.kind}`)}</span>
                    <span className="chip bg-emerald-100 text-emerald-700">{subjLabel(up.subject)}</span>
                    {allDone && <span className="chip bg-amber-100 text-amber-600">+15 XP</span>}
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-inksoft">
                    {new Date(up.createdAt).toLocaleDateString(lang, { day: "numeric", month: "short" })}
                    {" · "}{up.doneSteps.length}/{up.plan.length}
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100">
                    <motion.div className={`h-full rounded-full ${allDone ? "bg-emerald-400" : "bg-violet-500"}`}
                      animate={{ width: `${(up.doneSteps.length / Math.max(1, up.plan.length)) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* plan steps */}
              <div className="border-t border-violet-50 p-3.5">
                <AnimatePresence>
                  {doneFlash === up.id && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mb-2 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-600">
                      <PartyPopper className="h-4.5 w-4.5" /> {t("dy_all_done")}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="space-y-1.5">
                  {up.plan.map((step, i) => {
                    const done = up.doneSteps.includes(i);
                    const label = upIdx < 12 ? stepText(upIdx, i, step.text) : step.text;
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <button onClick={() => toggle(up, i)}
                          className={`flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 text-start transition ${
                            done ? "bg-emerald-50" : "bg-violet-50/60 hover:bg-violet-100/70"
                          }`}>
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                            done ? "bg-emerald-500 text-white" : "bg-white text-violet-400 ring-1 ring-violet-200"
                          }`}>
                            {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <IconByName name={step.icon} className="h-3.5 w-3.5" />}
                          </span>
                          <span className={`text-sm font-bold ${done ? "text-emerald-700 line-through" : "text-ink"}`}>
                            {label}
                          </span>
                        </button>
                        {supported && (
                          <button onClick={() => say(label)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-violet-500 ring-1 ring-violet-100"
                            aria-label={t("common_listen")}>
                            <Volume2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* quick links */}
                <div className="mt-2.5 flex gap-2">
                  {up.plan.find((p) => p.lessonId)?.lessonId && (
                    <button onClick={() => router.push(`/learn/${up.plan.find((p) => p.lessonId)!.lessonId}`)}
                      className="chip flex-1 justify-center bg-violet-600 px-3 py-2 text-white">
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180" /> {t("nav_learn")}
                    </button>
                  )}
                  {up.plan.find((p) => p.game)?.game && (
                    <button onClick={() => router.push(`/games/${up.plan.find((p) => p.game)!.game}`)}
                      className="chip flex-1 justify-center bg-emerald-500 px-3 py-2 text-white">
                      <ArrowLeft className="h-3.5 w-3.5 rotate-180" /> {t("gm_title")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
