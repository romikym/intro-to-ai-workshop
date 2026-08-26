import { motion } from 'framer-motion'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import {
  LifecycleTimeline,
  ContentFanOut,
  DescriptionMorph,
  CompsPrice,
  NeighborhoodPins,
  DaysOnMarket
} from '../RealEstateVisuals'

/**
 * Part 2 showcase — "AI in Real Estate, in action."
 * A 3x2 grid of live anchor visuals, each demonstrating one realtor use case.
 */
const TILES = [
  { Viz: LifecycleTimeline, accent: 'var(--c-electric-soft)' },
  { Viz: ContentFanOut,     accent: 'var(--c-amber)' },
  { Viz: DescriptionMorph,  accent: 'var(--c-violet)' },
  { Viz: CompsPrice,        accent: 'var(--c-teal)' },
  { Viz: NeighborhoodPins,  accent: 'var(--c-electric)' },
  { Viz: DaysOnMarket,      accent: 'var(--c-coral)' }
]

/** Glowing L-brackets in each corner of a tile. */
function CornerBrackets({ color }) {
  const base = { position: 'absolute', width: '16px', height: '16px', pointerEvents: 'none', opacity: 0.7,
    filter: `drop-shadow(0 0 4px color-mix(in srgb, ${color} 60%, transparent))` }
  const stroke = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round' }
  return (
    <>
      <svg style={{ ...base, top: 8, left: 8 }} viewBox="0 0 16 16"><path d="M1 6 V1 H6" style={stroke}/></svg>
      <svg style={{ ...base, top: 8, right: 8 }} viewBox="0 0 16 16"><path d="M15 6 V1 H10" style={stroke}/></svg>
      <svg style={{ ...base, bottom: 8, left: 8 }} viewBox="0 0 16 16"><path d="M1 10 V15 H6" style={stroke}/></svg>
      <svg style={{ ...base, bottom: 8, right: 8 }} viewBox="0 0 16 16"><path d="M15 10 V15 H10" style={stroke}/></svg>
    </>
  )
}

export default function Slide15_RealEstate() {
  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="AI in Real Estate"
        title={<>See it <em className="gradient-text italic">in action.</em></>}
        presenter="romik"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 flex-1 min-h-0">
        {TILES.map(({ Viz, accent }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="deck-card relative flex flex-col overflow-hidden"
            style={{ '--card-accent': accent, padding: '15px 18px', minHeight: 0,
              boxShadow: `0 18px 44px -22px color-mix(in srgb, ${accent} 55%, transparent)` }}
          >
            {/* bottom accent glow */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%', pointerEvents: 'none',
              background: `radial-gradient(ellipse at 50% 120%, color-mix(in srgb, ${accent} 18%, transparent), transparent 70%)` }} />
            {/* moving sheen */}
            <span className="re-sheen" style={{ animationDelay: `${i * 0.9}s` }} />
            <CornerBrackets color={accent} />
            <div className="relative" style={{ zIndex: 2, height: '100%' }}>
              <Viz />
            </div>
          </motion.div>
        ))}
      </div>
    </SlideFrame>
  )
}
