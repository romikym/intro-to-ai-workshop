// Netlify function: /.netlify/functions/qa
// Manages live Q&A submissions. Uses Netlify Blobs for persistence.
//
// GET    → returns all questions, sorted by submitted timestamp (newest first)
// POST   → submit a new question { text, name? }
// DELETE → admin actions: clear all, mark answered, pin, etc.

import { getStore } from '@netlify/blobs'

const STORE_NAME = 'qa'
const KEY = 'questions'
const MAX_QUESTIONS = 200       // hard cap to keep the store reasonable
const MAX_TEXT_LENGTH = 500
const MAX_NAME_LENGTH = 60

export default async (request) => {
  // CORS — allow any origin since the audience may load from various URLs
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  let store
  try {
    store = getStore(STORE_NAME)
  } catch (err) {
    // If running outside a Netlify environment with Blobs, fall through gracefully
    return json({ error: 'Q&A store unavailable. Deploy to Netlify to enable.', detail: err.message }, 500, corsHeaders)
  }

  if (request.method === 'GET') {
    const questions = await loadQuestions(store)
    return json({ questions }, 200, corsHeaders)
  }

  if (request.method === 'POST') {
    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON' }, 400, corsHeaders)
    }

    const text = String(body.text || '').trim()
    const name = String(body.name || '').trim()

    if (!text) return json({ error: 'Question text is required' }, 400, corsHeaders)
    if (text.length > MAX_TEXT_LENGTH) {
      return json({ error: `Question too long (max ${MAX_TEXT_LENGTH} characters)` }, 400, corsHeaders)
    }

    const question = {
      id: makeId(),
      text,
      name: name.slice(0, MAX_NAME_LENGTH),
      submitted: Date.now(),
      answered: false,
      pinned: false
    }

    const questions = await loadQuestions(store)
    questions.unshift(question)
    // Cap the array
    if (questions.length > MAX_QUESTIONS) questions.length = MAX_QUESTIONS

    await store.setJSON(KEY, questions)
    return json({ ok: true, question }, 200, corsHeaders)
  }

  if (request.method === 'DELETE') {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    const id = url.searchParams.get('id')

    if (action === 'clear') {
      await store.setJSON(KEY, [])
      return json({ ok: true, cleared: true }, 200, corsHeaders)
    }

    if (action === 'answered' && id) {
      const questions = await loadQuestions(store)
      const updated = questions.map(q => q.id === id ? { ...q, answered: !q.answered } : q)
      await store.setJSON(KEY, updated)
      return json({ ok: true }, 200, corsHeaders)
    }

    if (action === 'mark-answered' && id) {
      // Idempotent: always sets answered to true. Used by the live queue
      // so a handled question can never reappear.
      const questions = await loadQuestions(store)
      const updated = questions.map(q => q.id === id ? { ...q, answered: true } : q)
      await store.setJSON(KEY, updated)
      return json({ ok: true }, 200, corsHeaders)
    }

    if (action === 'pin' && id) {
      const questions = await loadQuestions(store)
      const updated = questions.map(q => q.id === id ? { ...q, pinned: !q.pinned } : q)
      await store.setJSON(KEY, updated)
      return json({ ok: true }, 200, corsHeaders)
    }

    if (id) {
      const questions = await loadQuestions(store)
      const filtered = questions.filter(q => q.id !== id)
      await store.setJSON(KEY, filtered)
      return json({ ok: true }, 200, corsHeaders)
    }

    return json({ error: 'Specify ?id=X or ?action=clear|answered|pin' }, 400, corsHeaders)
  }

  return json({ error: 'Method not allowed' }, 405, corsHeaders)
}

async function loadQuestions(store) {
  try {
    const data = await store.get(KEY, { type: 'json' })
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function json(obj, status, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers }
  })
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export const config = {
  path: '/.netlify/functions/qa'
}
