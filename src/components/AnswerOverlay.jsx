import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, RotateCcw } from 'lucide-react'
import { askClaudeStream } from '../lib/chat'
import { markAnswered } from '../lib/qa'
import useMatrixText from '../hooks/useMatrixText'

const SYSTEM_PROMPT = `You are Claude, answering live audience questions at the Burbank Chamber AI workshop.

Your audience is small business owners. Speak with warmth and clarity.

Hard rules:
- Be concise. Aim for 4–8 sentences max unless the question demands more.
- Be concrete. Use plain language, real examples, no buzzwords.
- Be honest. If you don't know, say so. Don't pad with caveats.
- Don't moralize. Don't restate the question.
- No bullet lists unless the answer is genuinely a list of items.

If the question is ambiguous, answer the most useful interpretation.
If the question is off-topic, give a brief, useful answer anyway.`

/**
 * AnswerOverlay — compact "theater mode" modal that shows a queued
 * audience question and streams Claude's answer in big, readable type
 * for the whole room to see. Sized to sit comfortably inside the slide
 * window (does NOT cover the nav chrome).
 *
 * Triggered from the QuestionQueue panel on slide 11. When dismissed,
 * the queued question is marked as answered in the backend so it
 * disappears from the queue.
 */
export default function AnswerOverlay({ question, onClose }) {
  const [streaming, setStreaming] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  // Matrix-style decode for the projector — characters cycle through
  // random glyphs before locking in. Theatrical and on-brand.
  const { revealed, scramble } = useMatrixText(text, { revealRate: 5, scrambleLength: 8 })
  const abortRef = useRef(null)
  const startedRef = useRef(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (!question) return
    if (startedRef.current) return
    startedRef.current = true
    runStream(question.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id])

  // Auto-scroll as text reveals — track the locked portion so scroll
  // velocity matches the actual readable text (not the scrambling head).
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [revealed])

  // Esc to close
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runStream(prompt) {
    setStreaming(true)
    setText('')
    setError(null)
    setDone(false)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      await askClaudeStream(prompt, {
        system: SYSTEM_PROMPT,
        maxTokens: 600,
        signal: ctrl.signal,
        onChunk: (t) => setText(t),
        onError: (err) => {
          if (err?.name !== 'AbortError') setError(err.message)
        }
      })
      setDone(true)
    } catch (err) {
      if (err?.name !== 'AbortError') setError(err.message || 'Could not reach Claude')
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  async function handleClose() {
    abortRef.current?.abort()
    if (question?.id) {
      // Idempotent — guarantees the question never reappears in the queue.
      try { await markAnswered(question.id) } catch {}
    }
    onClose?.()
  }

  function handleRetry() {
    startedRef.current = false
    runStream(question.text)
    startedRef.current = true
  }

  if (!question) return null

  return (
    <AnimatePresence>
      <motion.div
        key="answer-overlay-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
        style={{
          background: 'rgba(5, 4, 12, 0.78)'
        }}
        onClick={handleClose}
      >
        {/* Compact card centered in the available slide space */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-white/12 overflow-hidden flex flex-col contact-card-perf"
          data-modal-card="true"
          style={{
            width: '100%',
            maxWidth: '900px',
            height: 'min(620px, calc(100vh - 120px))',
            background: 'radial-gradient(ellipse at top, rgba(20,18,52,0.97) 0%, rgba(6,5,18,0.98) 60%, rgba(2,2,8,1) 100%)',
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(95,182,255,0.06)'
          }}
        >
          {/* Ambient glow accents */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute"
              style={{
                top: '-20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70vw',
                height: '60vh',
                background: 'radial-gradient(ellipse, rgba(95,182,255,0.18) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }}
            />
            <div
              className="absolute"
              style={{
                bottom: '-10%',
                right: '0%',
                width: '40vw',
                height: '40vh',
                background: 'radial-gradient(ellipse, rgba(192,100,240,0.12) 0%, transparent 70%)',
                filter: 'blur(40px)'
              }}
            />
          </div>

          {/* Top bar */}
          <div className="relative flex items-center justify-between px-5 sm:px-9 py-3.5 border-b border-white/8 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-ink-950 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-[0.28em] text-accent-cyan font-bold">
                  Claude is answering
                </div>
                <div className="text-white/60 text-sm truncate">
                  Asked by <span className="text-white/85 font-medium">{question.name || 'Anonymous'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!streaming && error && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/12 text-white/85 text-sm font-medium transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry
                </button>
              )}
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-white/85 hover:text-white text-sm font-semibold transition"
              >
                <X className="h-4 w-4" />
                Done
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-hidden flex flex-col">
            {/* Question — big, prominent (sized down 25% so the whole
                overlay fits comfortably inside the slide window) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="px-5 sm:px-9 lg:px-14 pt-7 pb-4 shrink-0"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/45 font-semibold mb-2">
                Question
              </div>
              <div
                className="display-serif text-white/95 leading-tight"
                style={{
                  fontStyle: 'italic',
                  fontSize: 'clamp(21px, 2.55vw, 42px)',
                  lineHeight: 1.15
                }}
              >
                <span className="text-accent-cyan/40 mr-1">&ldquo;</span>
                {question.text}
                <span className="text-accent-cyan/40 ml-1">&rdquo;</span>
              </div>
            </motion.div>

            {/* Divider */}
            <div className="px-5 sm:px-9 lg:px-14 shrink-0">
              <div className="h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
            </div>

            {/* Answer — streaming. The flex-1 + min-h-0 combo lets this
                area shrink to fit available space and scroll internally
                instead of pushing the whole overlay past the viewport. */}
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto elegant-scroll px-5 sm:px-9 lg:px-14 py-6"
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent-cyan font-bold mb-4 flex items-center gap-2">
                <span>Claude</span>
                {streaming && (
                  <span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-emerald-400 text-[11px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    streaming
                  </span>
                )}
                {done && !error && (
                  <span className="normal-case tracking-normal text-white/40 text-[11px]">
                    · complete
                  </span>
                )}
              </div>

              {error ? (
                <div className="bg-red-500/8 border border-red-500/25 rounded-2xl p-5 max-w-3xl">
                  <div className="text-red-300 font-medium mb-1">Could not reach Claude</div>
                  <div className="text-red-200/70 text-sm font-mono">{error}</div>
                </div>
              ) : (
                <div
                  className="text-white/92 leading-relaxed max-w-4xl"
                  style={{
                    fontSize: 'clamp(15px, 1.35vw, 22px)',
                    lineHeight: 1.55
                  }}
                >
                  {revealed}
                  <span className="matrix-scramble">{scramble}</span>
                  {streaming && (
                    <motion.span
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-block ml-1 -mb-1 align-middle"
                      style={{
                        width: '0.5em',
                        height: '1em',
                        background: 'linear-gradient(180deg, var(--accent-cyan), var(--accent-indigo))',
                        borderRadius: '1px'
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Footer cue — also tightened to match the slimmed-down overlay */}
            <div className="px-5 sm:px-9 lg:px-14 py-2.5 border-t border-white/8 flex items-center justify-between text-[11px] text-white/40 shrink-0">
              <div>
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/65 font-mono text-[10px]">Esc</kbd> or click Done to return.
              </div>
              <div className="hidden sm:block">
                Live · powered by Anthropic
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
