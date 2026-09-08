import { createClient } from '@supabase/supabase-js'

// Retrieve Supabase environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if valid credentials are supplied
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project-id')
)

// Initialize Supabase client with sessionStorage (session clears on browser/tab close)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
        autoRefreshToken: true,
        persistSession: true
      }
    })
  : null

// SUPABASE AUTHENTICATION HELPERS
export async function signInAdmin(email, password) {
  if (!supabase) {
    return { success: false, error: 'Supabase credentials not configured in environment variables (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY).' }
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message || 'Supabase authentication failed.' }
  }
}

// signUpAdmin has been intentionally removed for security.
// Admin accounts must be created directly in the Supabase Dashboard
// with public signups DISABLED in Auth → Settings.

export async function signOutAdmin() {
  if (supabase) {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Signout exception:', err)
    }
  }
}

export async function getAdminSession() {
  if (!supabase) return null
  try {
    const { data } = await supabase.auth.getSession()
    return data?.session || null
  } catch (err) {
    console.warn('Get session exception:', err)
    return null
  }
}

// ----------------------------------------------------
// SECURITY & ALGORITHM VALIDATION UTILITIES
// ----------------------------------------------------
export function sanitizeInput(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\u0000-\u001F\u007F]/g, '')    // Strip null bytes & control characters
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '') // Strip zero-width & invisible unicode
    .trim()
    .slice(0, 500)                               // Hard cap length at 500 chars
}

// Validates and sanitizes URL fields — only http/https protocols allowed
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return ''
  const trimmed = url.trim().slice(0, 1000)
  try {
    const u = new URL(trimmed)
    if (!['http:', 'https:'].includes(u.protocol)) return '' // Block javascript:, data:, etc.
    return trimmed
  } catch {
    return '' // Invalid URL — discard
  }
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).trim().toLowerCase())
}

export function validatePhone(phone) {
  const clean = String(phone).replace(/\D/g, '')
  return clean.length >= 10 && clean.length <= 13
}

export function validateUID(uid) {
  const clean = String(uid).trim()
  return clean.length >= 4 && clean.length <= 30
}

export function generateRegId(prefix = 'EGT2-P') {
  const timestamp = Date.now().toString().slice(-4)
  const rand = Math.floor(10 + Math.random() * 90)
  return `${prefix}-${timestamp}${rand}`
}

export function checkSubmissionRateLimit(key = 'egt_last_sub') {
  // Client-side anti-double-click guard (1.5s threshold)
  const lastSub = localStorage.getItem(key)
  const now = Date.now()
  if (lastSub && now - Number(lastSub) < 1500) {
    return false
  }
  localStorage.setItem(key, String(now))
  return true
}

// ----------------------------------------------------
// REGISTRATION OPEN / FULL TOGGLE SYSTEM (WITH CLOUD PERSISTENCE)
// ----------------------------------------------------
let inMemorySettings = { day1Closed: false, day2Closed: false }

// Safely initialize from local storage cache
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const cached = localStorage.getItem('egt_registration_settings')
    if (cached) {
      inMemorySettings = { ...inMemorySettings, ...JSON.parse(cached) }
    }
  }
} catch (e) {
  console.warn('Initial registration settings cache load notice:', e)
}

export function getRegistrationSettings() {
  return { ...inMemorySettings }
}

export async function fetchRegistrationSettings() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_settings')
        .select('*')

      if (!error && Array.isArray(data) && data.length > 0) {
        let d1Closed = inMemorySettings.day1Closed
        let d2Closed = inMemorySettings.day2Closed

        data.forEach(row => {
          const k = String(row.key || '').trim().toLowerCase()
          const v = row.value === true || row.value === 'true' || row.value === 1 || row.value === '1'
          if (k === 'day1_closed') d1Closed = v
          if (k === 'day2_closed') d2Closed = v
        })

        inMemorySettings = {
          day1Closed: Boolean(d1Closed),
          day2Closed: Boolean(d2Closed)
        }

        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('egt_registration_settings', JSON.stringify(inMemorySettings))
          window.dispatchEvent(new CustomEvent('egt_settings_updated', { detail: inMemorySettings }))
        }

        return inMemorySettings
      }
    } catch (err) {
      console.warn('Error fetching event_settings from Supabase:', err)
    }
  }

  return inMemorySettings
}

