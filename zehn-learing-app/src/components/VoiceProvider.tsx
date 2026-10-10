"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef,
  useState, type ReactNode,
} from "react";
import { useApp } from "./providers";
import { useSpeech } from "@/hooks/useSpeech";

type VoiceState = {
  enabled: boolean;
  supported: boolean;
  speaking: boolean;
  rate: number;
  toggle: () => void;
  setRate: (rate: number) => void;
  speak: (text: string, force?: boolean) => void;
  stop: () => void;
};

const Ctx = createContext<VoiceState | null>(null);
const KEY = "zehn_voice";
const RATE_KEY = "zehn_voice_rate";

export function VoiceProvider({ children }: { children: ReactNode }) {
  const { lang } = useApp();
  const { say, stop, speaking, supported } = useSpeech(lang);
  const [enabled, setEnabled] = useState(false);
  const [rate, setRateState] = useState(0.95);
  const last = useRef("");

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    // voice guide is ON by default — this app is built for young readers
    setEnabled(stored === null ? true : stored === "1");
    const r = Number(localStorage.getItem(RATE_KEY));
    if (r >= 0.5 && r <= 1.5) setRateState(r);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, next ? "1" : "0");
      if (!next) stop();
      return next;
    });
  }, [stop]);

  const setRate = useCallback((value: number) => {
    setRateState(value);
    localStorage.setItem(RATE_KEY, String(value));
  }, []);

  const speak = useCallback(
    (text: string, force = false) => {
      if (!text) return;
      if (!enabled && !force) return;
      if (!force && text === last.current) return;
      last.current = text;
      say(text, { rate });
    },
    [enabled, rate, say]
  );

  // stop narration when the language changes mid-sentence
  useEffect(() => { stop(); }, [lang, stop]);

  const value = useMemo<VoiceState>(
    () => ({ enabled, supported, speaking, rate, toggle, setRate, speak, stop }),
    [enabled, supported, speaking, rate, toggle, setRate, speak, stop]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVoice() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      enabled: false, supported: false, speaking: false, rate: 1,
      toggle: () => undefined, setRate: () => undefined,
      speak: () => undefined, stop: () => undefined,
    } satisfies VoiceState;
  }
  return ctx;
}
