import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Loader2, ArrowRight, RotateCcw } from 'lucide-react'
import { askClaudeStream } from '../lib/chat'

/**
 * PersonalizedStrategy — modal that takes audience's business and generates
 * 3 specific AI use cases for them. The take-home magic.
 *
 * Flow:
 *   1. Audience types their business ("I run a Burbank dental practice")
 *   2. Claude streams 3 personalized use cases in real time
 *   3. Each use case includes: title, what AI does, exact starter prompt
 */

const SYSTEM_PROMPT = `You are an AI strategy consultant for small business owners. The user will tell you about their business. Your job: respond with EXACTLY 3 specific, immediately-actionable AI use cases tailored to their business. For each use case, follow this exact format:

## [Use Case Title]
**What AI does:** [One sentence on what AI accomplishes]
**Why it matters for you:** [One sentence on the specific business benefit]
**Starter prompt:** "[A copy-paste ready prompt they can use today, with their business specifics filled in]"

Be concrete, business-specific, and immediately useful. No fluff. No generic advice. The prompts should be ready to copy-paste into Claude or ChatGPT today. Focus on tasks they do every week. Skip introductions and conclusions — go straight to the 3 use cases.`

export default function PersonalizedStrategy({ open, onClose }) {
  const [stage, setStage] = useState('input') // input | generating | done
  const [businessText, setBusinessText] = useState('')
  const [response, setResponse] = useState('')
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
      setBusinessText('')
      setResponse('')
      setError(null)
    }
  }, [open])

  async function generate() {
    const trimmed = businessText.trim()
    if (!trimmed) return
    setStage('generating')
    setResponse('')
    setError(null)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      await askClaudeStream(trimmed, {
        system: SYSTEM_PROMPT,
        maxTokens: 1500,
        signal: ctrl.signal,
        onChunk: (text) => setResponse(text),
        onDone: () => setStage('done'),
        onError: (err) => {
          if (err.name !== 'AbortError') {
            setError(err.message?.includes('not configured')
              ? 'AI is not configured on this deployment yet.'
              : `Could not reach Claude: ${err.message}`)
            setStage('input')
          }
        }
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStage('input')
      }
    }
  }

  function reset() {
    abortRef.current?.abort()
    setStage('input')
    setBusinessText('')
    setResponse('')
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
            <div className="relative px-8 py-6 border-b border-white/8 overflow-hidden">
              {/* Subtle gradient header backdrop */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'radial-gradient(ellipse at top right, #6366F1 0%, transparent 60%), radial-gradient(ellipse at top left, #22D3EE 0%, transparent 60%)'
                }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-accent-cyan font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Personalized AI Strategy
                  </div>
                  <h3 className="font-serif text-3xl lg:text-4xl text-white leading-tight">
                    Your business, your AI playbook.
                  </h3>
                  <p className="text-white/65 mt-2 max-w-xl">
                    Tell Claude about your business. Get 3 specific, ready-to-use AI workflows tailored to you.
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
            <div className="flex-1 overflow-y-auto elegant-scroll px-8 py-7">
              {stage === 'input' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-sm uppercase tracking-[0.2em] text-white/55 font-semibold mb-3 block">
                      Tell us about your business
                    </label>
                    <textarea
                      ref={inputRef}
                      value={businessText}
                      onChange={(e) => setBusinessText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault()
                          generate()
                        }
                      }}
                      placeholder={'I run a Burbank dental practice. We see about 20 patients a day. My biggest time-sucks are appointment reminders, replying to Google reviews, and writing our monthly newsletter.'}
                      rows={5}
                      className="w-full bg-white/5 rounded-2xl px-5 py-4 text-lg text-white placeholder:text-white/30 resize-none focus:outline-none focus:bg-white/8 transition border border-white/8 focus:border-accent-cyan/50 leading-relaxed"
                    />
                    <div className="text-xs text-white/40 mt-2">
                      The more specific you are about your business and your time-sucks, the better the suggestions.
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <ExampleChip onClick={() => setBusinessText('I run a small coffee shop in Magnolia Park. Three employees. We struggle with social media consistency and getting people in on slow weekday mornings.')}>
                      Coffee shop
                    </ExampleChip>
                    <ExampleChip onClick={() => setBusinessText('I am a solo Burbank real estate agent. I waste hours every week writing listing descriptions, follow-up emails, and social posts about new listings.')}>
                      Real estate agent
                    </ExampleChip>
                    <ExampleChip onClick={() => setBusinessText('We run a small marketing agency with 4 people. We need help drafting client proposals and writing case studies fast.')}>
                      Marketing agency
                    </ExampleChip>
                    <ExampleChip onClick={() => setBusinessText('I am a fitness coach with about 30 private clients. I spend hours every week writing personalized workout plans and progress check-in emails.')}>
                      Fitness coach
                    </ExampleChip>
                  </div>

                  {error && (
                    <div className="text-red-400 font-mono text-sm bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generate}
                    disabled={!businessText.trim()}
                    className="w-full inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-indigo text-white font-semibold text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.01] transition shadow-xl shadow-accent-cyan/20"
                  >
                    Generate my AI strategy
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <div className="text-center text-xs text-white/40">Tip: ⌘+Enter to submit</div>
                </div>
              )}

              {(stage === 'generating' || stage === 'done') && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45 mb-2 font-semibold">Your business</div>
                      <div className="text-base text-white/85 italic leading-relaxed">"{businessText}"</div>
                    </div>
                    <button
                      onClick={reset}
                      className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition border border-white/8"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      New business
                    </button>
                  </div>

                  <div className="border-t border-white/8 pt-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan mb-3 font-semibold flex items-center gap-2">
                      Your personalized AI strategy
                      {stage === 'generating' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {stage === 'generating' && (
                        <span className="text-emerald-400 normal-case tracking-normal text-xs">● streaming live</span>
                      )}
                    </div>

                    <StrategyContent text={response} streaming={stage === 'generating'} />
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

function ExampleChip({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-accent-cyan/10 border border-white/10 hover:border-accent-cyan/40 text-sm text-white/70 hover:text-accent-cyan transition"
    >
      {children}
    </button>
  )
}

/**
 * Lightweight markdown-ish renderer for the streamed response.
 * Recognizes ## headings, **bold**, and treats paragraphs naturally.
 */
function StrategyContent({ text, streaming }) {
  if (!text) {
    return (
      <div className="text-white/40 italic font-mono text-base">
        Generating your strategy
        <span className="caret"></span>
      </div>
    )
  }

  // Split by ## headings — each becomes a card
  const sections = text.split(/(?=^##\s)/m).filter(s => s.trim())

  if (sections.length === 0) {
    return (
      <div className="font-mono text-base text-white/90 leading-relaxed whitespace-pre-wrap">
        {text}
        {streaming && <span className="caret"></span>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section, i) => (
        <StrategyCard key={i} raw={section} index={i + 1} streaming={streaming && i === sections.length - 1} />
      ))}
    </div>
  )
}

function StrategyCard({ raw, index, streaming }) {
  // Parse out: ## Title, **What AI does:** ..., **Why it matters for you:** ..., **Starter prompt:** "..."
  const titleMatch = raw.match(/^##\s+(.+?)$/m)
  const title = titleMatch ? titleMatch[1].trim() : `Use case ${index}`

  // Strip the title to render the rest
  const body = raw.replace(/^##\s+.+?$/m, '').trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Header with accent */}
      <div
        className="px-5 py-4 border-b border-white/8 flex items-center gap-3"
        style={{
          background: index === 1
            ? 'linear-gradient(90deg, rgba(34,211,238,0.15), transparent)'
            : index === 2
              ? 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)'
              : 'linear-gradient(90deg, rgba(168,85,247,0.15), transparent)'
        }}
      >
        <div className="font-mono text-xs text-white/50">{String(index).padStart(2, '0')}</div>
        <div className="font-serif text-xl text-white font-medium leading-tight">{title}</div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 text-base text-white/85 leading-relaxed space-y-2.5">
        <SmartMarkdown text={body} />
        {streaming && <span className="caret"></span>}
      </div>
    </motion.div>
  )
}

function SmartMarkdown({ text }) {
  // Very small markdown renderer: handle **bold** and "quoted prompts"
  // Split into paragraphs by blank lines
  const paragraphs = text.split(/\n\n+/)
  return (
    <>
      {paragraphs.map((p, i) => {
        // If paragraph contains a quoted prompt, render as code block
        const promptMatch = p.match(/\*\*Starter prompt:\*\*\s*"([^]+)"/)
        if (promptMatch) {
          const prompt = promptMatch[1].trim()
          return (
            <div key={i} className="space-y-2">
              <div className="text-xs uppercase tracking-[0.15em] text-accent-cyan/80 font-semibold">
                Starter prompt — copy & paste
              </div>
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 font-mono text-sm text-white/95 leading-relaxed">
                {prompt}
              </div>
            </div>
          )
        }
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>') }}
            className="text-white/85 leading-relaxed mb-2"
          />
        )
      })}
    </>
  )
}
