import { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Grid3x3, FileText, Eye, EyeOff, Maximize2, MessageCircleQuestion, Sparkles, Calculator } from 'lucide-react'
import useKeyboard from './hooks/useKeyboard'
import useViewport from './hooks/useViewport'
import useTouchSwipe from './hooks/useTouchSwipe'
import { slidesMeta, getSlideMeta, SECTIONS } from './lib/slides'
import TronGrid from './components/TronGrid'
import ThemeToggle from './components/ThemeToggle'
import AskQuestion from './components/AskQuestion'
import QASpeakerView from './components/QASpeakerView'
import ROICalculator from './components/ROICalculator'
import PromptVault, { PromptVaultFAB } from './components/PromptVault'
import MobileExperience from './components/MobileExperience'

// Lazy-load slides so initial paint is fast
const Slide01 = lazy(() => import('./components/slides/Slide01_Title'))
const Slide02 = lazy(() => import('./components/slides/Slide02_Introduction'))
const Slide03 = lazy(() => import('./components/slides/Slide03_WhatAIIs'))
const Slide04 = lazy(() => import('./components/slides/Slide04_WorkforceReadiness'))
const Slide05 = lazy(() => import('./components/slides/Slide05_BeyondAI'))
const Slide06 = lazy(() => import('./components/slides/Slide06_DeploymentStrategy'))
const Slide07 = lazy(() => import('./components/slides/Slide07_AIForSmallBusiness'))
const Slide08 = lazy(() => import('./components/slides/Slide08_WhatAICanDo'))
const Slide09 = lazy(() => import('./components/slides/Slide09_AIModels'))
const Slide12 = lazy(() => import('./components/slides/Slide12_StartThisWeek'))
const Slide14 = lazy(() => import('./components/slides/Slide14_Questions'))

const SLIDE_COMPONENTS = [
  Slide01, Slide02, Slide03, Slide04, Slide05, Slide06, Slide07,
  Slide09, Slide08, Slide12, Slide14
]

// Per-slide TRON grid tuning. The atmospheric backdrop is constant
// across the deck, but content-heavy slides dim it slightly so it
// stays decorative rather than competing with text.
const GRID_CONFIG = {
  1:  { intensity: 1.0,  variant: 'wide'  },  // Title
  2:  { intensity: 0.7,  variant: 'focus' },
  3:  { intensity: 0.6,  variant: 'focus' },
  4:  { intensity: 0.7,  variant: 'focus' },
  5:  { intensity: 0.7,  variant: 'focus' },
  6:  { intensity: 0.75, variant: 'focus' },
  7:  { intensity: 0.95, variant: 'wide'  },
  8:  { intensity: 0.65, variant: 'focus' },
  9:  { intensity: 0.7,  variant: 'focus' },
  10: { intensity: 0.7,  variant: 'focus' },  // Start This Week
  11: { intensity: 1.0,  variant: 'wide'  }   // Questions
}

// Reference design size — content is laid out for this size, then scaled to fit
const DESIGN_W = 1600
const DESIGN_H = 900

