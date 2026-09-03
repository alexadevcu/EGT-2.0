import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import stageHero from '../assets/stage_hero.jpg'
import belgianWaffleLogo from '../assets/Logo/Belgiam Waffle and co..svg'
import './Day1Page.css'

gsap.registerPlugin(ScrollTrigger)

const moments = [
  'ARRIVE',
  'LIGHTS DOWN',
  'SPOTLIGHT',
  'FIRST ACT',
  'THE STAGE COMES ALIVE',
  'THE PERFORMANCE',
  'THE FINAL MOMENT',
  "SHOW'S OVER"
]

const talentActs = [
  'SINGING',
  'DANCE',
  'INSTRUMENTAL',
  'STAND-UP COMEDY',
  'DRAMA & THEATRE',
  'OTHERS'
]

const formats = [
  ['SOLO', 1, 'One light. One voice.'],
  ['DUO', 2, 'Two paths meet centre stage.'],
  ['GROUP', 5, 'A shared moment, made larger together.']
]

export default function Day1Page({ onOpenRegister }) {
  const page = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!page.current) return

    let ctx = null
    const timer = setTimeout(() => {
      if (!page.current) return
      const isMobile = window.innerWidth <= 700

      ctx = gsap.context(() => {
        // 1. HERO TITLE REVEAL & SCRUB SCALING
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.day1-hero__beam', { opacity: 0, scale: 0.55, duration: 1.5 })
          .from('.day1-hero__date', { y: 20, opacity: 0, duration: 0.55 }, '-=.75')
          .from('.day1-hero__title span', { yPercent: 110, rotate: 3, opacity: 0, stagger: 0.14, duration: 0.9 }, '-=.2')
          .from('.day1-hero__detail', { y: 18, opacity: 0, stagger: 0.12, duration: 0.5 }, '-=.4')

        gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        })
          .to('.day1-hero__title span', { scale: 1.2, opacity: 0.2, stagger: 0.1 })
          .to('.day1-hero__beam', { scale: 1.3, opacity: 0.2 }, 0)

        // 2. SCENE ONE INTRO (PINNED SPOTLIGHT SCRUB ON DESKTOP & MOBILE)
        gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-intro',
            start: 'top top',
            end: isMobile ? '+=45%' : '+=105%',
            scrub: 0.8,
            pin: true,
            anticipatePin: 1
          }
        })
          .from('.day1-intro__title', { yPercent: 40, opacity: 0 })
          .from('.day1-intro__copy > *', { y: 24, opacity: 0, stagger: 0.18 }, '-=.4')
          .to('.day1-intro__spot', { xPercent: 120, yPercent: -20, scale: 1.25 }, 0)

        // 3. MINUTE TO MINUTE SCHEDULE SECTION (PINNED SEQUENTIAL HIGHLIGHTS ON DESKTOP & MOBILE)
        const momentItems = gsap.utils.toArray('.day1-moment')
        const story = gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-timeline',
            start: 'top top',
            end: isMobile ? '+=90%' : '+=220%',
            scrub: 0.5,
            pin: true,
            anticipatePin: 1
          }
        }).from('.day1-timeline__line-fill', { scaleY: 0, transformOrigin: 'top', duration: 8 })

        momentItems.forEach((item, index) => {
          story.to(item, { opacity: 1, x: 0, duration: 0.75 }, index)
            .to(item, { '--moment-glow': 1, duration: 0.25 }, index + 0.15)
          if (index) {
            story.to(momentItems[index - 1], { '--moment-glow': 0, opacity: 0.32, duration: 0.35 }, index + 0.2)
          }
        })

        // 4. HORIZONTAL SCROLLING TRACK ("YOUR TALENT" SHOWCASE PINNED ON ALL DEVICES)
        const track = document.querySelector('.day1-talent__track')
        if (track) {
          const travel = Math.max(0, track.scrollWidth - window.innerWidth)
          const talentScroll = gsap.to(track, {
            x: -travel,
            ease: 'none',
            scrollTrigger: {
              trigger: '.day1-talent',
              start: 'top top',
              end: () => (isMobile ? `+=${Math.max(350, travel * 0.85)}` : `+=${Math.round(window.innerHeight * 4.13)}`),
              scrub: 0.5,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          })

          gsap.utils.toArray('.day1-talent__name').forEach((act) => {
            gsap.fromTo(
              act,
              { opacity: 0.3, scale: 0.92 },
              {
                opacity: 1,
                scale: 1.04,
                color: '#f6d789',
                textShadow: '0 0 24px rgba(229,189,104,.35)',
                ease: 'none',
                scrollTrigger: {
                  trigger: act,
                  containerAnimation: talentScroll,
                  start: 'left 75%',
                  end: 'right 25%',
                  scrub: true
                }
              }
            )
          })
        }

        // 5. "3 MINUTES" SCRUBBED SCALING EFFECT
        gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-minutes',
            start: 'top 85%',
            end: isMobile ? '+=50%' : 'center center',
            scrub: 0.4,
            pin: isMobile,
            anticipatePin: 1
          }
        })
          .fromTo('.day1-minutes__number', { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out' })
          .fromTo('.day1-minutes__copy', { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1 }, '-=.2')
          .to('.day1-minutes__light', { opacity: 1, scale: 1.15 }, 0)

        // 6. CHOOSE YOUR ENTRANCE FORMATS (PINNED SEQUENTIAL HIGHLIGHT ON ALL DEVICES)
        const formatItems = gsap.utils.toArray('.day1-format')
        const formatStory = gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-formats',
            start: 'top top',
            end: isMobile ? '+=60%' : '+=90%',
            scrub: 0.6,
            pin: true,
            anticipatePin: 1
          }
        })
        formatItems.forEach((item, index) => {
          formatStory.to(formatItems, { opacity: 0.25, duration: 0.35 }, index)
            .to(item, { opacity: 1, scale: 1.03, duration: 0.35 }, index)
        })

        // 7. BACKSTAGE DETAILS GRID STAGGER
        gsap.from('.day1-backstage__panel', {
          y: 35,
          opacity: 0,
          stagger: 0.12,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.day1-backstage',
            start: 'top 80%'
          }
        })

        // 8. FINAL CALL TO ACTION SCRUB REVEAL
        gsap.timeline({
          scrollTrigger: {
            trigger: '.day1-final',
            start: 'top 75%',
            end: 'bottom bottom',
            scrub: 0.5
          }
        })
          .from('.day1-final__lights-out', { opacity: 0, y: 25 })
          .from('.day1-final__title span', { opacity: 0, yPercent: 80, stagger: 0.12 })
          .from('.day1-final__cta', { opacity: 0, y: 20 })
          .to('.day1-final__beam', { opacity: 1, scale: 1.15 }, 0)

        ScrollTrigger.refresh()
      }, page.current)
    }, 120)

    return () => {
      clearTimeout(timer)
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <div ref={page} className="day1-page">
      {/* HERO SECTION */}
      <section className="day1-hero relative" style={{ '--stage-image': `url(${stageHero})` }}>
        {/* Pure Large Logo & Name on the Right Side (Zero Box) */}
        <div className="hidden lg:flex absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-2 text-center group">
          <img
            src={belgianWaffleLogo}
            alt="The Belgian Waffle Co. Logo"
            className="h-24 xl:h-28 w-auto object-contain filter drop-shadow-[0_0_35px_rgba(245,158,11,0.8)] hover:scale-110 transition-transform duration-300 cursor-pointer"
          />
          <span className="text-xs sm:text-sm font-['Syne'] font-bold text-amber-200 tracking-wider">
            The Belgian Waffle Co.
          </span>
        </div>

        <div className="day1-hero__beam" />
        <div className="day1-hero__content">
          <div className="mb-4">
            <span className="day1-hero__date px-4 py-2 rounded-full bg-[#1e170d] border border-[#a68437]/50 text-[#e0b968] font-extrabold text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 shadow-lg">
              09 SEPTEMBER 2026 • A1 AUDITORIUM
            </span>
          </div>
          <h1 className="day1-hero__title">
            <span>THE</span>
            <span>STAGE</span>
          </h1>
          <p className="day1-hero__detail">NON-TECH TALENT SHOWCASE</p>

          {/* Mobile Only Centered Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 my-3">
            <img
              src={belgianWaffleLogo}
              alt="The Belgian Waffle Co. Logo"
              className="h-12 sm:h-14 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
            />
          </div>

          {/* Normal Mention in Hero */}
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium max-w-xl mx-auto px-3 mt-2 mb-6 leading-relaxed">
            🧇 Official Food Partner <strong className="text-amber-300 font-bold">The Belgian Waffle Co.</strong> — Enjoy discount on fresh warm waffles and delights exclusively for participants and audience!
          </p>

          <div className="day1-hero__actions">
            <button className="btn-hero-primary-gold" onClick={() => onOpenRegister('day1-performer')}>
              REGISTER AS PERFORMER <span>→</span>
            </button>
            <button className="btn-hero-secondary-gold" onClick={() => onOpenRegister('day1-audience')}>
              GET AUDIENCE PASS <span>🎟️</span>
            </button>
          </div>
          <div className="day1-scroll-cue">
            <i /> SCROLL TO ENTER
          </div>
        </div>
      </section>

      {/* SCENE ONE INTRO */}
      <section className="day1-intro">
        <div className="day1-intro__spot" />
        <div className="day1-section-wrap day1-intro__inner">
          <p className="day1-kicker">SCENE ONE</p>
          <h2 className="day1-display day1-intro__title">
            THE<br />
            <em>STAGE</em>
          </h2>
          <div className="day1-intro__copy">
            <p>Step away from code and into the spotlight.</p>
            <span>One auditorium. One shared hush before the first note, movement, laugh, or line.</span>
          </div>
        </div>
      </section>

      {/* MINUTE TO MINUTE TIMELINE */}
      <section className="day1-timeline">
        <div className="day1-section-wrap day1-timeline__inner">
          <header>
            <p className="day1-kicker">THE DAY</p>
            <h2 className="day1-display">
              MINUTE<br />
              <em>TO MINUTE</em>
            </h2>
            <p className="day1-timeline__note">A journey through the show — not an official schedule.</p>
          </header>
          <div className="day1-timeline__rail">
            <i className="day1-timeline__line-fill" />
            {moments.map((moment, index) => (
              <div className="day1-moment" key={moment}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{moment}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUR TALENT HORIZONTAL TRACK */}
      <section className="day1-talent">
        <div className="day1-talent__heading">
          <p className="day1-kicker">YOUR TALENT.</p>
          <h2 className="day1-display">
            YOUR <em>STAGE.</em>
          </h2>
        </div>
        <div className="day1-talent__track">
          {talentActs.map((act, index) => (
            <div className={`day1-talent__name ${act === 'OTHERS' ? 'day1-talent__name--final' : ''}`} key={act}>
              <span>{index + 1}</span>
              {act}
            </div>
          ))}
        </div>
        <p className="day1-talent__hint">FOLLOW THE GOLD LIGHT</p>
      </section>

      {/* 3 MINUTES SECTION */}
      <section className="day1-minutes">
        <div className="day1-minutes__light" />
        <div className="day1-minutes__inner">
          <p className="day1-kicker day1-minutes__copy">YOU GET</p>
          <div className="day1-minutes__number">3</div>
          <p className="day1-minutes__copy day1-minutes__label">MINUTES</p>
          <p className="day1-minutes__copy day1-minutes__small">TO OWN THE STAGE</p>
        </div>
      </section>

      {/* SOLO / DUO / GROUP FORMATS */}
      <section className="day1-formats">
        <div className="day1-section-wrap">
          <p className="day1-kicker">CHOOSE YOUR ENTRANCE</p>
          <h2 className="day1-display day1-formats__heading">
            SOLO / DUO / <em>GROUP</em>
          </h2>
          <div className="day1-formats__list">
            {formats.map(([name, lights, description]) => (
              <article className="day1-format" key={name}>
                <div className="day1-format__lights">
                  {Array.from({ length: lights }).map((_, i) => (
                    <i key={i} />
                  ))}
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BACKSTAGE DETAILS */}
      <section className="day1-backstage">
        <div className="day1-section-wrap">
          <p className="day1-kicker">BACKSTAGE</p>
          <h2 className="day1-display">
            THE DETAILS<br />
            <em>BEFORE THE CURTAIN</em>
          </h2>
          <p className="day1-backstage__intro">
            Bring your act into focus with the same details requested in performer registration.
          </p>
          <div className="day1-backstage__grid">
            {[
              'PERFORMANCE TITLE',
              'PERFORMANCE DESCRIPTION',
              'OTHER PERFORMER DETAILS',
              'EQUIPMENT / AUDIO REQUIREMENTS'
            ].map((detail, i) => (
              <div className="day1-backstage__panel" key={detail}>
                <span>0{i + 1}</span>
                <h3>{detail}</h3>
                <i />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="day1-final">
        <div className="day1-final__beam" />
        <div className="day1-final__content">
          <p className="day1-kicker day1-final__lights-out">LIGHTS OUT</p>
          <p className="day1-final__ready">READY?</p>
          <h2 className="day1-display day1-final__title">
            <span>THE STAGE</span>
            <span>
              <em>IS YOURS.</em>
            </span>
          </h2>
          <button className="day1-final__cta" onClick={() => onOpenRegister('day1-performer')}>
            REGISTER AS PERFORMER <span>→</span>
          </button>
          <div className="mt-4">
            <span className="px-4 py-2 rounded-full bg-[#1e170d] border border-[#a68437]/50 text-[#e0b968] font-extrabold text-xs sm:text-sm tracking-wider inline-flex items-center gap-2 shadow-lg">
              09 SEPTEMBER 2026 • A1 AUDITORIUM
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
