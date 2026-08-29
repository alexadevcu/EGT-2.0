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

export async function signUpAdmin(email, password) {
  if (!supabase) {
    return { success: false, error: 'Supabase credentials not configured in environment variables.' }
  }
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password
    })
    if (error) {
      return { success: false, error: error.message }
    }
    return { success: true, data }
  } catch (err) {
    return { success: false, error: err.message || 'Supabase account creation failed.' }
  }
}

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
    .trim()
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

export function checkSubmissionRateLimit(key = 'egt_last_sub') {
  const lastSub = localStorage.getItem(key)
  const now = Date.now()
  if (lastSub && now - Number(lastSub) < 2500) { // 2.5s anti-spam threshold
    return false
  }
  localStorage.setItem(key, String(now))
  return true
}

// ----------------------------------------------------
// REGISTRATION OPEN / FULL TOGGLE SYSTEM
// ----------------------------------------------------
export function getRegistrationSettings() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = localStorage.getItem('egt_registration_settings')
      if (cached) {
        return JSON.parse(cached)
      }
    }
  } catch (err) {
    console.warn('Failed to parse registration settings:', err)
  }
  return { day1Closed: false, day2Closed: false }
}

export function updateRegistrationSettings(newSettings) {
  try {
    const current = getRegistrationSettings()
    const updated = { ...current, ...newSettings }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('egt_registration_settings', JSON.stringify(updated))
      window.dispatchEvent(new Event('egt_settings_updated'))
    }
    return updated
  } catch (err) {
    console.warn('Failed to update registration settings:', err)
    return newSettings
  }
}

// ----------------------------------------------------
// REGISTRATION SYSTEM WITH BACKEND-GENERATED UNIQUE IDs
// ----------------------------------------------------

