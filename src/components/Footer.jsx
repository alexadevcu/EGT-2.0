import React from 'react'
import { Sparkles, ArrowUp } from 'lucide-react'

export default function Footer({ setCurrentPage, onOpenRegister }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full bg-[#050507] border-t border-white/10 py-12 px-4 sm:px-6 md:px-12 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-xl font-extrabold text-white">EGT 2.0</div>
            <p className="font-sans text-xs text-gray-400 font-light">
              Department of CSE – Takshashila, Chandigarh University
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs font-mono font-semibold uppercase text-gray-300">
          <button
            onClick={() => setCurrentPage('home')}
            className="hover:text-yellow-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setCurrentPage('day1')}
            className="hover:text-rose-400 transition-colors cursor-pointer"
          >
            Day 1 Stage
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setCurrentPage('day2')}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Day 2 Tech Arena
          </button>
          <span>&bull;</span>
          <button
            onClick={onOpenRegister}
            className="text-yellow-400 hover:underline cursor-pointer"
          >
            Registration Portal
          </button>
        </div>

        {/* Copyright & Scroll Top */}
        <div className="flex items-center gap-4 text-xs font-sans text-gray-400">
          <span>© 2026 Engineer's Got Talent 2.0</span>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Scroll to top"
            aria-label="Scroll back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  )
}