export async function updateRegistrationSettings(newSettings) {
  const updated = { ...inMemorySettings, ...newSettings }
  inMemorySettings = updated

  // Optimistically update local cache and broadcast reactivity
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('egt_registration_settings', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('egt_settings_updated', { detail: updated }))
  }

  if (supabase) {
    try {
      // 1. Update day1_closed row in event_settings
      if (newSettings.day1Closed !== undefined) {
        const { error: e1 } = await supabase
          .from('event_settings')
          .update({ value: Boolean(updated.day1Closed) })
          .eq('key', 'day1_closed')

        if (e1) {
          console.warn('Supabase update day1_closed notice:', e1)
          await supabase.from('event_settings').upsert({ key: 'day1_closed', value: Boolean(updated.day1Closed) })
        }
      }

      // 2. Update day2_closed row in event_settings
      if (newSettings.day2Closed !== undefined) {
        const { error: e2 } = await supabase
          .from('event_settings')
          .update({ value: Boolean(updated.day2Closed) })
          .eq('key', 'day2_closed')

        if (e2) {
          console.warn('Supabase update day2_closed notice:', e2)
          await supabase.from('event_settings').upsert({ key: 'day2_closed', value: Boolean(updated.day2Closed) })
        }
      }
    } catch (err) {
      console.warn('Supabase updateRegistrationSettings exception:', err)
    }
  }

  return updated
}

// ----------------------------------------------------
// REGISTRATION SYSTEM WITH BACKEND-GENERATED UNIQUE IDs
// ----------------------------------------------------

