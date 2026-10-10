"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Beaker, Plus, RotateCcw, Sparkles, Trash2, Volume2 } from "lucide-react";
import { useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { mixPaints, PAINTS, type Paint } from "@/lib/colors";
import { sfx } from "@/lib/sounds";

export type SavedColor = { hex: string; name: string; ryb: [number, number, number] };

const RECIPES: [string, string][] = [
  ["red", "yellow"], ["yellow", "blue"], ["red", "blue"],
  ["red", "white"], ["blue", "white"], ["black", "white"],
];

export function MixLab({
  saved, onSave, onUseColor, onRemove,
}: {
  saved: SavedColor[];
  onSave: (c: SavedColor) => void;
  onUseColor: (hex: string) => void;
  onRemove: (i: number) => void;
}) {
  const { t } = useApp();
  const voice = useVoice();
  const [picked, setPicked] = useState<Paint[]>([]);

  const result = useMemo(() => mixPaints(picked), [picked]);

  const add = (p: Paint) => {
    if (picked.length >= 4) return;
    sfx.pop();
    const next = [...picked, p];
    setPicked(next);
    const r = mixPaints(next);
    if (next.length >= 2 && r) voice.speak(r.name);
  };

  /** saved colours become real paints that can be mixed again */
  const savedAsPaint = (c: SavedColor, i: number): Paint => ({
    id: `saved-${i}`, name: c.name, hex: c.hex, ryb: c.ryb,
  });

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {/* beaker */}
      <div className="card flex flex-col items-center gap-3 p-4 sm:p-5">
        <div className="flex min-h-10 flex-wrap items-center justify-center gap-1.5">
          <AnimatePresence mode="popLayout">
            {picked.length === 0 && (
              <motion.span key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[11px] font-semibold text-inksoft">{t("st_mix_hint")}</motion.span>
            )}
            {picked.map((p, i) => (
              <motion.div key={`${p.id}-${i}`} initial={{ scale: 0, y: -16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}
                className="flex items-center gap-1.5">
                {i > 0 && <Plus className="h-3 w-3 text-slate-400" />}
                <span className="h-8 w-8 rounded-xl shadow ring-2 ring-white" style={{ background: p.hex }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div key={result?.hex ?? "none"}
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full shadow-lg ring-4 ring-white sm:h-32 sm:w-32"
          style={{ background: result?.hex ?? "#f1f5f9" }}>
          {!result && <Beaker className="h-9 w-9 text-slate-300" />}
          {result && picked.length >= 2 && (
            <motion.span className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ["0 0 0 0 rgba(255,255,255,.7)", "0 0 0 16px rgba(255,255,255,0)"] }}
              transition={{ duration: 1.2, repeat: Infinity }} />
          )}
        </motion.div>

        <div className="text-center">
          <div className="font-display text-base font-bold text-ink sm:text-lg">
            {result ? result.name : t("st_mix_none")}
          </div>
          <div className="font-mono text-[10px] font-semibold uppercase text-inksoft">{result?.hex ?? "—"}</div>
        </div>

        <div className="grid w-full grid-cols-2 gap-1.5">
          <button onClick={() => { setPicked([]); sfx.pop(); }} className="btn-ghost !py-2.5 text-[11px]">
            <RotateCcw className="h-3.5 w-3.5" /> {t("st_mix_clear")}
          </button>
          <button onClick={() => result && voice.speak(result.name, true)}
            className="btn-ghost !py-2.5 text-[11px]">
            <Volume2 className="h-3.5 w-3.5" /> {t("common_listen")}
          </button>
          <button onClick={() => { if (result) { onSave({ ...result }); sfx.correct(); voice.speak(t("st_color_saved")); } }}
            disabled={!result || picked.length < 2}
            className="rounded-2xl bg-violet-600 py-2.5 font-display text-[11px] font-bold text-white transition active:scale-95 disabled:opacity-40">
            + {t("st_save_color")}
          </button>
          <button onClick={() => { if (result) { onUseColor(result.hex); sfx.correct(); } }}
            disabled={!result} className="btn-primary !py-2.5 text-[11px] disabled:opacity-40">
            <Sparkles className="h-3.5 w-3.5" /> {t("st_mix_use")}
          </button>
        </div>
      </div>

      {/* MY COLOURS — can be mixed again */}
      {saved.length > 0 && (
        <div className="rounded-2xl bg-white p-3 ring-1 ring-violet-200">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wide text-violet-600">
              {t("st_my_colors")} ({saved.length})
            </span>
            <span className="text-[9px] font-semibold text-inksoft">{t("st_mix_again")}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 xs:grid-cols-5 sm:grid-cols-6">
            {saved.map((c, i) => (
              <div key={i} className="relative">
                <motion.button whileTap={{ scale: 0.88 }}
                  onClick={() => add(savedAsPaint(c, i))}
                  className="flex w-full flex-col items-center gap-1 rounded-xl bg-violet-50 p-1.5 ring-1 ring-violet-200">
                  <span className="h-8 w-8 rounded-full shadow-inner ring-2 ring-white" style={{ background: c.hex }} />
                  <span className="w-full truncate text-center text-[8px] font-bold text-violet-700">{c.name}</span>
                </motion.button>
                <button onClick={() => { onRemove(i); sfx.pop(); }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-white">
                  <Trash2 className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* paint jars */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_mix_pick")}</div>
        <div className="grid grid-cols-5 gap-1.5 xs:grid-cols-6 sm:grid-cols-9">
          {PAINTS.map((p) => (
            <motion.button key={p.id} whileTap={{ scale: 0.88 }} onClick={() => add(p)}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-1.5 ring-1 ring-slate-200 transition hover:ring-indigo-300">
              <span className="h-8 w-8 rounded-full shadow-inner ring-2 ring-white" style={{ background: p.hex }} />
              <span className="w-full truncate text-center text-[8px] font-bold text-inksoft">{p.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* recipes */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_recipes")}</div>
        <div className="grid gap-1.5 xs:grid-cols-2">
          {RECIPES.map(([a, b]) => {
            const pa = PAINTS.find((p) => p.id === a)!;
            const pb = PAINTS.find((p) => p.id === b)!;
            const res = mixPaints([pa, pb]);
            return (
              <button key={`${a}-${b}`}
                onClick={() => { setPicked([pa, pb]); sfx.pop(); if (res) voice.speak(res.name); }}
                className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-2.5 py-2 ring-1 ring-slate-200 transition active:scale-95">
                <span className="h-5 w-5 shrink-0 rounded-full ring-1 ring-white" style={{ background: pa.hex }} />
                <span className="text-[10px] font-bold text-slate-400">+</span>
                <span className="h-5 w-5 shrink-0 rounded-full ring-1 ring-white" style={{ background: pb.hex }} />
                <span className="text-[10px] font-bold text-slate-400">=</span>
                <span className="h-5 w-5 shrink-0 rounded-full ring-1 ring-white" style={{ background: res?.hex }} />
                <span className="ms-auto truncate text-[10px] font-bold text-ink">{res?.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
