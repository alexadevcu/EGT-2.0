import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  Users,
  Mic,
  Code,
  Lock,
  ArrowLeft,
  FileSpreadsheet,
  XCircle,
  AlertCircle,
  KeyRound,
  Database,
  Table,
  ExternalLink,
  Grid,
  ToggleLeft,
  ToggleRight,
  Power,
  Ban,
  UploadCloud,
  Check,
  Copy,
  Settings
} from 'lucide-react'
import {
  getDay1Registrations,
  getDay2Registrations,
  deleteRegistration,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  getAdminSession,
  getRegistrationSettings,
  updateRegistrationSettings,
  updateRegistrationStatus
} from '../supabaseClient'

export function parseDay1TeamMembers(row) {
  if (!row) return []
  if (Array.isArray(row.teamMembersList) && row.teamMembersList.length > 0) {
    return row.teamMembersList
  }
  if (row.team_members_raw) {
    try {
      const parsed = JSON.parse(row.team_members_raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch (e) {}
  }
  
  const rawStr = row.team_members || ''
  if (!rawStr) return []

  const parts = rawStr.split(/\s*\|\s*/)
  return parts.map(part => {
    // e.g. "1. Vasu Gera (7056502148) [Sec: dfg, Group A, Blk: s2]"
    const nameMatch = part.match(/(?:\d+\.\s*)?([^(]+)\s*\(([^)]+)\)/)
    const secMatch = part.match(/\[Sec:\s*([^,\]]+)/i)
    const grpMatch = part.match(/Sec:[^,]+,\s*([^,\]]+)/i) || part.match(/,\s*(Group\s+[AB]|[^,\]]+),\s*Blk:/i)
    const blkMatch = part.match(/Blk:\s*([^\]]+)/i)

    return {
      fullName: nameMatch ? nameMatch[1].trim() : part.trim(),
      uid: nameMatch ? nameMatch[2].trim() : '',
      section: secMatch ? secMatch[1].trim() : '',
      group: grpMatch ? grpMatch[1].trim() : '',
      block: blkMatch ? blkMatch[1].trim() : ''
    }
  }).filter(m => m.fullName || m.uid)
}

// Safely validate a URL from the database before using it as an href.
// Only allows http: and https: protocols — blocks javascript:, data:, etc.
function safeHref(url) {
  if (!url || typeof url !== 'string') return '#'
  try {
    const u = new URL(url.trim())
    return ['http:', 'https:'].includes(u.protocol) ? url.trim() : '#'
  } catch {
    return '#'
  }
}

