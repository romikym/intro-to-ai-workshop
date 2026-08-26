import { motion } from 'framer-motion'
import { Droplets, HeartPulse } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import { CostMeterAnchor } from '../AnchorVisuals'

/**
 * Slide 5 — Jim. The hidden costs of AI: environmental + emotional.
 * Left: two cost cards. Right: the per-query resource meter.
 */
export default function Slide05_BeyondAI() {
  return (
    <SlideFrame>
      <SlideHeader eyebrow="What It Really Takes" title="The hidden costs." presenter="jim" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 flex-1 min-h-0 items-stretch">
        {/* LEFT: two cost cards */}
        <div className="flex flex-col justify-center" style={{ gap: 'var(--sp-5)' }}>
          <CostCard
            icon={Droplets} tone="var(--c-electric)" label="Environmental"
            headline="A machine that drinks."
            body={<>Brutally resource-intensive software. Every query burns electricity and fresh water for cooling — roughly <span className="text-white font-medium">30× a web search</span> — and the data centers keep landing in low-income communities.</>}
            delay={0.4}
          />
          <CostCard
            icon={HeartPulse} tone="var(--c-coral)" label="Emotional"
            headline="Social media hacks attention. AI hacks emotion."
            body={<>Sycophantic companions affirm whatever you say to keep you hooked — and can validate a struggling teen's worst thoughts. The safety guardrails break with one curious prompt.</>}
            delay={0.55}
          />
        </div>

        {/* RIGHT: per-query cost meter (electricity / water / compute) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="deck-card flex flex-col justify-center"
          style={{ '--card-accent': 'var(--c-amber)', minHeight: '420px', padding: '24px 28px' }}
        >
          <CostMeterAnchor />
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function CostCard({ icon: Icon, tone, label, headline, body, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="deck-card flex flex-col"
      style={{ '--card-accent': tone, padding: '22px 26px' }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: '10px' }}>
        <div className="rounded-xl flex items-center justify-center shrink-0"
             style={{ height: '42px', width: '42px', background: `color-mix(in srgb, ${tone} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${tone} 34%, transparent)` }}>
          <Icon style={{ height: '20px', width: '20px', color: tone }} />
        </div>
        <span className="font-sans uppercase font-bold" style={{ fontSize: '13px', letterSpacing: '0.22em', color: tone }}>
          {label}
        </span>
      </div>
      <div className="display-sans text-white leading-tight" style={{ fontSize: '26px', marginBottom: '8px' }}>
        {headline}
      </div>
      <div className="text-white/85 leading-snug" style={{ fontSize: '17px' }}>{body}</div>
    </motion.div>
  )
}
