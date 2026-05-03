import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, User, Loader2, AlertTriangle, Square } from 'lucide-react'
import useMatrixText from '../hooks/useMatrixText'

/**
 * Shared message-thread renderer used by both the LiveChat modal and the
 * persistent ChatSlide. Renders alternating user/assistant turns plus the
 * in-flight streaming reply.
 *
 * Visual decisions:
 *  - Right-aligned user bubbles (familiar chat affordance)
 *  - Left-aligned Claude replies with a Sparkles avatar
 *  - Assistant text in mono/serif blend so it reads as "machine output, but
 *    elegantly" — matches the deck's font palette
 *  - Auto-scrolls to bottom on new content; respects user scroll-up
 */
export default function ChatThread({
  messages,
  streaming,
  streamingText,
  error,
  emptyState,
  onStop,
  density = 'comfortable',
  className = ''
}) {
  const scrollRef = useRef(null)
  const stickToBottomRef = useRef(true)

  // Track whether the user has scrolled up — if so, don't auto-scroll on
  // new chunks (lets them read past output without being yanked down).
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    stickToBottomRef.current = distanceFromBottom < 60
  }

  useEffect(() => {
    if (!stickToBottomRef.current) return
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, streamingText])

  const isEmpty = messages.length === 0 && !streaming && !error

  const padding = density === 'compact' ? 'px-5 py-5' : 'px-7 sm:px-10 py-7'

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className={`flex-1 overflow-y-auto elegant-scroll ${padding} ${className}`}
    >
      {isEmpty && emptyState}

      <div className="space-y-7 max-w-3xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <Message
              key={i}
              role={m.role}
              content={m.content}
              stopped={m.stopped}
            />
          ))}
        </AnimatePresence>

        {streaming && (
          <StreamingMessage text={streamingText} onStop={onStop} />
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/5 px-5 py-4 text-red-300"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed font-mono">{error}</div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Message({ role, content, stopped }) {
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-start gap-3 justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-to-br from-accent-cyan/15 to-accent-indigo/15 border border-accent-cyan/25 px-5 py-3.5">
          <div className="text-sm uppercase tracking-[0.2em] text-accent-cyan/85 mb-1.5 font-semibold">
            You
          </div>
          <div className="text-base lg:text-lg text-white/95 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
        <div className="h-9 w-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <User className="h-4 w-4 text-white/70" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3"
    >
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/4 border border-white/8 px-5 py-3.5">
        <div className="text-sm uppercase tracking-[0.2em] text-accent-cyan mb-1.5 font-semibold flex items-center gap-2">
          Claude
          {stopped && (
            <span className="normal-case tracking-normal text-[10px] text-white/40">
              · stopped
            </span>
          )}
        </div>
        <div className="font-mono text-base lg:text-[17px] leading-relaxed text-white/95 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </motion.div>
  )
}

function StreamingMessage({ text, onStop }) {
  // Matrix-style decode: characters scramble through random glyphs
  // before locking into their real letters. Reveal rate is constant
  // regardless of network jitter.
  const { revealed, scramble } = useMatrixText(text, { revealRate: 4, scrambleLength: 6 })
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center shrink-0 mt-0.5 relative">
        <Sparkles className="h-4 w-4 text-white" />
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-ink-900" />
      </div>
      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/4 border border-white/8 px-5 py-3.5 flex-1">
        <div className="text-sm uppercase tracking-[0.2em] text-accent-cyan mb-1.5 font-semibold flex items-center gap-2 justify-between">
          <span className="flex items-center gap-2">
            Claude
            {!text && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {text && (
              <span className="text-emerald-400 normal-case tracking-normal text-[11px]">
                ● streaming
              </span>
            )}
          </span>
          {onStop && (
            <button
              onClick={onStop}
              className="normal-case tracking-normal text-[11px] text-white/55 hover:text-white inline-flex items-center gap-1 px-2 py-1 rounded-md border border-white/10 hover:border-white/30 transition"
              aria-label="Stop generating"
            >
              <Square className="h-3 w-3" /> Stop
            </button>
          )}
        </div>
        <div className="font-mono text-base lg:text-[17px] leading-relaxed text-white/95 whitespace-pre-wrap">
          {revealed}
          <span className="matrix-scramble">{scramble}</span>
          {<span className="caret"></span>}
        </div>
      </div>
    </motion.div>
  )
}
