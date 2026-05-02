// Client-side wrapper around the Netlify function that proxies the Anthropic API.

const ENDPOINT = '/.netlify/functions/chat'

/**
 * Buffered (non-streaming) call. Returns the full response text.
 */
export async function askClaude(prompt, options = {}) {
  const { system, maxTokens = 1024, messages } = options

  const body = {
    max_tokens: maxTokens,
    messages: messages || [{ role: 'user', content: prompt }],
    stream: false
  }
  if (system) body.system = system

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  if (Array.isArray(data.content)) {
    return data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('\n')
  }
  return data.text || ''
}

/**
 * Streaming call. Calls onChunk(textSoFar) as new tokens arrive.
 * Audience sees Claude generate token-by-token in real time — much more
 * compelling than a buffered response with a typewriter effect.
 *
 * @param {string} prompt
 * @param {object} options - { system, maxTokens, messages, onChunk, onDone, onError, signal }
 * @returns Promise<string> - the final full text
 */
export async function askClaudeStream(prompt, options = {}) {
  const { system, maxTokens = 1024, messages, onChunk, onDone, onError, signal } = options

  const body = {
    max_tokens: maxTokens,
    messages: messages || [{ role: 'user', content: prompt }],
    stream: true
  }
  if (system) body.system = system

  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal
    })
  } catch (err) {
    onError?.(err)
    throw err
  }

  if (!res.ok) {
    const errText = await res.text()
    const err = new Error(`API error ${res.status}: ${errText}`)
    onError?.(err)
    throw err
  }

  if (!res.body) {
    const err = new Error('No response body — streaming not supported by this server')
    onError?.(err)
    throw err
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let fullText = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Anthropic SSE format: event: <type>\ndata: <json>\n\n
      const lines = buffer.split('\n')
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const jsonStr = trimmed.slice(5).trim()
        if (!jsonStr || jsonStr === '[DONE]') continue

        try {
          const event = JSON.parse(jsonStr)
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            fullText += event.delta.text
            onChunk?.(fullText)
          } else if (event.type === 'message_stop') {
            // End of stream
          } else if (event.type === 'error') {
            const err = new Error(event.error?.message || 'API stream error')
            onError?.(err)
            throw err
          }
        } catch (e) {
          // Ignore parse errors for non-JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock?.()
  }

  onDone?.(fullText)
  return fullText
}

/**
 * Token-by-token reveal of an existing string. Fallback for non-streaming use.
 */
export function typewriter(text, onChunk, opts = {}) {
  const { speed = 18, chunkSize = 2 } = opts
  let i = 0
  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval)
      if (opts.onDone) opts.onDone()
      return
    }
    i = Math.min(i + chunkSize, text.length)
    onChunk(text.slice(0, i))
  }, speed)
  return () => clearInterval(interval)
}
