import { motion } from 'framer-motion'

/**
 * TronGrid — the persistent atmospheric backdrop for the deck.
 *
 *   "The Grid. A digital frontier. I tried to picture clusters of
 *    information as they moved through the computer."
 *      — Kevin Flynn, TRON: Legacy
 *
 * What you see:
 *   - A perspective grid floor (electric blue) marching toward the viewer
 *   - A mirrored ceiling grid (violet) marching away
 *   - A horizon glow line that breathes
 *   - Two "light cycles" — luminous streaks racing along the horizon,
 *     one electric blue, one violet, on different timings
 *   - A soft atmospheric aura behind the horizon
 *
 * All pure CSS — no canvas, no WebGL, no Three.js. GPU-accelerated
 * via transform + will-change. Cheaper than the previous WebGL sphere.
 *
 * Props:
 *   intensity (0–1) — overall opacity multiplier (per-slide tuning)
 *   variant   — 'wide' | 'focus' — focus dims the grid for content-heavy slides
 */
export default function TronGrid({ intensity = 1, variant = 'wide' }) {
  const opacity = variant === 'focus' ? intensity * 0.55 : intensity
  return (
    <motion.div
      className="tron-stage"
      style={{ opacity }}
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {/* Soft colored aura behind the horizon */}
      <div className="tron-aura" />

      {/* Perspective floor grid — marching toward viewer */}
      <div className="tron-floor" />

      {/* Mirrored ceiling grid — marching away */}
      <div className="tron-ceiling" />

      {/* The horizon line itself — pulsing */}
      <div className="tron-horizon" />

      {/* Two light cycles racing across the horizon */}
      <div className="tron-lightcycle" />
      <div className="tron-lightcycle alt" />

      {/* A few scattered "system nodes" — pulsing dots that hint at
          a deeper network underneath */}
      <Nodes />
    </motion.div>
  )
}

function Nodes() {
  // Hand-placed positions so they feel composed, not random
  const nodes = [
    { x: '12%', y: '42%', color: 'var(--c-electric)', delay: '0s', size: 6 },
    { x: '88%', y: '58%', color: 'var(--c-violet)', delay: '1.4s', size: 5 },
    { x: '28%', y: '64%', color: 'var(--c-electric-soft)', delay: '2.6s', size: 4 },
    { x: '74%', y: '38%', color: 'var(--c-amber)', delay: '0.8s', size: 5 },
    { x: '50%', y: '52%', color: 'var(--c-electric)', delay: '3.4s', size: 7 }
  ]
  return (
    <>
      {nodes.map((n, i) => (
        <span
          key={i}
          className="tron-node"
          style={{
            position: 'absolute',
            left: n.x,
            top: n.y,
            width: `${n.size}px`,
            height: `${n.size}px`,
            borderRadius: '999px',
            background: n.color,
            boxShadow: `0 0 12px ${n.color}, 0 0 24px ${n.color}`,
            opacity: 0.85,
            animation: `pulse-glow 3s ease-in-out infinite`,
            animationDelay: n.delay
          }}
        />
      ))}
    </>
  )
}
