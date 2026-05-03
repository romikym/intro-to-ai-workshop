import { useEffect } from 'react'

export default function useKeyboard(handlers) {
  useEffect(() => {
    function onKey(e) {
      // Don't capture keys when user is typing in inputs/textareas
      const tag = (e.target?.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea') {
        // Allow Escape to bubble up regardless
        if (e.key === 'Escape' && handlers.escape) {
          handlers.escape(e)
        }
        return
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          handlers.next?.(e)
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          handlers.prev?.(e)
          break
        case 'Home':
          e.preventDefault()
          handlers.first?.(e)
          break
        case 'End':
          e.preventDefault()
          handlers.last?.(e)
          break
        case 'Escape':
          handlers.escape?.(e)
          break
        case 's':
        case 'S':
          handlers.toggleNotes?.(e)
          break
        case 'b':
        case 'B':
          handlers.blackout?.(e)
          break
        case 'o':
        case 'O':
          handlers.overview?.(e)
          break
        case 'f':
        case 'F':
          handlers.fullscreen?.(e)
          break
        case 'q':
        case 'Q':
          handlers.toggleQA?.(e)
          break
        case 'a':
        case 'A':
          handlers.openAsk?.(e)
          break
        case 'n':
        case 'N':
          handlers.popOutNotes?.(e)
          break
        case '?':
        case 'h':
        case 'H':
          handlers.toggleHints?.(e)
          break
        default:
          // Number keys 1-9 jump to slide
          if (/^[1-9]$/.test(e.key)) {
            handlers.jumpTo?.(parseInt(e.key, 10), e)
          }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlers])
}
