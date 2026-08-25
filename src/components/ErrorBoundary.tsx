import { Component, type ReactNode } from 'react'

// A crash in one component must never blank the whole desktop. This catches it,
// renders a fallback in that component's place, and leaves everything else alone.
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    // Surface it in the console so the real message is recoverable in dev.
    console.error('[ErrorBoundary]', error)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 13, color: '#c2410c' }}>
            <strong>Something crashed.</strong>
            <div style={{ marginTop: 8, color: '#333' }}>{this.state.error.message}</div>
          </div>
        )
      )
    }
    return this.props.children
  }
}
