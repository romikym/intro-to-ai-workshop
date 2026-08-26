import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ============================================================================
   Real-estate anchor visuals — elevated / cinematic edition.
   Each component fills its tile (w-full h-full), loops continuously, and
   matches the deck's dark / electric language with real depth: flowing
   energy, glow, comet trails, radar sweeps, shockwaves.
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
function useLoopKey(ms) {
  const [k, setK] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setK(x => x + 1), ms)
    return () => clearInterval(t)
  }, [ms])
  return k
}

/** Elevated tile header — pulsing status dot + gradient underline. */
function VizHeader({ children, color = 'var(--c-electric-soft)' }) {
  return (
    <div className="shrink-0" style={{ marginBottom: '10px' }}>
      <div className="flex items-center" style={{ gap: '8px' }}>
        <motion.span style={{ width: '7px', height: '7px', borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}` }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="font-sans uppercase font-bold"
             style={{ fontSize: '12px', letterSpacing: '0.24em', color }}>
          {children}
        </div>
      </div>
      <div style={{ height: '2px', marginTop: '7px', borderRadius: '2px',
        background: `linear-gradient(90deg, ${color}, transparent 80%)`, opacity: 0.5 }} />
    </div>
  )
}

/* ============================================================================
   1 — ContentFanOut :: "One property, ten pieces of content"
   ============================================================================ */
const FAN_OUTPUTS = [
  { label: 'MLS',    x: 306, y: 46,  color: 'var(--c-electric-soft)', icon: 'doc' },
  { label: 'Social', x: 336, y: 108, color: 'var(--c-violet)',        icon: 'heart' },
  { label: 'Email',  x: 336, y: 172, color: 'var(--c-teal)',          icon: 'mail' },
  { label: 'Flyer',  x: 306, y: 232, color: 'var(--c-amber)',         icon: 'image' }
]
function ChipIcon({ type, cx, cy, color }) {
  const s = 6
  if (type === 'doc') return <g stroke={color} strokeWidth="1.4" fill="none"><rect x={cx-5} y={cy-6} width="10" height="12" rx="1.4"/><line x1={cx-2.5} y1={cy-2.5} x2={cx+2.5} y2={cy-2.5}/><line x1={cx-2.5} y1={cy+0.5} x2={cx+2.5} y2={cy+0.5}/><line x1={cx-2.5} y1={cy+3.5} x2={cx+1} y2={cy+3.5}/></g>
  if (type === 'heart') return <path d={`M ${cx} ${cy+5} C ${cx-8} ${cy-3}, ${cx-3} ${cy-8}, ${cx} ${cy-3} C ${cx+3} ${cy-8}, ${cx+8} ${cy-3}, ${cx} ${cy+5} Z`} fill={color}/>
  if (type === 'mail') return <g stroke={color} strokeWidth="1.4" fill="none"><rect x={cx-6} y={cy-4.5} width="12" height="9" rx="1.4"/><path d={`M ${cx-6} ${cy-4} L ${cx} ${cy+1} L ${cx+6} ${cy-4}`}/></g>
  return <g stroke={color} strokeWidth="1.4" fill="none"><rect x={cx-6} y={cy-5} width="12" height="10" rx="1.5"/><circle cx={cx-2.5} cy={cy-1.5} r="1.4" fill={color} stroke="none"/><path d={`M ${cx-5} ${cy+3.5} L ${cx-1} ${cy-0.5} L ${cx+2} ${cy+2} L ${cx+4} ${cy}`}/></g>
}

export function ContentFanOut() {
  const k = useLoopKey(4800)
  const hub = { x: 92, y: 138 }
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-amber)">Market a listing</VizHeader>
      <div className="relative flex-1 min-h-0">
        <svg viewBox="0 0 380 276" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            {FAN_OUTPUTS.map((o,i)=>(
              <linearGradient key={i} id={`fan-g-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--c-amber)"/>
                <stop offset="100%" stopColor={o.color}/>
              </linearGradient>
            ))}
            <radialGradient id="fan-hub" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="rgba(245,166,35,0.5)"/>
              <stop offset="100%" stopColor="rgba(245,166,35,0)"/>
            </radialGradient>
          </defs>

          {/* connectors: static gradient + flowing dashes */}
          {FAN_OUTPUTS.map((o, i) => {
            const d = `M ${hub.x} ${hub.y} C ${(hub.x + o.x) / 2} ${hub.y}, ${(hub.x + o.x) / 2} ${o.y}, ${o.x - 36} ${o.y}`
            return (
              <g key={`c-${k}-${i}`}>
                <motion.path d={d} fill="none" stroke={`url(#fan-g-${i})`} strokeWidth="2.4" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0.1 }} animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.7, delay: 0.35 + i * 0.14, ease: EASE }} />
                <path className="re-flow" d={d} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"
                  style={{ opacity: 0.85, animationDelay: `${i * 0.25}s`,
                    filter: `drop-shadow(0 0 4px ${o.color})` }} />
              </g>
            )
          })}

          {/* hub glow + rotating dashed ring + house */}
          <circle cx={hub.x} cy={hub.y} r="52" fill="url(#fan-hub)"/>
          <g style={{ transformOrigin: `${hub.x}px ${hub.y}px`, animation: 'reSpin 14s linear infinite' }}>
            <circle cx={hub.x} cy={hub.y} r="44" fill="none" stroke="var(--c-amber)" strokeWidth="1.2"
              strokeDasharray="3 7" opacity="0.55"/>
          </g>
          <motion.circle cx={hub.x} cy={hub.y} r="34" fill="none" stroke="var(--c-amber)" strokeWidth="2"
            initial={{ scale: 0.85, opacity: 0.7 }} animate={{ scale: 1.55, opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
            style={{ transformOrigin: `${hub.x}px ${hub.y}px` }} />
          <motion.g key={`hub-${k}`} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }} style={{ transformOrigin: `${hub.x}px ${hub.y}px` }}>
            <circle cx={hub.x} cy={hub.y} r="34"
              fill="color-mix(in srgb, var(--c-amber) 16%, #0a0713)"
              stroke="var(--c-amber)" strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 14px color-mix(in srgb, var(--c-amber) 55%, transparent))' }}/>
            <path d={`M ${hub.x-15} ${hub.y+2} L ${hub.x} ${hub.y-15} L ${hub.x+15} ${hub.y+2} Z`}
              fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round"/>
            <rect x={hub.x-11} y={hub.y+2} width="22" height="14" rx="1.5" fill="none" stroke="#fff" strokeWidth="2.4"/>
          </motion.g>

          {/* chips: spring pop, icon, float, glow */}
          {FAN_OUTPUTS.map((o, i) => (
            <motion.g key={`chip-${k}-${i}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 1.05 + i * 0.16 }}
              style={{ transformOrigin: `${o.x}px ${o.y}px` }}>
              <g style={{ transformOrigin: `${o.x}px ${o.y}px`, animation: `reFloat ${3 + i*0.3}s ease-in-out ${i*0.4}s infinite` }}>
                <rect x={o.x - 36} y={o.y - 18} width="76" height="36" rx="10"
                  fill="color-mix(in srgb, #0a0713 72%, transparent)" stroke={o.color} strokeWidth="1.6"
                  style={{ filter: `drop-shadow(0 0 9px color-mix(in srgb, ${o.color} 50%, transparent))` }}/>
                <ChipIcon type={o.icon} cx={o.x - 22} cy={o.y} color={o.color}/>
                <text x={o.x + 8} y={o.y + 5} textAnchor="middle" fontFamily="Inter Tight, sans-serif"
                  fontSize="15" fontWeight="700" fill="#fff">{o.label}</text>
              </g>
            </motion.g>
          ))}
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   2 — LifecycleTimeline :: List -> Market -> Show -> Offer -> Close
   Filling rail + comet + node icons + completion checks + close burst.
   ============================================================================ */
const LIFECYCLE = [
  { label: 'List',   color: 'var(--c-electric-soft)' },
  { label: 'Market', color: 'var(--c-electric)' },
  { label: 'Show',   color: 'var(--c-violet)' },
  { label: 'Offer',  color: 'var(--c-amber)' },
  { label: 'Close',  color: 'var(--c-teal)' }
]
export function LifecycleTimeline() {
  const active = useAutoCycle(LIFECYCLE.length, 1150)
  const n = LIFECYCLE.length
  const pct = n > 1 ? (active / (n - 1)) * 100 : 0
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-electric-soft)">The listing lifecycle</VizHeader>
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        <div className="relative w-full" style={{ maxWidth: '450px', padding: '0 6px' }}>
          {/* base rail */}
          <div className="absolute" style={{ left: '4%', right: '4%', top: '20px', height: '3px', borderRadius: '3px', background: 'rgba(255,255,255,0.12)' }} />
          {/* filled rail */}
          <motion.div className="absolute" style={{ left: '4%', top: '20px', height: '3px', borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--c-electric-soft), var(--c-violet), var(--c-teal))',
            boxShadow: '0 0 12px rgba(95,182,255,0.7)' }}
            animate={{ width: `${pct * 0.92}%` }} transition={{ duration: 0.7, ease: EASE }} />
          {/* comet head */}
          <motion.div className="absolute" style={{ top: '20px', transform: 'translate(-50%,-50%)' }}
            animate={{ left: `${4 + pct * 0.92}%` }} transition={{ duration: 0.7, ease: EASE }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fff',
              boxShadow: '0 0 14px 3px rgba(255,255,255,0.9), 0 0 28px 8px rgba(95,182,255,0.6)' }} />
          </motion.div>

          <div className="relative flex justify-between items-start">
            {LIFECYCLE.map((s, i) => {
              const done = i < active, on = i === active
              return (
                <div key={s.label} className="flex flex-col items-center" style={{ gap: '11px', width: '20%' }}>
                  <div className="relative" style={{ marginTop: '9px', height: '24px', width: '24px' }}>
                    {on && <motion.span className="absolute inset-0 rounded-full"
                      style={{ background: s.color }} initial={{ scale: 0.6, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }} />}
                    <motion.div className="absolute inset-0 rounded-full flex items-center justify-center"
                      animate={{ scale: on ? 1.15 : 1,
                        background: (done || on) ? s.color : 'rgba(255,255,255,0.14)',
                        boxShadow: on ? `0 0 20px ${s.color}` : '0 0 0 transparent' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      style={{ border: '2px solid #0A0820' }}>
                      {done && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.2 L5 8.6 L9.5 3.6" fill="none" stroke="#0a0713" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </motion.div>
                  </div>
                  <motion.div className="font-sans uppercase font-bold whitespace-nowrap"
                    animate={{ opacity: on ? 1 : done ? 0.75 : 0.42, y: on ? -1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ fontSize: '11.5px', letterSpacing: '0.14em', color: (on || done) ? s.color : 'rgba(255,255,255,0.7)' }}>
                    {s.label}
                  </motion.div>
                </div>
              )
            })}
          </div>

          {/* closing celebration when reaching Close */}
          <AnimatePresence>
            {active === n - 1 && (
              <motion.div className="absolute" style={{ right: '4%', top: '20px', transform: 'translate(50%,-50%)' }}>
                {[...Array(7)].map((_, i) => {
                  const ang = (i / 7) * Math.PI * 2
                  return <motion.span key={i} className="absolute rounded-full"
                    style={{ width: '4px', height: '4px', background: 'var(--c-teal)', boxShadow: '0 0 6px var(--c-teal)' }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: Math.cos(ang) * 26, y: Math.sin(ang) * 26, opacity: 0, scale: 0.3 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }} />
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   3 — CompsPrice :: comparable bars rise; suggested price line + traveling dot
   ============================================================================ */
const COMPS = [56, 74, 46, 82, 66]
const SUGGEST_PCT = 71
export function CompsPrice() {
  const k = useLoopKey(4600)
  const baseY = 214, top = 38, H = baseY - top
  const barW = 42, gap = 24
  const totalW = COMPS.length * barW + (COMPS.length - 1) * gap
  const x0 = (380 - totalW) / 2
  const suggestY = baseY - (SUGGEST_PCT / 100) * H
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-teal)">Price from comps</VizHeader>
      <div className="relative flex-1 min-h-0">
        <svg viewBox="0 0 380 248" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="bar-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--c-electric-soft)"/>
              <stop offset="100%" stopColor="color-mix(in srgb, var(--c-electric) 35%, transparent)"/>
            </linearGradient>
          </defs>
          {/* faint gridlines */}
          {[0.25,0.5,0.75].map((g,i)=>(<line key={i} x1={x0-16} y1={baseY-g*H} x2={x0+totalW+16} y2={baseY-g*H}
            stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>))}
          <line x1={x0-16} y1={baseY} x2={x0+totalW+16} y2={baseY} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5"/>

          {COMPS.map((h, i) => {
            const bh = (h / 100) * H, x = x0 + i * (barW + gap)
            return (
              <g key={`bar-${k}-${i}`}>
                <motion.rect x={x} width={barW} rx="5" fill="url(#bar-g)"
                  initial={{ height: 0, y: baseY }}
                  animate={{ height: bh, y: baseY - bh }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 + i * 0.09 }} />
                {/* glossy top cap */}
                <motion.rect x={x} width={barW} height="4" rx="2" fill="rgba(255,255,255,0.7)"
                  initial={{ y: baseY, opacity: 0 }} animate={{ y: baseY - bh, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 + i * 0.09 }} />
              </g>
            )
          })}

          {/* suggested price line draws L->R with a glowing traveling dot */}
          <motion.line key={`sug-${k}`} x1={x0-16} x2={x0+totalW+16} y1={suggestY} y2={suggestY}
            stroke="var(--c-amber)" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            style={{ filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--c-amber) 65%, transparent))' }}/>
          <motion.circle key={`dot-${k}`} cy={suggestY} r="4.5" fill="#fff"
            initial={{ cx: x0-16, opacity: 0 }} animate={{ cx: x0+totalW+16, opacity: [0,1,1,0] }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
            style={{ filter: 'drop-shadow(0 0 6px var(--c-amber))' }}/>

          {/* price tag pops */}
          <motion.g key={`tag-${k}`} initial={{ opacity: 0, scale: 0.7, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 1.5 }}
            style={{ transformOrigin: `${x0+totalW-40}px ${suggestY-22}px` }}>
            <rect x={x0+totalW-96} y={suggestY-36} width="112" height="28" rx="7" fill="var(--c-amber)"
              style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.45))' }}/>
            <path d={`M ${x0+totalW-84} ${suggestY-22} l 4 -5 l 4 5 z`} fill="#1a1206"/>
            <text x={x0+totalW-33} y={suggestY-16} textAnchor="middle" fontFamily="JetBrains Mono, monospace"
              fontSize="15" fontWeight="700" fill="#1a1206">$985K</text>
          </motion.g>
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   4 — DescriptionMorph :: bland MLS blurb rewrites into polished copy
   with a quality meter + glowing caret.
   ============================================================================ */
const BLAND = '3BR house. Good location. Must see.'
const BRILLIANT = 'Sun-drenched 3-bed craftsman, steps from Magnolia Blvd — restored built-ins, a chef’s kitchen, and a lemon-tree backyard made for Sunday mornings.'
function useTypewriter(text, active, speed = 15) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active) { setN(0); return }
    setN(0); let raf, start
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
  const k = useLoopKey(5800)
  const [started, setStarted] = useState(false)
  useEffect(() => { setStarted(false); const t = setTimeout(() => setStarted(true), 650); return () => clearTimeout(t) }, [k])
  const typed = useTypewriter(BRILLIANT, started, 14)
  const done = started && typed.length === BRILLIANT.length
  const progress = started ? typed.length / BRILLIANT.length : 0
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-violet)">Draft the listing copy</VizHeader>
      <div className="relative flex-1 min-h-0 flex flex-col justify-center" style={{ gap: '9px' }}>
        <div className="flex items-start" style={{ gap: '8px' }}>
          <span className="font-sans uppercase font-bold shrink-0"
            style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>IN</span>
          <div className="font-mono" style={{ fontSize: '13.5px', lineHeight: 1.4, color: 'rgba(255,255,255,0.4)', textDecoration: started ? 'line-through' : 'none', transition: 'color .3s' }}>{BLAND}</div>
        </div>
        <div className="flex items-center" style={{ gap: '8px' }}>
          <span style={{ color: 'var(--c-violet)', fontSize: '15px' }}>↓</span>
          <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--c-violet), transparent)' }} />
          {/* quality meter */}
          <div style={{ width: '54px', height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <motion.div style={{ height: '100%', borderRadius: '3px',
              background: 'linear-gradient(90deg, var(--c-violet), var(--c-electric-soft))' }}
              animate={{ width: `${progress * 100}%` }} transition={{ ease: 'linear', duration: 0.1 }} />
          </div>
        </div>
        <div className="flex items-start" style={{ gap: '8px', minHeight: '92px' }}>
          <span className="font-sans uppercase font-bold shrink-0"
            style={{ fontSize: '10px', letterSpacing: '0.16em', color: 'var(--c-electric-soft)', marginTop: '3px' }}>AI</span>
          <div className="display-sans" style={{ fontSize: '15px', lineHeight: 1.42, color: '#fff' }}>
            {typed}
            {started && !done && (
              <motion.span aria-hidden="true" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.75, repeat: Infinity }}
                style={{ display: 'inline-block', width: '2px', height: '15px', background: 'var(--c-electric-soft)', marginLeft: '2px', transform: 'translateY(2px)', boxShadow: '0 0 8px var(--c-electric-soft)' }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================================
   5 — NeighborhoodPins :: comps drop onto a grid, radar sweep, your listing beacon
   ============================================================================ */
const PINS = [
  { x: 80,  y: 96,  hot: false },
  { x: 150, y: 156, hot: false },
  { x: 210, y: 84,  hot: true  },
  { x: 278, y: 146, hot: false },
  { x: 120, y: 206, hot: false },
  { x: 300, y: 200, hot: false }
]
export function NeighborhoodPins() {
  const k = useLoopKey(4600)
  const hot = PINS.find(p => p.hot)
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-electric)">Know your market</VizHeader>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* radar sweep (conic), masked to a soft circle around your listing */}
        <div className="absolute" style={{
          left: `${(hot.x/380)*100}%`, top: `${(hot.y/250)*100}%`, width: '150%', height: '150%',
          transform: 'translate(-50%,-50%)',
          background: 'conic-gradient(from 0deg, rgba(41,151,255,0.30), transparent 42%)',
          borderRadius: '50%', animation: 'reRadar 4.5s linear infinite',
          maskImage: 'radial-gradient(circle, #000 62%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle, #000 62%, transparent 72%)', opacity: 0.9, zIndex: 0 }} />
        <svg viewBox="0 0 380 250" className="relative w-full h-full" style={{ zIndex: 1 }} preserveAspectRatio="xMidYMid meet">
          {[...Array(6)].map((_, i) => (<line key={`v${i}`} x1={20+i*68} y1="20" x2={20+i*68} y2="238" stroke="rgba(95,182,255,0.10)" strokeWidth="1"/>))}
          {[...Array(4)].map((_, i) => (<line key={`h${i}`} x1="14" y1={36+i*62} x2="366" y2={36+i*62} stroke="rgba(95,182,255,0.10)" strokeWidth="1"/>))}

          {/* faint lines from your listing to comps */}
          {PINS.filter(p=>!p.hot).map((p,i)=>(
            <motion.line key={`ln-${k}-${i}`} x1={hot.x} y1={hot.y} x2={p.x} y2={p.y}
              stroke="var(--c-electric-soft)" strokeWidth="1" strokeDasharray="2 5"
              initial={{ opacity: 0 }} animate={{ opacity: 0.28 }} transition={{ delay: 1.4 + i*0.08, duration: 0.5 }} />
          ))}

          {PINS.map((p, i) => {
            const color = p.hot ? 'var(--c-amber)' : 'var(--c-electric-soft)'
            const r = p.hot ? 1.15 : 1
            return (
              <g key={`pin-${k}-${i}`}>
                <motion.ellipse cx={p.x} cy={p.y+2} rx="8" ry="3" fill="rgba(0,0,0,0.4)"
                  initial={{ opacity: 0, scale: 0.2 }} animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ delay: 0.45 + i*0.2 + 0.28, duration: 0.3 }} style={{ transformOrigin: `${p.x}px ${p.y}px` }}/>
                <motion.circle cx={p.x} cy={p.y} r="6" fill="none" stroke={color} strokeWidth="1.5"
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 3.4], opacity: [0.7, 0] }}
                  transition={{ duration: 1.1, delay: 0.45 + i*0.2 + 0.3, ease: 'easeOut', repeat: Infinity, repeatDelay: 2.2 }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px` }}/>
                {p.hot && <motion.circle cx={p.x} cy={p.y-20} r="14" fill="none" stroke="var(--c-amber)" strokeWidth="1.5"
                  animate={{ scale: [0.6, 2.6], opacity: [0.7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  style={{ transformOrigin: `${p.x}px ${p.y-20}px` }}/>}
                <motion.g initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 15, delay: 0.45 + i*0.2 }}
                  style={{ transformOrigin: `${p.x}px ${p.y}px`, scale: r }}>
                  <path d={`M ${p.x} ${p.y} C ${p.x-11} ${p.y-16}, ${p.x-9} ${p.y-30}, ${p.x} ${p.y-30} C ${p.x+9} ${p.y-30}, ${p.x+11} ${p.y-16}, ${p.x} ${p.y} Z`}
                    fill={color} style={{ filter: `drop-shadow(0 3px 8px color-mix(in srgb, ${color} 60%, transparent))` }}/>
                  <circle cx={p.x} cy={p.y-20} r="4.6" fill="#0A0820"/>
                </motion.g>
              </g>
            )
          })}
          <motion.text key={`tag-${k}`} x={hot.x} y={hot.y-42} textAnchor="middle"
            fontFamily="Inter Tight, sans-serif" fontSize="11" fontWeight="700" letterSpacing="1.5" fill="var(--c-amber)"
            initial={{ opacity: 0, y: hot.y-36 }} animate={{ opacity: 1, y: hot.y-42 }} transition={{ delay: 1.2, duration: 0.5 }}>
            YOUR LISTING
          </motion.text>
        </svg>
      </div>
    </div>
  )
}

