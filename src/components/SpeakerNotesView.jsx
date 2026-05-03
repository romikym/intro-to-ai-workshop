import { useEffect, useState, useRef } from 'react'
import { slidesMeta, getSlideMeta, SECTIONS } from '../lib/slides'
import { broadcastSlide, requestCurrentSlide, subscribe } from '../lib/notesChannel'
import SlideThumbnail from './SlideThumbnail'

/**
 * SpeakerNotesView — standalone window that mirrors the deck's current
 * slide and shows the presenter notes in big, comfortable type.
 *
 * Loaded when the URL contains `?notes=1`. Communicates with the main
 * deck window via BroadcastChannel — flip a slide on the laptop, this
 * window updates instantly.
 *
 * Drag this window to a second monitor or your iPad while presenting.
 */
export default function SpeakerNotesView() {
  const [current, setCurrent] = useState(1)
  const total = slidesMeta.length
  const wakeLockRef = useRef(null)

  // Listen for slide updates from the main deck.
  useEffect(() => {
    const unsub = subscribe((e) => {
      if (e.data?.type === 'slide' && typeof e.data.current === 'number') {
        setCurrent(e.data.current)
      }
    })
    // Ask the main window what slide it's on (in case this window opens late).
    requestCurrentSlide()
    return unsub
  }, [])

  // Keyboard nav so the notes window can also drive the deck.
  // Pressing arrow keys here broadcasts the new slide to the main window
  // (the main window also listens and will move).
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        const next = Math.min(total, current + 1)
        if (next !== current) {
          setCurrent(next)
          broadcastSlide(next)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        const prev = Math.max(1, current - 1)
        if (prev !== current) {
          setCurrent(prev)
          broadcastSlide(prev)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, total])

  // Keep the screen awake while the notes window is open
  // (so iPad/laptop doesn't dim mid-presentation).
  useEffect(() => {
    if (!('wakeLock' in navigator)) return
    let released = false
    async function acquire() {
      try {
        const lock = await navigator.wakeLock.request('screen')
        wakeLockRef.current = lock
        lock.addEventListener('release', () => {
          if (!released && document.visibilityState === 'visible') acquire()
        })
      } catch {}
    }
    acquire()
    function onVis() {
      if (document.visibilityState === 'visible') acquire()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      released = true
      document.removeEventListener('visibilitychange', onVis)
      try { wakeLockRef.current?.release() } catch {}
    }
  }, [])

  const meta = getSlideMeta(current)
  const nextMeta = getSlideMeta(current + 1)
  const section = meta && SECTIONS[meta.section]

  return (
    <div className="min-h-screen w-full text-white" style={{ background: '#07060F' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 px-6 sm:px-10 py-4 flex items-center justify-between border-b border-white/10"
        style={{ background: 'rgba(7,6,15,0.92)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center font-mono text-[14px] font-bold tabular-nums"
            style={{ background: 'linear-gradient(135deg, #2997FF, #6366F1)' }}
          >
            {String(current).padStart(2, '0')}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300 font-bold">
              Speaker Notes
            </div>
            <div className="text-[14px] text-white/65 truncate">
              Slide {current} of {total}
              {section && (
                <>
                  <span className="mx-2 text-white/25">·</span>
                  {section.label}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-[11px] text-white/40 hidden sm:block">
          ← / → to navigate · stays in sync with the deck
        </div>
      </header>

      {/* Body */}
      <main className="px-6 sm:px-10 py-6 max-w-5xl mx-auto">
        {meta ? (
          <>
            {/* Current + Next slide previews — Apple Keynote style */}
            <div className="grid grid-cols-[2fr_1fr] gap-5 mb-6">
              <div>
                <div className="text-[10px] uppercase tracking-[0.26em] text-cyan-300 font-bold mb-2">
                  Now showing
                </div>
                <SlideThumbnail id={current} width={420} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.26em] text-white/45 font-bold mb-2">
                  Up next
                </div>
                {nextMeta ? (
                  <>
                    <SlideThumbnail id={nextMeta.id} width={220} gridIntensity={0.4} />
                    <div className="mt-2 text-white/70 text-[12px] leading-tight">
                      <span className="text-white/40 font-mono mr-2">
                        {String(nextMeta.id).padStart(2, '0')}
                      </span>
                      {nextMeta.title}
                    </div>
                  </>
                ) : (
                  <div
                    className="rounded-xl border border-white/8 flex items-center justify-center text-white/40 text-[12px] italic"
                    style={{ width: 220, height: 124, background: 'rgba(255,255,255,0.03)' }}
                  >
                    End of deck
                  </div>
                )}
              </div>
            </div>

            {/* Title + presenter attribution */}
            <div className="text-[12px] uppercase tracking-[0.26em] text-cyan-300 font-bold mb-1">
              {section?.presenter} · {section?.company}
            </div>
            <h1
              className="font-bold text-white leading-[1.1] mb-6"
              style={{
                fontFamily: '"Inter Tight", system-ui, sans-serif',
                fontSize: 'clamp(28px, 3.4vw, 42px)',
                letterSpacing: '-0.02em'
              }}
            >
              {meta.title}
            </h1>

            {/* Speaker notes */}
            <ol className="space-y-4">
              {meta.notes?.map((note, i) => (
                <li key={i} className="flex gap-4">
                  <span
                    className="shrink-0 mt-1 h-7 w-7 rounded-full flex items-center justify-center font-mono text-[12px] font-bold tabular-nums"
                    style={{
                      background: 'rgba(95,182,255,0.15)',
                      color: '#5FB6FF',
                      border: '1px solid rgba(95,182,255,0.35)'
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-white/92 leading-relaxed"
                    style={{
                      fontFamily: '"Inter Tight", system-ui, sans-serif',
                      fontSize: 'clamp(16px, 1.7vw, 20px)',
                      lineHeight: 1.5
                    }}
                  >
                    {note}
                  </span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <div className="text-white/45 text-center py-20">
            No notes for this slide.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 sm:px-10 py-3 border-t border-white/8 text-center text-[11px] text-white/35">
        Notes window · synced with main deck · safe to drag to a second screen
      </footer>
    </div>
  )
}
