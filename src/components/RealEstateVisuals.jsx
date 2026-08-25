import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ============================================================================
   Real-estate anchor visuals for the Part 2 "AI in Real Estate" showcase.
   Each component fills its tile (w-full h-full), loops gently, and matches
   the deck's dark / electric visual language (see AnchorVisuals.jsx).
   ============================================================================ */

const EASE = [0.22, 1, 0.36, 1]

function useAutoCycle(count, ms = 4000) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % count), ms)
    return () => clearInterval(t)
  }, [count, ms])
  return idx
}

/** Incrementing key every `ms` to restart looped keyframe sequences. */
function useLoopKey(ms) {
  const [k, setK] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setK(x => x + 1), ms)
    return () => clearInterval(t)
  }, [ms])
  return k
}

/** Small uppercase tile header, matching the anchor-visual convention. */
function VizHeader({ children, color = 'var(--c-electric-soft)' }) {
  return (
    <div className="font-sans uppercase font-bold shrink-0"
         style={{ fontSize: '12px', letterSpacing: '0.24em', color, marginBottom: '10px' }}>
      {children}
    </div>
  )
}

/* ============================================================================
   1 — ContentFanOut :: "One property, ten pieces of content"
   A house node radiates into four output chips (MLS, Social, Email, Flyer).
   Connector lines draw, then each chip pops in sequence. Loops.
   ============================================================================ */
const FAN_OUTPUTS = [
  { label: 'MLS',       x: 300, y: 44,  color: 'var(--c-electric-soft)' },
  { label: 'Social',    x: 330, y: 104, color: 'var(--c-violet)' },
  { label: 'Email',     x: 330, y: 168, color: 'var(--c-teal)' },
  { label: 'Flyer',     x: 300, y: 226, color: 'var(--c-amber)' }
]

export function ContentFanOut() {
  const k = useLoopKey(4600)
  const hub = { x: 96, y: 135 }
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-amber)">Market a listing</VizHeader>
      <div className="relative flex-1 min-h-0">
        <svg viewBox="0 0 380 270" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* connectors */}
          {FAN_OUTPUTS.map((o, i) => (
            <motion.path
              key={`line-${k}-${i}`}
              d={`M ${hub.x} ${hub.y} C ${(hub.x + o.x) / 2} ${hub.y}, ${(hub.x + o.x) / 2} ${o.y}, ${o.x - 34} ${o.y}`}
              fill="none" stroke={o.color} strokeWidth="2" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.15 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.18, ease: EASE }}
              style={{ filter: `drop-shadow(0 0 5px color-mix(in srgb, ${o.color} 60%, transparent))` }}
            />
          ))}

          {/* traveling pulses along each connector */}
          {FAN_OUTPUTS.map((o, i) => (
            <motion.circle
              key={`pulse-${k}-${i}`}
              r="3" fill="#fff"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                cx: [hub.x, o.x - 34],
                cy: [hub.y, o.y]
              }}
              transition={{ duration: 0.7, delay: 0.5 + i * 0.18, ease: EASE }}
            />
          ))}

          {/* hub: house */}
          <motion.g
            key={`hub-${k}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ transformOrigin: `${hub.x}px ${hub.y}px` }}
          >
            <circle cx={hub.x} cy={hub.y} r="40"
                    fill="color-mix(in srgb, var(--c-amber) 14%, transparent)"
                    stroke="var(--c-amber)" strokeWidth="2" />
            <motion.circle cx={hub.x} cy={hub.y} r="40" fill="none"
                    stroke="var(--c-amber)" strokeWidth="2"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.4, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.4 }}
                    style={{ transformOrigin: `${hub.x}px ${hub.y}px` }} />
            {/* house glyph */}
            <path d={`M ${hub.x - 17} ${hub.y + 2} L ${hub.x} ${hub.y - 16} L ${hub.x + 17} ${hub.y + 2} Z`}
                  fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
            <rect x={hub.x - 12} y={hub.y + 2} width="24" height="15" rx="1.5"
                  fill="none" stroke="#fff" strokeWidth="2.4" />
          </motion.g>

          {/* output chips */}
          {FAN_OUTPUTS.map((o, i) => (
            <motion.g
              key={`chip-${k}-${i}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: 1.15 + i * 0.18, ease: EASE }}
              style={{ transformOrigin: `${o.x}px ${o.y}px` }}
            >
              <rect x={o.x - 34} y={o.y - 17} width="72" height="34" rx="9"
                    fill="color-mix(in srgb, var(--bg-base, #0A0820) 60%, transparent)"
                    stroke={o.color} strokeWidth="1.5"
                    style={{ filter: `drop-shadow(0 0 8px color-mix(in srgb, ${o.color} 45%, transparent))` }} />
              <text x={o.x + 2} y={o.y + 5} textAnchor="middle"
                    fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="700" fill="#fff">
                {o.label}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   2 — LifecycleTimeline :: List -> Market -> Show -> Offer -> Close
   Traveling pulse along the track; the active stage glows. Loops.
   ============================================================================ */
