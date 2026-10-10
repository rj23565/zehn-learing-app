"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Eraser, Loader2, PaintBucket, Save, Sparkles, Trash2, Undo2, Volume2 } from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { CHARACTERS, Character, CharacterOutline, type CharacterId } from "@/components/Characters";
import { rainbowAt, SWATCHES } from "@/lib/colors";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";

type Tool = "brush" | "rainbow" | "fill" | "eraser";

const STROKE_TARGET = 1400; // pixels of tracing counts as "traced"

export function TraceGame({ extraColors = [] }: { extraColors?: { hex: string; name: string }[] }) {
  const { t } = useApp();
  const voice = useVoice();

  const [charId, setCharId] = useState<CharacterId>("owl");
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#7c5cff");
  const [width, setWidth] = useState(9);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hue = useRef(0);
  const travelled = useRef(0);
  const undoStack = useRef<ImageData[]>([]);
  const [canUndo, setCanUndo] = useState(false);

  const character = CHARACTERS.find((c) => c.id === charId)!;

  const fit = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = Math.round(w * 1.3);
    const prev = canvas.width ? canvas.toDataURL() : null;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (prev) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, w, h);
      img.src = prev;
    }
  }, []);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(() => fit());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [fit]);

  const reset = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    travelled.current = 0;
    setProgress(0);
    setDone(false);
    undoStack.current = [];
    setCanUndo(false);
    sfx.whoosh();
  };

  useEffect(() => { reset(); }, [charId]); // eslint-disable-line react-hooks/exhaustive-deps

  const snapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.current.length > 15) undoStack.current.shift();
    setCanUndo(true);
  };

  const pos = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  /** Flood fill a bounded area (used by the fill tool). */
  const floodFill = (sx: number, sy: number, hex: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { width: w, height: h } = canvas;
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;
    const idx = (x: number, y: number) => (y * w + x) * 4;
    const start = idx(Math.floor(sx), Math.floor(sy));
    const target = [data[start], data[start + 1], data[start + 2], data[start + 3]];
    const [nr, ng, nb] = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    if (target[0] === nr && target[1] === ng && target[2] === nb && target[3] === 255) return;

    const stack = [[Math.floor(sx), Math.floor(sy)]];
    while (stack.length) {
      const [x, y] = stack.pop()!;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = idx(x, y);
      if (data[i] !== target[0] || data[i + 1] !== target[1] || data[i + 2] !== target[2] || data[i + 3] !== target[3]) continue;
      data[i] = nr; data[i + 1] = ng; data[i + 2] = nb; data[i + 3] = 255;
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(img, 0, 0);
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    snapshot();
    const p = pos(e);
    if (tool === "fill") {
      floodFill(p.x, p.y, color);
      sfx.pop();
      setProgress((v) => Math.min(100, v + 25));
      return;
    }
    drawing.current = true;
    last.current = p;
    stroke(e);
  };

  const stroke = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    const from = last.current ?? p;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = tool === "rainbow" ? rainbowAt((hue.current += 5)) : color;
    ctx.lineWidth = tool === "eraser" ? width * 2 : width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    // progress from actual distance traced
    const d = Math.hypot(p.x - from.x, p.y - from.y);
    travelled.current += d;
    const pct = Math.min(100, Math.round((travelled.current / STROKE_TARGET) * 100));
    setProgress(pct);
    if (pct >= 100 && !done) {
      setDone(true);
      sfx.win();
      fireConfetti();
      voice.speak(t("st_traced"));
    }
    last.current = p;
  };

  const end = () => { drawing.current = false; last.current = null; };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const snap = undoStack.current.pop();
    if (!canvas || !ctx || !snap) return;
    ctx.putImageData(snap, 0, 0);
    setCanUndo(undoStack.current.length > 0);
    sfx.pop();
  };

  const save = async () => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || saving) return;
    setSaving(true);
    try {
      const out = document.createElement("canvas");
      const W = 640, H = Math.round((canvas.height / canvas.width) * 640);
      out.width = W; out.height = H;
      const ctx = out.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(canvas, 0, 0, W, H);
      }
      await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ kind: "art", subject: "Art", imageData: out.toDataURL("image/jpeg", 0.85) }),
      });
      sfx.win();
      voice.speak(t("st_saved"));
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } finally {
      setSaving(false);
    }
  };

  const palette = [...extraColors.map((c) => c.hex), ...SWATCHES];

  return (
    <div className="flex flex-col gap-3">
      {/* character picker */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CHARACTERS.map((c) => (
          <button key={c.id} onClick={() => { setCharId(c.id); sfx.pop(); }}
            className={`flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-2.5 py-2 transition ${
              charId === c.id ? "bg-indigo-600 text-white shadow-md" : "bg-white text-ink ring-1 ring-slate-200"
            }`}>
            <Character id={c.id} size={38} animate={false} />
            <span className="font-display text-[9px] font-bold">{c.name.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* instruction */}
      <div className="flex items-start gap-2 rounded-2xl bg-violet-50 p-3 ring-1 ring-violet-100">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
        <p className="text-xs font-semibold leading-relaxed text-violet-900">
          {t("st_trace_hint", { name: character.name })}
        </p>
        <button onClick={() => voice.speak(t("st_trace_hint", { name: character.name }), true)}
          className="ms-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 ring-1 ring-violet-200">
          <Volume2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* progress */}
      <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_tracing")}</span>
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <motion.div className={`h-full rounded-full ${done ? "bg-emerald-500" : "bg-gradient-to-r from-violet-500 to-pink-500"}`}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.2 }} />
        </div>
        <span className={`shrink-0 font-display text-xs font-bold ${done ? "text-emerald-600" : "text-ink"}`}>{progress}%</span>
      </div>

      {/* trace canvas + guide */}
      <div ref={wrapRef} className="relative overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        {/* outline guide underneath */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.16]">
          <CharacterOutline id={charId} size={Math.min(340, (wrapRef.current?.clientWidth ?? 300) * 1.05)} animate={false} />
        </div>
        <canvas ref={canvasRef}
          onPointerDown={start} onPointerMove={stroke} onPointerUp={end}
          onPointerLeave={end} onPointerCancel={end}
          className="block w-full touch-none" />

        {done && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="pointer-events-none absolute inset-x-0 top-4 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 font-display text-xs font-bold text-white shadow-lg">
            <Check className="h-4 w-4" strokeWidth={3} /> {t("st_traced")}
          </motion.div>
        )}
      </div>

      {/* tools */}
      <div className="flex flex-wrap items-center gap-1.5">
        {([
          ["brush", Sparkles, t("st_brush")],
          ["rainbow", Sparkles, t("st_rainbow")],
          ["fill", PaintBucket, t("st_fill")],
          ["eraser", Eraser, t("st_eraser")],
        ] as [Tool, typeof Sparkles, string][]).map(([id, Icon, label]) => (
          <button key={id} onClick={() => { setTool(id); sfx.pop(); }}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 font-display text-[11px] font-bold transition ${
              tool === id
                ? id === "rainbow"
                  ? "bg-gradient-to-r from-rose-500 via-amber-400 to-violet-500 text-white shadow"
                  : "bg-indigo-600 text-white shadow"
                : "bg-white text-ink ring-1 ring-slate-200"
            }`}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
        <div className="ms-auto flex gap-1.5">
          <button onClick={undo} disabled={!canUndo}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-slate-200 disabled:opacity-30">
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={reset}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* size */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_size")}</span>
        <input type="range" min={3} max={34} value={width}
          onChange={(e) => setWidth(Number(e.target.value))} className="cute-range flex-1" />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <span className="rounded-full bg-ink" style={{ width: Math.max(4, width / 1.5), height: Math.max(4, width / 1.5) }} />
        </span>
      </div>

      {/* colours */}
      <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_colors")}</span>
          <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setTool("brush"); }}
            className="h-7 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
        </div>
        <div className="grid grid-cols-9 gap-1.5">
          {palette.map((c, i) => (
            <motion.button key={`${c}-${i}`} whileTap={{ scale: 0.85 }}
              onClick={() => { setColor(c); setTool(tool === "rainbow" ? "brush" : tool); sfx.pop(); }}
              className={`aspect-square rounded-lg ring-2 transition ${
                color === c && tool !== "rainbow" ? "ring-indigo-600 scale-110" : "ring-slate-200"
              }`}
              style={{ background: c }} />
          ))}
        </div>
      </div>

      <button onClick={save} disabled={saving} className="btn-primary w-full !py-3 text-sm">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
        {saved ? t("st_saved") : t("st_save")}
      </button>
    </div>
  );
}
