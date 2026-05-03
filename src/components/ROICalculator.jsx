import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, Loader2, ArrowRight, DollarSign, Clock, Sparkles, RotateCcw } from 'lucide-react'
import { askClaudeStream } from '../lib/chat'

/**
 * ROICalculator — interactive take-home tool.
 *
 * Audience inputs:
 *   - business type (free text)
 *   - hours per week on busywork
 *   - effective hourly rate ($)
 *
 * Outputs:
 *   - estimated time saved per year (hours)
 *   - estimated dollars saved per year ($)
 *   - personalized AI recommendation streamed from Claude
 *
 * Assumes AI handles ~60% of busywork well today. That figure is conservative
 * but honest — the recommendation copy explains it.
 */

const SYSTEM_PROMPT = `You are a small business AI consultant. The user just told you about their busywork. Based on their inputs, give them ONE specific, immediately-actionable recommendation about what to automate first with AI. Format:

**Start here:** [One sentence naming the specific task to automate first]

**Why this first:** [One sentence explaining why this task is the best starting point given their situation]

**Your first prompt:** "[A copy-paste ready Claude/ChatGPT prompt tailored to their business that they can use today]"

Be concrete and specific to their business. No fluff, no general advice. The prompt should be ready to paste into Claude or ChatGPT today and get a useful first response. Skip introductions.`

const AUTOMATION_RATE = 0.6 // AI handles ~60% of busywork well

