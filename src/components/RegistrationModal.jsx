import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function RegistrationModal({ isOpen, onClose, initialTab = 'day1-performer' }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [submittedPass, setSubmittedPass] = useState(null)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
      setSubmittedPass(null)
    }
  }, [isOpen, initialTab])

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    rollNo: '',
    email: '',
    phone: '',
    department: 'CSE',
    academicYear: '3rd Year',
    // Day 1 specific
    category: 'Singing',
    entryType: 'Solo',
    performanceTitle: '',
    teamMembers: '',
    durationAck: false,
    guidelinesAck: false,
    // Day 2 specific
    primaryLanguage: 'C++',
    specialization: 'Competitive Programming'
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Trigger confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } catch (err) {
      console.log('Confetti triggered')
    }

    const regId = 'EGT26-' + Math.floor(100000 + Math.random() * 900000)
    const passObj = {
      regId,
      ...formData,
      registrationType: activeTab,
      createdAt: new Date().toLocaleString()
    }

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('egt_registrations') || '[]')
    existing.push(passObj)
    localStorage.setItem('egt_registrations', JSON.stringify(existing))

    setSubmittedPass(passObj)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#16130b] border border-[#d4af37]/40 rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)] p-6 md:p-8 text-[#eae1d4] my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d0c5af] hover:text-[#f2ca50] p-2 focus:outline-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {!submittedPass ? (
          <>
            <div className="text-center mb-6">
              <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold text-[#f2ca50]">
                EVENT REGISTRATION
              </h2>
              <p className="font-['Work_Sans'] text-sm text-[#d0c5af] mt-1">
                Engineer's Got Talent 2.0 • Department of CSE – Takshashila
              </p>
            </div>

            {/* Registration Tabs */}
            <div className="flex border-b border-[#4d4635] mb-6 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('day1-performer')}
                className={`py-3 px-4 font-['Space_Grotesk'] text-xs font-bold uppercase whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'day1-performer'
                    ? 'border-[#f2ca50] text-[#f2ca50]'
                    : 'border-transparent text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                Day 1 Performer 🎤
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('day1-audience')}
                className={`py-3 px-4 font-['Space_Grotesk'] text-xs font-bold uppercase whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'day1-audience'
                    ? 'border-[#f2ca50] text-[#f2ca50]'
                    : 'border-transparent text-[#d0c5af] hover:text-[#f2ca50]'
                }`}
              >
                Day 1 Audience 👥
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('day2-wizard')}
                className={`py-3 px-4 font-['Space_Grotesk'] text-xs font-bold uppercase whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === 'day2-wizard'
                    ? 'border-[#00F2FF] text-[#00F2FF]'
                    : 'border-transparent text-[#d0c5af] hover:text-[#00F2FF]'
                }`}
              >
                Day 2 Tech Wizard ⚡
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    Roll Number (CU ID) *
                  </label>
                  <input
                    type="text"
                    name="rollNo"
                    required
                    value={formData.rollNo}
                    onChange={handleChange}
                    placeholder="e.g. 21BCS1001"
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    University Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@cuchd.in"
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  >
                    <option value="CSE">Department of CSE – Takshashila</option>
                    <option value="IT">Department of IT</option>
                    <option value="ECE">Department of ECE</option>
                    <option value="ME">Department of ME</option>
                    <option value="Other">Other Engineering Dept</option>
                  </select>
                </div>

                <div>
                  <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                    Academic Year
                  </label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              {/* Day 1 Performer Specific Fields */}
              {activeTab === 'day1-performer' && (
                <div className="space-y-4 pt-3 border-t border-[#4d4635]/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                        Talent Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                      >
                        <option value="Singing">Singing 🎤</option>
                        <option value="Dance">Dance 💃</option>
                        <option value="Instrumental">Instrumental 🎸</option>
                        <option value="Drama / Skit">Drama / Skit 🎭</option>
                        <option value="Mono-act">Mono-act 🎬</option>
                        <option value="Standup Comedy">Standup Comedy 🎙️</option>
                        <option value="Mimicry">Mimicry 🗣️</option>
                        <option value="Poetry / Spoken Word">Poetry / Spoken Word ✍️</option>
                        <option value="Beatboxing">Beatboxing 🎧</option>
                        <option value="Freestyle">Freestyle 🔥</option>
                        <option value="Magic">Magic 🎩</option>
                        <option value="Other">Other Unique Talent 🎨</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                        Entry Format *
                      </label>
                      <select
                        name="entryType"
                        value={formData.entryType}
                        onChange={handleChange}
                        className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                      >
                        <option value="Solo">Solo Performer</option>
                        <option value="Duo">Duo (2 members)</option>
                        <option value="Group">Group Performance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                      Performance Title / Theme *
                    </label>
                    <input
                      type="text"
                      name="performanceTitle"
                      required
                      value={formData.performanceTitle}
                      onChange={handleChange}
                      placeholder="e.g. Classical Fusion Solo Dance"
                      className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                    />
                  </div>

                  {formData.entryType !== 'Solo' && (
                    <div>
                      <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#d0c5af] mb-1">
                        Group Member Names & Roll Numbers
                      </label>
                      <textarea
                        name="teamMembers"
                        rows={2}
                        value={formData.teamMembers}
                        onChange={handleChange}
                        placeholder="List full names & roll numbers of all co-performers..."
                        className="w-full bg-[#1f1b13] border border-[#4d4635] focus:border-[#f2ca50] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-xs text-[#d0c5af] cursor-pointer">
                      <input
                        type="checkbox"
                        name="durationAck"
                        required
                        checked={formData.durationAck}
                        onChange={handleChange}
                        className="rounded accent-[#f2ca50]"
                      />
                      I acknowledge that performance duration is strictly capped at 3 minutes.
                    </label>

                    <label className="flex items-center gap-2 text-xs text-[#d0c5af] cursor-pointer">
                      <input
                        type="checkbox"
                        name="guidelinesAck"
                        required
                        checked={formData.guidelinesAck}
                        onChange={handleChange}
                        className="rounded accent-[#f2ca50]"
                      />
                      I agree to adhere to all university content & performance guidelines.
                    </label>
                  </div>
                </div>
              )}

              {/* Day 2 Tech Wizard Specific Fields */}
              {activeTab === 'day2-wizard' && (
                <div className="space-y-4 pt-3 border-t border-[#00F2FF]/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#b4c5ff] mb-1">
                        Primary Programming Language *
                      </label>
                      <select
                        name="primaryLanguage"
                        value={formData.primaryLanguage}
                        onChange={handleChange}
                        className="w-full bg-[#0A192F] border border-[#00F2FF]/30 focus:border-[#00F2FF] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                      >
                        <option value="C++">C++</option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="C">C</option>
                        <option value="JavaScript/TypeScript">JavaScript / TypeScript</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-['Space_Grotesk'] text-xs font-bold uppercase text-[#b4c5ff] mb-1">
                        Preferred Challenge Specialization
                      </label>
                      <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        className="w-full bg-[#0A192F] border border-[#00F2FF]/30 focus:border-[#00F2FF] rounded px-3 py-2 text-sm text-[#eae1d4] focus:outline-none"
                      >
                        <option value="Competitive Programming">Competitive Programming & DSA</option>
                        <option value="Debugging & Problem Solving">Debugging & Logical Puzzles</option>
                        <option value="Web & Full Stack">Web Development & APIs</option>
                        <option value="AI & ML">AI / Machine Learning</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-3 rounded font-['Space_Grotesk'] font-bold text-sm uppercase transition-all cursor-pointer ${
                    activeTab === 'day2-wizard'
                      ? 'bg-[#00F2FF] text-[#0A192F] hover:bg-[#00F2FF]/90 shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                      : 'bg-[#d4af37] text-[#3c2f00] hover:bg-[#f2ca50] shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                  }`}
                >
                  Complete Registration & Issue Digital Pass
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Instant Digital Pass Display */
          <div className="text-center space-y-6 py-4">
            <div className="inline-flex p-3 rounded-full bg-[#d4af37]/20 border border-[#f2ca50] text-[#f2ca50]">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <div>
              <span className="font-['Space_Grotesk'] text-xs uppercase tracking-widest text-[#f2ca50]">
                Registration Successful!
              </span>
              <h2 className="font-['Cinzel'] text-2xl md:text-3xl font-bold text-[#eae1d4] mt-1">
                DIGITAL EVENT PASS
              </h2>
            </div>

            <div className="bg-[#1f1b13] border border-[#d4af37]/40 rounded-xl p-6 text-left space-y-3 font-['Work_Sans'] text-sm relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-[#4d4635] pb-3">
                <div>
                  <p className="font-['Space_Grotesk'] text-xs font-bold text-[#f2ca50] uppercase">
                    Pass ID: {submittedPass.regId}
                  </p>
                  <p className="font-['Cinzel'] text-lg font-bold text-[#eae1d4]">
                    {submittedPass.fullName}
                  </p>
                </div>
                <span className="px-3 py-1 bg-[#3d392f] text-[#f2ca50] text-xs font-['Space_Grotesk'] font-bold rounded uppercase">
                  {submittedPass.registrationType.replace('-', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#d0c5af]">
                <p><strong>Roll No:</strong> {submittedPass.rollNo}</p>
                <p><strong>Department:</strong> {submittedPass.department}</p>
                <p><strong>Email:</strong> {submittedPass.email}</p>
                <p><strong>Issued On:</strong> {submittedPass.createdAt}</p>
              </div>

              {submittedPass.category && (
                <p className="text-xs text-[#f2ca50]">
                  <strong>Talent Category:</strong> {submittedPass.category} ({submittedPass.entryType})
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="bg-[#d4af37] text-[#3c2f00] font-['Space_Grotesk'] font-bold text-xs uppercase px-8 py-3 rounded spotlight-glow"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
