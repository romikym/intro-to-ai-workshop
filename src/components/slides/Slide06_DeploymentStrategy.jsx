import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'

/**
 * Slide 6 — Deployment Strategy.
 * Argument on top, AI Philosophy doc as a full-width card below with
 * a 3-column policy grid so no wasted space on the right.
 */
export default function Slide06_DeploymentStrategy() {
  return (
    <SlideFrame>
      <SlideHeader
        eyebrow="Deployment Strategy"
        title="One page first."
        presenter="jim"
      />

      <div className="flex flex-col flex-1 min-h-0" style={{ gap: 'var(--sp-7)' }}>
        {/* Top: punchline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="display-sans text-white leading-tight max-w-5xl"
          style={{ fontSize: 'var(--fs-h4)' }}
        >
          Don't buy a single AI license{' '}
          <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>until</span>{' '}
          you've written a one-page{' '}
          <span className="display-serif" style={{ fontStyle: 'italic' }}>AI Philosophy</span>{' '}
          for your team.
        </motion.div>

        {/* AI Philosophy card — full width, 3-column policy grid */}
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
              <FileText className="h-7 w-7 text-accent-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-sans uppercase font-bold text-white/65"
                   style={{ fontSize: '14px', letterSpacing: '0.22em' }}>
                Internal Policy
              </div>
              <div className="display-sans text-white leading-tight"
                   style={{ fontSize: 'var(--fs-h4)' }}>
                AI Philosophy
              </div>
            </div>
            <div className="hidden lg:block text-white/55 italic font-serif text-right"
                 style={{ fontSize: '17px' }}>
              One page.<br />
              Approved before any tool is purchased.
            </div>
          </div>

          {/* Three policy columns side-by-side — no wasted right space */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <PolicySection
              tone="ok"
              title="Allowed"
              items={[
                'Internal docs & meeting recaps',
                'Brainstorming with human edit',
                'Summarizing long PDFs'
              ]}
              delay={0.9}
            />
            <PolicySection
              tone="review"
              title="Requires Human Review"
              items={[
                'Customer-facing communication',
                'Marketing copy & brand voice',
                'Anything externally published'
              ]}
              delay={1.05}
            />
            <PolicySection
              tone="prohibited"
              title="Prohibited"
              items={[
                'Legal & financial decisions',
                'Confidential client data',
                'Final contracts & terms'
              ]}
              delay={1.2}
            />
          </div>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function PolicySection({ tone, title, items, delay }) {
  const tones = {
    ok:         { dot: 'var(--c-teal)',  label: 'rgba(0, 199, 190, 1)' },
    review:     { dot: 'var(--c-amber)', label: 'rgba(245, 166, 35, 1)' },
    prohibited: { dot: 'var(--c-coral)', label: 'rgba(255, 55, 95, 1)' }
  }
  const t = tones[tone] || tones.ok
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className="font-sans uppercase font-bold inline-flex items-center gap-2.5 mb-3"
           style={{ fontSize: '15px', letterSpacing: '0.2em', color: t.label }}>
        <span className="h-2.5 w-2.5 rounded-full"
              style={{ background: t.dot, boxShadow: `0 0 12px ${t.dot}` }} />
        {title}
      </div>
      <div className="flex flex-col" style={{ gap: '8px' }}>
        {items.map((item, j) => (
          <div key={j} className="flex gap-2.5 text-white/90 leading-snug"
               style={{ fontSize: '20px' }}>
            <span className="text-white/40">·</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
