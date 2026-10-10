"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CloudCheck, Fingerprint, GraduationCap, Languages, Loader2, Pencil,
  Save, ShieldCheck, Smartphone, Trophy, Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/components/providers";
import { Avatar, AVATARS } from "@/components/Avatar";
import { LanguagePicker } from "@/components/LanguagePicker";
import { LANGS } from "@/i18n/dictionaries";
import { sfx } from "@/lib/sounds";

export default function Profile() {
  const { status, profile, stats, deviceId, lang, t, updateProfile } = useApp();
  const router = useRouter();
  const [langOpen, setLangOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "onboarding") router.replace("/onboarding");
  }, [status, router]);

  if (status !== "ready" || !profile) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="h-9 w-9 animate-spin text-violet-500" />
      </div>
    );
  }

  const flashSaved = () => {
    setSaved(true);
    sfx.correct();
    setTimeout(() => setSaved(false), 1800);
  };

  const saveName = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    await updateProfile({ name: name.trim() });
    setSaving(false);
    setEditingName(false);
    flashSaved();
  };

  const changeGrade = async (g: number) => {
    setGrade(null);
    await updateProfile({ grade: g });
    flashSaved();
  };

  const langMeta = LANGS.find((l) => l.code === lang);
  const statItems = [
    { icon: Zap, v: profile.xp, k: "common_xp", tint: "text-violet-600" },
    { icon: Trophy, v: stats?.lessonsDone ?? 0, k: "dash_lessons_done", tint: "text-emerald-600" },
    { icon: Smartphone, v: stats?.gamesPlayed ?? 0, k: "dash_games_played", tint: "text-amber-600" },
  ];

  return (
    <AppShell>
      <h1 className="font-display text-2xl font-extrabold text-ink">{t("pf_title")}</h1>

      {/* identity card */}
      <div className="card mt-4 overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-fuchsia-500 p-5">
          <div className="flex items-center gap-4">
            <button onClick={() => setAvatar(avatar === null ? profile.avatar : null)} className="relative">
              <Avatar id={avatar ?? profile.avatar} size={72} className="!rounded-3xl ring-4 ring-white/25" />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-violet-600 shadow">
                <Pencil className="h-3 w-3" />
              </span>
            </button>
            <div className="min-w-0 flex-1">
              {editingName ? (
                <div className="flex gap-2">
                  <input value={name} onChange={(e) => setName(e.target.value.slice(0, 24))} autoFocus
                    className="w-full rounded-xl border-0 px-3 py-2 font-display text-base font-bold text-ink outline-none" />
                  <button onClick={saveName} disabled={saving}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
                    {saving ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Save className="h-4.5 w-4.5" />}
                  </button>
                </div>
              ) : (
                <button onClick={() => { setName(profile.name); setEditingName(true); }}
                  className="group flex items-center gap-2 font-display text-2xl font-extrabold text-white">
                  <span className="truncate">{profile.name}</span>
                  <Pencil className="h-4 w-4 opacity-0 transition group-hover:opacity-80" />
                </button>
              )}
              <div className="mt-0.5 text-sm font-bold text-violet-100/85">
                {t("common_level")} {profile.level} · {profile.streak} {t("dash_streak")}
              </div>
            </div>
          </div>
        </div>

        {/* avatar chooser */}
        {avatar !== null && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            className="border-b border-violet-50 px-4 py-3">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-inksoft">{t("pf_pick_avatar")}</div>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button key={a.id}
                  onClick={async () => { setAvatar(a.id); await updateProfile({ avatar: a.id }); flashSaved(); }}
                  className={`rounded-2xl p-1 transition ${profile.avatar === a.id ? "bg-violet-200 ring-2 ring-violet-500" : "bg-violet-50"}`}>
                  <Avatar id={a.id} size={44} className="mx-auto" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* device identity */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Fingerprint className="h-5.5 w-5.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-sm font-bold text-ink">{t("pf_device")}</div>
            <div className="truncate text-xs font-semibold text-inksoft">
              {t("pf_device_sub")} · <span className="font-mono">{deviceId.slice(0, 8).toUpperCase()}</span>
            </div>
          </div>
          <span className="chip shrink-0 bg-emerald-100 text-emerald-700">
            <CloudCheck className="h-3.5 w-3.5" /> {t("pf_cloud_on")}
          </span>
        </div>
      </div>

      {/* stats */}
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {statItems.map((s) => (
          <div key={s.k} className="card p-4 text-center">
            <s.icon className={`mx-auto h-5 w-5 ${s.tint}`} />
            <div className={`mt-1.5 font-display text-2xl font-extrabold ${s.tint}`}>{s.v}</div>
            <div className="text-[10.5px] font-bold uppercase tracking-wide text-inksoft">{t(s.k)}</div>
          </div>
        ))}
      </div>

      {/* settings */}
      <div className="card mt-4 divide-y divide-violet-50">
        {/* grade */}
        <div className="px-4 py-3.5">
          <button onClick={() => setGrade(grade === null ? profile.grade : null)} className="flex w-full items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <GraduationCap className="h-5.5 w-5.5" />
            </span>
            <span className="flex-1 text-start font-display text-sm font-bold text-ink">{t("pf_grade")}</span>
            <span className="chip bg-violet-600 text-white">
              {profile.grade === 0 ? t("ob_kg") : t("ob_class", { n: profile.grade })}
            </span>
          </button>
          {grade !== null && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden">
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                <button onClick={() => changeGrade(0)}
                  className="col-span-4 rounded-xl bg-violet-50 py-2 font-display text-xs font-bold text-ink ring-1 ring-violet-100">
                  {t("ob_kg")}
                </button>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <button key={g} onClick={() => changeGrade(g)}
                    className="rounded-xl bg-violet-50 py-2 font-display text-xs font-bold text-ink ring-1 ring-violet-100 transition hover:bg-violet-600 hover:text-white">
                    {t("ob_class", { n: g })}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* language */}
        <button onClick={() => setLangOpen(true)} className="flex w-full items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
            <Languages className="h-5.5 w-5.5" />
          </span>
          <span className="flex-1 text-start font-display text-sm font-bold text-ink">{t("pf_language")}</span>
          <span className="chip bg-sky-100 text-sky-700">{langMeta?.native}</span>
        </button>

        {/* cloud */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ShieldCheck className="h-5.5 w-5.5" />
          </span>
          <span className="flex-1 font-display text-sm font-bold text-ink">{t("pf_cloud")}</span>
          <span className="chip bg-emerald-100 text-emerald-700">{t("dash_sync")}</span>
        </div>

        {/* joined */}
        <div className="flex items-center justify-between px-4 py-3.5 text-sm font-bold text-inksoft">
          <span>{t("pf_joined")}</span>
          <span className="text-ink">
            {new Date(profile.createdAt).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* saved toast */}
      {saved && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-emerald-500 px-5 py-2.5 font-display text-sm font-bold text-white shadow-xl">
          {t("pf_changed")}
        </motion.div>
      )}

      <LanguagePicker open={langOpen} onClose={() => setLangOpen(false)} />
    </AppShell>
  );
}
