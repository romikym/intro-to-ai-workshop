// Per-slide notes overrides + font-scale preference, persisted to
// localStorage. Both the pop-out Speaker Notes window AND the main
// deck's bottom-sheet notes consume from this same store, so any
// edit in one view shows up in the other.
//
// Storage shape:
//   intro-ai-notes-overrides: { "<slideId>": ["note 1", "note 2", ...] }
//   intro-ai-notes-font-scale: number (1.0 = default)

import { slidesMeta } from './slides'

const NOTES_KEY = 'intro-ai-notes-overrides'
const FONT_KEY  = 'intro-ai-notes-font-scale'

const subscribers = new Set()

function safeGet(key, fallback) {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch { return fallback }
}

function safeSet(key, value) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function notify() {
  for (const fn of subscribers) {
    try { fn() } catch {}
  }
}

/** Subscribe to any change (note edit, font scale change, etc.). */
export function subscribe(handler) {
  subscribers.add(handler)
  return () => subscribers.delete(handler)
}

/* ---------- Notes ---------- */

function sourceNotes(slideId) {
  const meta = slidesMeta.find(s => s.id === slideId)
  return meta?.notes ? [...meta.notes] : []
}

/** Returns merged notes — override if present, otherwise source. */
export function getNotesForSlide(slideId) {
  const overrides = safeGet(NOTES_KEY, {})
  if (Array.isArray(overrides[slideId])) return overrides[slideId]
  return sourceNotes(slideId)
}

/** True if user has saved a custom version (different from source). */
export function hasOverride(slideId) {
  const overrides = safeGet(NOTES_KEY, {})
  return Array.isArray(overrides[slideId])
}

/** Save a full notes array for a slide. */
export function setNotesForSlide(slideId, items) {
  const overrides = safeGet(NOTES_KEY, {})
  overrides[slideId] = items.filter(s => s !== undefined)
  safeSet(NOTES_KEY, overrides)
  notify()
}

/** Append a new note (auto-creates an override if none exists). */
export function addNote(slideId, text = '') {
  const current = getNotesForSlide(slideId)
  setNotesForSlide(slideId, [...current, text])
}

/** Remove the note at the given index. */
export function deleteNote(slideId, index) {
  const current = getNotesForSlide(slideId)
  const next = current.filter((_, i) => i !== index)
  setNotesForSlide(slideId, next)
}

/** Update a single note in place. */
export function updateNote(slideId, index, text) {
  const current = [...getNotesForSlide(slideId)]
  current[index] = text
  setNotesForSlide(slideId, current)
}

/** Discard the override and revert to the source notes. */
export function resetNotesForSlide(slideId) {
  const overrides = safeGet(NOTES_KEY, {})
  if (slideId in overrides) {
    delete overrides[slideId]
    safeSet(NOTES_KEY, overrides)
    notify()
  }
}

/* ---------- Font scale ---------- */

const SCALE_STEPS = [0.85, 1.0, 1.2, 1.45, 1.75]

export function getFontScale() {
  const stored = safeGet(FONT_KEY, null)
  if (typeof stored === 'number' && SCALE_STEPS.includes(stored)) return stored
  return 1.0
}

export function setFontScale(value) {
  if (!SCALE_STEPS.includes(value)) return
  safeSet(FONT_KEY, value)
  notify()
}

export function bumpFontScale(delta) {
  const current = getFontScale()
  const idx = SCALE_STEPS.indexOf(current)
  const next = SCALE_STEPS[Math.max(0, Math.min(SCALE_STEPS.length - 1, idx + delta))]
  setFontScale(next)
  return next
}

export { SCALE_STEPS }
