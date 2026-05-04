import { useState, useEffect, useRef } from 'react'
import { MessageCircleQuestion, MessageCircle, Sparkles, ChevronDown, Cpu, Zap, MessageSquare, Search, Image as ImageIcon, BarChart3 } from 'lucide-react'
import AskQuestion from './AskQuestion'
import LiveChat from './LiveChat'
import PresenterContactCard from './PresenterContactCard'
import { PRESENTERS } from '../lib/presenters'

/**
 * useReveal — IntersectionObserver hook that adds an `is-visible` class
 * once an element enters the viewport. Drives the GPU-only fade-up
 * animations (transform + opacity only — buttery on mobile).
 */
function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          obs.unobserve(e.target)
        }
      }
    }, { threshold, rootMargin: '0px 0px -8% 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

/**
 * MobileExperience — purpose-built mobile UI for audience phones.
 *
 * Replaces the projection-style slide carousel with a single scrolling
 * page. No TRON grid, no particles, no expensive backdrop-filter blurs,
 * minimal Framer Motion. Designed to be fast and beautiful on a phone.
 *
 * Key surfaces:
 *   - Hero with workshop title + presenters
 *   - "What AI Is" quick reframe
 *   - 6 categories of what AI can do
 *   - 5 major AI models
 *   - 5-step "Start This Week" plan
 *   - Sticky CTA: Ask a question + Chat with Claude
 */
export default function MobileExperience() {
  const [askOpen, setAskOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [contactPresenter, setContactPresenter] = useState(null)

  // Auto-open ask modal if URL has ?ask=1 (audience scanned QR)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('ask') === '1') {
      setAskOpen(true)
    }
  }, [])

  return (
    <div className="relative min-h-[100dvh] w-full text-white overflow-x-hidden">
      {/* Subtle gradient backdrop — no blur, no animation, no GPU cost */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(41,151,255,0.18), transparent 60%), radial-gradient(ellipse 80% 50% at 100% 100%, rgba(192,100,240,0.12), transparent 60%), linear-gradient(180deg, #07060F 0%, #0A0820 100%)'
        }}
      />

      <Header />
      <Hero onAsk={() => setAskOpen(true)} onChat={() => setChatOpen(true)} />
      <SectionWhatAIIs />
      <SectionPhilosophy />
      <SectionModels />
      <SectionWhatAICanDo />
      <SectionStartThisWeek />
      <SectionAskClaude onAsk={() => setAskOpen(true)} onChat={() => setChatOpen(true)} />
      <ClosingPresenters onSelect={setContactPresenter} />
      <Footer />

      {/* Sticky Ask CTA at bottom */}
      <StickyAskBar onAsk={() => setAskOpen(true)} onChat={() => setChatOpen(true)} />

      <AskQuestion open={askOpen} onClose={() => setAskOpen(false)} />
      <LiveChat
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        title="Chat with Claude"
        subtitle="Ask anything — get a real answer"
        suggestedPrompts={[
          'Give me 3 specific ways my small business could use AI this week.',
          "What's one thing AI is bad at that I should keep doing myself?",
          'Write a prompt I could use to draft my next email.',
          'How do I write an "AI Philosophy" for my team?'
        ]}
        maxTokens={800}
      />

      <PresenterContactCard
        presenter={contactPresenter}
        open={!!contactPresenter}
        onClose={() => setContactPresenter(null)}
      />
    </div>
  )
}