export async function saveDay1Registration(data) {
  // 1. Event Capacity Check (live cloud verification)
  const settings = await fetchRegistrationSettings().catch(() => getRegistrationSettings())
  if (settings.day1Closed) {
    return {
      success: false,
      error: 'Registrations for Day 1 (Stage Performers) are currently FULL / CLOSED by organizers.'
    }
  }

  // 2. Anti-Spam Rate Limit Check
  if (!checkSubmissionRateLimit('egt_last_d1_sub')) {
    return {
      success: false,
      error: 'Please wait a moment before submitting again.'
    }
  }

  // 3. Strict Input Validation Algorithms
  const cleanUid = String(data.uid || '').trim().replace(/[\s-]/g, '').toUpperCase()
  const cleanEmail = String(data.email || '').trim().toLowerCase()
  const cleanPhone = String(data.phone || '').trim()
  const cleanFullName = sanitizeInput(data.fullName)

  if (!cleanFullName || cleanFullName.length < 2) {
    return { success: false, error: 'Please enter a valid full name.' }
  }
  if (!validateUID(cleanUid)) {
    return { success: false, error: 'Please enter a valid Student UID.' }
  }
  if (!validateEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@domain.com).' }
  }
  if (!validatePhone(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit phone/WhatsApp number.' }
  }

  // 4. Check for Duplicate UID in Supabase
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('day1_registrations')
        .select('uid, full_name, reg_id')
        .ilike('uid', cleanUid)

      if (existing && existing.length > 0) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered for Day 1 (${existing[0].reg_id}). Duplicate registrations are not allowed.`
        }
      }
    } catch (err) {
      console.warn('Supabase UID check warning:', err)
    }
  }

  // 5. Check local fallback storage ONLY if Supabase client is not configured
  if (!supabase) {
    const localItems = getFromLocalStorage('egt_day1_registrations')
    const localDuplicate = localItems.find(item => item.uid?.trim().toUpperCase() === cleanUid)
    if (localDuplicate) {
      return {
        success: false,
        error: `Student UID [${cleanUid}] is already registered for Day 1 (${localDuplicate.reg_id}). Duplicate registrations are not allowed.`
      }
    }
  }

  // Check for duplicate UIDs within Team Roster
  if (data.entryType === 'Team' && Array.isArray(data.teamMembersList) && data.teamMembersList.length > 0) {
    const allRosterUids = [cleanUid, ...data.teamMembersList.map(m => String(m.uid || '').trim().replace(/[\s-]/g, '').toUpperCase())].filter(Boolean)
    const uniqueUids = new Set(allRosterUids)
    if (uniqueUids.size !== allRosterUids.length) {
      return {
        success: false,
        error: 'Duplicate Student UID detected in your team roster. The lead performer and all co-performers must have unique UIDs.'
      }
    }
  }

  const formattedTeamMembers = Array.isArray(data.teamMembersList) && data.teamMembersList.length > 0
    ? data.teamMembersList.map((m, idx) => `${idx + 1}. ${m.fullName.trim()} (${m.uid.trim()}) [Sec: ${m.section.trim()}, ${m.group}, Blk: ${m.block.trim()}]`).join(' | ')
    : sanitizeInput(data.teamMembers)

  const rawTeamMembersJson = Array.isArray(data.teamMembersList) && data.teamMembersList.length > 0
    ? JSON.stringify(data.teamMembersList)
    : ''

  // Generate unique registration ID directly (guaranteed to prevent sequence/null constraint issues)
  const clientRegId = generateRegId('EGT2-P')

  // Payload for backend insertion
  const insertPayload = {
    reg_id: clientRegId,
    full_name: cleanFullName,
    uid: cleanUid,
    email: cleanEmail,
    phone: cleanPhone,
    department: sanitizeInput(data.department) || 'AIT CSE',
    academic_year: sanitizeInput(data.academicYear) || '3rd Year',
    section: sanitizeInput(data.section),
    group_name: sanitizeInput(data.group),
    block: sanitizeInput(data.block),
    category: sanitizeInput(data.category),
    requires_audio_track: sanitizeInput(data.requiresAudioTrack),
    audio_track_url: sanitizeUrl(data.audioTrackUrl),
    entry_type: sanitizeInput(data.entryType) || 'Solo',
    team_name: sanitizeInput(data.teamName),
    team_members: formattedTeamMembers,
    team_members_raw: rawTeamMembersJson,
    performance_desc: sanitizeInput(data.performanceDesc),
    previous_performance_link: sanitizeUrl(data.previousPerformanceLink),
    instagram: sanitizeInput(data.instagram),
    created_at: new Date().toISOString()
  }

  // 6. Insert into Supabase with automatic schema reconciliation
  if (supabase) {
    try {
      let currentPayload = { ...insertPayload }
      let error = null
      let attempts = 0

      // Initial insert attempt
      const res = await supabase
        .from('day1_registrations')
        .insert([currentPayload])
      error = res.error

      // Self-healing loop: if any column is not in DB table, strip it and retry automatically
      while (error && (error.message?.includes('column') || error.message?.includes('schema cache')) && attempts < 8) {
        attempts++
        const match = error.message.match(/Could not find the '([^']+)' column/i)
        if (match && match[1]) {
          const missingCol = match[1]
          console.warn(`Day 1 DB missing column '${missingCol}', pruning and retrying...`)
          delete currentPayload[missingCol]
          const retryRes = await supabase
            .from('day1_registrations')
            .insert([currentPayload])
          error = retryRes.error
        } else {
          break
        }
      }

      if (!error) {
        const savedData = { ...insertPayload, ...currentPayload }
        saveToLocalStorage('egt_day1_registrations', savedData)
        return { success: true, data: savedData, isSupabase: true }
      }

      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered! Duplicate registrations are not allowed.`
        }
      }

      console.warn('Supabase Day 1 Insert Warning:', error)
      const fallbackData = { ...insertPayload, ...currentPayload }
      saveToLocalStorage('egt_day1_registrations', fallbackData)
      return { success: true, data: fallbackData, isSupabase: false }
    } catch (err) {
      console.warn('Supabase Day 1 Exception Fallback:', err)
      const fallbackData = { ...insertPayload }
      saveToLocalStorage('egt_day1_registrations', fallbackData)
      return { success: true, data: fallbackData, isSupabase: false }
    }
  }

  // 7. Local Fallback storage only if Supabase client is not configured
  const localItems = getFromLocalStorage('egt_day1_registrations')
  let maxSeq = 0
  localItems.forEach(item => {
    if (item?.reg_id) {
      const match = item.reg_id.match(/(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!isNaN(num) && num > maxSeq) maxSeq = num
      }
    }
  })
  const nextSeq = String(maxSeq + 1).padStart(4, '0')
  const localPayload = {
    ...insertPayload,
    reg_id: `EGT2-P-${nextSeq}`
  }
  saveToLocalStorage('egt_day1_registrations', localPayload)
  return { success: true, data: localPayload, isSupabase: false }
}

