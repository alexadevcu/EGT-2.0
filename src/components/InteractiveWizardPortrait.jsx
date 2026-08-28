import React, { useState, useRef } from 'react'
import wizardImg from '../assets/wizard_dumbledore.jpg'
import { Sparkles, Eye, Wand2 } from 'lucide-react'

export default function InteractiveWizardPortrait() {
  const containerRef = useRef(null)
  const [headStyle, setHeadStyle] = useState('perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)')
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Head rotation centered on neck pivot (Max ±25 deg)
    const rotateY = ((x - centerX) / centerX) * 26
    const rotateX = -((y - centerY) / centerY) * 18
    const shiftX = ((x - centerX) / centerX) * 12
    const shiftY = ((y - centerY) / centerY) * 8

    // Calculate light glow percentage position
    const glowX = (x / rect.width) * 100
    const glowY = (y / rect.height) * 100

    setHeadStyle(`perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 12px)`)
    setGlowPos({ x: glowX, y: glowY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setHeadStyle('perspective(800px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0px)')
    setGlowPos({ x: 50, y: 50 })
  }

  return (
    <div className="w-full max-w-md mx-auto my-6 px-4">
      {/* Outer Magical Card Holder */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group cursor-pointer rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#16273b] via-[#0d1b2a] to-[#08101a] border-2 border-[#00F2FF]/40 shadow-[0_0_50px_rgba(0,242,255,0.25)] hover:border-[#f2ca50] transition-all duration-300"
      >
        {/* Hogwarts Ornate Golden Trim Header Badge */}
        <div className="flex items-center justify-between px-3 py-1.5 mb-3 rounded-xl bg-[#00F2FF]/10 border border-[#00F2FF]/30 font-['Space_Grotesk'] text-xs text-cyan-300 font-bold">
          <div className="flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-[#f2ca50] animate-pulse" />
            <span>Interactive Headmaster Portrait</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#f2ca50] uppercase tracking-wider">
            <Eye className="w-3 h-3" />
            <span>Hover To Turn Head</span>
          </div>
        </div>

        {/* 3D Moving Portrait Frame */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#050b14]">
          
          {/* Base Layer: Stationary Body & Robes */}
          <img
            src={wizardImg}
            alt="Wizard Body Stationary Base"
            className="absolute inset-0 w-full h-full object-cover object-top select-none filter brightness-90 contrast-105"
          />

          {/* Isolated Head & Hat Layer: Pivots 3D from the neck */}
          <div
            className="absolute inset-0 transition-transform duration-100 ease-out preserve-3d pointer-events-none"
            style={{
              transform: headStyle,
              transformOrigin: '50% 68%' // Anchored at the neck!
            }}
          >
            <img
              src={wizardImg}
              alt="Wizard Head Tracking Layer"
              className="w-full h-full object-cover object-top select-none filter contrast-110 drop-shadow-[0_12px_25px_rgba(0,0,0,0.85)]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 72%, 0% 72%)' // Focuses on hat, eyes, glasses & head
              }}
            />
          </div>

          {/* Dynamic Spell Lighting Aura Overlay */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 0.7 : 0.2,
              background: `radial-gradient(circle 190px at ${glowPos.x}% ${glowPos.y}%, rgba(0, 242, 255, 0.45), rgba(242, 202, 80, 0.25) 40%, transparent 85%)`
            }}
          ></div>

          {/* Inner Vignette Shadow Frame */}
          <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-black/20 to-black/80 z-20"></div>

          {/* Bottom Spell Seal Badge */}
          <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-[#f2ca50]/50 flex items-center justify-between text-white font-['Cinzel'] z-30">
            <div>
              <p className="text-xs font-bold text-[#f2ca50] tracking-wider">Albus Dumbledore</p>
              <p className="text-[10px] font-['Space_Grotesk'] text-gray-300">Guardian of Tech Wizards</p>
            </div>
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Instructional Helper text below */}
        <p className="text-center font-['Space_Grotesk'] text-[11px] text-cyan-300/80 mt-3 font-medium tracking-wide">
          ✨ {isHovered ? "The Headmaster's face is turning with your cursor!" : "Move cursor across the portrait to see his head & hat pivot!"}
        </p>
      </div>
    </div>
  )
}
