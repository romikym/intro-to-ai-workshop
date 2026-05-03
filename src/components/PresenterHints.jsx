import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Keyboard, ChevronDown, ChevronUp } from 'lucide-react'

/**
 * PresenterHints — compact always-available cheat sheet in the lower-right
 * of the deck. Shows the keyboard shortcuts a presenter actually needs
 * during the live talk. Collapsible so it stays out of the way once
 * memorized; a single "Hints" pill remains tappable.
 *
 * Persists collapsed/expanded state across reloads via localStorage.
 */
const STORAGE_KEY = 'intro-ai-presenter-hints-open'

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

export default function PresenterHints({ hideForLiveQueue = false }) {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'closed') return false
    } catch {}
    return true
  })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, open ? 'open' : 'closed') } catch {}
  }, [open])

  // On slide 11 the Live Queue takes the lower-right slot; hide hints
  // entirely there to avoid the two panels stacking on top of each other.
  if (hideForLiveQueue) return null

  return (
    <div
      className="absolute z-20 pointer-events-auto"
      style={{
        bottom: '170px',
        right: 'clamp(20px, 2.5vw, 36px)',
        width: 'min(280px, 22vw)'
      }}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-white/12 overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(160deg, rgba(14,12,32,0.92) 0%, rgba(10,8,32,0.92) 100%)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(95,182,255,0.06)',
          willChange: 'transform, opacity'
        }}
      >
        {/* Header — always visible, tap to expand/collapse */}
        <button
          onClick={() => setOpen(v => !v)}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 hover:bg-white/5 transition text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Keyboard className="h-3.5 w-3.5 text-accent-cyan shrink-0" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-accent-cyan font-bold">
              Presenter cheat sheet
            </span>
          </div>
          {open ? (
            <ChevronDown className="h-3.5 w-3.5 text-white/45 shrink-0" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5 text-white/45 shrink-0" />
          )}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3 pt-1 border-t border-white/8 space-y-1.5">
                {SHORTCUTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 text-[11px]">
                    <span className="text-white/65 truncate">{s.label}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {s.keys.map((k, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && (
                            <span className="text-white/30 font-mono text-[9px]">
                              {s.joiner || '+'}
                            </span>
                          )}
                          <kbd
                            className="font-mono font-bold tabular-nums px-1.5 py-0.5 rounded text-[10px] text-white/85"
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              minWidth: '20px',
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
                <div className="pt-2 mt-2 border-t border-white/8 text-[10px] text-white/45 leading-snug">
                  Live questions appear in the Live Queue panel on slide 11 — tap{' '}
                  <span className="text-white/75 font-semibold">Claude</span> on any card to stream the answer on screen.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