/* ============================================================================
   6 — DaysOnMarket :: countdown ring depletes, then SOLD slams with shockwave
   ============================================================================ */
export function DaysOnMarket() {
  const k = useLoopKey(4800)
  const [days, setDays] = useState(24)
  const [sold, setSold] = useState(false)
  const FROM = 24, TO = 6
  useEffect(() => {
    setSold(false); setDays(FROM)
    const start = performance.now(); const dur = 1600; let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur), ease = 1 - Math.pow(1 - p, 3)
      setDays(Math.round(FROM + (TO - FROM) * ease))
      if (p < 1) raf = requestAnimationFrame(step)
      else setTimeout(() => setSold(true), 220)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [k])
  const ringPct = (days - TO) / (FROM - TO)   // 1 -> 0
  const R = 66, C = 2 * Math.PI * R
  return (
    <div className="relative w-full h-full flex flex-col" style={{ padding: '2px 0' }}>
      <VizHeader color="var(--c-coral)">Time to close</VizHeader>
      <div className="relative flex-1 min-h-0 flex items-center justify-center">
        {/* countdown ring + number */}
        <motion.div className="relative flex items-center justify-center"
          animate={{ opacity: sold ? 0.14 : 1, scale: sold ? 0.9 : 1 }} transition={{ duration: 0.4 }}>
          <svg width="168" height="168" viewBox="0 0 168 168" style={{ position: 'absolute' }}>
            <circle cx="84" cy="84" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
            <circle cx="84" cy="84" r={R} fill="none" stroke="var(--c-electric-soft)" strokeWidth="6" strokeLinecap="round"
              transform="rotate(-90 84 84)" strokeDasharray={C} strokeDashoffset={C * (1 - ringPct)}
              style={{ filter: 'drop-shadow(0 0 8px var(--c-electric-soft))', transition: 'stroke-dashoffset .1s linear' }}/>
          </svg>
          <div className="flex flex-col items-center" style={{ gap: '0' }}>
            <div className="font-mono tabular-nums display-sans" style={{ fontSize: '68px', fontWeight: 900, lineHeight: 0.9,
              letterSpacing: '-0.04em', color: 'var(--c-electric-soft)', textShadow: '0 0 30px color-mix(in srgb, var(--c-electric-soft) 45%, transparent)' }}>{days}</div>
            <div className="font-sans uppercase font-bold text-white/70" style={{ fontSize: '12px', letterSpacing: '0.24em', marginTop: '2px' }}>days on market</div>
          </div>
        </motion.div>

        {/* SOLD slam + shockwave + sparks */}
        <AnimatePresence>
          {sold && (
            <>
              <motion.div key={`shock-${k}`} className="absolute rounded-full" style={{ border: '2px solid var(--c-teal)' }}
                initial={{ width: 40, height: 40, opacity: 0.9 }} animate={{ width: 300, height: 300, opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }} />
              {[...Array(10)].map((_, i) => {
                const ang = (i / 10) * Math.PI * 2
                return <motion.span key={`sp-${k}-${i}`} className="absolute rounded-full"
                  style={{ width: '5px', height: '5px', background: 'var(--c-teal)', boxShadow: '0 0 8px var(--c-teal)' }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(ang) * 108, y: Math.sin(ang) * 108, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }} />
              })}
              <motion.div key={`sold-${k}`} className="absolute"
                initial={{ scale: 2.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -11 }} exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 14 }}
                style={{ border: '4px solid var(--c-teal)', borderRadius: '11px', padding: '7px 20px', color: 'var(--c-teal)',
                  fontFamily: 'Inter Tight, sans-serif', fontWeight: 900, fontSize: '42px', letterSpacing: '0.08em',
                  textShadow: '0 0 22px color-mix(in srgb, var(--c-teal) 55%, transparent)',
                  boxShadow: '0 0 30px color-mix(in srgb, var(--c-teal) 35%, transparent), inset 0 0 18px color-mix(in srgb, var(--c-teal) 18%, transparent)',
                  background: 'color-mix(in srgb, #0A0820 60%, transparent)' }}>
                SOLD
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
