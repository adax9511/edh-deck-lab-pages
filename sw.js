/* EDH Lab service worker.
   Network-first for same-origin so deploys refresh immediately; cache is the offline fallback.
   Bump CACHE whenever the cached file list changes. */
/* Paths are relative to the worker's own scope, so the same file works whether the
   site is served from a domain root (Netlify) or a /repo-name/ subpath (GitHub Pages). */
const CACHE = 'edhlab-v2';
const SHELL = ['./', './index.html', './app.js', './manifest.webmanifest', './icon.svg'];
const HOME = new URL('./', self.registration.scope).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache API traffic or serverless functions — always hit the network.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/.netlify/')) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match(`${HOME}index.html`)))
  );
});
