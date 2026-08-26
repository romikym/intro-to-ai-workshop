import { motion } from 'framer-motion'
import { PenLine } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'

/**
 * Slide 6 — Jim's closing rule: The Blank Page Boundary.
 * Punchline on top; a "rules of use" card with three numbered boundaries.
 */
export default function Slide06_DeploymentStrategy() {
  return (
    <SlideFrame>
      <SlideHeader eyebrow="The Rule" title="The blank-page boundary." presenter="jim" />

      <div className="flex flex-col flex-1 min-h-0" style={{ gap: 'var(--sp-7)' }}>
        {/* Top: punchline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="display-sans text-white leading-tight max-w-5xl"
          style={{ fontSize: 'var(--fs-h4)' }}
        >
          Use AI as an editor —{' '}
          <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>never</span>{' '}
          an author. Protect the friction that makes you{' '}
          <span className="display-serif" style={{ fontStyle: 'italic' }}>better</span>.
        </motion.div>

        {/* Rules card — full width, 3 numbered boundaries */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="deck-card flex flex-col"
          style={{ '--card-accent': 'var(--c-electric)' }}
        >
          {/* Doc header */}
          <div className="flex items-center gap-4 pb-5 border-b border-white/15"
               style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/10 border border-accent-cyan/25 flex items-center justify-center shrink-0">
              <PenLine className="h-7 w-7 text-accent-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-sans uppercase font-bold text-white/65"
                   style={{ fontSize: '14px', letterSpacing: '0.22em' }}>
                Rules of Use
              </div>
              <div className="display-sans text-white leading-tight"
                   style={{ fontSize: 'var(--fs-h4)' }}>
                Three boundaries
              </div>
            </div>
            <div className="hidden lg:block text-white/55 italic font-serif text-right"
                 style={{ fontSize: '17px' }}>
              The heaviest lifting is the<br />blank page. Keep it.
            </div>
          </div>

          {/* Three numbered rules side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Rule
              n="01" color="var(--c-teal)"
              title="Never write Draft Zero"
              items={[
                'Editor, formatter, sounding board — yes',
                'The blank page is yours',
                'Organizing chaos into a start is the real work'
              ]}
              delay={0.9}
            />
            <Rule
              n="02" color="var(--c-amber)"
              title="Never synthesize for you"
              items={[
                'It gathers facts & retrieves data',
                'It never draws your conclusion',
                '“What does this data mean?” is your job'
              ]}
              delay={1.05}
            />
            <Rule
              n="03" color="var(--c-electric-soft)"
              title="Own every output"
              items={[
                'Explain the logic',
                'Explain the process',
                'Explain the accuracy — to a human'
              ]}
              delay={1.2}
            />
          </div>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function Rule({ n, color, title, items, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: '10px' }}>
        <span className="font-mono font-bold inline-flex items-center px-2.5 py-1 rounded"
              style={{ fontSize: '14px', color, background: `color-mix(in srgb, ${color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 34%, transparent)` }}>
          {n}
        </span>
        <span className="display-sans text-white leading-tight" style={{ fontSize: '22px' }}>
          {title}
        </span>
      </div>
      <div className="flex flex-col" style={{ gap: '8px' }}>
        {items.map((item, j) => (
          <div key={j} className="flex gap-2.5 text-white/90 leading-snug" style={{ fontSize: '18px' }}>
            <span style={{ color }}>·</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
