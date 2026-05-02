import { motion } from 'framer-motion'
import { Bot, Users } from 'lucide-react'
import SlideFrame, { SlideHeader } from '../SlideFrame'
import { FactsCarousel } from '../AnchorVisuals'

/**
 * Slide 5 — Beyond AI / Burbank advantage.
 * Layout: header → two compare cards (bumped text) → fact carousel
 * (concrete statistic that reinforces the thesis) → closer.
 */
export default function Slide05_BeyondAI() {
  return (
    <SlideFrame>
      <SlideHeader eyebrow="Beyond AI · Back to Basics" title="The Burbank advantage." presenter="jim" />

      <div className="flex flex-col flex-1 min-h-0" style={{ gap: 'var(--sp-5)' }}>
        {/* Two-column compare — bumped +2pt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          <Side
            icon={Bot}
            tone="coral"
            label="The race to the bottom"
            headline="Cheap, synthetic AI spam."
            items={['SEO is dying', 'Digital trust plummeting', 'Content prices crashing']}
            delay={0.4}
          />
          <Side
            icon={Users}
            tone="electric"
            label="The premium good"
            headline={<>Authentic local connection — a <span className="display-serif gradient-electric" style={{ fontStyle: 'italic' }}>premium</span> commodity.</>}
            items={['Physical storefronts', 'Local partnerships', 'Community hubs & events']}
            delay={0.55}
          />
        </div>

        {/* Anchor visual — concrete fact carousel BELOW the cards */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="deck-card flex items-center"
          style={{ '--card-accent': 'var(--c-electric)', height: '160px', padding: '0' }}
        >
          <FactsCarousel />
        </motion.div>

        {/* Closer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="text-center"
        >
          <div className="display-serif text-white/95"
               style={{ fontSize: '32px', fontStyle: 'italic', lineHeight: 1.1 }}>
            You cannot automate a handshake.
          </div>
        </motion.div>
      </div>
    </SlideFrame>
  )
}

function Side({ icon: Icon, tone, label, headline, items, delay }) {
  const colors = {
    coral:    { c: 'var(--c-coral)',    bullet: '—' },
    electric: { c: 'var(--c-electric)', bullet: '+' }
  }
  const t = colors[tone] || colors.electric
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7 }}
      className="deck-card flex flex-col"
      style={{ '--card-accent': t.c, padding: '22px 26px' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon style={{ color: t.c, height: '22px', width: '22px' }} />
        <span className="font-sans uppercase font-bold"
              style={{ fontSize: '15px', letterSpacing: '0.22em', color: t.c }}>
          {label}
        </span>
      </div>
      <div className="display-sans text-white leading-tight"
           style={{ fontSize: '30px', marginBottom: '12px' }}>
        {headline}
      </div>
      <ul className="text-white/95 leading-snug" style={{ fontSize: '19px' }}>
        {items.map((x, i) => (
          <li key={i} className="flex gap-2.5" style={{ marginBottom: '5px' }}>
            <span style={{ color: t.c }} className="mt-0.5">{t.bullet}</span>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