export default function App() {
  const viewport = useViewport()
  const [current, setCurrent] = useState(1)
  const [direction, setDirection] = useState(1)
  const [showNotes, setShowNotes] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [blackout, setBlackout] = useState(false)
  const [showChrome, setShowChrome] = useState(true)
  const [askOpen, setAskOpen] = useState(false)
  const [qaSpeakerOpen, setQaSpeakerOpen] = useState(false)
  const [roiOpen, setRoiOpen] = useState(false)
  const [vaultOpen, setVaultOpen] = useState(false)
  const stageRef = useRef(null)
  const currentRef = useRef(1)

  const total = slidesMeta.length

  // Keep ref in sync so callbacks always have the latest value
  useEffect(() => { currentRef.current = current }, [current])

  const goTo = useCallback((n) => {
    const target = Math.max(1, Math.min(total, n))
    if (target === currentRef.current) return
    setDirection(target > currentRef.current ? 1 : -1)
    setCurrent(target)
    setShowOverview(false)
  }, [total])

  const next = useCallback(() => {
    const target = Math.min(total, currentRef.current + 1)
    if (target === currentRef.current) return
    setDirection(1)
    setCurrent(target)
    setShowOverview(false)
  }, [total])

  const prev = useCallback(() => {
    const target = Math.max(1, currentRef.current - 1)
    if (target === currentRef.current) return
    setDirection(-1)
    setCurrent(target)
    setShowOverview(false)
  }, [])

  const first = useCallback(() => goTo(1), [goTo])
  const last = useCallback(() => goTo(total), [goTo, total])
  const toggleNotes = useCallback(() => setShowNotes(v => !v), [])
  const toggleOverview = useCallback(() => setShowOverview(v => !v), [])
  const toggleBlackout = useCallback(() => setBlackout(v => !v), [])
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }, [])
  const toggleQA = useCallback(() => setQaSpeakerOpen(v => !v), [])
  const openAsk = useCallback(() => setAskOpen(true), [])
  const closeAsk = useCallback(() => setAskOpen(false), [])
  const closeQA = useCallback(() => setQaSpeakerOpen(false), [])

  const closeOverlays = useCallback(() => {
    setShowOverview(false)
    setShowNotes(false)
    setBlackout(false)
    setAskOpen(false)
    setQaSpeakerOpen(false)
  }, [])

  // Deep-link: if URL has ?ask=1, auto-open the ask modal (audience scanning QR with that param)
  // and if URL has ?qa=1, auto-jump to slide 13 (closing slide where QR lives)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('ask') === '1') {
      setAskOpen(true)
    }
    if (params.get('slide')) {
      const n = parseInt(params.get('slide'), 10)
      if (!isNaN(n)) goTo(n)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlers = useMemo(() => ({
    next, prev, first, last,
    toggleNotes,
    blackout: toggleBlackout,
    overview: toggleOverview,
    fullscreen: toggleFullscreen,
    escape: closeOverlays,
    jumpTo: goTo,
    toggleQA,
    openAsk
  }), [next, prev, first, last, toggleNotes, toggleBlackout, toggleOverview, toggleFullscreen, closeOverlays, goTo, toggleQA, openAsk])

  useKeyboard(handlers)

  // Touch swipe for mobile + tablet
  useTouchSwipe(stageRef, {
    onSwipeLeft: next,   // swipe left → next slide
    onSwipeRight: prev   // swipe right → prev slide
  })

  const SlideComponent = SLIDE_COMPONENTS[current - 1]
  const meta = getSlideMeta(current)
  const gridCfg = GRID_CONFIG[current] || { intensity: 0.7, variant: 'focus' }

  // Mobile audience gets a purpose-built scrolling experience instead of
  // the projection-style slide carousel. Faster, cleaner, native-feeling.
  if (viewport.isMobile) {
    return <MobileExperience />
  }

  return (
    <div ref={stageRef} className="relative overflow-hidden" style={{ width: '100vw', height: viewport.isMobile ? '100dvh' : '100vh', background: 'var(--bg-base)' }}>
      {/* Persistent TRON-grid backdrop — perspective floor + ceiling +
          horizon glow + light cycles. Pure CSS, GPU-accelerated. */}
      <div className="absolute inset-0">
        <TronGrid intensity={gridCfg.intensity} variant={gridCfg.variant} />
      </div>

      {/* Vignette overlay — adapts to theme via mix-blend-mode */}
      <div
        className="absolute inset-0 pointer-events-none vignette-overlay"
        style={{ zIndex: 1 }}
      />

      {/* Slide stage — scales to fit on desktop, native flow on mobile */}
      {viewport.isMobile ? (
        <MobileSlideStage current={current} direction={direction} SlideComponent={SlideComponent} />
      ) : (
        <DesktopSlideStage
          current={current}
          direction={direction}
          SlideComponent={SlideComponent}
          scale={viewport.scale}
        />
      )}

      {/* Blackout overlay */}
      <AnimatePresence>
        {blackout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black z-40 cursor-pointer"
            onClick={toggleBlackout}
          />
        )}
      </AnimatePresence>

      {/* Slide overview */}
      <AnimatePresence>
        {showOverview && (
          <SlideOverview
            current={current}
            onSelect={goTo}
            onClose={() => setShowOverview(false)}
          />
        )}
      </AnimatePresence>

      {/* Speaker notes (desktop only) */}
      <AnimatePresence>
        {showNotes && meta && !viewport.isMobile && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 z-30 glass-strong border-t border-white/10 px-6 sm:px-10 py-5 max-h-[45vh] overflow-y-auto elegant-scroll"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent-cyan font-semibold">
                  Speaker Notes — Slide {current}
                </div>
                <div className="font-serif text-2xl sm:text-3xl mt-1.5 text-white">{meta.title}</div>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="text-white/50 hover:text-white/90 text-sm sm:text-base"
              >
                Press S to close
              </button>
            </div>
            <ul className="space-y-2 text-white/85 leading-relaxed text-base sm:text-lg">
              {meta.notes.map((note, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent-cyan/60 mt-1.5 shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom chrome */}
      {showChrome && !blackout && (
        <Chrome
          current={current}
          total={total}
          meta={meta}
          isMobile={viewport.isMobile}
          showNotes={showNotes}
          onPrev={prev}
          onNext={next}
          onOverview={toggleOverview}
          onNotes={toggleNotes}
          onHide={() => setShowChrome(false)}
          onFullscreen={toggleFullscreen}
          onToggleQA={toggleQA}
          qaActive={qaSpeakerOpen}
        />
      )}

      {/* Mobile floating "Ask a question" button — always visible on mobile */}
      {viewport.isMobile && !blackout && !askOpen && !qaSpeakerOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          onClick={openAsk}
          className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo text-white font-semibold text-sm shadow-2xl shadow-accent-cyan/30"
          aria-label="Ask a question"
        >
          <MessageCircleQuestion className="h-4 w-4" />
          <span>Ask</span>
        </motion.button>
      )}

      {/* AskQuestion modal — audience submits questions */}
      <AskQuestion open={askOpen} onClose={closeAsk} />

      {/* QA Speaker view — full-screen live feed */}
      <QASpeakerView open={qaSpeakerOpen} onClose={closeQA} />

      {/* AI ROI Calculator — interactive value-prop tool */}
      <ROICalculator open={roiOpen} onClose={() => setRoiOpen(false)} />

      {/* Personal Prompt Vault — take-home prompt library */}
      <PromptVault open={vaultOpen} onClose={() => setVaultOpen(false)} />

      {/* Floating action button to open vault from any slide */}
      {/* PromptVaultFAB removed per user request */}

      {!showChrome && (
        <button
          onClick={() => setShowChrome(true)}
          className="absolute bottom-4 right-4 z-20 h-9 w-9 rounded-full glass border border-white/10 hover:border-white/30 flex items-center justify-center transition opacity-30 hover:opacity-100"
          aria-label="Show controls"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      {/* Hint overlay (desktop only — mobile gets a different hint) */}
      {!viewport.isMobile && <KeyHints />}
      {viewport.isMobile && <MobileSwipeHint />}
    </div>
  )
}

/**
 * Desktop / tablet stage — wraps slide in a fixed 1600×900 frame that scales
 * uniformly to fit the available viewport. Guarantees all designed content
 * is visible regardless of monitor size or aspect ratio.
 */
function DesktopSlideStage({ current, direction, SlideComponent, scale }) {
  return (
    <div className="slide-stage absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
      <div
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, scale: 0.97, x: direction * 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.97, x: direction * -30, filter: 'blur(6px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* slide-canvas: every slide is wrapped in this strict envelope.
                Reserves 150 design pixels at the bottom for the navigation
                chrome and clips anything that overflows. Universal safe zone. */}
            <div className="slide-canvas">
              <Suspense fallback={<div className="text-white/40 font-serif text-2xl flex items-center justify-center h-full">Loading…</div>}>
                <SlideComponent />
              </Suspense>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/**
 * Mobile stage — slide content uses native flow with vertical scroll within
 * each slide. Cards stack and read naturally on a phone.
 */
function MobileSlideStage({ current, direction, SlideComponent }) {
  return (
    <div className="mobile-deck absolute inset-0 flex flex-col" style={{ zIndex: 2 }}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden elegant-scroll" style={{ paddingBottom: '90px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-full"
          >
            <Suspense fallback={<div className="text-white/40 font-serif text-xl flex items-center justify-center min-h-screen">Loading…</div>}>
              <SlideComponent />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Chrome({ current, total, meta, isMobile, showNotes, onPrev, onNext, onOverview, onNotes, onHide, onFullscreen, onToggleQA, qaActive }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
      {/* Progress bar */}
      <div className="px-4 sm:px-10">
        <div className="h-px bg-white/5 relative overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-indigo"
            initial={false}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Nav row */}
      <div className="flex items-center justify-between px-4 sm:px-10 py-3 sm:py-5 pointer-events-auto bg-ink-950/60 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none">
        <div className="flex items-center gap-3 text-sm text-white/55 font-mono">
          <span className="tabular-nums">{String(current).padStart(2, '0')}</span>
          <span className="text-white/25">/</span>
          <span className="tabular-nums">{String(total).padStart(2, '0')}</span>
          {meta && !isMobile && (
            <span className="hidden sm:inline ml-4 text-white/55 font-sans">
              {SECTIONS[meta.section]?.label}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ChromeButton onClick={onPrev} aria-label="Previous slide" disabled={current === 1}>
            <ChevronLeft className="h-4 w-4" />
          </ChromeButton>
          <ChromeButton onClick={onOverview} aria-label="Show overview (O)">
            <Grid3x3 className="h-4 w-4" />
          </ChromeButton>
          {!isMobile && (
            <>
              <ChromeButton onClick={onToggleQA} aria-label="Toggle Q&A (Q)" active={qaActive}>
                <MessageCircleQuestion className="h-4 w-4" />
              </ChromeButton>
              <ChromeButton onClick={onNotes} aria-label="Toggle notes (S)" active={showNotes}>
                <FileText className="h-4 w-4" />
              </ChromeButton>
              <ThemeToggle />
              <ChromeButton onClick={onHide} aria-label="Hide chrome">
                <EyeOff className="h-4 w-4" />
              </ChromeButton>
              <ChromeButton onClick={onFullscreen} aria-label="Fullscreen (F)">
                <Maximize2 className="h-4 w-4" />
              </ChromeButton>
            </>
          )}
          {isMobile && <ThemeToggle />}
          <ChromeButton onClick={onNext} aria-label="Next slide" disabled={current === total}>
            <ChevronRight className="h-4 w-4" />
          </ChromeButton>
        </div>
      </div>
    </div>
  )
}

function ChromeButton({ children, onClick, disabled, active, ...rest }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-9 w-9 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition border ${
        active
          ? 'bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan'
          : 'glass border-white/10 hover:border-white/30 text-white/70 hover:text-white'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
      {...rest}
    >
      {children}
    </button>
  )
}

function SlideOverview({ current, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 bg-ink-950/95 backdrop-blur-xl overflow-y-auto elegant-scroll"
      onClick={onClose}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-accent-cyan font-medium">Overview</div>
            <h2 className="font-serif text-2xl sm:text-4xl mt-2">All slides</h2>
          </div>
          <div className="text-xs sm:text-sm text-white/40 text-right">
            <span className="hidden sm:inline">Click a slide to jump · </span>Press O or Esc to close
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {slidesMeta.map((slide) => {
            const section = SECTIONS[slide.section]
            const isCurrent = slide.id === current
            return (
              <motion.button
                key={slide.id}
                onClick={(e) => { e.stopPropagation(); onSelect(slide.id) }}
                className={`group text-left aspect-[16/10] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition border ${
                  isCurrent
                    ? 'bg-accent-cyan/10 border-accent-cyan/40'
                    : 'glass border-white/8 hover:border-white/25 hover:bg-white/3'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono text-xs text-white/40">
                    {String(slide.id).padStart(2, '0')}
                  </div>
                  <div className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full ${
                    section.id === 'part-1' ? 'bg-cyan-500/10 text-cyan-300' : 'bg-blue-500/10 text-blue-300'
                  }`}>
                    {section.presenter.split(' ')[0]}
                  </div>
                </div>
                <div className="font-serif text-base sm:text-xl leading-tight">{slide.title}</div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

function KeyHints() {
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShown(false), 8000)
    return () => clearTimeout(t)
  }, [])

  if (!shown) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="absolute top-4 right-4 z-20 glass border border-white/10 rounded-xl px-4 py-3 text-xs text-white/60 max-w-xs"
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-white/80 font-medium">Keyboard shortcuts</span>
        <button onClick={() => setShown(false)} className="text-white/30 hover:text-white/80">×</button>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <span>← →</span><span className="text-white/40">navigate</span>
        <span>S</span><span className="text-white/40">notes</span>
        <span>O</span><span className="text-white/40">overview</span>
        <span>B</span><span className="text-white/40">blackout</span>
        <span>F</span><span className="text-white/40">fullscreen</span>
        <span>1–9</span><span className="text-white/40">jump</span>
      </div>
    </motion.div>
  )
}

function MobileSwipeHint() {
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShown(false), 5000)
    return () => clearTimeout(t)
  }, [])

  if (!shown) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      onClick={() => setShown(false)}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 glass border border-white/10 rounded-full px-4 py-2 text-xs text-white/70"
    >
      ← Swipe to navigate →
    </motion.div>
  )
}
