// BroadcastChannel wrapper that syncs the current slide between the
// main deck window and any pop-out speaker-notes window opened via
// `?notes=1`. Falls back to a no-op if the API isn't available
// (older browsers).

const CHANNEL_NAME = 'intro-ai-deck-notes'
let channel = null

function ensure() {
  if (channel) return channel
  if (typeof BroadcastChannel === 'undefined') return null
  channel = new BroadcastChannel(CHANNEL_NAME)
  return channel
}

/** Main deck → notes: announce the current slide. */
export function broadcastSlide(current) {
  const c = ensure()
  if (!c) return
  c.postMessage({ type: 'slide', current })
}

/** Notes window → main deck: request the current slide on mount. */
export function requestCurrentSlide() {
  const c = ensure()
  if (!c) return
  c.postMessage({ type: 'request-slide' })
}

/** Subscribe to messages from the other window. */
export function subscribe(handler) {
  const c = ensure()
  if (!c) return () => {}
  c.addEventListener('message', handler)
  return () => c.removeEventListener('message', handler)
}

export function close() {
  if (channel) {
    channel.close()
    channel = null
  }
}
