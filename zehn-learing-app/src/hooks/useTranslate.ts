"use client";

import { useEffect, useRef, useState } from "react";
import type { LangCode } from "@/i18n/dictionaries";

const memoryCache = new Map<string, string>();
const STORE = "zehn_translation_cache_v2";
const MAX_ENTRIES = 500;
let diskLoaded = false;

type Stored = Record<string, string>;

function loadDiskCache() {
  if (diskLoaded || typeof window === "undefined") return;
  diskLoaded = true;
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Stored;
    Object.entries(parsed).forEach(([key, value]) => memoryCache.set(key, value));
  } catch {
    // Corrupt or unavailable storage should never block learning.
  }
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
function persistSoon() {
  if (typeof window === "undefined") return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      // Keep the newest 500 entries so localStorage stays small and fast.
      const entries = [...memoryCache.entries()].slice(-MAX_ENTRIES);
      localStorage.setItem(STORE, JSON.stringify(Object.fromEntries(entries)));
    } catch {
      // Storage may be full/private; in-memory cache still works.
    }
  }, 250);
}

/**
 * Offline-first translation:
 * 1. render originals immediately (never block UI)
 * 2. apply device-persisted translations synchronously
 * 3. fetch only missing strings, with a short timeout
 */
export function useTranslate(texts: string[], lang: LangCode) {
  const [out, setOut] = useState<string[]>(texts);
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify([texts, lang]);
  const lastKey = useRef("");

  useEffect(() => {
    loadDiskCache();
    const cacheKey = (text: string) => `${lang}::${text}`;

    if (lang === "en" || texts.length === 0) {
      setOut(texts);
      setLoading(false);
      return;
    }

    // Paint cached content immediately before touching the network.
    const apply = () => setOut(texts.map((text) => memoryCache.get(cacheKey(text)) ?? text));
    apply();

    if (lastKey.current === key) return;
    lastKey.current = key;

    const uniqueMissing = [...new Set(texts.filter((text) => !memoryCache.has(cacheKey(text))))];
    if (uniqueMissing.length === 0) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4300);
    let cancelled = false;
    setLoading(true);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: uniqueMissing, target: lang }),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("translation unavailable");
        return response.json();
      })
      .then((data: { results?: string[] }) => {
        if (cancelled) return;
        (data.results ?? []).forEach((result, index) => {
          const source = uniqueMissing[index];
          if (source && result) memoryCache.set(cacheKey(source), result);
        });
        apply();
        persistSoon();
      })
      .catch(() => {
        // Originals are already visible, so a slow/offline translator has no UX cost.
      })
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
    // `key` captures texts + lang without unstable array dependency loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { texts: out, loading };
}
