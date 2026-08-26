import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function useAutoCycle(count, ms = 5000) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % count), ms)
    return () => clearInterval(t)
  }, [count, ms])
  return idx
}

/* =============================================================
   SLIDE 2 — CostMeterAnchor v2
   A dramatic "search vs AI query" comparison that auto-cycles
   through three resources: Electricity, Water, Compute.
   - Big counter that ramps from 0 to the AI value
   - Two stacked rows: small dot "search" + giant glowing bar "AI query"
   - Particles flow along the AI bar as it fills
   - Slow Apple-keynote easing throughout
   ============================================================= */
const COST_STATES = [
  { label: 'Electricity',         baseline: 0.3,  ai: 9,    unit: 'Wh',         color: '#F5A623', icon: '⚡' },
  { label: 'Water (cooling)',     baseline: 0.5,  ai: 25,   unit: 'mL',         color: '#5FB6FF', icon: '💧' },
  { label: 'Compute',             baseline: 1,    ai: 1500, unit: '× a search', color: '#C064F0', icon: '◆' }
]

export function CostMeterAnchor() {
  const idx = useAutoCycle(COST_STATES.length, 5800)
  const s = COST_STATES[idx]
  return (
    <div className="relative w-full h-full flex flex-col justify-center"
         style={{ padding: '8px 16px', gap: '14px' }}>
      <AmbientDots count={12} />

      {/* Header */}
      <div className="font-sans uppercase font-bold text-white/70"
           style={{ fontSize: '14px', letterSpacing: '0.28em' }}>
        Cost of one query
      </div>

      {/* The big number — counts up from 0 each cycle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-baseline" style={{ gap: '12px' }}
        >
          <CountUp to={s.ai} color={s.color} cycleKey={idx} />
          <span className="font-mono text-white/75" style={{ fontSize: '24px' }}>{s.unit}</span>
        </motion.div>
      </AnimatePresence>

      {/* Resource label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`l-${idx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="display-sans text-white"
          style={{ fontSize: '24px', lineHeight: 1.1, marginTop: '-6px' }}
        >
          {s.label}
        </motion.div>
      </AnimatePresence>

      {/* Comparison: search vs AI */}
      <div className="flex flex-col" style={{ gap: '12px', marginTop: '6px' }}>
        {/* Web search row */}
        <div className="flex items-center" style={{ gap: '14px' }}>
          <div className="font-sans text-white/85 shrink-0" style={{ fontSize: '15px', width: '110px' }}>
            Web search
          </div>
          <div className="flex-1 relative" style={{ height: '6px' }}>
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <motion.div
              key={`base-${idx}`}
              initial={{ width: '0%' }}
              animate={{ width: `${(s.baseline / s.ai) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 bottom-0 bg-white/40 rounded-full"
            />
          </div>
          <div className="font-mono tabular-nums text-white/65 shrink-0 text-right"
               style={{ fontSize: '15px', width: '70px' }}>
            {s.baseline}
          </div>
        </div>

        {/* AI query row — dramatic, glowing, with flowing particles */}
        <div className="flex items-center" style={{ gap: '14px' }}>
          <div className="display-sans shrink-0" style={{ fontSize: '17px', width: '110px', color: s.color, fontWeight: 700 }}>
            AI query
          </div>
          <div className="flex-1 relative" style={{ height: '14px' }}>
            <div className="absolute inset-0 bg-white/8 rounded-full" />
            <motion.div
              key={`ai-${idx}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="absolute left-0 top-0 bottom-0 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${s.color}, color-mix(in srgb, ${s.color} 50%, white))`,
                boxShadow: `0 0 24px ${s.color}, 0 0 48px color-mix(in srgb, ${s.color} 50%, transparent)`
              }}
            >
              {/* Shimmer pulse traveling along the bar */}
              <motion.div
                key={`shim-${idx}`}
                className="absolute inset-y-0"
                style={{
                  width: '40%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)'
                }}
                initial={{ x: '-100%' }}
                animate={{ x: '300%' }}
                transition={{ duration: 2.4, ease: 'linear', repeat: Infinity, repeatDelay: 0.5, delay: 1.2 }}
              />
            </motion.div>
          </div>
          <motion.div
            key={`val-${idx}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="font-mono tabular-nums shrink-0 text-right"
            style={{ fontSize: '17px', width: '70px', color: s.color, fontWeight: 700 }}
          >
            {s.ai}
          </motion.div>
        </div>
      </div>

      {/* Multiplier callout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`mult-${idx}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 1.7, duration: 0.55 }}
          className="display-serif text-white/95"
          style={{ fontSize: '20px', fontStyle: 'italic', marginTop: '4px' }}
        >
          That's{' '}
          <span style={{ color: s.color, fontWeight: 700, fontStyle: 'normal' }} className="font-mono">
            {Math.round(s.ai / s.baseline)}×
          </span>{' '}
          a single search.
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function CountUp({ to, color, cycleKey }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const start = performance.now()
    const dur = 1400
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(to * ease)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, cycleKey])
  const display = to >= 100 ? Math.round(val) : val.toFixed(1)
  return (
    <span className="font-mono tabular-nums display-sans"
          style={{
            fontSize: '76px',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color,
            textShadow: `0 0 32px color-mix(in srgb, ${color} 45%, transparent)`
          }}>
      {display}
    </span>
  )
}

