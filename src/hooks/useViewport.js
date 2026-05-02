import { useEffect, useState } from 'react'

/**
 * useViewport — returns viewport mode and scale factor for slide content.
 *
 * Mode rules:
 *   - mobile: width < 640px (typical phone in any orientation)
 *   - tablet: 640px ≤ width < 1024px
 *   - desktop: width ≥ 1024px
 *
 * Scale rules (for desktop/tablet only — mobile uses native flow):
 *   - Reference design size: 1600×900 (smaller than 1920×1080 to give breathing room)
 *   - Scale = min(viewportW / 1600, viewportH / 900), capped at 1.5x
 *   - This ensures all designed content always fits, regardless of monitor size
 */
export default function useViewport() {
  const [state, setState] = useState(() => calc())

  useEffect(() => {
    function update() {
      setState(calc())
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return state
}

const REF_W = 1600
const REF_H = 900

function calc() {
  if (typeof window === 'undefined') {
    return { mode: 'desktop', scale: 1, width: 1600, height: 900, isMobile: false, isTablet: false, isDesktop: true }
  }
  const w = window.innerWidth
  const h = window.innerHeight

  let mode
  if (w < 640) mode = 'mobile'
  else if (w < 1024) mode = 'tablet'
  else mode = 'desktop'

  let scale = 1
  if (mode !== 'mobile') {
    scale = Math.min(w / REF_W, h / REF_H)
    scale = Math.min(scale, 1.5) // cap at 1.5x so content doesn't get oversized on huge monitors
  }

  return {
    mode,
    scale,
    width: w,
    height: h,
    isMobile: mode === 'mobile',
    isTablet: mode === 'tablet',
    isDesktop: mode === 'desktop'
  }
}
