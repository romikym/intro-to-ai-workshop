import { useEffect, useRef, useState } from 'react'

/**
 * useMatrixText — Matrix-style text reveal. Characters cycle through
 * random glyphs before locking into their real letters, giving the
 * impression of decoding text out of noise.
 *
 * The reveal rate is constant (decoupled from Anthropic's bursty token
 * stream — see useSmoothedText for the underlying approach), and a
 * window of N characters at the head is constantly scrambling.
 *
 * Returns { revealed, scramble } so callers can style each part
 * separately (e.g., make the scrambling head glow cyan).
 */

// Mix of A-Z, numbers, common symbols, and a few katakana for the
// classic Matrix vibe — but kept fixed-width-friendly.
const MATRIX_CHARS = (
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  'abcdefghijklmnopqrstuvwxyz' +
  '0123456789' +
  '!@#$%^&*()_+-={}[]|:;<>?,.~/' +
  'アイウエオカキクケコサシスセソタチツテト'
).split('')

function randChar() {
  return MATRIX_CHARS[(Math.random() * MATRIX_CHARS.length) | 0]
}

const PASS_THROUGH = new Set([' ', '\n', '\t', '\r'])

export default function useMatrixText(target, opts = {}) {
  const { revealRate = 4, scrambleLength = 6 } = opts
  const [state, setState] = useState({ revealed: '', scramble: '' })
  const stateRef = useRef({ revealed: 0, target: '' })
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    const t = target ?? ''

    // Hard reset on shrink (new conversation)
    if (t.length < stateRef.current.revealed) {
      stateRef.current.revealed = 0
      setState({ revealed: '', scramble: '' })
    }

    stateRef.current.target = t

    if (rafRef.current) return
    if (stateRef.current.revealed >= t.length) return

    lastTimeRef.current = performance.now()

    function tick(now) {
      const dt = now - lastTimeRef.current
      lastTimeRef.current = now
      const tt = stateRef.current.target

      // Advance the locked-in cursor at a constant rate
      if (stateRef.current.revealed < tt.length) {
        const charsToReveal = Math.max(1, Math.round((revealRate * dt) / 16))
        stateRef.current.revealed = Math.min(tt.length, stateRef.current.revealed + charsToReveal)
      }

      const revealed = stateRef.current.revealed
      const remaining = tt.length - revealed
      const scrambleCount = Math.min(scrambleLength, remaining)

      // Build the scrambling head from random chars (whitespace passes through
      // so word shape is preserved as text decodes).
      let scramble = ''
      for (let i = 0; i < scrambleCount; i++) {
        const real = tt[revealed + i]
        scramble += PASS_THROUGH.has(real) ? real : randChar()
      }

      setState({
        revealed: tt.slice(0, revealed),
        scramble
      })

      if (revealed < tt.length) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [target, revealRate, scrambleLength])

  // Cleanup
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return state
}
