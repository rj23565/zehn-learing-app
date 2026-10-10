"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, Flame, Gamepad2, GraduationCap, Home, Languages, Palette,
  Sparkles, Type, UserRound, Volume2, VolumeX, Zap,
} from "lucide-react";
import { useApp } from "./providers";
import { useVoice } from "./VoiceProvider";
import { Logo } from "./Logo";
import { LanguagePicker } from "./LanguagePicker";
import { xpForLevel } from "@/lib/types";

const NAV = [
  { href: "/dashboard", icon: Home, key: "nav_home" },
  { href: "/learn", icon: GraduationCap, key: "nav_learn" },
  { href: "/letters", icon: Type, key: "nav_letters" },
  { href: "/games", icon: Gamepad2, key: "nav_games" },
  { href: "/studio", icon: Palette, key: "nav_studio" },
  { href: "/progress", icon: BarChart3, key: "nav_progress" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, t, lang } = useApp();
  const voice = useVoice();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);

  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const floorXp = xpForLevel(level);
  const ceilXp = xpForLevel(level + 1);
  const pct = Math.min(100, Math.round(((xp - floorXp) / Math.max(1, ceilXp - floorXp)) * 100));

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col sm:max-w-2xl lg:max-w-4xl">
      {/* ------- top bar ------- */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-cream/90 backdrop-blur-lg">
        <div className="flex items-center gap-1.5 px-3 py-2 sm:gap-2 sm:px-4">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-1.5">
            <Logo size={30} />
            <span className="hidden font-display text-base font-bold tracking-tight text-ink xs:inline sm:text-lg">
              {t("app_name")}
            </span>
          </Link>

          <div className="ms-auto flex items-center gap-1 sm:gap-1.5">
            {/* XP pill */}
            <Link href="/progress"
              className="flex items-center gap-1 rounded-full bg-indigo-600 px-2 py-1.5 text-white shadow-sm sm:px-3"
              aria-label={t("nav_progress")}>
              <Zap className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span className="font-display text-[11px] font-bold sm:text-xs">{xp}</span>
              <span className="relative hidden h-1.5 w-8 overflow-hidden rounded-full bg-indigo-900/50 sm:block">
                <motion.span className="absolute inset-y-0 left-0 rounded-full bg-amber-300"
                  animate={{ width: `${pct}%` }} transition={{ type: "spring", bounce: 0.2 }} />
              </span>
            </Link>

            {/* streak */}
            <div className="hidden items-center gap-0.5 rounded-full bg-orange-50 px-2 py-1.5 ring-1 ring-orange-200 xs:flex">
              <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-500" />
              <span className="font-display text-[11px] font-bold text-orange-600">{profile?.streak ?? 0}</span>
            </div>

            {/* voice guide */}
            <button onClick={voice.toggle}
              className={`flex h-8 w-8 items-center justify-center rounded-full ring-1 transition sm:h-9 sm:w-9 ${
                voice.enabled
                  ? "bg-emerald-500 text-white ring-emerald-500"
                  : "bg-white text-slate-400 ring-slate-200"
              }`}
              aria-label={voice.enabled ? t("voice_off") : t("voice_on")}>
              {voice.enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* AI tutor */}
            <Link href="/tutor"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm transition hover:brightness-110 sm:h-9 sm:w-9"
              aria-label={t("tutor_title")}>
              <Sparkles className="h-4 w-4" />
            </Link>

            {/* language */}
            <button onClick={() => setLangOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-slate-200 transition hover:ring-indigo-300 sm:h-9 sm:w-9"
              aria-label={t("lang_picker")}>
              <Languages className="h-4 w-4 text-indigo-600" />
              <span className="sr-only">{lang}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------- content ------- */}
      <main className="flex-1 px-3 pb-28 pt-4 sm:px-5 sm:pt-5">{children}</main>

      {/* ------- bottom nav ------- */}
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg sm:max-w-2xl lg:max-w-4xl">
        <div className="mx-2 mb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between rounded-3xl bg-[#131a33] p-1 shadow-[0_18px_40px_-12px_rgba(10,14,30,.6)] sm:mx-4 sm:mb-3 sm:p-1.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-0.5 py-1.5 sm:py-2">
                {active && (
                  <motion.span layoutId="nav-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }} />
                )}
                <item.icon className={`relative h-[18px] w-[18px] ${active ? "text-white" : "text-slate-400"}`}
                  strokeWidth={2.2} />
                <span className={`relative font-display text-[8.5px] font-semibold leading-none sm:text-[9.5px] ${
                  active ? "text-white" : "text-slate-400"
                }`}>
                  {t(item.key)}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <LanguagePicker open={langOpen} onClose={() => setLangOpen(false)} />
    </div>
  );
}
