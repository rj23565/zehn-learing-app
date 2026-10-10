"use client";

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", vol = 0.16) {
  const c = ac();
  if (!c) return;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const t0 = c.currentTime + start;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  pop() {
    tone(520, 0, 0.09, "triangle", 0.12);
  },
  flip() {
    tone(340, 0, 0.08, "sine", 0.1);
    tone(430, 0.05, 0.08, "sine", 0.08);
  },
  correct() {
    tone(523.25, 0, 0.12, "triangle");
    tone(659.25, 0.09, 0.12, "triangle");
    tone(783.99, 0.18, 0.22, "triangle");
  },
  wrong() {
    tone(220, 0, 0.16, "sawtooth", 0.06);
    tone(174, 0.1, 0.2, "sawtooth", 0.05);
  },
  win() {
    [523.25, 587.33, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.25, "triangle"));
  },
  tick() {
    tone(880, 0, 0.05, "square", 0.05);
  },
  whoosh() {
    tone(280, 0, 0.18, "sine", 0.07);
    tone(560, 0.08, 0.16, "sine", 0.05);
  },
};
