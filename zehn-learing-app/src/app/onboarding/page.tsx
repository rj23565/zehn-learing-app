"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers";
import { Mascot } from "@/components/Mascot";
import { Avatar, AVATARS } from "@/components/Avatar";
import { LANGS } from "@/i18n/dictionaries";
import { sfx } from "@/lib/sounds";

export default function Onboarding() {
  const { status, lang, setLang, t, completeOnboarding } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("owl");
  const [grade, setGrade] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "ready") router.replace("/dashboard");
  }, [status, router]);

  const canNext = step === 0 || (step === 1 ? name.trim().length > 0 : grade !== null);

  const go = async () => {
    if (step < 2) {
      sfx.pop();
      setStep(step + 1);
      return;
    }
    setSaving(true);
    await completeOnboarding({ name: name.trim(), grade: grade ?? 1, avatar });
    sfx.win();
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 py-8">
      <div className="flex items-center justify-center gap-2.5">
        <Mascot size={52} mood={step > 0 ? "happy" : "idle"} />
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">{t("ob_welcome")}</h1>
          <p className="text-sm font-semibold text-inksoft">{t("ob_sub")}</p>
        </div>
      </div>

      {/* progress dots */}
      <div className="mt-7 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span key={i}
            className={`h-2.5 rounded-full ${i === step ? "w-8 bg-violet-600" : i < step ? "w-2.5 bg-emerald-400" : "w-2.5 bg-violet-200"}`}
            layout transition={{ type: "spring", bounce: 0.4 }} />
        ))}
      </div>

      <div className="relative mt-8 flex-1">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">{t("ob_lang")}</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {LANGS.map((l) => (
                  <button key={l.code}
                    onClick={() => { setLang(l.code); sfx.pop(); }}
                    className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3.5 transition ${
                      lang === l.code ? "border-violet-500 bg-violet-50" : "border-violet-100 bg-white hover:border-violet-300"
                    }`}>
                    <span>
                      <span className="block font-display text-base font-bold text-ink">{l.native}</span>
                      <span className="block text-xs font-semibold text-inksoft">{l.english}</span>
                    </span>
                    {lang === l.code && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">{t("ob_name")}</h2>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                placeholder={t("ob_name_ph")}
                className="input-soft text-center font-display text-lg"
                maxLength={24}
              />
              <h2 className="mb-3 mt-8 text-center font-display text-xl font-bold text-ink">{t("ob_avatar")}</h2>
              <div className="grid grid-cols-5 gap-2.5">
                {AVATARS.map((a) => (
                  <button key={a.id} onClick={() => { setAvatar(a.id); sfx.flip(); }}
                    className={`rounded-2xl p-1.5 transition ${avatar === a.id ? "bg-violet-200 ring-2 ring-violet-500 scale-105" : "bg-white ring-1 ring-violet-100"}`}>
                    <Avatar id={a.id} size={46} className="mx-auto" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">{t("ob_grade")}</h2>
              <div className="grid grid-cols-3 gap-2.5">
                <button onClick={() => { setGrade(0); sfx.pop(); }}
                  className={`col-span-3 flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 font-display font-bold transition ${
                    grade === 0 ? "border-violet-500 bg-violet-50 text-violet-700" : "border-violet-100 bg-white text-ink hover:border-violet-300"
                  }`}>
                  <GraduationCap className="h-5 w-5" />
                  {t("ob_kg")}
                </button>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <button key={g} onClick={() => { setGrade(g); sfx.pop(); }}
                    className={`rounded-2xl border-2 px-2 py-3 font-display text-sm font-bold transition ${
                      grade === g ? "border-violet-500 bg-violet-600 text-white shadow-lg" : "border-violet-100 bg-white text-ink hover:border-violet-300"
                    }`}>
                    {t("ob_class", { n: g })}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="btn-ghost !px-4" aria-label={t("common_back")}>
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <button onClick={go} disabled={!canNext || saving}
          className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> {t("ob_creating")}</>
          ) : step === 2 ? (
            <><Sparkles className="h-5 w-5" /> {t("ob_go")}</>
          ) : (
            <>{t("common_next")} <ArrowRight className="h-5 w-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
