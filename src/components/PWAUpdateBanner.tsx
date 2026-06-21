import { useRegisterSW } from "virtual:pwa-register/react"
import { RefreshCw, X } from "lucide-react"
import { useState } from "react"

export function PWAUpdateBanner() {
  const [dismissed, setDismissed] = useState(false)
  const {
    needRefresh: [needRefresh],
    updateSW,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      // Check for updates every 60 seconds while the tab is open
      if (r) {
        setInterval(() => r.update(), 60_000)
      }
    },
  })

  if (!needRefresh || dismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100vw-2rem)] max-w-sm"
    >
      <div className="flex items-center gap-3 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight">
            New version available
          </p>
          <p className="text-xs text-navy-300 mt-0.5">
            Tap to load the latest update
          </p>
        </div>
        <button
          onClick={() => updateSW(true)}
          className="flex items-center gap-1.5 rounded-full bg-govgreen-600 hover:bg-govgreen-500 active:bg-govgreen-700 text-white text-xs font-bold px-3 py-2 transition-colors shrink-0"
          aria-label="Refresh to update"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-navy-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-navy-800"
          aria-label="Dismiss update notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