const LIFECYCLE = [
  { label: 'List',   color: 'var(--c-electric-soft)' },
  { label: 'Market', color: 'var(--c-electric)' },
  { label: 'Show',   color: 'var(--c-violet)' },
  { label: 'Offer',  color: 'var(--c-amber)' },
  { label: 'Close',  color: 'var(--c-teal)' }
]

export function LifecycleTimeline() {
  const active = useAutoCycle(LIFECYCLE.length, 1250)
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-electric-soft)">The listing lifecycle</VizHeader>
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-full" style={{ maxWidth: '440px' }}>
          {/* base track */}
          <div className="absolute left-0 right-0"
               style={{ top: '18px', height: '2px', background: 'rgba(255,255,255,0.12)' }} />
          {/* traveling light */}
          <motion.div className="absolute" style={{ top: '18px', height: '2px', width: '10%' }}
            animate={{ left: ['-12%', '110%'] }}
            transition={{ duration: 6.25, ease: 'linear', repeat: Infinity }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(90deg, transparent, #fff 50%, transparent)',
              filter: 'drop-shadow(0 0 8px rgba(95,182,255,0.95))',
              transform: 'translateY(-50%)'
            }} />
          </motion.div>
          {/* nodes */}
          <div className="relative flex justify-between items-start">
            {LIFECYCLE.map((s, i) => {
              const on = i === active
              return (
                <div key={s.label} className="flex flex-col items-center" style={{ gap: '12px', width: '20%' }}>
                  <motion.div className="rounded-full"
                    animate={{
                      scale: on ? 1.35 : 1,
                      boxShadow: on
                        ? `0 0 22px ${s.color}, 0 0 44px color-mix(in srgb, ${s.color} 40%, transparent)`
                        : '0 0 0 transparent'
                    }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ width: '16px', height: '16px', marginTop: '10px', background: s.color, border: '2px solid var(--bg-base, #0A0820)' }} />
                  <motion.div className="font-sans uppercase font-bold whitespace-nowrap"
                    animate={{ opacity: on ? 1 : 0.5, y: on ? -2 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: '12px', letterSpacing: '0.16em', color: on ? s.color : 'rgba(255,255,255,0.7)' }}>
                    {s.label}
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   3 — CompsPrice :: comparable-home bars rise, suggested price settles in
   ============================================================================ */
const COMPS = [58, 74, 46, 82, 66]      // relative heights (%)
const SUGGEST_PCT = 70                    // suggested line height (%)

export function CompsPrice() {
  const k = useLoopKey(4400)
  const baseY = 214, top = 40, H = baseY - top
  const barW = 40, gap = 24
  const totalW = COMPS.length * barW + (COMPS.length - 1) * gap
  const x0 = (380 - totalW) / 2
  const suggestY = baseY - (SUGGEST_PCT / 100) * H
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-teal)">Price from comps</VizHeader>
      <div className="relative flex-1 min-h-0">
        <svg viewBox="0 0 380 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* baseline */}
          <line x1={x0 - 14} y1={baseY} x2={x0 + totalW + 14} y2={baseY}
                stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          {/* comp bars */}
          {COMPS.map((h, i) => {
            const bh = (h / 100) * H
            const x = x0 + i * (barW + gap)
            return (
              <motion.rect
                key={`bar-${k}-${i}`}
                x={x} width={barW} rx="4"
                fill="color-mix(in srgb, var(--c-electric) 55%, transparent)"
                stroke="color-mix(in srgb, var(--c-electric) 80%, transparent)" strokeWidth="1"
                initial={{ height: 0, y: baseY }}
                animate={{ height: bh, y: baseY - bh }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
              />
            )
          })}
          {/* suggested price line */}
          <motion.line
            key={`sug-${k}`}
            x1={x0 - 14} x2={x0 + totalW + 14} y1={suggestY} y2={suggestY}
            stroke="var(--c-amber)" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 1, pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
            style={{ filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--c-amber) 60%, transparent))' }}
          />
          <motion.g
            key={`tag-${k}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.25, ease: EASE }}
          >
            <rect x={x0 + totalW - 92} y={suggestY - 34} width="106" height="26" rx="6"
                  fill="var(--c-amber)"
                  style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))' }} />
            <text x={x0 + totalW - 39} y={suggestY - 15} textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace" fontSize="15" fontWeight="700" fill="#1a1206">
              $985K
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   4 — DescriptionMorph :: bland MLS blurb rewrites into a polished one
   ============================================================================ */
const BLAND = '3BR house. Good location. Must see.'
const BRILLIANT = 'Sun-drenched 3-bed craftsman, steps from Magnolia Blvd — restored built-ins, a chef’s kitchen, and a lemon-tree backyard made for Sunday mornings.'

function useTypewriter(text, active, speed = 16) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) { setN(0); return }
    setN(0)
    let raf, start
    const step = (t) => {
      if (!start) start = t
      const chars = Math.min(text.length, Math.floor((t - start) / speed))
      setN(chars)
      if (chars < text.length) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [text, active, speed])
  return text.slice(0, n)
}

export function DescriptionMorph() {
  // Every loop: brief beat on the bland source, then type out the polished copy,
  // then hold. The AI output stays populated for almost the whole cycle.
  const k = useLoopKey(5600)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    setStarted(false)
    const t = setTimeout(() => setStarted(true), 650)
    return () => clearTimeout(t)
  }, [k])
  const typed = useTypewriter(BRILLIANT, started, 14)
  const done = started && typed.length === BRILLIANT.length
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-violet)">Draft the listing copy</VizHeader>
      <div className="relative flex-1 min-h-0 flex flex-col justify-center" style={{ gap: '10px' }}>
        {/* bland source */}
        <div className="flex items-start" style={{ gap: '8px' }}>
          <span className="font-sans uppercase font-bold shrink-0"
                style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
            IN
          </span>
          <div className="font-mono" style={{ fontSize: '14px', lineHeight: 1.4, color: 'rgba(255,255,255,0.4)', textDecoration: started ? 'line-through' : 'none' }}>
            {BLAND}
          </div>
        </div>
        {/* arrow */}
        <div className="flex items-center" style={{ gap: '8px', opacity: 0.6 }}>
          <span style={{ color: 'var(--c-violet)', fontSize: '16px' }}>↓</span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--c-violet), transparent)' }} />
        </div>
        {/* brilliant output */}
        <div className="flex items-start" style={{ gap: '8px', minHeight: '92px' }}>
          <span className="font-sans uppercase font-bold shrink-0"
                style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--c-electric-soft)', marginTop: '3px' }}>
            AI
          </span>
          <div className="display-sans" style={{ fontSize: '15px', lineHeight: 1.42, color: '#fff' }}>
            {typed}
            {started && !done && (
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{ display: 'inline-block', width: '2px', height: '15px', background: 'var(--c-electric-soft)', marginLeft: '2px', transform: 'translateY(2px)' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   5 — NeighborhoodPins :: comps / listings drop onto a Burbank grid
   ============================================================================ */
const PINS = [
  { x: 78,  y: 92,  hot: false },
  { x: 150, y: 150, hot: false },
  { x: 210, y: 80,  hot: true  },   // your listing
  { x: 275, y: 140, hot: false },
  { x: 120, y: 200, hot: false },
  { x: 300, y: 196, hot: false }
]

export function NeighborhoodPins() {
  const k = useLoopKey(4200)
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-electric)">Know your market</VizHeader>
      <div className="relative flex-1 min-h-0">
        <svg viewBox="0 0 380 250" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* grid */}
          {[...Array(6)].map((_, i) => (
            <line key={`v${i}`} x1={20 + i * 68} y1="24" x2={20 + i * 68} y2="234"
                  stroke="rgba(95,182,255,0.10)" strokeWidth="1" />
          ))}
          {[...Array(4)].map((_, i) => (
            <line key={`h${i}`} x1="16" y1={40 + i * 62} x2="364" y2={40 + i * 62}
                  stroke="rgba(95,182,255,0.10)" strokeWidth="1" />
          ))}
          {/* pins */}
          {PINS.map((p, i) => {
            const color = p.hot ? 'var(--c-amber)' : 'var(--c-electric-soft)'
            return (
              <g key={`pin-${k}-${i}`}>
                {/* ripple */}
                <motion.circle cx={p.x} cy={p.y} r="6" fill="none" stroke={color} strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 3.2], opacity: [0.7, 0] }}
                  transition={{ duration: 1.1, delay: 0.4 + i * 0.22 + 0.35, ease: 'easeOut', repeat: Infinity, repeatDelay: 2.4 }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                {/* dropping pin */}
                <motion.g
                  initial={{ y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.4 + i * 0.22 }}
                >
                  <path d={`M ${p.x} ${p.y} C ${p.x - 11} ${p.y - 16}, ${p.x - 9} ${p.y - 30}, ${p.x} ${p.y - 30} C ${p.x + 9} ${p.y - 30}, ${p.x + 11} ${p.y - 16}, ${p.x} ${p.y} Z`}
                        fill={color}
                        style={{ filter: `drop-shadow(0 3px 8px color-mix(in srgb, ${color} 55%, transparent))` }} />
                  <circle cx={p.x} cy={p.y - 20} r="4.5" fill="var(--bg-base, #0A0820)" />
                </motion.g>
              </g>
            )
          })}
          {/* "your listing" tag */}
          <motion.g
            key={`tag-${k}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <text x="210" y="46" textAnchor="middle"
                  fontFamily="Inter Tight, sans-serif" fontSize="11" fontWeight="700"
                  letterSpacing="1.5" fill="var(--c-amber)">
              YOUR LISTING
            </text>
          </motion.g>
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   6 — DaysOnMarket :: days count down, then a SOLD stamp thuds in
   ============================================================================ */
export function DaysOnMarket() {
  const k = useLoopKey(4600)
  const [days, setDays] = useState(24)
  const [sold, setSold] = useState(false)
  useEffect(() => {
    setSold(false)
    setDays(24)
    const start = performance.now()
    const from = 24, to = 6, dur = 1600
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur)
      const ease = 1 - Math.pow(1 - p, 3)
      setDays(Math.round(from + (to - from) * ease))
      if (p < 1) raf = requestAnimationFrame(step)
      else setTimeout(() => setSold(true), 250)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [k])
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '4px 2px' }}>
      <VizHeader color="var(--c-coral)">Time to close</VizHeader>
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        <motion.div className="flex flex-col items-center" style={{ gap: '2px' }}
          animate={{ opacity: sold ? 0.16 : 1, scale: sold ? 0.92 : 1 }}
          transition={{ duration: 0.4 }}>
          <div className="font-mono tabular-nums display-sans"
               style={{
                 fontSize: '82px', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
                 color: 'var(--c-electric-soft)',
                 textShadow: '0 0 34px color-mix(in srgb, var(--c-electric-soft) 45%, transparent)'
               }}>
            {days}
          </div>
          <div className="font-sans uppercase font-bold text-white/70"
               style={{ fontSize: '13px', letterSpacing: '0.24em' }}>
            days on market
          </div>
        </motion.div>

        {/* SOLD stamp */}
        <AnimatePresence>
          {sold && (
            <motion.div
              key={`sold-${k}`}
              className="absolute"
              initial={{ scale: 2.4, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: -12 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 420, damping: 15 }}
              style={{
                border: '4px solid var(--c-teal)',
                borderRadius: '10px',
                padding: '6px 18px',
                color: 'var(--c-teal)',
                fontFamily: 'Inter Tight, sans-serif',
                fontWeight: 900,
                fontSize: '40px',
                letterSpacing: '0.08em',
                textShadow: '0 0 20px color-mix(in srgb, var(--c-teal) 50%, transparent)',
                boxShadow: '0 0 24px color-mix(in srgb, var(--c-teal) 30%, transparent)',
                background: 'color-mix(in srgb, var(--bg-base, #0A0820) 55%, transparent)'
              }}
            >
              SOLD
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