export async function saveDay2Registration(data) {
  // 1. Event Capacity Check (live cloud verification)
  const settings = await fetchRegistrationSettings().catch(() => getRegistrationSettings())
  if (settings.day2Closed) {
    return {
      success: false,
      error: 'Registrations for Day 2 (Technical Squads) are currently FULL / CLOSED by organizers.'
    }
  }

  // 2. Anti-Spam Rate Limit Check (anti double-click)
  if (!checkSubmissionRateLimit('egt_last_d2_sub')) {
    return {
      success: false,
      error: 'Please wait a moment before clicking submit again.'
    }
  }

  // 3. Strict Input Validation & Space Cleansing
  const cleanUid = String(data.uid || '').trim().replace(/[\s-]/g, '').toUpperCase()
  const cleanEmail = String(data.email || '').trim().toLowerCase()
  const cleanPhone = String(data.phone || '').trim().replace(/\D/g, '')
  const cleanLeaderName = sanitizeInput(data.fullName)

  const cleanSquadName = sanitizeInput(data.squadName)
  const cleanT1Name = sanitizeInput(data.teammate1Name || data.teammate1)
  const cleanT1Uid = String(data.teammate1Uid || '').trim().replace(/[\s-]/g, '').toUpperCase()
  const cleanT1Section = sanitizeInput(data.teammate1Section)
  const cleanT1Group = sanitizeInput(data.teammate1Group)
  const cleanT1Block = sanitizeInput(data.teammate1Block)

  const cleanT2Name = sanitizeInput(data.teammate2Name || data.teammate2)
  const cleanT2Uid = String(data.teammate2Uid || '').trim().replace(/[\s-]/g, '').toUpperCase()
  const cleanT2Section = sanitizeInput(data.teammate2Section)
  const cleanT2Group = sanitizeInput(data.teammate2Group)
  const cleanT2Block = sanitizeInput(data.teammate2Block)

  const cleanT3Name = sanitizeInput(data.teammate3Name || data.teammate3)
  const cleanT3Uid = String(data.teammate3Uid || '').trim().replace(/[\s-]/g, '').toUpperCase()
  const cleanT3Section = sanitizeInput(data.teammate3Section)
  const cleanT3Group = sanitizeInput(data.teammate3Group)
  const cleanT3Block = sanitizeInput(data.teammate3Block)

  if (!cleanLeaderName || cleanLeaderName.length < 2) {
    return { success: false, error: 'Please enter a valid Squad Leader name.' }
  }
  if (!validateUID(cleanUid)) {
    return { success: false, error: 'Please enter a valid Student UID for the Squad Leader.' }
  }
  if (!validateEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address (e.g. name@domain.com).' }
  }
  if (!validatePhone(cleanPhone)) {
    return { success: false, error: 'Please enter a valid 10-digit phone/WhatsApp number.' }
  }
  if (!cleanSquadName) {
    return { success: false, error: 'Please enter a Squad / Team Name.' }
  }
  if (!cleanT1Name || !cleanT1Uid) {
    return { success: false, error: 'Teammate 1 Full Name and Student UID are required (Minimum 3 squad members).' }
  }
  if (!cleanT2Name || !cleanT2Uid) {
    return { success: false, error: 'Teammate 2 Full Name and Student UID are required (Minimum 3 squad members).' }
  }
  // Teammate 3 cross-field validation: if name filled, UID must also be filled
  if (cleanT3Name && !cleanT3Uid) {
    return { success: false, error: 'Please enter the Student UID for Teammate 3 (or clear Teammate 3 name to submit a 3-member squad).' }
  }
  if (!cleanT3Name && cleanT3Uid) {
    return { success: false, error: 'Please enter the Full Name for Teammate 3 (or clear Teammate 3 UID to submit a 3-member squad).' }
  }

  // Squad internal duplicate UID check (Leader + Teammates 1, 2, 3)
  const squadUids = [cleanUid, cleanT1Uid, cleanT2Uid, cleanT3Uid].filter(Boolean)
  const uniqueSquadUids = new Set(squadUids)
  if (uniqueSquadUids.size !== squadUids.length) {
    return {
      success: false,
      error: 'Duplicate Student UID detected in squad roster. The squad leader and all teammates must have unique UIDs.'
    }
  }

  const formattedT1 = cleanT1Uid ? `${cleanT1Name} (${cleanT1Uid}) [Sec: ${cleanT1Section}, ${cleanT1Group}, Blk: ${cleanT1Block}]` : cleanT1Name
  const formattedT2 = cleanT2Uid ? `${cleanT2Name} (${cleanT2Uid}) [Sec: ${cleanT2Section}, ${cleanT2Group}, Blk: ${cleanT2Block}]` : cleanT2Name
  const formattedT3 = cleanT3Uid ? `${cleanT3Name} (${cleanT3Uid}) [Sec: ${cleanT3Section}, ${cleanT3Group}, Blk: ${cleanT3Block}]` : cleanT3Name

  // 4. Check for Duplicate UID in Supabase
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('day2_registrations')
        .select('uid, reg_id')
        .ilike('uid', cleanUid)

      if (existing && existing.length > 0) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered as a squad leader for Day 2 (${existing[0].reg_id}).`
        }
      }
    } catch (err) {
      console.warn('Supabase UID check warning:', err)
    }
  }

  // 5. Check local fallback storage ONLY if Supabase client is not configured
  if (!supabase) {
    const localItems = getFromLocalStorage('egt_day2_registrations')
    const localDuplicate = localItems.find(item => item.uid?.trim().toUpperCase() === cleanUid)
    if (localDuplicate) {
      return {
        success: false,
        error: `Student UID [${cleanUid}] is already registered for Day 2 (${localDuplicate.reg_id}). Duplicate registrations are not allowed.`
      }
    }
  }

  // Generate unique registration ID directly
  const clientRegId = generateRegId('EGT2-T')

  // Payload for backend insertion (both leader_name & full_name, both squad_name & team_name for maximum schema compatibility)
  const insertPayload = {
    reg_id: clientRegId,
    leader_name: cleanLeaderName,
    full_name: cleanLeaderName,
    uid: cleanUid,
    email: cleanEmail,
    phone: cleanPhone,
    department: sanitizeInput(data.department) || 'AIT CSE',
    academic_year: sanitizeInput(data.academicYear) || '3rd Year',
    section: sanitizeInput(data.section),
    group_name: sanitizeInput(data.group),
    block: sanitizeInput(data.block),
    squad_name: cleanSquadName,
    team_name: cleanSquadName,
    teammate_1: formattedT1,
    teammate_2: formattedT2,
    teammate_3: formattedT3 || '',
    teammate_1_name: cleanT1Name,
    teammate_1_uid: cleanT1Uid,
    teammate_1_section: cleanT1Section,
    teammate_1_group: cleanT1Group,
    teammate_1_block: cleanT1Block,
    teammate_2_name: cleanT2Name,
    teammate_2_uid: cleanT2Uid,
    teammate_2_section: cleanT2Section,
    teammate_2_group: cleanT2Group,
    teammate_2_block: cleanT2Block,
    teammate_3_name: cleanT3Name,
    teammate_3_uid: cleanT3Uid,
    teammate_3_section: cleanT3Section,
    teammate_3_group: cleanT3Group,
    teammate_3_block: cleanT3Block,
    created_at: new Date().toISOString()
  }

  // 6. Insert into Supabase with automatic schema reconciliation
  if (supabase) {
    try {
      let currentPayload = { ...insertPayload }
      let error = null
      let attempts = 0

      // Initial insert attempt
      const res = await supabase
        .from('day2_registrations')
        .insert([currentPayload])
      error = res.error

      // Self-healing loop: if any column is not in DB table, strip it and retry automatically
      while (error && (error.message?.includes('column') || error.message?.includes('schema cache')) && attempts < 12) {
        attempts++
        const match = error.message.match(/Could not find the '([^']+)' column/i) || error.message.match(/column "([^"]+)" of relation/i)
        if (match && match[1]) {
          const missingCol = match[1]
          console.warn(`Day 2 DB missing column '${missingCol}', pruning and retrying...`)
          delete currentPayload[missingCol]
          const retryRes = await supabase
            .from('day2_registrations')
            .insert([currentPayload])
          error = retryRes.error
        } else {
          break
        }
      }

      if (!error) {
        const savedData = { ...insertPayload, ...currentPayload }
        saveToLocalStorage('egt_day2_registrations', savedData)
        return { success: true, data: savedData, isSupabase: true }
      }

      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        const msg = error.message?.toLowerCase() || ''
        if (msg.includes('email')) {
          return { success: false, error: `Email address [${cleanEmail}] is already registered! Please use a unique email address.` }
        }
        if (msg.includes('phone')) {
          return { success: false, error: `Phone number is already registered! Please use a unique phone number.` }
        }
        if (msg.includes('squad') || msg.includes('team_name')) {
          return { success: false, error: `Squad name "${cleanSquadName}" is already taken! Please choose a unique squad name.` }
        }
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered for Day 2! Duplicate registrations are not allowed.`
        }
      }

      console.warn('Supabase Day 2 Insert Warning:', error)
      // If error is non-fatal RLS or network, fallback to local storage so student is never blocked
      const fallbackData = { ...insertPayload, ...currentPayload }
      saveToLocalStorage('egt_day2_registrations', fallbackData)
      return { success: true, data: fallbackData, isSupabase: false }
    } catch (err) {
      console.warn('Supabase Day 2 Exception Fallback:', err)
      const fallbackData = { ...insertPayload }
      saveToLocalStorage('egt_day2_registrations', fallbackData)
      return { success: true, data: fallbackData, isSupabase: false }
    }
  }

  // 7. Local Fallback storage only if Supabase client is not configured
  const localItems = getFromLocalStorage('egt_day2_registrations')
  let maxSeq = 0
  localItems.forEach(item => {
    if (item?.reg_id) {
      const match = item.reg_id.match(/(\d+)$/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!isNaN(num) && num > maxSeq) maxSeq = num
      }
    }
  })
  const nextSeq = String(maxSeq + 1).padStart(4, '0')
  const localPayload = {
    ...insertPayload,
    reg_id: `EGT2-T-${nextSeq}`
  }
  saveToLocalStorage('egt_day2_registrations', localPayload)
  return { success: true, data: localPayload, isSupabase: false }
}

