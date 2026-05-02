import { useCallback, useEffect, useRef, useState } from 'react'
import { askClaudeStream } from '../lib/chat'

/**
 * Multi-turn chat hook. Encapsulates streaming, abort, and conversation
 * history so both the LiveChat modal and the persistent ChatSlide can
 * share behavior.
 *
 * Pass `store` to persist messages across mount/unmount. Without a store,
 * conversation state is component-local and resets when the component
 * unmounts (which is what we want for the modal — a fresh chat each open).
 *
 * @param {object} opts
 * @param {string} [opts.systemPrompt]
 * @param {number} [opts.maxTokens=1024]
 * @param {{ getState, setState, subscribe }} [opts.store] - external store for persistence
 */
export default function useChat({ systemPrompt, maxTokens = 1024, store } = {}) {
  // Initial messages come from the external store if provided, otherwise empty.
  const [messages, _setMessages] = useState(() => store?.getState()?.messages ?? [])
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const streamingTextRef = useRef('')

  // Keep streamingText ref in sync so abort handler can grab current partial.
  useEffect(() => { streamingTextRef.current = streamingText }, [streamingText])

  // Subscribe to store updates so external changes (e.g. clear from another
  // component) flow back into local state.
  useEffect(() => {
    if (!store) return
    const unsub = store.subscribe((s) => _setMessages(s.messages))
    return unsub
  }, [store])

  // Helper that writes through to the store if present.
  const setMessages = useCallback((updater) => {
    if (store) {
      store.setState((s) => ({
        ...s,
        messages: typeof updater === 'function' ? updater(s.messages) : updater
      }))
    } else {
      _setMessages(updater)
    }
  }, [store])

  const send = useCallback(async (rawPrompt) => {
    const prompt = (rawPrompt ?? '').trim()
    if (!prompt || streaming) return

    setError(null)
    setStreamingText('')
    streamingTextRef.current = ''

    // Snapshot history including the new user turn — this is what we send
    // to the API so Claude sees the full conversation.
    const userMsg = { role: 'user', content: prompt }
    const historyForApi = [...(store?.getState()?.messages ?? messages), userMsg]
    setMessages(historyForApi)
    setStreaming(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    let aborted = false
    let apiError = null

    try {
      await askClaudeStream(prompt, {
        system: systemPrompt,
        maxTokens,
        messages: historyForApi,
        signal: ctrl.signal,
        onChunk: (text) => {
          setStreamingText(text)
          streamingTextRef.current = text
        },
        onError: (err) => {
          if (err?.name === 'AbortError') {
            aborted = true
          } else {
            apiError = err
          }
        }
      })
    } catch (err) {
      if (err?.name === 'AbortError') {
        aborted = true
      } else if (!apiError) {
        apiError = err
      }
    } finally {
      const finalText = streamingTextRef.current
      // Append the assistant turn — preserve partial output if the user
      // stopped mid-stream so they can still see what was generated.
      if (finalText) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: finalText,
            stopped: aborted || undefined
          }
        ])
      } else if (aborted) {
        // Nothing generated — drop the user message so the UI doesn't show
        // a dangling prompt with no reply.
        setMessages((prev) => prev.slice(0, -1))
      }

      if (apiError) {
        setError(
          apiError.message?.includes('not configured')
            ? 'API key not configured. Set ANTHROPIC_API_KEY in your Netlify environment variables.'
            : `Could not reach Claude: ${apiError.message || 'unknown error'}`
        )
        // Roll back the user message on hard error so they can retry.
        if (!finalText) {
          setMessages((prev) => prev.slice(0, -1))
        }
      }

      setStreaming(false)
      setStreamingText('')
      streamingTextRef.current = ''
      abortRef.current = null
    }
  }, [streaming, systemPrompt, maxTokens, store, messages, setMessages])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clear = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setStreamingText('')
    streamingTextRef.current = ''
  }, [setMessages])

  return {
    messages,
    streaming,
    streamingText,
    error,
    send,
    stop,
    clear,
    isEmpty: messages.length === 0 && !streaming
  }
}
