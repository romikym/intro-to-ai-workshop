import React from 'react'

/**
 * Top-level error boundary. Catches anything that throws during render
 * so the user sees a visible error message instead of a blank screen.
 * Without this, a single bad component in a deeply-nested tree silently
 * unmounts the whole app — exactly what just happened in production.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    this.setState({ info })
    // Also log to console so DevTools captures it.
    // eslint-disable-next-line no-console
    console.error('App crashed at top level:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          padding: '40px 24px',
          background: '#07060F',
          color: '#fff',
          fontFamily: '"Inter Tight", system-ui, sans-serif'
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 700,
              color: '#FF7C82',
              marginBottom: 12
            }}
          >
            Runtime error
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            The app crashed during render.
          </h1>
          <div
            style={{
              padding: '16px 18px',
              background: 'rgba(255, 124, 130, 0.08)',
              border: '1px solid rgba(255, 124, 130, 0.25)',
              borderRadius: 14,
              marginBottom: 18,
              fontFamily: 'ui-monospace, "JetBrains Mono", monospace',
              fontSize: 14,
              lineHeight: 1.5,
              color: '#FFB8BD',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {this.state.error?.message || String(this.state.error)}
          </div>
          {this.state.info?.componentStack && (
            <details style={{ marginBottom: 18 }}>
              <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                Component stack
              </summary>
              <pre
                style={{
                  marginTop: 12,
                  padding: 14,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: 'rgba(255,255,255,0.7)',
                  overflowX: 'auto'
                }}
              >
                {this.state.info.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, #2997FF, #6366F1)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      </div>
    )
  }
}
