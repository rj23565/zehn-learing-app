"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CloudOff, RefreshCw } from "lucide-react";
import { useApp } from "./providers";

export function NetworkReady() {
  const { t, refresh } = useApp();
  const [online, setOnline] = useState(true);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);

    if ("serviceWorker" in navigator) {
      const register = () => {
        navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
      };
      // Registration should never compete with the first meaningful paint.
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(register);
      } else {
        setTimeout(register, 900);
      }
    }

    const goOffline = () => setOnline(false);
    const goOnline = () => {
      setOnline(true);
      navigator.serviceWorker?.controller?.postMessage({ type: "REPLAY_QUEUE" });
      void refresh();
    };
    const onMessage = (event: MessageEvent<{ type?: string }>) => {
      if (event.data?.type !== "ZEHN_SYNC_COMPLETE") return;
      setSynced(true);
      setTimeout(() => setSynced(false), 2200);
      void refresh();
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    navigator.serviceWorker?.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      navigator.serviceWorker?.removeEventListener("message", onMessage);
    };
  }, [refresh]);

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed inset-x-2 top-2 z-[100] mx-auto flex max-w-sm items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-white shadow-xl">
          <CloudOff className="h-4 w-4 shrink-0 text-amber-300" />
          <span className="flex-1 text-[11px] font-semibold leading-snug">{t("net_offline")}</span>
          <RefreshCw className="h-3.5 w-3.5 animate-pulse text-slate-400" />
        </motion.div>
      )}
      {online && synced && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="fixed inset-x-2 top-2 z-[100] mx-auto flex w-fit items-center gap-2 rounded-full bg-emerald-500 px-4 py-2.5 text-white shadow-xl">
          <Check className="h-4 w-4" strokeWidth={3} />
          <span className="text-[11px] font-bold">{t("net_synced")}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
