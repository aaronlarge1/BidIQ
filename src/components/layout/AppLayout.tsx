import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import AIAssistant from "@/components/AIAssistant"

export default function AppLayout() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col">
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onAIOpen={() => setAiOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* AI Assistant */}
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  )
}
