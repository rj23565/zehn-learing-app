"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check, Hash, Loader2, PaintBucket, PartyPopper, RotateCcw, Save, Shuffle, Sparkles,
} from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { Character, CHARACTERS, type CharacterId } from "@/components/Characters";
import { COLORING_PAGES, pageById } from "@/lib/coloring-pages";
import { rainbowAt, SWATCHES } from "@/lib/colors";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";

type Mode = "page" | "character";

export function ColorBook({ extraColors = [] }: { extraColors?: { hex: string; name: string }[] }) {
  const { t } = useApp();
  const voice = useVoice();

  const [mode, setMode] = useState<Mode>("page");
  const [pageId, setPageId] = useState(COLORING_PAGES[0].id);
  const [charId, setCharId] = useState<CharacterId>("owl");
  const [byNumbers, setByNumbers] = useState(true);
  const [color, setColor] = useState("#f97316");
  const [activeKey, setActiveKey] = useState(1);
  const [rainbow, setRainbow] = useState(false);
  const [fills, setFills] = useState<Record<number, string>>({});
  const [wrong, setWrong] = useState<number | null>(null);
  const [charColors, setCharColors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const page = useMemo(() => pageById(pageId), [pageId]);
  const keyColors = page.key ?? [];

  useEffect(() => { setFills({}); setActiveKey(1); }, [pageId]);
  useEffect(() => { setCharColors({}); }, [charId]);

  const pickColor = () => {
    if (rainbow) return rainbowAt(Math.floor(Math.random() * 360));
    if (byNumbers && mode === "page") {
      return keyColors.find((k) => k.n === activeKey)?.hex ?? color;
    }
    return color;
  };

  const numberedTotal = page.regions.filter((r) => r.n != null).length;
  const correctCount = page.regions.filter(
    (r, i) => r.n != null && fills[i] === keyColors.find((k) => k.n === r.n)?.hex
  ).length;
  const finished = byNumbers && numberedTotal > 0 && correctCount === numberedTotal;

  useEffect(() => {
    if (finished) {
      sfx.win();
      fireConfetti();
      voice.speak(t("st_all_correct"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const fillRegion = (i: number) => {
    const region = page.regions[i];
    if (byNumbers && region.n != null) {
      const want = keyColors.find((k) => k.n === region.n)?.hex;
      const got = keyColors.find((k) => k.n === activeKey)?.hex;
      if (want !== got) {
        setWrong(i);
        sfx.wrong();
        voice.speak(t("st_wrong_number", { n: region.n }));
        setTimeout(() => setWrong(null), 600);
        return;
      }
      sfx.correct();
      setFills((f) => ({ ...f, [i]: want! }));
      return;
    }
    sfx.pop();
    setFills((f) => ({ ...f, [i]: pickColor() }));
  };

  const paintPart = (part: "body" | "belly" | "accent") => {
    sfx.pop();
    setCharColors((c) => ({ ...c, [part]: rainbow ? rainbowAt(Math.floor(Math.random() * 360)) : color }));
  };

  const surprise = () => {
    sfx.whoosh();
    if (mode === "page") {
      const next: Record<number, string> = {};
      page.regions.forEach((r, i) => {
        next[i] = byNumbers && r.n != null
          ? (keyColors.find((k) => k.n === r.n)?.hex ?? rainbowAt(i * 40))
          : rainbowAt(Math.floor(Math.random() * 360));
      });
      setFills(next);
    } else {
      setCharColors({
        body: rainbowAt(Math.floor(Math.random() * 360)),
        belly: rainbowAt(Math.floor(Math.random() * 360)),
        accent: rainbowAt(Math.floor(Math.random() * 360)),
      });
    }
  };

  const save = async () => {
    const svg = document.getElementById("color-stage")?.querySelector("svg");
    if (!svg || saving) return;
    setSaving(true);
    try {
      const data = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      await new Promise<void>((res) => {
        img.onload = () => res(); img.onerror = () => res();
        img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(data)))}`;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 640; canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 640, 640);
        ctx.drawImage(img, 40, 40, 560, 560);
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

  const palette = [...extraColors.map((c) => c.hex), ...SWATCHES];

  /** centre point of a path, for placing the number label */
  const labelPos = (d: string): [number, number] => {
    const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    const xs: number[] = [], ys: number[] = [];
    for (let i = 0; i < nums.length - 1; i += 2) { xs.push(nums[i]); ys.push(nums[i + 1]); }
    if (!xs.length) return [0, 0];
    return [
      xs.reduce((a, b) => a + b, 0) / xs.length,
      ys.reduce((a, b) => a + b, 0) / ys.length,
    ];
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3">
      {/* mode switch */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
        {([["page", t("st_pictures")], ["character", t("st_characters")]] as [Mode, string][]).map(([id, label]) => (
          <button key={id} onClick={() => { setMode(id); sfx.pop(); }}
            className={`rounded-xl py-2 font-display text-[11px] font-bold transition ${
              mode === id ? "bg-white text-ink shadow-sm" : "text-inksoft"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* subject picker */}
      <div className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mode === "page"
          ? COLORING_PAGES.map((p) => (
              <button key={p.id} onClick={() => { setPageId(p.id); sfx.pop(); }}
                className={`chip shrink-0 gap-1 px-2.5 py-1.5 text-[11px] transition ${
                  pageId === p.id ? "bg-indigo-600 text-white" : "bg-white text-ink ring-1 ring-slate-200"
                }`}>
                <span>{p.emoji}</span> {p.title}
              </button>
            ))
          : CHARACTERS.map((c) => (
              <button key={c.id} onClick={() => { setCharId(c.id); sfx.pop(); }}
                className={`chip shrink-0 gap-1 px-2.5 py-1.5 text-[11px] transition ${
                  charId === c.id ? "bg-indigo-600 text-white" : "bg-white text-ink ring-1 ring-slate-200"
                }`}>
                <span>{c.emoji}</span> {c.name.split(" ").slice(-1)[0]}
              </button>
            ))}
      </div>

      {/* by-numbers toggle */}
      {mode === "page" && keyColors.length > 0 && (
        <button onClick={() => { setByNumbers(!byNumbers); setFills({}); sfx.pop(); }}
          className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-start transition ${
            byNumbers ? "bg-indigo-600 text-white" : "bg-white text-ink ring-1 ring-slate-200"
          }`}>
          <Hash className="h-4 w-4 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[11px] font-bold">{t("st_by_numbers")}</span>
            <span className={`block text-[10px] font-semibold ${byNumbers ? "text-indigo-200" : "text-inksoft"}`}>
              {byNumbers ? t("st_numbers_on") : t("st_numbers_off")}
            </span>
          </span>
          {byNumbers && (
            <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 font-display text-[10px] font-bold">
              {correctCount}/{numberedTotal}
            </span>
          )}
        </button>
      )}

      {/* stage */}
      <div id="color-stage"
        className="relative flex items-center justify-center overflow-hidden rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
        {mode === "page" ? (
          <svg viewBox={page.viewBox} className="h-auto w-full max-w-[340px]" style={{ maxHeight: 320 }}>
            {page.regions.map((r, i) => {
              const f = fills[i];
              const [lx, ly] = labelPos(r.d);
              const isWrong = wrong === i;
              return (
                <g key={i}>
                  <motion.path d={r.d}
                    fill={f ?? "#ffffff"}
                    stroke={isWrong ? "#ef4444" : "#1f2937"}
                    strokeWidth={isWrong ? 4 : 2.5}
                    strokeLinejoin="round"
                    className="cursor-pointer"
                    animate={isWrong ? { x: [0, -3, 3, 0] } : {}}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => fillRegion(i)} />
                  {byNumbers && r.n != null && !f && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      className="pointer-events-none select-none"
                      fontSize="13" fontWeight="800" fill="#475569">
                      {r.n}
                    </text>
                  )}
                  {byNumbers && r.n != null && f && (
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      className="pointer-events-none select-none"
                      fontSize="11" fontWeight="800" fill="#ffffff" opacity="0.75">
                      ✓
                    </text>
                  )}
                </g>
              );
            })}
            {page.lines?.map((d, i) => (
              <path key={`l${i}`} d={d} fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
            ))}
          </svg>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Character id={charId} size={200}
              colors={{ body: charColors.body, belly: charColors.belly, accent: charColors.accent }} />
            <div className="flex flex-wrap justify-center gap-1.5">
              {([["body", t("st_body")], ["belly", t("st_belly")], ["accent", t("st_accent")]] as const).map(([part, label]) => (
                <button key={part} onClick={() => paintPart(part)}
                  className="flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-2 font-display text-[10px] font-bold text-ink ring-1 ring-slate-200 transition active:scale-95">
                  <span className="h-3.5 w-3.5 rounded-full ring-1 ring-slate-300"
                    style={{ background: charColors[part] ?? "#e2e8f0" }} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {finished && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-x-0 top-3 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 font-display text-[11px] font-bold text-white shadow-lg">
              <PartyPopper className="h-3.5 w-3.5" /> {t("st_all_correct")}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NUMBERED COLOUR KEY */}
      {mode === "page" && byNumbers && keyColors.length > 0 && (
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wide text-inksoft">
            {t("st_key")}
          </div>
          <div className="grid grid-cols-4 gap-1.5 xs:grid-cols-5 sm:grid-cols-7">
            {keyColors.map((k) => (
              <motion.button key={k.n} whileTap={{ scale: 0.9 }}
                onClick={() => { setActiveKey(k.n); setRainbow(false); sfx.pop(); voice.speak(k.name); }}
                className={`flex flex-col items-center gap-1 rounded-xl p-1.5 transition ${
                  activeKey === k.n ? "bg-indigo-50 ring-2 ring-indigo-500" : "ring-1 ring-slate-200"
                }`}>
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-slate-300"
                  style={{ background: k.hex }}>
                  <span className="font-display text-xs font-extrabold mix-blend-difference text-white">{k.n}</span>
                </span>
                <span className="w-full truncate text-center text-[8.5px] font-bold text-inksoft">{k.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* free palette */}
      {(!byNumbers || mode === "character") && (
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-inksoft">
              <PaintBucket className="mr-1 inline h-3 w-3" /> {t("st_tap_fill")}
            </span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setRainbow(!rainbow); sfx.pop(); }}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 font-display text-[10px] font-bold transition ${
                  rainbow ? "bg-gradient-to-r from-rose-500 via-amber-400 to-violet-500 text-white" : "bg-slate-100 text-inksoft"
                }`}>
                <Sparkles className="h-3 w-3" /> {t("st_multicolor")}
              </button>
              <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setRainbow(false); }}
                className="h-7 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
            </div>
          </div>
          {extraColors.length > 0 && (
            <div className="mb-2">
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wide text-violet-500">{t("st_my_colors")}</div>
              <div className="flex flex-wrap gap-1.5">
                {extraColors.map((c, i) => (
                  <button key={i} onClick={() => { setColor(c.hex); setRainbow(false); sfx.pop(); }}
                    className={`h-8 w-8 rounded-lg ring-2 transition ${color === c.hex ? "ring-indigo-600 scale-110" : "ring-violet-200"}`}
                    style={{ background: c.hex }} title={c.name} />
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-9 gap-1.5">
            {palette.map((c, i) => (
              <motion.button key={`${c}-${i}`} whileTap={{ scale: 0.85 }}
                onClick={() => { setColor(c); setRainbow(false); sfx.pop(); }}
                className={`aspect-square rounded-lg ring-2 transition ${
                  color === c && !rainbow ? "ring-indigo-600 scale-110" : "ring-slate-200"
                }`}
                style={{ background: c }} />
            ))}
          </div>
        </div>
      )}

      {/* actions */}
      <div className="flex gap-2">
        <button onClick={surprise} className="btn-ghost flex-1 !py-2.5 text-xs sm:!py-3 sm:text-sm">
          <Shuffle className="h-4 w-4" /> {t("st_surprise")}
        </button>
        <button onClick={() => { setFills({}); setCharColors({}); sfx.pop(); }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600 ring-1 ring-slate-200 sm:h-11 sm:w-11">
          <RotateCcw className="h-4 w-4" />
        </button>
        <button onClick={save} disabled={saving} className="btn-primary flex-1 !py-2.5 text-xs sm:!py-3 sm:text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? t("st_saved") : t("st_save")}
        </button>
      </div>
    </div>
  );
}
