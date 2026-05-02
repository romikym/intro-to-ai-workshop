import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircleQuestion, Mic, Sparkles, Check } from 'lucide-react'
import { createPoller, listQuestions, toggleAnswered } from '../lib/qa'

/**
 * QuestionQueue — floating panel that lives in the lower-right of slide 11
 * during the live talk. Polls the Q&A backend every 4s and renders unanswered
 * questions as actionable cards.
 *
 * Each card has two actions:
 *   - "Ask aloud"   → marks the question as answered (presenter will read it)
 *   - "Claude"      → invokes onAskClaude(question) for the theater overlay
 *
 * Designed to sit unobtrusively in the corner during slide 11 so presenters
 * can triage questions without leaving the slide.
 */
export default function QuestionQueue({ onAskClaude, hidden }) {
  const [questions, setQuestions] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const pollerRef = useRef(null)

  useEffect(() => {
    setError(null)
    listQuestions()
      .then((qs) => { setQuestions(qs); setLoaded(true) })
      .catch((err) => { setError(err.message); setLoaded(true) })

    pollerRef.current = createPoller({
      intervalMs: 4000,
      onUpdate: (qs) => { setQuestions(qs); setError(null) },
      onError: (err) => setError(err.message)
    })
    pollerRef.current.start()

    return () => pollerRef.current?.stop()
  }, [])

  const unanswered = questions.filter(q => !q.answered)
  // Most recent first; pinned questions float to top.
  const sorted = [...unanswered].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.submitted - a.submitted
  })

  async function handleMarkAnswered(id) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, answered: !q.answered } : q))
    try { await toggleAnswered(id) } catch {}
  }

  if (hidden) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="absolute z-30 pointer-events-auto"
      style={{
        // Sit above the slide's bottom safe zone (150px reserved for nav
        // chrome) plus a small gap so the queue never collides with the
        // page-nav buttons.
        bottom: '170px',
        right: 'clamp(24px, 3vw, 40px)',
        width: 'min(420px, 30vw)',
        maxWidth: '420px'
      }}
    >
      <div
        className="rounded-2xl border border-white/12 overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, rgba(14,12,32,0.92) 0%, rgba(10,8,32,0.92) 100%)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(95,182,255,0.06)'
        }}
      >
        {/* Header */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-white/8 bg-white/3 hover:bg-white/5 transition text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <MessageCircleQuestion className="h-4 w-4 text-accent-cyan" />
              {sorted.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-accent-cyan font-bold">
              Live Queue
            </div>
            {sorted.length > 0 && (
              <div className="text-xs px-2 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan font-bold tabular-nums">
                {sorted.length}
              </div>
            )}
          </div>
          <div className="text-[11px] text-white/45 font-medium shrink-0">
            {collapsed ? 'Show' : 'Hide'}
          </div>
        </button>

        {/* Body */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div
                className="overflow-y-auto elegant-scroll"
                style={{ maxHeight: 'min(420px, 50vh)' }}
              >
                {!loaded ? (
                  <div className="px-4 py-6 text-center text-white/40 text-sm">
                    Loading…
                  </div>
                ) : error ? (
                  <div className="px-4 py-4 text-xs text-red-300/85 leading-relaxed">
                    Q&amp;A backend offline. Audience can still scan QR but submissions
                    won't appear here until the connection is restored.
                  </div>
                ) : sorted.length === 0 ? (
                  <EmptyQueueHint />
                ) : (
                  <div className="p-2 space-y-2">
                    <AnimatePresence>
                      {sorted.slice(0, 8).map((q) => (
                        <QueueCard
                          key={q.id}
                          q={q}
                          onAskClaude={() => onAskClaude?.(q)}
                          onMarkAnswered={() => handleMarkAnswered(q.id)}
                        />
                      ))}
                    </AnimatePresence>
                    {sorted.length > 8 && (
                      <div className="text-center text-[11px] text-white/35 py-1.5">
                        +{sorted.length - 8} more — open the speaker view (press Q)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function QueueCard({ q, onAskClaude, onMarkAnswered }) {
  const timeAgo = formatTimeAgo(q.submitted)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-xl border p-3 ${
        q.pinned
          ? 'bg-gradient-to-br from-accent-cyan/12 to-accent-indigo/10 border-accent-cyan/30'
          : 'bg-white/4 border-white/8'
      }`}
    >
      <div className="text-[14px] leading-snug text-white/95 mb-2.5 line-clamp-3">
        {q.text}
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-white/45 mb-2.5">
        <span className="truncate">
          <span className={q.name ? 'text-white/70 font-medium' : 'italic'}>
            {q.name || 'Anonymous'}
          </span>
          <span className="mx-1.5 text-white/25">·</span>
          <span className="tabular-nums">{timeAgo}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onMarkAnswered}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border border-white/10 hover:border-white/30 text-white/80 hover:text-white bg-white/4 hover:bg-white/8 transition"
          title="Mark as answered (you'll address it aloud)"
        >
          <Mic className="h-3 w-3" />
          Ask aloud
        </button>
        <button
          onClick={onAskClaude}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-bold bg-gradient-to-r from-accent-cyan to-accent-indigo text-white shadow-lg shadow-accent-cyan/30 hover:scale-[1.02] transition"
          title="Have Claude answer this on screen"
        >
          <Sparkles className="h-3 w-3" />
          Claude
        </button>
      </div>
    </motion.div>
  )
}

function EmptyQueueHint() {
  return (
    <div className="px-4 py-6 text-center">
      <div className="text-white/35 text-xs leading-relaxed">
        Audience questions appear here in real time.
        <br />
        <span className="text-white/55">Have them scan the QR.</span>
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 30) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return new Date(timestamp).toLocaleDateString()
}
turn `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return new Date(timestamp).toLocaleDateString()
}