/* =============================================================
   SLIDE 4 — SkillAtrophyAnchor (unchanged)
   ============================================================= */
const SKILL_STATES = [
  { label: 'Generation only', score: 28, kind: 'weak' },
  { label: 'Audit + edit',    score: 92, kind: 'strong' }
]

export function SkillAtrophyAnchor() {
  const idx = useAutoCycle(SKILL_STATES.length, 4800)
  const s = SKILL_STATES[idx]
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientDots count={10} />
      <div className="relative w-full max-w-xl flex flex-col" style={{ gap: '20px' }}>
        <div className="font-sans uppercase font-bold text-white/70"
             style={{ fontSize: '14px', letterSpacing: '0.28em' }}>
          Critical-thinking strength
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            className="display-sans text-white"
            style={{ fontSize: '34px', lineHeight: 1.1 }}
          >
            {s.label}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center gap-6" style={{ marginTop: '6px' }}>
          <ScoreRing key={idx} value={s.score} kind={s.kind} />
          <div className="flex-1">
            <div className="font-mono tabular-nums display-sans"
                 style={{ fontSize: '64px', lineHeight: 0.95, letterSpacing: '-0.03em',
                          color: s.kind === 'strong' ? 'var(--c-teal)' : 'var(--c-coral)',
                          fontWeight: 900 }}>
              {s.score}
              <span className="text-white/45" style={{ fontSize: '24px' }}>/100</span>
            </div>
            <div className="text-white/85 leading-snug" style={{ fontSize: '17px', marginTop: '4px' }}>
              {s.kind === 'strong'
                ? 'Human stays in the loop. The muscle stays sharp.'
                : 'Outsource thinking → the muscle atrophies.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScoreRing({ value, kind }) {
  const r = 46, c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  const color = kind === 'strong' ? 'var(--c-teal)' : 'var(--c-coral)'
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
      <motion.circle
        cx="60" cy="60" r={r}
        fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
        transform="rotate(-90 60 60)"
        initial={{ strokeDasharray: c, strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: `drop-shadow(0 0 12px color-mix(in srgb, ${color} 60%, transparent))` }}
      />
    </svg>
  )
}

/* =============================================================
   SLIDE 5 — FactsCarousel
   Auto-cycling concrete stat that reinforces the "authentic local
   becomes the premium good" thesis. Big number counts up each cycle,
   label fades in, with a source line for credibility.
   ============================================================= */
