"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Brush, Images, Palette, Pencil, Shapes, Users, Volume2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { authHeaders, useApp } from "@/components/providers";
import { useVoice } from "@/components/VoiceProvider";
import { useSpeech } from "@/hooks/useSpeech";
import { Character, CharacterCast, CHARACTERS, type CharacterId } from "@/components/Characters";
import { DrawBoard } from "@/components/studio/DrawBoard";
import { TraceGame } from "@/components/studio/TraceGame";
import { ColorBook } from "@/components/studio/ColorBook";
import { MixLab, type SavedColor } from "@/components/studio/MixLab";
import { SceneBuilder } from "@/components/studio/SceneBuilder";
import type { UploadItem } from "@/lib/types";
import { sfx } from "@/lib/sounds";

type Tab = "cast" | "trace" | "color" | "draw" | "mix" | "scene" | "gallery";

const TABS: { id: Tab; icon: typeof Brush; key: string }[] = [
  { id: "cast", icon: Users, key: "st_tab_cast" },
  { id: "trace", icon: Pencil, key: "st_tab_trace" },
  { id: "color", icon: Palette, key: "st_tab_color" },
  { id: "draw", icon: Brush, key: "st_tab_draw" },
  { id: "mix", icon: Beaker, key: "st_tab_mix" },
  { id: "scene", icon: Shapes, key: "st_tab_scene" },
  { id: "gallery", icon: Images, key: "st_tab_gallery" },
];

const STORE = "zehn_my_colors";

