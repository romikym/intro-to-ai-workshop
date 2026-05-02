import { useEffect, useRef } from 'react'

/**
 * AmbientParticles — A canvas of small drifting particles that creates depth.
 *
 * Particles slowly drift upward with subtle horizontal sway. Some twinkle.
 * Lightweight — uses requestAnimationFrame, capped to 60fps, with reduced
 * particle counts on smaller viewports.
 */
export default function AmbientParticles({
  count = 60,
  className = '',
  colors = ['#22D3EE', '#3B82F6', '#6366F1']
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Reduce count on small screens
    const actualCount = width < 600 ? Math.floor(count * 0.5) : count

    // Initialize particles
    const particles = Array.from({ length: actualCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.6 + Math.random() * 1.6,
      vy: -(0.05 + Math.random() * 0.15),
      vx: (Math.random() - 0.5) * 0.05,
      color: colors[Math.floor(Math.random() * colors.length)],
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      baseOpacity: 0.15 + Math.random() * 0.4
    }))

    let lastTime = 0
    const targetFPS = 60
    const frameDuration = 1000 / targetFPS

    function animate(time) {
      if (time - lastTime < frameDuration) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = time

      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        // Move
        p.y += p.vy
        p.x += p.vx
        p.twinklePhase += p.twinkleSpeed

        // Wrap to bottom when going off top
        if (p.y < -10) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        // Side wrap
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10

        // Twinkle
        const twinkle = (Math.sin(p.twinklePhase) + 1) / 2
        const opacity = p.baseOpacity * (0.4 + twinkle * 0.6)

        // Draw with glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = opacity
        ctx.shadowColor = p.color
        ctx.shadowBlur = p.r * 4
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    function handleResize() {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [count, colors])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}
