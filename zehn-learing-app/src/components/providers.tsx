"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from "react";
import { LANGS, translate, type LangCode } from "@/i18n/dictionaries";
import type { Profile, Stats } from "@/lib/types";

type AppState = {
  status: "loading" | "onboarding" | "ready";
  deviceId: string;
  profile: Profile | null;
  stats: Stats | null;
  lang: LangCode;
  dir: "ltr" | "rtl";
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLang: (lang: LangCode) => void;
  refresh: () => Promise<void>;
  completeOnboarding: (data: { name: string; grade: number; avatar: string }) => Promise<void>;
  updateProfile: (patch: Partial<{ name: string; grade: number; avatar: string }>) => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

// Keep legacy keys so existing learners never lose their identity.
const ID_KEY = "lumio_device_id";
const LANG_KEY = "lumio_lang";
const SNAPSHOT_KEY = "zehn_student_snapshot_v2";

type Snapshot = { profile: Profile; stats: Stats | null; savedAt: number };

function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

function readSnapshot(): Snapshot | null {
  try {
    const value = localStorage.getItem(SNAPSHOT_KEY);
    return value ? (JSON.parse(value) as Snapshot) : null;
  } catch {
    return null;
  }
}

function writeSnapshot(profile: Profile, stats: Stats | null) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify({ profile, stats, savedAt: Date.now() }));
  } catch {
    // Private/full storage should not stop the online app.
  }
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return { "x-device-id": localStorage.getItem(ID_KEY) ?? "" };
}

/** Local, always-onboarded fallback profile used when the DB is unreachable. */
function guestProfile(id: string): Profile {
  return {
    id,
    name: "Learner",
    grade: 1,
    language: (localStorage.getItem(LANG_KEY) as string | null) ?? "en",
    avatar: "owl",
    xp: 0,
    level: 1,
    streak: 0,
    createdAt: new Date().toISOString(),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AppState["status"]>("loading");
  const [deviceId, setDeviceId] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lang, setLangState] = useState<LangCode>("en");

  const applyLang = useCallback((code: LangCode) => {
    setLangState(code);
    localStorage.setItem(LANG_KEY, code);
    const meta = LANGS.find((item) => item.code === code);
    document.documentElement.lang = code;
    document.documentElement.dir = meta?.dir ?? "ltr";
  }, []);

  const applyPayload = useCallback((data: { profile: Profile | null; stats: Stats | null }) => {
    if (!data.profile) return false;
    setProfile(data.profile);
    setStats(data.stats);
    const stored = localStorage.getItem(LANG_KEY) as LangCode | null;
    const valid = stored && LANGS.some((item) => item.code === stored) ? stored : null;
    applyLang(valid ?? (data.profile.language as LangCode) ?? "en");
    setStatus("ready");
    writeSnapshot(data.profile, data.stats);
    return true;
  }, [applyLang]);

  const load = useCallback(async () => {
    const id = getDeviceId();
    setDeviceId(id);

    // Instant startup: show the last verified state while the network refreshes.
    const cached = readSnapshot();
    const hadCachedProfile = Boolean(cached?.profile && cached.profile.id === id);
    if (cached?.profile && cached.profile.id === id) {
      applyPayload({ profile: cached.profile, stats: cached.stats });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), hadCachedProfile ? 7000 : 5000);
    try {
      const response = await fetch(`/api/device?id=${encodeURIComponent(id)}`, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error("profile unavailable");
      const data = (await response.json()) as { profile: Profile | null; stats: Stats | null };
      if (applyPayload(data)) return;

      // Only send a learner to onboarding when the server confirms no profile.
      localStorage.removeItem(SNAPSHOT_KEY);
      const stored = localStorage.getItem(LANG_KEY) as LangCode | null;
      if (stored && LANGS.some((item) => item.code === stored)) {
        applyLang(stored);
      } else {
        const browserLang = navigator.language.slice(0, 2) as LangCode;
        applyLang(LANGS.some((item) => item.code === browserLang) ? browserLang : "en");
      }
      setStatus("onboarding");
    } catch {
      // Database unreachable or freshly reset: NEVER trap the learner in an
      // onboarding loop. Fall back to an onboarded local profile so the
      // dashboard opens; the server profile takes over on the next success.
      if (!hadCachedProfile) {
        const guest = guestProfile(id);
        setProfile(guest);
        writeSnapshot(guest, null);
        applyLang((guest.language as LangCode) ?? "en");
        setStatus("ready");
      }
    } finally {
      clearTimeout(timeout);
    }
  }, [applyLang, applyPayload]);

  useEffect(() => { void load(); }, [load]);

  const setLang = useCallback((code: LangCode) => {
    applyLang(code);
    const id = getDeviceId();
    fetch("/api/device", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-device-id": id },
      body: JSON.stringify({ language: code }),
      keepalive: true,
    }).catch(() => undefined);
  }, [applyLang]);

  const completeOnboarding = useCallback(async (data: { name: string; grade: number; avatar: string }) => {
    const id = getDeviceId();
    try {
      const response = await fetch("/api/device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data, language: lang }),
      });
      if (response.ok) {
        await load();
        return;
      }
      throw new Error("profile save failed");
    } catch {
      // If the server cannot save right now, persist locally and continue to
      // the dashboard — the profile syncs when the database responds again.
      const local: Profile = { ...guestProfile(id), ...data, language: lang };
      setProfile(local);
      writeSnapshot(local, stats);
      setStatus("ready");
    }
  }, [lang, load, stats]);

  const updateProfile = useCallback(async (patch: Partial<{ name: string; grade: number; avatar: string }>) => {
    const id = getDeviceId();
    // Optimistic local update: controls respond before the network round trip.
    if (profile) {
      const optimistic = { ...profile, ...patch };
      setProfile(optimistic);
      writeSnapshot(optimistic, stats);
    }
    await fetch("/api/device", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-device-id": id },
      body: JSON.stringify(patch),
    }).catch(() => undefined);
    void load();
  }, [load, profile, stats]);

  // Every XP/game/lesson completion can notify the provider without forcing
  // pages to wait for a refresh.
  useEffect(() => {
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<Partial<{ xp: number; level: number; streak: number }>>).detail;
      if (!profile || !detail) return;
      const next = {
        ...profile,
        xp: detail.xp ?? profile.xp,
        level: detail.level ?? profile.level,
        streak: detail.streak ?? profile.streak,
      };
      setProfile(next);
      writeSnapshot(next, stats);
    };
    window.addEventListener("zehn:progress", onProgress);
    return () => window.removeEventListener("zehn:progress", onProgress);
  }, [profile, stats]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );
  const dir = useMemo(
    () => (LANGS.find((item) => item.code === lang)?.dir ?? "ltr") as "ltr" | "rtl",
    [lang]
  );

  const value = useMemo<AppState>(() => ({
    status, deviceId, profile, stats, lang, dir, t, setLang,
    refresh: load, completeOnboarding, updateProfile,
  }), [status, deviceId, profile, stats, lang, dir, t, setLang, load, completeOnboarding, updateProfile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