// Fetch all Day 1 Registrations
export async function getDay1Registrations() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('day1_registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data
      }
      if (error) {
        console.error('Supabase fetch day1_registrations error:', error)
      }
    } catch (err) {
      console.error('Failed to fetch day1 from Supabase:', err)
    }
  }
  return getFromLocalStorage('egt_day1_registrations')
}

// Fetch all Day 2 Registrations
export async function getDay2Registrations() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('day2_registrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data
      }
      if (error) {
        console.error('Supabase fetch day2_registrations error:', error)
      }
    } catch (err) {
      console.error('Failed to fetch day2 from Supabase:', err)
    }
  }
  return getFromLocalStorage('egt_day2_registrations')
}

// Update Registration Status
export async function updateRegistrationStatus(table, regId, status) {
  // Whitelist allowed tables to prevent table injection attacks
  const ALLOWED_TABLES = ['day1_registrations', 'day2_registrations']
  if (!ALLOWED_TABLES.includes(table)) {
    console.warn('updateRegistrationStatus: invalid table name blocked:', table)
    return { success: false, error: 'Invalid table name' }
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('reg_id', regId)

      if (error) {
        console.error('Supabase status update failed:', error)
        return { success: false, error: error.message }
      }
    } catch (err) {
      console.error('Supabase status update exception:', err)
      return { success: false, error: err.message || 'Status update failed' }
    }
  }

  const localKey = table === 'day1_registrations' ? 'egt_day1_registrations' : 'egt_day2_registrations'
  const items = getFromLocalStorage(localKey)
  const updated = items.map(item => item.reg_id === regId ? { ...item, status } : item)
  localStorage.setItem(localKey, JSON.stringify(updated))
  return { success: true }
}

