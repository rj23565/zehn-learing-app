"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Layers, Loader2, Save, Shuffle, Trash2, X } from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { Character, CHARACTERS, type CharacterId } from "@/components/Characters";
import { SCENES, STICKERS } from "@/lib/coloring-pages";
import { rainbowAt, SWATCHES } from "@/lib/colors";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";

type Item = {
  id: number;
  kind: "sticker" | "character";
  value: string;
  x: number;
  y: number;
  size: number;
  rotate: number;
  flip?: boolean;
  body?: string;
  belly?: string;
  accent?: string;
};

type Part = "body" | "belly" | "accent";

export function SceneBuilder({ extraColors = [] }: { extraColors?: { hex: string; name: string }[] }) {
  const { t } = useApp();
  const voice = useVoice();
  const stageRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const [scene, setScene] = useState(SCENES[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [part, setPart] = useState<Part>("body");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const add = (kind: Item["kind"], value: string) => {
    sfx.pop();
    const item: Item = {
      id: ++idRef.current, kind, value,
      x: 18 + Math.random() * 60,
      y: 22 + Math.random() * 50,
      size: kind === "character" ? 84 : 44,
      rotate: Math.round(Math.random() * 16 - 8),
    };
    setItems((l) => [...l, item]);
    setSelected(item.id);
    if (kind === "character") {
      const c = CHARACTERS.find((x) => x.id === value);
      if (c) voice.speak(c.name);
    }
  };

  const update = (id: number, patch: Partial<Item>) =>
    setItems((l) => l.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const remove = (id: number) => {
    sfx.pop();
    setItems((l) => l.filter((i) => i.id !== id));
    setSelected(null);
  };

  const duplicate = (it: Item) => {
    sfx.pop();
    const copy = { ...it, id: ++idRef.current, x: Math.min(92, it.x + 10), y: Math.min(90, it.y + 8) };
    setItems((l) => [...l, copy]);
    setSelected(copy.id);
  };

  const paint = (hex: string) => {
    if (selected == null) return;
    const it = items.find((i) => i.id === selected);
    if (!it || it.kind !== "character") return;
    sfx.pop();
    update(selected, { [part]: hex } as Partial<Item>);
  };

  const randomise = () => {
    sfx.whoosh();
    setScene(SCENES[Math.floor(Math.random() * SCENES.length)]);
    const picks: Item[] = Array.from({ length: 7 }, () => {
      const useChar = Math.random() > 0.55;
      return {
        id: ++idRef.current,
        kind: useChar ? "character" : "sticker",
        value: useChar
          ? CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id
          : STICKERS[Math.floor(Math.random() * STICKERS.length)],
        x: 10 + Math.random() * 74,
        y: 14 + Math.random() * 62,
        size: useChar ? 66 + Math.random() * 42 : 30 + Math.random() * 32,
        rotate: Math.round(Math.random() * 24 - 12),
        body: useChar ? rainbowAt(Math.floor(Math.random() * 360)) : undefined,
      } as Item;
    });
    setItems(picks);
    setSelected(null);
  };

  const save = async () => {
    if (saving || items.length === 0) return;
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 800; canvas.height = 600;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 600);
        const stops = scene.css.match(/#[0-9a-f]{6}/gi) ?? ["#ffffff", "#e2e8f0"];
        stops.forEach((c, i) => grad.addColorStop(i / Math.max(1, stops.length - 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 800, 600);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        items.forEach((it) => {
          const glyph = it.kind === "character"
            ? (CHARACTERS.find((c) => c.id === it.value)?.emoji ?? "🦉")
            : it.value;
          ctx.save();
          ctx.translate((it.x / 100) * 800, (it.y / 100) * 600);
          ctx.rotate((it.rotate * Math.PI) / 180);
          ctx.font = `${it.size * 1.4}px serif`;
          ctx.fillText(glyph, 0, 0);
          ctx.restore();
        });
      }
      await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ kind: "art", subject: "Art", imageData: canvas.toDataURL("image/jpeg", 0.85) }),
      });
      sfx.win(); fireConfetti();
      voice.speak(t("st_saved"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally { setSaving(false); }
  };

  const sel = items.find((i) => i.id === selected);
  const palette = [...extraColors.map((c) => c.hex), ...SWATCHES];
  const animalCount = items.filter((i) => i.kind === "character").length;

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {/* counter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="chip bg-indigo-50 text-indigo-700">
          <Layers className="h-3 w-3" /> {t("st_animals_on_board", { n: animalCount })}
        </span>
        <span className="chip bg-slate-100 text-slate-600">{items.length} {t("st_items")}</span>
      </div>

      {/* stage */}
      <div ref={stageRef} onClick={() => setSelected(null)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-slate-200"
        style={{ background: scene.css }}>
        <AnimatePresence>
          {items.map((it) => (
            <motion.button key={it.id}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
              drag dragMomentum={false}
              onDragEnd={(_, info) => {
                const rect = stageRef.current?.getBoundingClientRect();
                if (!rect) return;
                update(it.id, {
                  x: Math.max(5, Math.min(95, it.x + (info.offset.x / rect.width) * 100)),
                  y: Math.max(8, Math.min(92, it.y + (info.offset.y / rect.height) * 100)),
                });
              }}
              onClick={(e) => { e.stopPropagation(); setSelected(it.id); sfx.pop(); }}
              className={`absolute cursor-grab touch-none select-none active:cursor-grabbing ${
                selected === it.id ? "rounded-2xl ring-2 ring-white ring-offset-2 ring-offset-black/20" : ""
              }`}
              style={{
                left: `${it.x}%`, top: `${it.y}%`,
                transform: `translate(-50%,-50%) rotate(${it.rotate}deg) scaleX(${it.flip ? -1 : 1})`,
                fontSize: it.size, lineHeight: 1,
              }}>
              {it.kind === "character" ? (
                <Character id={it.value as CharacterId} size={it.size * 1.5} animate={false}
                  colors={{ body: it.body, belly: it.belly, accent: it.accent }} />
              ) : (
                <span>{it.value}</span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <span className="rounded-full bg-white/80 px-3.5 py-2 text-center text-[11px] font-bold text-slate-600 backdrop-blur">
              {t("st_scene_hint")}
            </span>
          </div>
        )}
      </div>

      {/* selected item controls */}
      <AnimatePresence>
        {sel && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-2 rounded-2xl bg-white p-2.5 ring-1 ring-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="shrink-0 text-lg">
                {sel.kind === "character" ? CHARACTERS.find((c) => c.id === sel.value)?.emoji : sel.value}
              </span>
              <input type="range" min={24} max={160} value={sel.size}
                onChange={(e) => update(sel.id, { size: Number(e.target.value) })}
                className="cute-range min-w-0 flex-1" />
              <button onClick={() => update(sel.id, { rotate: sel.rotate + 15 })}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-ink">↻</button>
              <button onClick={() => update(sel.id, { flip: !sel.flip })}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-ink">⇄</button>
              <button onClick={() => duplicate(sel)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-ink">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => remove(sel.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* per-animal colouring */}
            {sel.kind === "character" && (
              <>
                <div className="flex gap-1">
                  {(["body", "belly", "accent"] as Part[]).map((p) => (
                    <button key={p} onClick={() => { setPart(p); sfx.pop(); }}
                      className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 font-display text-[10px] font-bold transition ${
                        part === p ? "bg-indigo-600 text-white" : "bg-slate-100 text-inksoft"
                      }`}>
                      <span className="h-2.5 w-2.5 rounded-full ring-1 ring-white/60"
                        style={{ background: sel[p] ?? "#cbd5e1" }} />
                      {t(`st_${p}`)}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-9 gap-1">
                  {palette.slice(0, 18).map((c, i) => (
                    <button key={`${c}-${i}`} onClick={() => paint(c)}
                      className="aspect-square rounded-md ring-1 ring-slate-200 transition active:scale-90"
                      style={{ background: c }} />
                  ))}
                </div>
                <button onClick={() => paint(rainbowAt(Math.floor(Math.random() * 360)))}
                  className="rounded-lg bg-gradient-to-r from-rose-500 via-amber-400 to-violet-500 py-1.5 font-display text-[10px] font-bold text-white">
                  {t("st_multicolor")}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* backdrops */}
      <div className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SCENES.map((s) => (
          <button key={s.id} onClick={() => { setScene(s); sfx.pop(); }}
            className={`h-8 w-12 shrink-0 rounded-xl ring-2 transition ${
              scene.id === s.id ? "ring-indigo-600 scale-105" : "ring-slate-200"
            }`}
            style={{ background: s.css }} aria-label={s.name} />
        ))}
      </div>

      {/* animals */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_add_animals")}</div>
        <div className="grid grid-cols-6 gap-1.5">
          {CHARACTERS.map((c) => (
            <motion.button key={c.id} whileTap={{ scale: 0.88 }} onClick={() => add("character", c.id)}
              className="flex aspect-square items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200 transition active:scale-90">
              <Character id={c.id} size={38} animate={false} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* stickers */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_stickers")}</div>
        <div className="grid grid-cols-8 gap-1.5 xs:grid-cols-10">
          {STICKERS.map((s) => (
            <motion.button key={s} whileTap={{ scale: 0.85 }} onClick={() => add("sticker", s)}
              className="flex aspect-square items-center justify-center rounded-xl bg-slate-50 text-lg ring-1 ring-slate-200">
              {s}
            </motion.button>
          ))}
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-2">
        <button onClick={randomise} className="btn-ghost flex-1 !py-2.5 text-xs sm:!py-3 sm:text-sm">
          <Shuffle className="h-4 w-4" /> {t("st_surprise")}
        </button>
        <button onClick={() => { setItems([]); setSelected(null); sfx.pop(); }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600 ring-1 ring-slate-200 sm:h-11 sm:w-11">
          <Trash2 className="h-4 w-4" />
        </button>
        <button onClick={save} disabled={saving || items.length === 0}
          className="btn-primary flex-1 !py-2.5 text-xs disabled:opacity-40 sm:!py-3 sm:text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? t("st_saved") : t("st_save")}
        </button>
      </div>
    </div>
  );
}
