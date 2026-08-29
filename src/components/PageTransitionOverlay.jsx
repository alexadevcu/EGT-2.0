import React from 'react'

export default function PageTransitionOverlay({ transitionType }) {
  if (transitionType === 'idle') return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 🎭 DAY 1: SILKY VELVET STAGE SHUTTER (450ms) */}
      {/* ========================================================================= */}
      {transitionType === 'day1-spotlight' && (
        <div className="relative w-full h-full">
          {/* Top Stage Shutter Panel */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#1c0202] via-[#3d0505] to-[#120202] border-b-2 border-[#f7d978] shadow-[0_15px_40px_rgba(247,217,120,0.4)] animate-shutter-top-day1" />
          
          {/* Bottom Stage Shutter Panel */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1c0202] via-[#3d0505] to-[#120202] border-t-2 border-[#f7d978] shadow-[0_-15px_40px_rgba(247,217,120,0.4)] animate-shutter-bottom-day1" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🧙‍♂️ DAY 2: CYBER OBSIDIAN MAGIC PORTAL (480ms) */}
      {/* ========================================================================= */}
      {transitionType === 'day2-magic' && (
        <div className="relative w-full h-full">
          {/* Left Cyber Portal Panel */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#050811] via-[#091326] to-[#04060d] border-r-2 border-cyan-400 shadow-[20px_0_50px_rgba(34,211,238,0.5)] animate-shutter-left-day2" />
          
          {/* Right Cyber Portal Panel */}
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#050811] via-[#091326] to-[#04060d] border-l-2 border-cyan-400 shadow-[-20px_0_50px_rgba(34,211,238,0.5)] animate-shutter-right-day2" />
        </div>
      )}
    </div>
  )
}
