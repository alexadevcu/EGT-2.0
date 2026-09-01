import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import {
  Mic,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Ban,
  Plus,
  Trash2,
  Users
} from 'lucide-react'
import { saveDay1Registration, isSupabaseConfigured, getRegistrationSettings } from '../supabaseClient'

export default function Day1RegistrationPage({ setCurrentPage }) {
  const [submittedPass, setSubmittedPass] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isClosed, setIsClosed] = useState(getRegistrationSettings().day1Closed)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const checkSettings = () => {
      setIsClosed(getRegistrationSettings().day1Closed)
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
    category: '',
    otherCategory: '',
    requiresAudioTrack: '',
    audioTrackUrl: '',
    entryType: 'Solo',
    teamName: '',
    teamMembers: '',
    performanceDesc: '',
    previousPerformanceLink: '',
    instagram: ''
  })

  const [teamMembersList, setTeamMembersList] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTeamMember = () => {
    if (teamMembersList.length >= 9) return // Leader + 9 Members = 10 Max
    setTeamMembersList(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        fullName: '',
        uid: '',
        section: '',
        group: '',
        block: ''
      }
    ])
  }

  const handleRemoveTeamMember = (id) => {
    setTeamMembersList(prev => prev.filter(m => m.id !== id))
  }

  const handleTeamMemberChange = (id, field, value) => {
    setTeamMembersList(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const finalCategory = formData.category === 'Other Talent' && formData.otherCategory
      ? `Other (${formData.otherCategory.trim()})`
      : formData.category

    if (formData.entryType === 'Team') {
      if (!formData.teamName.trim()) {
        setIsSubmitting(false)
        setErrorMessage('Please enter your Team / Group Name.')
        return
      }
      for (let i = 0; i < teamMembersList.length; i++) {
        const m = teamMembersList[i]
        if (!m.fullName.trim() || !m.uid.trim() || !m.section.trim() || !m.group || !m.block.trim()) {
          setIsSubmitting(false)
          setErrorMessage(`Please complete all fields (Name, UID, Section, Group, Block) for Team Member ${i + 1}.`)
          return
        }
      }
    }

    const payload = {
      ...formData,
      category: finalCategory,
      teamMembersList: formData.entryType === 'Team' ? teamMembersList : []
    }

    const result = await saveDay1Registration(payload)
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
        onClick={() => setCurrentPage('day1')}
        className="inline-flex items-center gap-2 glass-pill px-4 py-2 rounded-full text-xs font-['Space_Grotesk'] text-gray-300 hover:text-rose-400 transition-all mb-8 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Day 1 Stage Page</span>
      </button>

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="px-4 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-['Space_Grotesk'] text-xs font-bold border border-rose-500/40 uppercase tracking-widest inline-block">
          9 September 2026 • A1 Auditorium
        </span>
        
        <h1 className="font-['Syne'] text-3xl sm:text-5xl font-extrabold text-white">
          Day 1 Performer Registration
        </h1>

        <p className="font-sans text-sm sm:text-base text-gray-300 font-light">
          Show the talent beyond the engineer &bull; Organized by Alexa Developers Community
        </p>
      </div>

      {/* REGISTRATION FORM CONTAINER */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-rose-500/30 shadow-2xl">
        
        {isClosed ? (
          <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
              <Ban className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-['Syne'] text-2xl font-bold text-white">
                Day 1 Registrations Full / Closed
              </h2>
              <p className="font-sans text-sm text-gray-300 max-w-md mx-auto">
                Registrations for Day 1 (Stage Performers) are currently closed as capacity has been reached. Thank you for your overwhelming response!
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('day1')}
              className="btn-primary-gold px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Return to Day 1 Arena
            </button>
          </div>
        ) : !submittedPass ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex justify-between items-center">
              <div>
                <h2 className="font-['Syne'] text-xl font-bold text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-rose-400" />
                  <span>Stage Performer Form</span>
                </h2>
                <p className="font-sans text-xs text-gray-400 mt-1">
                  Strictly 3 minutes maximum per act
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-['Space_Grotesk'] font-bold">
                Non-Tech Stage
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

            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  maxLength={100}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Student UID / Roll No *
                </label>
                <input
                  type="text"
                  name="uid"
                  required
                  maxLength={30}
                  value={formData.uid}
                  onChange={handleChange}
                  placeholder="e.g. 22BCS10192"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-colors"
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
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-colors"
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
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition-colors"
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
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
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
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
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
                  Section *
                </label>
                <input
                  type="text"
                  name="section"
                  required
                  maxLength={20}
                  value={formData.section}
                  onChange={handleChange}
                  placeholder="e.g. 801-A or Sec-A"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Group *
                </label>
                <select
                  name="group"
                  required
                  value={formData.group}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="">Select Group...</option>
                  <option value="Group A">Group A</option>
                  <option value="Group B">Group B</option>
                </select>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Block *
                </label>
                <input
                  type="text"
                  name="block"
                  required
                  maxLength={20}
                  value={formData.block}
                  onChange={handleChange}
                  placeholder="e.g. B1 Block"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Day 1 Performance Format & Category Fields */}
            <div className="space-y-5 pt-4 border-t border-white/10">
              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Performance Format *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.entryType === 'Solo'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="entryType"
                      value="Solo"
                      checked={formData.entryType === 'Solo'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>Solo Act</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.entryType === 'Team'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="entryType"
                      value="Team"
                      checked={formData.entryType === 'Team'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>Group / Team Act</span>
                  </label>
                </div>
              </div>

              {/* Group / Team Fields when Team is selected */}
              {formData.entryType === 'Team' && (
                <div className="space-y-4 p-4 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in duration-300">
                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                      Team / Group Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      required={formData.entryType === 'Team'}
                      value={formData.teamName}
                      onChange={handleChange}
                      placeholder="e.g. Pulse Dance Crew or Acoustic Harmony"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  {/* Added Team Member Cards */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-['Space_Grotesk'] font-bold text-gray-300">
                      <span>Team Members ({teamMembersList.length + 1} Total Including Leader)</span>
                      <span className="text-gray-400 text-[11px]">Max 10 Members</span>
                    </div>

                    {teamMembersList.map((member, idx) => (
                      <div key={member.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-['Space_Grotesk'] font-bold text-rose-300 uppercase tracking-wider">
                            Team Member {idx + 1} Details *
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTeamMember(member.id)}
                            className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-['Space_Grotesk'] text-[11px] font-semibold text-gray-300 mb-1">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={member.fullName}
                              onChange={(e) => handleTeamMemberChange(member.id, 'fullName', e.target.value)}
                              placeholder="Member Name"
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                            />
                          </div>

                          <div>
                            <label className="block font-['Space_Grotesk'] text-[11px] font-semibold text-gray-300 mb-1">
                              Student UID *
                            </label>
                            <input
                              type="text"
                              required
                              value={member.uid}
                              onChange={(e) => handleTeamMemberChange(member.id, 'uid', e.target.value)}
                              placeholder="e.g. 22BCS1089"
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                            />
                          </div>

                          <div>
                            <label className="block font-['Space_Grotesk'] text-[11px] font-semibold text-gray-300 mb-1">
                              Section *
                            </label>
                            <input
                              type="text"
                              required
                              value={member.section}
                              onChange={(e) => handleTeamMemberChange(member.id, 'section', e.target.value)}
                              placeholder="e.g. 801-A"
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                            />
                          </div>

                          <div>
                            <label className="block font-['Space_Grotesk'] text-[11px] font-semibold text-gray-300 mb-1">
                              Group *
                            </label>
                            <select
                              required
                              value={member.group}
                              onChange={(e) => handleTeamMemberChange(member.id, 'group', e.target.value)}
                              className="w-full bg-[#12121c] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
                            >
                              <option value="">Select Group...</option>
                              <option value="Group A">Group A</option>
                              <option value="Group B">Group B</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-['Space_Grotesk'] text-[11px] font-semibold text-gray-300 mb-1">
                              Block *
                            </label>
                            <input
                              type="text"
                              required
                              value={member.block}
                              onChange={(e) => handleTeamMemberChange(member.id, 'block', e.target.value)}
                              placeholder="e.g. B1 Block"
                              className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    {teamMembersList.length < 9 && (
                      <button
                        type="button"
                        onClick={handleAddTeamMember}
                        className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-dashed border-rose-400/50 text-rose-300 text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add Team Member</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Performance Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#12121c] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="">Select Performance Category...</option>
                  <option value="Vocals & Jamming">Vocals &amp; Acoustic Jamming</option>
                  <option value="Dance & Choreography">Dance &amp; Choreography</option>
                  <option value="Stand-up Comedy">Stand-up Comedy</option>
                  <option value="Mono-Acts & Drama">Mono-Acts &amp; Drama Skits</option>
                  <option value="Magic & Illusions">Magic &amp; Illusions</option>
                  <option value="Beatboxing & Rap">Beatboxing &amp; Rap</option>
                  <option value="Instrumental">Instrumental Performance</option>
                  <option value="Other Talent">Other Creative Talent</option>
                </select>

                {formData.category === 'Other Talent' && (
                  <div className="mt-3 animate-in fade-in duration-300">
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-rose-300 mb-1.5">
                      Specify Your Creative Talent / Act *
                    </label>
                    <input
                      type="text"
                      name="otherCategory"
                      required
                      value={formData.otherCategory}
                      onChange={handleChange}
                      placeholder="e.g. Mime, Shadow Art, Fire Juggling, Poetry Recital"
                      className="w-full bg-rose-500/10 border border-rose-400/40 rounded-xl px-4 py-3 text-sm text-white placeholder-rose-200/50 focus:outline-none focus:border-rose-400"
                    />
                  </div>
                )}
              </div>

              {/* Performance Note Banner */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-['Space_Grotesk'] flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300 block text-sm mb-0.5">
                    Stage Performance Event Note
                  </span>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Day 1 Stage Performances support both <strong>Solo &amp; Group/Team acts</strong> (up to 10 members max). Each performance has a strict time limit of <strong>3 minutes maximum</strong>.
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Performance Details (Max 3 Minutes Duration)
                </label>
                <textarea
                  name="performanceDesc"
                  rows="3"
                  maxLength={500}
                  value={formData.performanceDesc}
                  onChange={handleChange}
                  placeholder="Describe your performance, song titles, audio track requirements, or special stage props needed."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Audio/Music Track Requirement */}
              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Does your performance require an audio/music track? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.requiresAudioTrack === 'Yes'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="requiresAudioTrack"
                      value="Yes"
                      required
                      checked={formData.requiresAudioTrack === 'Yes'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>Yes</span>
                  </label>

                  <label
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.requiresAudioTrack === 'No'
                        ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                        : 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <input
                      type="radio"
                      name="requiresAudioTrack"
                      value="No"
                      required
                      checked={formData.requiresAudioTrack === 'No'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span>No</span>
                  </label>
                </div>

                {formData.requiresAudioTrack === 'Yes' && (
                  <div className="mt-3 animate-in fade-in duration-300 space-y-2">
                    <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300">
                      Upload Performance Track / Audio Drive Link *
                    </label>
                    <input
                      type="url"
                      name="audioTrackUrl"
                      required
                      maxLength={500}
                      value={formData.audioTrackUrl}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/... or MP3 audio link"
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                    />
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-['Space_Grotesk'] flex items-start gap-2">
                      <span className="font-bold text-amber-400 shrink-0">⚠️ IMPORTANT:</span>
                      <span>
                        Make sure to set file access to <strong>"Anyone with the link can view" (Public)</strong> in your Google Drive / Cloud file settings so event organizers can play & download your track!
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1.5">
                  Link to Previous Performance / Video / Drive / Reel <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="previousPerformanceLink"
                  maxLength={500}
                  value={formData.previousPerformanceLink}
                  onChange={handleChange}
                  placeholder="https://youtube.com/... or https://drive.google.com/... or Instagram Reel link"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Guidelines Agreement Checkbox */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-rose-500 focus:ring-rose-400 focus:ring-offset-0 cursor-pointer"
                />
                <span className="font-sans text-xs text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                  I have read, understood, and agree to abide by all the official{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentPage('guidelines')}
                    className="text-rose-400 hover:underline font-bold"
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
                    href="https://chat.whatsapp.com/Gnpw4LEeSEE9NuDkKKZKaj?s=cl&p=a&ilr=1"
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
                className="w-full py-4 px-8 rounded-full font-['Space_Grotesk'] text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white border border-rose-400/40 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isSubmitting ? (
                  <span>Submitting Registration...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Confirm &amp; Register Day 1 Act</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS PASS CARD */
          <div className="text-center py-8 px-4 space-y-6 max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-rose-400 font-['Space_Grotesk'] text-xs font-bold uppercase tracking-widest block">
                Registration Confirmed!
              </span>
              <h2 className="font-['Syne'] text-3xl font-extrabold text-white mt-1">
                Day 1 Performer Pass Issued
              </h2>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-rose-500/40 text-left space-y-3 font-['Space_Grotesk']">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-gray-400">Pass Registration ID:</span>
                <span className="text-sm font-bold text-rose-400">{submittedPass.reg_id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Participant:</span>
                <span className="font-bold text-white">{submittedPass.full_name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Student UID:</span>
                <span className="font-bold text-gray-200">{submittedPass.uid}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Format:</span>
                <span className="font-bold text-gray-200">
                  {submittedPass.entry_type === 'Team' ? `Group Act (${submittedPass.team_name || 'Team'})` : 'Solo Performer'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Category:</span>
                <span className="font-bold text-rose-300 uppercase">
                  {submittedPass.category}
                </span>
              </div>

              {/* Day 1 Group Co-Performers Roster */}
              {submittedPass.entry_type === 'Team' && (
                <div className="pt-2.5 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[11px] font-bold text-[#f7d978] uppercase flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#f7d978]" />
                      <span>Team Members ({teamMembersList.length + 1} Total)</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Lead: {submittedPass.full_name}</span>
                  </div>

                  {teamMembersList.length > 0 ? (
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                      {teamMembersList.map((member, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                          <span className="text-white font-medium">{idx + 2}. {member.fullName}</span>
                          <span className="font-mono text-xs text-[#f7d978]">{member.uid} <span className="text-gray-400 text-[10px]">[{member.section}, {member.group}]</span></span>
                        </div>
                      ))}
                    </div>
                  ) : submittedPass.team_members ? (
                    <div className="text-xs text-gray-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
                      <p className="leading-relaxed font-mono text-[11px]">{submittedPass.team_members}</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Mandatory WhatsApp Group Callout Banner */}
            <div className="p-5 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 text-center space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <p className="font-['Space_Grotesk'] text-sm font-extrabold text-emerald-300">
                ⚠️ ACTION REQUIRED: Join Official WhatsApp Community
              </p>
              <p className="text-xs text-gray-300 font-sans">
                Joining the WhatsApp Group is mandatory to receive your performance slot, venue updates &amp; live announcements!
              </p>
              <a
                href="https://chat.whatsapp.com/Gnpw4LEeSEE9NuDkKKZKaj?s=cl&p=a&ilr=1"
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
                Register Another Act
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