export default function ROICalculator({ open, onClose }) {
  const [stage, setStage] = useState('input') // input | results
  const [business, setBusiness] = useState('')
  const [hours, setHours] = useState(10)
  const [rate, setRate] = useState(75)
  const [recommendation, setRecommendation] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200)
    } else {
      abortRef.current?.abort()
      abortRef.current = null
      setStage('input')
      setBusiness('')
      setHours(10)
      setRate(75)
      setRecommendation('')
      setStreaming(false)
      setError(null)
    }
  }, [open])

  // Calculate impact
  const hoursAutomated = Math.round(hours * AUTOMATION_RATE)
  const hoursSavedYear = hoursAutomated * 50  // 50 working weeks
  const dollarsSavedYear = hoursSavedYear * rate
  const fullDaysReclaimed = Math.round(hoursSavedYear / 8)

  async function calculate() {
    if (!business.trim()) return
    setStage('results')
    setStreaming(true)
    setRecommendation('')
    setError(null)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    const prompt = `My business: ${business.trim()}

I currently spend about ${hours} hours per week on routine busywork tasks (emails, content, admin, replies, drafts, etc.). My effective hourly rate is around $${rate}.

Based on this, what is the single highest-leverage task I should automate FIRST with AI, and what is the exact prompt I should use to start?`

    try {
      await askClaudeStream(prompt, {
        system: SYSTEM_PROMPT,
        maxTokens: 600,
        signal: ctrl.signal,
        onChunk: (text) => setRecommendation(text),
        onDone: () => setStreaming(false),
        onError: (err) => {
          setStreaming(false)
          if (err.name !== 'AbortError') {
            setError(err.message?.includes('not configured')
              ? 'AI is not configured on this deployment yet.'
              : `Could not reach Claude: ${err.message}`)
          }
        }
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStreaming(false)
      }
    }
  }

  function reset() {
    abortRef.current?.abort()
    setStage('input')
    setRecommendation('')
    setError(null)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Solid overlay — no backdrop-filter (kills FPS during entry) */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(5, 4, 12, 0.78)' }}
            onClick={onClose}
          />

          <motion.div
            className="relative glass-strong rounded-3xl w-full max-w-2xl flex flex-col overflow-hidden contact-card-perf"
            data-modal-card="true"
            style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="relative px-6 sm:px-8 py-6 border-b overflow-hidden" style={{ borderColor: 'var(--border-base)' }}>
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top right, #10B981 0%, transparent 60%), radial-gradient(ellipse at top left, #22D3EE 0%, transparent 60%)'
                }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                    <Calculator className="h-3.5 w-3.5" />
                    AI ROI Calculator
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                    What's AI worth to your business?
                  </h3>
                  <p className="text-white/65 mt-2 text-sm sm:text-base max-w-xl">
                    Punch in your numbers. See annual hours and dollars reclaimed.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition shrink-0"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto elegant-scroll px-6 sm:px-8 py-6">
              {stage === 'input' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm uppercase tracking-[0.2em] text-white/55 font-semibold mb-2 block">
                      What kind of business do you run?
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={business}
                      onChange={(e) => setBusiness(e.target.value)}
                      placeholder="e.g. Burbank dental practice, marketing agency, retail boutique…"
                      className="w-full bg-white/5 rounded-2xl px-5 py-4 text-base sm:text-lg text-white placeholder:text-white/30 focus:outline-none focus:bg-white/8 transition border border-white/8 focus:border-emerald-400/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SliderInput
                      label="Hours per week on busywork"
                      icon={<Clock className="h-4 w-4" />}
                      value={hours}
                      onChange={setHours}
                      min={1}
                      max={40}
                      step={1}
                      formatter={(v) => `${v} hr/week`}
                      hint="Emails, content, admin, replies, drafts, scheduling"
                    />

                    <SliderInput
                      label="Your hourly rate"
                      icon={<DollarSign className="h-4 w-4" />}
                      value={rate}
                      onChange={setRate}
                      min={25}
                      max={500}
                      step={5}
                      formatter={(v) => `$${v}/hr`}
                      hint="Or what you'd pay someone to do this work"
                    />
                  </div>

                  {/* Live preview of impact */}
                  <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border-base)', backgroundColor: 'rgba(16, 185, 129, 0.06)' }}>
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-400 font-semibold mb-3">
                      Estimated annual impact
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-serif text-3xl sm:text-4xl font-medium text-white tabular-nums">
                          {hoursSavedYear.toLocaleString()}<span className="text-white/40 text-xl ml-1">hrs</span>
                        </div>
                        <div className="text-xs text-white/55 mt-1">{fullDaysReclaimed} full 8-hr days reclaimed</div>
                      </div>
                      <div>
                        <div className="font-serif text-3xl sm:text-4xl font-medium text-white tabular-nums">
                          ${dollarsSavedYear.toLocaleString()}
                        </div>
                        <div className="text-xs text-white/55 mt-1">value of time reclaimed</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-white/40 mt-3 italic">
                      Based on AI handling ~{Math.round(AUTOMATION_RATE * 100)}% of routine busywork well today, 50 working weeks/year. Conservative estimate.
                    </div>
                  </div>

                  <button
                    onClick={calculate}
                    disabled={!business.trim()}
                    className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] transition shadow-xl shadow-emerald-500/20"
                  >
                    <Sparkles className="h-5 w-5" />
                    Show me what to automate first
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {stage === 'results' && (
                <div className="space-y-5">
                  {/* Big number reveal */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(34, 211, 238, 0.12))',
                      border: '1px solid rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-emerald-300 font-semibold mb-3">
                      Your annual reclaim
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-serif text-4xl sm:text-5xl font-medium text-white tabular-nums leading-none">
                          {hoursSavedYear.toLocaleString()}
                          <span className="text-white/45 text-2xl ml-1">hrs</span>
                        </div>
                        <div className="text-sm text-white/65 mt-2">
                          That's <span className="text-emerald-300 font-semibold">{fullDaysReclaimed} full work days</span> back.
                        </div>
                      </div>
                      <div>
                        <div className="font-serif text-4xl sm:text-5xl font-medium text-white tabular-nums leading-none">
                          ${dollarsSavedYear.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/65 mt-2">
                          Reinvest in <span className="text-cyan-300 font-semibold">growing the business</span>.
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Streaming recommendation */}
                  <div className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--border-base)', backgroundColor: 'var(--bg-card)' }}>
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-3 font-semibold flex items-center gap-2">
                      Where to start
                      {streaming && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {streaming && (
                        <span className="text-emerald-400 normal-case tracking-normal text-xs">● streaming live</span>
                      )}
                    </div>

                    {error ? (
                      <div className="text-red-400 font-mono text-sm bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                        {error}
                      </div>
                    ) : (
                      <RecommendationContent text={recommendation} streaming={streaming} />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={reset}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 transition border border-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try different numbers
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold transition hover:scale-[1.01]"
                    >
                      Got it — let me try this
                    </button>
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

function SliderInput({ label, icon, value, onChange, min, max, step, formatter, hint }) {
  return (
    <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--border-base)', backgroundColor: 'var(--bg-card)' }}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-[0.2em] text-white/55 font-semibold flex items-center gap-1.5">
          {icon}
          {label}
        </label>
        <div className="font-serif text-xl text-white tabular-nums">{formatter(value)}</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-400 cursor-pointer"
        style={{ height: '4px' }}
      />
      {hint && <div className="text-[11px] text-white/40 mt-1.5">{hint}</div>}
    </div>
  )
}

function RecommendationContent({ text, streaming }) {
  if (!text) {
    return (
      <div className="text-white/40 italic font-mono text-base">
        Analyzing your business
        <span className="caret"></span>
      </div>
    )
  }

  // Parse sections: **Start here:** ... **Why this first:** ... **Your first prompt:** "..."
  const startMatch = text.match(/\*\*Start here:\*\*\s*([^\n*]+)/)
  const whyMatch = text.match(/\*\*Why this first:\*\*\s*([^\n*]+)/)
  const promptMatch = text.match(/\*\*Your first prompt:\*\*\s*"([^]+?)"/)

  // If we don't have enough structure yet (still streaming), show as text
  if (!startMatch || !whyMatch) {
    return (
      <div className="font-mono text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-wrap">
        {text}
        {streaming && <span className="caret"></span>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-emerald-300 font-semibold mb-1.5">
          Start here
        </div>
        <div className="font-serif text-lg sm:text-xl text-white leading-snug">
          {startMatch[1].trim()}
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-white/45 font-semibold mb-1.5">
          Why this first
        </div>
        <div className="text-sm sm:text-base text-white/85 leading-relaxed">
          {whyMatch[1].trim()}
        </div>
      </div>

      {promptMatch && (
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-300 font-semibold mb-2">
            Your first prompt — copy & paste
          </div>
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-white/95 leading-relaxed">
            {promptMatch[1].trim()}
            {streaming && <span className="caret"></span>}
          </div>
        </div>
      )}
    </div>
  )
}
