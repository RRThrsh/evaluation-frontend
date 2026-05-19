import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-sm text-slate-500 mb-2">{this.state.error?.message || "An unexpected error occurred"}</p>
            {this.state.error?.stack && (
              <details className="text-xs text-left text-slate-400 mb-6 max-h-32 overflow-y-auto bg-slate-100 rounded-lg p-3">
                <summary className="cursor-pointer font-medium">Stack trace</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.stack}</pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Reload Page
              </button>
              <button onClick={() => { this.setState({ hasError: false }); window.location.href = "/"; }}
                className="px-6 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition">
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
