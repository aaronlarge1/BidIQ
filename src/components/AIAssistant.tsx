import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAiGenerateAnswer } from "@/hooks/useApi"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS = [
  "Should I bid on the A57 contract?",
  "What documents am I missing?",
  "How do I score higher on social value?",
  "Find highways contracts near Manchester",
  "Build my readiness plan",
  "Explain PAS 91 requirements",
]

interface AIAssistantProps {
  open: boolean
  onClose: () => void
  question?: string
  tenderTitle?: string
  buyerType?: string
  bidId?: string
}

export default function AIAssistant({ open, onClose, question, tenderTitle, buyerType, bidId }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI Procurement Assistant. I can help you find contracts, improve bids, check your readiness, and answer procurement questions. What would you like to do?"
    }
  ])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const generateAnswer = useAiGenerateAnswer()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loading = generateAnswer.isPending

  async function send(text?: string) {
    const content = text ?? input.trim()
    if (!content) return
    setInput("")
    const userMsg: Message = { id: Date.now().toString(), role: "user", content }
    setMessages(prev => [...prev, userMsg])

    try {
      const result = await generateAnswer.mutateAsync({
        question: content,
        tenderTitle: tenderTitle ?? question,
        buyerType,
        bidId,
      })
      const reply: Message = {
        id: Date.now().toString() + "r",
        role: "assistant",
        content: result.answer,
      }
      setMessages(prev => [...prev, reply])
    } catch {
      const errorMsg: Message = {
        id: Date.now().toString() + "e",
        role: "assistant",
        content: "Sorry, I couldn't get a response right now. Please try again in a moment.",
      }
      setMessages(prev => [...prev, errorMsg])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col shadow-2xl rounded-2xl overflow-hidden border"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-navy-900 text-white">
            <div className="h-8 w-8 rounded-full bg-govgreen-600 flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">AI Procurement Assistant</p>
              <p className="text-[11px] text-navy-300">Powered by BidIQ Pro</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-navy-800 h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {msg.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-navy-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-navy-700" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line",
                  msg.role === "user"
                    ? "bg-navy-900 text-white rounded-tr-sm"
                    : "bg-navy-50 text-navy-900 rounded-tl-sm"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="h-7 w-7 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                  <Bot className="h-3.5 w-3.5 text-navy-700" />
                </div>
                <div className="bg-navy-50 rounded-2xl rounded-tl-sm px-3 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-navy-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 bg-white border-t flex gap-2 overflow-x-auto scrollbar-hide">
              {QUICK_PROMPTS.slice(0, 3).map(p => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="shrink-0 text-xs rounded-full border border-navy-200 px-3 py-1.5 text-navy-700 hover:bg-navy-50 transition-colors whitespace-nowrap"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask anything about procurement..."
              className="flex-1 text-sm border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-navy-900/20 bg-muted"
            />
            <Button
              size="icon"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="rounded-xl bg-navy-900 hover:bg-navy-800 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