// Delete Registration
export async function deleteRegistration(table, regId) {
  // Whitelist allowed tables to prevent table injection attacks
  const ALLOWED_TABLES = ['day1_registrations', 'day2_registrations']
  if (!ALLOWED_TABLES.includes(table)) {
    console.warn('deleteRegistration: invalid table name blocked:', table)
    return { success: false, error: 'Invalid table name' }
  }

  if (supabase) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('reg_id', regId)

      if (error) {
        console.error('Supabase delete failed:', error)
        return { success: false, error: error.message }
      }
    } catch (err) {
      console.error('Supabase delete exception:', err)
      return { success: false, error: err.message || 'Delete operation failed' }
    }
  }

  const localKey = table === 'day1_registrations' ? 'egt_day1_registrations' : 'egt_day2_registrations'
  const items = getFromLocalStorage(localKey)
  const filtered = items.filter(item => item.reg_id !== regId)
  localStorage.setItem(localKey, JSON.stringify(filtered))
  return { success: true }
}

// ----------------------------------------------------
// CONTACT & INQUIRY MESSAGES API
// ----------------------------------------------------
export async function submitContactMessage(messageData) {
  const payload = {
    name: (messageData.name || '').trim(),
    email: (messageData.email || '').trim(),
    phone: (messageData.phone || '').trim() || null,
    category: messageData.category || 'General Inquiry & Feedback',
    message: (messageData.message || '').trim(),
    created_at: new Date().toISOString()
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([payload])

      if (error) {
        console.warn('Supabase contact message insert notice:', error)
      } else {
        const savedItem = { ...payload, id: (data && data[0]?.id) || Date.now() }
        saveToLocalStorage('egt_contact_messages', savedItem)
        return { success: true, data: savedItem }
      }
    } catch (err) {
      console.warn('Supabase contact message exception:', err)
    }
  }

  // Fallback to localStorage
  const fallbackItem = { ...payload, id: Date.now() }
  saveToLocalStorage('egt_contact_messages', fallbackItem)
  return { success: true, data: fallbackItem }
}

