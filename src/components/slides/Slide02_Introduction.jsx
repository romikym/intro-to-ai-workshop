import { motion } from 'framer-motion'
import { Brain, Cog } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'

/**
 * Slide 2 — Jim. The core frame of the whole talk: Output vs. Process.
 * Big question, a two-column protect/delegate contrast, and the Calculator Trap.
 */
export default function Slide02_Introduction() {
  return (
    <SlideFrame>
      <SlideHeader eyebrow="The Core Question" title="Output, or process?" presenter="jim" />

      <div className="flex flex-col flex-1 min-h-0" style={{ gap: 'var(--sp-6)' }}>
        {/* Lead + big question */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <div className="text-white/80" style={{ fontSize: 'var(--fs-lead)', lineHeight: 1.4 }}>
            Generative AI is an amazing tool — <span className="text-white">used correctly.</span> Before every task, ask one question:
          </div>
          <div className="display-sans text-white leading-tight" style={{ fontSize: 'var(--fs-h3)', marginTop: 'var(--sp-3)' }}>
            Am I using it for{' '}
            <span className="display-serif" style={{ fontStyle: 'italic', color: 'var(--c-teal)' }}>process</span>
            {' '}— or{' '}
            <span className="display-serif gradient-sunset" style={{ fontStyle: 'italic' }}>output?</span>
          </div>
        </motion.div>

        {/* Two-column contrast */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <Side icon={Brain} tone="teal" verdict="Protect it"
            label="Process — the thinking is the point"
            headline="Do it yourself."
            items={['Critical thinking', 'Your voice', 'Real understanding of the work']}
            delay={0.55} />
          <Side icon={Cog} tone="amber" verdict="Delegate it"
            label="Output — the destination is all that matters"
            headline="Hand it to the machine."
            items={['Formatting & reformatting data', 'Standard vendor emails', 'Summaries, lists, itineraries']}
            delay={0.7} />
        </div>

        {/* Calculator Trap footer */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="border-t border-white/10 flex items-baseline gap-3"
          style={{ paddingTop: 'var(--sp-5)' }}
        >
          <span className="font-sans uppercase font-bold shrink-0"
                style={{ fontSize: '14px', letterSpacing: '0.22em', color: 'var(--c-coral)' }}>
            The Calculator Trap
          </span>
          <span className="text-white/85 flex-1 min-w-0" style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 1.4 }}>
            A calculator does the tedious math so you can think. Gen-AI does the{' '}
            <span className="text-white">thinking</span> — and leaves you with nothing to do.
          </span>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function Side({ icon: Icon, tone, verdict, label, headline, items, delay }) {
  const c = tone === 'teal' ? 'var(--c-teal)' : 'var(--c-amber)'
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="deck-card flex flex-col"
      style={{ '--card-accent': c, padding: '22px 26px' }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
        <div className="flex items-center gap-3">
          <div className="rounded-xl flex items-center justify-center shrink-0"
               style={{ height: '42px', width: '42px', background: `color-mix(in srgb, ${c} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${c} 34%, transparent)` }}>
            <Icon style={{ height: '20px', width: '20px', color: c }} />
          </div>
          <span className="font-sans uppercase font-bold"
                style={{ fontSize: '13px', letterSpacing: '0.16em', color: c, maxWidth: '15ch' }}>
            {label}
          </span>
        </div>
      </div>
      <div className="display-sans text-white leading-tight" style={{ fontSize: '30px', marginBottom: '12px' }}>
        {headline}
      </div>
      <ul className="text-white/90 leading-snug" style={{ fontSize: '18px' }}>
        {items.map((x, i) => (
          <li key={i} className="flex gap-2.5" style={{ marginBottom: '5px' }}>
            <span style={{ color: c }} className="mt-0.5">·</span><span>{x}</span>
          </li>
        ))}
      </ul>
      <div className="font-sans uppercase font-bold" style={{ marginTop: '14px', fontSize: '13px', letterSpacing: '0.2em', color: c }}>
        → {verdict}
      </div>
    </motion.div>
  )
}
