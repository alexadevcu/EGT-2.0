import React from 'react'
import alexaCircularLogo from '../assets/Logo/Alexa Circular logo.png'
import { ArrowUp, Globe } from 'lucide-react'

export default function Footer({ setCurrentPage, onOpenRegister, onOpenContact }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const WEBSITE_LINK = 'https://alexa-developers-at-cu.vercel.app/'
  const INSTAGRAM_LINK = 'https://www.instagram.com/alexadev.cu'
  const LINKEDIN_LINK = 'https://www.linkedin.com/company/alexadevscu/'
  const WHATSAPP_CHANNEL_LINK = 'https://chat.whatsapp.com/GQScMwZ7X6EKAjfqAFkz4q'

  return (
    <footer className="w-full bg-[#050508] border-t border-white/10 pt-14 pb-12 px-4 sm:px-6 md:px-12 relative z-20 font-sans text-gray-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Section: Brand Header with Alexa Circular Logo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-10 border-b border-white/10">
          
          <div className="flex items-center gap-4">
            <img
              src={alexaCircularLogo}
              alt="Alexa Developers Community Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_15px_rgba(0,242,255,0.4)]"
            />
            <div>
              <span className="font-['Cinzel'] text-xl sm:text-2xl font-black text-white tracking-wider block">
                ENGINEER’S GOT TALENT 2.0
              </span>
              <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f2ca50] tracking-widest uppercase">
                Alexa Developers Community
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 max-w-md leading-relaxed font-light">
            Under Department of CSE – Takshashila &bull; Chandigarh University.<br />
            Engineering talent &amp; wizarding tech arena 2026.
          </p>

        </div>

        {/* Middle Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs font-['Space_Grotesk']">
          
          {/* Column 1: Navigation */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-widest text-sm border-b border-white/10 pb-2">
              Navigation
            </p>
            <ul className="space-y-2 text-gray-400 font-medium">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-[#f2ca50] transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('day1')} className="hover:text-rose-400 transition-colors">
                  Day 1 Stage Showcase
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('day2')} className="hover:text-[#00F2FF] transition-colors">
                  Day 2 Triwizard Tech Arena
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('guidelines')} className="hover:text-amber-400 transition-colors">
                  Rules &amp; Event Guidelines
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Event Arenas */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-widest text-sm border-b border-white/10 pb-2">
              Event Arenas
            </p>
            <ul className="space-y-2 text-gray-400 font-medium">
              <li className="text-gray-300 font-semibold">9 Sept: The Stage (A1 Auditorium)</li>
              <li className="text-gray-300 font-semibold">10 Sept: The Wizard’s Code (C1 Seminar Hall)</li>
            </ul>
          </div>

          {/* Column 3: Organizing Body */}
          <div className="space-y-3">
            <p className="font-bold text-white uppercase tracking-widest text-sm border-b border-white/10 pb-2">
              Organizing Body
            </p>
            <ul className="space-y-2 text-gray-400 font-medium">
              <li>Alexa Developers Community</li>
              <li>Department of CSE – Takshashila</li>
              <li>Chandigarh University</li>
            </ul>
          </div>

          {/* Column 4: Official Socials & Channels (Logos Only) */}
          <div className="space-y-4">
            <p className="font-bold text-white uppercase tracking-widest text-sm border-b border-white/10 pb-2">
              Socials &amp; Channels
            </p>
            
            <div className="flex items-center gap-3 pt-1">
              {/* Official Website Logo Button */}
              <a
                href={WEBSITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="Official Website: Alexa Developers Community"
                aria-label="Official Website"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00F2FF] to-blue-600 p-0.5 shadow-lg hover:scale-110 transition-all duration-300 group flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full bg-[#050508] rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <Globe className="w-5 h-5 text-[#00F2FF] group-hover:text-white transition-colors" />
                </div>
              </a>

              {/* Instagram Logo Button */}
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram: @alexadev.cu"
                aria-label="Instagram Page"
                className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-lg hover:scale-110 transition-all duration-300 group flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full bg-[#050508] rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </a>

              {/* LinkedIn Logo Button */}
              <a
                href={LINKEDIN_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn: Alexa Devs CU"
                aria-label="LinkedIn Page"
                className="w-11 h-11 rounded-2xl bg-[#0A66C2] p-0.5 shadow-lg hover:scale-110 transition-all duration-300 group flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full bg-[#050508] rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <svg className="w-5 h-5 fill-[#0A66C2] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
              </a>

              {/* WhatsApp Channel Logo Button */}
              <a
                href={WHATSAPP_CHANNEL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp Channel"
                aria-label="WhatsApp Channel"
                className="w-11 h-11 rounded-2xl bg-[#25D366] p-0.5 shadow-lg hover:scale-110 transition-all duration-300 group flex items-center justify-center cursor-pointer"
              >
                <div className="w-full h-full bg-[#050508] rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors">
                  <svg className="w-5 h-5 fill-[#25D366] group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
              </a>
            </div>

            {/* Engineered Under Badge directly under Social Handles */}
            <div className="border-l-2 border-[#00F2FF]/60 pl-3 py-0.5 mt-4">
              <span className="text-[10px] font-sans font-bold tracking-[0.2em] text-gray-400 uppercase block leading-tight">
                WEBSITE ENGINEERED UNDER
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#00F2FF] flex items-center gap-1.5 flex-wrap mt-0.5">
                <a
                  href="https://linktr.ee/vasu_gera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-cyan-300 transition-all cursor-pointer inline-flex items-center gap-0.5"
                  title="Connect with Vasu Gera"
                >
                  <span>Vasu Gera</span>
                </a>
                <span className="text-gray-400 font-normal">,</span>
                <a
                  href="https://linktr.ee/Aayushi_mishra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-cyan-300 transition-all cursor-pointer inline-flex items-center gap-0.5"
                  title="Connect with Aayushi Mishra"
                >
                  <span>Aayushi Mishra</span>
                </a>
                <span className="text-gray-300 font-normal">&amp;</span>
                <span className="text-[#00F2FF]">ADC core team</span>
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-['Space_Grotesk']">
          <p>© 2026 Engineer’s Got Talent 2.0. Organised under Department of CSE – Takshashila, Chandigarh University.</p>
          
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer text-xs font-bold shrink-0"
            title="Scroll to top"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  )
}
