import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, RotateCcw, Type, Maximize2, Minimize2 } from 'lucide-react'
import { slidesMeta, getSlideMeta, SECTIONS } from '../lib/slides'
import { broadcastSlide, requestCurrentSlide, subscribe } from '../lib/notesChannel'
import SlideThumbnail from './SlideThumbnail'
import { useSlideNotes, useHasNotesOverride, useNotesFontScale } from '../hooks/useNotesStore'
import * as notesStore from '../lib/notesStore'

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
  const notes = useSlideNotes(current)
  const hasOverride = useHasNotesOverride(current)
  const fontScale = useNotesFontScale()
  // Thumbnail size — small / medium / large. Persists across reloads.
  const [thumbSize, setThumbSize] = useState(() => {
    if (typeof window === 'undefined') return 'medium'
    try {
      const stored = localStorage.getItem('intro-ai-notes-thumb-size')
      if (stored === 'small' || stored === 'medium' || stored === 'large') return stored
    } catch {}
    return 'medium'
  })
  useEffect(() => {
    try { localStorage.setItem('intro-ai-notes-thumb-size', thumbSize) } catch {}
  }, [thumbSize])
  const thumbDims = {
    small:  { current: 320, next: 170 },
    medium: { current: 460, next: 240 },
    large:  { current: 640, next: 340 }
  }[thumbSize]
  function cycleThumbSize() {
    setThumbSize(s => s === 'small' ? 'medium' : s === 'medium' ? 'large' : 'small')
  }

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

        <div className="flex items-center gap-2">
          {/* Thumbnail size toggle — cycles small / medium / large */}
          <button
            onClick={cycleThumbSize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/12 text-white/65 hover:text-white hover:bg-white/8 transition text-[11px]"
            title={`Thumbnail size: ${thumbSize} — click to cycle`}
            aria-label="Cycle thumbnail size"
          >
            {thumbSize === 'large' ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="capitalize">{thumbSize}</span>
          </button>
          {/* Font size controls — Jim wanted bigger notes for corner-of-eye reading */}
          <div className="flex items-center gap-0.5 rounded-lg border border-white/12 overflow-hidden">
            <button
              onClick={() => notesStore.bumpFontScale(-1)}
              className="px-2.5 py-1.5 text-white/65 hover:text-white hover:bg-white/8 transition"
              title="Smaller text"
              aria-label="Smaller text"
            >
              <Type className="h-3 w-3" />
            </button>
            <div className="px-2 text-[11px] text-white/45 font-mono tabular-nums select-none">
              {Math.round(fontScale * 100)}%
            </div>
            <button
              onClick={() => notesStore.bumpFontScale(1)}
              className="px-2.5 py-1.5 text-white/65 hover:text-white hover:bg-white/8 transition"
              title="Bigger text"
              aria-label="Bigger text"
            >
              <Type className="h-4 w-4" />
            </button>
          </div>
          {hasOverride && (
            <button
              onClick={() => notesStore.resetNotesForSlide(current)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/12 text-white/65 hover:text-white hover:bg-white/8 transition text-[11px]"
              title="Revert this slide's notes to the original"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
          <div className="text-[11px] text-white/40 hidden lg:block ml-2">
            ← / → to navigate
          </div>
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
                <SlideThumbnail id={current} width={thumbDims.current} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.26em] text-white/45 font-bold mb-2">
                  Up next
                </div>
                {nextMeta ? (
                  <>
                    <SlideThumbnail id={nextMeta.id} width={thumbDims.next} gridIntensity={0.4} />
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
                    style={{
                      width: thumbDims.next,
                      height: thumbDims.next * (9 / 16),
                      background: 'rgba(255,255,255,0.03)'
                    }}
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

            {/* Speaker notes — editable in place. Click any note to edit;
                blur saves. Use the + at the bottom to add new bullets. */}
            <ol className="space-y-4">
              {notes.map((note, i) => (
                <EditableNote
                  key={i}
                  index={i}
                  text={note}
                  fontScale={fontScale}
                  onChange={(t) => notesStore.updateNote(current, i, t)}
                  onDelete={() => notesStore.deleteNote(current, i)}
                />
              ))}
            </ol>

            <button
              onClick={() => notesStore.addNote(current, '')}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/20 text-white/55 hover:text-white hover:border-white/40 hover:bg-white/4 transition text-[13px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Add a note
            </button>
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

/**
 * EditableNote — a single note rendered as contenteditable text. Click
 * to edit, blur to save, hover to reveal the delete button.
 */
function EditableNote({ index, text, fontScale, onChange, onDelete }) {
  const ref = useRef(null)

  // Sync external text changes (e.g., reset, slide change) into the DOM
  // without overwriting while the user is actively typing.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (document.activeElement === el) return
    if (el.innerText !== text) el.innerText = text
  }, [text])

  function handleBlur() {
    const next = ref.current?.innerText ?? ''
    if (next !== text) onChange(next)
  }

  function handleKeyDown(e) {
    // Esc to blur. Enter inserts newline (default for contenteditable).
    if (e.key === 'Escape') ref.current?.blur()
  }

  // Base size scales with the user's font preference.
  const baseSize = `clamp(${16 * fontScale}px, ${1.7 * fontScale}vw, ${20 * fontScale}px)`

  return (
    <li className="group flex gap-4 items-start">
      <span
        className="shrink-0 mt-1 h-7 w-7 rounded-full flex items-center justify-center font-mono text-[12px] font-bold tabular-nums select-none"
        style={{
          background: 'rgba(95,182,255,0.15)',
          color: '#5FB6FF',
          border: '1px solid rgba(95,182,255,0.35)'
        }}
      >
        {index + 1}
      </span>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 text-white/92 leading-relaxed outline-none px-2 py-1 -mx-2 -my-1 rounded-md focus:bg-white/4 hover:bg-white/3 transition cursor-text"
        style={{
          fontFamily: '"Inter Tight", system-ui, sans-serif',
          fontSize: baseSize,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap'
        }}
      >
        {text}
      </div>
      <button
        onClick={onDelete}
        className="shrink-0 mt-1 h-7 w-7 rounded-md flex items-center justify-center text-white/30 hover:text-red-300 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition"
        title="Delete this note"
        aria-label="Delete note"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}
