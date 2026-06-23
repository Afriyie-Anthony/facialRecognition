import { Component } from 'react';

/**
 * ErrorBoundary — catches any unhandled JS errors in the component tree
 * and shows a friendly fallback screen instead of a blank white page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourPage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console (swap for Sentry / LogRocket in production)
    console.error('ErrorBoundary caught an error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="text-5xl">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
          <p className="text-slate-500 text-sm">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {this.state.error && (
            <details className="text-left bg-slate-100 rounded-lg p-3 text-xs text-slate-600 cursor-pointer">
              <summary className="font-medium">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition text-sm font-medium"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-5 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
