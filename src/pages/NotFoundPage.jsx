import React from 'react'
import { ArrowLeft, Home, Sparkles, AlertTriangle } from 'lucide-react'

export default function NotFoundPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] flex flex-col items-center justify-center px-4 sm:px-6 text-center pt-24 pb-16 relative overflow-hidden">
      
      {/* Ambient Red & Gold Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-lg mx-auto space-y-6">
        
        {/* Badge */}
        <span className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 font-['Space_Grotesk'] text-xs font-bold border border-rose-500/30 uppercase tracking-widest inline-flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Error 404 • Page Not Found</span>
        </span>

        {/* Big 404 Heading */}
        <h1 className="font-['Syne'] text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e5b84c] via-[#f7d978] to-[#c9982e] drop-shadow-[0_0_35px_rgba(247,217,120,0.4)]">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">
            Lost Behind the Curtains?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-gray-300 font-light leading-relaxed max-w-md mx-auto">
            The stage path or chamber route you are searching for doesn’t exist or has moved on Engineer’s Got Talent 2.0.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full sm:w-auto btn-primary-gold text-xs px-8 py-3.5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Stage</span>
          </button>

          <button
            onClick={() => setCurrentPage('day1')}
            className="w-full sm:w-auto btn-secondary-glass text-xs px-6 py-3.5 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Day 1 Stage</span>
          </button>
        </div>
      </div>
    </div>
  )
}
