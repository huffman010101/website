import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// The service worker uses skipWaiting + clientsClaim so offline works from
// the very first visit. The side effect is that when a new version deploys,
// the new worker can take over a tab that is still running the PREVIOUS
// build's JavaScript — leaving stale code talking to a freshly-updated
// cache, which shows up as odd half-loaded or out-of-date content.
// Reloading once when the controller changes keeps the page and the cache
// on the same version. The sessionStorage flag prevents a reload loop.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    try {
      if (sessionStorage.getItem('findr_sw_reloaded') === '1') return
      sessionStorage.setItem('findr_sw_reloaded', '1')
    } catch {
      // Private mode / storage disabled: skip the reload rather than risk a loop.
      return
    }
    window.location.reload()
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
