import { motion } from 'framer-motion'
import { PresenterChip } from './Presenters'

/**
 * SlideFrame — content layout inside the universal slide-canvas safe zone.
 *
 * The canvas (in App.jsx) already reserves the bottom 150 design pixels for
 * the navigation chrome and clips any overflow. SlideFrame just sets the
 * inner horizontal/top padding and lays out children top-to-bottom.
 */
export default function SlideFrame({ children, className = '' }) {
  return (
    <div
      className={`w-full h-full flex flex-col ${className}`}
      style={{
        padding: 'var(--slide-pad-top) var(--slide-pad-x) var(--sp-7)',
        overflow: 'hidden'
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  )
}

export function SlideHeader({ eyebrow, title, presenter, align = 'left' }) {
  return (
    <div className={`flex items-start ${align === 'center' ? 'justify-center text-center' : 'justify-between'} gap-6`}
         style={{ marginBottom: 'var(--sp-7)' }}>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`flex-1 min-w-0 ${align === 'center' ? 'text-center' : ''}`}
      >
        {eyebrow && (
          <div className="text-stage-eyebrow font-sans" style={{ color: 'var(--c-electric)', marginBottom: 'var(--sp-3)' }}>
            {eyebrow}
          </div>
        )}
        <h2 className="font-sans display-sans text-stage-h2 gradient-text-bright">
          {title}
        </h2>
      </motion.div>

      {presenter && align !== 'center' && <PresenterChip presenterId={presenter} />}
    </div>
  )
}

export function PointCard({ children, delay = 0, accent }) {
  const accents = {
    cyan: 'var(--c-electric)', blue: 'var(--c-electric-soft)',
    violet: 'var(--c-violet)', amber: 'var(--c-amber)',
    teal: 'var(--c-teal)', coral: 'var(--c-coral)', gold: 'var(--c-gold)'
  }
  const accentColor = accents[accent] || 'var(--c-electric)'
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="deck-card h-full"
      style={{ '--card-accent': accentColor }}
    >
      {children}
    </motion.div>
  )
}

export function Accent({ children, gradient = 'electric' }) {
  const cls = gradient === 'sunset' ? 'gradient-sunset' : 'gradient-electric'
  return (
    <em className={`display-serif ${cls}`} style={{ fontStyle: 'italic' }}>
      {children}
    </em>
  )
}
