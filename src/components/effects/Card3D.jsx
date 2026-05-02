import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

/**
 * Card3D — mouse-tracking 3D perspective tilt with a cursor-following glare highlight.
 *
 * Wrap any content. The card subtly tilts toward the cursor (max ~10deg) and shows
 * a soft white gradient glare following the cursor position.
 *
 * Props:
 *   intensity: number (0-1, default 1) — multiplier for tilt amount
 *   glare: boolean (default true) — show the glare overlay
 *   className, style, onClick — passed through
 */
export default function Card3D({
  children,
  intensity = 1,
  glare = true,
  className = '',
  style = {},
  onClick,
  ...rest
}) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    // -1 to 1
    const nx = px * 2 - 1
    const ny = py * 2 - 1
    // Max 8deg tilt in either direction
    const rotateY = nx * 8 * intensity
    const rotateX = -ny * 8 * intensity
    setTransform(`perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`)
    setGlarePos({ x: px * 100, y: py * 100, opacity: 0.12 })
  }, [intensity])

  const handleLeave = useCallback(() => {
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)')
    setGlarePos((g) => ({ ...g, opacity: 0 }))
  }, [])

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`relative ${className}`}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform',
        ...style
      }}
      {...rest}
    >
      {children}
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{
            opacity: glarePos.opacity,
            transition: 'opacity 0.3s ease',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.5), transparent 40%)`,
            mixBlendMode: 'overlay'
          }}
        />
      )}
    </motion.div>
  )
}