const FACTS = [
  {
    value: 47, suffix: '%', decimals: 0,
    label: 'of online content will be AI-generated by 2026',
    source: 'Europol synthetic-media projection',
    color: 'var(--c-coral)',
    icon: '⚠'
  },
  {
    value: 3.2, suffix: '×', decimals: 1,
    label: 'more value placed on in-person interactions vs 2020',
    source: 'PwC Consumer Trust Survey',
    color: 'var(--c-electric)',
    icon: '◆'
  },
  {
    value: 87, suffix: '%', decimals: 0,
    label: 'of small-business buyers prefer humans over chatbots',
    source: 'Salesforce SMB Insights',
    color: 'var(--c-teal)',
    icon: '✦'
  }
]

export function FactsCarousel() {
  const idx = useAutoCycle(FACTS.length, 5400)
  const f = FACTS[idx]
  return (
    <div className="relative w-full h-full flex items-center"
         style={{ padding: '14px 28px', gap: '32px' }}>
      <AmbientDots count={8} />
      {/* Big stat — counts up */}
      <div className="flex items-baseline shrink-0" style={{ gap: '8px' }}>
        <CountUpFact key={`n-${idx}`} to={f.value} decimals={f.decimals} color={f.color} />
        <span className="font-mono display-sans" style={{ fontSize: '40px', fontWeight: 900, color: f.color }}>
          {f.suffix}
        </span>
      </div>

      {/* Vertical divider */}
      <div className="self-stretch" style={{ width: '1px', background: `color-mix(in srgb, ${f.color} 35%, transparent)` }} />

      {/* Label + source */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`l-${idx}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col flex-1 min-w-0"
          style={{ gap: '6px' }}
        >
          <div className="display-sans text-white leading-tight" style={{ fontSize: '24px' }}>
            {f.label}
          </div>
          <div className="font-sans uppercase font-bold text-white/55"
               style={{ fontSize: '12px', letterSpacing: '0.22em' }}>
            <span style={{ color: f.color, marginRight: '6px' }}>{f.icon}</span>
            {f.source}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex shrink-0" style={{ gap: '6px' }}>
        {FACTS.map((_, i) => (
          <span key={i} className="rounded-full transition-all"
                style={{
                  width: i === idx ? '20px' : '6px',
                  height: '6px',
                  background: i === idx ? f.color : 'rgba(255,255,255,0.25)',
                  boxShadow: i === idx ? `0 0 10px ${f.color}` : 'none'
                }} />
        ))}
      </div>
    </div>
  )
}

function CountUpFact({ to, decimals, color }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    const start = performance.now()
    const dur = 1300
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(to * ease)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to])
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val)
  return (
    <span className="font-mono tabular-nums display-sans"
          style={{
            fontSize: '88px', fontWeight: 900, lineHeight: 0.95,
            letterSpacing: '-0.04em', color,
            textShadow: `0 0 32px color-mix(in srgb, ${color} 45%, transparent)`
          }}>
      {display}
    </span>
  )
}

/* =============================================================
   TrustCurvesAnchor — kept for legacy use
   ============================================================= */
export function TrustCurvesAnchor() {
  const idx = useAutoCycle(2, 7000)
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <AmbientDots count={8} />
      <svg viewBox="0 0 600 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
        <line x1="40" y1="220" x2="580" y2="220" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <line x1="40" y1="40"  x2="40"  y2="220" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <motion.path
          key={`dig-${idx}`}
          d="M 40 60 C 140 80, 240 110, 320 145 S 480 200, 580 215"
          fill="none" stroke="var(--c-coral)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(255,55,95,0.45))' }}
        />
        <motion.path
          key={`loc-${idx}`}
          d="M 40 200 C 140 180, 240 150, 320 110 S 480 60, 580 50"
          fill="none" stroke="var(--c-electric)" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: 'drop-shadow(0 0 12px rgba(41,151,255,0.45))' }}
        />
        <motion.circle key={`d1-${idx}`} cx="580" cy="215" r="5" fill="var(--c-coral)"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} />
        <motion.circle key={`d2-${idx}`} cx="580" cy="50" r="5" fill="var(--c-electric)"
                       initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} />
        <text x="55" y="32" fill="rgba(255,255,255,0.55)" fontFamily="Inter Tight" fontSize="13"
              fontWeight="700" letterSpacing="3">TRUST</text>
        <text x="540" y="32" fill="var(--c-electric)" fontFamily="Inter Tight" fontSize="14" fontWeight="700"
              textAnchor="end">Local · in person</text>
        <text x="540" y="248" fill="var(--c-coral)" fontFamily="Inter Tight" fontSize="14" fontWeight="700"
              textAnchor="end">Digital · synthetic</text>
        <text x="40"  y="248" fill="rgba(255,255,255,0.45)" fontFamily="JetBrains Mono" fontSize="11">2020</text>
        <text x="580" y="248" fill="rgba(255,255,255,0.45)" fontFamily="JetBrains Mono" fontSize="11"
              textAnchor="end">2026</text>
      </svg>
    </div>
  )
}

/* =============================================================
   SLIDE 7 — PillarFlowAnchor (unchanged)
   ============================================================= */
const PILLARS = [
  { label: 'Assistants',  color: 'var(--c-electric-soft)' },
  { label: 'Tools',   color: 'var(--c-electric)' },
  { label: 'Action',  color: 'var(--c-amber)' }
]

export function PillarFlowAnchor() {
  const active = useAutoCycle(PILLARS.length, 1800)
  return (
    <div className="relative w-full flex items-center justify-center"
         style={{ height: '120px' }}>
      <AmbientDots count={6} />
      <div className="relative w-full max-w-3xl">
        <div className="absolute left-0 right-0" style={{ top: '50%', height: '2px', background: 'rgba(255,255,255,0.10)' }} />
        <motion.div
          className="absolute"
          style={{ top: '50%', height: '2px', width: '8%', borderRadius: '999px' }}
          animate={{ left: ['-10%', '108%'] }}
          transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
        >
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #fff 50%, transparent)',
            filter: 'drop-shadow(0 0 10px rgba(95,182,255,0.95)) drop-shadow(0 0 20px rgba(41,151,255,0.6))',
            transform: 'translateY(-50%)'
          }} />
        </motion.div>
        <div className="relative flex justify-between items-center">
          {PILLARS.map((p, i) => {
            const isActive = i === active
            return (
              <div key={p.label} className="flex flex-col items-center" style={{ gap: '12px' }}>
                <motion.div
                  className="rounded-full"
                  animate={{
                    scale: isActive ? 1.25 : 1,
                    boxShadow: isActive
                      ? `0 0 32px ${p.color}, 0 0 64px color-mix(in srgb, ${p.color} 40%, transparent)`
                      : '0 0 0px transparent'
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: '20px', height: '20px', background: p.color, border: '2px solid var(--bg-base)' }}
                />
                <motion.div
                  className="font-sans uppercase font-bold whitespace-nowrap"
                  animate={{ opacity: isActive ? 1 : 0.55, y: isActive ? -2 : 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '13px', letterSpacing: '0.22em',
                           color: isActive ? p.color : 'rgba(255,255,255,0.7)' }}
                >
                  {p.label}
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AmbientDots({ count = 10 }) {
  const dots = [...Array(count)].map((_, i) => ({
    x: (i * 137 + 23) % 100,
    y: (i * 211 + 47) % 100,
    size: 2 + ((i * 7) % 3),
    color: i % 3 === 0 ? 'var(--c-electric)' : i % 3 === 1 ? 'var(--c-violet)' : 'var(--c-teal)',
    delay: (i * 0.7) % 4
  }))
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`, top: `${d.y}%`,
            width: `${d.size}px`, height: `${d.size}px`,
            background: d.color,
            boxShadow: `0 0 8px ${d.color}`,
            opacity: 0.35
          }}
          animate={{ opacity: [0.15, 0.5, 0.15], y: [0, -6, 0] }}
          transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, delay: d.delay }}
        />
      ))}
    </div>
  )
}
