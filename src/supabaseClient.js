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
  // NOTE: This is client-side rate limiting only — a database-level UNIQUE constraint
  // on the uid column is the authoritative duplicate-prevention mechanism.
  const lastSub = localStorage.getItem(key)
  const now = Date.now()
  if (lastSub && now - Number(lastSub) < 5000) { // 5s anti-spam threshold
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
    audio_track_url: sanitizeUrl(data.audioTrackUrl),       // URL-validated: only http/https
    entry_type: sanitizeInput(data.entryType) || 'Solo',
    team_name: sanitizeInput(data.teamName),
    team_members: formattedTeamMembers,
    team_members_raw: rawTeamMembersJson,
    performance_desc: sanitizeInput(data.performanceDesc),
    previous_performance_link: sanitizeUrl(data.previousPerformanceLink), // URL-validated
    instagram: sanitizeInput(data.instagram),
    created_at: new Date().toISOString()
  }

  // 6. Insert into Supabase
  if (supabase) {
    try {
      let { data: dbData, error } = await supabase
        .from('day1_registrations')
        .insert([insertPayload])
        .select()

      // If error is about missing team_members_raw column, automatically retry without it
      if (error && (error.message?.includes('team_members_raw') || error.details?.includes('team_members_raw'))) {
        const { team_members_raw, ...cleanPayloadWithoutRaw } = insertPayload
        const retry = await supabase
          .from('day1_registrations')
          .insert([cleanPayloadWithoutRaw])
          .select()
        dbData = retry.data
        error = retry.error
      }

      if (!error) {
        // Successfully saved in Supabase (even if select() returns [] due to RLS, the row was saved)
        const savedData = (dbData && dbData.length > 0) ? dbData[0] : insertPayload
        saveToLocalStorage('egt_day1_registrations', savedData)
        return { success: true, data: savedData, isSupabase: true }
      }

      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered! Duplicate registrations are not allowed.`
        }
      }

      console.error('Supabase Day 1 Insert Error:', error)
      return {
        success: false,
        error: `Database registration error: ${error.message || 'Unable to save to server.'} Please notify organizers if this persists.`
      }
    } catch (err) {
      console.error('Supabase Day 1 Insert Exception:', err)
      return {
        success: false,
        error: `Connection error: ${err.message || 'Failed to submit registration.'}`
      }
    }
  }

  // 7. Local Fallback storage only if Supabase client is not configured
  saveToLocalStorage('egt_day1_registrations', insertPayload)
  return { success: true, data: insertPayload, isSupabase: false }
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

  // Generate unique registration ID directly (guaranteed to prevent sequence/null constraint issues)
  const clientRegId = generateRegId('EGT2-T')

  // Payload for backend insertion
  const insertPayload = {
    reg_id: clientRegId,
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

  // 6. Insert into Supabase
  if (supabase) {
    try {
      let { data: dbData, error } = await supabase
        .from('day2_registrations')
        .insert([insertPayload])
        .select()

      // If error is about missing teammate detail columns, retry with base payload
      if (error && (error.message?.includes('teammate_') || error.details?.includes('teammate_'))) {
        const basePayload = {
          reg_id: clientRegId,
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
          created_at: new Date().toISOString()
        }
        const retry = await supabase
          .from('day2_registrations')
          .insert([basePayload])
          .select()
        dbData = retry.data
        error = retry.error
      }

      if (!error) {
        // Successfully saved in Supabase (even if select() returns [] due to RLS, the row was saved)
        const savedData = (dbData && dbData.length > 0) ? dbData[0] : insertPayload
        saveToLocalStorage('egt_day2_registrations', savedData)
        return { success: true, data: savedData, isSupabase: true }
      }

      if (error.code === '23505' || error.message?.toLowerCase().includes('unique') || error.message?.toLowerCase().includes('duplicate')) {
        return {
          success: false,
          error: `Student UID [${cleanUid}] is already registered! Duplicate registrations are not allowed.`
        }
      }

      console.error('Supabase Day 2 Insert Error:', error)
      return {
        success: false,
        error: `Database registration error: ${error.message || 'Unable to save to server.'} Please notify organizers if this persists.`
      }
    } catch (err) {
      console.error('Supabase Day 2 Insert Exception:', err)
      return {
        success: false,
        error: `Connection error: ${err.message || 'Failed to submit registration.'}`
      }
    }
  }

  // 7. Local Fallback storage only if Supabase client is not configured
  saveToLocalStorage('egt_day2_registrations', insertPayload)
  return { success: true, data: insertPayload, isSupabase: false }
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
    return
  }

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
  // Whitelist allowed tables to prevent table injection attacks
  const ALLOWED_TABLES = ['day1_registrations', 'day2_registrations']
  if (!ALLOWED_TABLES.includes(table)) {
    console.warn('deleteRegistration: invalid table name blocked:', table)
    return
  }

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
