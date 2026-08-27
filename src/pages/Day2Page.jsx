import React from 'react'

export default function Day2Page({ onOpenRegister }) {
  return (
    <div className="w-full relative bg-[#0A192F] text-[#eae1d4] min-h-screen wizard-bg overflow-hidden">
      {/* Magical Particle Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#00F2FF] animate-ping shadow-[0_0_10px_#00F2FF]"></div>
        <div
          className="absolute top-3/4 left-1/3 w-3 h-3 rounded-full bg-[#f2ca50] animate-pulse shadow-[0_0_15px_#f2ca50]"
          style={{ animationDuration: '3s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-[#00F2FF] animate-ping shadow-[0_0_10px_#00F2FF]"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse shadow-[0_0_10px_#f2ca50]"
          style={{ animationDuration: '2.5s' }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[720px] flex flex-col items-center justify-center text-center px-5 md:px-[80px] pt-16">
          <div
            className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-screen"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBmXaQxgKVI6vX4I3jst6w6SwiwxP1hA7loqUgiAnU5lmt0KAN6rbZ6I3IXMeaCa2r1etnKYw76tdFJfSbMjJMet6vqkqinLC_ER9QXBXtSSYmwATie8PlO9vuyON5LpkMx--W5dYL2rRzEyVmHFSgsy6rTtalgMXt5Pjb1_1ZKlbNNtQiCOEJ3OuvhWKr16MLSZ1w7jpiwg9rGojZKJQpK_xAtkFCVF2dd8EJFx7UoKDc4_Rgdv8cf')`
            }}
          ></div>

          <div className="relative z-10 space-y-6 max-w-4xl mx-auto mt-8">
            <div className="inline-block px-4 py-1.5 rounded-full border border-[#00F2FF]/50 bg-[#2D1B4E]/50 text-[#00F2FF] font-['Space_Grotesk'] text-xs font-bold tracking-widest uppercase mb-4">
              Day 2 — 10 September 2026
            </div>

            <h1 className="font-['Cinzel'] text-3xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F2FF] via-[#f2ca50] to-[#00F2FF] leading-tight drop-shadow-lg uppercase rune-glow">
              The Arena:<br />Triwizard Tournament
            </h1>

            <p className="font-['Work_Sans'] text-base md:text-lg text-[#d0c5af] max-w-2xl mx-auto mt-6 leading-relaxed">
              Gather your coven. Enter a dark arena where intellect is your wand and speed is your spell.
            </p>

            <div className="pt-8 flex flex-col items-center gap-4">
              <button
                onClick={() => onOpenRegister('day2-wizard')}
                className="bg-[#d4af37] text-[#3c2f00] px-8 md:px-10 py-4 rounded-full font-['Cinzel'] font-bold text-base md:text-xl hover:shadow-[0_0_30px_rgba(212,175,55,0.8)] hover:scale-105 transition-all duration-300 uppercase animate-pulse border-2 border-[#f2ca50] cursor-pointer"
              >
                Register your Squad (3-4 Wizards)
              </button>
            </div>
          </div>

          <div className="mt-16 animate-bounce opacity-70 text-[#00F2FF]">
            <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
          </div>
        </section>

        {/* Tournament Stages Section */}
        <section className="py-20 md:py-28 px-5 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="text-center mb-16 relative">
            <h2 className="font-['Cinzel'] text-3xl md:text-5xl font-semibold text-[#00F2FF] uppercase inline-block relative rune-glow">
              Tournament Stages
              <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50] to-transparent shadow-[0_0_10px_#f2ca50]"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto">
            {/* Round 1 */}
            <div className="md:col-span-12 glass-card rounded-xl p-8 hover:-translate-y-2 transition-transform duration-300 group border-l-4 border-l-[#f2ca50] relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 text-[#f2ca50] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '150px' }}>
                  account_balance
                </span>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-16 h-16 shrink-0 rounded-full bg-[#2D1B4E]/80 flex items-center justify-center border-2 border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.5)]">
                  <span className="material-symbols-outlined text-[#f2ca50] text-3xl group-hover:animate-spin">
                    psychology
                  </span>
                </div>
                <div>
                  <div className="text-[#00F2FF] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest mb-1">
                    Round 1 • Seminar Hall
                  </div>
                  <h3 className="font-['Cinzel'] text-2xl font-bold text-[#f2ca50] mb-2 rune-glow">
                    The Chamber of Logic
                  </h3>
                  <p className="text-[#d0c5af] font-['Work_Sans'] text-base md:text-lg leading-relaxed">
                    A cerebral 10+1 challenge. Decipher the 10 cryptic answers to reveal the master 11th key. Only the sharpest minds will survive the chamber.
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard Banner */}
            <div className="md:col-span-12 rounded-xl p-6 bg-gradient-to-r from-[#2D1B4E]/60 via-[#93000a]/40 to-[#2D1B4E]/60 border border-[#B22222]/40 text-center relative overflow-hidden flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(178,34,34,0.3)]">
              <span className="material-symbols-outlined text-[#ffb4ab] animate-pulse">
                crisis_alert
              </span>
              <h3 className="font-['Cinzel'] text-lg md:text-xl font-medium text-[#ffdad6] uppercase tracking-widest m-0">
                Live Leaderboard Cut-off: Only the Top 20 Teams Advance
              </h3>
              <span className="material-symbols-outlined text-[#ffb4ab] animate-pulse">
                crisis_alert
              </span>
            </div>

            {/* Round 2 */}
            <div className="md:col-span-7 glass-card rounded-xl p-8 hover:-translate-y-2 transition-transform duration-300 group border-l-4 border-l-[#00F2FF] relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-5 text-[#00F2FF] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '120px' }}>
                  qr_code_scanner
                </span>
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#2D1B4E]/80 flex items-center justify-center mb-4 border-2 border-[#00F2FF] shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                  <span className="material-symbols-outlined text-[#00F2FF] text-2xl group-hover:scale-110 transition-transform">
                    map
                  </span>
                </div>
                <div className="text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest mb-1">
                  Round 2 • Campus Wide
                </div>
                <h3 className="font-['Cinzel'] text-2xl font-bold text-[#00F2FF] mb-2 rune-glow">
                  The Forbidden Grounds
                </h3>
                <p className="text-[#d0c5af] font-['Work_Sans'] text-base leading-relaxed">
                  A fast-paced QR code hunt across 6 mysterious campus locations. Speed and teamwork are your only defenses against the ticking clock.
                </p>
              </div>
            </div>

            {/* The Finish Line */}
            <div className="md:col-span-5 glass-card rounded-xl p-8 hover:-translate-y-2 transition-transform duration-300 group border-l-4 border-l-[#f2ca50] relative overflow-hidden mana-pulse bg-[#2D1B4E]/40">
              <div className="absolute right-0 top-0 opacity-5 text-[#f2ca50] transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>
                  flag
                </span>
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#2D1B4E]/80 flex items-center justify-center mb-4 border-2 border-[#f2ca50] shadow-[0_0_15px_rgba(242,202,80,0.5)]">
                  <span className="material-symbols-outlined text-[#f2ca50] text-2xl group-hover:scale-110 transition-transform">
                    sports_score
                  </span>
                </div>
                <div className="text-[#00F2FF] font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest mb-1">
                  The Climax • Seminar Hall
                </div>
                <h3 className="font-['Cinzel'] text-2xl font-bold text-[#f2ca50] mb-2 rune-glow">
                  The Champion's Flag
                </h3>
                <p className="text-[#d0c5af] font-['Work_Sans'] text-base leading-relaxed">
                  A final desperate dash back to the Seminar Hall. Claim the flag and etch your squad's name into eternity.
                </p>
              </div>
            </div>

            {/* Bottom CTA Button */}
            <div className="md:col-span-12 text-center mt-8">
              <button
                onClick={() => onOpenRegister('day2-wizard')}
                className="bg-transparent border-2 border-[#f2ca50] text-[#f2ca50] px-10 py-4 rounded-full font-['Cinzel'] font-bold text-lg hover:bg-[#f2ca50] hover:text-[#3c2f00] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 uppercase cursor-pointer"
              >
                Assemble Your Squad Now
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
