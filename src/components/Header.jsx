import React, { useState, useEffect } from 'react'
import cuLogo from '../assets/Logo/CU Logo red &white.png'
import alexaLogo from '../assets/Logo/Alexa Developers Community Logo.png'
import gfgLogo from '../assets/Logo/GfG Horizontal Combination Mark (Dark Mode)@2x.png'
import { Menu, X, Mail } from 'lucide-react'

export default function Header({ currentPage, setCurrentPage, onOpenRegister, onOpenContact }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent background body scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [mobileMenuOpen])

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact()
    } else {
      const el = document.getElementById('contact-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.href = 'mailto:adc.cu@cumail.in'
      }
    }
  }

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-2 sm:px-4">
      {/* Seamless Translucent Floating Glass Navigation Capsule */}
      <div className="w-full max-w-5xl bg-[#090708]/90 backdrop-blur-xl border border-white/15 rounded-full px-4 sm:px-7 py-2.5 sm:py-3 flex justify-between items-center shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
        
        {/* Left: Logos (CU | Alexa) Floating Directly on Glass */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink min-w-0">
          <img
            src={cuLogo}
            alt="Chandigarh University"
            onClick={() => setCurrentPage('home')}
            className="h-7 xs:h-8.5 sm:h-9.5 object-contain max-w-[95px] xs:max-w-[125px] sm:max-w-[150px] shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
          />
          <div className="h-6 sm:h-7 w-[1px] bg-white/25 shrink-0"></div>

          <a
            href="https://alexa-developers-at-cu.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            title="Visit Official Alexa Developers Community Website"
            className="flex items-center hover:opacity-85 transition-opacity shrink-0"
          >
            <img
              src={alexaLogo}
              alt="Alexa Developers Community"
              className="h-7.5 xs:h-9 sm:h-10.5 object-contain max-w-[115px] xs:max-w-[145px] sm:max-w-[185px] shrink-0"
            />
          </a>
        </div>

        {/* Center: Clean Navigation Links (HOME | DAY 1 STAGE | DAY 2 TECH) */}
        <nav className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setCurrentPage('home')}
            className={`transition-colors cursor-pointer ${currentPage === 'home'
                ? 'text-[#f7d978] border-b-2 border-[#f7d978] pb-0.5'
                : 'text-gray-300 hover:text-[#f7d978]'
              }`}
          >
            HOME
          </button>
          <button
            onClick={() => setCurrentPage('day1')}
            className={`transition-colors cursor-pointer ${currentPage === 'day1'
                ? 'text-rose-400 border-b-2 border-rose-400 pb-0.5'
                : 'text-gray-300 hover:text-rose-400'
              }`}
          >
            DAY 1 STAGE
          </button>
          <button
            onClick={() => setCurrentPage('day2')}
            className={`transition-colors cursor-pointer ${currentPage === 'day2'
                ? 'text-cyan-400 border-b-2 border-cyan-400 pb-0.5'
                : 'text-gray-300 hover:text-cyan-400'
              }`}
          >
            DAY 2 TECH
          </button>
          <button
            onClick={() => setCurrentPage('guidelines')}
            className={`transition-colors cursor-pointer ${currentPage === 'guidelines'
                ? 'text-amber-400 border-b-2 border-amber-400 pb-0.5'
                : 'text-gray-300 hover:text-amber-400'
              }`}
          >
            RULES
          </button>
        </nav>

        {/* Right: Golden CONTACT US Pill Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleContactClick}
            className="hidden sm:flex bg-gradient-to-r from-[#e5b84c] via-[#f7d978] to-[#c9982e] text-[#1c0800] font-['Space_Grotesk'] text-xs font-extrabold uppercase px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-[0_0_20px_rgba(247,217,120,0.4)] hover:scale-105 transition-all cursor-pointer border border-yellow-200/50 tracking-wider whitespace-nowrap items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>CONTACT US</span>
          </button>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-full bg-white/10 text-[#f7d978] hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-4 top-20 bg-[#09090d]/98 backdrop-blur-2xl rounded-3xl p-6 flex flex-col gap-3 md:hidden shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300 z-50 text-center font-['Space_Grotesk']">
          <button
            onClick={() => {
              setCurrentPage('home')
              setMobileMenuOpen(false)
            }}
            className={`p-3 rounded-xl font-bold uppercase ${currentPage === 'home' ? 'bg-[#f7d978] text-[#1c0800]' : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            HOME
          </button>
          <button
            onClick={() => {
              setCurrentPage('day1')
              setMobileMenuOpen(false)
            }}
            className={`p-3 rounded-xl font-bold uppercase ${currentPage === 'day1' ? 'bg-rose-500 text-white' : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            DAY 1 STAGE (9 SEPT)
          </button>
          <button
            onClick={() => {
              setCurrentPage('day2')
              setMobileMenuOpen(false)
            }}
            className={`p-3 rounded-xl font-bold uppercase ${currentPage === 'day2' ? 'bg-cyan-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            DAY 2 TECH (10 SEPT)
          </button>
          <button
            onClick={() => {
              setCurrentPage('guidelines')
              setMobileMenuOpen(false)
            }}
            className={`p-3 rounded-xl font-bold uppercase ${currentPage === 'guidelines' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/5'
              }`}
          >
            EVENT RULES &amp; GUIDELINES
          </button>
          <button
            onClick={() => {
              handleContactClick()
              setMobileMenuOpen(false)
            }}
            className="w-full bg-gradient-to-r from-[#e5b84c] via-[#f7d978] to-[#c9982e] text-[#1c0800] font-black uppercase py-3.5 rounded-full shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            CONTACT US
          </button>
        </div>
      )}
    </header>
  )
}
