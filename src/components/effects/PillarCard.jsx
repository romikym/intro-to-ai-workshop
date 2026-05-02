import { motion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { THEMES } from './GradientMesh'

/**
 * PillarCard — unified glass card. Sizes bumped so audience can read
 * card text from across the room.
 */
export default function PillarCard({
  number, title, tagline, body, checklist = [], cta, onClick,
  theme = 'cyan', delay = 0, size = 'md', showArrow = true
}) {
  const config = THEMES[theme] || THEMES.cyan

  const sizes = {
    sm: {
      titleSize: 'text-3xl lg:text-4xl',     // was text-xl/2xl
      taglineSize: 'text-xl lg:text-2xl',     // was text-sm/base
      bodySize: 'text-lg',                    // was text-sm
      pad: 'p-5 lg:p-6'
    },
    md: {
      titleSize: 'text-3xl lg:text-4xl',
      taglineSize: 'text-xl lg:text-2xl',
      bodySize: 'text-lg lg:text-xl',
      pad: 'p-6 lg:p-7'
    },
    lg: {
      titleSize: 'text-4xl lg:text-5xl',
      taglineSize: 'text-2xl lg:text-3xl',
      bodySize: 'text-xl',
      pad: 'p-7 lg:p-8'
    }
  }[size]

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className={`deck-card group h-full flex flex-col ${onClick ? 'is-clickable' : ''} ${sizes.pad}`}
      style={{ '--card-accent': config.accent }}
    >
      {/* Top row: number badge + arrow */}
      <div className="flex items-start justify-between mb-4">
        {number ? (
          <div
            className="font-mono font-bold px-2.5 py-1 rounded-md inline-flex items-center"
            style={{
              fontSize: '14px',
              backgroundColor: `${config.accent}14`,
              color: config.accent,
              border: `1px solid ${config.accent}30`
            }}
          >
            {number}
          </div>
        ) : <span />}

        {showArrow && (
          <ArrowUpRight
            className="h-5 w-5 transition opacity-50 group-hover:opacity-100 shrink-0"
            style={{ color: config.accent }}
          />
        )}
      </div>

      {title && (
        <h3 className={`display-sans ${sizes.titleSize} text-white leading-[1.05] tracking-tight mb-3`}>
          {title}
        </h3>
      )}

      {(tagline || body || checklist.length > 0) && (
        <div className="h-px bg-white/12 my-3" />
      )}

      {tagline && (
        <div className={`display-serif ${sizes.taglineSize} text-white/95 leading-snug mb-3`} style={{ fontStyle: 'italic' }}>
          {tagline}
        </div>
      )}

      {body && (
        <p className={`${sizes.bodySize} text-white/85 leading-relaxed mb-4`}>
          {body}
        </p>
      )}

      {checklist.length > 0 && (
        <ul className="space-y-2 mb-3">
          {checklist.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.35 + i * 0.06, duration: 0.4 }}
              className="flex items-start gap-2.5"
            >
              <div
                className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${config.accent}1A`,
                  border: `1px solid ${config.accent}40`
                }}
              >
                <Check className="h-3 w-3" style={{ color: config.accent }} strokeWidth={3} />
              </div>
              <span className="text-white/85 text-base leading-snug">{item}</span>
            </motion.li>
          ))}
        </ul>
      )}

      {cta && (
        <div className="mt-auto pt-4 border-t border-white/12">
          <div
            className="inline-flex items-center gap-2 font-semibold transition-all group-hover:gap-3"
            style={{ color: config.accent, fontSize: '16px' }}
          >
            {cta}
            <span className="transition-transform">→</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
