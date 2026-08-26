import { motion } from 'framer-motion'
import { Brain, Dumbbell, Compass } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import { SkillAtrophyAnchor } from '../AnchorVisuals'

export default function Slide04_WorkforceReadiness() {
  return (
    <SlideFrame>
      <SlideHeader eyebrow="Where the Value Lives" title="Helicopter vs. the hike." presenter="jim" />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-10 flex-1 min-h-0 items-center">
        {/* LEFT: anchor visual — auto-cycling score ring */}
        <div className="deck-card flex items-center justify-center"
             style={{ '--card-accent': 'var(--c-teal)', minHeight: '360px' }}>
          <SkillAtrophyAnchor />
        </div>

        {/* RIGHT: punchline + 3 stacked points */}
        <div className="flex flex-col justify-center" style={{ gap: 'var(--sp-6)' }}>
          <div
            className="display-sans text-white leading-tight"
            style={{ fontSize: 'var(--fs-h4)' }}
          >
            AI is a helicopter to the summit — you get the{' '}
            <span className="display-serif" style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>view</span>{' '}
            instantly, and build{' '}
            <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>zero muscle</span>.
          </div>

          <div className="flex flex-col" style={{ gap: 'var(--sp-4)' }}>
            <Bullet icon={Compass} title="The value is the climb" body="Brainstorming, structuring an argument, taking feedback, the friction of revision." />
            <Bullet icon={Dumbbell} title="Skip it, skip the growth" body="Outsource the struggle and the muscle for real thinking atrophies." />
            <Bullet icon={Brain}     title="The Assembly Line" body="Spreadsheets, vendor emails, HOA docs — no character built there. That's where AI belongs." />
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}

function Bullet({ icon: Icon, title, body }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4"
    >
      <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-accent-cyan/15 to-accent-blue/5 border border-accent-cyan/25 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-accent-cyan" />
      </div>
      <div>
        <div className="display-sans text-white leading-tight"
             style={{ fontSize: '24px', marginBottom: '5px' }}>
          {title}
        </div>
        <div className="text-white/85 leading-snug" style={{ fontSize: '19px' }}>{body}</div>
      </div>
    </motion.div>
  )
}
