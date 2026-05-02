import { useRef, useState, useCallback } from 'react'

/**
 * MagneticButton — button content shifts subtly toward the cursor when hovered.
 * The OUTER element moves about 30% of cursor distance, the inner content stays
 * mostly aligned creating a parallax pull effect.
 */
export default function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  ...rest
}) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('translate(0px, 0px)')

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    setTransform(`translate(${x * strength}px, ${y * strength}px)`)
  }, [strength])

  const handleLeave = useCallback(() => {
    setTransform('translate(0px, 0px)')
  }, [])

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`relative ${className}`}
      style={{
        transform,
        transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform'
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
