"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe, X } from "lucide-react";
import { LANGS } from "@/i18n/dictionaries";
import { useApp } from "./providers";
import { sfx } from "@/lib/sounds";

export function LanguagePicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang, setLang, t } = useApp();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#17103A]/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
            initial={{ y: 60, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 60, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Globe className="h-5 w-5" />
                </span>
                {t("lang_picker")}
              </h3>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label={t("common_close")}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {LANGS.map((l) => {
                const active = l.code === lang;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      sfx.pop();
                      onClose();
                    }}
                    className={`group flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-start transition ${
                      active
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-100 bg-white hover:border-violet-200 hover:bg-violet-50/50"
                    }`}
                  >
                    <span>
                      <span className="block font-display text-base font-bold text-ink">
                        {l.native}
                      </span>
                      <span className="block text-xs font-semibold text-slate-400">
                        {l.english}
                      </span>
                    </span>
                    {active && (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
