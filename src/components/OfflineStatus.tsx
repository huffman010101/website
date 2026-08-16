import { useEffect, useState } from 'react'

type State = 'unsupported' | 'caching' | 'ready' | 'offline-active'

// The service worker downloads ~3.5MB in the background on first visit.
// Until that finishes the site will NOT work offline — but nothing on
// screen tells you that, so it's impossible to know when it's safe to
// disconnect. This surfaces the real state instead of leaving you to guess.
export default function OfflineStatus() {
  const [state, setState] = useState<State>('caching')
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('caches' in window)) {
      setState('unsupported')
      return
    }

    let cancelled = false

    async function check() {
      try {
        // A controller means a service worker is actively handling this
        // page's requests — without it, offline cannot work at all.
        const controlled = !!navigator.serviceWorker.controller
        const names = await caches.keys()
        const precacheName = names.find(n => n.includes('precache'))
        let entries = 0
        if (precacheName) {
          const cache = await caches.open(precacheName)
          entries = (await cache.keys()).length
        }
        if (cancelled) return
        setState(controlled && entries > 0 ? 'ready' : 'caching')
      } catch {
        if (!cancelled) setState('caching')
      }
    }

    check()
    // Precaching finishes asynchronously; poll briefly so the badge flips
    // to "ready" on its own rather than needing a page refresh.
    const interval = setInterval(check, 1500)
    navigator.serviceWorker.ready.then(check).catch(() => {})

    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)

    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (state === 'unsupported') return null

  if (!online) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-teal bg-brand-teal/10 border border-brand-teal/30 px-2.5 py-1 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
        Offline — running from your device
      </span>
    )
  }

  if (state === 'ready') {
    return (
      <span
        title="Every page has been saved to this device. You can turn off your internet and keep using the site."
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-400 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-full"
      >
        ✓ Saved for offline use
      </span>
    )
  }

  return (
    <span
      title="Downloading the site to your device. Stay connected until this says saved."
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
      Saving for offline…
    </span>
  )
}
