import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Pin, PinOff, Check, Trash2, MessageCircleQuestion, RefreshCw, Sparkles } from 'lucide-react'
import { createPoller, toggleAnswered, togglePinned, deleteQuestion, clearAll, listQuestions } from '../lib/qa'

export default function QASpeakerView({ open, onClose }) {
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const pollerRef = useRef(null)

  useEffect(() => {
    if (!open) {
      pollerRef.current?.stop()
      pollerRef.current = null
      setConfirmClear(false)
      return
    }

    setError(null)
    setLoaded(false)

    // Initial load
    listQuestions()
      .then((qs) => {
        setQuestions(qs)
        setLoaded(true)
      })
      .catch((err) => {
        setError(err.message)
        setLoaded(true)
      })

    // Start polling for updates
    pollerRef.current = createPoller({
      intervalMs: 4000,
      onUpdate: (qs) => {
        setQuestions(qs)
        setLoaded(true)
        setError(null)
      },
      onError: (err) => setError(err.message)
    })
    pollerRef.current.start()

    return () => {
      pollerRef.current?.stop()
      pollerRef.current = null
    }
  }, [open])

  // Sort: pinned first, unanswered before answered, newest first within group
  const sorted = [...questions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    if (a.answered !== b.answered) return a.answered ? 1 : -1
    return b.submitted - a.submitted
  })

  const unansweredCount = questions.filter(q => !q.answered).length

  async function handleAnswered(id) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, answered: !q.answered } : q))
    try { await toggleAnswered(id) } catch {}
  }
  async function handlePin(id) {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, pinned: !q.pinned } : q))
    try { await togglePinned(id) } catch {}
  }
  async function handleDelete(id) {
    setQuestions(qs => qs.filter(q => q.id !== id))
    try { await deleteQuestion(id) } catch {}
  }
  async function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
      return
    }
    setQuestions([])
    try { await clearAll() } catch {}
    setConfirmClear(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ background: 'rgba(6, 9, 15, 0.92)', backdropFilter: 'blur(24px)' }}
        >
          {/* Header */}
          <div className="px-6 sm:px-10 py-5 border-b border-white/8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center relative">
                <MessageCircleQuestion className="h-6 w-6 text-white" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse ring-2 ring-ink-950" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-accent-cyan font-semibold">
                  Live Q&amp;A
                  <span className="ml-2 inline-flex items-center gap-1 normal-case tracking-normal text-emerald-400 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    streaming
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
                  {questions.length === 0
                    ? 'Audience questions appear here'
                    : `${unansweredCount} pending · ${questions.length} total`}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {questions.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition border ${
                    confirmClear
                      ? 'bg-red-500/15 border-red-500/40 text-red-300'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25 text-white/65 hover:text-white'
                  }`}
                >
                  {confirmClear ? 'Tap again to confirm' : 'Clear all'}
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
          <div className="flex-1 overflow-y-auto elegant-scroll px-6 sm:px-10 py-8">
            {!loaded ? (
              <div className="flex items-center justify-center h-full text-white/50">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                Loading questions…
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto text-center py-12">
                <div className="text-red-400 bg-red-500/5 border border-red-500/20 rounded-xl p-5">
                  <div className="font-semibold mb-2">Could not reach Q&amp;A backend</div>
                  <div className="text-sm font-mono text-white/70">{error}</div>
                  <div className="text-xs text-white/45 mt-3">
                    Make sure the site is deployed to Netlify with Blobs enabled.
                  </div>
                </div>
              </div>
            ) : sorted.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence>
                  {sorted.map((q, i) => (
                    <QuestionCard
                      key={q.id}
                      q={q}
                      onAnswered={handleAnswered}
                      onPin={handlePin}
                      onDelete={handleDelete}
                      delay={i * 0.04}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-6 sm:px-10 py-3 border-t border-white/8 text-center text-xs text-white/40">
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/70 font-mono text-[10px]">Q</kbd> to close · Auto-refreshes every 4s
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function QuestionCard({ q, onAnswered, onPin, onDelete, delay }) {
  const timeAgo = formatTimeAgo(q.submitted)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: q.answered ? 0.5 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-2xl p-5 border transition group ${
        q.pinned
          ? 'bg-gradient-to-br from-accent-cyan/10 to-accent-indigo/10 border-accent-cyan/30'
          : q.answered
            ? 'bg-white/3 border-white/8'
            : 'glass border-white/10 hover:border-white/20'
      }`}
    >
      {q.pinned && (
        <div className="absolute -top-2 -left-2 h-7 w-7 rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center shadow-lg">
          <Pin className="h-3.5 w-3.5 text-white" fill="currentColor" />
        </div>
      )}

      {/* Question text */}
      <div className={`text-lg lg:text-xl leading-relaxed mb-4 ${q.answered ? 'text-white/55 line-through decoration-white/30' : 'text-white/95'}`}>
        {q.text}
      </div>

      {/* Meta + actions */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/8">
        <div className="text-sm text-white/50 min-w-0 truncate">
          <span className={`font-medium ${q.name ? 'text-white/75' : 'text-white/45 italic'}`}>
            {q.name || 'Anonymous'}
          </span>
          <span className="mx-2 text-white/25">·</span>
          <span className="tabular-nums">{timeAgo}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
          <ActionButton
            onClick={() => onPin(q.id)}
            active={q.pinned}
            title={q.pinned ? 'Unpin' : 'Pin to top'}
          >
            {q.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
          </ActionButton>
          <ActionButton
            onClick={() => onAnswered(q.id)}
            active={q.answered}
            title={q.answered ? 'Mark unanswered' : 'Mark answered'}
            activeClass="bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
          >
            <Check className="h-3.5 w-3.5" />
          </ActionButton>
          <ActionButton
            onClick={() => onDelete(q.id)}
            title="Delete"
            activeClass="bg-red-500/15 border-red-500/40 text-red-300"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </ActionButton>
        </div>
      </div>
    </motion.div>
  )
}

function ActionButton({ children, onClick, active, title, activeClass = 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan' }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-7 w-7 rounded-md flex items-center justify-center transition border ${
        active
          ? activeClass
          : 'border-transparent text-white/45 hover:text-white hover:bg-white/8'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-16"
    >
      <div className="relative mb-6">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="h-20 w-20 rounded-3xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20 flex items-center justify-center border border-white/10"
        >
          <MessageCircleQuestion className="h-9 w-9 text-accent-cyan" />
        </motion.div>
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -inset-3 rounded-3xl bg-accent-cyan/10 blur-2xl -z-10"
        />
      </div>
      <h3 className="font-serif text-3xl text-white mb-3">Waiting for questions…</h3>
      <p className="text-white/60 leading-relaxed mb-6">
        When audience members submit questions from their phones, they'll appear here in real time.
      </p>
      <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-left w-full">
        <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          How audience submits
        </div>
        <ol className="space-y-2 text-sm text-white/70 leading-relaxed">
          <li className="flex gap-3">
            <span className="text-white/40 font-mono">1.</span>
            <span>They scan the QR code on slide 13</span>
          </li>
          <li className="flex gap-3">
            <span className="text-white/40 font-mono">2.</span>
            <span>Tap the <strong className="text-white">"Ask a question"</strong> button</span>
          </li>
          <li className="flex gap-3">
            <span className="text-white/40 font-mono">3.</span>
            <span>Their question appears here instantly</span>
          </li>
        </ol>
      </div>
    </motion.div>
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
