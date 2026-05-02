// Module-level chat store — survives slide unmounts/remounts so the
// persistent ChatSlide retains its conversation as the presenter clicks
// through other slides during the talk.
//
// We keep this dead simple (no Redux, no Context) because there's only
// ever one persistent chat instance.

const listeners = new Set()

let state = {
  messages: []
}

export function getChatState() {
  return state
}

export function setChatState(updater) {
  const next = typeof updater === 'function' ? updater(state) : updater
  if (next === state) return
  state = next
  listeners.forEach((l) => {
    try { l(state) } catch (e) { /* swallow listener errors */ }
  })
}

export function subscribeChatStore(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Tiny store façade matching the shape useChat expects.
export const persistentChatStore = {
  getState: getChatState,
  setState: setChatState,
  subscribe: subscribeChatStore
}
