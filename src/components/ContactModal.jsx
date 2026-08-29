import React, { useEffect } from 'react'
import { X, Mail, Globe, ExternalLink } from 'lucide-react'
import alexaLogo from '../assets/Logo/Alexa Developers Community Logo.png'

export default function ContactModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const WEBSITE_LINK = 'https://alexa-developers-at-cu.vercel.app/'
  const INSTAGRAM_LINK = 'https://www.instagram.com/alexadev.cu'
  const LINKEDIN_LINK = 'https://www.linkedin.com/company/alexadevscu/'
  const WHATSAPP_CHANNEL_LINK = 'https://chat.whatsapp.com/GQScMwZ7X6EKAjfqAFkz4q'
  const EMAIL_LINK = 'mailto:adc.cu@cumail.in'

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#09070c]/98 border border-[#f7d978]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(247,217,120,0.25)] relative text-center font-['Space_Grotesk'] text-white max-h-[90vh] overflow-y-auto"
      >
        {/* Top Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center gap-1.5 pb-4 border-b border-white/10">
          <img
            src={alexaLogo}
            alt="Alexa Developers Community"
            className="h-8 sm:h-9 object-contain filter drop-shadow-[0_0_12px_rgba(247,217,120,0.3)] mb-1"
          />
          <span className="text-[10px] font-extrabold text-[#f7d978] tracking-[0.2em] uppercase">
            Official Organizers
          </span>
          <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            GET IN TOUCH
          </h2>
          <p className="text-[11px] text-gray-300 max-w-xs leading-snug font-light">
            Department of CSE – Takshashila &bull; Chandigarh University
          </p>
        </div>

        {/* Social & Contact Channels List */}
        <div className="space-y-2 my-4 text-left">
          {/* Email Channel */}
          <a
            href={EMAIL_LINK}
            className="p-2.5 sm:p-3 rounded-xl bg-[#141018] border border-amber-500/30 hover:border-amber-400/60 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-[#f7d978] transition-colors truncate">Official Email</p>
                <p className="text-[10px] text-gray-400 truncate">adc.cu@cumail.in</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#f7d978] px-2.5 py-0.5 rounded-full bg-[#f7d978]/10 group-hover:bg-[#f7d978] group-hover:text-black transition-all shrink-0">
              Send Email
            </span>
          </a>

          {/* Official Website Channel */}
          <a
            href={WEBSITE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 rounded-xl bg-[#141018] border border-cyan-500/30 hover:border-cyan-400/60 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">Official Website</p>
                <p className="text-[10px] text-gray-400 truncate">alexa-developers-at-cu.vercel.app</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

          {/* Instagram Channel */}
          <a
            href={INSTAGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 rounded-xl bg-[#141018] border border-rose-500/30 hover:border-rose-400/60 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors truncate">Instagram</p>
                <p className="text-[10px] text-gray-400 truncate">@alexadev.cu</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

          {/* LinkedIn Channel */}
          <a
            href={LINKEDIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 rounded-xl bg-[#141018] border border-blue-500/30 hover:border-blue-400/60 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors truncate">LinkedIn</p>
                <p className="text-[10px] text-gray-400 truncate">Alexa Devs CU</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>

          {/* WhatsApp Community Channel */}
          <a
            href={WHATSAPP_CHANNEL_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 sm:p-3 rounded-xl bg-[#141018] border border-emerald-500/30 hover:border-emerald-400/60 flex items-center justify-between gap-3 group transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">WhatsApp Channel</p>
                <p className="text-[10px] text-gray-400 truncate">Join Announcements</p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </a>
        </div>

        {/* Footer Action Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Close Window
        </button>
      </div>
    </div>
  )
}
