import { motion } from 'framer-motion'
import { PillarFlowAnchor } from '../AnchorVisuals'

/**
 * Slide 7 — Part 2 opener.
 * Three pillars matching the slides that actually follow (in order):
 *   Slide 8 → Models
 *   Slide 9 → Tools (What AI Can Do)
 *   Slide 10 → Action (Start This Week)
 */
const pillars = [
  { n: '01', title: 'The Assistants',  tagline: 'The main AI helpers.',       body: 'Claude, ChatGPT, Gemini, Copilot, Perplexity — the best fit for each real estate task.',     accent: 'var(--c-electric-soft)' },
  { n: '02', title: 'Tools',   tagline: 'What AI can actually do.',  body: 'Six concrete things AI does for a real estate practice today.', accent: 'var(--c-electric)' },
  { n: '03', title: 'Action',  tagline: 'Start this week.',          body: 'A simple 5-step plan to put AI to work in your real estate business by Friday.',        accent: 'var(--c-amber)' }
]

export default function Slide07_AIForSmallBusiness() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 sm:px-16 pt-8 z-10">
        <div className="w-full max-w-[1500px] flex flex-col" style={{ gap: 'var(--sp-5)' }}>
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 font-sans uppercase font-bold text-accent-cyan"
                 style={{ fontSize: '14px', letterSpacing: '0.4em' }}>
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-accent-cyan/60" />
              Part Two — Romik Hacobian
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-accent-cyan/60" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans display-sans gradient-text-bright text-center leading-[1.0] tracking-tight"
            style={{ fontSize: '92px', paddingBottom: '0.06em' }}
          >
            AI for{' '}
            <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>
              Real Estate.
            </span>
          </motion.h2>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.7 }}
            className="text-center text-white/85 max-w-3xl mx-auto"
            style={{ fontSize: '24px' }}
          >
            Where to start, what tools to use, and how to save hours on every listing — by Friday.
          </motion.p>

          {/* Anchor visual — 3-node light pulse */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <PillarFlowAnchor />
          </motion.div>

          {/* 3 pillar cards — order matches the slides that follow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="deck-card flex flex-col"
                style={{ '--card-accent': p.accent, padding: '24px 26px' }}
              >
                {/* Number badge */}
                <div className="font-mono font-bold inline-flex items-center px-2.5 py-1 rounded self-start"
                     style={{
                       fontSize: '14px',
                       backgroundColor: `color-mix(in srgb, ${p.accent} 14%, transparent)`,
                       color: p.accent,
                       border: `1px solid color-mix(in srgb, ${p.accent} 36%, transparent)`,
                       marginBottom: '12px'
                     }}>
                  {p.n}
                </div>

                {/* Title */}
                <div className="display-sans text-white leading-[1.05]"
                     style={{ fontSize: '40px', marginBottom: '10px' }}>
                  {p.title}
                </div>

                {/* Tagline */}
                <div className="display-serif text-white/95 leading-snug"
                     style={{ fontSize: '22px', fontStyle: 'italic', marginBottom: '14px' }}>
                  {p.tagline}
                </div>

                {/* Hairline */}
                <div className="bg-white/12" style={{ height: '1px', marginBottom: '12px' }} />

                {/* Body */}
                <div className="text-white/90 leading-snug" style={{ fontSize: '19px' }}>
                  {p.body}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