export default function Studio() {
  const { status, lang, t } = useApp();
  const router = useRouter();
  const voice = useVoice();
  const speak = useSpeech(lang);

  const [tab, setTab] = useState<Tab>("cast");
  const [myColors, setMyColors] = useState<SavedColor[]>([]);
  const [gallery, setGallery] = useState<UploadItem[]>([]);
  const [meetId, setMeetId] = useState<CharacterId>("owl");

  const active = CHARACTERS.find((c) => c.id === meetId) ?? CHARACTERS[0];

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  /* persist invented colours on the device */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) setMyColors(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);
  const persist = (list: SavedColor[]) => {
    setMyColors(list);
    try { localStorage.setItem(STORE, JSON.stringify(list.slice(0, 24))); } catch { /* ignore */ }
  };

  const loadGallery = useCallback(() => {
    fetch("/api/uploads", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d: { uploads?: UploadItem[] }) =>
        setGallery((d.uploads ?? []).filter((u) => u.kind === "art")))
      .catch(() => undefined);
  }, []);

  useEffect(() => { if (tab === "gallery") loadGallery(); }, [tab, loadGallery]);

  const meet = (id: CharacterId) => {
    setMeetId(id);
    const c = CHARACTERS.find((x) => x.id === id)!;
    sfx.pop();
    speak.say(`${c.name}. ${c.bio}`, { rate: 0.9 });
  };

  const palette = myColors.map((c) => ({ hex: c.hex, name: c.name }));

  return (
    <AppShell>
      {/* header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink xs:text-xl sm:text-2xl">
            <Palette className="h-5 w-5 shrink-0 text-pink-600" /> {t("st_title")}
          </h1>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium text-inksoft sm:text-sm">{t("st_sub")}</p>
        </div>
        <button onClick={voice.toggle}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 transition ${
            voice.enabled ? "bg-emerald-500 text-white ring-emerald-500" : "bg-white text-slate-400 ring-slate-200"
          }`}
          aria-label={t("voice_guide")}>
          <Volume2 className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* cast banner */}
      <div className="mt-3 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 px-1.5 pt-2.5 sm:px-2 sm:pt-3">
        <CharacterCast size={58} className="sm:hidden" />
        <CharacterCast size={76} className="hidden sm:flex" />
      </div>

      {/* scrollable tabs — fits every screen */}
      <div className="-mx-0.5 mt-3 flex gap-1 overflow-x-auto px-0.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((item) => (
          <button key={item.id} onClick={() => { setTab(item.id); sfx.pop(); }}
            className={`flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition ${
              tab === item.id ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-inksoft ring-1 ring-slate-200"
            }`}>
            <item.icon className="h-4 w-4" />
            <span className="font-display text-[9.5px] font-bold leading-none">{t(item.key)}</span>
          </button>
        ))}
      </div>

      {/* my invented colours strip */}
      {myColors.length > 0 && tab !== "mix" && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2.5 flex items-center gap-2 overflow-hidden rounded-2xl bg-white p-2.5 ring-1 ring-violet-200">
          <span className="shrink-0 text-[9.5px] font-bold uppercase tracking-wide text-violet-600">
            {t("st_my_colors")}
          </span>
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {myColors.map((c, i) => (
              <span key={i} title={c.name}
                className="h-6 w-6 shrink-0 rounded-lg ring-1 ring-violet-200"
                style={{ background: c.hex }} />
            ))}
          </div>
          <button onClick={() => { setTab("mix"); sfx.pop(); }}
            className="shrink-0 rounded-lg bg-violet-100 px-2 py-1 font-display text-[9.5px] font-bold text-violet-700">
            + {t("st_tab_mix")}
          </button>
        </motion.div>
      )}

      {/* panels */}
      <div className="mt-3 sm:mt-4">
        {tab === "cast" && (
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-4">
              <div className="stage-pattern absolute inset-0 opacity-30" />
              <div className="relative flex flex-col items-center gap-1.5">
                <motion.div key={active.id}
                  initial={{ scale: 0.6, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.4 }}>
                  <Character id={active.id} size={180} />
                </motion.div>
                <h2 className="text-center font-display text-lg font-bold text-white sm:text-xl">{active.name}</h2>
                <p className="max-w-xs text-center text-[11px] font-semibold leading-relaxed text-indigo-100 sm:text-xs">
                  {active.bio}
                </p>
                <button onClick={() => speak.say(`${active.name}. ${active.bio}`, { rate: 0.9 })}
                  className="chip mt-1 bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
                  <Volume2 className="h-3.5 w-3.5" /> {t("common_listen")}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 xs:grid-cols-6">
              {CHARACTERS.map((c) => (
                <motion.button key={c.id} whileTap={{ scale: 0.93 }} onClick={() => meet(c.id)}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl p-2 transition ${
                    meetId === c.id ? "bg-white shadow-md ring-2 ring-indigo-500" : "bg-white ring-1 ring-slate-200"
                  }`}>
                  <Character id={c.id} size={54} animate={false} />
                  <span className="w-full truncate text-center font-display text-[9px] font-bold text-ink">
                    {c.name.split(" ").slice(-1)[0]}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setTab("trace"); sfx.whoosh(); }} className="btn-primary !py-3 text-xs sm:text-sm">
                <Pencil className="h-4 w-4" /> {t("st_trace_this")}
              </button>
              <button onClick={() => { setTab("scene"); sfx.whoosh(); }} className="btn-ghost !py-3 text-xs sm:text-sm">
                <Shapes className="h-4 w-4" /> {t("st_tab_scene")}
              </button>
            </div>
          </div>
        )}

        {tab === "trace" && <TraceGame extraColors={palette} />}
        {tab === "color" && <ColorBook extraColors={palette} />}
        {tab === "draw" && <DrawBoard extraColors={palette} />}
        {tab === "scene" && <SceneBuilder extraColors={palette} />}
        {tab === "mix" && (
          <MixLab
            saved={myColors}
            onSave={(c) => persist([c, ...myColors])}
            onRemove={(i) => persist(myColors.filter((_, j) => j !== i))}
            onUseColor={(hex) => {
              const existing = myColors.find((c) => c.hex === hex);
              if (!existing) persist([{ hex, name: t("st_new_color"), ryb: [0, 0, 0] }, ...myColors]);
              setTab("color");
              voice.speak(t("st_mix_applied"));
            }}
          />
        )}
        {tab === "gallery" && (
          gallery.length === 0 ? (
            <div className="card flex flex-col items-center gap-2 p-8 text-center sm:p-10">
              <Images className="h-8 w-8 text-slate-300" />
              <p className="text-xs font-medium text-inksoft sm:text-sm">{t("st_gallery_empty")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:gap-2.5">
              {gallery.map((art) => (
                <motion.div key={art.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art.imageData} alt="" className="aspect-square w-full object-cover" />
                  <div className="px-2 py-1 text-[9px] font-semibold text-inksoft">
                    {new Date(art.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