export async function getContactMessages() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.warn('Supabase getContactMessages warning:', error)
      } else if (data) {
        return data.filter(item => item?.email !== '__system_registration_settings__' && item?.name !== '__SYSTEM_CONFIG__')
      }
    } catch (err) {
      console.warn('Supabase getContactMessages exception:', err)
    }
  }

  const local = getFromLocalStorage('egt_contact_messages')
  return local.filter(item => item?.email !== '__system_registration_settings__' && item?.name !== '__SYSTEM_CONFIG__')
}

export async function deleteContactMessage(id) {
  if (supabase) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) {
        console.warn('Supabase deleteContactMessage warning:', error)
      }
    } catch (err) {
      console.warn('Supabase deleteContactMessage exception:', err)
    }
  }

  const items = getFromLocalStorage('egt_contact_messages')
  const filtered = items.filter(item => String(item.id) !== String(id))
  localStorage.setItem('egt_contact_messages', JSON.stringify(filtered))
  return { success: true }
}

// Storage Helpers
function saveToLocalStorage(key, payload) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = JSON.parse(localStorage.getItem(key) || '[]')
      existing.unshift(payload)
      localStorage.setItem(key, JSON.stringify(existing))
    }
  } catch (err) {
    console.warn('saveToLocalStorage exception:', err)
  }
}

function getFromLocalStorage(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return JSON.parse(localStorage.getItem(key) || '[]')
    }
  } catch (err) {
    console.warn('getFromLocalStorage exception:', err)
  }
  return []
}

