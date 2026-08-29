import React, { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

export default function GuidelinesPage({ setCurrentPage }) {
  // Reading progress bar state
  const [progressWidth, setProgressWidth] = useState(0)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement
      const maxScroll = h.scrollHeight - h.clientHeight
      if (maxScroll > 0) {
        const percentage = (h.scrollTop / maxScroll) * 100
        setProgressWidth(percentage)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="egt-guidelines-root" data-theme="dark">
      {/* Embedded Scoped Styles (All in One File) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        /* ── Scope container ─────────────────── */
        .egt-guidelines-root {
          --font-display: 'Bricolage Grotesque', 'Space Grotesk', sans-serif;
          --font-serif: 'Instrument Serif', Georgia, serif;
          --font-body: 'Space Grotesk', 'Helvetica Neue', sans-serif;
          --font-mono: 'JetBrains Mono', ui-monospace, monospace;

          /* ── modern clean dark palette: crisp white text + dark / light-dark surfaces ─── */
          --paper: #0c0a0f;
          --paper-hi: #17141d;
          --ink: #ffffff;
          --ink-soft: #a1a1aa;
          --line: rgba(255, 255, 255, .15);
          --line-soft: rgba(255, 255, 255, .08);
          --red: #ff6a3c;
          --purple: #b18cff;
          --gold: #facc15;
          --hard-shadow: rgba(0, 0, 0, .65);
          --row-hover: rgba(255, 255, 255, .04);
          --fact-hover: #221e2b;
          --highlight: rgba(255, 106, 60, .28);
          --stamp-bg: rgba(255, 106, 60, .12);
          --ticket-day1: #ff6a3c;
          --ticket-day2: #b18cff;
          --ticket-text: #0d0a10;
          --ticket-dash: rgba(13, 10, 16, .45);
          --num-fill: rgba(255, 255, 255, .04);
          --body-bg:
            radial-gradient(1100px 560px at 88% -5%, rgba(255, 106, 60, .12), transparent 60%),
            radial-gradient(950px 560px at 8% 105%, rgba(177, 140, 255, .12), transparent 60%),
            radial-gradient(750px 450px at 50% 40%, rgba(250, 204, 21, .05), transparent 65%),
            var(--paper);

          font-family: var(--font-body);
          background: var(--body-bg);
          background-color: var(--paper);
          color: var(--ink);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding-top: 6.5rem;
          padding-bottom: 4rem;
          transition: background-color .35s ease, color .35s ease;
        }

        /* paper grain */
        .egt-guidelines-root::after {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 40;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: .08;
        }

        .egt-guidelines-root * {
          box-sizing: border-box;
        }

        .egt-guidelines-root ::selection {
          background: var(--red);
          color: var(--paper);
        }

        .egt-guidelines-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* reading progress */
        .egt-guidelines-root .progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          z-index: 100;
        }

        .egt-guidelines-root .progress span {
          display: block;
          height: 100%;
          width: 0;
          background: linear-gradient(90deg, var(--red), var(--purple));
          transition: width 0.08s linear;
        }

        /* ── Back to Home button ─────────────── */
        .egt-guidelines-root .back-wrap {
          margin-bottom: 2rem;
        }

        .egt-guidelines-root .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.4rem 0;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .egt-guidelines-root .back-btn:hover {
          color: var(--red);
          transform: translateX(-3px);
        }

        /* ── masthead ────────────────────────── */
        .egt-guidelines-root .masthead {
          display: grid;
          grid-template-columns: 1fr 290px;
          gap: 3rem;
          align-items: center;
          padding: 1.5rem 0 3.75rem;
          border-bottom: 1.5px solid var(--line);
        }

        .egt-guidelines-root .eyebrow {
          display: inline-flex;
          gap: .6rem;
          align-items: center;
          border: 1.5px solid var(--line);
          padding: .45rem 1.05rem;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          background: var(--paper-hi);
          font-family: var(--font-body);
        }

        .egt-guidelines-root .eyebrow i {
          font-style: normal;
          color: var(--red);
        }

        .egt-guidelines-root h1 {
          font-family: 'Fraunces', Georgia, serif;
          font-weight: 900;
          font-size: clamp(3rem, 7.5vw, 5.4rem);
          line-height: 1.02;
          letter-spacing: -.02em;
          margin: 1.6rem 0 1rem;
        }

        .egt-guidelines-root h1 em {
          font-style: italic;
          font-weight: 600;
          color: var(--red);
        }

        .egt-guidelines-root .nowrap-badge {
          display: inline-flex;
          align-items: baseline;
          white-space: nowrap;
        }

        .egt-guidelines-root .v2 {
          display: inline-block;
          background: var(--ink);
          color: var(--paper);
          font-family: 'Space Grotesk', sans-serif;
          font-size: .3em;
          padding: .35em .55em;
          border-radius: 8px;
          transform: rotate(-7deg) translateY(-1.4em);
          font-weight: 700;
          box-shadow: 3px 3px 0 var(--hard-shadow);
          margin-left: 0.35em;
        }

        .egt-guidelines-root .sub {
          font-family: var(--font-serif);
          font-size: clamp(1.2rem, 2.3vw, 1.6rem);
          color: var(--ink-soft);
        }

        .egt-guidelines-root .meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: .85rem;
          margin-top: 1.6rem;
          font-size: .85rem;
          font-weight: 600;
          font-family: var(--font-body);
        }

        .egt-guidelines-root .meta .dot {
          color: var(--red);
        }

        .egt-guidelines-root .notice-line {
          margin-top: 1.4rem;
          font-size: .95rem;
          font-weight: 600;
          display: inline-block;
          background: linear-gradient(transparent 62%, var(--highlight) 0);
          font-family: var(--font-body);
        }

        /* rotating seal */
        .egt-guidelines-root .seal-wrap {
          position: relative;
          width: 270px;
          height: 270px;
          margin-left: auto;
        }

        .egt-guidelines-root .seal-ring {
          width: 100%;
          height: 100%;
          color: rgba(255, 255, 255, 0.35);
          animation: seal-spin 28s linear infinite;
        }

        .egt-guidelines-root .seal-ring text {
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: 2.5px;
          fill: #ffffff;
        }

        .egt-guidelines-root .seal-core {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: .2rem;
        }

        .egt-guidelines-root .seal-core .big {
          font-family: var(--font-display);
          font-size: 3.2rem;
          font-weight: 800;
          line-height: 1;
          color: #ffffff;
        }

        .egt-guidelines-root .seal-core .small {
          font-size: .65rem;
          font-weight: 700;
          letter-spacing: .25em;
          font-family: var(--font-mono);
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.85);
        }

        @keyframes seal-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ── key facts ───────────────────────── */
        .egt-guidelines-root .facts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1.5px solid var(--line);
          background: var(--paper-hi);
          box-shadow: 7px 7px 0 var(--hard-shadow);
          margin: 3.5rem 0 0;
        }

        .egt-guidelines-root .fact {
          padding: 2rem 1.9rem;
          transition: background-color .25s ease;
        }

        .egt-guidelines-root .fact:hover {
          background: var(--fact-hover);
        }

        .egt-guidelines-root .fact + .fact {
          border-left: 1.5px dashed var(--line);
        }

        .egt-guidelines-root .fact-no {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: .78rem;
          display: inline-block;
          border: 1.5px solid currentColor;
          border-radius: 999px;
          padding: .14rem .65rem;
          margin-bottom: 1.1rem;
          letter-spacing: .12em;
        }

        .egt-guidelines-root .fact:nth-child(1) .fact-no { color: var(--red); }
        .egt-guidelines-root .fact:nth-child(2) .fact-no { color: var(--purple); }
        .egt-guidelines-root .fact:nth-child(3) .fact-no { color: var(--gold); }

        .egt-guidelines-root .fact h3 {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: .5rem;
        }

        .egt-guidelines-root .fact p {
          font-size: .92rem;
          color: var(--ink-soft);
          font-family: var(--font-body);
        }

        .egt-guidelines-root .fact p strong {
          color: var(--ink);
        }

        /* ── day sections ────────────────────── */
        .egt-guidelines-root .day {
          padding: 4.75rem 0 1rem;
        }

        .egt-guidelines-root .day-head {
          display: flex;
          align-items: flex-end;
          gap: 2.25rem;
          border-bottom: 1.5px solid var(--line);
          padding-bottom: 2rem;
          margin-bottom: 2.75rem;
          flex-wrap: wrap;
        }

        .egt-guidelines-root .day-num {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(4.3rem, 11vw, 7.6rem);
          line-height: .82;
          color: var(--num-fill);
          -webkit-text-stroke: 2.5px var(--line);
        }

        .egt-guidelines-root .day-1 .day-num {
          -webkit-text-stroke-color: var(--red);
        }

        .egt-guidelines-root .day-2 .day-num {
          -webkit-text-stroke-color: var(--purple);
        }

        .egt-guidelines-root .day-tag {
          display: inline-block;
          font-size: .72rem;
          font-weight: 700;
          letter-spacing: .2em;
          text-transform: uppercase;
          padding: .35rem .95rem;
          border-radius: 999px;
          margin-bottom: .9rem;
          font-family: var(--font-body);
        }

        .egt-guidelines-root .day-1 .day-tag {
          background: color-mix(in srgb, var(--red) 12%, transparent);
          color: var(--red);
          border: 1.5px solid var(--red);
        }

        .egt-guidelines-root .day-2 .day-tag {
          background: color-mix(in srgb, var(--purple) 12%, transparent);
          color: var(--purple);
          border: 1.5px solid var(--purple);
        }

        .egt-guidelines-root .day-head h2 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.9rem, 4.5vw, 3rem);
          line-height: 1.05;
          letter-spacing: -.01em;
        }

        .egt-guidelines-root .day-sub {
          font-family: var(--font-serif);
          margin-top: .45rem;
          font-size: 1.1rem;
        }

        .egt-guidelines-root .rules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.25rem;
        }

        .egt-guidelines-root .rule-col h3 {
          display: flex;
          align-items: center;
          gap: .75rem;
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: .4rem;
          padding-bottom: .85rem;
          border-bottom: 1.5px solid var(--line);
        }

        .egt-guidelines-root .mark {
          width: 28px;
          height: 28px;
          flex: none;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: .75rem;
          font-family: var(--font-mono);
          font-weight: 700;
        }

        .egt-guidelines-root .day-1 .mark {
          background: var(--ticket-day1);
          color: #ffffff;
        }

        .egt-guidelines-root .day-2 .mark {
          background: var(--ticket-day2);
          color: #ffffff;
        }

        .egt-guidelines-root .rule-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .egt-guidelines-root .rule-list li {
          display: flex;
          gap: 1.15rem;
          padding: 1.2rem .5rem 1.2rem .25rem;
          border-bottom: 1.5px dashed var(--line-soft);
          transition: background .2s ease;
        }

        .egt-guidelines-root .rule-list li:last-child {
          border-bottom: none;
        }

        .egt-guidelines-root .rule-list li:hover {
          background: var(--row-hover);
        }

        .egt-guidelines-root .rnum {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.3rem;
          line-height: 1.2;
          min-width: 2.2rem;
          color: var(--ink-soft);
        }

        .egt-guidelines-root .day-1 .rnum { color: var(--red); }
        .egt-guidelines-root .day-2 .rnum { color: var(--purple); }

        .egt-guidelines-root .rule-list li div {
          font-size: .95rem;
          color: var(--ink-soft);
          font-family: var(--font-body);
        }

        .egt-guidelines-root .rule-list li strong {
          display: block;
          font-weight: 700;
          color: var(--ink);
          font-size: 1rem;
          margin-bottom: .15rem;
        }

        .egt-guidelines-root .rule-list li div strong.inline {
          display: inline;
          margin: 0;
        }

        /* ── ticket CTA ──────────────────────── */
        .egt-guidelines-root .cta {
          margin: 3.25rem 0 0;
          text-align: center;
          padding: 2.75rem 2rem;
          border: 1.5px dashed var(--line);
          background: var(--paper-hi);
        }

        .egt-guidelines-root .cta-q {
          font-family: var(--font-serif);
          font-style: italic;
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
          margin-bottom: 1.5rem;
        }

        .egt-guidelines-root .ticket {
          position: relative;
          display: inline-flex;
          align-items: stretch;
          text-decoration: none;
          color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          transform: rotate(-1.5deg);
          transition: transform .25s ease, box-shadow .25s ease, background-color .35s ease;
          box-shadow: 5px 6px 0 var(--hard-shadow);
          border: none;
          cursor: pointer;
          font-family: inherit;
        }

        .egt-guidelines-root .ticket:hover {
          transform: rotate(0deg) translateY(-4px);
          box-shadow: 8px 11px 0 var(--hard-shadow), 0 0 44px rgba(255, 106, 60, .35);
        }

        .egt-guidelines-root .t-day1 { background: var(--ticket-day1); }
        .egt-guidelines-root .t-day2 { background: var(--ticket-day2); }

        .egt-guidelines-root .t-day2:hover {
          box-shadow: 8px 11px 0 var(--hard-shadow), 0 0 44px rgba(177, 140, 255, .35);
        }

        .egt-guidelines-root .tk-main {
          padding: 1rem 1.7rem;
          display: flex;
          flex-direction: column;
          gap: .2rem;
          text-align: left;
        }

        .egt-guidelines-root .tk-eyebrow {
          font-family: var(--font-mono);
          font-size: .58rem;
          font-weight: 500;
          letter-spacing: .24em;
          text-transform: uppercase;
          opacity: .85;
          color: #ffffff;
        }

        .egt-guidelines-root .tk-label {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1.12rem;
          display: flex;
          gap: .55rem;
          align-items: center;
          color: #ffffff;
        }

        .egt-guidelines-root .tk-label .arr {
          transition: transform .2s;
        }

        .egt-guidelines-root .ticket:hover .arr {
          transform: translateX(5px);
        }

        .egt-guidelines-root .tk-stub {
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 2px dashed rgba(255, 255, 255, .45);
          padding: .6rem 1rem;
          font-family: var(--font-mono);
          font-size: .56rem;
          font-weight: 700;
          letter-spacing: .22em;
          text-align: center;
          line-height: 1.6;
          color: #ffffff;
        }

        .egt-guidelines-root .ticket::before,
        .egt-guidelines-root .ticket::after {
          content: "";
          position: absolute;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--paper-hi);
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          transition: background-color .35s ease;
        }

        .egt-guidelines-root .ticket::before { left: -9px; }
        .egt-guidelines-root .ticket::after { right: -9px; }

        .egt-guidelines-root .divider {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          color: var(--ink-soft);
          margin: 4.5rem 0 0;
          font-size: .9rem;
        }

        .egt-guidelines-root .divider::before,
        .egt-guidelines-root .divider::after {
          content: "";
          flex: 1;
          border-top: 1.5px dashed var(--line);
        }

        /* ── conduct notice ──────────────────── */
        .egt-guidelines-root .conduct {
          padding: 4.5rem 0 2rem;
        }

        .egt-guidelines-root .notice-card {
          position: relative;
          border: 1.5px solid var(--line);
          background: var(--paper-hi);
          padding: 3.75rem 3rem 3.25rem;
          box-shadow: 9px 9px 0 var(--hard-shadow);
        }

        .egt-guidelines-root .notice-card::before {
          content: "";
          position: absolute;
          inset: 11px;
          border: 1.5px dashed var(--line-soft);
          pointer-events: none;
        }

        .egt-guidelines-root .stamp {
          position: absolute;
          top: 24px;
          right: 28px;
          transform: rotate(9deg);
          border: 3px double var(--red);
          color: var(--red);
          padding: .55rem 1rem;
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: .24em;
          font-size: .66rem;
          border-radius: 8px;
          background: var(--stamp-bg);
          text-transform: uppercase;
          z-index: 2;
        }

        .egt-guidelines-root .notice-head {
          text-align: center;
          margin-bottom: 2.75rem;
        }

        .egt-guidelines-root .notice-kicker {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: rgba(255, 106, 60, 0.15); /* Soft red background fill */
          color: var(--red);                    /* Red text */
          border: 1px solid var(--red);         /* Red border */
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
        }

        .egt-guidelines-root .notice-card h2 {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          margin-top: .7rem;
          letter-spacing: -.01em;
        }

        .egt-guidelines-root .conduct-items {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.75rem;
        }

        .egt-guidelines-root .c-item {
          display: flex;
          gap: 1.25rem;
        }

        .egt-guidelines-root .c-icon {
          width: 54px;
          height: 54px;
          flex: none;
          border: 1.5px solid var(--line);
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 1.35rem;
          background: var(--paper);
        }

        .egt-guidelines-root .c-item h4 {
          font-family: var(--font-display);
          font-size: 1.12rem;
          font-weight: 700;
          margin-bottom: .4rem;
        }

        .egt-guidelines-root .c-item p {
          color: var(--ink-soft);
          font-size: .95rem;
          font-family: var(--font-body);
        }

        /* ── responsive breakpoints ──────────── */
        @media (max-width: 960px) {
          .egt-guidelines-root .masthead {
            grid-template-columns: 1fr;
            gap: 2.75rem;
            padding: 1.5rem 0 3rem;
          }
          .egt-guidelines-root .seal-wrap {
            margin: 0 auto;
            width: 220px;
            height: 220px;
          }
          .egt-guidelines-root .rules-grid {
            grid-template-columns: 1fr;
            gap: 2.75rem;
          }
        }

        @media (max-width: 820px) {
          .egt-guidelines-root .facts {
            grid-template-columns: 1fr;
          }
          .egt-guidelines-root .fact + .fact {
            border-left: none;
            border-top: 1.5px dashed var(--line);
          }
          .egt-guidelines-root .conduct-items {
            grid-template-columns: 1fr;
          }
          .egt-guidelines-root .day-head {
            gap: 1.25rem;
          }
          .egt-guidelines-root .notice-card {
            padding: 3rem 1.5rem 2.5rem;
          }
          .egt-guidelines-root .stamp {
            top: 14px;
            right: 14px;
          }
        }
      `}</style>

      {/* Reading Progress Indicator */}
      <div className="progress">
        <span style={{ width: `${progressWidth}%` }}></span>
      </div>

      <div className="egt-guidelines-container">

        {/* Back to Home Button */}
        <div className="back-wrap">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Masthead */}
        <section className="masthead">
          <div>
            <span className="eyebrow">
               Official Rulebook &amp; Code of Conduct
            </span>
            <h1>
              Engineer's Got <span className="nowrap-badge"><em>Talent</em> <span className="v2">2.0</span></span>
            </h1>
            <p className="sub">Event Guidelines &amp; Rules</p>
            <div className="meta">
              <span>Department of CSE – Takshashila</span>
              <span>Organized by Alexa Developers Community</span>
            </div>
            <p className="notice-line">
              Please read all rules carefully prior to participation.
            </p>
          </div>
          <div className="seal-wrap">
            <svg className="seal-ring" viewBox="0 0 200 200">
              <defs>
                <path
                  id="circlePath"
                  d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0"
                />
              </defs>
              <circle
                cx="100"
                cy="100"
                r="98"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="3 6"
              />
              <circle
                cx="100"
                cy="100"
                r="55"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <text>
                <textPath href="#circlePath">
                  EGT 2.0  OFFICIAL RULEBOOK , CSE TAKSHASHILA 
                </textPath>
              </text>
            </svg>
            <div className="seal-core">
              <span className="big">2.0</span>
              <span className="small">RULES</span>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="facts">
          <div className="fact">
            <span className="fact-no">01</span>
            <h3>Time Limits</h3>
            <p>
              Day 1 Stage performances are strictly <strong>3 minutes maximum</strong> per act. 30-second warning bell will be sounded.
            </p>
          </div>
          <div className="fact">
            <span className="fact-no">02</span>
            <h3>Entry Format</h3>
            <p>
              Day 1 is <strong>strictly Solo-based acts</strong>. Day 2 Technical Squads permit up to <strong>3 members per squad</strong>.
            </p>
          </div>
          <div className="fact">
            <span className="fact-no">03</span>
            <h3>Judges' Decision</h3>
            <p>
              Evaluations by official faculty judges and technical evaluators are <strong>final and binding</strong>.
            </p>
          </div>
        </section>

        {/* ══════════ DAY 1 ══════════ */}
        <section className="day day-1" id="day1">
          <div className="day-head">
            <span className="day-num">01</span>
            <div>
              <span className="day-tag">Day 1 • Stage Arena</span>
              <h2>Stage Performer Rules</h2>
              <p className="day-sub">(Non-Tech Stage)</p>
            </div>
          </div>

          <div className="rules-grid">
            <div className="rule-col">
              <h3>
                <span className="mark"></span> Performance Requirements
              </h3>
              <ol className="rule-list">
                <li>
                  <span className="rnum">01</span>
                  <div>
                    <strong>Solo Acts Only</strong>
                    Day 1 stage acts are strictly individual solo performances.
                  </div>
                </li>
                <li>
                  <span className="rnum">02</span>
                  <div>
                    <strong>Strict Time Limit</strong>
                    Maximum duration is <strong className="inline">3 minutes</strong>. Exceeding 3:30 will result in point deduction.
                  </div>
                </li>
                <li>
                  <span className="rnum">03</span>
                  <div>
                    <strong>Backing Tracks &amp; Audio</strong>
                    High-quality MP3 audio files must be submitted to organizers on WhatsApp or PenDrive at least 1 hour prior to event start.
                  </div>
                </li>
                <li>
                  <span className="rnum">04</span>
                  <div>
                    <strong>Allowed Categories</strong>
                    Vocals, Dance, Stand-up Comedy, Mono-Acts/Drama, Magic, Beatboxing, Rap, Instrumental, and Creative Talent.
                  </div>
                </li>
              </ol>
            </div>

            <div className="rule-col">
              <h3>
                <span className="mark"></span> Safety &amp; Disqualification Criteria
              </h3>
              <ol className="rule-list">
                <li>
                  <span className="rnum">01</span>
                  <div>
                    <strong>Prohibited Content</strong>
                    Vulgarity, profanity, political/religious sensitivity, or hate speech will lead to immediate disqualification.
                  </div>
                </li>
                <li>
                  <span className="rnum">02</span>
                  <div>
                    <strong>Dangerous Props</strong>
                    Open flame, liquids, glass, sharp objects, or pyrotechnics are strictly banned on stage.
                  </div>
                </li>
                <li>
                  <span className="rnum">03</span>
                  <div>
                    <strong>Reporting Time</strong>
                    Performers must report backstage at least <strong className="inline">30 minutes before</strong> their scheduled slot.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="cta">
            <p className="cta-q">Ready to showcase your talent on stage?</p>
            <button
              type="button"
              onClick={() => setCurrentPage('register-day1')}
              className="ticket t-day1"
            >
              <span className="tk-main">
                <span className="tk-eyebrow">EGT 2.0 · Day 01</span>
                <span className="tk-label">
                  Register for Day 1 <span className="arr">→</span>
                </span>
              </span>
              <span className="tk-stub">
                ADMIT<br />ONE
              </span>
            </button>
          </div>
        </section>

        <div className="divider">✦ &nbsp; ✦ &nbsp; ✦</div>

        {/* ══════════ DAY 2 ══════════ */}
        <section className="day day-2" id="day2">
          <div className="day-head">
            <span className="day-num">02</span>
            <div>
              <span className="day-tag">Day 2 • Wizarding Tech Arena</span>
              <h2>Harry Potter Tech Wizard Rules</h2>
            </div>
          </div>

          <div className="rules-grid">
            <div className="rule-col">
              <h3>
                <span className="mark">R1</span> Round 1: Chamber of Logic (10+1)
              </h3>
              <ol className="rule-list">
                <li>
                  <span className="rnum">01</span>
                  <div>
                    <strong>Squad Size</strong>
                    1 Leader + up to 2 Teammates (Max 3 members per squad).
                  </div>
                </li>
                <li>
                  <span className="rnum">02</span>
                  <div>
                    <strong>10 Core Logic Questions</strong>
                    Test your algorithmic thinking, C++/Python logic, and problem-solving velocity.
                  </div>
                </li>
                <li>
                  <span className="rnum">03</span>
                  <div>
                    <strong>1 Master Horcrux Problem</strong>
                    Solved by squad consensus to qualify for Round 2.
                  </div>
                </li>
                <li>
                  <span className="rnum">04</span>
                  <div>
                    <strong>No AI Tools</strong>
                    ChatGPT, Copilot, or AI generator tools are prohibited during timed logic rounds.
                  </div>
                </li>
              </ol>
            </div>

            <div className="rule-col">
              <h3>
                <span className="mark">R2</span> Round 2: Campus QR Horcrux Hunt
              </h3>
              <ol className="rule-list">
                <li>
                  <span className="rnum">01</span>
                  <div>
                    <strong>QR Clue Chain</strong>
                    Encrypted QR codes hidden across campus locations.
                  </div>
                </li>
                <li>
                  <span className="rnum">02</span>
                  <div>
                    <strong>Speed &amp; Accuracy</strong>
                    First 3 squads to scan, solve, and unlock all Horcruxes win the Grand Trophy.
                  </div>
                </li>
                <li>
                  <span className="rnum">03</span>
                  <div>
                    <strong>Fair Play</strong>
                    Tampering with physical campus QR codes will result in permanent squad ban.
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="cta">
            <p className="cta-q">Ready to enter the wizarding world of tech?</p>
            <button
              type="button"
              onClick={() => setCurrentPage('register-day2')}
              className="ticket t-day2"
            >
              <span className="tk-main">
                <span className="tk-eyebrow">EGT 2.0 · Day 02</span>
                <span className="tk-label">
                  Register for Day 2 <span className="arr">→</span>
                </span>
              </span>
              <span className="tk-stub">
                ADMIT<br />ONE
              </span>
            </button>
          </div>
        </section>

        {/* ══════════ CODE OF CONDUCT ══════════ */}
        <section className="conduct" id="conduct">
          <div className="notice-card">
            <span className="stamp">Official  EGT 2.0</span>
            <div className="notice-head">
              <p className="notice-kicker">Please Take Note</p>
              <h2>General Campus Code of Conduct</h2>
            </div>
            <div className="conduct-items">
              <div className="c-item">
                <div className="c-icon">🪪</div>
                <div>
                  <h4>Valid Student ID Card Mandatory</h4>
                  <p>
                    All participants must present a valid Chandigarh University Student ID Card or Roll No / UID proof at the entrance.
                  </p>
                </div>
              </div>
              <div className="c-item">
                <div className="c-icon">🏛️</div>
                <div>
                  <h4>Department Protocol</h4>
                  <p>
                    Organized under Department of CSE – Takshashila. All university discipline and anti-ragging policies apply strictly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  )
}
