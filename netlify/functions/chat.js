// Netlify function: /.netlify/functions/chat
// Proxies requests to the Anthropic Messages API.
// Supports both buffered (single response) and streaming (SSE) modes.

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const DEFAULT_MODEL = 'claude-sonnet-4-5'

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'Server not configured',
        detail: 'ANTHROPIC_API_KEY environment variable is missing. Set it in Netlify > Site settings > Environment variables.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  let body
  try {
    body = await request.json()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { messages, system, max_tokens = 1024, model = DEFAULT_MODEL, stream = false } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const payload = {
    model,
    max_tokens,
    messages,
    stream
  }
  if (system) payload.system = system

  try {
    const apiRes = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(payload)
    })

    if (!apiRes.ok) {
      // For non-OK responses, parse error body
      const data = await apiRes.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Anthropic API error:', data)
      return new Response(JSON.stringify(data), {
        status: apiRes.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (stream) {
      // Stream-through: pass the SSE stream directly to the client
      return new Response(apiRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no'
        }
      })
    }

    // Non-streaming: buffer and return as JSON
    const data = await apiRes.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Proxy error:', err)
    return new Response(
      JSON.stringify({
        error: 'Proxy request failed',
        detail: err.message
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  path: '/.netlify/functions/chat'
}
