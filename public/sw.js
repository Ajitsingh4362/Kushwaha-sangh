// Kushwaha Sangh — service worker
// Goal: make the site/admin dashboard installable as an app on mobile.
// Only the static app shell (icons/manifest) is cached — everything else
// (Supabase data, donations ledger, member/dues info) always comes fresh
// from the network so nothing stale or wrong is ever shown.

const CACHE_NAME = 'kushwaha-sangh-shell-v1'
const SHELL_ASSETS = [
  '/manifest.json',
  '/favicon-180.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
]

function isNetworkFirst(url) {
  return url.pathname === '/' || url.pathname.endsWith('.html')
}

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

self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Never touch Supabase / third-party calls or non-GET requests.
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  if (isNetworkFirst(url)) {
    event.respondWith(
      fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
        }
        return res
      }).catch(() => caches.match(req).then((cached) => cached || caches.match('/index.html')))
    )
    return
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy))
        }
        return res
      })
    })
  )
})
