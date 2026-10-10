"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LANGS, type LangCode } from "@/i18n/dictionaries";

/**
 * Global-friendly text to speech.
 * Picks the best installed voice for the app language and supports
 * slow/narrate speeds for emerging readers.
 */
export function useSpeech(lang: LangCode) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  const say = useCallback(
    (text: string, opts?: { rate?: number; onEnd?: () => void }) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        opts?.onEnd?.();
        return;
      }
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const speechTag = LANGS.find((l) => l.code === lang)?.speech ?? "en-US";
      utter.lang = speechTag;
      utter.rate = opts?.rate ?? 0.95;
      utter.pitch = 1.05;

      const voices = voicesRef.current.length
        ? voicesRef.current
        : synth.getVoices();
      const prefix = speechTag.split("-")[0];
      const voice =
        voices.find((v) => v.lang.toLowerCase() === speechTag.toLowerCase()) ??
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (voice) utter.voice = voice;

      utter.onstart = () => setSpeaking(true);
      utter.onend = () => {
        setSpeaking(false);
        opts?.onEnd?.();
      };
      utter.onerror = () => {
        setSpeaking(false);
        opts?.onEnd?.();
      };
      synth.speak(utter);
    },
    [lang]
  );

  return { say, stop, speaking, supported };
}