/* ---------- Header ---------- */
function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[rgba(7,6,15,0.7)] border-b border-white/8">
      <div className="px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2997FF 0%, #C064F0 100%)' }}
          >
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="leading-none">
            <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 font-bold">
              Burbank Chamber
            </div>
            <div className="text-[13px] font-semibold text-white/95 mt-0.5">
              Intro to AI · 2026
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ---------- Hero ---------- */
function Hero({ onAsk, onChat }) {
  return (
    <section className="px-5 pt-10 pb-12 text-center">
      <div className="text-[11px] uppercase tracking-[0.32em] font-bold text-cyan-300 mb-4 mob-fade-in mob-d-1">
        Burbank Chamber · 2026
      </div>
      <h1
        className="font-sans font-bold leading-[1.05] text-white mob-fade-in mob-d-2"
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          fontSize: 'clamp(40px, 11vw, 60px)',
          letterSpacing: '-0.03em'
        }}
      >
        Introduction to{' '}
        <em
          className="not-italic"
          style={{
            fontFamily: '"Fraunces", serif',
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #2997FF 0%, #C064F0 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          AI<span className="text-white/40">.</span>
        </em>
      </h1>
      <div
        className="mt-4 text-white/75 mob-fade-in mob-d-3"
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          fontSize: 'clamp(17px, 4.5vw, 22px)',
          lineHeight: 1.35
        }}
      >
        Cutting through{' '}
        <em
          className="not-italic"
          style={{
            fontFamily: '"Fraunces", serif',
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #2997FF 0%, #C064F0 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}
        >
          the noise
        </em>
        .
      </div>

      {/* Presenters */}
      <div className="mt-9 flex items-center justify-center gap-8 mob-fade-in mob-d-4">
        <PresenterPill p={PRESENTERS.romik} />
        <PresenterPill p={PRESENTERS.jim} />
      </div>

      {/* How-to-use card replaces the CTA buttons.
          The Ask + Claude buttons now live in the persistent sticky bar
          at the bottom of the screen. */}
      <div
        className="mt-10 mob-fade-in mob-d-5 rounded-3xl border border-white/10 px-5 py-5 text-left"
        style={{
          background: 'linear-gradient(160deg, rgba(41,151,255,0.08), rgba(192,100,240,0.06))'
        }}
      >
        <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-3 text-center">
          How to use this page
        </div>
        <ol className="space-y-3 text-white/85 text-[14px] leading-relaxed">
          <li className="flex items-start gap-3">
            <span
              className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center font-mono text-[12px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
            >
              1
            </span>
            <span>
              <strong className="text-white">Scroll</strong> to see the talk in 5 minutes — what AI is, the major tools, and how to start using it this week.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center font-mono text-[12px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
            >
              2
            </span>
            <span>
              Tap the blue <strong className="text-white">Ask</strong> button at the bottom to submit a question — it goes straight to the speakers' screen.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span
              className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center font-mono text-[12px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
            >
              3
            </span>
            <span>
              Tap <strong className="text-white">Claude</strong> at the bottom to chat one-on-one — ask anything, get a real answer.
            </span>
          </li>
        </ol>
      </div>

      {/* Scroll cue */}
      <div className="mt-10 text-white/45 text-[11px] uppercase tracking-[0.3em] font-medium flex flex-col items-center gap-1.5 mob-fade-in mob-d-5">
        <span>The talk in 5 minutes</span>
        <ChevronDown className="h-4 w-4 mob-bounce-down" />
      </div>
    </section>
  )
}

function PresenterPill({ p }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className="absolute inset-[-4px] rounded-full"
          style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
        />
        <div className="absolute inset-[-14px] rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 blur-xl" />
        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-[#0E0C20] ring-2 ring-[#07060F]">
          <img
            src={p.photo}
            alt={p.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: p.id === 'romik' ? 'center 25%' : 'center 30%' }}
          />
        </div>
      </div>
      <div className="mt-3 text-[16px] font-semibold text-white leading-tight">{p.firstName}</div>
      <div className="text-[13px] text-white/65 leading-tight mb-2">{p.role}</div>
      <div className="h-9 flex items-center justify-center" style={{ width: '150px' }}>
        <img
          src={p.logo}
          alt={p.company}
          className="max-h-full max-w-full object-contain"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }}
        />
      </div>
    </div>
  )
}

