import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  Code,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Zap
} from 'lucide-react'
import { saveDay2Registration, isSupabaseConfigured } from '../supabaseClient'

export default function Day2RegistrationPage({ setCurrentPage }) {
  const [submittedPass, setSubmittedPass] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const [formData, setFormData] = useState({
    fullName: '',
    uid: '',
    email: '',
    phone: '',
    department: 'CSE',
    academicYear: '3rd Year',
    squadName: '',
    teammate1: '',
    teammate2: '',
    githubLink: '',
    techStack: 'C++'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const result = await saveDay2Registration(formData)
    setIsSubmitting(false)

    if (result && result.success) {
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.5 }
        })
      } catch (err) {
        console.log('Confetti active')
      }

      setSubmittedPass(result.data)
    } else {
      setErrorMessage(result?.error || 'Registration failed. Please check your details.')
    }
  }

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto">
      
      {/* Top Return Button */}
      <button
        onClick={() => setCurrentPage('day2')}
        className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-xs font-['Space_Grotesk'] text-gray-300 hover:text-cyan-400 transition-all mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Day 2 Tech Arena Page</span>
      </button>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="px-4 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 font-['Space_Grotesk'] text-xs font-bold border border-cyan-400/40 uppercase tracking-widest inline-block">
          10 September 2026 • Wizarding Tech Arena
        </span>
        
        <h1 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
          Day 2 Tech Wizard Registration
        </h1>

        <p className="font-sans text-sm sm:text-base text-gray-300 font-light">
          Harry Potter — The Wizarding World of Technology &bull; Organized by Alexa Developers Community &amp; GFG Student Chapter
        </p>
      </div>

      {/* REGISTRATION FORM CONTAINER */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyan-400/30 shadow-2xl">
        
        {!submittedPass ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span>Tech Wizard Squad Form</span>
                </h2>
                <p className="font-sans text-xs text-gray-400 mt-1">
                  Chamber of Logic 10+1 &amp; Campus QR Horcrux Hunt
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-['Space_Grotesk'] font-bold">
                Wizarding Tech
              </span>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-['Space_Grotesk'] space-y-1 animate-in fade-in duration-300">
                <div className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                  <span>Registration Warning</span>
                </div>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Squad Leader Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Squad Leader Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Leader Student UID / Roll No *
                </label>
                <input
                  type="text"
                  name="uid"
                  required
                  value={formData.uid}
                  onChange={handleChange}
                  placeholder="e.g. 22BCS10192"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@cuchd.in"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="CSE">CSE / IT</option>
                  <option value="ECE">ECE / EE</option>
                  <option value="ME">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                  <option value="OTHER">Other Department</option>
                </select>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Academic Year
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            {/* Day 2 Tech Squad Fields */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                    Squad / Team Name *
                  </label>
                  <input
                    type="text"
                    name="squadName"
                    required
                    value={formData.squadName}
                    onChange={handleChange}
                    placeholder="e.g. Cyber Horcrux Hunters"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                    Primary Tech Stack / Specialization
                  </label>
                  <select
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="C++">C++ / Data Structures</option>
                    <option value="Python">Python / Algorithms</option>
                    <option value="Java">Java / DSA</option>
                    <option value="Web Dev">Full Stack Web</option>
                    <option value="AI/ML">AI &amp; Machine Learning</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                    Teammate 1 (Name &amp; UID) *
                  </label>
                  <input
                    type="text"
                    name="teammate1"
                    required
                    value={formData.teammate1}
                    onChange={handleChange}
                    placeholder="e.g. Neha V. (22BCS1098)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                    Teammate 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="teammate2"
                    value={formData.teammate2}
                    onChange={handleChange}
                    placeholder="e.g. Simran (22BCS1102)"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-full font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-black border border-cyan-200/50 hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <span>Submitting Registration...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm &amp; Register Tech Squad</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS PASS CARD */
          <div className="text-center py-8 px-4 space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-cyan-400 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest block">
                Squad Registration Confirmed!
              </span>
              <h2 className="font-['Syne'] text-3xl font-extrabold text-white mt-1">
                Day 2 Tech Wizard Pass Issued
              </h2>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-cyan-400/40 text-left space-y-3 font-['Space_Grotesk']">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-gray-400">Squad Pass ID:</span>
                <span className="text-sm font-bold text-cyan-400">{submittedPass.reg_id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Squad Name:</span>
                <span className="font-bold text-white uppercase">{submittedPass.squad_name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Squad Leader:</span>
                <span className="font-bold text-gray-200">{submittedPass.leader_name} ({submittedPass.uid})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Tech Stack:</span>
                <span className="font-bold text-yellow-400 uppercase">
                  {submittedPass.tech_stack}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setSubmittedPass(null)}
                className="btn-secondary-glass text-xs px-6 py-3"
              >
                Register Another Squad
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="btn-primary-gold text-xs px-8 py-3"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
