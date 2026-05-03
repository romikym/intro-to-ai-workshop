import { lazy, Suspense } from 'react'
import TronGrid from './TronGrid'

/**
 * SlideThumbnail — renders a real, scaled-down preview of any slide.
 * Used by the Speaker Notes pop-out window to show current + up-next
 * slide previews like Apple Keynote's presenter mode.
 *
 * The trick: we render the actual slide component inside a 1600×900
 * frame, then scale the entire frame down to the requested width. This
 * gives a pixel-perfect preview at any size with no manual layout work.
 */

// Lazy-load each slide so unused ones don't bloat the notes window.
const SLIDE_LOADERS = [
  () => import('./slides/Slide01_Title'),
  () => import('./slides/Slide02_Introduction'),
  () => import('./slides/Slide03_WhatAIIs'),
  () => import('./slides/Slide04_WorkforceReadiness'),
  () => import('./slides/Slide05_BeyondAI'),
  () => import('./slides/Slide06_DeploymentStrategy'),
  () => import('./slides/Slide07_AIForSmallBusiness'),
  () => import('./slides/Slide09_AIModels'),         // 8th slot — display order swap
  () => import('./slides/Slide08_WhatAICanDo'),      // 9th slot
  () => import('./slides/Slide12_StartThisWeek'),
  () => import('./slides/Slide14_Questions')
]

// Cache the lazy components so the same slot doesn't trigger multiple
// dynamic imports across renders.
const SLIDE_CACHE = []
function getSlide(id) {
  const idx = id - 1
  if (idx < 0 || idx >= SLIDE_LOADERS.length) return null
  if (!SLIDE_CACHE[idx]) {
    SLIDE_CACHE[idx] = lazy(SLIDE_LOADERS[idx])
  }
  return SLIDE_CACHE[idx]
}

const DESIGN_W = 1600
const DESIGN_H = 900

export default function SlideThumbnail({ id, width = 320, gridIntensity = 0.6 }) {
  const SlideComponent = getSlide(id)
  if (!SlideComponent) return null

  const scale = width / DESIGN_W
  const height = width * (DESIGN_H / DESIGN_W)

  return (
    <div
      className="relative"
      style={{
        width,
        height,
        overflow: 'hidden',
        borderRadius: '12px',
        background: '#07060F',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 12px 28px -12px rgba(0,0,0,0.6)'
      }}
    >
      {/* TRON grid backdrop, dimmed to keep the preview readable */}
      <div className="absolute inset-0 pointer-events-none">
        <TronGrid intensity={gridIntensity} variant="focus" />
      </div>

      {/* The full-size slide, scaled down */}
      <div
        style={{
          width: `${DESIGN_W}px`,
          height: `${DESIGN_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none' // previews are non-interactive
        }}
      >
        <Suspense fallback={null}>
          <SlideComponent />
        </Suspense>
      </div>
    </div>
  )
}
