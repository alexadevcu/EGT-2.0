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
  Send
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
      : galleryItems.filter((item) => item.category === item)

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
      a: 'Day 2 features Round 1 (The Chamber of Logic 10+1 riddle challenge), Live Leaderboard cut-off (top 20 advance), Round 2 (The Forbidden Grounds 6-location campus QR hunt), and The Champion’s Flag final sprint.'
    },
    {
      q: 'Is there any registration fee?',
      a: 'Registration is 100% FREE for all Chandigarh University students, organized by Department of CSE – Takshashila!'
    }
  ]

  return (
    <div className="w-full bg-[#070709] text-[#f1f1f6] overflow-hidden relative">

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: THEATRICAL RED STAGE & 3D METALLIC GOLD TITLE */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-12 pt-28 pb-16 overflow-hidden bg-[#0c0303]">
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
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center my-auto px-4">
          
          {/* TALENT HUNT ARENA PRESENTS Emblem */}
          <div className="flex items-center gap-2 mb-4 font-['Space_Grotesk'] text-xs sm:text-sm md:text-base font-bold text-[#f7d978] tracking-[0.25em] uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            <span>TALENT HUNT ARENA</span>
          </div>

          <div className="font-['Space_Grotesk'] text-xs font-bold text-gray-300 uppercase tracking-widest mb-6">
            PRESENTS
          </div>
          {/* 3D Metallic Gold Title Graphics */}
          <div className="relative font-['Syne'] text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-b from-[#FFFBEB] via-[#f7d978] to-[#b38515] drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
            ENGINEER’S
            <div className="text-2xl sm:text-5xl md:text-6xl text-[#f7d978] my-1 font-extrabold flex items-center justify-center gap-2 sm:gap-3">
              <span className="h-[2px] w-8 sm:w-20 bg-gradient-to-r from-transparent to-[#f7d978]"></span>
              <span>GOT</span>
              <span className="h-[2px] w-8 sm:w-20 bg-gradient-to-l from-transparent to-[#f7d978]"></span>
            </div>
            
            {/* TALENT 2.0 Title */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-4">
              <span>TAL</span>
              <div className="relative inline-flex items-center justify-center text-[#f7d978]">
                <Mic className="w-8 h-8 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#f7d978] drop-shadow-[0_0_15px_rgba(247,217,120,0.8)] animate-pulse" />
              </div>
              <span>ENT</span>
            </div>

            <div className="font-['Space_Grotesk'] text-3xl sm:text-6xl md:text-7xl text-[#f7d978] tracking-widest mt-1 sm:mt-2">
              2.0
            </div>
          </div>

          {/* Subtitle with Student Clubs as Primary Organizers */}
          <p className="font-['Outfit'] text-base sm:text-2xl md:text-3xl text-white mt-6 sm:mt-8 max-w-3xl font-extrabold leading-relaxed drop-shadow-md">
            Alexa Developers Community &amp; GFG Student Chapter
          </p>

          <p className="font-['Space_Grotesk'] text-[11px] sm:text-sm md:text-base text-[#f7d978] mt-2 font-bold tracking-wider uppercase drop-shadow-sm">
            Under Department of CSE – Takshashila • Chandigarh University
          </p>

          <p className="font-sans text-xs sm:text-sm text-gray-300 mt-3 font-normal">
            <span className="text-[#f7d978] font-bold">9 Sept:</span> Non-Tech Stage &bull;{' '}
            <span className="text-cyan-400 font-bold">10 Sept:</span> Wizarding Tech Arena
          </p>

          {/* Action CTAs: Navigate directly to Day 1 / Day 2 pages */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
            <button
              onClick={() => setCurrentPage('day1')}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#e5b84c] via-[#f7d978] to-[#c9982e] text-[#1c0800] font-['Space_Grotesk'] text-xs sm:text-sm font-bold uppercase px-6 sm:px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(247,217,120,0.5)] flex items-center gap-2 cursor-pointer border border-yellow-200/60"
            >
              <Mic className="w-4 h-4" />
              <span>Register Day 1 Performer</span>
            </button>

            <button
              onClick={() => setCurrentPage('day2')}
              className="w-full sm:w-auto justify-center bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-black font-['Space_Grotesk'] text-xs sm:text-sm font-bold uppercase px-6 sm:px-8 py-3.5 rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)] flex items-center gap-2 cursor-pointer border border-cyan-200/60"
            >
              <Code className="w-4 h-4" />
              <span>Register Day 2 Tech Squad</span>
            </button>

            <button
              onClick={() => setCurrentPage('day1')}
              className="w-full sm:w-auto justify-center glass-pill text-gray-200 hover:text-[#f7d978] font-['Space_Grotesk'] text-xs sm:text-sm font-semibold uppercase px-6 sm:px-3.5 rounded-full flex items-center gap-2 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-[#f7d978]" />
              <span>Audience Pass</span>
            </button>
          </div>
        </div>

        {/* Live Countdown Pod */}
        <div className="relative z-10 mt-6 sm:mt-8 bg-[#150404]/90 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-full border border-[#f7d978]/40 flex flex-col sm:flex-row items-center gap-2 sm:gap-6 shadow-2xl">
          <span className="font-['Space_Grotesk'] text-xs font-bold uppercase text-[#f7d978] flex items-center gap-1.5">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>Event Countdown:</span>
          </span>

          <div className="flex items-center gap-2.5 sm:gap-5 font-['Space_Grotesk'] text-xs sm:text-base font-bold">
            <div>
              <span className="text-[#f7d978] text-base sm:text-xl">{timeLeft.days}</span>
              <span className="text-gray-400 text-[10px] sm:text-xs ml-1">Days</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-white text-base sm:text-xl">{timeLeft.hours}</span>
              <span className="text-gray-400 text-[10px] sm:text-xs ml-1">Hours</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-white text-base sm:text-xl">{timeLeft.minutes}</span>
              <span className="text-gray-400 text-[10px] sm:text-xs ml-1">Mins</span>
            </div>
            <span className="text-gray-600">:</span>
            <div>
              <span className="text-cyan-400 text-base sm:text-xl">{timeLeft.seconds}</span>
              <span className="text-cyan-400 text-[10px] sm:text-xs ml-1">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. IMPACT METRICS GRID */}
      {/* ========================================================================= */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 border-y border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-6 rounded-2xl text-center border border-white/10">
            <Calendar className="w-7 h-7 text-[#f7d978] mx-auto mb-2" />
            <p className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">2 Days</p>
            <p className="font-['Space_Grotesk'] text-xs text-gray-300 tracking-wide mt-1">Grand Mega Festival</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border border-white/10">
            <Users className="w-7 h-7 text-[#f7d978] mx-auto mb-2" />
            <p className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">2,500+</p>
            <p className="font-['Space_Grotesk'] text-xs text-gray-300 tracking-wide mt-1">Expected Footfall</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border border-white/10">
            <Flame className="w-7 h-7 text-rose-400 mx-auto mb-2" />
            <p className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">12+ Acts</p>
            <p className="font-['Space_Grotesk'] text-xs text-gray-300 tracking-wide mt-1">Creative Categories</p>
          </div>

          <div className="glass-panel p-6 rounded-2xl text-center border border-cyan-400/20">
            <Zap className="w-7 h-7 text-cyan-400 mx-auto mb-2" />
            <p className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-cyan-400">5 Rounds</p>
            <p className="font-['Space_Grotesk'] text-xs text-cyan-300 tracking-wide mt-1 font-semibold">Wizarding Tech Battles</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DUAL ARENAS SHOWCASE SECTION */}
      {/* ========================================================================= */}
      <section id="about-section" className="py-20 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
            Choose Your Arena
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
            Two Arenas. Infinite Possibilities.
          </h2>
          <p className="font-sans text-sm sm:text-base text-gray-400 max-w-xl mx-auto mt-3">
            Whether you rule the stage with raw performance or dominate the wizarding tech arena, your legacy starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Day 1 Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-rose-500/30 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-['Space_Grotesk'] text-xs font-semibold">
                  9 September 2026 • A1 Auditorium
                </span>
                <span className="text-rose-400 font-['Space_Grotesk'] text-xs font-bold">Day 1 Stage</span>
              </div>

              <h3 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-white">THE STAGE</h3>
              <p className="font-['Outfit'] text-base text-[#f7d978] italic my-2">"Show the talent beyond the engineer."</p>
              <p className="font-sans text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                Step away from code into the golden spotlight. A 3-minute stage showcase for vocalists, instrumentalists, stand-up comedians, mono-actors, and dance crews.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                {['Vocals & Jamming', 'Dance & Choreography', 'Stand-up Comedy', 'Magic & Illusions'].map((item, idx) => (
                  <div key={idx} className="bg-white/5 px-3 py-2.5 rounded-xl text-xs font-['Space_Grotesk'] border border-white/10 text-gray-200 flex items-center justify-center text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => setCurrentPage('day1')}
                className="flex-1 btn-secondary-glass"
              >
                <span>Explore Day 1 Details</span>
                <ArrowUpRight className="w-4 h-4 text-[#f7d978]" />
              </button>
              <button
                onClick={() => setCurrentPage('day1')}
                className="btn-primary-gold"
              >
                <Mic className="w-4 h-4" />
                <span>Register Act</span>
              </button>
            </div>
          </div>

          {/* Day 2 Card */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-cyan-400/30 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-['Space_Grotesk'] text-xs font-semibold">
                  10 September 2026 • The Wizarding Arena
                </span>
                <span className="text-cyan-400 font-['Space_Grotesk'] text-xs font-bold">Day 2 Arena</span>
              </div>

              <h3 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-white">THE ARENA</h3>
              <p className="font-['Outfit'] text-base text-cyan-300 italic my-2">"Harry Potter — The Wizarding World of Technology"</p>
              <p className="font-sans text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                Enter an enchanted technological arena where code is your magic and logic is your wand. Crack cryptic chambers, hunt QR horcruxes across campus, and seize the Champion’s Flag.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
                {['Chamber of Logic (10+1)', 'Campus QR Horcrux Hunt', 'Top 20 Live Cut-off', 'Champion’s Flag Sprint'].map((item, idx) => (
                  <div key={idx} className="bg-white/5 px-3 py-2.5 rounded-xl text-xs font-['Space_Grotesk'] border border-cyan-400/20 text-cyan-200 flex items-center justify-center text-center">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-6 border-t border-cyan-400/20">
              <button
                onClick={() => setCurrentPage('day2')}
                className="flex-1 btn-secondary-glass"
              >
                <span>Explore Day 2 Details</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-400" />
              </button>
              <button
                onClick={() => setCurrentPage('day2')}
                className="btn-primary-cyan"
              >
                <Code className="w-4 h-4" />
                <span>Register Squad</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CAROUSEL SHOWCASE WITH ACCESSIBLE ARROWS */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 md:px-12 border-t border-white/10 bg-[#09090d]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
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
                className="min-w-[300px] sm:min-w-[350px] rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#f7d978]/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-[230px] overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-transparent to-transparent"></div>
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-['Space_Grotesk'] font-semibold border ${card.badgeClass}`}>
                    {card.tag}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-['Outfit'] text-xl font-bold text-white group-hover:text-[#f7d978] transition-colors">
                      {card.title}
                    </h3>
                    <p className="font-sans text-xs text-gray-300 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 font-['Space_Grotesk'] text-xs font-bold group-hover:bg-[#f7d978] group-hover:text-black transition-all">
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
      <section className="py-20 md:py-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
            The Legacy
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
            Hall of Fame &amp; Past Season Highlights
          </h2>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-8">
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
                className={`btn-tab ${
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="group relative h-[320px] rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#f7d978]/50 transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/50 to-transparent flex flex-col justify-end p-6 z-10">
                <span className="inline-block self-start px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#f7d978] font-['Space_Grotesk'] text-xs font-semibold rounded-full mb-2">
                  {item.tag}
                </span>
                <h3 className="font-['Outfit'] text-lg font-bold text-white group-hover:text-[#f7d978] transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-gray-400 mt-1 font-light">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ORGANIZERS & CONTACT US SECTION */}
      {/* ========================================================================= */}
      <section id="contact-section" className="py-20 px-4 sm:px-6 md:px-12 text-center border-t border-white/10 bg-[#09090d]">
        <div className="max-w-4xl mx-auto">
          <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
            Organized By
          </span>
          <h2 className="font-['Syne'] text-3xl sm:text-4xl font-extrabold text-white">
            Alexa Developers Community &amp; GFG Student Chapter
          </h2>
          <p className="font-sans text-sm text-gray-300 mt-2 font-medium">
            Under Department of CSE – Takshashila • Chandigarh University
          </p>

          <div className="mt-10 p-8 rounded-3xl glass-panel border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Chandigarh University Logo Card */}
              <div className="bg-[#0f0f18] border border-white/15 p-5 rounded-2xl flex items-center justify-center h-24 shadow-xl hover:border-[#f7d978]/50 hover:scale-105 transition-all">
                <img src={cuLogo} alt="Chandigarh University" className="h-12 w-auto object-contain" />
              </div>

              {/* Alexa Developers Community Logo Card */}
              <div className="bg-[#0f0f18] border border-white/15 p-5 rounded-2xl flex items-center justify-center h-24 shadow-xl hover:border-[#f7d978]/50 hover:scale-105 transition-all">
                <img src={alexaLogo} alt="Alexa Developers Community" className="h-12 w-auto object-contain" />
              </div>

              {/* GeeksforGeeks Logo Card */}
              <div className="bg-[#0f0f18] border border-white/15 p-5 rounded-2xl flex items-center justify-center h-24 shadow-xl hover:border-[#f7d978]/50 hover:scale-105 transition-all">
                <img src={gfgLogo} alt="GeeksforGeeks" className="h-10 w-auto object-contain" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-left font-['Space_Grotesk'] text-xs text-gray-300">
              <div>
                <p className="font-bold text-[#f7d978] uppercase">Official Event Inquiries</p>
                <p>Email: adc.cu@cumail.in</p>
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
      <section className="py-20 px-4 sm:px-6 md:px-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-[#f7d978] tracking-[0.2em] block mb-2 uppercase">
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
                    <span className="font-['Outfit'] text-base sm:text-lg font-semibold flex items-center gap-3">
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
      <section className="py-20 px-4 sm:px-6 md:px-12 text-center border-t border-white/10 bg-gradient-to-b from-[#070709] to-[#0d0d14]">
        <div className="max-w-3xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-yellow-400/20 text-[#f7d978] font-['Space_Grotesk'] text-xs font-bold tracking-wide border border-yellow-400/30">
            Registrations Open
          </span>

          <h2 className="font-['Syne'] text-4xl sm:text-6xl font-extrabold text-white leading-tight">
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
