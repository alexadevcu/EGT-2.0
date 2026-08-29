import React, { useState, useEffect, useRef } from 'react'
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Flame,
  Users,
  Code,
  Mic,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Ticket,
  HelpCircle,
  ArrowUpRight,
  Mail,
  Send,
  Globe
} from 'lucide-react'

// Assets
import heroBlendImg from '../assets/hero_blend.jpg'
import stageHeroImg from '../assets/stage_hero.jpg'
import trophyImg from '../assets/trophy_celebration.jpg'
import cuLogo from '../assets/Logo/CU Logo red &white.png'
import alexaLogo from '../assets/Logo/Alexa Developers Community Logo.png'
import gfgLogo from '../assets/Logo/GfG Horizontal Combination Mark (Dark Mode)@2x.png'

export default function HomePage({ setCurrentPage, onOpenRegister }) {
  // Real Theatre Curtain Animation State
  const [curtainsOpen, setCurtainsOpen] = useState(false)
  const [curtainAnimating, setCurtainAnimating] = useState(true)

  // Live Countdown to 9 September 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const [openFaq, setOpenFaq] = useState(null)
  const [activeGalleryTab, setActiveGalleryTab] = useState('all')
  const sliderRef = useRef(null)

  // Trigger Real Theatre Curtain Gathering Animation on Landing
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurtainsOpen(true)
    }, 250)

    const finishTimer = setTimeout(() => {
      setCurtainAnimating(false)
    }, 2500)

    return () => {
      clearTimeout(timer)
      clearTimeout(finishTimer)
    }
  }, [])

  useEffect(() => {
    const targetDate = new Date('2026-09-09T09:00:00')
    const updateTimer = () => {
      const now = new Date()
      const diff = targetDate - now

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const amount = direction === 'left' ? -380 : 380
      sliderRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  // Showcase Cards
  const showcaseCards = [
    {
      id: 'vocal',
      tag: 'Day 1 • 9 Sept',
      title: 'Vocal & Acoustic Jam',
      desc: 'Solo, duo or acoustic jams on the main auditorium stage with studio audio setup.',
      day: 'day1',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA19g7gwO_hqDI0yCYWXYGvBfRl-K6nC_TccXYTPA_gJHPOFZ56AYyFdPxhHdPI3bzMl_xQeThFJXr9LDVxxgKpDMRt9kfLU0bPs749tq0gylA5BPz3fc3rFhitAVJBnhA5YaHLcV-nzNuM_cCpSVqUNKOFGilWpGJJRv86po5QCHYYmR3G0cjjHVcIEYddTNcemTpkKRexcgRviy2vXbPbgkJjTMXys3izaA1WNA2iTfVFF_PzuhsL',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    {
      id: 'dance',
      tag: 'Day 1 • 9 Sept',
      title: 'Dance & Crew Battles',
      desc: 'Hip-hop, classical fusion, popping, and squad choreography battles.',
      day: 'day1',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCng2Ae-afsdBBBha0vcZv2rmoC1bdkSKQh-1Hrie1SLBcwQvaNqEvorsBKTZlGHxsLy6toWBh-Pn057U9VnLbIuJzcSRyoYqIosbjgolJhoX5KZ8c4Bp6vE5gqZj6XgnKsVohdPD1cUAgS6aRaQFJRV27TB9mzABdBVm_4a3Xe7fPBv3OdYYR6Knx3Zo0F96hyOoIixxNCU-XqdHQ-6eSn0m5GXXKYo4xPMJYyZgxSZqe8vRMQX9tl',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    },
    {
      id: 'chamber',
      tag: 'Day 2 • 10 Sept',
      title: 'Chamber of Logic (10+1)',
      desc: 'Solve 10 cryptic algorithmic puzzles to crack the 11th master key. Top 20 advance!',
      day: 'day2',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZEv33HJUXtZgTfu4ehI0QjSYk1Xfh9NSXsfcRkyoYLmIbxSnVU9YU6_kyQcun3A7nAQ47ruEhMBYmd7EXUbKd564e2eyaolSXTBJ_QLSR7kmuhE_COue5xK1WoCeRvnqVpdfIGx6AD66G6rivxvg5q3KmRVcKQVjPkbocR8mVmalrCUrjDU_QR1sVcQ22BQM4ooirF4JB3Ts1Ol6HnfolW6sOYuR-dC6XpM8lFDEjNPHgBIUMfIvU',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    },
    {
      id: 'hunt',
      tag: 'Day 2 • 10 Sept',
      title: 'Forbidden Grounds QR Hunt',
      desc: 'Speed campus hunt across 6 hidden locations solving live code snippets.',
      day: 'day2',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmXaQxgKVI6vX4I3jst6w6SwiwxP1hA7loqUgiAnU5lmt0KAN6rbZ6I3IXMeaCa2r1etnKYw76tdFJfSbMjJMet6vqkqinLC_ER9QXBXtSSYmwATie8PlO9vuyON5LpkMx--W5dYL2rRzEyVmHFSgsy6rTtalgMXt5Pjb1_1ZKlbNNtQiCOEJ3OuvhWKr16MLSZ1w7jpiwg9rGojZKJQpK_xAtkFCVF2dd8EJFx7UoKDc4_Rgdv8cf',
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    },
    {
      id: 'champions',
      tag: 'Day 2 • Finale',
      title: 'The Champion’s Flag',
      desc: 'The ultimate sprint to claim the trophy and department championship title.',
      day: 'day2',
      img: trophyImg,
      badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
    },
    {
      id: 'comedy',
      tag: 'Day 1 • 9 Sept',
      title: 'Stand-up & Mono-Acts',
      desc: 'Witty comedy acts, crowd interactions, and theatrical drama skits.',
      day: 'day1',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4O0LAIffGn2-WgBCfvLFM9IAN4M4Prh9Kc-us7ypB0t5cgJVjJgpXj1B8NKaP95XxzUFEznhQ11FPlAHtKdbfRCGx-acliEdvFkTVTNnbbD1c_9aVHtcWlKdPRznANRo3fwHwpZ9QmP4GEBIV5kcHSJMKgYWhfMdLVaAT7J7gmQdFyz0EI3ZyfO3S_ZGqKTs-L5hVnKPb3pxBg3wvoUnY0IqPFGOosKByWoLv97C7DZZDwN8NLb_8',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    }
  ]

  // Gallery
  const galleryItems = [
    {
      id: 1,
      category: 'stage',
      title: 'Grand Vocal Performance',
      sub: 'Solo & Acoustic Jamming at A1 Auditorium',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA19g7gwO_hqDI0yCYWXYGvBfRl-K6nC_TccXYTPA_gJHPOFZ56AYyFdPxhHdPI3bzMl_xQeThFJXr9LDVxxgKpDMRt9kfLU0bPs749tq0gylA5BPz3fc3rFhitAVJBnhA5YaHLcV-nzNuM_cCpSVqUNKOFGilWpGJJRv86po5QCHYYmR3G0cjjHVcIEYddTNcemTpkKRexcgRviy2vXbPbgkJjTMXys3izaA1WNA2iTfVFF_PzuhsL',
      tag: 'Day 1 Highlight'
    },
    {
      id: 2,
      category: 'awards',
      title: 'Champions of EGT Season 1',
      sub: 'Trophy Distribution & Victory Cheers',
      img: trophyImg,
      tag: 'Grand Finale'
    },
    {
      id: 3,
      category: 'tech',
      title: 'Midnight Hack & Debug Arena',
      sub: 'Speed Debugging & DSA Wizardry',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZEv33HJUXtZgTfu4ehI0QjSYk1Xfh9NSXsfcRkyoYLmIbxSnVU9YU6_kyQcun3A7nAQ47ruEhMBYmd7EXUbKd564e2eyaolSXTBJ_QLSR7kmuhE_COue5xK1WoCeRvnqVpdfIGx6AD66G6rivxvg5q3KmRVcKQVjPkbocR8mVmalrCUrjDU_QR1sVcQ22BQM4ooirF4JB3Ts1Ol6HnfolW6sOYuR-dC6XpM8lFDEjNPHgBIUMfIvU',
      tag: 'Day 2 Battle'
    },
    {
      id: 4,
      category: 'crowd',
      title: '1,500+ Roaring Audience',
      sub: 'Electric atmosphere in the Main Theatre',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4O0LAIffGn2-WgBCfvLFM9IAN4M4Prh9Kc-us7ypB0t5cgJVjJgpXj1B8NKaP95XxzUFEznhQ11FPlAHtKdbfRCGx-acliEdvFkTVTNnbbD1c_9aVHtcWlKdPRznANRo3fwHwpZ9QmP4GEBIV5kcHSJMKgYWhfMdLVaAT7J7gmQdFyz0EI3ZyfO3S_ZGqKTs-L5hVnKPb3pxBg3wvoUnY0IqPFGOosKByWoLv97C7DZZDwN8NLb_8',
      tag: 'Community Energy'
    },
    {
      id: 5,
      category: 'stage',
      title: 'Cinematic Dance & Drama Skits',
      sub: 'Mono-acts and expressive crew performances',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCng2Ae-afsdBBBha0vcZv2rmoC1bdkSKQh-1Hrie1SLBcwQvaNqEvorsBKTZlGHxsLy6toWBh-Pn057U9VnLbIuJzcSRyoYqIosbjgolJhoX5KZ8c4Bp6vE5gqZj6XgnKsVohdPD1cUAgS6aRaQFJRV27TB9mzABdBVm_4a3Xe7fPBv3OdYYR6Knx3Zo0F96hyOoIixxNCU-XqdHQ-6eSn0m5GXXKYo4xPMJYyZgxSZqe8vRMQX9tl',
      tag: 'Theatrical Arts'
    },
    {
      id: 6,
      category: 'tech',
      title: 'Triwizard Coding Tournament',
      sub: 'Algorithmic battles & Champion flag hunt',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmXaQxgKVI6vX4I3jst6w6SwiwxP1hA7loqUgiAnU5lmt0KAN6rbZ6I3IXMeaCa2r1etnKYw76tdFJfSbMjJMet6vqkqinLC_ER9QXBXtSSYmwATie8PlO9vuyON5LpkMx--W5dYL2rRzEyVmHFSgsy6rTtalgMXt5Pjb1_1ZKlbNNtQiCOEJ3OuvhWKr16MLSZ1w7jpiwg9rGojZKJQpK_xAtkFCVF2dd8EJFx7UoKDc4_Rgdv8cf',
      tag: 'Campus Wide Hunt'
    }
  ]

  const filteredGallery =
    activeGalleryTab === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeGalleryTab)

  const faqs = [
    {
      q: 'Can I participate in both Day 1 and Day 2?',
      a: 'Yes, absolutely! Day 1 (The Non-Tech Stage) and Day 2 (The Wizarding Tech Arena) have completely independent registrations. You can choose to participate in Day 1 as a performer, Day 2 as a tech wizard, or both!'
    },
    {
      q: 'What is the performance duration and format for Day 1?',
      a: 'Each performance is strictly capped at a maximum of 3 minutes. Participants can register as Solo, Duo (2 members), or Group performers across 12+ creative categories.'
    },
    {
      q: 'How does Audience Registration work for Day 1?',
      a: 'Day 1 has a separate Audience Registration for students who want to enjoy the live showcase at A1 Auditorium as spectators.'
    },
    {
      q: 'What are the Harry Potter challenges on Day 2?',
      a: 'Day 2 features a 5-stage wizarding tech arena at C1 Seminar Hall & Campus Wide: Trial 1 (Chamber of Logic 10+1 DSA riddle challenge), Trial 2 (Triwizard Campus QR Hunt), Trial 3 (Pensieve Debugging), Trial 4 (Dark Arts Security & Encryption), and Trial 5 (The Elder Wand Finale).'
    },
    {
      q: 'Is there any registration fee?',
      a: 'Registration is 100% FREE for all Chandigarh University students, organized by Alexa Developers Community under Department of CSE – Takshashila!'
    }
  ]

  return (
    <div className="w-full bg-[#070709] text-[#f1f1f6] overflow-x-hidden relative">
      {/* ========================================================================= */}
      {/* REAL THEATRE CURTAIN ANIMATION OVERLAY */}
      {/* ========================================================================= */}
      {curtainAnimating && (
        <div className={`real-curtain-container ${curtainsOpen ? 'curtains-real-open' : 'curtains-real-closed'}`}>
          <div className="real-curtain-left"></div>
          <div className="real-curtain-right"></div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: THEATRICAL RED STAGE & 3D METALLIC GOLD TITLE */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center text-center px-2 sm:px-6 md:px-12 pt-28 pb-16 bg-[#0c0303]">
        {/* Stage Hero Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={stageHeroImg}
            alt="Engineer's Got Talent 2.0 Grand Stage"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-radial from-transparent via-[#0f0202]/40 to-[#0c0303]/90"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070709] to-transparent"></div>
        </div>

        <div className="h-10"></div>

        {/* Main Stage Title Emblem */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center my-auto px-2 sm:px-4">
          
          {/* TALENT HUNT ARENA PRESENTS Emblem */}
          <div className="flex items-center gap-2 mb-4 font-['Space_Grotesk'] text-xs sm:text-sm md:text-base font-bold text-[#f7d978] tracking-[0.25em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <span>TALENT HUNT ARENA</span>
          </div>

          <div className="font-['Space_Grotesk'] text-xs font-bold text-gray-300 uppercase tracking-widest mb-6">
            PRESENTS
          </div>

          {/* 3D Metallic Gold Title Graphics */}
          <div className="relative font-['Syne'] font-black uppercase text-center w-full max-w-5xl mx-auto select-none px-2 flex flex-col items-center">
            {/* Line 1: ENGINEER'S */}
            <h1 className="text-[clamp(2.1rem,6.6vw,6.2rem)] leading-none tracking-tight font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#f7d978] to-[#b38515] drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)] whitespace-nowrap text-center">
              ENGINEER’S
            </h1>

            {/* Line 2: GOT divider */}
            <div className="text-[clamp(1.2rem,3.6vw,3.2rem)] text-[#f7d978] my-1 sm:my-2 font-extrabold flex items-center justify-center gap-3 sm:gap-5 tracking-wider whitespace-nowrap">
              <span className="h-[2px] w-8 xs:w-14 sm:w-24 bg-gradient-to-r from-transparent to-[#f7d978]"></span>
              <span>GOT</span>
              <span className="h-[2px] w-8 xs:w-14 sm:w-24 bg-gradient-to-l from-transparent to-[#f7d978]"></span>
            </div>
            
            {/* Line 3: TALENT with Mic in the middle */}
            <div className="text-[clamp(2.1rem,6.6vw,6.2rem)] leading-none tracking-tight font-black text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#f7d978] to-[#b38515] drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)] flex items-center justify-center gap-1.5 sm:gap-3 whitespace-nowrap">
              <span>TAL</span>
              <span className="inline-flex items-center justify-center text-[#f7d978] px-0.5 sm:px-1">
                <Mic className="w-[0.78em] h-[0.78em] text-[#f7d978] drop-shadow-[0_0_18px_rgba(247,217,120,0.9)] animate-pulse" />
              </span>
              <span>ENT</span>
            </div>

            {/* Line 4: 2.0 */}
            <div className="font-['Space_Grotesk'] text-[clamp(1.7rem,4.8vw,4.4rem)] text-[#f7d978] tracking-[0.25em] font-black mt-1 sm:mt-2 drop-shadow-[0_4px_20px_rgba(247,217,120,0.5)] whitespace-nowrap">
              2.0
            </div>
          </div>




          {/* Subtitle with Primary Organizer */}
          <p className="font-['Outfit'] text-base xs:text-lg sm:text-2xl md:text-3xl text-white mt-6 sm:mt-8 max-w-3xl font-extrabold leading-relaxed drop-shadow-md px-2">
            Alexa Developers Community
          </p>

          <p className="font-['Space_Grotesk'] text-[11px] xs:text-xs sm:text-sm md:text-base text-[#f7d978] mt-1.5 sm:mt-2 font-bold tracking-wider uppercase drop-shadow-sm px-2">
            Under Department of CSE – Takshashila • Chandigarh University
          </p>

          {/* Elegant Muted Event Date Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-5 sm:mt-6 mb-2">
            <span className="px-4 py-1.5 sm:py-2 rounded-full bg-[#1e170d]/90 border border-[#a68437]/50 text-[#e0b968] font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-wider inline-flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e0b968] shrink-0" />
              <span>09 SEPT 2026 • NON-TECH STAGE</span>
            </span>
            <span className="px-4 py-1.5 sm:py-2 rounded-full bg-[#0b1a21]/90 border border-[#1d778a]/50 text-[#5ed3e6] font-['Space_Grotesk'] font-bold text-xs sm:text-sm tracking-wider inline-flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5ed3e6] shrink-0" />
              <span>10 SEPT 2026 • WIZARDING TECH ARENA</span>
            </span>
          </div>

          {/* Action CTAs: Full width on mobile */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-sm sm:max-w-none mx-auto px-2">
            <button
              onClick={() => onOpenRegister('day1-performer')}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#e5b84c] via-[#f7d978] to-[#c9982e] text-[#1c0800] font-['Space_Grotesk'] text-xs sm:text-sm font-bold uppercase px-6 sm:px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(247,217,120,0.5)] flex items-center gap-2 cursor-pointer border border-yellow-200/60"
            >
              <Mic className="w-4 h-4" />
              <span>Register Day 1 Performer</span>
            </button>

            <button
              onClick={() => onOpenRegister('day2-wizard')}
              className="w-full sm:w-auto justify-center bg-[#09090d]/90 text-[#00F2FF] font-['Space_Grotesk'] text-xs sm:text-sm font-bold uppercase px-6 sm:px-8 py-3.5 rounded-full hover:bg-cyan-500/10 transition-all shadow-[0_0_25px_rgba(0,242,255,0.4)] flex items-center gap-2 cursor-pointer border-2 border-[#00F2FF]"
            >
              <Code className="w-4 h-4" />
              <span>Register Day 2 Tech Wizard</span>
            </button>

            <button
              onClick={() => setCurrentPage('day1')}
              className="w-full sm:w-auto justify-center bg-[#140e06] hover:bg-[#261b0a] border-2 border-[#f7d978]/60 text-[#f7d978] font-['Space_Grotesk'] text-xs sm:text-sm font-extrabold uppercase px-6 sm:px-7 py-3.5 rounded-full flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(247,217,120,0.3)] hover:scale-105 transition-all"
            >
              <Ticket className="w-4 h-4 text-[#f7d978]" />
              <span>Audience Pass</span>
            </button>
          </div>
        </div>

        {/* Live Countdown Pod */}
        <div className="relative z-10 mt-8 bg-[#150404]/90 backdrop-blur-xl px-6 py-3.5 rounded-full border border-[#f7d978]/40 flex items-center gap-4 sm:gap-6 shadow-2xl">
          <span className="font-['Space_Grotesk'] text-xs font-bold uppercase text-[#f7d978] flex items-center gap-1.5 hidden sm:flex">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Event Countdown:</span>
          </span>

          <div className="flex items-center gap-3 sm:gap-5 font-['Space_Grotesk'] text-sm sm:text-base font-bold">
            <div>
              <span className="text-[#f7d978] text-lg sm:text-xl">{timeLeft.days}</span>
              <span className="text-gray-400 text-xs ml-1">Days</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-white text-lg sm:text-xl">{timeLeft.hours}</span>
              <span className="text-gray-400 text-xs ml-1">Hours</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-white text-lg sm:text-xl">{timeLeft.minutes}</span>
              <span className="text-gray-400 text-xs ml-1">Mins</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-cyan-400 text-lg sm:text-xl">{timeLeft.seconds}</span>
              <span className="text-cyan-400 text-xs ml-1">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & HIGHLIGHT METRICS STRIP */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#070709] border-y border-white/10 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            <div className="glass-panel p-4 sm:p-6 rounded-2xl text-center border border-white/10">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-[#f7d978] mx-auto mb-1.5 sm:mb-2" />
              <p className="font-sans text-xl sm:text-3xl font-extrabold text-white">2 Days</p>
              <p className="font-sans text-[11px] sm:text-xs text-gray-300 tracking-wide mt-0.5 sm:mt-1">Grand Mega Event</p>
            </div>

            <div className="glass-panel p-4 sm:p-6 rounded-2xl text-center border border-white/10">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#f7d978] mx-auto mb-1.5 sm:mb-2" />
              <p className="font-sans text-xl sm:text-3xl font-extrabold text-white">2 Arenas</p>
              <p className="font-sans text-[11px] sm:text-xs text-gray-300 tracking-wide mt-0.5 sm:mt-1">Stage &amp; Tech Arena</p>
            </div>

            <div className="glass-panel p-4 sm:p-6 rounded-2xl text-center border border-white/10">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400 mx-auto mb-1.5 sm:mb-2" />
              <p className="font-sans text-xl sm:text-3xl font-extrabold text-white">12+ Acts</p>
              <p className="font-sans text-[11px] sm:text-xs text-gray-300 tracking-wide mt-0.5 sm:mt-1">Creative Categories</p>
            </div>

            <div className="glass-panel p-4 sm:p-6 rounded-2xl text-center border border-cyan-400/20">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400 mx-auto mb-1.5 sm:mb-2" />
              <p className="font-sans text-xl sm:text-3xl font-extrabold text-cyan-400">5 Rounds</p>
              <p className="font-sans text-[11px] sm:text-xs text-cyan-300 tracking-wide mt-0.5 sm:mt-1 font-semibold">Wizarding Tech Battles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DUAL ARENAS SHOWCASE SECTION */}
      {/* ========================================================================= */}
      <section id="about-section" className="w-full bg-[#0b0b10] py-20 md:py-28 relative overflow-hidden">
        {/* Ambient atmosphere depth glows */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(circle_at_20%_35%,rgba(247,217,120,0.05),transparent_50%),radial-gradient(circle_at_80%_65%,rgba(34,211,238,0.05),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
              Choose Your Arena
            </span>
            <h2 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
              Two Arenas. Infinite Possibilities.
            </h2>
            <p className="font-sans text-sm sm:text-base text-gray-400 max-w-xl mx-auto mt-3">
              Whether you rule the stage with raw performance or dominate the wizarding tech arena, your legacy starts here.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Day 1 Card — THE STAGE */}
            <div className="glass-panel p-5 xs:p-6 sm:p-10 rounded-3xl border border-[#f7d978]/20 hover:border-[#f7d978]/45 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-[#141009]/95 via-[#0c0c11]/98 to-[#070709]/95 hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(247,217,120,0.05)] transition-all duration-500 ease-out">
              {/* Internal Spotlight Light Leak Overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#f7d978]/6 to-transparent rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-4 sm:mb-6 relative z-10">
                  <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#f7d978]/10 text-[#f7d978] border border-[#f7d978]/25 font-sans text-[11px] sm:text-xs font-semibold">
                    9 September 2026 • A1 Auditorium
                  </span>
                  <span className="text-[#f7d978] font-sans text-xs font-bold tracking-wide uppercase">Day 1 Stage</span>
                </div>

                <h3 className="font-['Syne'] text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-wide relative z-10">THE STAGE</h3>
                <p className="font-sans text-xs sm:text-base font-semibold text-amber-200/80 italic my-1.5 sm:my-2 relative z-10">"Show the talent beyond the engineer."</p>
                <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 sm:mb-6 font-normal relative z-10">
                  Step away from code into the golden spotlight. A 3-minute stage showcase for vocalists, instrumentalists, stand-up comedians, mono-actors, and dance crews.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-6 relative z-10">
                  {['Vocals & Jamming', 'Dance & Choreography', 'Stand-up Comedy', 'Magic & Illusions'].map((item, idx) => (
                    <div key={idx} className="bg-[#f7d978]/5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-sans border border-[#f7d978]/15 hover:border-[#f7d978]/35 text-amber-100/90 transition-colors flex items-center justify-center text-center font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-[#f7d978]/15 relative z-10">
                <button
                  onClick={() => setCurrentPage('day1')}
                  className="w-full sm:flex-1 btn-secondary-glass justify-center hover:bg-white/10"
                >
                  <span>Explore Day 1 Details</span>
                  <ArrowUpRight className="w-4 h-4 text-[#f7d978]" />
                </button>
                <button
                  onClick={() => setCurrentPage('day1')}
                  className="w-full sm:w-auto btn-primary-gold justify-center"
                >
                  <Mic className="w-4 h-4" />
                  <span>Register Act</span>
                </button>
              </div>
            </div>

            {/* Day 2 Card — THE ARENA */}
            <div className="glass-panel p-5 xs:p-6 sm:p-10 rounded-3xl border border-[#22d3ee]/20 hover:border-[#22d3ee]/45 flex flex-col justify-between relative overflow-hidden group bg-gradient-to-br from-[#081317]/95 via-[#0c0c11]/98 to-[#070709]/95 hover:scale-[1.015] hover:shadow-[0_20px_50px_rgba(34,211,238,0.05)] transition-all duration-500 ease-out">
              {/* Internal Tech Glow Overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-radial from-[#22d3ee]/6 to-transparent rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mb-4 sm:mb-6 relative z-10">
                  <span className="px-3.5 sm:px-4 py-1.5 rounded-full bg-[#22d3ee]/10 text-cyan-300 border border-[#22d3ee]/25 font-sans text-[11px] sm:text-xs font-semibold">
                    10 September 2026 • C1 Seminar Hall
                  </span>
                  <span className="text-cyan-400 font-sans text-xs font-bold tracking-wide uppercase">Day 2 Tech Arena</span>
                </div>

                <h3 className="font-['Syne'] text-2xl xs:text-3xl sm:text-4xl font-extrabold text-white tracking-wide relative z-10">THE WIZARD’S CODE</h3>
                <p className="font-sans text-xs sm:text-base font-semibold text-cyan-200/80 italic my-1.5 sm:my-2 relative z-10">"Harry Potter — The Wizarding World of Technology"</p>
                <p className="font-sans text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 sm:mb-6 font-normal relative z-10">
                  Enter an enchanted 5-stage tech arena at C1 Seminar Hall. Battle through Trial 1: Chamber of Logic, Trial 2: Triwizard Hunt, Trial 3: Pensieve Debug, Trial 4: Dark Arts Security, and Trial 5: The Elder Wand Finale.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 my-4 sm:my-6 relative z-10">
                  {['Trial 1: Chamber of Logic', 'Trial 2: Triwizard Hunt', 'Trial 3: Pensieve Debug', 'Trial 4 & 5: Elder Wand Finale'].map((item, idx) => (
                    <div key={idx} className="bg-[#22d3ee]/5 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-sans border border-[#22d3ee]/15 hover:border-[#22d3ee]/35 text-cyan-100/90 transition-colors flex items-center justify-center text-center font-medium">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-5 sm:pt-6 border-t border-[#22d3ee]/15 relative z-10">
                <button
                  onClick={() => setCurrentPage('day2')}
                  className="w-full sm:flex-1 btn-secondary-glass justify-center hover:bg-white/10"
                >
                  <span>Explore Day 2 Details</span>
                  <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                </button>
                <button
                  onClick={() => setCurrentPage('day2')}
                  className="w-full sm:w-auto btn-primary-cyan justify-center"
                >
                  <Code className="w-4 h-4" />
                  <span>Register Squad</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CAROUSEL SHOWCASE WITH ACCESSIBLE ARROWS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 md:px-12 border-t border-white/10 bg-[#070709]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-sans text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
                Event Highlights
              </span>
              <h2 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-white">
                Featured Acts &amp; Battles
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollSlider('left')}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#f7d978] hover:text-black transition-all flex items-center justify-center border border-white/15 cursor-pointer shadow-md"
                aria-label="Previous featured act card"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#f7d978] hover:text-black transition-all flex items-center justify-center border border-white/15 cursor-pointer shadow-md"
                aria-label="Next featured act card"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 scroll-smooth"
          >
            {showcaseCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setCurrentPage(card.day)}
                className="min-w-[250px] xs:min-w-[290px] sm:min-w-[350px] rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#f7d978]/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-[200px] sm:h-[230px] overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent"></div>
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-sans font-semibold border ${card.badgeClass}`}>
                    {card.tag}
                  </span>
                </div>

                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-sans text-lg sm:text-xl font-bold text-white group-hover:text-[#f7d978] transition-colors">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs text-gray-300 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-4 border-t border-white/10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 font-sans text-xs font-bold group-hover:bg-[#f7d978] group-hover:text-black transition-all">
                      <span>View Category</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HALL OF FAME GALLERY */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#0c0c12] py-14 sm:py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <span className="font-sans text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
              The Legacy
            </span>
            <h2 className="font-['Syne'] text-2xl xs:text-3xl sm:text-5xl font-extrabold text-white">
              Hall of Fame &amp; Past Season Highlights
            </h2>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              {[
                { id: 'all', label: 'All Highlights' },
                { id: 'stage', label: 'Stage Battles' },
                { id: 'tech', label: 'Tech Arenas' },
                { id: 'awards', label: 'Trophies & Victories' },
                { id: 'crowd', label: 'Crowd Energy' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id)}
                  className={`btn-tab text-xs px-3 sm:px-4 py-1.5 sm:py-2 ${
                    activeGalleryTab === tab.id
                      ? 'bg-[#f7d978] text-[#1c0800] shadow-[0_0_15px_rgba(247,217,120,0.4)] font-bold'
                      : 'bg-white/5 text-gray-300 border border-white/10 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative h-[260px] sm:h-[320px] rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#f7d978]/50 transition-all duration-300 cursor-pointer"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-85 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/50 to-transparent flex flex-col justify-end p-5 sm:p-6 z-10">
                  <span className="inline-block self-start px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#f7d978] font-sans text-xs font-semibold rounded-full mb-2">
                    {item.tag}
                  </span>
                  <h3 className="font-sans text-base sm:text-lg font-bold text-white group-hover:text-[#f7d978] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-gray-400 mt-1 font-light">
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SPONSORS & STRATEGIC PARTNERS SECTION */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#050508] py-14 sm:py-20 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center relative z-10">
          <span className="font-['Space_Grotesk'] text-xs font-extrabold text-[#f7d978] tracking-[0.25em] uppercase block mb-3">
            Official Sponsors &amp; Community Partners
          </span>
          <h2 className="font-['Syne'] text-2xl xs:text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            POWERED BY INNOVATION
          </h2>
          <p className="font-sans text-xs sm:text-base text-gray-400 max-w-xl mx-auto mb-8 sm:mb-12 font-light px-2">
            Proudly supported by leading tech communities, academic institutions, and developer organizations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 items-center max-w-5xl mx-auto">
            {/* Sponsor 1: GeeksforGeeks */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 hover:border-emerald-400/60 bg-gradient-to-b from-emerald-950/25 to-black/70 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 group shadow-[0_0_30px_rgba(46,125,50,0.15)]">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase border border-emerald-500/30">
                Official Tech Sponsor
              </span>
              <img
                src={gfgLogo}
                alt="GeeksforGeeks Logo"
                className="h-10 sm:h-14 object-contain filter drop-shadow-[0_0_20px_rgba(46,125,50,0.6)] group-hover:scale-105 transition-transform my-1 sm:my-2"
              />
              <p className="text-xs text-emerald-200/90 font-['Space_Grotesk'] font-bold tracking-wider uppercase">GeeksforGeeks</p>
            </div>

            {/* Partner 2: Chandigarh University */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 hover:border-rose-400/60 bg-gradient-to-b from-rose-950/25 to-black/70 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 group shadow-[0_0_30px_rgba(244,63,94,0.15)]">
              <span className="px-3.5 py-1 rounded-full bg-rose-500/15 text-rose-400 text-[10px] font-extrabold tracking-widest uppercase border border-rose-500/30">
                Host Institution
              </span>
              <img
                src={cuLogo}
                alt="Chandigarh University Logo"
                className="h-10 sm:h-14 object-contain filter drop-shadow-[0_0_20px_rgba(244,63,94,0.5)] group-hover:scale-105 transition-transform my-1 sm:my-2"
              />
              <p className="text-xs text-rose-200/90 font-['Space_Grotesk'] font-bold tracking-wider uppercase">Department of CSE – Takshashila</p>
            </div>

            {/* Partner 3: Alexa Developers Community */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 hover:border-cyan-400/60 bg-gradient-to-b from-cyan-950/25 to-black/70 flex flex-col items-center justify-center gap-3 sm:gap-4 transition-all hover:scale-105 group shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-extrabold tracking-widest uppercase border border-cyan-500/30">
                Organizing Community
              </span>
              <img
                src={alexaLogo}
                alt="Alexa Developers Community Logo"
                className="h-10 sm:h-14 object-contain filter drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] group-hover:scale-105 transition-transform my-1 sm:my-2"
              />
              <p className="text-xs text-cyan-200/90 font-['Space_Grotesk'] font-bold tracking-wider uppercase">Alexa Developers Community</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. ORGANIZERS & CONTACT US SECTION */}
      {/* ========================================================================= */}
      <section id="contact-section" className="py-14 sm:py-20 px-4 sm:px-6 md:px-12 text-center border-t border-white/10 bg-[#070709]">
        <div className="max-w-5xl mx-auto">
          <span className="font-sans text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
            Get In Touch &amp; Follow Us
          </span>
          <h2 className="font-sans text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-2">
            Alexa Developers Community
          </h2>
          <p className="font-sans text-xs sm:text-sm text-gray-300 font-medium">
            Under Department of CSE – Takshashila • Chandigarh University
          </p>

          {/* Social Media & Official Channels Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {/* Official Website */}
            <a
              href="https://alexa-developers-at-cu.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-5 rounded-2xl bg-[#0f0f18] border border-cyan-500/30 hover:border-cyan-400 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 group shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">Official Website</p>
                <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">alexa-developers-at-cu.vercel.app ↗</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/alexadev.cu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#0f0f18] border border-rose-500/30 hover:border-rose-400 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors">Instagram</p>
                <p className="text-[11px] text-gray-400 mt-0.5">@alexadev.cu ↗</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/alexadevscu/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#0f0f18] border border-blue-500/30 hover:border-blue-400 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-white group-hover:text-blue-300 transition-colors">LinkedIn</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Alexa Devs CU ↗</p>
              </div>
            </a>

            {/* WhatsApp Channel */}
            <a
              href="https://chat.whatsapp.com/GQScMwZ7X6EKAjfqAFkz4q"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-[#0f0f18] border border-emerald-500/30 hover:border-emerald-400 flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-105 group shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">WhatsApp Channel</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Join Announcements ↗</p>
              </div>
            </a>
          </div>

          <div className="mt-8 p-8 rounded-3xl glass-panel border border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-left font-sans text-xs text-gray-300">
              <div>
                <p className="font-bold text-[#f7d978] uppercase">Official Event Inquiries</p>
                <p className="text-sm text-white font-medium mt-0.5">Email: adc.cu@cumail.in</p>
              </div>
              <a
                href="mailto:adc.cu@cumail.in"
                className="btn-primary-gold text-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FAQ ACCORDION */}
      {/* ========================================================================= */}
      <section className="w-full bg-[#0a0a0f] py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="font-sans text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
              Got Questions?
            </span>
            <h2 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl glass-panel border border-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-white hover:text-[#f7d978] cursor-pointer"
                  >
                    <span className="font-sans text-base sm:text-lg font-semibold flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-[#f7d978] shrink-0" />
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#f7d978] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm font-sans text-gray-300 border-t border-white/10 leading-relaxed font-light">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOTTOM CTA */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 md:px-12 text-center border-t border-white/10 bg-gradient-to-b from-[#070709] to-[#0c0c12]">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-yellow-400/20 text-[#f7d978] font-sans text-xs font-bold tracking-wide border border-yellow-400/30">
            Registrations Open
          </span>

          <h2 className="font-sans text-4xl sm:text-6xl font-extrabold text-white leading-tight">
            Claim Your Spot on the Grand Stage
          </h2>

          <p className="font-sans text-sm sm:text-base text-gray-400 max-w-xl mx-auto font-light">
            Whether you rule the stage with your raw performance or conquer the wizarding coding arena, your journey begins on 9 &amp; 10 September.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentPage('day1')}
              className="btn-primary-gold"
            >
              <Mic className="w-4 h-4" />
              <span>Register as Performer</span>
            </button>

            <button
              onClick={() => setCurrentPage('day2')}
              className="btn-primary-cyan"
            >
              <Code className="w-4 h-4" />
              <span>Register as Tech Wizard</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
