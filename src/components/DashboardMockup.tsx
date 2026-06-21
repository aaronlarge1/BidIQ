// Premium product screenshot mockup for the hero section
// Rendered as SVG/JSX to avoid needing actual screenshots

export default function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Glow behind the mockup */}
      <div className="absolute inset-0 -bottom-8 bg-govgreen-500/15 blur-3xl rounded-full" />
      <div className="absolute inset-0 -bottom-4 bg-blue-500/10 blur-2xl rounded-3xl" />

      {/* Browser chrome */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)] border border-white/10"
        style={{ background: "linear-gradient(180deg, #1a2847 0%, #1e3055 100%)" }}
      >
        {/* Browser top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8" style={{ background: "rgba(15,31,56,0.8)" }}>
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/60" />
            <div className="h-3 w-3 rounded-full bg-amber-400/60" />
            <div className="h-3 w-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 mx-3 h-6 rounded-md bg-white/8 border border-white/10 flex items-center px-3">
            <span className="text-[11px] text-white/40 font-mono">app.bidiqpro.co.uk/dashboard</span>
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-5 rounded bg-white/8 border border-white/10" />
            <div className="h-5 w-5 rounded bg-white/8 border border-white/10" />
          </div>
        </div>

        {/* App layout */}
        <div className="flex" style={{ minHeight: 420 }}>
          {/* Sidebar */}
          <div className="w-44 shrink-0 border-r border-white/8 flex flex-col py-3 gap-0.5" style={{ background: "rgba(15,31,56,0.9)" }}>
            {/* Logo */}
            <div className="flex items-center gap-2 px-3 pb-3 mb-1 border-b border-white/8">
              <div className="h-6 w-6 rounded-md bg-govgreen-600 flex items-center justify-center">
                <span className="text-white font-black text-[11px]">B</span>
              </div>
              <span className="text-white font-bold text-xs">BidIQ Pro</span>
            </div>

            {[
              { label: "Dashboard", active: true, dot: null },
              { label: "Find Tenders", active: false, dot: "green" },
              { label: "Bid Pipeline", active: false, dot: null },
              { label: "AI Bid Workspace", active: false, dot: null },
              { label: "Compliance Vault", active: false, dot: "amber" },
              { label: "Contract Delivery", active: false, dot: null },
              { label: "Evidence Vault", active: false, dot: null },
              { label: "Buyer Intelligence", active: false, dot: null },
            ].map(({ label, active, dot }) => (
              <div
                key={label}
                className="mx-2 px-2 py-1.5 rounded-md flex items-center gap-2"
                style={{ background: active ? "rgba(255,255,255,0.12)" : "transparent" }}
              >
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  dot === "green" ? "bg-govgreen-400" :
                  dot === "amber" ? "bg-amber-400" :
                  active ? "bg-white" : "bg-white/20"
                }`} />
                <span className={`text-[10px] font-medium truncate ${active ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden" style={{ background: "rgba(240,244,250,0.06)" }}>
            {/* Page header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold text-sm">Dashboard</div>
                <div className="text-white/40 text-[10px]">Greenfield Infrastructure Ltd · Demo Mode</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                </div>
                <div className="h-6 w-6 rounded-full bg-navy-700 border border-white/15 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">GL</span>
                </div>
              </div>
            </div>

            {/* Stat cards row */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: "Pipeline Value", value: "£4.2M", change: "+18%", color: "#22c55e", border: "#16a34a" },
                { label: "Active Bids", value: "7", change: "3 due soon", color: "#60a5fa", border: "#3b82f6" },
                { label: "Readiness Score", value: "82%", change: "+6pts", color: "#a78bfa", border: "#8b5cf6" },
                { label: "Compliance Gaps", value: "2", change: "Action needed", color: "#fb923c", border: "#f97316" },
              ].map(({ label, value, change, color, border }) => (
                <div
                  key={label}
                  className="rounded-lg p-3 border"
                  style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", borderLeftWidth: 3, borderLeftColor: border }}
                >
                  <div className="text-[9px] text-white/50 mb-1">{label}</div>
                  <div className="text-white font-bold text-base leading-none mb-1">{value}</div>
                  <div className="text-[9px]" style={{ color }}>{change}</div>
                </div>
              ))}
            </div>

            {/* Main content row */}
            <div className="grid grid-cols-5 gap-3">
              {/* Pipeline chart */}
              <div className="col-span-3 rounded-lg p-3 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="text-white/70 text-[10px] font-semibold mb-3">Bid Pipeline Value (£000s)</div>
                <div className="flex items-end gap-1.5 h-20">
                  {[
                    { h: 15, label: "Jan" },
                    { h: 30, label: "Feb" },
                    { h: 50, label: "Mar" },
                    { h: 72, label: "Apr" },
                    { h: 62, label: "May" },
                    { h: 90, label: "Jun", active: true },
                  ].map(({ h, label, active }) => (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: active
                            ? "linear-gradient(180deg, #22c55e, #16a34a)"
                            : "rgba(255,255,255,0.15)"
                        }}
                      />
                      <span className="text-[8px] text-white/30">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live tenders */}
              <div className="col-span-2 rounded-lg p-3 border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/70 text-[10px] font-semibold">Live Matches</span>
                  <span className="text-[8px] text-govgreen-400 font-medium bg-govgreen-400/15 px-1.5 py-0.5 rounded-full">
                    12 new
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { title: "A303 Resurfacing", buyer: "Nat. Highways", value: "£280k", score: 94, tag: "Highways" },
                    { title: "FM Services NHS", buyer: "NHS Trust", value: "£1.2M", score: 78, tag: "NHS" },
                    { title: "Street Lighting", buyer: "Surrey CC", value: "£450k", score: 71, tag: "Local Gov" },
                  ].map(({ title, buyer, value, score, tag }) => (
                    <div key={title} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="min-w-0 flex-1">
                        <div className="text-white text-[9px] font-medium truncate">{title}</div>
                        <div className="text-white/40 text-[8px]">{buyer} · {value}</div>
                      </div>
                      <div
                        className="ml-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                        style={{
                          background: score >= 80 ? "rgba(34,197,94,0.2)" : "rgba(251,191,36,0.2)",
                          color: score >= 80 ? "#4ade80" : "#fbbf24"
                        }}
                      >
                        {score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI recommendation strip */}
            <div
              className="mt-3 rounded-lg px-3 py-2 flex items-center gap-2 border"
              style={{ background: "rgba(22,163,74,0.12)", borderColor: "rgba(22,163,74,0.25)" }}
            >
              <div className="h-5 w-5 rounded-md bg-govgreen-600 flex items-center justify-center shrink-0">
                <span className="text-white text-[9px] font-bold">AI</span>
              </div>
              <span className="text-[9px] text-govgreen-300 font-medium">
                Recommended action: Complete insurance renewal (expires in 8 days) before submitting A303 bid
              </span>
              <div className="ml-auto shrink-0 text-[8px] text-govgreen-400 border border-govgreen-600/40 rounded px-1.5 py-0.5">
                Fix now
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
