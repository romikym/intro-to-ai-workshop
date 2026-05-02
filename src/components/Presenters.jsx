import { motion } from 'framer-motion'
import { PRESENTERS } from '../lib/presenters'

/**
 * Compact presenter chip — used in the top-right of content slides.
 * Replaces the previous text-only attribution.
 */
export function PresenterChip({ presenterId }) {
  const p = PRESENTERS[presenterId]
  if (!p) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="flex items-center gap-4"
    >
      {/* Avatar with cyan ring */}
      <div className="relative shrink-0">
        <div className="absolute inset-[-2px] rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue opacity-80" />
        <div className="relative h-14 w-14 rounded-full overflow-hidden bg-ink-800 ring-1 ring-ink-950">
          <img
            src={p.photo}
            alt={p.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: presenterId === 'romik' ? 'center 25%' : 'center 30%' }}
          />
        </div>
      </div>

      <div className="text-right">
        <div className="text-base lg:text-lg font-semibold text-white/95 leading-tight">{p.name}</div>
        <div className="text-sm text-white/50 mt-0.5">{p.role} · {p.company}</div>
      </div>
    </motion.div>
  )
}

/**
 * Big presenter card — used on title and closing slides.
 * Shows large headshot + name + company + the company logo below.
 */
export function PresenterCard({ presenterId, delay = 0, align = 'center' }) {
  const p = PRESENTERS[presenterId]
  if (!p) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col items-${align} gap-5`}
    >
      {/* Large circular headshot with cyan gradient ring */}
      <div className="relative">
        {/* Glow halo */}
        <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-accent-cyan/30 to-accent-indigo/20 blur-2xl" />
        {/* Gradient ring */}
        <div className="absolute inset-[-3px] rounded-full bg-gradient-to-br from-accent-cyan via-accent-blue to-accent-indigo" />
        {/* Photo */}
        <div className="relative h-32 w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden bg-ink-800 ring-2 ring-ink-950">
          <img
            src={p.photo}
            alt={p.name}
            className="h-full w-full object-cover"
            style={{ objectPosition: presenterId === 'romik' ? 'center 25%' : 'center 30%' }}
          />
        </div>
      </div>

      {/* Name + role */}
      <div className={`text-${align}`}>
        <div className="font-serif text-2xl lg:text-3xl text-white/95 leading-tight">{p.name}</div>
        <div className="text-base text-white/55 mt-1">{p.role}</div>
      </div>

      {/* Company logo tile */}
      <div className="h-10 lg:h-12 flex items-center justify-center mt-1">
        <img
          src={p.logo}
          alt={p.company}
          className="max-h-full max-w-[180px] lg:max-w-[220px] object-contain"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))'
          }}
        />
      </div>
    </motion.div>
  )
}
