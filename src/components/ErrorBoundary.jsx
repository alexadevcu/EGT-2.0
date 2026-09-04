import React from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070709] text-[#f1f1f6] flex items-center justify-center p-6 text-center font-['Space_Grotesk']">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-[#f7d978]/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#f7d978] tracking-widest uppercase">
                Engineer's Got Talent 2.0
              </span>
              <h2 className="text-2xl font-black text-white font-['Syne']">
                Something Went Wrong
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                An unexpected display issue occurred. Your data has been securely saved. Please click below to refresh and return to the main stage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-xl bg-[#f7d978] hover:bg-[#e5b84c] text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
