import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Square, RotateCcw, Sparkles, MessageCircle } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import ChatThread from '../ChatThread'
import useChat from '../../hooks/useChat'
import { persistentChatStore } from '../../lib/chatStore'

/**
 * Slide 13 — Talk to Claude.
 *
 * Persistent multi-turn chat surface embedded directly into the slide
 * deck. Conversation state lives in `persistentChatStore` so navigating
 * away to another slide and coming back keeps the thread intact — useful
 * during Q&A when the presenter wants to come back to a thread they
 * started earlier.
 *
 * Distinct from the LiveChat modal:
 *  - Always visible, no overlay chrome
 *  - Inline layout (no modal scrim)
 *  - Conversation persists across slide changes
 *  - Workshop-themed system prompt
 */

const SYSTEM_PROMPT = [
  "You're Claude, helping a live audience at a Burbank Chamber of Commerce",
  "AI workshop run by Romik Hacobian (Media City Design) and Jim Festante",
  "(Healthe Habits). Audience is small-business owners — restaurants, retail,",
  "trades, services, coaches. Be specific, concrete, and practical. Default",
  "to 2–4 short paragraphs unless asked otherwise. Skip filler intros and",
  "disclaimers. When useful, suggest a follow-up the presenter could ask",
  "next. No bullet-point spam — prose first, lists only when they truly help."
].join(' ')

const STARTER_PROMPTS = [
  "I run a small Burbank restaurant. Give me one AI workflow I could set up this week that saves real time.",
  "What's the single most overrated way people are using AI right now in small business?",
  "Write a prompt I can paste into Claude tomorrow morning to draft my next email newsletter.",
  "What's a job AI is genuinely BAD at that I should keep doing myself?"
]

export default function Slide13_TalkToClaude() {
  const inputRef = useRef(null)

  const {
    messages,
    streaming,
    streamingText,
    error,
    send,
    stop,
    clear
  } = useChat({
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 800,
    store: persistentChatStore
  })

  // Focus input when the slide mounts so the presenter can type immediately.
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250)
    return () => clearTimeout(t)
  }, [])

  const handleSubmit = (override) => {
    const value = (override ?? inputRef.current?.value ?? '').trim()
    if (!value || streaming) return
    if (!override && inputRef.current) inputRef.current.value = ''
    autoSize()
    send(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const autoSize = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  const turnCount = messages.filter(m => m.role === 'user').length

  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="Try It Live"
        title={<>Talk to <em className="gradient-text">Claude.</em></>}
        presenter="romik"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-base lg:text-lg text-white/65 max-w-3xl mb-5 lg:mb-7"
      >
        Real conversation. Real answers. Take an audience suggestion, type it in,
        watch it generate. Conversation stays here even if we click away.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col glass rounded-3xl border border-white/10 overflow-hidden min-h-0 relative"
        style={{ minHeight: '440px' }}
      >
        {/* Subtle inner glow that pulses while streaming */}
        <AnimatePresence>
          {streaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                boxShadow: '0 0 0 1px rgba(34, 211, 238, 0.35) inset, 0 0 80px rgba(34, 211, 238, 0.08) inset'
              }}
            />
          )}
        </AnimatePresence>

        {/* Conversation header strip */}
        <div className="flex items-center justify-between px-6 lg:px-8 py-3.5 border-b border-white/8 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center relative">
              <Sparkles className="h-4 w-4 text-white" />
              {streaming && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-ink-900" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/65">
              <span className="font-semibold text-white/90">Claude</span>
              <span className="text-white/30">·</span>
              <span className="font-mono text-xs uppercase tracking-[0.2em]">
                {streaming ? 'streaming' : turnCount > 0 ? `${turnCount} turn${turnCount === 1 ? '' : 's'}` : 'ready'}
              </span>
            </div>
          </div>
          {messages.length > 0 && !streaming && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-xs text-white/55 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Thread or empty state */}
        <ChatThread
          messages={messages}
          streaming={streaming}
          streamingText={streamingText}
          error={error}
          onStop={stop}
          density="compact"
          emptyState={<SlideEmptyState onPick={(p) => handleSubmit(p)} />}
        />

        {/* Input */}
        <div className="px-5 lg:px-8 py-4 lg:py-5 border-t border-white/8 shrink-0 relative z-10">
          <div className="flex items-end gap-2 lg:gap-3">
            <textarea
              ref={inputRef}
              onChange={autoSize}
              onKeyDown={handleKeyDown}
              placeholder={messages.length ? 'Follow up — try going deeper…' : 'Type a question. The audience is watching.'}
              rows={1}
              className="flex-1 bg-white/5 rounded-xl px-4 lg:px-5 py-3 text-base lg:text-lg text-white placeholder:text-white/30 resize-none focus:outline-none focus:bg-white/8 transition border border-white/5 focus:border-accent-cyan/40"
              style={{ minHeight: '48px', maxHeight: '140px' }}
            />
            {streaming ? (
              <button
                onClick={stop}
                className="h-12 w-12 lg:h-13 lg:w-13 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition shrink-0"
                style={{ height: '48px', width: '48px' }}
                aria-label="Stop generating"
                title="Stop generating"
              >
                <Square className="h-4 w-4 text-white/80" />
              </button>
            ) : (
              <button
                onClick={() => handleSubmit()}
                disabled={streaming}
                className="rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition shrink-0"
                style={{ height: '48px', width: '48px' }}
                aria-label="Send"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </SlideFrame>
  )
}

function SlideEmptyState({ onPick }) {
  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-2.5 text-sm uppercase tracking-[0.2em] text-white/55 font-semibold">
        <MessageCircle className="h-4 w-4 text-accent-cyan" />
        Audience suggestions to try
      </div>
      <div className="grid sm:grid-cols-2 gap-2.5 lg:gap-3">
        {STARTER_PROMPTS.map((p, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            onClick={() => onPick(p)}
            className="group text-left px-5 py-3.5 rounded-xl glass border border-white/10 hover:border-accent-cyan/40 hover:bg-accent-cyan/5 text-[15px] lg:text-base text-white/85 transition"
          >
            <span className="block leading-snug">{p}</span>
          </motion.button>
        ))}
      </div>
      <div className="text-xs text-white/40 italic pt-2">
        Best move: ignore these and ask whatever the room just shouted out.
      </div>
    </div>
  )
}
