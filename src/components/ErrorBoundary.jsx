import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-maroon-deep">कुछ गड़बड़ हो गई</h1>
          <p className="max-w-md text-sm text-stone">
            पेज में एक अनपेक्षित त्रुटि आ गई। कृपया पेज दोबारा लोड करके देखें।
            <span className="mt-2 block text-xs" lang="en">
              If this keeps happening, it&rsquo;s usually a missing or incorrect environment variable (check
              VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).
            </span>
          </p>
          <pre className="mt-2 max-w-md overflow-auto rounded bg-black/5 p-3 text-left text-xs text-red-800">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
