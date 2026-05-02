import { motion } from 'framer-motion'

/**
 * Timeline — animated horizontal step flow.
 * Each node has a number, title, body. Connected by an animated gradient line
 * that draws in as the slide enters.
 *
 * Props:
 *   steps: [{ n, title, body, accent? }]
 *   delayBase: number — when to start the entrance animation (s)
 */
export default function Timeline({ steps, delayBase = 0.4 }) {
  return (
    <div className="relative w-full">
      {/* The connecting line — draws in horizontally from left to right */}
      <div className="absolute top-[26px] left-[5%] right-[5%] h-px overflow-hidden">
        <motion.div
          className="h-full origin-left"
          style={{
            background: 'linear-gradient(90deg, rgba(34, 211, 238, 0.6) 0%, rgba(99, 102, 241, 0.5) 100%)',
            boxShadow: '0 0 8px rgba(34, 211, 238, 0.4)'
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delayBase, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* The step nodes */}
      <div className="relative grid grid-cols-5 gap-4 lg:gap-6">
        {steps.map((step, i) => (
          <TimelineNode
            key={step.n}
            {...step}
            index={i}
            isLast={i === steps.length - 1}
            delay={delayBase + 0.4 + i * 0.18}
          />
        ))}
      </div>
    </div>
  )
}

function TimelineNode({ n, title, body, accent, delay, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center text-center px-2"
    >
      {/* Outer pulsing ring (only on accent step) */}
      {accent && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border border-accent-cyan"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ delay: delay + 0.6, duration: 2.5, repeat: Infinity }}
        />
      )}

      {/* Node circle */}
      <div
        className={`relative h-14 w-14 rounded-full flex items-center justify-center font-serif text-xl mb-5 ${
          accent
            ? 'bg-gradient-to-br from-accent-cyan to-accent-indigo text-white shadow-lg shadow-accent-cyan/40'
            : 'bg-ink-800 border border-white/15 text-white/80'
        }`}
        style={{ zIndex: 2 }}
      >
        {n}
      </div>

      {/* Title */}
      <div className={`font-serif text-lg lg:text-xl mb-2 leading-tight ${accent ? 'text-white' : 'text-white/90'}`}>
        {title}
      </div>

      {/* Body */}
      <div className="text-sm lg:text-base text-white/55 leading-relaxed">{body}</div>
    </motion.div>
  )
}