export async function saveDay1Registration(data) {
  // 1. Event Capacity Check
  const settings = getRegistrationSettings()
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
      error: 'Please wait a few seconds before submitting another registration.'
    }
  }

  // 3. Strict Input Validation Algorithms
  const cleanUid = sanitizeInput(data.uid).toUpperCase()
  const cleanEmail = sanitizeInput(data.email).toLowerCase()
  const cleanPhone = sanitizeInput(data.phone)
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

  // 5. Check local fallback storage
  const localItems = getFromLocalStorage('egt_day1_registrations')
  const localDuplicate = localItems.find(item => item.uid?.trim().toUpperCase() === cleanUid)
  if (localDuplicate) {
    return {
      success: false,
      error: `Student UID [${cleanUid}] is already registered for Day 1 (${localDuplicate.reg_id}). Duplicate registrations are not allowed.`
    }
  }

  const formattedTeamMembers = Array.isArray(data.teamMembersList) && data.teamMembersList.length > 0
    ? data.teamMembersList.map((m, idx) => `${idx + 1}. ${m.fullName.trim()} (${m.uid.trim()}) [Sec: ${m.section.trim()}, ${m.group}, Blk: ${m.block.trim()}]`).join(' | ')
    : sanitizeInput(data.teamMembers)

  const rawTeamMembersJson = Array.isArray(data.teamMembersList) && data.teamMembersList.length > 0
    ? JSON.stringify(data.teamMembersList)
    : ''

  // Payload for backend insertion
  const insertPayload = {
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
    audio_track_url: sanitizeInput(data.audioTrackUrl),
    entry_type: sanitizeInput(data.entryType) || 'Solo',
    team_name: sanitizeInput(data.teamName),
    team_members: formattedTeamMembers,
    team_members_raw: rawTeamMembersJson,
    performance_desc: sanitizeInput(data.performanceDesc),
    previous_performance_link: sanitizeInput(data.previousPerformanceLink),
    instagram: sanitizeInput(data.instagram),
    created_at: new Date().toISOString()
  }

  // 6. Insert into Supabase (Backend generates unique EGT2-P-0001 reg_id)
  if (supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('day1_registrations')
        .insert([insertPayload])
        .select()

      if (!error && dbData && dbData.length > 0) {
        saveToLocalStorage('egt_day1_registrations', dbData[0])
        return { success: true, data: dbData[0], isSupabase: true }
      } else if (error && (error.code === '23505' || error.message.includes('unique'))) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered! Duplicate registrations are not allowed.`
        }
      }
    } catch (err) {
      console.warn('Supabase insert exception, falling back to local:', err)
    }
  }

  // 7. Local Fallback storage with sequential EGT2-P-XXXX format
  const nextSeq = String(localItems.length + 1).padStart(4, '0')
  const localPayload = {
    reg_id: `EGT2-P-${nextSeq}`,
    ...insertPayload
  }

  saveToLocalStorage('egt_day1_registrations', localPayload)
  return { success: true, data: localPayload, isSupabase: false }
}

export async function saveDay2Registration(data) {
  // 1. Event Capacity Check
  const settings = getRegistrationSettings()
  if (settings.day2Closed) {
    return {
      success: false,
      error: 'Registrations for Day 2 (Technical Squads) are currently FULL / CLOSED by organizers.'
    }
  }

  // 2. Anti-Spam Rate Limit Check
  if (!checkSubmissionRateLimit('egt_last_d2_sub')) {
    return {
      success: false,
      error: 'Please wait a few seconds before submitting another registration.'
    }
  }

  // 3. Strict Input Validation Algorithms
  const cleanUid = sanitizeInput(data.uid).toUpperCase()
  const cleanEmail = sanitizeInput(data.email).toLowerCase()
  const cleanPhone = sanitizeInput(data.phone)
  const cleanLeaderName = sanitizeInput(data.fullName)

  const cleanSquadName = sanitizeInput(data.squadName)
  const cleanT1Name = sanitizeInput(data.teammate1Name || data.teammate1)
  const cleanT1Uid = sanitizeInput(data.teammate1Uid).toUpperCase()
  const cleanT1Section = sanitizeInput(data.teammate1Section)
  const cleanT1Group = sanitizeInput(data.teammate1Group)
  const cleanT1Block = sanitizeInput(data.teammate1Block)

  const cleanT2Name = sanitizeInput(data.teammate2Name || data.teammate2)
  const cleanT2Uid = sanitizeInput(data.teammate2Uid).toUpperCase()
  const cleanT2Section = sanitizeInput(data.teammate2Section)
  const cleanT2Group = sanitizeInput(data.teammate2Group)
  const cleanT2Block = sanitizeInput(data.teammate2Block)

  const cleanT3Name = sanitizeInput(data.teammate3Name || data.teammate3)
  const cleanT3Uid = sanitizeInput(data.teammate3Uid).toUpperCase()
  const cleanT3Section = sanitizeInput(data.teammate3Section)
  const cleanT3Group = sanitizeInput(data.teammate3Group)
  const cleanT3Block = sanitizeInput(data.teammate3Block)

  if (!cleanLeaderName || cleanLeaderName.length < 2) {
    return { success: false, error: 'Please enter a valid Squad Leader name.' }
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
  if (!cleanSquadName) {
    return { success: false, error: 'Please enter a Squad / Team Name.' }
  }
  if (!cleanT1Name || !cleanT1Uid) {
    return { success: false, error: 'Teammate 1 Full Name and Student UID are both minimum requirements.' }
  }
  if (!cleanT2Name || !cleanT2Uid) {
    return { success: false, error: 'Teammate 2 Full Name and Student UID are both minimum requirements.' }
  }
  // Teammate 3 cross-field validation: if name filled, UID must also be filled
  if (cleanT3Name && !cleanT3Uid) {
    return { success: false, error: 'Please enter the Student UID for Teammate 3 (or leave both fields blank).' }
  }
  if (!cleanT3Name && cleanT3Uid) {
    return { success: false, error: 'Please enter the Full Name for Teammate 3 (or leave both fields blank).' }
  }

  const formattedT1 = cleanT1Uid ? `${cleanT1Name} (${cleanT1Uid}) [Sec: ${cleanT1Section}, ${cleanT1Group}, Blk: ${cleanT1Block}]` : cleanT1Name
  const formattedT2 = cleanT2Uid ? `${cleanT2Name} (${cleanT2Uid}) [Sec: ${cleanT2Section}, ${cleanT2Group}, Blk: ${cleanT2Block}]` : cleanT2Name
  const formattedT3 = cleanT3Uid ? `${cleanT3Name} (${cleanT3Uid}) [Sec: ${cleanT3Section}, ${cleanT3Group}, Blk: ${cleanT3Block}]` : cleanT3Name

  // 4. Check for Duplicate UID in Supabase
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from('day2_registrations')
        .select('uid, leader_name, reg_id')
        .ilike('uid', cleanUid)

      if (existing && existing.length > 0) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered for Day 2 (${existing[0].reg_id}). Duplicate registrations are not allowed.`
        }
      }
    } catch (err) {
      console.warn('Supabase UID check warning:', err)
    }
  }

  // 5. Check local fallback storage
  const localItems = getFromLocalStorage('egt_day2_registrations')
  const localDuplicate = localItems.find(item => item.uid?.trim().toUpperCase() === cleanUid)
  if (localDuplicate) {
    return {
      success: false,
      error: `Student UID [${cleanUid}] is already registered for Day 2 (${localDuplicate.reg_id}). Duplicate registrations are not allowed.`
    }
  }

  // Payload for backend insertion
  const insertPayload = {
    leader_name: cleanLeaderName,
    uid: cleanUid,
    email: cleanEmail,
    phone: cleanPhone,
    department: sanitizeInput(data.department) || 'AIT CSE',
    academic_year: sanitizeInput(data.academicYear) || '3rd Year',
    section: sanitizeInput(data.section),
    group_name: sanitizeInput(data.group),
    block: sanitizeInput(data.block),
    squad_name: cleanSquadName,
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

  // 6. Insert into Supabase (Backend generates unique EGT2-T-0001 reg_id)
  if (supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('day2_registrations')
        .insert([insertPayload])
        .select()

      if (!error && dbData && dbData.length > 0) {
        saveToLocalStorage('egt_day2_registrations', dbData[0])
        return { success: true, data: dbData[0], isSupabase: true }
      } else if (error && (error.code === '23505' || error.message.includes('unique'))) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered! Duplicate registrations are not allowed.`
        }
      }
    } catch (err) {
      console.warn('Supabase insert exception, falling back to local:', err)
    }
  }

  // 7. Local Fallback storage with sequential EGT2-T-XXXX format
  const nextSeq = String(localItems.length + 1).padStart(4, '0')
  const localPayload = {
    reg_id: `EGT2-T-${nextSeq}`,
    ...insertPayload
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
    } catch (err) {
      console.warn('Failed to fetch from Supabase:', err)
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
    } catch (err) {
      console.warn('Failed to fetch from Supabase:', err)
    }
  }
  return getFromLocalStorage('egt_day2_registrations')
}

// Update Registration Status
export async function updateRegistrationStatus(table, regId, status) {
  if (supabase) {
    try {
      await supabase
        .from(table)
        .update({ status })
        .eq('reg_id', regId)
    } catch (err) {
      console.warn('Supabase status update failed:', err)
    }
  }

  const localKey = table === 'day1_registrations' ? 'egt_day1_registrations' : 'egt_day2_registrations'
  const items = getFromLocalStorage(localKey)
  const updated = items.map(item => item.reg_id === regId ? { ...item, status } : item)
  localStorage.setItem(localKey, JSON.stringify(updated))
}

// Delete Registration
export async function deleteRegistration(table, regId) {
  if (supabase) {
    try {
      await supabase
        .from(table)
        .delete()
        .eq('reg_id', regId)
    } catch (err) {
      console.warn('Supabase delete failed:', err)
    }
  }

  const localKey = table === 'day1_registrations' ? 'egt_day1_registrations' : 'egt_day2_registrations'
  const items = getFromLocalStorage(localKey)
  const filtered = items.filter(item => item.reg_id !== regId)
  localStorage.setItem(localKey, JSON.stringify(filtered))
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
