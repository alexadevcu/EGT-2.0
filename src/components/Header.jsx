import React, { useState } from 'react'

export default function Header({ currentPage, setCurrentPage, onOpenRegister }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 md:px-[80px] h-20 max-w-[1440px] left-1/2 -translate-x-1/2 bg-[#16130b]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(212,175,55,0.15)] border-b border-[#d4af37]/30">
      {/* Brand Title */}
      <div 
        onClick={() => setCurrentPage('home')}
        className="font-['Cinzel'] text-xl md:text-2xl font-bold tracking-widest text-[#f2ca50] cursor-pointer hover:opacity-90 transition-opacity"
      >
        Engineer's Got Talent 2.0
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 items-center">
        <button
          onClick={() => setCurrentPage('home')}
          className={`font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-colors duration-300 pb-1 ${
            currentPage === 'home'
              ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
              : 'text-[#d0c5af] hover:text-[#e9c349]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('day1')}
          className={`font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-colors duration-300 pb-1 ${
            currentPage === 'day1'
              ? 'text-[#f2ca50] border-b-2 border-[#f2ca50]'
              : 'text-[#d0c5af] hover:text-[#e9c349]'
          }`}
        >
          Day 1: The Stage
        </button>
        <button
          onClick={() => setCurrentPage('day2')}
          className={`font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider transition-colors duration-300 pb-1 ${
            currentPage === 'day2'
              ? 'text-[#00F2FF] border-b-2 border-[#00F2FF]'
              : 'text-[#d0c5af] hover:text-[#00F2FF]'
          }`}
        >
          Day 2: The Arena
        </button>
      </nav>

      {/* Desktop Register Button */}
      <button
        onClick={onOpenRegister}
        className="hidden md:block bg-[#d4af37] text-[#3c2f00] font-['Space_Grotesk'] text-xs font-bold uppercase px-6 py-2.5 rounded spotlight-glow transition-all duration-300 hover:scale-95 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.3)]"
      >
        Register Now
      </button>

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden text-[#f2ca50] p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-3xl">
          {mobileMenuOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#16130b] border-b border-[#d4af37]/30 p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50">
          <button
            onClick={() => {
              setCurrentPage('home')
              setMobileMenuOpen(false)
            }}
            className={`text-left font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider py-2 ${
              currentPage === 'home' ? 'text-[#f2ca50]' : 'text-[#d0c5af]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setCurrentPage('day1')
              setMobileMenuOpen(false)
            }}
            className={`text-left font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider py-2 ${
              currentPage === 'day1' ? 'text-[#f2ca50]' : 'text-[#d0c5af]'
            }`}
          >
            Day 1: The Stage (9 Sept)
          </button>
          <button
            onClick={() => {
              setCurrentPage('day2')
              setMobileMenuOpen(false)
            }}
            className={`text-left font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider py-2 ${
              currentPage === 'day2' ? 'text-[#00F2FF]' : 'text-[#d0c5af]'
            }`}
          >
            Day 2: The Arena (10 Sept)
          </button>
          <button
            onClick={() => {
              onOpenRegister()
              setMobileMenuOpen(false)
            }}
            className="w-full bg-[#d4af37] text-[#3c2f00] font-['Space_Grotesk'] text-sm font-bold uppercase py-3 rounded text-center mt-2"
          >
            Register Now
          </button>
        </div>
      )}
    </header>
  )
}
