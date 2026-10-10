/* Zehn offline service worker — deliberately dependency-free. */
const VERSION = "zehn-v5";
const STATIC = `${VERSION}-static`;
const RUNTIME = `${VERSION}-runtime`;
const API = `${VERSION}-api`;
const SHELL = [
  "/", "/dashboard", "/learn", "/games", "/letters", "/studio",
  "/history", "/progress", "/tutor", "/profile", "/diary", "/cartoons",
  "/images/logo.png", "/images/hero-mature.webp", "/images/games.webp",
  "/manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC).then(async (cache) => {
      await Promise.allSettled(SHELL.map((url) => cache.add(url)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)))),
      self.clients.claim(),
      replayQueue(),
    ])
  );
});

/* ---------------------------- caching ----------------------------- */
async function cacheFirst(request) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok) (await caches.open(RUNTIME)).put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName, timeoutMs) {
  const cache = await caches.open(cacheName);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timer);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    clearTimeout(timer);
    return (await cache.match(request)) || (await caches.match(request)) || null;
  }
}

function offlineJson() {
  return new Response(JSON.stringify({ offline: true, ok: false }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.method !== "GET") {
    if (["/api/games", "/api/progress", "/api/xp", "/api/uploads", "/api/device"].includes(url.pathname)) {
      event.respondWith(networkOrQueue(request));
    }
    return;
  }

  // Build assets, fonts and images rarely change within a version.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/images/") || /\.(png|jpg|jpeg|webp|svg|woff2?)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Personal APIs use fresh data when possible, but return the last result
  // within 2.8 seconds on a weak connection.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API, 2800).then((response) => response || offlineJson()));
    return;
  }

  // Navigation: network first, then exact cached page, then dashboard/home.
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const response = await networkFirst(request, RUNTIME, 3200);
      if (response) return response;
      return (await caches.match(url.pathname)) || (await caches.match("/dashboard")) || (await caches.match("/"));
    })());
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME, 3200).then((response) => response || new Response("", { status: 504 })));
});

/* ----------------------- offline write queue ---------------------- */
const DB = "zehn-offline";
const STORE = "requests";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function serialise(request) {
  const clone = request.clone();
  return {
    url: clone.url,
    method: clone.method,
    headers: [...clone.headers.entries()],
    body: await clone.arrayBuffer(),
    createdAt: Date.now(),
  };
}

async function queueRequest(request) {
  const db = await openDB();
  const data = await serialise(request);
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(data);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  if (self.registration.sync) {
    try { await self.registration.sync.register("zehn-sync"); } catch { /* unsupported/private */ }
  }
}

async function networkOrQueue(request) {
  try {
    return await fetch(request.clone());
  } catch {
    await queueRequest(request);
    return new Response(JSON.stringify({
      ok: true, queued: true, xpAwarded: 0, best: 0,
      message: "Saved offline — will sync automatically",
    }), { status: 202, headers: { "Content-Type": "application/json" } });
  }
}

async function allQueued() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function removeQueued(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

async function replayQueue() {
  const rows = await allQueued().catch(() => []);
  for (const row of rows) {
    try {
      const response = await fetch(row.url, {
        method: row.method,
        headers: new Headers(row.headers),
        body: row.method === "GET" || row.method === "HEAD" ? undefined : row.body,
      });
      if (response.ok) await removeQueued(row.id);
    } catch {
      break; // still offline; preserve order and wait
    }
  }
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => client.postMessage({ type: "ZEHN_SYNC_COMPLETE" }));
}

self.addEventListener("sync", (event) => {
  if (event.tag === "zehn-sync") event.waitUntil(replayQueue());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "REPLAY_QUEUE") event.waitUntil(replayQueue());
});
