import { useEffect, useRef, useState } from 'react'

/**
 * useSmoothedText — turns a stream that updates in irregular bursts
 * (like Claude's token stream) into a smooth, constant-rate reveal.
 *
 * The Anthropic API delivers chunks at unpredictable cadence — sometimes
 * a single character, sometimes a 60-char burst. Rendering each chunk
 * straight to React state produces visible jerk. This hook decouples
 * "how fast text arrives" from "how fast text appears" by buffering
 * the target and revealing it via requestAnimationFrame at a steady
 * characters-per-frame pace.
 *
 * Usage:
 *   const display = useSmoothedText(streamingText, { charsPerFrame: 4 })
 *   return <div>{display}</div>
 */
export default function useSmoothedText(target, { charsPerFrame = 4 } = {}) {
  const [shown, setShown] = useState('')
  // Mutable state — kept in a ref so the rAF loop reads latest values.
  const stateRef = useRef({ displayed: 0, target: '' })
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const t = target ?? ''

    // Hard reset: target shrunk (new conversation, cleared, etc.)
    if (t.length < stateRef.current.displayed) {
      stateRef.current.displayed = 0
      setShown('')
    }

    stateRef.current.target = t

    // Already animating, or already caught up — nothing to do.
    if (rafRef.current) return
    if (stateRef.current.displayed >= t.length) return

    lastTimeRef.current = performance.now()

    function tick(now) {
      const delta = now - lastTimeRef.current
      lastTimeRef.current = now
      const tt = stateRef.current.target

      if (stateRef.current.displayed < tt.length) {
        // Scale by frame delta so total speed is consistent across refresh rates.
        const speed = Math.max(1, Math.round((charsPerFrame * delta) / 16))
        stateRef.current.displayed = Math.min(tt.length, stateRef.current.displayed + speed)
        setShown(tt.slice(0, stateRef.current.displayed))
        rafRef.current = requestAnimationFrame(tick)
      } else {
        // Caught up — sleep until target grows again.
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [target, charsPerFrame])

  // Cleanup on unmount
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return shown
}
