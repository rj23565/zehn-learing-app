"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check, Download, Eraser, Loader2, Palette, Redo2, Save, Sparkles, Trash2, Undo2,
} from "lucide-react";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { rainbowAt, SWATCHES } from "@/lib/colors";
import { fireConfetti } from "@/components/Confetti";
import { sfx } from "@/lib/sounds";

type Tool = "brush" | "rainbow" | "eraser";

export function DrawBoard({ extraColors = [] }: { extraColors?: { hex: string; name: string }[] }) {
  const { t } = useApp();
  const voice = useVoice();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const hue = useRef(0);
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);

  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#2563eb");
  const [width, setWidth] = useState(10);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  /* ---------------- canvas setup ---------------- */
  const fit = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = Math.round(w * 0.78);
    const prev = canvas.width ? canvas.toDataURL() : null;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
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

  const snapshot = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.current.length > 20) undoStack.current.shift();
    redoStack.current = [];
    setCanUndo(true);
  };

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    snapshot();
    drawing.current = true;
    last.current = pos(e);
    stroke(e); // allow single dots
  };

  const stroke = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    const from = last.current ?? p;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.strokeStyle = tool === "rainbow" ? rainbowAt((hue.current += 4)) : color;
    ctx.lineWidth = tool === "eraser" ? width * 1.8 : width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const end = () => {
    drawing.current = false;
    last.current = null;
  };

  const undo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const snap = undoStack.current.pop();
    if (!canvas || !ctx || !snap) return;
    redoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(snap, 0, 0);
    setCanUndo(undoStack.current.length > 0);
    sfx.pop();
  };

  const redo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const snap = redoStack.current.pop();
    if (!canvas || !ctx || !snap) return;
    undoStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.putImageData(snap, 0, 0);
    sfx.pop();
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    snapshot();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sfx.whoosh();
  };

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `zehn-art-${Date.now()}.png`;
    a.click();
  };

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas || saving) return;
    setSaving(true);
    try {
      const small = document.createElement("canvas");
      small.width = 640;
      small.height = Math.round((canvas.height / canvas.width) * 640);
      small.getContext("2d")?.drawImage(canvas, 0, 0, small.width, small.height);
      await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ kind: "art", subject: "Art", imageData: small.toDataURL("image/jpeg", 0.8) }),
      });
      sfx.win();
      fireConfetti();
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
      {/* canvas */}
      <div ref={wrapRef} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <canvas
          ref={canvasRef}
          onPointerDown={start}
          onPointerMove={stroke}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          className="block w-full touch-none"
        />
      </div>

      {/* tools */}
      <div className="flex flex-wrap items-center gap-1.5">
        {([
          ["brush", Palette, t("st_brush")],
          ["rainbow", Sparkles, t("st_rainbow")],
          ["eraser", Eraser, t("st_eraser")],
        ] as [Tool, typeof Palette, string][]).map(([id, Icon, label]) => (
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

        <div className="ms-auto flex items-center gap-1.5">
          <button onClick={undo} disabled={!canUndo}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-slate-200 disabled:opacity-30">
            <Undo2 className="h-4 w-4" />
          </button>
          <button onClick={redo}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-slate-200">
            <Redo2 className="h-4 w-4" />
          </button>
          <button onClick={clear}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-200">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* brush size */}
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-inksoft">{t("st_size")}</span>
        <input type="range" min={2} max={40} value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="cute-range flex-1" />
        <span className="flex h-8 w-8 shrink-0 items-center justify-center">
          <span className="rounded-full bg-ink" style={{ width: Math.max(4, width / 1.6), height: Math.max(4, width / 1.6) }} />
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
              onClick={() => { setColor(c); setTool("brush"); sfx.pop(); }}
              className={`aspect-square rounded-lg ring-2 transition ${
                color === c && tool === "brush" ? "ring-indigo-600 scale-110" : "ring-slate-200"
              }`}
              style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* save row */}
      <div className="flex gap-2">
        <button onClick={download} className="btn-ghost flex-1 !py-3 text-sm">
          <Download className="h-4 w-4" /> {t("st_download")}
        </button>
        <button onClick={save} disabled={saving} className="btn-primary flex-1 !py-3 text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? t("st_saved") : t("st_save")}
        </button>
      </div>
    </div>
  );
}