export default function AdminPage({ setCurrentPage }) {
  // Supabase Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState(null)

  // Registration Controls (Open vs Full/Closed)
  const [regSettings, setRegSettings] = useState(getRegistrationSettings())

  const handleToggleRegistration = (dayKey) => {
    const updated = updateRegistrationSettings({
      [dayKey]: !regSettings[dayKey]
    })
    setRegSettings(updated)
  }

  // Data & Tabs State
  const [activeTab, setActiveTab] = useState('day1')
  const [day1Data, setDay1Data] = useState([])
  const [day2Data, setDay2Data] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters, Search & View Mode
  const [viewMode, setViewMode] = useState('table') // 'table' | 'sheets'
  const [googleSheetUrl, setGoogleSheetUrl] = useState(import.meta.env.VITE_GOOGLE_SHEET_URL || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)

  // Direct Google Sheets Webhook Sync State
  const [day1WebhookUrl, setDay1WebhookUrl] = useState(
    localStorage.getItem('egt_day1_webhook_url') || ''
  )
  const [day2WebhookUrl, setDay2WebhookUrl] = useState(
    localStorage.getItem('egt_day2_webhook_url') || ''
  )
  const [isSyncing, setIsSyncing] = useState(null) // 'day1' | 'day2' | null
  const [syncStatus, setSyncStatus] = useState(null) // { day, success, message }
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  const handleSaveWebhookUrls = (d1Url, d2Url) => {
    setDay1WebhookUrl(d1Url)
    setDay2WebhookUrl(d2Url)
    localStorage.setItem('egt_day1_webhook_url', d1Url.trim())
    localStorage.setItem('egt_day2_webhook_url', d2Url.trim())
  }

  // Push Data to Google Sheet Webhook (Creates formatted table in Excel / Google Sheets)
  const handlePushToGoogleSheet = async (dayKey) => {
    const webhookUrl = dayKey === 'day1' ? day1WebhookUrl.trim() : day2WebhookUrl.trim()
    const dataToExport = dayKey === 'day1' ? day1Data : day2Data
    const dayName = dayKey === 'day1' ? 'Day 1 (The Stage)' : 'Day 2 (Tech Wizard Arena)'

    if (!webhookUrl) {
      alert(`Please enter the Google Apps Script Webhook URL for ${dayName} first!`)
      setShowSyncModal(true)
      return
    }

    if (!dataToExport || dataToExport.length === 0) {
      alert(`No registration data available to push for ${dayName}!`)
      return
    }

    setIsSyncing(dayKey)
    setSyncStatus(null)

    try {
      let headers = []
      let rows = []

      if (dayKey === 'day1') {
        const maxTeammates = Math.max(0, ...dataToExport.map(row => parseDay1TeamMembers(row).length))
        headers = [
          'Registration ID',
          'Timestamp',
          'Full Name (Solo / Lead)',
          'UID',
          'Email Address',
          'Phone No.',
          'Academic Year',
          'Department',
          'Section',
          'Group',
          'Block',
          'Performance Category',
          'Requires Audio Track',
          'Audio Track Link',
          'Entry Format',
          'Team Name'
        ]
        for (let i = 1; i <= maxTeammates; i++) {
          headers.push(
            `Teammate ${i} Name`,
            `Teammate ${i} UID`,
            `Teammate ${i} Section`,
            `Teammate ${i} Group`,
            `Teammate ${i} Block`
          )
        }

        rows = dataToExport.map(row => {
          const timestamp = new Date(row.created_at || Date.now()).toLocaleString()
          const parsed = parseDay1TeamMembers(row)
          const r = [
            row.reg_id || '',
            timestamp,
            row.full_name || '',
            row.uid || '',
            row.email || '',
            row.phone || '',
            row.academic_year || '',
            row.department || '',
            row.section || '',
            row.group_name || row.group || '',
            row.block || '',
            row.category || '',
            row.requires_audio_track || 'No',
            row.audio_track_url || '',
            row.entry_type || 'Solo',
            row.team_name || ''
          ]
          for (let i = 0; i < maxTeammates; i++) {
            const m = parsed[i] || {}
            r.push(m.fullName || '', m.uid || '', m.section || '', m.group || '', m.block || '')
          }
          return r
        })
      } else {
        // Day 2 Tech Arena
        headers = [
          'Registration ID',
          'Timestamp',
          'Squad Name',
          'Leader Name',
          'Leader UID',
          'Leader Email',
          'Leader Phone',
          'Department',
          'Academic Year',
          'Section',
          'Group',
          'Block',
          'Teammate 1 Name',
          'Teammate 1 UID',
          'Teammate 1 Section',
          'Teammate 1 Group',
          'Teammate 1 Block',
          'Teammate 2 Name',
          'Teammate 2 UID',
          'Teammate 2 Section',
          'Teammate 2 Group',
          'Teammate 2 Block',
          'Teammate 3 Name',
          'Teammate 3 UID',
          'Teammate 3 Section',
          'Teammate 3 Group',
          'Teammate 3 Block'
        ]

        rows = dataToExport.map(row => {
          const timestamp = new Date(row.created_at || Date.now()).toLocaleString()
          return [
            row.reg_id || '',
            timestamp,
            row.squad_name || '',
            row.leader_name || '',
            row.uid || '',
            row.email || '',
            row.phone || '',
            row.department || '',
            row.academic_year || '',
            row.section || '',
            row.group_name || '',
            row.block || '',
            row.teammate_1_name || '',
            row.teammate_1_uid || '',
            row.teammate_1_section || '',
            row.teammate_1_group || '',
            row.teammate_1_block || '',
            row.teammate_2_name || '',
            row.teammate_2_uid || '',
            row.teammate_2_section || '',
            row.teammate_2_group || '',
            row.teammate_2_block || '',
            row.teammate_3_name || '',
            row.teammate_3_uid || '',
            row.teammate_3_section || '',
            row.teammate_3_group || '',
            row.teammate_3_block || ''
          ]
        })
      }

      // Validate webhook URL before fetch — must be https:
      let validatedWebhook
      try {
        const parsedUrl = new URL(webhookUrl)
        if (parsedUrl.protocol !== 'https:') throw new Error('Non-HTTPS webhook URL')
        validatedWebhook = webhookUrl
      } catch {
        setSyncStatus({ day: dayKey, success: false, message: 'Invalid webhook URL. Must be a valid https:// Google Apps Script URL.' })
        setIsSyncing(null)
        return
      }

      // Send payload to Google Apps Script Webhook
      await fetch(validatedWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayKey,
          dayName,
          headers,
          rows
        })
      })

      setSyncStatus({
        day: dayKey,
        success: true,
        message: `Successfully pushed ${rows.length} ${dayName} records into your Google Sheet table!`
      })
    } catch (err) {
      console.error('Google Sheet Push Error:', err)
      setSyncStatus({
        day: dayKey,
        success: false,
        message: `Failed to push to Google Sheet: ${err.message || 'Network error'}`
      })
    } finally {
      setIsSyncing(null)
    }
  }

  // Google Apps Script Template for User Setup
  const appsScriptCode = `function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Clear old data and format table fresh
    sheet.clear();
    
    // 1. Append Header Row
    if (data.headers && data.headers.length > 0) {
      sheet.appendRow(data.headers);
      
      // Style Gold/Dark Header Row
      var headerRange = sheet.getRange(1, 1, 1, data.headers.length);
      headerRange.setBackground('#1a1711');
      headerRange.setFontColor('#f7d978');
      headerRange.setFontWeight('bold');
      headerRange.setFontFamily('Arial');
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }
    
    // 2. Append Participant Rows
    if (data.rows && data.rows.length > 0) {
      for (var i = 0; i < data.rows.length; i++) {
        sheet.appendRow(data.rows[i]);
      }
      
      var numRows = data.rows.length;
      var numCols = data.headers.length;
      var dataRange = sheet.getRange(2, 1, numRows, numCols);
      dataRange.setFontFamily('Arial');
      dataRange.setFontSize(10);
      
      // Zebra striping for table
      for (var r = 2; r <= numRows + 1; r++) {
        var rowRange = sheet.getRange(r, 1, 1, numCols);
        if (r % 2 === 0) {
          rowRange.setBackground('#f4f4f6');
        } else {
          rowRange.setBackground('#ffffff');
        }
      }
    }
    
    // 3. Auto-fit all columns
    for (var col = 1; col <= (data.headers ? data.headers.length : 15); col++) {
      sheet.autoResizeColumn(col);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      rowsCount: data.rows ? data.rows.length : 0
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`

  const copyAppsScript = () => {
    navigator.clipboard.writeText(appsScriptCode)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 3000)
  }

  // Check active Supabase session on mount
  useEffect(() => {
    async function checkSession() {
      const session = await getAdminSession()
      if (session) {
        setIsAuthenticated(true)
      }
    }
    checkSession()
  }, [])

  // Load Data
  const loadAllData = async () => {
    setLoading(true)
    const d1 = await getDay1Registrations()
    const d2 = await getDay2Registrations()
    setDay1Data(d1)
    setDay2Data(d2)
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated])

  // Admin Auth Handler — with brute-force lockout after 5 failed attempts
  const handleSupabaseLogin = async (e) => {
    e.preventDefault()

    // Check lockout
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000)
      setAuthError(`Too many failed attempts. Please wait ${minutesLeft} minute(s) before trying again.`)
      return
    }

    setIsAuthenticating(true)
    setAuthError('')

    const res = await signInAdmin(email, password)
    setIsAuthenticating(false)

    if (res.success) {
      setIsAuthenticated(true)
      setAuthError('')
      setLoginAttempts(0)
      setLockoutUntil(null)
    } else {
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      if (newAttempts >= 5) {
        // Lock out for 15 minutes after 5 failed attempts
        setLockoutUntil(Date.now() + 15 * 60 * 1000)
        setAuthError('Too many failed attempts. Admin login is locked for 15 minutes.')
      } else {
        // Generic message — does not reveal whether account exists
        setAuthError(`Invalid credentials. ${5 - newAttempts} attempt(s) remaining before lockout.`)
      }
    }
  }

  const handleLogout = async () => {
    await signOutAdmin()
    setIsAuthenticated(false)
  }

  const handleStatusChange = async (table, regId, newStatus) => {
    await updateRegistrationStatus(table, regId, newStatus)
    loadAllData()
  }

  const handleDelete = async (table, regId) => {
    if (window.confirm('Are you sure you want to delete this registration entry?')) {
      await deleteRegistration(table, regId)
      loadAllData()
      if (selectedItem?.reg_id === regId) {
        setSelectedItem(null)
      }
    }
  }

  // Export to CSV Functionality (Formats perfectly into Google Sheets / Excel Table)
  const exportToCSV = () => {
    const dataToExport = activeTab === 'day1' ? day1Data : day2Data
    if (!dataToExport || dataToExport.length === 0) {
      alert('No data available to export!')
      return
    }

    const cleanField = (val) => {
      if (val === null || val === undefined) return '""'
      const str = String(val).replace(/"/g, '""')
      return `"${str}"`
    }

    let rows = []

    if (activeTab === 'day1') {
      // Dynamically calculate maximum teammates present across teams in current dataset
      const maxTeammatesInDataset = Math.max(
        0,
        ...dataToExport.map(row => parseDay1TeamMembers(row).length)
      )

      const day1Headers = [
        'Timestamp',
        'Email Address',
        'Full Name (Leader / Solo)',
        'UID',
        'Phone No.',
        'Year',
        'Department',
        'Section',
        'Group',
        'Block',
        'Performance Category',
        'Requires Audio Track',
        'Audio Track Link',
        'Entry Format',
        'Team Name'
      ]

      for (let i = 1; i <= maxTeammatesInDataset; i++) {
        day1Headers.push(
          `Teammate ${i} Name`,
          `Teammate ${i} UID`,
          `Teammate ${i} Section`,
          `Teammate ${i} Group`,
          `Teammate ${i} Block`
        )
      }
      day1Headers.push('Registration ID')
      rows.push(day1Headers.map(cleanField).join(','))

      dataToExport.forEach(row => {
        const timestamp = new Date(row.created_at || Date.now()).toLocaleString()
        const parsedMembers = parseDay1TeamMembers(row)

        const rowCells = [
          timestamp,
          row.email,
          row.full_name,
          row.uid,
          row.phone,
          row.academic_year,
          row.department,
          row.section || '',
          row.group_name || row.group || '',
          row.block || '',
          row.category,
          row.requires_audio_track || 'No',
          row.audio_track_url || '',
          row.entry_type || 'Solo',
          row.team_name || ''
        ]

        for (let i = 0; i < maxTeammatesInDataset; i++) {
          const m = parsedMembers[i] || {}
          rowCells.push(
            m.fullName || '',
            m.uid || '',
            m.section || '',
            m.group || '',
            m.block || ''
          )
        }

        rowCells.push(row.reg_id)
        rows.push(rowCells.map(cleanField).join(','))
      })
    } else {
      // Day 2 Tech Squads layout
      rows.push([
        'Timestamp',
        'Email Address',
        'Leader Name',
        'Leader UID',
        'Phone No.',
        'Year',
        'Department',
        'Leader Section',
        'Leader Group',
        'Leader Block',
        'Squad Name',
        'Teammate 1 Name',
        'Teammate 1 UID',
        'Teammate 1 Section',
        'Teammate 1 Group',
        'Teammate 1 Block',
        'Teammate 2 Name',
        'Teammate 2 UID',
        'Teammate 2 Section',
        'Teammate 2 Group',
        'Teammate 2 Block',
        'Teammate 3 Name',
        'Teammate 3 UID',
        'Teammate 3 Section',
        'Teammate 3 Group',
        'Teammate 3 Block',
        'Registration ID'
      ].map(cleanField).join(','))

      dataToExport.forEach(row => {
        const timestamp = new Date(row.created_at || Date.now()).toLocaleString()
        
        // Parse teammate 1 name & UID
        const t1Name = row.teammate_1_name || (row.teammate_1 ? row.teammate_1.split('(')[0].trim() : '')
        const t1Uid = row.teammate_1_uid || (row.teammate_1 && row.teammate_1.includes('(') ? row.teammate_1.split('(')[1].split(')')[0].trim() : '')

        // Parse teammate 2 name & UID
        const t2Name = row.teammate_2_name || (row.teammate_2 ? row.teammate_2.split('(')[0].trim() : '')
        const t2Uid = row.teammate_2_uid || (row.teammate_2 && row.teammate_2.includes('(') ? row.teammate_2.split('(')[1].split(')')[0].trim() : '')

        // Parse teammate 3 name & UID
        const t3Name = row.teammate_3_name || (row.teammate_3 ? row.teammate_3.split('(')[0].trim() : '')
        const t3Uid = row.teammate_3_uid || (row.teammate_3 && row.teammate_3.includes('(') ? row.teammate_3.split('(')[1].split(')')[0].trim() : '')

        rows.push([
          timestamp,
          row.email,
          row.leader_name,
          row.uid,
          row.phone,
          row.academic_year,
          row.department,
          row.section || '',
          row.group_name || row.group || '',
          row.block || '',
          row.squad_name,
          t1Name,
          t1Uid,
          row.teammate_1_section || '',
          row.teammate_1_group || '',
          row.teammate_1_block || '',
          t2Name,
          t2Uid,
          row.teammate_2_section || '',
          row.teammate_2_group || '',
          row.teammate_2_block || '',
          t3Name,
          t3Uid,
          row.teammate_3_section || '',
          row.teammate_3_group || '',
          row.teammate_3_block || '',
          row.reg_id
        ].map(cleanField).join(','))
      })
    }

    // Include UTF-8 BOM (\uFEFF) so Excel & Google Sheets format columns automatically
    const csvString = '\uFEFF' + rows.join('\r\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const filename = `EGT2_${activeTab === 'day1' ? 'Day1_Performers' : 'Day2_TechSquads'}_Form_Responses.csv`
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // SUPABASE AUTH LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] text-white flex items-center justify-center pt-28 pb-16 px-4">
        <div className="w-full max-w-md bg-[#09090d] border border-[#f7d978]/30 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[#f7d978]/10 border border-[#f7d978]/40 flex items-center justify-center mx-auto text-[#f7d978]">
              <KeyRound className="w-8 h-8" />
            </div>

            <h1 className="font-['Syne'] text-2xl font-extrabold text-white">
              Admin Portal Login
            </h1>
            <p className="font-sans text-xs text-gray-400">
              Department of CSE – Takshashila • Administrator Portal
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-['Space_Grotesk'] text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <Database className="w-4 h-4" />
                <span>Database Connection Required</span>
              </div>
              <p className="text-gray-300 font-sans text-[11px] leading-relaxed">
                Add <code className="text-[#f7d978]">VITE_SUPABASE_URL</code> &amp; <code className="text-[#f7d978]">VITE_SUPABASE_ANON_KEY</code> to your environment file!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSupabaseLogin} className="space-y-4">

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@takshashila.cumail.in"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d978]"
                />
              </div>

              <div>
                <label className="block font-['Space_Grotesk'] text-xs font-semibold text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d978]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#f7d978] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-['Space_Grotesk'] space-y-1">
                  <div className="font-bold text-rose-400">Authentication Error</div>
                  <p className="text-[11px] leading-relaxed">{authError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full btn-primary-gold py-3.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                {isAuthenticating ? 'Authenticating...' : 'Log In to Admin Portal'}
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-white/10 text-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto font-['Space_Grotesk']"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Website</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Filter Logic (Authenticated only)
  const currentDataset = Array.isArray(activeTab === 'day1' ? day1Data : day2Data)
    ? (activeTab === 'day1' ? day1Data : day2Data)
    : []

  const filteredDataset = currentDataset.filter(item => {
    if (!item) return false
    try {
      const searchString = JSON.stringify(item).toLowerCase()
      const matchesSearch = searchString.includes((searchTerm || '').toLowerCase())
      const matchesStatus = statusFilter === 'all' || (item.status && String(item.status).toLowerCase() === statusFilter.toLowerCase())
      return matchesSearch && matchesStatus
    } catch (err) {
      return true
    }
  })

  return (
    <div className="min-h-screen bg-[#070709] text-[#f1f1f6] pt-24 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#f7d978]" />
            <h1 className="font-['Syne'] text-3xl font-extrabold text-white">
              Admin Registration Portal
            </h1>
          </div>
          <p className="font-sans text-xs text-gray-400 mt-1">
            Department of CSE – Takshashila • Organizer Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-['Space_Grotesk'] font-bold">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-[#f7d978] text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              onClick={() => setViewMode('sheets')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'sheets' ? 'bg-emerald-400 text-black shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Google Sheets View</span>
            </button>
          </div>

          <button
            onClick={loadAllData}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {googleSheetUrl ? (
            <a
              href={googleSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-['Space_Grotesk'] font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Sheets</span>
            </a>
          ) : (
            <button
              onClick={exportToCSV}
              className="btn-primary-gold text-xs px-4 py-2 flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="btn-secondary-glass text-xs py-2 px-4"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-gray-400 uppercase">
              Total Registrations
            </span>
            <Users className="w-5 h-5 text-[#f7d978]" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2">
            {day1Data.length + day2Data.length}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-rose-400 uppercase">
              Day 1 Performers
            </span>
            <Mic className="w-5 h-5 text-rose-400" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2">
            {day1Data.length}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-400/30">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-cyan-400 uppercase">
              Day 2 Tech Wizards
            </span>
            <Code className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2">
            {day2Data.length}
          </p>
        </div>
      </div>

      {/* Registration Open / Full Toggle Panel */}
      <div className="glass-panel p-5 rounded-3xl border border-amber-500/30 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-950/20 via-black to-rose-950/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Power className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-['Syne'] text-base font-bold text-white flex items-center gap-2">
              <span>Registration Controls (Website Live Status)</span>
            </h3>
            <p className="font-sans text-xs text-gray-400">
              Toggle registration availability live on the public website when capacity is reached.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Day 1 Toggle */}
          <button
            onClick={() => handleToggleRegistration('day1Closed')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-2xl border text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              regSettings.day1Closed
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/50'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
            }`}
          >
            {regSettings.day1Closed ? (
              <>
                <ToggleLeft className="w-4 h-4 text-rose-400" />
                <span>Day 1: FULL / CLOSED</span>
              </>
            ) : (
              <>
                <ToggleRight className="w-4 h-4 text-emerald-400" />
                <span>Day 1: OPEN</span>
              </>
            )}
          </button>

          {/* Day 2 Toggle */}
          <button
            onClick={() => handleToggleRegistration('day2Closed')}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-2xl border text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              regSettings.day2Closed
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/50'
                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-950/50'
            }`}
          >
            {regSettings.day2Closed ? (
              <>
                <ToggleLeft className="w-4 h-4 text-rose-400" />
                <span>Day 2: FULL / CLOSED</span>
              </>
            ) : (
              <>
                <ToggleRight className="w-4 h-4 text-cyan-400" />
                <span>Day 2: OPEN</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Google Sheets Direct Cloud Sync Panel */}
      <div className="glass-panel p-5 rounded-3xl border border-emerald-500/30 mb-8 bg-gradient-to-r from-emerald-950/20 via-black to-cyan-950/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-['Syne'] text-base font-bold text-white flex items-center gap-2">
                <span>Google Sheets Live Cloud Sync</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-wider">
                  Excel Table Format
                </span>
              </h3>
              <p className="font-sans text-xs text-gray-400">
                Bulk push all participant records into formatted Google Sheets with styled headers, zebra striping &amp; auto-width columns.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Push Day 1 Button */}
            <button
              onClick={() => handlePushToGoogleSheet('day1')}
              disabled={isSyncing === 'day1'}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              title="Push all Day 1 entries into Day 1 Google Sheet"
            >
              {isSyncing === 'day1' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
                  <span>Syncing Day 1...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-rose-400" />
                  <span>Push Day 1 ({day1Data.length})</span>
                </>
              )}
            </button>

            {/* Push Day 2 Button */}
            <button
              onClick={() => handlePushToGoogleSheet('day2')}
              disabled={isSyncing === 'day2'}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              title="Push all Day 2 entries into Day 2 Google Sheet"
            >
              {isSyncing === 'day2' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Syncing Day 2...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 text-cyan-400" />
                  <span>Push Day 2 ({day2Data.length})</span>
                </>
              )}
            </button>

            {/* Settings & Setup Modal Trigger */}
            <button
              onClick={() => setShowSyncModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-300 hover:text-white text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Configure Webhook URLs & View Apps Script Code"
            >
              <Settings className="w-4 h-4 text-[#f7d978]" />
              <span className="hidden sm:inline">Sheet Settings</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className={`mt-4 p-3.5 rounded-2xl border text-xs font-['Space_Grotesk'] flex items-center justify-between gap-3 animate-in fade-in duration-300 ${
            syncStatus.success
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              {syncStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{syncStatus.message}</span>
            </div>
            <button
              onClick={() => setSyncStatus(null)}
              className="text-gray-400 hover:text-white text-xs font-bold px-2 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Controls: Tabs, Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        
        {/* Tab Buttons */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 font-['Space_Grotesk'] text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('day1')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'day1' ? 'bg-[#f7d978] text-black shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Day 1 Performers ({day1Data.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('day2')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'day2' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Day 2 Tech Squads ({day2Data.length})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Name, UID, Email..."
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d978]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#12121c] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="waitlist">Waitlist</option>
          </select>
        </div>
      </div>

      {/* Main Roster Content (Table or Google Sheets View) */}
      {viewMode === 'sheets' ? (
        /* GOOGLE SHEETS INTERFACE VIEW (Matches User Photo) */
        <div className="bg-[#181824] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden font-sans text-xs">
          
          {/* Top Google Sheets Menu & Action Bar */}
          <div className="bg-[#212130] border-b border-gray-700 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-gray-300">
            <div className="flex items-center gap-3">
              {/* Tab Badge matching user photo */}
              <div className="flex items-center gap-1.5 bg-[#4c3575] text-white px-3 py-1 rounded-md text-xs font-bold shadow">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Form_Responses</span>
              </div>
              <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>View only</span>
              </span>
              <span className="text-gray-400 text-xs hidden sm:inline">
                {activeTab === 'day1' ? 'Day 1 Stage Performers Sheet' : 'Day 2 Technical Squads Sheet'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={exportToCSV}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download (.csv)</span>
              </button>
            </div>
          </div>

          {/* Formula Bar & Cell Reference */}
          <div className="bg-[#1e1e2d] border-b border-gray-700 px-4 py-1.5 flex items-center gap-3 font-mono text-[11px] text-gray-400">
            <div className="bg-black/30 border border-gray-700 px-3 py-0.5 rounded text-gray-300 w-16 text-center font-bold">
              A1
            </div>
            <div className="text-gray-500 font-serif italic">fx</div>
            <div className="text-gray-200 truncate flex-1">
              Timestamp &bull; Live Supabase Synchronization Active
            </div>
          </div>

          {/* Google Sheets Grid Table */}
          <div className="overflow-x-auto max-h-[650px] overflow-y-auto">
            <table className="w-full border-collapse text-left font-sans text-xs">
              {/* Alphabetical Column Header Row (A, B, C, D, E...) */}
              <thead className="bg-[#29293d] sticky top-0 z-10 text-gray-400 text-[11px] font-mono">
                <tr>
                  <th className="w-12 py-1 px-2 text-center border border-gray-700 bg-[#212130]"></th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">A</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">B</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">C</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">D</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">E</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">F</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">G</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">H</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">I</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">J</th>
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">K</th>
                </tr>

                {/* Purple Table Column Header Row (Matching Day 1 vs Day 2 Layout) */}
                <tr className="bg-[#4a3073] text-white font-bold text-xs">
                  <td className="py-2 px-2 text-center border border-gray-700 bg-[#322350] text-gray-300 font-mono text-[10px]">1</td>
                  <td className="py-2 px-3 border border-gray-700">Timestamp</td>
                  <td className="py-2 px-3 border border-gray-700">Reg ID</td>
                  <td className="py-2 px-3 border border-gray-700">{activeTab === 'day1' ? 'Performer Name' : 'Squad Leader'}</td>
                  <td className="py-2 px-3 border border-gray-700">Student UID</td>
                  <td className="py-2 px-3 border border-gray-700">Email Address</td>
                  <td className="py-2 px-3 border border-gray-700">Phone No.</td>
                  <td className="py-2 px-3 border border-gray-700">Department / Sec / Grp / Blk</td>
                  <td className="py-2 px-3 border border-gray-700">{activeTab === 'day1' ? 'Performance Category' : 'Squad Name'}</td>
                  <td className="py-2 px-3 border border-gray-700">{activeTab === 'day1' ? 'Audio Track' : 'Teammate 1'}</td>
                  <td className="py-2 px-3 border border-gray-700">{activeTab === 'day1' ? 'Previous Work' : 'Teammate 2'}</td>
                </tr>
              </thead>

              <tbody className="bg-[#181824] text-gray-200 divide-y divide-gray-800">
                {filteredDataset.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-10 text-gray-500 italic border border-gray-800">
                      No records found in {activeTab === 'day1' ? 'Day 1 Performers' : 'Day 2 Technical Squads'} sheet.
                    </td>
                  </tr>
                ) : (
                  filteredDataset.map((row, idx) => (
                    <tr key={row.reg_id} className="hover:bg-emerald-950/20 transition-colors">
                      {/* Row Index (2, 3, 4...) */}
                      <td className="py-2 px-2 text-center border border-gray-800 bg-[#212130] text-gray-400 font-mono text-[11px]">
                        {idx + 2}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(row.created_at || Date.now()).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 font-mono text-emerald-400 font-semibold whitespace-nowrap">
                        {row.reg_id}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 font-semibold text-white whitespace-nowrap">
                        {row.full_name || row.leader_name}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 font-mono text-gray-300 whitespace-nowrap">
                        {row.uid}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {row.email}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 font-mono text-gray-300 whitespace-nowrap">
                        {row.phone}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap text-[11px]">
                        {row.department} &bull; {row.academic_year} [{row.section || '-'}, {row.group_name || row.group || '-'}, {row.block || '-'}]
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {activeTab === 'day1' ? row.category : row.squad_name}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {activeTab === 'day1' ? (
                          row.audio_track_url ? (
                            <a
                              href={safeHref(row.audio_track_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Music className="w-3 h-3 text-rose-400" />
                              <span>Open Track</span>
                              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </a>
                          ) : (
                            <span className="text-gray-500 text-[11px] italic">No Track Required</span>
                          )
                        ) : (
                          row.teammate_1 || 'N/A'
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {activeTab === 'day1' ? (
                          row.previous_performance_link ? (
                            <a
                              href={safeHref(row.previous_performance_link)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 underline font-mono text-[11px] hover:text-cyan-300"
                            >
                              View Link
                            </a>
                          ) : (
                            <span className="text-gray-500 text-[11px]">None</span>
                          )
                        ) : (
                          row.teammate_2 || 'N/A'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Main Roster Table */
        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-['Space_Grotesk'] text-xs">
            <thead className="bg-white/5 border-b border-white/10 uppercase text-gray-400 text-[11px] tracking-wider">
              <tr>
                <th className="py-4 px-6">Reg ID</th>
                <th className="py-4 px-6">Participant / Leader</th>
                <th className="py-4 px-6">UID</th>
                <th className="py-4 px-6">{activeTab === 'day1' ? 'Category' : 'Squad Name'}</th>
                <th className="py-4 px-6">{activeTab === 'day1' ? 'Format' : 'Squad Size'}</th>
                <th className="py-4 px-6">Contact</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {filteredDataset.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-400 text-sm font-light">
                    No registrations found in Supabase database.
                  </td>
                </tr>
              ) : (
                filteredDataset.map((row) => (
                  <tr key={row.reg_id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#f7d978] font-bold">
                      {row.reg_id}
                    </td>

                    <td className="py-4 px-6 font-bold text-white">
                      {row.full_name || row.leader_name}
                      <span className="block text-[11px] font-normal text-gray-400">
                        {row.department} • {row.academic_year}
                      </span>
                    </td>

                    <td className="py-4 px-6 font-mono text-gray-300">
                      {row.uid}
                    </td>

                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-white/10 text-gray-200 text-[11px]">
                        {row.category || row.squad_name || 'N/A'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-300">
                      {activeTab === 'day1' ? (row.entry_type || 'Solo') : ((row.teammate_3 || row.teammate_3_name) ? '4 Members' : '3 Members')}
                    </td>

                    <td className="py-4 px-6 text-gray-300 text-[11px]">
                      <div>{row.phone}</div>
                      <div className="text-gray-500">{row.email}</div>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => setSelectedItem(row)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(
                          activeTab === 'day1' ? 'day1_registrations' : 'day2_registrations',
                          row.reg_id
                        )}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* FULL DETAILS MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl bg-[#09090d] border border-[#f7d978]/40 rounded-3xl p-6 sm:p-8 text-[#f1f1f6] shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f7d978]/10 border border-[#f7d978]/40 flex items-center justify-center text-[#f7d978]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-['Syne'] text-xl font-bold text-white">
                  Registration Details
                </h3>
                <p className="font-mono text-xs text-[#f7d978]">ID: {selectedItem.reg_id}</p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 font-['Space_Grotesk'] text-xs max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 border-b border-white/10 pb-4">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Name</span>
                  <span className="font-bold text-white text-sm">{selectedItem.full_name || selectedItem.leader_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Student UID</span>
                  <span className="font-mono font-bold text-[#f7d978] text-sm">{selectedItem.uid}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Department / Year</span>
                  <span className="text-gray-200">{selectedItem.department} &bull; {selectedItem.academic_year}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Sec / Group / Block</span>
                  <span className="text-gray-200">{selectedItem.section || '-'}, {selectedItem.group_name || selectedItem.group || '-'}, {selectedItem.block || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Phone / WhatsApp</span>
                  <span className="text-gray-200 font-mono">{selectedItem.phone}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Email Address</span>
                  <span className="text-gray-200">{selectedItem.email}</span>
                </div>
              </div>

              {selectedItem.audio_track_url && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                  <span className="font-bold text-rose-300">Performance Audio Track:</span>
                  <a
                    href={safeHref(selectedItem.audio_track_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Open / Download Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Day 1 Team Members Roster */}
              {activeTab === 'day1' && parseDay1TeamMembers(selectedItem).length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-[#f7d978] uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Team Members Roster ({parseDay1TeamMembers(selectedItem).length + 1} Total)</span>
                  </div>

                  <div className="space-y-2">
                    {parseDay1TeamMembers(selectedItem).map((member, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>{idx + 1}. {member.fullName}</span>
                          <span className="font-mono text-xs text-[#f7d978]">{member.uid}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-3 font-mono">
                          <span>Section: <strong className="text-gray-200">{member.section || 'N/A'}</strong></span>
                          <span>Group: <strong className="text-gray-200">{member.group || 'N/A'}</strong></span>
                          <span>Block: <strong className="text-gray-200">{member.block || 'N/A'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day 2 Squad Teammates Roster */}
              {activeTab === 'day2' && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Squad Teammates ({selectedItem.squad_name})</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: selectedItem.teammate_1_name || selectedItem.teammate_1, uid: selectedItem.teammate_1_uid, sec: selectedItem.teammate_1_section, grp: selectedItem.teammate_1_group, blk: selectedItem.teammate_1_block },
                      { name: selectedItem.teammate_2_name || selectedItem.teammate_2, uid: selectedItem.teammate_2_uid, sec: selectedItem.teammate_2_section, grp: selectedItem.teammate_2_group, blk: selectedItem.teammate_2_block },
                      { name: selectedItem.teammate_3_name || selectedItem.teammate_3, uid: selectedItem.teammate_3_uid, sec: selectedItem.teammate_3_section, grp: selectedItem.teammate_3_group, blk: selectedItem.teammate_3_block }
                    ].filter(t => t.name).map((t, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white">
                          <span>Teammate {idx + 1}: {t.name}</span>
                          <span className="font-mono text-xs text-cyan-300">{t.uid || '-'}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-3 font-mono">
                          <span>Section: <strong className="text-gray-200">{t.sec || '-'}</strong></span>
                          <span>Group: <strong className="text-gray-200">{t.grp || '-'}</strong></span>
                          <span>Block: <strong className="text-gray-200">{t.blk || '-'}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDelete(
                  activeTab === 'day1' ? 'day1_registrations' : 'day2_registrations',
                  selectedItem.reg_id
                )}
                className="flex-1 py-3 px-4 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Registration</span>
              </button>

              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 btn-primary-gold text-xs py-3 rounded-full"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Google Sheets Sync & Apps Script Configuration Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-['Syne'] text-lg sm:text-xl font-bold text-white">
                    Google Sheets Cloud Sync Configuration
                  </h2>
                  <p className="font-sans text-xs text-gray-400">
                    Setup separate Google Sheet Webhooks for Day 1 and Day 2 participant data.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Webhook URLs Form */}
            <div className="space-y-4 font-['Space_Grotesk']">
              <div>
                <label className="block text-xs font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5" />
                  <span>Day 1 (The Stage) Google Apps Script Webhook URL</span>
                </label>
                <input
                  type="url"
                  value={day1WebhookUrl}
                  onChange={(e) => handleSaveWebhookUrls(e.target.value, day2WebhookUrl)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Day 2 (Tech Wizard Arena) Google Apps Script Webhook URL</span>
                </label>
                <input
                  type="url"
                  value={day2WebhookUrl}
                  onChange={(e) => handleSaveWebhookUrls(day1WebhookUrl, e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            {/* Quick 3-Step Setup Guide */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 font-sans text-xs">
              <div className="font-['Space_Grotesk'] font-bold text-[#f7d978] text-sm flex items-center justify-between">
                <span>⚡ How to set up in 30 Seconds:</span>
                <button
                  onClick={copyAppsScript}
                  className="px-3 py-1 rounded-lg bg-[#f7d978]/20 hover:bg-[#f7d978]/30 text-[#f7d978] border border-[#f7d978]/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Code Copied!' : 'Copy Apps Script Code'}</span>
                </button>
              </div>

              <ol className="list-decimal list-inside space-y-1.5 text-gray-300 leading-relaxed font-normal">
                <li>Create or open your Google Sheet for <strong>Day 1</strong> or <strong>Day 2</strong>.</li>
                <li>Click <strong>Extensions</strong> → <strong>Apps Script</strong>, delete existing code, and paste the copied script.</li>
                <li>Click <strong>Deploy</strong> → <strong>New deployment</strong> → Select type: <strong>Web app</strong>.</li>
                <li>Set <em>Execute as</em>: <strong>Me</strong> and <em>Who has access</em>: <strong>Anyone</strong>.</li>
                <li>Click <strong>Deploy</strong>, copy the generated Web app URL, and paste it in the fields above!</li>
              </ol>

              <div className="mt-2 text-[11px] text-gray-400 bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono">
                ✨ When you click "Push Data", it will automatically create gold/cyan styled headers, freeze the top row, apply zebra striping, and auto-fit column widths!
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleSaveWebhookUrls(day1WebhookUrl, day2WebhookUrl)
                  setShowSyncModal(false)
                }}
                className="w-full btn-primary-gold text-xs py-3 rounded-full font-bold uppercase tracking-wider cursor-pointer"
              >
                Save Webhook Settings &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
