import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, X } from 'lucide-react'

/**
 * PresenterHints — keyboard shortcut cheat sheet popup. Triggered by the
 * Keyboard icon in the bottom chrome (or by pressing `?` / `H`). Sits as
 * a small floating card above the chrome, dismissed by Esc / X / clicking
 * outside.
 *
 * Same buttery animation pattern as the other modals (opacity + scale +
 * tiny translateY, GPU-pinned).
 */
const SHORTCUTS = [
  { keys: ['←', '→'], label: 'Navigate slides' },
  { keys: ['N'],      label: 'Pop out speaker notes' },
  { keys: ['S'],      label: 'Toggle inline notes' },
  { keys: ['Q'],      label: 'Open Q&A speaker view' },
  { keys: ['A'],      label: 'Open ask-a-question modal' },
  { keys: ['O'],      label: 'Slide overview grid' },
  { keys: ['F'],      label: 'Fullscreen' },
  { keys: ['B'],      label: 'Blackout screen' },
  { keys: ['1','9'],  label: 'Jump to slide #', joiner: '–' }
]

export default function PresenterHints({ open, onClose }) {
  // Esc to close
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Click-outside backdrop — invisible, just captures clicks */}
          <div
            className="absolute inset-0 pointer-events-auto"
            onClick={onClose}
          />

          <motion.div
            className="relative pointer-events-auto rounded-2xl border border-white/12 overflow-hidden contact-card-perf"
            style={{
              width: 'min(380px, calc(100vw - 32px))',
              marginBottom: '110px', /* sits above the chrome */
              background: 'linear-gradient(160deg, rgba(14,12,32,0.96) 0%, rgba(10,8,32,0.96) 100%)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(95,182,255,0.08)',
              willChange: 'transform, opacity',
              transform: 'translateZ(0)'
            }}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                <Keyboard className="h-4 w-4 text-accent-cyan shrink-0" />
                <div className="text-[11px] uppercase tracking-[0.22em] text-accent-cyan font-bold">
                  Presenter cheat sheet
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="h-7 w-7 rounded-md flex items-center justify-center text-white/55 hover:text-white hover:bg-white/8 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-4 py-3 space-y-2">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="text-white/70 truncate">{s.label}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {s.keys.map((k, j) => (
                      <span key={j} className="flex items-center gap-1">
                        {j > 0 && (
                          <span className="text-white/30 font-mono text-[10px]">
                            {s.joiner || '+'}
                          </span>
                        )}
                        <kbd
                          className="font-mono font-bold tabular-nums px-1.5 py-0.5 rounded text-[11px] text-white/90"
                          style={{
                            background: 'rgba(255,255,255,0.10)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            minWidth: '22px',
                            textAlign: 'center',
                            lineHeight: 1
                          }}
                        >
                          {k}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/50 leading-snug">
              On slide 11, audience questions appear in the Live Queue panel — tap{' '}
              <span className="text-white/85 font-semibold">Claude</span> on any card to stream the answer on the projector.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
