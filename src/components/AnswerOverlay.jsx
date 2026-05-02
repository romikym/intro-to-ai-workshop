import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, RotateCcw } from 'lucide-react'
import { askClaudeStream } from '../lib/chat'
import { toggleAnswered } from '../lib/qa'

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
 * AnswerOverlay — full-screen "theater mode" overlay that shows a queued
 * audience question and streams Claude's answer in big, readable type
 * for the whole room to see.
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

  // Auto-scroll the answer container as text streams in
  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [text])

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
      try { await toggleAnswered(question.id) } catch {}
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
        key="answer-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[60] flex flex-col"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(20,18,52,0.97) 0%, rgba(6,5,18,0.98) 60%, rgba(2,2,8,1) 100%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)'
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
        <div className="relative flex items-center justify-between px-6 sm:px-12 py-5 border-b border-white/8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
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
          {/* Question — big, prominent */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 sm:px-12 lg:px-20 pt-10 pb-6"
          >
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/45 font-semibold mb-3">
              Question
            </div>
            <div
              className="display-serif text-white/95 leading-tight"
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(28px, 3.4vw, 56px)',
                lineHeight: 1.15
              }}
            >
              <span className="text-accent-cyan/40 mr-1">&ldquo;</span>
              {question.text}
              <span className="text-accent-cyan/40 ml-1">&rdquo;</span>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="px-6 sm:px-12 lg:px-20">
            <div className="h-px bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent" />
          </div>

          {/* Answer — streaming */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto elegant-scroll px-6 sm:px-12 lg:px-20 py-8"
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
                  fontSize: 'clamp(20px, 1.8vw, 30px)',
                  lineHeight: 1.55
                }}
              >
                {text}
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

          {/* Footer cue */}
          <div className="px-6 sm:px-12 lg:px-20 py-4 border-t border-white/8 flex items-center justify-between text-[12px] text-white/40">
            <div>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white/8 text-white/65 font-mono text-[10px]">Esc</kbd> or click Done to return.
            </div>
            <div className="hidden sm:block">
              Live · powered by Anthropic
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
