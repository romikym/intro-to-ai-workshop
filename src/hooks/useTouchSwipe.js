import { useEffect } from 'react'

/**
 * useTouchSwipe — attach touch swipe gesture handlers to a target element.
 *
 * Triggers callbacks when the user does a HORIZONTAL swipe with at least
 * `minDistance` px of movement and a horizontal:vertical ratio greater than
 * `ratioThreshold` (so vertical scrolling is not hijacked).
 *
 * @param {object} target - ref-like { current: HTMLElement } or null for window
 * @param {object} handlers - { onSwipeLeft, onSwipeRight }
 * @param {object} opts - { minDistance, ratioThreshold }
 */
export default function useTouchSwipe(target, { onSwipeLeft, onSwipeRight }, opts = {}) {
  const { minDistance = 50, ratioThreshold = 1.5 } = opts

  useEffect(() => {
    const el = target?.current ?? window

    let startX = 0
    let startY = 0
    let startTime = 0

    function onStart(e) {
      const touch = e.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startTime = Date.now()
    }

    function onEnd(e) {
      const touch = e.changedTouches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY
      const dt = Date.now() - startTime

      // Ignore very slow gestures (likely intended as scrolls)
      if (dt > 800) return

      const absDx = Math.abs(dx)
      const absDy = Math.abs(dy)

      // Must be primarily horizontal motion
      if (absDx < minDistance) return
      if (absDy > 0 && absDx / absDy < ratioThreshold) return

      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchend', onEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchend', onEnd)
    }
  }, [target, onSwipeLeft, onSwipeRight, minDistance, ratioThreshold])
}
