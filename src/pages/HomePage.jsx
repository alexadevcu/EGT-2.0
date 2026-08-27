import React from 'react'

export default function HomePage({ setCurrentPage, onOpenRegister }) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#1A0A0A] z-0">
          <img
            alt="Grand theatrical stage with red curtains and spotlights"
            className="w-full h-full object-cover opacity-60"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdi34sxXz2gu8kmU6IK9tFn-VkFxgd4dKgOLpRCldNV8c1ub_O_emTcWH48kct35wd2bcqoGb0UXzL-mUtbWF2eY66iHrQCZJdUx5MGk85U9mNPX5EKEN3tjnCVbCrJ7JP7B3aTvBJ9aYlCjwNnHNLHUACr5YwVsrO9SHRoHYg3pQ4MuqluIfv8yTDBSRMUpJil7d79Zx_1ad5G7P9r7o0GUdyaloLWknyNp_zIa5nUFpAQrHNOmgtrcxS3cyZXasE5g"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16130b] via-transparent to-[#16130b]/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#1A0A0A]/80 to-[#16130b]"></div>
        </div>

        <div className="relative z-10 text-center px-5 md:px-[80px] flex flex-col items-center max-w-4xl mx-auto">
          <h1 className="font-['Cinzel'] text-3xl sm:text-4xl md:text-6xl font-bold text-[#f2ca50] mb-6 drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)] tracking-wide">
            ENGINEER'S GOT TALENT 2.0
          </h1>
          <p className="font-['Cinzel'] text-lg md:text-2xl text-[#e9c349] mb-10 max-w-2xl mx-auto tracking-wide font-medium">
            ONE EVENT. TWO ARENAS. TWO COMPLETELY DIFFERENT TALENTS.
          </p>
          <button
            onClick={onOpenRegister}
            className="bg-[#d4af37] text-[#3c2f00] font-['Space_Grotesk'] font-bold text-sm md:text-base uppercase px-8 py-4 rounded-lg spotlight-glow transition-all duration-300 hover:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
          >
            Claim Your Spot
          </button>
        </div>
      </section>

      {/* The Show Off Section */}
      <section className="py-20 md:py-28 px-5 md:px-[80px] max-w-[1440px] mx-auto">
        <div className="text-center mb-16 relative">
          <h2 className="font-['Cinzel'] text-2xl md:text-4xl font-semibold text-[#f2ca50] uppercase inline-block relative px-10">
            <span class="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-[#f2ca50]"></span>
            The Show Off
            <span class="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-[#f2ca50]"></span>
          </h2>
          <p className="font-['Work_Sans'] text-base md:text-lg text-[#d0c5af] mt-4 max-w-2xl mx-auto">
            Glimpses of raw talent from the previous season.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-xl border border-[#4d4635]/30 aspect-video md:aspect-auto h-[300px] md:h-full">
            <img
              alt="Student performing on stage"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA19g7gwO_hqDI0yCYWXYGvBfRl-K6nC_TccXYTPA_gJHPOFZ56AYyFdPxhHdPI3bzMl_xQeThFJXr9LDVxxgKpDMRt9kfLU0bPs749tq0gylA5BPz3fc3rFhitAVJBnhA5YaHLcV-nzNuM_cCpSVqUNKOFGilWpGJJRv86po5QCHYYmR3G0cjjHVcIEYddTNcemTpkKRexcgRviy2vXbPbgkJjTMXys3izaA1WNA2iTfVFF_PzuhsL"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16130b]/90 to-transparent flex items-end p-6">
              <h3 className="font-['Cinzel'] text-xl md:text-2xl font-medium text-[#f2ca50]">
                Stage Performances
              </h3>
            </div>
          </div>

          <div className="md:col-span-4 relative group overflow-hidden rounded-xl border border-[#4d4635]/30 h-[250px]">
            <img
              alt="Students coding"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZEv33HJUXtZgTfu4ehI0QjSYk1Xfh9NSXsfcRkyoYLmIbxSnVU9YU6_kyQcun3A7nAQ47ruEhMBYmd7EXUbKd564e2eyaolSXTBJ_QLSR7kmuhE_COue5xK1WoCeRvnqVpdfIGx6AD66G6rivxvg5q3KmRVcKQVjPkbocR8mVmalrCUrjDU_QR1sVcQ22BQM4ooirF4JB3Ts1Ol6HnfolW6sOYuR-dC6XpM8lFDEjNPHgBIUMfIvU"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16130b]/90 to-transparent flex items-end p-6">
              <h3 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50]">
                Tech Arenas
              </h3>
            </div>
          </div>

          <div className="md:col-span-4 relative group overflow-hidden rounded-xl border border-[#4d4635]/30 h-[250px]">
            <img
              alt="Crowd cheering"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4O0LAIffGn2-WgBCfvLFM9IAN4M4Prh9Kc-us7ypB0t5cgJVjJgpXj1B8NKaP95XxzUFEznhQ11FPlAHtKdbfRCGx-acliEdvFkTVTNnbbD1c_9aVHtcWlKdPRznANRo3fwHwpZ9QmP4GEBIV5kcHSJMKgYWhfMdLVaAT7J7gmQdFyz0EI3ZyfO3S_ZGqKTs-L5hVnKPb3pxBg3wvoUnY0IqPFGOosKByWoLv97C7DZZDwN8NLb_8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16130b]/90 to-transparent flex items-end p-6">
              <h3 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50]">
                The Community
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* The Two Arenas Overview Section */}
      <section className="py-20 md:py-28 px-5 md:px-[80px] max-w-[1440px] mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="font-['Cinzel'] text-3xl md:text-5xl font-semibold text-[#f2ca50] uppercase">
            The Two Arenas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Day 1 Card */}
          <div className="relative bg-[#1A0A0A] rounded-xl border border-[#f2ca50]/30 p-8 flex flex-col justify-between min-h-[400px] overflow-hidden group shadow-[0_10px_40px_rgba(178,34,34,0.15)] hover:border-[#f2ca50] transition-colors duration-300">
            <div className="absolute inset-0 curtain-overlay opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#3d392f] text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold rounded mb-4 border border-[#4d4635]">
                9 September
              </span>
              <h3 className="font-['Cinzel'] text-2xl md:text-4xl font-semibold text-[#eae1d4] mb-4">
                The Stage
              </h3>
              <p className="font-['Work_Sans'] text-base md:text-lg text-[#d0c5af] mb-6 leading-relaxed">
                Step into the spotlight. A theatrical showcase of artistic, non-technical talents where creativity takes center stage under the golden lights.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <button
                onClick={() => setCurrentPage('day1')}
                className="bg-transparent border-2 border-[#f2ca50] text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold uppercase px-6 py-3 rounded hover:bg-[#f2ca50] hover:text-[#3c2f00] transition-all duration-300 w-full md:w-auto cursor-pointer"
              >
                Explore Day 1
              </button>
            </div>
          </div>

          {/* Day 2 Card */}
          <div className="relative glass-panel rounded-xl p-8 flex flex-col justify-between min-h-[400px] overflow-hidden group shadow-[0_10px_40px_rgba(10,25,47,0.5)] border-t border-l border-[#00F2FF]/30 border-r border-b border-[#00F2FF]/10 hover:border-[#00F2FF]/60 transition-colors duration-300">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(0,242,255,0.15)_0%,transparent_70%)] pointer-events-none"></div>

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-[#0A192F] text-[#00F2FF] font-['Space_Grotesk'] text-xs font-bold rounded mb-4 border border-[#00F2FF]/30">
                10 September
              </span>
              <h3 className="font-['Cinzel'] text-2xl md:text-4xl font-semibold text-[#dbe1ff] mb-4">
                The Arena
              </h3>
              <p className="font-['Work_Sans'] text-base md:text-lg text-[#b4c5ff] mb-6 leading-relaxed">
                Enter the mystical realm. A wizard-themed technical challenge where engineering prowess meets magical problem-solving in a high-stakes environment.
              </p>
            </div>

            <div className="relative z-10 mt-auto">
              <button
                onClick={() => setCurrentPage('day2')}
                className="bg-transparent border-2 border-[#00F2FF] text-[#00F2FF] font-['Space_Grotesk'] text-xs font-bold uppercase px-6 py-3 rounded mana-pulse hover:bg-[#00F2FF]/10 transition-all duration-300 w-full md:w-auto cursor-pointer"
              >
                Explore Day 2
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Objectives Section */}
      <section className="py-20 md:py-28 px-5 md:px-[80px] max-w-[1440px] mx-auto bg-[#1f1b13] border-y border-[#4d4635]/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#3d392f] border border-[#f2ca50]/20 flex items-center justify-center mb-4 text-[#f2ca50]">
              <span className="material-symbols-outlined text-3xl">lightbulb</span>
            </div>
            <h4 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50] mb-2">Creativity</h4>
            <p className="font-['Work_Sans'] text-sm text-[#d0c5af]">
              Unleashing artistic potential beyond the code.
            </p>
          </div>

          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#3d392f] border border-[#f2ca50]/20 flex items-center justify-center mb-4 text-[#f2ca50]">
              <span className="material-symbols-outlined text-3xl">terminal</span>
            </div>
            <h4 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50] mb-2">Technology</h4>
            <p className="font-['Work_Sans'] text-sm text-[#d0c5af]">
              Pushing the boundaries of technical problem solving.
            </p>
          </div>

          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#3d392f] border border-[#f2ca50]/20 flex items-center justify-center mb-4 text-[#f2ca50]">
              <span className="material-symbols-outlined text-3xl">star</span>
            </div>
            <h4 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50] mb-2">Confidence</h4>
            <p className="font-['Work_Sans'] text-sm text-[#d0c5af]">
              Owning the stage, whether theatrical or technical.
            </p>
          </div>

          <div className="flex flex-col items-center p-6">
            <div className="w-16 h-16 rounded-full bg-[#3d392f] border border-[#f2ca50]/20 flex items-center justify-center mb-4 text-[#f2ca50]">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <h4 className="font-['Cinzel'] text-xl font-medium text-[#f2ca50] mb-2">Community</h4>
            <p className="font-['Work_Sans'] text-sm text-[#d0c5af]">
              Building bonds across the engineering department.
            </p>
          </div>
        </div>
      </section>

      {/* Organizing Body Section */}
      <section className="py-20 md:py-24 px-5 md:px-[80px] text-center max-w-[1440px] mx-auto">
        <p className="font-['Space_Grotesk'] text-xs font-bold text-[#d0c5af] uppercase tracking-widest mb-3">
          Organized By
        </p>
        <h3 className="font-['Cinzel'] text-2xl md:text-4xl font-semibold text-[#f2ca50]">
          Department of CSE – Takshashila
        </h3>
        <p className="font-['Work_Sans'] text-lg text-[#e9c349] mt-2 font-medium">
          Chandigarh University
        </p>
      </section>
    </div>
  )
}
