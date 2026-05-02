import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Sparkles, RotateCcw, Square } from 'lucide-react'
import useChat from '../hooks/useChat'
import ChatThread from './ChatThread'

/**
 * LiveChat — modal multi-turn conversation overlay used by demo slides
 * (9, 10, 11, 13). Each open = fresh conversation; closing aborts any
 * in-flight stream and clears state.
 */
export default function LiveChat({
  open,
  onClose,
  title = 'Live Demo',
  subtitle = 'Ask anything — follow up freely',
  systemPrompt,
  suggestedPrompts = [],
  maxTokens = 800
}) {
  const inputRef = useRef(null)

  const {
    messages,
    streaming,
    streamingText,
    error,
    send,
    stop,
    clear
  } = useChat({ systemPrompt, maxTokens })

  // Focus input on open; clear on close so each session is fresh.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120)
      return () => clearTimeout(t)
    } else {
      clear()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleSubmit = (override) => {
    const value = (override ?? inputRef.current?.value ?? '').trim()
    if (!value || streaming) return
    if (!override && inputRef.current) inputRef.current.value = ''
    autoSizeInput()
    send(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const autoSizeInput = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }

  const turnCount = messages.filter(m => m.role === 'user').length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/85 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative glass-strong rounded-3xl w-full max-w-5xl h-[92vh] sm:h-auto sm:max-h-[88vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-10 py-5 sm:py-6 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center relative shrink-0">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  {streaming && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse ring-2 ring-ink-900" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight text-white truncate">
                    {title}
                  </div>
                  <div className="text-sm sm:text-base text-white/55 mt-0.5 truncate">
                    {subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {messages.length > 0 && !streaming && (
                  <button
                    onClick={clear}
                    className="hidden sm:inline-flex items-center gap-2 h-10 px-3 rounded-full bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition border border-white/10"
                    aria-label="New conversation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>New chat</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <ChatThread
              messages={messages}
              streaming={streaming}
              streamingText={streamingText}
              error={error}
              onStop={stop}
              emptyState={
                <EmptyState
                  suggestedPrompts={suggestedPrompts}
                  onPick={(p) => handleSubmit(p)}
                />
              }
            />

            {/* Input */}
            <div className="px-5 sm:px-10 py-4 sm:py-6 border-t border-white/8 shrink-0">
              {messages.length > 0 && (
                <div className="hidden sm:flex items-center gap-3 mb-3 text-xs text-white/40">
                  <span className="uppercase tracking-[0.2em]">
                    {turnCount} turn{turnCount === 1 ? '' : 's'}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono">Shift+Enter for newline</span>
                </div>
              )}
              <div className="flex items-end gap-2 sm:gap-3">
                <textarea
                  ref={inputRef}
                  onChange={autoSizeInput}
                  onKeyDown={handleKeyDown}
                  placeholder={messages.length ? 'Follow up…' : 'Type a prompt and press Enter…'}
                  rows={1}
                  className="flex-1 bg-white/5 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-base sm:text-lg text-white placeholder:text-white/30 resize-none focus:outline-none focus:bg-white/8 transition border border-white/5 focus:border-accent-cyan/40"
                  style={{ minHeight: '50px', maxHeight: '160px' }}
                />
                {streaming ? (
                  <button
                    onClick={stop}
                    className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 flex items-center justify-center transition shrink-0"
                    aria-label="Stop generating"
                    title="Stop generating"
                  >
                    <Square className="h-4 w-4 text-white/80" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit()}
                    disabled={streaming}
                    className="h-12 sm:h-14 w-12 sm:w-14 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition shrink-0"
                    aria-label="Send"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </button>
                )}
              </div>
              {/* Mobile: small "new chat" link */}
              {messages.length > 0 && !streaming && (
                <button
                  onClick={clear}
                  className="sm:hidden mt-3 inline-flex items-center gap-1.5 text-xs text-white/55"
                >
                  <RotateCcw className="h-3 w-3" />
                  Start a new conversation
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function EmptyState({ suggestedPrompts, onPick }) {
  if (!suggestedPrompts?.length) return null
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="text-sm uppercase tracking-[0.2em] text-white/45 font-semibold">
        Try one of these
      </div>
      <div className="flex flex-wrap gap-2.5">
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onPick(p)}
            className="px-5 py-3 rounded-full glass border border-white/10 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 text-base text-white/85 transition text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
