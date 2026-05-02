// Client-side wrapper for the Q&A API.

const ENDPOINT = '/.netlify/functions/qa'

export async function listQuestions() {
  const res = await fetch(ENDPOINT, { method: 'GET' })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`List failed (${res.status}): ${err}`)
  }
  const data = await res.json()
  return data.questions || []
}

export async function submitQuestion({ text, name }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, name })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Submit failed (${res.status})`)
  }
  return res.json()
}

export async function deleteQuestion(id) {
  const res = await fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed (${res.status})`)
  return res.json()
}

export async function clearAll() {
  const res = await fetch(`${ENDPOINT}?action=clear`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Clear failed (${res.status})`)
  return res.json()
}

export async function toggleAnswered(id) {
  const res = await fetch(`${ENDPOINT}?action=answered&id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Toggle answered failed (${res.status})`)
  return res.json()
}

/**
 * Idempotent — always sets answered to true, never toggles back.
 * Use this when handling a question (Ask aloud / Claude answers) so the
 * card never accidentally re-appears in the live queue.
 */
export async function markAnswered(id) {
  const res = await fetch(`${ENDPOINT}?action=mark-answered&id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Mark answered failed (${res.status})`)
  return res.json()
}

export async function togglePinned(id) {
  const res = await fetch(`${ENDPOINT}?action=pin&id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Toggle pin failed (${res.status})`)
  return res.json()
}

/**
 * Hook-friendly poller. Returns a controller object with start/stop.
 * onUpdate(questions) is called with the latest list whenever it changes.
 */
export function createPoller({ intervalMs = 4000, onUpdate, onError }) {
  let timer = null
  let stopped = false
  let lastSerialized = ''

  async function tick() {
    if (stopped) return
    try {
      const questions = await listQuestions()
      const ser = JSON.stringify(questions.map(q => [q.id, q.answered, q.pinned]))
      if (ser !== lastSerialized) {
        lastSerialized = ser
        onUpdate?.(questions)
      }
    } catch (err) {
      onError?.(err)
    } finally {
      if (!stopped) timer = setTimeout(tick, intervalMs)
    }
  }

  return {
    start() { stopped = false; tick() },
    stop() { stopped = true; if (timer) clearTimeout(timer) }
  }
}
 await listQuestions()
      const ser = JSON.stringify(questions.map(q => [q.id, q.answered, q.pinned]))
      if (ser !== lastSerialized) {
        lastSerialized = ser
        onUpdate?.(questions)
      }
    } catch (err) {
      onError?.(err)
    } finally {
      if (!stopped) timer = setTimeout(tick, intervalMs)
    }
  }

  return {
    start() { stopped = false; tick() },
    stop() { stopped = true; if (timer) clearTimeout(timer) }
  }
}
