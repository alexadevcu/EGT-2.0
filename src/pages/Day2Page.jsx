import React, { useState, useEffect, useRef } from 'react'
import wizardVideo from '../assets/Wizard.webm'
import {
  KeyRound,
  Compass,
  Swords,
  Trophy,
  Code,
  UserCheck,
  Scroll,
  Sparkles
} from 'lucide-react'

export default function Day2Page({ onOpenRegister }) {
  const timelineRef = useRef(null)
  const [visibleItems, setVisibleItems] = useState({})

  const m2mSchedule = [
    {
      time: '9:00 AM – 9:45 AM',
      event: 'Registration of Participants',
      desc: 'Check-in at the Grand Hall, team verification & wizard squad badge allotment.',
      icon: UserCheck,
      highlight: false,
      color: 'cyan'
    },
    {
      time: '9:45 AM – 10:30 AM',
      event: 'Faculty Speech & Rules Specifying',
      desc: 'Keynote by CSE Faculty & briefing of the Triwizard Tournament ground rules.',
      icon: Scroll,
      highlight: false,
      color: 'gold'
    },
    {
      time: '10:30 AM – 11:30 AM',
      event: 'Round 1 – THE VAULT',
      desc: 'Decipher the 10+1 cryptic seals inside C1 Seminar Hall to unlock the first key.',
      icon: KeyRound,
      highlight: true,
      badge: 'Trial 1',
      color: 'gold'
    },
    {
      time: '11:30 AM – 2:00 PM',
      event: 'Round 2 – THE HUNT',
      desc: 'Campus-wide QR Horcrux treasure trail across 6 mysterious university zones.',
      icon: Compass,
      highlight: true,
      badge: 'Trial 2',
      color: 'cyan'
    },
    {
      time: '2:00 PM – 2:45 PM',
      event: 'Round 3 – THE CHAMBER',
      desc: 'Top 20 live leaderboard cut-off final sprint & strategic climax.',
      icon: Swords,
      highlight: true,
      badge: 'Final Trial',
      color: 'rose'
    },
    {
      time: '2:45 PM – 3:15 PM',
      event: 'Prize Distribution',
      desc: 'Crowning the Triwizard Champions & awarding the Grand Trophy.',
      icon: Trophy,
      highlight: false,
      color: 'gold'
    },
    {
      time: '3:15 PM – 3:30 PM',
      event: 'Vote of Thanks & Closing',
      desc: 'Closing address by organizing student chapters & valedictory ceremony.',
      icon: Sparkles,
      highlight: false,
      color: 'cyan'
    }
  ]

  // Intersection Observer for Timeline Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute('data-index')
            setVisibleItems((prev) => ({ ...prev, [index]: true }))
          }
        })
      },
      { threshold: 0.15 }
    )

    const elements = document.querySelectorAll('.timeline-scroll-item')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full relative bg-[#040a14] text-[#eae1d4] min-h-screen overflow-x-hidden font-sans">
      {/* Ambient background radial light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[600px] bg-gradient-to-b from-[#00F2FF]/15 via-[#f2ca50]/10 to-transparent blur-[140px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-full overflow-x-hidden">
        
        {/* ========================================================================= */}
        {/* 1. CINEMATIC VIDEO HERO SECTION (WIZARD.WEBM MUTED VIDEO BACKGROUND) */}
        {/* ========================================================================= */}
        <section className="relative w-full min-h-[85vh] sm:min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 md:px-12 pt-24 sm:pt-32 pb-12 sm:pb-16 overflow-hidden bg-[#040a14]">
          
          {/* Muted Cinematic Wizard Video Background Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center opacity-75 filter contrast-125 saturate-110"
            >
              <source src={wizardVideo} type="video/webm" />
            </video>
            
            {/* Dark Radial & Gradient Vignette Overlays for Text Legibility */}
            <div className="absolute inset-0 bg-radial from-transparent via-[#041226]/55 to-[#040a14]/95"></div>
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#040a14] via-[#040a14]/85 to-transparent"></div>
          </div>

          {/* Main Stage Title Emblem */}
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center my-auto px-2 sm:px-4 w-full max-w-full overflow-x-hidden">
            
            {/* Date & Location Pill Kicker */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="px-4 py-2 rounded-full bg-[#0b1a21] border border-[#1d778a]/50 text-[#5ed3e6] font-extrabold text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 shadow-lg">
                10 SEPTEMBER 2026 • C1 SEMINAR HALL
              </span>
            </div>

            {/* Handcrafted Cinematic Title */}
            <h1 className="font-['Cinzel'] text-2xl xs:text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-[1.0] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#00F2FF] to-[#008ba8] drop-shadow-[0_15px_40px_rgba(0,242,255,0.75)] text-center w-full max-w-full break-words px-2">
              THE ARENA:
              <div className="font-['Cinzel'] text-lg xs:text-2xl sm:text-4xl md:text-7xl text-[#f2ca50] mt-2 sm:mt-3 font-black flex items-center justify-center gap-1.5 sm:gap-5 w-full max-w-full px-1">
                <span className="hidden sm:inline-block h-[1.5px] sm:h-[2px] w-6 sm:w-24 bg-gradient-to-r from-transparent to-[#f2ca50]"></span>
                <span className="bg-gradient-to-r from-[#f2ca50] via-[#FFFBEB] to-[#f2ca50] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(242,202,80,0.9)] break-words text-center">
                  THE WIZARD’S CODE
                </span>
                <span className="hidden sm:inline-block h-[1.5px] sm:h-[2px] w-6 sm:w-24 bg-gradient-to-l from-transparent to-[#f2ca50]"></span>
              </div>
            </h1>

            {/* Subtitle */}
            <p className="font-['Outfit'] text-sm sm:text-2xl md:text-3xl text-[#FFF9E5] mt-3 sm:mt-6 max-w-3xl font-extrabold leading-snug sm:leading-relaxed drop-shadow-lg text-center px-3 break-words">
              The Ultimate Tech &amp; Treasure Hunt
            </p>

            {/* Organizing Body & Venue Info */}
            <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-[#00F2FF] mt-2.5 font-bold text-center tracking-widest uppercase px-3 break-words">
              Organized by Alexa Developers Community
            </p>
            <p className="font-['Space_Grotesk'] text-[10px] sm:text-xs text-gray-300 mt-1 font-semibold text-center tracking-wider px-3 break-words">
              Department of CSE – Takshashila &bull; Chandigarh University
            </p>

            {/* Single Registration CTA Button */}
            <div className="flex justify-center items-center mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md mx-auto px-2">
              <button
                onClick={() => onOpenRegister('day2-wizard')}
                className="w-full justify-center bg-gradient-to-r from-[#e5b84c] via-[#f2ca50] to-[#c9982e] text-[#1c0800] font-['Cinzel'] text-xs sm:text-base font-extrabold uppercase px-6 sm:px-10 py-3.5 sm:py-4 rounded-full transition-colors hover:brightness-110 shadow-[0_0_40px_rgba(242,202,80,0.85)] flex items-center gap-2 cursor-pointer border border-yellow-200/60 text-center leading-tight"
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>REGISTER YOUR SQUAD (3-4 WIZARDS)</span>
              </button>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 2. THE THREE TRIALS (FIRST SECTION AFTER HERO) */}
        {/* ========================================================================= */}
        <section id="wizard-rounds-section" className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8 sm:space-y-12">
          
          <div className="text-center mb-8 sm:mb-16">
            <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold text-[#00F2FF] tracking-[0.2em] sm:tracking-[0.3em] block mb-1.5 uppercase drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
              TRIWIZARD TOURNAMENT TRIALS
            </span>
            <h2 className="font-['Cinzel'] text-2xl sm:text-5xl font-black text-[#FFF9E5] uppercase tracking-wide px-2">
              The Three Stages of the Code
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* ROUND 1: THE VAULT (Left Column - Span 6) */}
            <div className="lg:col-span-6 glass-panel p-5 sm:p-10 rounded-3xl border border-[#f2ca50]/40 shadow-[0_0_35px_rgba(242,202,80,0.25)] flex flex-col justify-between relative overflow-hidden bg-[#081526]/80">
              {/* Subtle Background 01 */}
              <div className="absolute right-3 top-3 font-['Cinzel'] text-6xl sm:text-9xl font-black text-[#f2ca50]/10 select-none pointer-events-none">
                01
              </div>

              <div className="relative z-10 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#f2ca50]/15 border border-[#f2ca50]/50 flex items-center justify-center text-[#f2ca50] shrink-0">
                    <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold text-[#f2ca50] tracking-widest uppercase block">
                      Trial 1 &bull; 10:30 AM – 11:30 AM
                    </span>
                    <h3 className="font-['Cinzel'] text-2xl sm:text-4xl font-extrabold text-white">
                      THE VAULT
                    </h3>
                  </div>
                </div>

                <p className="font-['Outfit'] text-base sm:text-lg text-[#f2ca50] italic my-1 sm:my-2 font-bold">
                  "Every vault has a secret. This one has eleven."
                </p>

                <p className="font-['Space_Grotesk'] text-xs sm:text-base text-gray-300 leading-relaxed font-normal">
                  The first seal awaits those who dare to enter. Decode the clues, trust your instincts, and prove that your mind is sharp enough to unlock what lies beyond. But remember—the Vault does not reveal its secrets to everyone.
                </p>

                <p className="font-['Space_Grotesk'] text-xs sm:text-base font-bold text-white pt-1">
                  Think carefully. The first key is yours to find.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: ROUND 2 & ROUND 3 (Span 6) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              
              {/* ROUND 2: THE HUNT (Right Top - Span 6) */}
              <div className="glass-panel p-5 sm:p-10 rounded-3xl border border-[#00F2FF]/40 shadow-[0_0_35px_rgba(0,242,255,0.25)] flex flex-col justify-between relative overflow-hidden bg-[#081526]/80">
                {/* Subtle Background 02 */}
                <div className="absolute right-3 top-3 font-['Cinzel'] text-6xl sm:text-8xl font-black text-[#00F2FF]/10 select-none pointer-events-none">
                  02
                </div>

                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#00F2FF]/15 border border-[#00F2FF]/50 flex items-center justify-center text-[#00F2FF] shrink-0">
                      <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold text-[#00F2FF] tracking-widest uppercase block">
                        Trial 2 &bull; 11:30 AM – 2:00 PM
                      </span>
                      <h3 className="font-['Cinzel'] text-2xl sm:text-4xl font-extrabold text-white">
                        THE HUNT
                      </h3>
                    </div>
                  </div>

                  <p className="font-['Outfit'] text-base sm:text-lg text-[#00F2FF] italic my-1 sm:my-2 font-bold">
                    "The Vault has opened. Now the trail begins."
                  </p>

                  <p className="font-['Space_Grotesk'] text-xs sm:text-base text-gray-300 leading-relaxed font-normal">
                    A trail of hidden clues, unexpected turns, and challenges awaits. Follow what you find, question what you see, and stay one step ahead. Somewhere along the way lies the path forward—but only those who can connect the pieces will discover it.
                  </p>

                  <p className="font-['Space_Grotesk'] text-xs sm:text-base font-bold text-white pt-1">
                    The hunt is on.
                  </p>
                </div>
              </div>

              {/* ROUND 3: THE CHAMBER (Right Bottom - Span 6) */}
              <div className="glass-panel p-5 sm:p-10 rounded-3xl border border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.25)] flex flex-col justify-between relative overflow-hidden bg-[#170613]/80">
                {/* Subtle Background 03 */}
                <div className="absolute right-3 top-3 font-['Cinzel'] text-6xl sm:text-8xl font-black text-rose-500/10 select-none pointer-events-none">
                  03
                </div>

                <div className="relative z-10 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/15 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                      <Swords className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold text-rose-400 tracking-widest uppercase block">
                        Trial 3 &bull; 2:00 PM – 2:45 PM
                      </span>
                      <h3 className="font-['Cinzel'] text-2xl sm:text-4xl font-extrabold text-white">
                        THE CHAMBER
                      </h3>
                    </div>
                  </div>

                  <p className="font-['Outfit'] text-base sm:text-lg text-rose-300 italic my-1 sm:my-2 font-bold">
                    "You made it this far. But the real test begins here."
                  </p>

                  <p className="font-['Space_Grotesk'] text-xs sm:text-base text-gray-300 leading-relaxed font-normal">
                    Beyond the final threshold lies the Chamber—a place where speed alone won’t save you. Think strategically, work as one, and make every move count. The final challenge awaits those who have earned their place.
                  </p>

                  <p className="font-['Space_Grotesk'] text-xs sm:text-base font-bold text-white flex items-center gap-2 pt-1">
                    <span>Enter the Chamber. Claim the victory.</span>
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#f2ca50] shrink-0" />
                  </p>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. ANIMATED SCROLL-REVEAL MARAUDER'S ITINERARY (M2M TIMELINE SCHEDULE) */}
        {/* ========================================================================= */}
        <section ref={timelineRef} className="py-12 sm:py-24 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto border-t border-white/10 bg-[#071324]/40 rounded-3xl my-8 sm:my-12">
          
          <div className="text-center mb-8 sm:mb-16 space-y-2">
            <span className="font-['Space_Grotesk'] text-[10px] sm:text-xs font-bold text-[#f2ca50] tracking-[0.2em] sm:tracking-[0.3em] uppercase block drop-shadow-md">
              OFFICIAL CHRONICLES &amp; TIMELINE
            </span>
            <h2 className="font-['Cinzel'] text-2xl sm:text-5xl font-black text-[#FFF9E5] uppercase tracking-wide px-2">
              The Marauder’s Itinerary
            </h2>
            <p className="font-['Space_Grotesk'] text-[10px] sm:text-sm text-cyan-300 font-semibold uppercase tracking-wider px-2">
              Minute-to-Minute Sequence &bull; 10 September 2026
            </p>
          </div>

          {/* Timeline Sequence List with Scroll Animations */}
          <div className="relative border-l-2 border-[#00F2FF]/40 ml-6 sm:ml-36 pl-4 sm:pl-10 space-y-6 sm:space-y-10">
            
            {/* Animated Pulsing Arcane Beam */}
            <div className="absolute top-0 bottom-0 -left-[2px] w-[2px] bg-gradient-to-b from-[#f2ca50] via-[#00F2FF] to-rose-500 animate-pulse"></div>

            {m2mSchedule.map((item, idx) => {
              const IconComp = item.icon
              const isGold = item.color === 'gold'
              const isRose = item.color === 'rose'
              const isVisible = visibleItems[idx]
              
              return (
                <div
                  key={idx}
                  data-index={idx}
                  className={`timeline-scroll-item relative transition-all duration-700 transform ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-30 translate-y-6 scale-95'
                  }`}
                >
                  
                  {/* Glowing Interactive Chrono Node Dot */}
                  <div
                    className={`absolute -left-[33px] sm:-left-[57px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isVisible
                        ? isGold
                          ? 'bg-[#040a14] border-[#f2ca50] text-[#f2ca50] shadow-[0_0_20px_#f2ca50]'
                          : isRose
                          ? 'bg-[#040a14] border-rose-500 text-rose-400 shadow-[0_0_20px_#f43f5e]'
                          : 'bg-[#040a14] border-[#00F2FF] text-[#00F2FF] shadow-[0_0_20px_#00F2FF]'
                        : 'bg-[#040a14] border-gray-600 text-gray-500'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>

                  {/* Desktop Time Label */}
                  <div className="hidden sm:block sm:absolute sm:-left-44 sm:top-1.5 w-32 text-right font-['Space_Grotesk'] text-xs font-black tracking-wide text-cyan-200">
                    <span className="inline-block px-3 py-1 rounded-lg bg-black/60 border border-[#00F2FF]/30 shadow-md">
                      {item.time}
                    </span>
                  </div>

                  {/* Glass Schedule Card */}
                  <div
                    className={`glass-panel p-4 sm:p-6 rounded-2xl border transition-all duration-500 ${
                      item.highlight
                        ? isGold
                          ? 'border-[#f2ca50]/70 bg-[#091729]/90 shadow-[0_0_30px_rgba(242,202,80,0.3)]'
                          : isRose
                          ? 'border-rose-500/70 bg-[#160611]/90 shadow-[0_0_30px_rgba(244,63,94,0.3)]'
                          : 'border-[#00F2FF]/70 bg-[#091729]/90 shadow-[0_0_30px_rgba(0,242,255,0.3)]'
                        : 'border-white/10 bg-[#06101d]/60'
                    }`}
                  >
                    {/* Mobile Only Time Badge */}
                    <div className="sm:hidden mb-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/5 border border-cyan-400/30 text-[10px] font-['Space_Grotesk'] font-bold text-cyan-200">
                        {item.time}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                      <h3
                        className={`font-['Cinzel'] text-base sm:text-xl font-bold tracking-wide break-words ${
                          isGold ? 'text-[#f2ca50]' : isRose ? 'text-rose-300' : 'text-[#00F2FF]'
                        }`}
                      >
                        {item.event}
                      </h3>
                      {item.badge && (
                        <span
                          className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full font-['Space_Grotesk'] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                            isGold
                              ? 'bg-[#f2ca50]/20 text-[#f2ca50] border border-[#f2ca50]/40'
                              : isRose
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-[#00F2FF]/20 text-[#00F2FF] border border-[#00F2FF]/40'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                </div>
              )
            })}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 4. BOTTOM SQUAD REGISTRATION CALLOUT CARD */}
        {/* ========================================================================= */}
        <section className="pb-16 sm:pb-20 px-4 sm:px-6">
          <div className="text-center">
            <div className="p-6 sm:p-12 rounded-3xl glass-panel border border-[#f2ca50]/50 max-w-2xl mx-auto space-y-4 shadow-[0_0_50px_rgba(242,202,80,0.3)] bg-[#081526]/90">
              <h4 className="font-['Cinzel'] text-xl sm:text-4xl font-extrabold text-[#f2ca50] break-words">
                Assemble Your Squad of 3 to 4 Wizards
              </h4>
              <p className="font-['Space_Grotesk'] text-xs sm:text-sm text-gray-300 font-medium">
                Department of CSE – Takshashila &bull; Free Event Registration
              </p>
              <button
                onClick={() => onOpenRegister('day2-wizard')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#e5b84c] via-[#f2ca50] to-[#c9982e] text-[#1c0800] font-['Cinzel'] font-extrabold text-xs sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-[0_0_40px_rgba(242,202,80,0.85)] transition-colors hover:brightness-110 cursor-pointer uppercase tracking-wider border border-yellow-200/60 inline-flex items-center justify-center gap-2"
              >
                <Code className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span>REGISTER SQUAD NOW</span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