/* ---------- "What AI Is" ---------- */
function SectionWhatAIIs() {
  return (
    <Section eyebrow="The reality" title={<>What AI <Em>actually</Em> is.</>}>
      <Card>
        <div className="text-cyan-300 text-[11px] uppercase tracking-[0.25em] font-bold mb-2">
          Not magic. Software.
        </div>
        <p className="text-white/85 text-[15px] leading-relaxed">
          A large language model doesn't <em className="text-white">know</em> anything. It predicts
          the next likely word based on patterns from training data.
        </p>
      </Card>

      {/* Live demo: token prediction */}
      <TokenPredictionDemo />

      <Card>
        <div className="text-amber-300 text-[11px] uppercase tracking-[0.25em] font-bold mb-2">
          Built to sound confident
        </div>
        <p className="text-white/85 text-[15px] leading-relaxed">
          Not built to be accurate. Using it as a search engine or fact-checker is a liability.
          It's a powerful tool — but a tool, not an oracle.
        </p>
      </Card>

      <Card>
        <div className="text-purple-300 text-[11px] uppercase tracking-[0.25em] font-bold mb-2">
          It produces the average
        </div>
        <p className="text-white/85 text-[15px] leading-relaxed">
          Statistically, it generates the middle. If you outsource your voice to AI, your brand
          becomes generic. <strong className="text-white">Average kills local brands.</strong>
        </p>
      </Card>
    </Section>
  )
}

/* ---------- Token Prediction Demo ----------
   Visual demo of how an LLM predicts the next token.
   "The cat sat on the ___" with three candidates whose probability bars
   animate in. Pure CSS keyframes — no JS-driven animation. */
function TokenPredictionDemo() {
  const ref = useReveal(0.25)
  return (
    <div ref={ref} className="rounded-2xl px-4 py-5 bg-white/4 border border-cyan-500/20 mob-card mob-reveal-child mob-token-demo">
      <div className="text-cyan-300 text-[10px] uppercase tracking-[0.28em] font-bold mb-3 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 mob-pulse-dot" />
        Live demo · next-token prediction
      </div>
      <div className="font-mono text-[15px] text-white/95 mb-4 leading-relaxed">
        "The cat sat on the&nbsp;
        <span
          className="inline-block px-1.5 rounded"
          style={{
            background: 'linear-gradient(135deg, rgba(41,151,255,0.25), rgba(192,100,240,0.25))',
            border: '1px solid rgba(95,182,255,0.4)'
          }}
        >
          ___
        </span>"
      </div>
      <div className="space-y-2">
        <ProbBar token="mat" pct={42} delay="0.1s" color="#5FB6FF" />
        <ProbBar token="floor" pct={28} delay="0.25s" color="#C064F0" />
        <ProbBar token="couch" pct={15} delay="0.4s" color="#F5A623" />
        <ProbBar token="rug" pct={9} delay="0.55s" color="#00C7BE" />
      </div>
      <div className="mt-3 text-[11px] text-white/45 leading-relaxed">
        It picks the highest-probability word. No understanding — just statistics.
      </div>
    </div>
  )
}

function ProbBar({ token, pct, delay, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-[13px] text-white/85 w-12 shrink-0">"{token}"</div>
      <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full mob-prob-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            animationDelay: delay,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
      <div className="font-mono text-[12px] text-white/65 w-9 text-right tabular-nums">{pct}%</div>
    </div>
  )
}

