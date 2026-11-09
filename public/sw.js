// Kushwaha Sangh — service worker
// Goal: make the site/admin dashboard installable as an app on mobile,
// WITHOUT ever showing an old version of the site after a deploy.
//
// - Page loads (/, /community, /admin, …): always from the network, so a new
//   deploy shows up on a normal refresh. The cached copy is used only offline.
// - /assets/* (JS/CSS with a content hash in the file name): cached forever —
//   a new deploy gets new file names, so these can never be stale.
// - Icons/manifest: cached.
// - Supabase and other sites: never touched.
//
// v2 cached every page cache-first, which served an old index.html (and so
// the old site) until a hard refresh. Bumping the name deletes that cache.

const CACHE_NAME = 'kushwaha-sangh-shell-v3'
const SHELL_ASSETS = [
  '/manifest.json',
  '/favicon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  )
})

function putInCache(req, res) {
  if (res.ok) {
    const copy = res.clone()
    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
  }
  return res
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Never touch Supabase / third-party calls or non-GET requests.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  // Page loads: network first, offline fallback to the last app shell.
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => putInCache('/index.html', res))
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // Hashed build files and shell assets: cache first.
  if (url.pathname.startsWith('/assets/') || SHELL_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => putInCache(req, res))))
    return
  }

  // Everything else (sitemap, images in /public, sw.js …): plain network.
})
