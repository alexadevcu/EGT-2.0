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
  Zap,
  Ban
} from 'lucide-react'
import { saveDay2Registration, isSupabaseConfigured, getRegistrationSettings } from '../supabaseClient'

export default function Day2RegistrationPage({ setCurrentPage }) {
  const [submittedPass, setSubmittedPass] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isClosed, setIsClosed] = useState(getRegistrationSettings().day2Closed)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const checkSettings = () => {
      setIsClosed(getRegistrationSettings().day2Closed)
    }
    checkSettings()
    window.addEventListener('egt_settings_updated', checkSettings)
    return () => window.removeEventListener('egt_settings_updated', checkSettings)
  }, [])

  const [formData, setFormData] = useState({
    fullName: '',
    uid: '',
    email: '',
    phone: '',
    department: '',
    academicYear: '',
    section: '',
    group: '',
    block: '',
    squadName: '',
    teammate1Name: '',
    teammate1Uid: '',
    teammate1Section: '',
    teammate1Group: '',
    teammate1Block: '',
    teammate2Name: '',
    teammate2Uid: '',
    teammate2Section: '',
    teammate2Group: '',
    teammate2Block: '',
    teammate3Name: '',
    teammate3Uid: '',
    teammate3Section: '',
    teammate3Group: '',
    teammate3Block: ''
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
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } else {
      setErrorMessage(result?.error || 'Registration failed. Please check your details.')
      window.scrollTo({ top: 150, behavior: 'smooth' })
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
          10 September 2026 • C1 Seminar Hall • Tech Arena
        </span>
        
        <h1 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
          Day 2 Tech Wizard Registration
        </h1>

        <p className="font-sans text-sm sm:text-base text-gray-300 font-light">
          Harry Potter — The Wizarding World of Technology &bull; Organized by Alexa Developers Community
        </p>
      </div>

      {/* REGISTRATION FORM CONTAINER */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-cyan-400/30 shadow-2xl">
        
        {isClosed ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mx-auto text-cyan-400">
              <Ban className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-['Syne'] text-2xl font-bold text-white">
                Day 2 Registrations Full / Closed
              </h2>
              <p className="font-sans text-sm text-gray-300 max-w-md mx-auto">
                Registrations for Day 2 (Technical Squads) are currently closed as capacity has been reached. Thank you for your overwhelming response!
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('day2')}
              className="btn-primary-cyan px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Return to Day 2 Arena
            </button>
          </div>
        ) : !submittedPass ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-['Space_Grotesk'] text-xl font-bold text-white flex items-center gap-2">
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
                  maxLength={100}
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
                  maxLength={30}
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
                  maxLength={150}
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
                  maxLength={15}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Department...</option>
                  <option value="AIT CSE">AIT CSE</option>
                  <option value="CSE">CSE / IT</option>
                  <option value="ECE">ECE / EE</option>
                  <option value="ME">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                  <option value="OTHER">Other Department</option>
                </select>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Academic Year *
                </label>
                <select
                  name="academicYear"
                  required
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Academic Year...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Leader Section *
                </label>
                <input
                  type="text"
                  name="section"
                  required
                  maxLength={20}
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. 801-A or Sec-A"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Leader Group *
                </label>
                <select
                  name="group"
                  required
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">Select Group...</option>
                  <option value="Group A">Group A</option>
                  <option value="Group B">Group B</option>
                </select>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Leader Block *
                </label>
                <input
                  type="text"
                  name="block"
                  required
                  maxLength={20}
                  value={formData.block}
                  onChange={handleChange}
                  placeholder="e.g. B1 Block"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Day 2 Tech Squad Fields */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Squad / Team Name *
                </label>
                <input
                  type="text"
                  name="squadName"
                  required
                  maxLength={100}
                  value={formData.squadName}
                  onChange={handleChange}
                  placeholder="e.g. Cyber Horcrux Hunters"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Minimum Requirement Note Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-['Space_Grotesk'] flex items-center justify-between">
                <span className="font-bold">Squad Minimum Requirement:</span>
                <span className="text-gray-300">1 Leader + 2 Teammates (Total 3 Members Min)</span>
              </div>

              {/* Teammate 1 (Minimum Requirement) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-['Space_Grotesk'] font-bold text-gray-300 uppercase tracking-wider">
                  Teammate 1 Details * (Minimum Requirement)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 1 Full Name *
                    </label>
                    <input
                      type="text"
                      name="teammate1Name"
                      required
                      maxLength={100}
                      value={formData.teammate1Name}
                      onChange={handleChange}
                      placeholder="e.g. Neha Sharma"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 1 Student UID *
                    </label>
                    <input
                      type="text"
                      name="teammate1Uid"
                      required
                      maxLength={30}
                      value={formData.teammate1Uid}
                      onChange={handleChange}
                      placeholder="e.g. 22BCS1098"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 1 Section *
                    </label>
                    <input
                      type="text"
                      name="teammate1Section"
                      required
                      maxLength={20}
                      value={formData.teammate1Section}
                      onChange={handleChange}
                      placeholder="e.g. 801-A"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 1 Group *
                    </label>
                    <select
                      name="teammate1Group"
                      required
                      value={formData.teammate1Group}
                      onChange={handleChange}
                      className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Group...</option>
                      <option value="Group A">Group A</option>
                      <option value="Group B">Group B</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 1 Block *
                    </label>
                    <input
                      type="text"
                      name="teammate1Block"
                      required
                      maxLength={20}
                      value={formData.teammate1Block}
                      onChange={handleChange}
                      placeholder="e.g. B1 Block"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Teammate 2 (Minimum Requirement) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-['Space_Grotesk'] font-bold text-gray-300 uppercase tracking-wider">
                  Teammate 2 Details * (Minimum Requirement)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 2 Full Name *
                    </label>
                    <input
                      type="text"
                      name="teammate2Name"
                      required
                      maxLength={100}
                      value={formData.teammate2Name}
                      onChange={handleChange}
                      placeholder="e.g. Simran Kaur"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 2 Student UID *
                    </label>
                    <input
                      type="text"
                      name="teammate2Uid"
                      required
                      maxLength={30}
                      value={formData.teammate2Uid}
                      onChange={handleChange}
                      placeholder="e.g. 22BCS1102"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 2 Section *
                    </label>
                    <input
                      type="text"
                      name="teammate2Section"
                      required
                      maxLength={20}
                      value={formData.teammate2Section}
                      onChange={handleChange}
                      placeholder="e.g. 801-B"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 2 Group *
                    </label>
                    <select
                      name="teammate2Group"
                      required
                      value={formData.teammate2Group}
                      onChange={handleChange}
                      className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Group...</option>
                      <option value="Group A">Group A</option>
                      <option value="Group B">Group B</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 2 Block *
                    </label>
                    <input
                      type="text"
                      name="teammate2Block"
                      required
                      maxLength={20}
                      value={formData.teammate2Block}
                      onChange={handleChange}
                      placeholder="e.g. B2 Block"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Teammate 3 (Optional) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="text-xs font-['Space_Grotesk'] font-bold text-gray-400 uppercase tracking-wider">
                  Teammate 3 Details (Optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 3 Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="teammate3Name"
                      value={formData.teammate3Name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 3 Student UID (Optional)
                    </label>
                    <input
                      type="text"
                      name="teammate3Uid"
                      value={formData.teammate3Uid}
                      onChange={handleChange}
                      placeholder="e.g. 22BCS1145"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 3 Section (Optional)
                    </label>
                    <input
                      type="text"
                      name="teammate3Section"
                      value={formData.teammate3Section}
                      onChange={handleChange}
                      placeholder="e.g. 801-A"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 3 Group (Optional)
                    </label>
                    <select
                      name="teammate3Group"
                      value={formData.teammate3Group}
                      onChange={handleChange}
                      className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="">Select Group...</option>
                      <option value="Group A">Group A</option>
                      <option value="Group B">Group B</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Teammate 3 Block (Optional)
                    </label>
                    <input
                      type="text"
                      name="teammate3Block"
                      value={formData.teammate3Block}
                      onChange={handleChange}
                      placeholder="e.g. B1 Block"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines Agreement Checkbox */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-sans text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  I have read, understood, and agree to abide by all the official{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage('guidelines')}
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Event Guidelines &amp; Code of Conduct
                  </button>
                  . *
                </span>
              </label>

              {/* Mandatory WhatsApp Group Confirmation */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-sans text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  I confirm that I have joined (or will join) the official{' '}
                  <a
                    href="https://chat.whatsapp.com/GlHcZHgODCF3ZqK2vsGZzr?s=cl&p=a&ilr=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>Participant WhatsApp Group</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  {' '}for mandatory slot timings &amp; venue updates. *
                </span>
              </label>
            </div>

            {/* Bottom Error Display if any */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-['Space_Grotesk'] space-y-1 animate-in fade-in duration-300">
                <div className="font-bold text-rose-400 text-sm flex items-center gap-1.5">
                  <span>Registration Error</span>
                </div>
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 rounded-full font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-[#22D3EE] to-[#06B6D4] text-black border border-cyan-200/50 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
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

              {/* Day 2 Squad Teammates Roster */}
              <div className="pt-2.5 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Squad Teammates ({(formData.teammate3Name || submittedPass.teammate_3_name || submittedPass.teammate_3) ? '4' : '3'} Members Total)</span>
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-white font-medium">1. {formData.teammate1Name || submittedPass.teammate_1_name || (submittedPass.teammate_1 ? submittedPass.teammate_1.split('(')[0].trim() : 'Teammate 1')}</span>
                    <span className="font-mono text-xs text-cyan-300">
                      {formData.teammate1Uid || submittedPass.teammate_1_uid || ''}
                      {(formData.teammate1Section || submittedPass.teammate_1_section) ? ` [${formData.teammate1Section || submittedPass.teammate_1_section}]` : ''}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-white font-medium">2. {formData.teammate2Name || submittedPass.teammate_2_name || (submittedPass.teammate_2 ? submittedPass.teammate_2.split('(')[0].trim() : 'Teammate 2')}</span>
                    <span className="font-mono text-xs text-cyan-300">
                      {formData.teammate2Uid || submittedPass.teammate_2_uid || ''}
                      {(formData.teammate2Section || submittedPass.teammate_2_section) ? ` [${formData.teammate2Section || submittedPass.teammate_2_section}]` : ''}
                    </span>
                  </div>

                  {(formData.teammate3Name || submittedPass.teammate_3_name || submittedPass.teammate_3) && (
                    <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <span className="text-white font-medium">3. {formData.teammate3Name || submittedPass.teammate_3_name || (submittedPass.teammate_3 ? submittedPass.teammate_3.split('(')[0].trim() : 'Teammate 3')}</span>
                      <span className="font-mono text-xs text-cyan-300">
                        {formData.teammate3Uid || submittedPass.teammate_3_uid || ''}
                        {(formData.teammate3Section || submittedPass.teammate_3_section) ? ` [${formData.teammate3Section || submittedPass.teammate_3_section}]` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mandatory WhatsApp Group Callout Banner */}
            <div className="p-5 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 text-center space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <p className="font-['Space_Grotesk'] text-sm font-extrabold text-emerald-300">
                ⚠️ ACTION REQUIRED: Join Official WhatsApp Community
              </p>
              <p className="text-xs text-gray-300 font-sans">
                Joining the WhatsApp Group is mandatory to receive your squad slot, venue updates &amp; live announcements!
              </p>
              <a
                href="https://chat.whatsapp.com/GlHcZHgODCF3ZqK2vsGZzr?s=cl&p=a&ilr=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-['Space_Grotesk'] font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
              >
                <span>Join Official WhatsApp Group Now ↗</span>
              </a>
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
