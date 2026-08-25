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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="deck-card flex flex-col overflow-hidden"
            style={{ '--card-accent': accent, padding: '16px 18px', minHeight: 0 }}
          >
            <Viz />
          </motion.div>
        ))}
      </div>
    </SlideFrame>
  )
}
