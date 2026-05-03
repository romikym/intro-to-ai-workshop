import { useSyncExternalStore } from 'react'
import * as notesStore from '../lib/notesStore'

// Single subscribe function reused for both selectors so the same
// store change triggers both hooks at once.
function subscribe(handler) {
  return notesStore.subscribe(handler)
}

/** Returns the merged notes array for a slide (override or source). */
export function useSlideNotes(slideId) {
  return useSyncExternalStore(
    subscribe,
    () => notesStore.getNotesForSlide(slideId),
    () => notesStore.getNotesForSlide(slideId)
  )
}

/** Returns whether there's a saved override (i.e., notes differ from source). */
export function useHasNotesOverride(slideId) {
  return useSyncExternalStore(
    subscribe,
    () => notesStore.hasOverride(slideId),
    () => false
  )
}

/** Returns the persisted font-scale multiplier for the speaker notes window. */
export function useNotesFontScale() {
  return useSyncExternalStore(
    subscribe,
    () => notesStore.getFontScale(),
    () => 1.0
  )
}
