import React, { useEffect } from 'react'
import {
  FileText,
  ShieldAlert,
  Clock,
  Mic,
  Code,
  Award,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Terminal,
  Zap,
  Flame
} from 'lucide-react'

export default function GuidelinesPage({ setCurrentPage }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto font-sans">
      
      {/* Back Button */}
      <div className="mb-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="text-xs font-['Space_Grotesk'] text-gray-400 hover:text-white flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Official Rulebook &amp; Code of Conduct</span>
        </div>

        <h1 className="font-['Syne'] text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Engineer's Got Talent 2.0 <br />
          <span className="bg-gradient-to-r from-[#f7d978] via-amber-300 to-rose-400 bg-clip-text text-transparent">
            Event Guidelines &amp; Rules
          </span>
        </h1>

        <p className="font-sans text-sm sm:text-base text-gray-300 font-light leading-relaxed">
          Department of CSE – Takshashila &bull; Organized by Alexa Developers Community &amp; GFG Student Chapter. Please read all rules carefully prior to participation.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-['Syne'] text-lg font-bold text-white">Time Limits</h3>
          <p className="font-sans text-xs text-gray-300 leading-relaxed">
            Day 1 Stage performances are strictly <strong>3 minutes maximum</strong> per act. 30-second warning bell will be sounded.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-cyan-400/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-['Syne'] text-lg font-bold text-white">Entry Format</h3>
          <p className="font-sans text-xs text-gray-300 leading-relaxed">
            Day 1 is <strong>strictly Solo-based acts</strong>. Day 2 Technical Squads permit up to <strong>3 members per squad</strong>.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-['Syne'] text-lg font-bold text-white">Judges' Decision</h3>
          <p className="font-sans text-xs text-gray-300 leading-relaxed">
            Evaluations by official faculty judges and technical evaluators are <strong>final and binding</strong>.
          </p>
        </div>
      </div>

      {/* DAY 1 GUIDELINES */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-['Space_Grotesk'] text-rose-400 font-bold uppercase tracking-wider">
              Day 1 &bull; Stage Arena
            </div>
            <h2 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">
              Stage Performer Rules (Non-Tech Stage)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-300">
          <div className="space-y-4">
            <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <CheckCircle2 className="w-5 h-5 text-rose-400" />
              <span>Performance Requirements</span>
            </h3>
            <ul className="space-y-3 list-disc list-inside text-xs leading-relaxed text-gray-300">
              <li><strong>Solo Acts Only</strong>: Day 1 stage acts are strictly individual solo performances.</li>
              <li><strong>Strict Time Limit</strong>: Maximum duration is <strong>3 minutes</strong>. Exceeding 3:30 will result in point deduction.</li>
              <li><strong>Backing Tracks &amp; Audio</strong>: High-quality MP3 audio files must be submitted to organizers on WhatsApp or PenDrive at least 1 hour prior to event start.</li>
              <li><strong>Allowed Categories</strong>: Vocals, Dance, Stand-up Comedy, Mono-Acts/Drama, Magic, Beatboxing, Rap, Instrumental, and Creative Talent.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Safety &amp; Disqualification Criteria</span>
            </h3>
            <ul className="space-y-3 list-disc list-inside text-xs leading-relaxed text-gray-300">
              <li><strong>Prohibited Content</strong>: Vulgarity, profanity, political/religious sensitivity, or hate speech will lead to immediate disqualification.</li>
              <li><strong>Dangerous Props</strong>: Open flame, liquids, glass, sharp objects, or pyrotechnics are strictly banned on stage.</li>
              <li><strong>Reporting Time</strong>: Performers must report backstage at least <strong>30 minutes before</strong> their scheduled slot.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">Ready to showcase your talent on stage?</p>
          <button
            onClick={() => setCurrentPage('register-day1')}
            className="btn-primary-gold px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <span>Register for Day 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* DAY 2 GUIDELINES */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-cyan-400/30 mb-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-['Space_Grotesk'] text-cyan-400 font-bold uppercase tracking-wider">
              Day 2 &bull; Wizarding Tech Arena
            </div>
            <h2 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">
              Harry Potter Tech Wizard Rules
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-gray-300">
          <div className="space-y-4">
            <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Round 1: Chamber of Logic (10+1)</span>
            </h3>
            <ul className="space-y-3 list-disc list-inside text-xs leading-relaxed text-gray-300">
              <li><strong>Squad Size</strong>: 1 Leader + up to 2 Teammates (Max 3 members per squad).</li>
              <li><strong>10 Core Logic Questions</strong>: Test your algorithmic thinking, C++/Python logic, and problem-solving velocity.</li>
              <li><strong>1 Master Horcrux Problem</strong>: Solved by squad consensus to qualify for Round 2.</li>
              <li><strong>No AI Tools</strong>: ChatGPT, Copilot, or AI generator tools are prohibited during timed logic rounds.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Round 2: Campus QR Horcrux Hunt</span>
            </h3>
            <ul className="space-y-3 list-disc list-inside text-xs leading-relaxed text-gray-300">
              <li><strong>QR Clue Chain</strong>: Encrypted QR codes hidden across campus locations.</li>
              <li><strong>Speed &amp; Accuracy</strong>: First 3 squads to scan, solve, and unlock all Horcruxes win the Grand Trophy.</li>
              <li><strong>Fair Play</strong>: Tampering with physical campus QR codes will result in permanent squad ban.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">Ready to enter the wizarding world of tech?</p>
          <button
            onClick={() => setCurrentPage('register-day2')}
            className="btn-primary-cyan px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
          >
            <span>Register for Day 2</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* CODE OF CONDUCT & FAQ */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-6">
        <h2 className="font-['Syne'] text-2xl font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[#f7d978]" />
          <span>General Campus Code of Conduct</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-300">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white block font-['Space_Grotesk'] text-sm">Valid Student ID Card Mandatory</strong>
            <p className="text-gray-400 leading-relaxed">
              All participants must present a valid Chandigarh University Student ID Card or Roll No / UID proof at the entrance.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <strong className="text-white block font-['Space_Grotesk'] text-sm">Department Protocol</strong>
            <p className="text-gray-400 leading-relaxed">
              Organized under Department of CSE – Takshashila. All university discipline and anti-ragging policies apply strictly.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
