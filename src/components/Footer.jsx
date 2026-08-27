import React from 'react'

export default function Footer({ setCurrentPage, onOpenRegister }) {
  return (
    <footer className="w-full py-16 px-5 md:px-[80px] flex flex-col md:flex-row justify-between items-center gap-6 bg-[#1A0A0A] border-t border-[#d4af37]/20 max-w-[1440px] mx-auto">
      <div className="font-['Cinzel'] text-2xl md:text-3xl font-bold text-[#f2ca50] text-center md:text-left">
        EGT 2.0
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <button 
          onClick={() => setCurrentPage('home')}
          className="font-['Work_Sans'] text-sm text-[#d0c5af] hover:text-[#f2ca50] transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        >
          Home Overview
        </button>
        <button 
          onClick={() => setCurrentPage('day1')}
          className="font-['Work_Sans'] text-sm text-[#d0c5af] hover:text-[#f2ca50] transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        >
          Day 1 Rules & Stage
        </button>
        <button 
          onClick={() => setCurrentPage('day2')}
          className="font-['Work_Sans'] text-sm text-[#d0c5af] hover:text-[#00F2FF] transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        >
          Day 2 Tech Arena
        </button>
        <button 
          onClick={onOpenRegister}
          className="font-['Work_Sans'] text-sm text-[#f2ca50] hover:underline transition-colors opacity-90 cursor-pointer"
        >
          Registration Portal
        </button>
      </div>

      <div className="font-['Work_Sans'] text-sm text-[#d0c5af] text-center md:text-right opacity-80">
        © 2026 Engineer's Got Talent 2.0. Department of CSE – Takshashila, Chandigarh University.
      </div>
    </footer>
  )
}