/* ---------- Philosophy ---------- */
function SectionPhilosophy() {
  return (
    <Section eyebrow="Before you adopt" title={<>Write your <Em>AI Philosophy</Em> first.</>}>
      <Card>
        <p className="text-white/85 text-[15px] leading-relaxed mb-3">
          Before any AI tool license, write a one-page document for your team:
        </p>
        <ul className="space-y-3 text-white/85 text-[15px] leading-relaxed">
          <li className="flex gap-3">
            <span className="text-cyan-300 font-bold shrink-0">→</span>
            <span><strong className="text-white">What AI is allowed to do</strong> in your business.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-300 font-bold shrink-0">→</span>
            <span><strong className="text-white">Where human oversight is mandatory.</strong></span>
          </li>
          <li className="flex gap-3">
            <span className="text-cyan-300 font-bold shrink-0">→</span>
            <span><strong className="text-white">What you'll never automate</strong> — the customer-facing handshake.</span>
          </li>
        </ul>
      </Card>

      <div className="mt-4 px-4 py-3 rounded-xl bg-cyan-500/8 border border-cyan-500/20 text-cyan-200/90 text-[13px] leading-relaxed">
        Single highest-leverage thing a small business can do in 2026.
      </div>
    </Section>
  )
}

/* ---------- AI Models ---------- */
const MODELS = [
  { name: 'Claude', tag: 'Anthropic', strength: 'Drafting, contracts, complex reasoning', color: '#D97757' },
  { name: 'ChatGPT', tag: 'OpenAI', strength: 'Everyday tasks, images, plugins', color: '#10A37F' },
  { name: 'Gemini', tag: 'Google', strength: 'Docs, Gmail, Sheets integration', color: '#4796FF' },
  { name: 'Copilot', tag: 'Microsoft', strength: 'Excel, PowerPoint, Outlook', color: '#0078D4' },
  { name: 'Perplexity', tag: 'Research', strength: 'Fact-checking, sources, market research', color: '#21B8CD' }
]
function SectionModels() {
  return (
    <Section eyebrow="The major tools" title={<>Meet the <Em>AI models</Em>.</>}>
      <p className="text-white/65 text-[14px] leading-relaxed mb-5 -mt-2">
        All do most things. The differences are in personality, integration, and what each is best at.
      </p>
      <div className="space-y-3">
        {MODELS.map(m => (
          <Card key={m.name}>
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="text-white text-[20px] font-bold tracking-tight" style={{ fontFamily: '"Inter Tight", system-ui, sans-serif' }}>
                {m.name}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold" style={{ color: m.color }}>
                {m.tag}
              </div>
            </div>
            <div className="text-white/70 text-[14px] leading-relaxed">
              {m.strength}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------- What AI Can Do ---------- */
const CATEGORIES = [
  { icon: MessageSquare, title: 'Talk to customers', tagline: 'Reply with your voice, at machine speed.', color: '#2997FF' },
  { icon: ImageIcon,    title: 'Make content',       tagline: 'One idea, ten formats.', color: '#F5A623' },
  { icon: Cpu,          title: 'Run the office',     tagline: 'Less paperwork, more business.', color: '#00C7BE' },
  { icon: Search,       title: 'Know your market',   tagline: "Read what you don't have time to read.", color: '#5FB6FF' },
  { icon: Zap,          title: 'Make visuals',       tagline: 'A designer in your pocket.', color: '#C064F0' },
  { icon: BarChart3,    title: 'Read the numbers',   tagline: 'Patterns you would miss.', color: '#FF375F' }
]
function SectionWhatAICanDo() {
  return (
    <Section eyebrow="What it actually does" title={<>Six things AI can <Em>do for you</Em>.</>}>
      <div className="grid grid-cols-1 gap-3">
        {CATEGORIES.map(c => (
          <Card key={c.title}>
            <div className="flex items-start gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${c.color}20`, border: `1px solid ${c.color}40` }}
              >
                <c.icon className="h-5 w-5" style={{ color: c.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-[16px] font-semibold leading-snug">{c.title}</div>
                <div className="text-white/65 text-[14px] leading-relaxed mt-1">{c.tagline}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

/* ---------- Start This Week ---------- */
const STEPS = [
  { n: '01', title: 'Pick one tool', body: 'Claude or ChatGPT — commit to one for two weeks.' },
  { n: '02', title: 'Pick one task', body: 'Something you do every week: emails, social, FAQs.' },
  { n: '03', title: 'Spend 30 minutes', body: 'One focused session. Show examples, give context, iterate.' },
  { n: '04', title: 'Save your best prompt', body: "When a prompt works, save it. That's now an asset." },
  { n: '05', title: 'Add one task per week', body: 'By week six, AI is handling six recurring tasks.', accent: true }
]
function SectionStartThisWeek() {
  return (
    <Section eyebrow="The plan" title={<>Pick one tool. <Em>Pick one task.</Em></>}>
      <p className="text-white/65 text-[14px] leading-relaxed mb-5 -mt-2">
        Don't overhaul everything. Start small, save what works, expand week by week.
      </p>
      <div className="relative">
        {/* Vertical guide line */}
        <div
          aria-hidden
          className="absolute left-[19px] top-3 bottom-3 w-px"
          style={{ background: 'linear-gradient(180deg, rgba(34,211,238,0.5) 0%, rgba(99,102,241,0.4) 100%)' }}
        />
        <div className="space-y-4">
          {STEPS.map(s => (
            <div key={s.n} className="relative flex items-start gap-4">
              <div
                className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center font-serif text-[15px] shrink-0 ${
                  s.accent
                    ? 'text-white shadow-lg'
                    : 'bg-[#0E0C20] border border-white/15 text-white/85'
                }`}
                style={s.accent ? { background: 'linear-gradient(135deg, #2997FF 0%, #6366F1 100%)' } : undefined}
              >
                {s.n}
              </div>
              <div className="pt-1.5 flex-1">
                <div className="text-white text-[15px] font-semibold leading-tight">{s.title}</div>
                <div className="text-white/65 text-[13px] leading-relaxed mt-1">{s.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <div
          className="font-serif italic text-white/95"
          style={{ fontFamily: '"Fraunces", serif', fontStyle: 'italic', fontSize: 'clamp(20px, 5.2vw, 26px)', lineHeight: 1.3 }}
        >
          Six weeks from now, that's
          <span
            className="ml-1"
            style={{
              background: 'linear-gradient(135deg, #2997FF 0%, #C064F0 100%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'
            }}
          >
            six recurring tasks off your plate.
          </span>
        </div>
      </div>
    </Section>
  )
}

/* ---------- Ask + Chat CTA ---------- */
function SectionAskClaude({ onAsk, onChat }) {
  return (
    <section className="relative px-5 pt-14 pb-16">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(95,182,255,0.35) 50%, transparent 100%)'
        }}
      />
      {/* Soft glow above the eyebrow that visually anchors the start
          of a new section without adding extra chrome. */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '60%',
          height: '120px',
          background:
            'radial-gradient(ellipse at top, rgba(95,182,255,0.12) 0%, transparent 70%)'
        }}
      />
      <div className="relative text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-3 mob-reveal-child">
        {eyebrow}
      </div>
      <h2
        className="relative text-white font-bold leading-[1.08] mb-6 mob-reveal-child"
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          fontSize: 'clamp(28px, 7.5vw, 40px)',
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h2>
      <div className="relative space-y-3">{children}</div>
    </section>
  )
}

/* ---------- Reusable Section helper ---------- */
function Section({ eyebrow, title, children }) {
  const ref = useReveal()
  return (
    <section ref={ref} className="relative px-5 pt-14 pb-16 mob-reveal">
      {/* Top divider — gradient line that fades out on each side so
          adjacent sections feel deliberately separated rather than
          mashed together. Stronger than a flat border. */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(95,182,255,0.35) 50%, transparent 100%)'
        }}
      />
      {/* Soft cyan glow above the eyebrow that visually anchors the
          start of a new section without adding extra chrome. */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: '60%',
          height: '120px',
          background:
            'radial-gradient(ellipse at top, rgba(95,182,255,0.12) 0%, transparent 70%)'
        }}
      />
      <div className="relative text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-3 mob-reveal-child">
        {eyebrow}
      </div>
      <h2
        className="relative text-white font-bold leading-[1.08] mb-6 mob-reveal-child"
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          fontSize: 'clamp(28px, 7.5vw, 40px)',
          letterSpacing: '-0.02em'
        }}
      >
        {title}
      </h2>
      <div className="relative space-y-3">{children}</div>
    </section>
  )
}

function Card({ children }) {
  return (
    <div className="rounded-2xl px-4 py-4 bg-white/4 border border-white/10 mob-card mob-reveal-child">
      {children}
    </div>
  )
}

function Em({ children }) {
  return (
    <em
      className="not-italic"
      style={{
        fontFamily: '"Fraunces", serif',
        fontStyle: 'italic',
        background: 'linear-gradient(135deg, #2997FF 0%, #C064F0 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
      }}
    >
      {children}
    </em>
  )
}

/* ---------- Closing presenters strip ---------- */
function ClosingPresenters({ onSelect }) {
  return (
    <section className="relative px-5 pt-14 pb-16">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(95,182,255,0.35) 50%, transparent 100%)'
        }}
      />
      <div className="text-[10px] uppercase tracking-[0.32em] text-cyan-300 font-bold text-center mb-2">
        Presented by
      </div>
      <div className="text-center text-white/45 text-[11px] mb-5">
        Tap a name to save their contact
      </div>
      <div className="space-y-4">
        {[PRESENTERS.romik, PRESENTERS.jim].map(p => (
          <button
            key={p.id}
            onClick={() => onSelect?.(p)}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/3 border border-white/8 hover:border-accent-cyan/40 hover:bg-white/5 transition text-left"
          >
            <div className="relative shrink-0">
              <div
                className="absolute inset-[-2px] rounded-full"
                style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
              />
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#0E0C20] ring-1 ring-[#07060F]">
                <img
                  src={p.photo}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: p.id === 'romik' ? 'center 25%' : 'center 30%' }}
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[16px] font-semibold leading-tight">{p.name}</div>
              <div className="text-white/55 text-[12px] leading-tight mt-0.5">{p.role} · {p.companyShort}</div>
            </div>
            <div
              className="shrink-0 flex items-center justify-center"
              style={{ height: '36px', width: '88px' }}
            >
              <img
                src={p.logo}
                alt=""
                className="object-contain"
                style={{
                  maxHeight: p.id === 'jim' ? '36px' : '24px',
                  maxWidth: '88px',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="px-5 py-10 pb-28 text-center border-t border-white/8 mt-4">
      <div className="text-[11px] uppercase tracking-[0.32em] text-white/35 font-bold">
        Burbank Chamber · 2026
      </div>
      <div className="text-white/55 text-[12px] mt-2">
        Built by Media City Design.
      </div>
    </footer>
  )
}

/* ---------- Sticky Ask bar (always-visible CTA) ---------- */
function StickyAskBar({ onAsk, onChat }) {
  return (
    <div
      className="fixed left-3 right-3 z-40 mob-sticky-in"
      style={{
        bottom: 'calc(12px + env(safe-area-inset-bottom))'
      }}
    >
      <div
        className="rounded-2xl p-1.5 flex gap-1.5 backdrop-blur-md"
        style={{
          background: 'rgba(7,6,15,0.85)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 12px 32px -10px rgba(0,0,0,0.6)'
        }}
      >
        <button
          onClick={onAsk}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #2997FF 0%, #6366F1 100%)' }}
        >
          <MessageCircleQuestion className="h-4 w-4" />
          Ask
        </button>
        <button
          onClick={onChat}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white/95 font-medium text-sm bg-white/5 border border-white/10"
        >
          <Sparkles className="h-4 w-4" />
          Claude
        </button>
      </div>
    </div>
  )
}
