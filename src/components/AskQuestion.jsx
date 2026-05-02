import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, MessageCircleQuestion, Check, Loader2 } from 'lucide-react'
import { submitQuestion } from '../lib/qa'

const MAX_LENGTH = 500
const MAX_NAME_LENGTH = 60

export default function AskQuestion({ open, onClose }) {
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [error, setError] = useState(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 200)
    } else {
      // Reset after close animation
      setTimeout(() => {
        setStatus('idle')
        setError(null)
        // Keep name (audience may submit multiple questions)
      }, 300)
    }
  }, [open])

  // Persist name in localStorage so audience members don't retype it
  useEffect(() => {
    try {
      const saved = localStorage.getItem('intro-ai-qa-name')
      if (saved) setName(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (name) {
      try { localStorage.setItem('intro-ai-qa-name', name) } catch {}
    }
  }, [name])

  async function handleSubmit() {
    const trimmed = text.trim()
    if (!trimmed || status === 'submitting') return

    setStatus('submitting')
    setError(null)

    try {
      await submitQuestion({ text: trimmed, name: name.trim() })
      setStatus('success')
      setText('')
      // Auto-close after success
      setTimeout(() => {
        setStatus('idle')
      }, 2500)
    } catch (err) {
      setStatus('error')
      setError(err.message?.includes('unavailable')
        ? 'The Q&A system is not running yet — try again in a moment.'
        : err.message || 'Could not submit. Please try again.')
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative glass-strong w-full sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            {/* Decorative gradient header */}
            <div className="relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'radial-gradient(ellipse at top right, #6366F1 0%, transparent 60%), radial-gradient(ellipse at top left, #22D3EE 0%, transparent 60%)'
                }}
              />
              <div className="relative px-6 sm:px-8 pt-6 pb-5 flex items-start justify-between gap-4 border-b border-white/8">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-indigo flex items-center justify-center shrink-0">
                    <MessageCircleQuestion className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-accent-cyan font-semibold mb-1">Live Q&amp;A</div>
                    <h3 className="font-serif text-2xl text-white leading-tight">Ask a question</h3>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition shrink-0"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto elegant-scroll px-6 sm:px-8 py-6">
              {status === 'success' ? (
                <SuccessState onAskAnother={() => { setStatus('idle'); setText('') }} onClose={onClose} />
              ) : (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold mb-2 block">
                      Your question
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={text}
                      onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
                      onKeyDown={handleKeyDown}
                      placeholder="What's on your mind?"
                      rows={4}
                      className="w-full bg-white/5 rounded-xl px-4 py-3 text-base text-white placeholder:text-white/30 resize-none focus:outline-none focus:bg-white/8 transition border border-white/8 focus:border-accent-cyan/50 leading-relaxed"
                      style={{ minHeight: '110px' }}
                      disabled={status === 'submitting'}
                    />
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="text-xs text-white/40">
                        Tip: ⌘+Enter to submit
                      </div>
                      <div className={`text-xs tabular-nums ${text.length > MAX_LENGTH * 0.85 ? 'text-amber-400' : 'text-white/40'}`}>
                        {text.length} / {MAX_LENGTH}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold mb-2 block">
                      Your name <span className="normal-case tracking-normal text-white/35">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                      placeholder="Anonymous"
                      className="w-full bg-white/5 rounded-xl px-4 py-2.5 text-base text-white placeholder:text-white/30 focus:outline-none focus:bg-white/8 transition border border-white/8 focus:border-accent-cyan/50"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || status === 'submitting'}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] transition shadow-xl shadow-accent-cyan/20"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit question
                      </>
                    )}
                  </button>

                  <div className="text-xs text-white/40 text-center">
                    Your question goes straight to the speakers' screen.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SuccessState({ onAskAnother, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 250, damping: 18 }}
        className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/30"
      >
        <Check className="h-8 w-8 text-white" strokeWidth={3} />
      </motion.div>
      <h3 className="font-serif text-2xl text-white mb-2">Question submitted</h3>
      <p className="text-white/65 text-base leading-relaxed mb-6 max-w-sm mx-auto">
        It just appeared on the presenters' screen. Got another?
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onAskAnother}
          className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-cyan/40 text-white text-sm font-medium transition"
        >
          Ask another
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-white text-sm font-medium transition hover:scale-[1.02]"
        >
          Done
        </button>
      </div>
    </motion.div>
  )
}
