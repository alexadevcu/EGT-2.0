import React from 'react'

export default function Day1Page({ onOpenRegister }) {
  return (
    <div className="w-full relative bg-[#1A0A0A] text-[#eae1d4] min-h-screen">
      {/* Ambient background layers */}
      <div className="fixed inset-0 pointer-events-none radial-spotlight z-0"></div>
      <div className="fixed inset-0 pointer-events-none curtain-overlay z-0 mix-blend-overlay"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-5 md:px-[80px] text-center pt-28 sm:pt-32">
          <div className="absolute inset-0 w-full h-full z-[-1]">
            <img
              alt="Cinematic theater stage"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCng2Ae-afsdBBBha0vcZv2rmoC1bdkSKQh-1Hrie1SLBcwQvaNqEvorsBKTZlGHxsLy6toWBh-Pn057U9VnLbIuJzcSRyoYqIosbjgolJhoX5KZ8c4Bp6vE5gqZj6XgnKsVohdPD1cUAgS6aRaQFJRV27TB9mzABdBVm_4a3Xe7fPBv3OdYYR6Knx3Zo0F96hyOoIixxNCU-XqdHQ-6eSn0m5GXXKYo4xPMJYyZgxSZqe8vRMQX9tl"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0A] via-transparent to-transparent"></div>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 mt-12 md:mt-0">
            <span className="text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold tracking-[0.2em] uppercase block mb-4 animate-pulse">
              Day 1: Non-Tech Showcase
            </span>
            <h1 className="font-['Cinzel'] text-3xl sm:text-5xl md:text-7xl font-bold text-[#FFF9E5] drop-shadow-[0_0_30px_rgba(242,202,80,0.6)] uppercase tracking-[0.15em] leading-tight">
              The Stage: <br /> Unleash Your Talent
            </h1>
            <p className="font-['Work_Sans'] text-base md:text-lg text-[#d0c5af] max-w-2xl mx-auto mt-6 border-l-2 border-[#f2ca50]/50 pl-4 py-2 text-left sm:text-center">
              9 September 2026 • A1 Auditorium<br />
              Step into the spotlight and let your artistry shine on the grandest stage of the year.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pt-8" id="register">
              <button
                onClick={() => onOpenRegister('day1-performer')}
                className="w-full sm:w-auto bg-[#f2ca50] text-[#1A0A0A] font-['Space_Grotesk'] text-xs font-bold uppercase px-8 py-4 rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(242,202,80,0.6)] transition-all duration-500 flex items-center justify-center gap-2 group border border-white/20 shadow-lg cursor-pointer"
              >
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform">mic</span>
                REGISTER AS PERFORMER
              </button>

              <button
                onClick={() => onOpenRegister('day1-audience')}
                className="w-full sm:w-auto bg-white/5 backdrop-blur-md border-2 border-[#f2ca50] text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold uppercase px-8 py-4 rounded-full hover:bg-[#f2ca50]/20 hover:scale-105 hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined">theater_comedy</span>
                BOOK AUDIENCE SEAT
              </button>
            </div>
          </div>

          <div className="mt-16 animate-bounce text-[#f2ca50]/50">
            <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
          </div>
        </section>

        {/* Categories Section (Bento Grid) */}
        <section className="py-20 md:py-28 px-5 md:px-[80px] max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Cinzel'] text-2xl md:text-4xl font-semibold text-[#FFF9E5] uppercase relative inline-block">
              <span className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-1 bg-[#f2ca50]/50"></span>
              The Talent Showcase
              <span className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-1 bg-[#f2ca50]/50"></span>
            </h2>
            <p className="font-['Work_Sans'] text-sm text-[#d0c5af] mt-4 max-w-xl mx-auto">
              Discover the diverse categories where you can showcase your unique skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Category Card: Singing (Span 2) */}
            <div className="col-span-1 md:col-span-2 row-span-2 bg-[#1A0A0A] border border-[#f2ca50]/20 rounded-xl p-8 relative overflow-hidden group hover:border-[#f2ca50]/60 transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(178,34,34,0.3)] flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ca50]/5 rounded-bl-full group-hover:scale-150 transition-transform duration-700"></div>
              <div>
                <span className="material-symbols-outlined text-6xl text-[#f2ca50] mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)] block">
                  mic_external_on
                </span>
                <h3 className="font-['Cinzel'] text-xl md:text-2xl font-medium text-[#FFF9E5] mb-3">
                  Vocal Performance
                </h3>
                <p className="font-['Work_Sans'] text-sm text-[#d0c5af] z-10 relative leading-relaxed">
                  Mesmerize the audience with your voice. Open to classical, contemporary, pop, beatboxing, spoken word, and original compositions.
                </p>
              </div>
              <button
                onClick={() => onOpenRegister('day1-performer')}
                className="mt-6 inline-flex items-center gap-2 text-xs font-['Space_Grotesk'] font-bold text-[#f2ca50] hover:underline uppercase"
              >
                Register Act <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Category Card: Dance */}
            <div className="bg-[#231f17] border border-[#f2ca50]/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#f2ca50]/40 transition-all">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50]/80 mb-4 block group-hover:text-[#f2ca50] transition-colors">
                directions_run
              </span>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#eae1d4] uppercase mb-2">
                Dance
              </h3>
              <p className="font-['Work_Sans'] text-xs text-[#d0c5af]/80">
                Express through movement. Solo, duo, or squad routines.
              </p>
            </div>

            {/* Category Card: Instrumental */}
            <div className="bg-[#231f17] border border-[#f2ca50]/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#f2ca50]/40 transition-all">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50]/80 mb-4 block group-hover:text-[#f2ca50] transition-colors">
                piano
              </span>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#eae1d4] uppercase mb-2">
                Instrumental
              </h3>
              <p className="font-['Work_Sans'] text-xs text-[#d0c5af]/80">
                Let the strings, keys, drums, or beats do the talking.
              </p>
            </div>

            {/* Category Card: Drama */}
            <div className="bg-[#231f17] border border-[#f2ca50]/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#f2ca50]/40 transition-all">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50]/80 mb-4 block group-hover:text-[#f2ca50] transition-colors">
                masks
              </span>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#eae1d4] uppercase mb-2">
                Drama & Skit
              </h3>
              <p className="font-['Work_Sans'] text-xs text-[#d0c5af]/80">
                Captivating theatrical performances, monologues & short plays.
              </p>
            </div>

            {/* Category Card: Standup */}
            <div className="bg-[#231f17] border border-[#f2ca50]/10 rounded-xl p-6 relative overflow-hidden group hover:border-[#f2ca50]/40 transition-all">
              <span className="material-symbols-outlined text-4xl text-[#f2ca50]/80 mb-4 block group-hover:text-[#f2ca50] transition-colors">
                sentiment_very_satisfied
              </span>
              <h3 className="font-['Space_Grotesk'] text-sm font-bold text-[#eae1d4] uppercase mb-2">
                Stand-up Comedy
              </h3>
              <p className="font-['Work_Sans'] text-xs text-[#d0c5af]/80">
                Bring the house down with your humor and crowd banter.
              </p>
            </div>
          </div>
        </section>

        {/* Performance Format Section */}
        <section className="py-20 md:py-28 px-5 md:px-[80px] relative">
          <div className="absolute inset-0 bg-[#B22222]/5 skew-y-3 z-[-1]"></div>
          
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="font-['Cinzel'] text-3xl md:text-5xl font-semibold text-[#FFF9E5] uppercase leading-tight">
                The Rules <br /> <span className="text-[#f2ca50]">of Engagement</span>
              </h2>
              <p className="font-['Work_Sans'] text-base md:text-lg text-[#d0c5af]">
                Every great performance requires structure. Review the formats to ensure your act fits the spotlight.
              </p>
              
              <ul className="space-y-6 mt-8">
                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#f2ca50] mt-1 text-2xl">
                    timer
                  </span>
                  <div>
                    <h4 className="font-['Cinzel'] text-lg font-medium text-[#eae1d4] mb-1">
                      3-Minute Time Limit
                    </h4>
                    <p className="font-['Work_Sans'] text-sm text-[#d0c5af]/70">
                      Strict adherence required for each performance to keep the show rolling.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#f2ca50] mt-1 text-2xl">
                    groups
                  </span>
                  <div>
                    <h4 className="font-['Cinzel'] text-lg font-medium text-[#eae1d4] mb-1">
                      Flexible Lineups
                    </h4>
                    <p className="font-['Work_Sans'] text-sm text-[#d0c5af]/70">
                      Participate as a Soloist, dynamic Duo, or a full Group performance.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#f2ca50] mt-1 text-2xl">
                    gavel
                  </span>
                  <div>
                    <h4 className="font-['Cinzel'] text-lg font-medium text-[#eae1d4] mb-1">
                      University Guidelines
                    </h4>
                    <p className="font-['Work_Sans'] text-sm text-[#d0c5af]/70">
                      All acts must maintain professional decorum suitable for a university audience. No profanity or offensive material.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/2">
              <div className="bg-[#16130b]/80 backdrop-blur-md border border-[#f2ca50]/30 rounded-2xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative">
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#f2ca50] rounded-tl-lg m-4"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#f2ca50] rounded-tr-lg m-4"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#f2ca50] rounded-bl-lg m-4"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#f2ca50] rounded-br-lg m-4"></div>

                <div className="text-center mb-8">
                  <span className="material-symbols-outlined text-5xl text-[#FFF9E5]/50 mb-2">
                    confirmation_number
                  </span>
                  <h3 className="font-['Cinzel'] text-2xl font-medium text-[#f2ca50] uppercase">
                    Audience Info
                  </h3>
                </div>

                <p className="font-['Work_Sans'] text-base text-center text-[#eae1d4] mb-8 leading-relaxed">
                  Experience the magic live. Be part of the energy that fuels the performers.
                </p>

                <div className="bg-[#1A0A0A]/80 rounded-lg p-4 flex justify-between items-center border-l-4 border-[#f2ca50] mb-6">
                  <div>
                    <p className="font-['Space_Grotesk'] text-[10px] font-bold text-[#d0c5af] uppercase">
                      Venue
                    </p>
                    <p className="font-['Cinzel'] text-sm font-medium text-[#FFF9E5]">
                      A1 Auditorium
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#f2ca50]">location_on</span>
                </div>

                <button
                  onClick={() => onOpenRegister('day1-audience')}
                  className="w-full bg-transparent border-2 border-[#f2ca50] text-[#f2ca50] font-['Space_Grotesk'] text-xs font-bold uppercase px-6 py-3 rounded-full hover:bg-[#f2ca50] hover:text-[#1A0A0A] transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  RESERVE AUDIENCE SEAT
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
