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
  Settings,
  Music,
  MessageSquare,
  PhoneCall,
  Mail,
  Phone,
  BarChart3,
  PieChart,
  Layers,
  Sparkles
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
  fetchRegistrationSettings,
  updateRegistrationSettings,
  updateRegistrationStatus,
  getContactMessages,
  deleteContactMessage
} from '../supabaseClient'

export function parseDay1TeamMembers(row) {
  if (!row) return []

  const normalizeMember = (item) => {
    if (!item) return null
    if (typeof item === 'string') {
      const nameMatch = item.match(/(?:\d+\.\s*)?([^(]+)\s*\(([^)]+)\)/)
      const secMatch = item.match(/\[Sec:\s*([^,\]]+)/i)
      const grpMatch = item.match(/Sec:[^,]+,\s*([^,\]]+)/i) || item.match(/,\s*(Group\s+[AB]|[^,\]]+),\s*Blk:/i)
      const blkMatch = item.match(/Blk:\s*([^\]]+)/i)
      return {
        fullName: nameMatch ? nameMatch[1].trim() : item.trim(),
        uid: nameMatch ? nameMatch[2].trim() : '',
        section: secMatch ? secMatch[1].trim() : '',
        group: grpMatch ? grpMatch[1].trim() : '',
        block: blkMatch ? blkMatch[1].trim() : ''
      }
    }
    if (typeof item === 'object') {
      return {
        fullName: String(item.fullName || item.name || item.full_name || '').trim(),
        uid: String(item.uid || item.student_uid || '').trim(),
        section: String(item.section || '').trim(),
        group: String(item.group || item.group_name || '').trim(),
        block: String(item.block || '').trim()
      }
    }
    return null
  }

  if (Array.isArray(row.teamMembersList) && row.teamMembersList.length > 0) {
    return row.teamMembersList.map(normalizeMember).filter(m => m && (m.fullName || m.uid))
  }

  if (row.team_members_raw) {
    try {
      const parsed = typeof row.team_members_raw === 'string' ? JSON.parse(row.team_members_raw) : row.team_members_raw
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeMember).filter(m => m && (m.fullName || m.uid))
      }
    } catch (e) {}
  }

  const rawStr = row.team_members || ''
  if (!rawStr) return []

  const parts = typeof rawStr === 'string' ? rawStr.split(/\s*\|\s*/) : []
  return parts.map(normalizeMember).filter(m => m && (m.fullName || m.uid))
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

// Category Name Normalizer for accurate genre aggregation
export function normalizeCategoryName(rawCat = '') {
  const str = String(rawCat || '').trim()
  if (!str) return 'Other Creative Talent'
  const lower = str.toLowerCase()
  if (lower.includes('vocal') || lower.includes('sing') || lower.includes('jamming') || lower.includes('acoustic')) {
    return 'Vocals & Jamming'
  }
  if (lower.includes('dance') || lower.includes('choreo')) {
    return 'Dance & Choreography'
  }
  if (lower.includes('model') || lower.includes('ramp') || lower.includes('fashion')) {
    return 'Modeling'
  }
  if (lower.includes('comedy') || lower.includes('stand-up') || lower.includes('standup')) {
    return 'Stand-up Comedy'
  }
  if (lower.includes('beatbox') || lower.includes('rap') || lower.includes('hip-hop') || lower.includes('hip hop')) {
    return 'Beatboxing & Rap'
  }
  if (lower.includes('mono') || lower.includes('drama') || lower.includes('skit') || lower.includes('theatre') || lower.includes('acting')) {
    return 'Mono-Acts & Drama'
  }
  if (lower.includes('magic') || lower.includes('illusion') || lower.includes('mentalism')) {
    return 'Magic & Illusions'
  }
  if (lower.includes('instrumental') || lower.includes('guitar') || lower.includes('keyboard') || lower.includes('piano') || lower.includes('flute') || lower.includes('violin') || lower.includes('drums')) {
    return 'Instrumental Performance'
  }
  if (lower.includes('poetry') || lower.includes('spoken') || lower.includes('shayari') || lower.includes('kavita')) {
    return 'Poetry & Spoken Word'
  }
  if (lower.includes('other') || lower.includes('creative') || lower.includes('talent')) {
    return str.length > 20 ? str : 'Other Creative Talent'
  }
  return str
}

// Comprehensive Category & Student Breakdown Analytics Calculator
export function calculateCategoryAnalytics(day1Data = [], day2Data = []) {
  const categoryMap = {}
  let totalDay1Students = 0
  const totalDay1Acts = Array.isArray(day1Data) ? day1Data.length : 0

  if (Array.isArray(day1Data)) {
    day1Data.forEach((row) => {
      if (!row) return
      const canonicalName = normalizeCategoryName(row.category)
      const members = parseDay1TeamMembers(row)
      const isTeam =
        (row.entry_type || '').toLowerCase() === 'team' ||
        Boolean(row.team_name && row.team_name.trim().length > 0) ||
        members.length > 0
      const studentCount = isTeam ? 1 + members.length : 1

      totalDay1Students += studentCount

      if (!categoryMap[canonicalName]) {
        categoryMap[canonicalName] = {
          name: canonicalName,
          actsCount: 0,
          totalStudents: 0,
          soloCount: 0,
          teamCount: 0,
          rawCategories: new Set()
        }
      }

      categoryMap[canonicalName].actsCount += 1
      categoryMap[canonicalName].totalStudents += studentCount
      categoryMap[canonicalName].rawCategories.add((row.category || '').trim())
      if (isTeam) {
        categoryMap[canonicalName].teamCount += 1
      } else {
        categoryMap[canonicalName].soloCount += 1
      }
    })
  }

  const day1Categories = Object.values(categoryMap)
    .map(c => ({
      ...c,
      rawCategories: Array.from(c.rawCategories)
    }))
    .sort((a, b) => b.actsCount - a.actsCount || b.totalStudents - a.totalStudents)

  const totalDay2Squads = Array.isArray(day2Data) ? day2Data.length : 0
  let day2_3MemberSquads = 0
  let day2_4MemberSquads = 0
  let totalDay2Students = 0

  if (Array.isArray(day2Data)) {
    day2Data.forEach((row) => {
      if (!row) return
      const is4Member = Boolean(row.teammate_3 || row.teammate_3_name)
      if (is4Member) {
        day2_4MemberSquads += 1
        totalDay2Students += 4
      } else {
        day2_3MemberSquads += 1
        totalDay2Students += 3
      }
    })
  }

  return {
    totalActiveCategories: day1Categories.length + (totalDay2Squads > 0 ? 1 : 0),
    totalDay1CategoriesCount: day1Categories.length,
    totalDay1Acts,
    totalDay1Students,
    day1Categories,
    totalDay2Squads,
    totalDay2Students,
    day2_3MemberSquads,
    day2_4MemberSquads,
    grandTotalRegistrations: totalDay1Acts + totalDay2Squads,
    grandTotalStudents: totalDay1Students + totalDay2Students
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
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(null) // 'day1Closed' | 'day2Closed' | null

  const handleToggleRegistration = async (dayKey) => {
    setIsUpdatingSettings(dayKey)
    try {
      const updated = await updateRegistrationSettings({
        [dayKey]: !regSettings[dayKey]
      })
      setRegSettings(updated)
    } catch (err) {
      console.error('Failed to update registration settings:', err)
    } finally {
      setIsUpdatingSettings(null)
    }
  }

  // Data & Tabs State
  const [activeTab, setActiveTab] = useState('day1') // 'day1' | 'day2' | 'inquiries' | 'analytics'
  const [day1Data, setDay1Data] = useState([])
  const [day2Data, setDay2Data] = useState([])
  const [contactMessages, setContactMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters, Search & View Mode
  const [viewMode, setViewMode] = useState('table') // 'table' | 'sheets'
  const [googleSheetUrl, setGoogleSheetUrl] = useState(import.meta.env.VITE_GOOGLE_SHEET_URL || '')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)

  // Live Category & Student Analytics
  const analytics = calculateCategoryAnalytics(day1Data, day2Data)

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

      let categorySheets = {}

      if (dayKey === 'day1') {
        const maxTeammates = Math.max(0, ...dataToExport.map(row => parseDay1TeamMembers(row).length))
        headers = [
          'Token No.',
          'Registration ID',
          'Attendance',
          'Full Name (Solo / Lead)',
          'UID',
          'Academic Year',
          'Department',
          'Section',
          'Group',
          'Block',
          'Performance Category',
          'Entry Format',
          'Team Name',
          'Requires Audio Track',
          'Audio Track Link'
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

        rows = dataToExport.map((row, idx) => {
          const tokenNo = `T-${String(idx + 1).padStart(3, '0')}`
          const parsed = parseDay1TeamMembers(row)
          const r = [
            tokenNo,
            row.reg_id || '',
            '', // Attendance (blank with dropdown for registration desk)
            row.full_name || '',
            row.uid || '',
            row.academic_year || '',
            row.department || '',
            row.section || '',
            row.group_name || row.group || '',
            row.block || '',
            row.category || '',
            row.entry_type || 'Solo',
            row.team_name || '',
            row.requires_audio_track || 'No',
            row.audio_track_url || ''
          ]
          for (let i = 0; i < maxTeammates; i++) {
            const m = parsed[i] || {}
            r.push(m.fullName || '', m.uid || '', m.section || '', m.group || '', m.block || '')
          }
          return r
        })

        // Pre-initialize separate Solo & Team tabs and category tabs (with Music categories merged)
        categorySheets = {
          'Solo Acts': [],
          'Team Acts': [],
          'Music & Jamming': [],
          'Dance & Choreography': [],
          'Stand-up Comedy': [],
          'Mono-Acts & Drama': [],
          'Modeling': [],
          'Poetry & Spoken Word': [],
          'Other Creative Talent': []
        }

        dataToExport.forEach((row, idx) => {
          const rowData = rows[idx]
          const catName = normalizeCategoryName(row.category)
          const members = parseDay1TeamMembers(row)
          const isTeam =
            (row.entry_type || '').toLowerCase() === 'team' ||
            Boolean(row.team_name && row.team_name.trim().length > 0) ||
            members.length > 0

          // 1. Separate Solo and Team into different sheets
          if (isTeam) {
            categorySheets['Team Acts'].push(rowData)
          } else {
            categorySheets['Solo Acts'].push(rowData)
          }

          // 2. Merge Vocals & Jamming, Instrumental Performance, and Beatboxing & Rap into "Music & Jamming"
          if (
            catName === 'Vocals & Jamming' ||
            catName === 'Instrumental Performance' ||
            catName === 'Beatboxing & Rap'
          ) {
            categorySheets['Music & Jamming'].push(rowData)
          } else {
            if (!categorySheets[catName]) {
              categorySheets[catName] = []
            }
            categorySheets[catName].push(rowData)
          }
        })
      } else {
        // Day 2 Tech Arena
        headers = [
          'Token No.',
          'Registration ID',
          'Attendance',
          'Squad Name',
          'Leader Name',
          'Leader UID',
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

        rows = dataToExport.map((row, idx) => {
          const tokenNo = `T-${String(idx + 1).padStart(3, '0')}`
          return [
            tokenNo,
            row.reg_id || '',
            '', // Attendance (blank with dropdown for registration desk)
            row.squad_name || '',
            row.leader_name || '',
            row.uid || '',
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

        // Group rows by squad size for separate tabs
        categorySheets = {
          '3-Member Squads': [],
          '4-Member Squads': []
        }
        dataToExport.forEach((row, idx) => {
          const is4 = Boolean(row.teammate_3 || row.teammate_3_name)
          if (is4) {
            categorySheets['4-Member Squads'].push(rows[idx])
          } else {
            categorySheets['3-Member Squads'].push(rows[idx])
          }
        })
      }

      // Validate webhook URL before fetch — must be https: and end with /exec
      let validatedWebhook
      try {
        const parsedUrl = new URL(webhookUrl)
        if (parsedUrl.protocol !== 'https:') throw new Error('Non-HTTPS webhook URL')
        if (!webhookUrl.includes('/exec')) {
          setSyncStatus({
            day: dayKey,
            success: false,
            message: 'Invalid Webhook URL! The URL must end with /exec (from Apps Script > Deploy > Manage deployments > Web app URL).'
          })
          setIsSyncing(null)
          return
        }
        validatedWebhook = webhookUrl
      } catch {
        setSyncStatus({ day: dayKey, success: false, message: 'Invalid webhook URL. Must be a valid https:// Google Apps Script Web App URL ending in /exec.' })
        setIsSyncing(null)
        return
      }

      console.log(`[GoogleSheetSync] Sending ${rows.length} rows + ${Object.keys(categorySheets).length} category tabs to ${validatedWebhook}...`)

      // Send payload to Google Apps Script Webhook directly as JSON (text/plain avoids URL size limits & encoding issues)
      const payload = {
        dayKey,
        dayName,
        headers,
        rows,
        categorySheets
      }

      await fetch(validatedWebhook, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })

      console.log(`[GoogleSheetSync] Request dispatched to Google Apps Script successfully.`)

      const subSheetsCount = Object.keys(categorySheets).length
      setSyncStatus({
        day: dayKey,
        success: true,
        message: `Successfully pushed ${rows.length} ${dayName} records into Google Sheets! Created master table + ${subSheetsCount} individual tabs.`
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

  // Google Apps Script Template for User Setup (Registration Desk Ready with Dropdowns & Token No.)
  const appsScriptCode = `function doPost(e) {
  try {
    var raw = "";
    if (e && e.postData && e.postData.contents) {
      raw = e.postData.contents;
      if (raw.indexOf("data=") === 0) {
        try {
          raw = decodeURIComponent(raw.substring(5).replace(/\\+/g, " "));
        } catch (e1) {
          raw = unescape(raw.substring(5).replace(/\\+/g, " "));
        }
      }
    } else if (e && e.parameter && e.parameter.data) {
      raw = e.parameter.data;
    }
    
    if (!raw) throw new Error("No data received in request");
    
    var data = (typeof raw === 'object') ? raw : JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Category aliases and keyword mappings for smart tab detection
    var categoryKeywords = {
      'Solo Acts': ['solo', 'solo act', 'solo acts', 'solo performance'],
      'Team Acts': ['team', 'team act', 'team acts', 'group act', 'group'],
      'Music & Jamming': ['music', 'vocal', 'sing', 'jamming', 'acoustic', 'instrument', 'guitar', 'piano', 'beatbox', 'rap'],
      'Dance & Choreography': ['dance', 'choreo', 'dancing', 'dancer'],
      'Stand-up Comedy': ['comedy', 'stand-up', 'standup', 'comic', 'stand up'],
      'Mono-Acts & Drama': ['drama', 'mono', 'skit', 'theatre', 'theater', 'acting', 'play'],
      'Modeling': ['model', 'ramp', 'fashion'],
      'Poetry & Spoken Word': ['poet', 'poetry', 'spoken', 'shayari', 'kavita'],
      'Other Creative Talent': ['other', 'misc', 'creative', 'talent'],
      '3-Member Squads': ['3-member', '3 member', '3 members', '3-members', '3 player', '3 squad', 'trio', '3'],
      '4-Member Squads': ['4-member', '4 member', '4 members', '4-members', '4 player', '4 squad', 'quad', '4']
    };
    
    // 1. Helper function to find Master Sheet without destroying user-created category tabs
    function findMasterSheet(masterTabName, dayKey) {
      var sheets = ss.getSheets();
      var masterAliases = dayKey === 'day1'
        ? ['all day 1 performers', 'all day 1', 'day 1', 'master', 'all', 'all performers', 'all registrations', 'sheet1']
        : ['all day 2 tech squads', 'all day 2', 'day 2', 'master', 'all', 'all squads', 'all tech squads', 'sheet1'];
      
      // Match existing master / all sheet
      for (var a = 0; a < masterAliases.length; a++) {
        for (var i = 0; i < sheets.length; i++) {
          var name = sheets[i].getName().toLowerCase().trim();
          if (name === masterAliases[a]) {
            sheets[i].setName(masterTabName);
            return sheets[i];
          }
        }
      }
      
      // If only 1 sheet exists in total, use it
      if (sheets.length === 1) {
        sheets[0].setName(masterTabName);
        return sheets[0];
      }
      
      // If multiple sheets already exist (e.g. user made category tabs), insert Master sheet at position 0
      return ss.insertSheet(masterTabName, 0);
    }
    
    // 2. Helper function to find existing category sheet tab (exact, clean, or keyword alias) or create new
    function findCategorySheet(categoryName) {
      var sheets = ss.getSheets();
      var cleanTarget = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '');
      var keywords = categoryKeywords[categoryName] || [];
      
      // A. Exact Name Match (case-insensitive)
      for (var i = 0; i < sheets.length; i++) {
        var existingName = sheets[i].getName();
        if (existingName.toLowerCase().trim() === categoryName.toLowerCase().trim()) {
          return sheets[i];
        }
      }
      
      // B. Alphanumeric Cleaned Match
      for (var i = 0; i < sheets.length; i++) {
        var existingName = sheets[i].getName();
        var cleanExisting = existingName.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanExisting === cleanTarget) {
          return sheets[i];
        }
      }
      
      // C. Keyword / Alias Match (skip Master sheets)
      for (var i = 0; i < sheets.length; i++) {
        var existingName = sheets[i].getName().toLowerCase();
        if (existingName.indexOf('all day') === 0 || existingName === 'master' || existingName === 'all') continue;
        
        for (var k = 0; k < keywords.length; k++) {
          if (existingName.indexOf(keywords[k]) !== -1) {
            return sheets[i];
          }
        }
      }
      
      // D. Clean tab name (max length 50, valid sheet characters) and insert new
      var cleanTabName = categoryName.replace(/[\\*\\/\\?\\:\\\\\\[\\]]/g, '').trim().substring(0, 50);
      return ss.insertSheet(cleanTabName);
    }
    
    // Helper function to format and populate a sheet tab with table headers, dropdowns, and styling
    function populateSheetTab(sheet, sheetHeaders, sheetRows, headerBgColor) {
      sheet.clearContents();
      sheet.clearFormats();
      
      var allRows = [];
      if (sheetHeaders && sheetHeaders.length > 0) {
        allRows.push(sheetHeaders);
      }
      if (sheetRows && sheetRows.length > 0) {
        for (var i = 0; i < sheetRows.length; i++) {
          allRows.push(sheetRows[i]);
        }
      }
      
      if (allRows.length > 0) {
        var numRows = allRows.length;
        var numCols = allRows[0].length;
        
        // Ensure all rows match column length
        for (var r = 0; r < numRows; r++) {
          while (allRows[r].length < numCols) {
            allRows[r].push("");
          }
        }
        
        var range = sheet.getRange(1, 1, numRows, numCols);
        range.setValues(allRows);
        
        // Style Header Row
        var headerRange = sheet.getRange(1, 1, 1, numCols);
        headerRange.setBackground(headerBgColor || '#1a1711');
        headerRange.setFontColor('#f7d978');
        headerRange.setFontWeight('bold');
        headerRange.setFontFamily('Arial');
        headerRange.setFontSize(11);
        headerRange.setHorizontalAlignment('center');
        sheet.setFrozenRows(1);
        
        // Fast batch styling for data rows
        if (numRows > 1) {
          var dataRange = sheet.getRange(2, 1, numRows - 1, numCols);
          dataRange.setFontFamily('Arial');
          dataRange.setFontSize(10);
          
          var bgColors = [];
          for (var rowIdx = 2; rowIdx <= numRows; rowIdx++) {
            var rowBg = (rowIdx % 2 === 0) ? '#f8f8fa' : '#ffffff';
            var rowColorArr = [];
            for (var c = 0; c < numCols; c++) {
              rowColorArr.push(rowBg);
            }
            bgColors.push(rowColorArr);
          }
          dataRange.setBackgrounds(bgColors);
          
          // Format Token No. (Column 1)
          try {
            sheet.getRange(2, 1, numRows - 1, 1).setHorizontalAlignment('center').setFontWeight('bold');
          } catch (eTok) {}
          
          // Setup interactive Present / Absent dropdown validation on Attendance (Column 3)
          try {
            var attRange = sheet.getRange(2, 3, numRows - 1, 1);
            var attRule = SpreadsheetApp.newDataValidation()
              .requireValueInList(['Present', 'Absent'], true)
              .setAllowInvalid(true)
              .build();
            attRange.setDataValidation(attRule);
            attRange.setHorizontalAlignment('center');
          } catch (eAtt) {}
        }
        
        // Auto-fit columns
        for (var c = 1; c <= Math.min(numCols, 25); c++) {
          try { sheet.autoResizeColumn(c); } catch (err) {}
        }
      }
    }
    
    // 1. Populate Master Sheet Tab
    var masterTabName = data.dayKey === 'day1' ? 'All Day 1 Performers' : 'All Day 2 Tech Squads';
    var masterSheet = findMasterSheet(masterTabName, data.dayKey);
    populateSheetTab(masterSheet, data.headers, data.rows, '#1a1711');
    
    // 2. Populate Individual Tabs (Solo Acts, Team Acts, Category Sheets, Squad Tabs)
    if (data.categorySheets) {
      var catNames = Object.keys(data.categorySheets);
      for (var k = 0; k < catNames.length; k++) {
        var catName = catNames[k];
        var catRows = data.categorySheets[catName];
        var catSheet = findCategorySheet(catName);
        var tabColor = (catName === 'Solo Acts' || catName === 'Team Acts') ? '#1e3a5f' : '#2e1c38';
        populateSheetTab(catSheet, data.headers, catRows || [], tabColor);
      }
    }
    
    return ContentService.createTextOutput("SUCCESS").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (error) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (ss) {
      ss.getSheets()[0].appendRow(["SYNC ERROR", new Date(), error.toString()]);
    }
    return ContentService.createTextOutput(error.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    sheetName: ss ? ss.getSheets()[0].getName() : "Unknown Sheet",
    message: "EGT 2.0 Webhook with Category Tabs is active!"
  })).setMimeType(ContentService.MimeType.JSON);
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

  // Load Data (with loading indicator)
  const loadAllData = async () => {
    setLoading(true)
    try {
      const [d1, d2, msgs, settings] = await Promise.all([
        getDay1Registrations(),
        getDay2Registrations(),
        getContactMessages(),
        fetchRegistrationSettings().catch(() => getRegistrationSettings())
      ])
      setDay1Data(d1)
      setDay2Data(d2)
      setContactMessages(msgs)
      if (settings) {
        setRegSettings(settings)
      }
    } catch (err) {
      console.warn('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Silent Background Auto-Refresh (does not disrupt active UI or show spinners)
  const loadAllDataSilently = async () => {
    try {
      const [d1, d2, msgs, settings] = await Promise.all([
        getDay1Registrations(),
        getDay2Registrations(),
        getContactMessages(),
        fetchRegistrationSettings().catch(() => getRegistrationSettings())
      ])
      setDay1Data(d1)
      setDay2Data(d2)
      setContactMessages(msgs)
      if (settings) {
        setRegSettings(settings)
      }
    } catch (err) {
      console.warn('Silent refresh error:', err)
    }
  }

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setRegSettings(getRegistrationSettings())
    }
    window.addEventListener('egt_settings_updated', handleSettingsUpdate)

    if (isAuthenticated) {
      loadAllData()
      // Live Auto-Sync: Automatically check for new registrations and settings every 15 seconds
      const pollInterval = setInterval(loadAllDataSilently, 15000)
      return () => {
        clearInterval(pollInterval)
        window.removeEventListener('egt_settings_updated', handleSettingsUpdate)
      }
    }

    return () => window.removeEventListener('egt_settings_updated', handleSettingsUpdate)
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
    const res = await updateRegistrationStatus(table, regId, newStatus)
    if (res && !res.success) {
      alert(`Status update failed: ${res.error || 'Unknown error'}`)
    }
    loadAllData()
  }

  const handleDelete = async (table, regId) => {
    if (window.confirm('Are you sure you want to delete this registration entry?')) {
      const res = await deleteRegistration(table, regId)
      if (res && !res.success) {
        alert(`Delete failed: ${res.error || 'Unknown error'}`)
      } else {
        if (selectedItem?.reg_id === regId) {
          setSelectedItem(null)
        }
        loadAllData()
      }
    }
  }

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry message?')) {
      const res = await deleteContactMessage(id)
      if (res && !res.success) {
        alert(`Delete failed: ${res.error || 'Unknown error'}`)
      } else {
        loadAllData()
      }
    }
  }

  // Export to CSV Functionality (Formats perfectly into Google Sheets / Excel Table)
  const exportToCSV = () => {
    const dataToExport = activeTab === 'day1' ? day1Data : (activeTab === 'day2' ? day2Data : contactMessages)
    if (!dataToExport || dataToExport.length === 0) {
      alert('No data available to export!')
      return
    }

    const cleanField = (val) => {
      if (val === null || val === undefined) return '""'
      let str = String(val).trim()
      // Neutralize spreadsheet formula injection (CSV/Excel/Sheets)
      if (/^[=+\-@\t\r|%]/.test(str)) {
        str = `'${str}`
      }
      str = str.replace(/"/g, '""')
      return `"${str}"`
    }

    let rows = []

    if (activeTab === 'analytics') {
      rows.push(['EGT 2.0 — CATEGORY & PARTICIPANT ANALYTICS SUMMARY'].map(cleanField).join(','))
      rows.push([`Generated: ${new Date().toLocaleString()}`, `Total Categories: ${analytics.totalActiveCategories}`, `Total Registrations: ${analytics.grandTotalRegistrations}`, `Total Performing/Participating Students: ${analytics.grandTotalStudents}`].map(cleanField).join(','))
      rows.push([''].map(cleanField).join(','))
      
      rows.push(['── DAY 1 STAGE TALENT CATEGORY BREAKDOWN ──'].map(cleanField).join(','))
      rows.push(['Category Name', 'Total Acts / Registrations', 'Total Performing Students', 'Solo Acts', 'Team / Group Acts', 'Share of Day 1 Entries (%)'].map(cleanField).join(','))
      
      analytics.day1Categories.forEach(cat => {
        const pct = analytics.totalDay1Acts > 0 ? ((cat.actsCount / analytics.totalDay1Acts) * 100).toFixed(1) + '%' : '0%'
        rows.push([
          cat.name,
          cat.actsCount,
          cat.totalStudents,
          cat.soloCount,
          cat.teamCount,
          pct
        ].map(cleanField).join(','))
      })

      rows.push(['DAY 1 TOTAL', analytics.totalDay1Acts, analytics.totalDay1Students, '', '', '100%'].map(cleanField).join(','))
      rows.push([''].map(cleanField).join(','))

      rows.push(['── DAY 2 HARRY POTTER TECH ARENA SQUAD BREAKDOWN ──'].map(cleanField).join(','))
      rows.push(['Squad Category / Format', 'Total Squads', 'Total Tech Students', 'Members Per Squad', '', ''].map(cleanField).join(','))
      rows.push(['3-Member Technical Squads', analytics.day2_3MemberSquads, analytics.day2_3MemberSquads * 3, '3 Members', '', ''].map(cleanField).join(','))
      rows.push(['4-Member Technical Squads', analytics.day2_4MemberSquads, analytics.day2_4MemberSquads * 4, '4 Members', '', ''].map(cleanField).join(','))
      rows.push(['DAY 2 TOTAL', analytics.totalDay2Squads, analytics.totalDay2Students, 'Squad Team Track', '', ''].map(cleanField).join(','))
      rows.push([''].map(cleanField).join(','))

      rows.push(['── OVERALL EVENT AGGREGATION ──'].map(cleanField).join(','))
      rows.push(['Grand Total Registrations', analytics.grandTotalRegistrations, 'Grand Total Participating Students', analytics.grandTotalStudents, '', ''].map(cleanField).join(','))
    } else if (activeTab === 'inquiries') {
      rows.push([
        'Timestamp',
        'Name',
        'Email Address',
        'Phone Number',
        'Query Category',
        'Message Body'
      ].map(cleanField).join(','))

      dataToExport.forEach(row => {
        const timestamp = new Date(row.created_at || Date.now()).toLocaleString()
        rows.push([
          timestamp,
          row.name || '',
          row.email || '',
          row.phone || '',
          row.category || 'General Inquiry',
          row.message || ''
        ].map(cleanField).join(','))
      })
    } else if (activeTab === 'day1') {
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
        'Performance Details / Description',
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
          row.performance_desc || '',
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
    
    const filename = `EGT2_${activeTab === 'day1' ? 'Day1_Performers' : (activeTab === 'day2' ? 'Day2_TechSquads' : (activeTab === 'analytics' ? 'Category_and_Student_Breakdown' : 'Inquiries_and_Messages'))}_Responses.csv`
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
  const currentDataset = Array.isArray(
    activeTab === 'day1' ? day1Data : (activeTab === 'day2' ? day2Data : contactMessages)
  )
    ? (activeTab === 'day1' ? day1Data : (activeTab === 'day2' ? day2Data : contactMessages))
    : []

  const filteredDataset = currentDataset.filter(item => {
    if (!item) return false
    try {
      const searchString = JSON.stringify(item).toLowerCase()
      const matchesSearch = searchString.includes((searchTerm || '').toLowerCase())

      let matchesFilter = true
      if (categoryFilter !== 'all') {
        if (activeTab === 'inquiries') {
          matchesFilter = (item.category || '').toLowerCase().includes(categoryFilter.toLowerCase())
        } else if (activeTab === 'day1') {
          if (categoryFilter === 'solo') {
            matchesFilter = (item.entry_type || 'Solo').toLowerCase() === 'solo'
          } else if (categoryFilter === 'team') {
            matchesFilter = (item.entry_type || '').toLowerCase() === 'team' || Boolean(item.team_name && item.team_name.trim().length > 0)
          } else if (categoryFilter === 'dance') {
            matchesFilter = (item.category || '').toLowerCase().includes('dance')
          } else if (categoryFilter === 'modeling') {
            matchesFilter = (item.category || '').toLowerCase().includes('model') || (item.category || '').toLowerCase().includes('ramp')
          } else if (categoryFilter === 'singing') {
            matchesFilter = (item.category || '').toLowerCase().includes('singing') || (item.category || '').toLowerCase().includes('vocal') || (item.category || '').toLowerCase().includes('jamming')
          } else if (categoryFilter === 'comedy') {
            matchesFilter = (item.category || '').toLowerCase().includes('comedy')
          } else if (categoryFilter === 'beatboxing') {
            matchesFilter = (item.category || '').toLowerCase().includes('beatbox') || (item.category || '').toLowerCase().includes('rap')
          } else if (categoryFilter === 'instrumental') {
            matchesFilter = (item.category || '').toLowerCase().includes('instrumental')
          } else if (categoryFilter === 'poetry') {
            matchesFilter = (item.category || '').toLowerCase().includes('poetry') || (item.category || '').toLowerCase().includes('spoken')
          } else if (categoryFilter === 'dramatic') {
            matchesFilter = (item.category || '').toLowerCase().includes('dramatic') || (item.category || '').toLowerCase().includes('mono') || (item.category || '').toLowerCase().includes('drama')
          } else if (categoryFilter === 'magic') {
            matchesFilter = (item.category || '').toLowerCase().includes('magic') || (item.category || '').toLowerCase().includes('mentalism')
          } else if (categoryFilter === 'other') {
            matchesFilter = (item.category || '').toLowerCase().includes('other')
          } else {
            // Match canonical category name or direct substring
            const normalized = normalizeCategoryName(item.category)
            matchesFilter = normalized.toLowerCase() === categoryFilter.toLowerCase() ||
              (item.category || '').toLowerCase().includes(categoryFilter.toLowerCase())
          }
        } else {
          // Day 2 Tech Squad filtering
          if (categoryFilter === '3-members') {
            matchesFilter = !(item.teammate_3 || item.teammate_3_name)
          } else if (categoryFilter === '4-members') {
            matchesFilter = Boolean(item.teammate_3 || item.teammate_3_name)
          }
        }
      }

      return matchesSearch && matchesFilter
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
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xs font-['Space_Grotesk'] font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Refresh database entries"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#f7d978]' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Refresh'}</span>
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

      {/* Metrics Bar (4 Columns with Exact Registration Counts & Student Headcounts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div 
          onClick={() => { setActiveTab('analytics'); setCategoryFilter('all'); }}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#f7d978]/50 transition-all cursor-pointer group"
          title="Click to view detailed Category & Student Breakdown"
        >
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-gray-400 uppercase group-hover:text-[#f7d978] transition-colors">
              Total Registrations
            </span>
            <Users className="w-5 h-5 text-[#f7d978]" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
            <span>{day1Data.length + day2Data.length}</span>
            <span className="text-xs font-normal font-sans text-gray-400">
              entries
            </span>
          </p>
          <span className="text-[11px] text-gray-400 block mt-1">
            {analytics.grandTotalStudents} total students participating
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab('day1'); setCategoryFilter('all'); }}
          className="glass-panel p-5 rounded-2xl border border-rose-500/30 hover:border-rose-500/60 transition-all cursor-pointer group"
          title="Click to view Day 1 Performers roster"
        >
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-rose-400 uppercase">
              Day 1 Registrations
            </span>
            <Mic className="w-5 h-5 text-rose-400" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
            <span>{day1Data.length}</span>
            <span className="text-xs font-normal font-sans text-rose-300/70">
              acts
            </span>
          </p>
          <span className="text-[11px] text-rose-300/80 block mt-1">
            {analytics.totalDay1Students} total performing students
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab('day2'); setCategoryFilter('all'); }}
          className="glass-panel p-5 rounded-2xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all cursor-pointer group"
          title="Click to view Day 2 Tech Squads roster"
        >
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-cyan-400 uppercase">
              Day 2 Tech Squads
            </span>
            <Code className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
            <span>{day2Data.length}</span>
            <span className="text-xs font-normal font-sans text-cyan-300/70">
              squads
            </span>
          </p>
          <span className="text-[11px] text-cyan-300/80 block mt-1">
            {analytics.totalDay2Students} total coding wizards
          </span>
        </div>

        <div 
          onClick={() => { setActiveTab('analytics'); setCategoryFilter('all'); }}
          className="glass-panel p-5 rounded-2xl border border-purple-500/30 hover:border-purple-500/60 transition-all cursor-pointer group bg-gradient-to-br from-purple-950/20 to-transparent"
          title="Click to view full Category Breakdown"
        >
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-purple-400 uppercase">
              Active Categories
            </span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="font-['Syne'] text-3xl font-extrabold text-white mt-2 flex items-baseline gap-2">
            <span>{analytics.totalActiveCategories}</span>
            <span className="text-xs font-normal font-sans text-purple-300/70">
              categories
            </span>
          </p>
          <span className="text-[11px] text-purple-300/80 block mt-1">
            {analytics.totalDay1CategoriesCount} Day 1 + 1 Tech Track
          </span>
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
            disabled={isUpdatingSettings === 'day1Closed'}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-2xl border text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
              regSettings.day1Closed
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/50'
                : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
            }`}
            title="Toggle Day 1 registration status live across all devices"
          >
            {isUpdatingSettings === 'day1Closed' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#f7d978]" />
                <span>Syncing Cloud...</span>
              </>
            ) : regSettings.day1Closed ? (
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
            disabled={isUpdatingSettings === 'day2Closed'}
            className={`flex-1 md:flex-initial px-4 py-2.5 rounded-2xl border text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 ${
              regSettings.day2Closed
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-rose-950/50'
                : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-cyan-950/50'
            }`}
            title="Toggle Day 2 registration status live across all devices"
          >
            {isUpdatingSettings === 'day2Closed' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#f7d978]" />
                <span>Syncing Cloud...</span>
              </>
            ) : regSettings.day2Closed ? (
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
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap bg-white/5 p-1 rounded-2xl border border-white/10 font-['Space_Grotesk'] text-xs font-bold w-full xl:w-auto gap-1 sm:gap-0 shrink-0">
          <button
            onClick={() => { setActiveTab('day1'); setCategoryFilter('all'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'day1' ? 'bg-[#f7d978] text-black shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4 shrink-0" />
            <span>Day 1 Performers ({day1Data.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('day2'); setCategoryFilter('all'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'day2' ? 'bg-cyan-400 text-black shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" />
            <span>Day 2 Tech Squads ({day2Data.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setCategoryFilter('all'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Category Stats ({analytics.totalActiveCategories})</span>
          </button>

          <button
            onClick={() => { setActiveTab('inquiries'); setCategoryFilter('all'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'inquiries' ? 'bg-amber-400 text-black shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Inquiries ({contactMessages.length})</span>
          </button>
        </div>

        {/* Search & Category/Format Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 sm:w-60 min-w-[180px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'analytics' ? 'Search Categories...' : 'Search Name, UID, Email...'}
              className="w-full bg-white/5 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#f7d978]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-[#12121c] border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f7d978] cursor-pointer shadow-lg whitespace-nowrap"
          >
            {activeTab === 'analytics' ? (
              <>
                <option value="all">All Event Segments (Day 1 &amp; Day 2)</option>
                <option value="day1">Day 1 Stage Talent Categories Only</option>
                <option value="day2">Day 2 Tech Arena Formats Only</option>
              </>
            ) : activeTab === 'inquiries' ? (
              <>
                <option value="all">All Inquiry Topics</option>
                <option value="General Inquiry">General Inquiry &amp; Feedback</option>
                <option value="Day 1">Day 1 Stage Queries</option>
                <option value="Day 2">Day 2 Wizard's Code Queries</option>
                <option value="Sponsorship">Sponsorship &amp; Brand Partner</option>
                <option value="Technical">Technical &amp; Portal Issues</option>
              </>
            ) : activeTab === 'day1' ? (
              <>
                <option value="all">All Formats &amp; Categories</option>
                <optgroup label="── Performance Format ──">
                  <option value="solo">Solo Acts Only</option>
                  <option value="team">Team / Group Acts Only</option>
                </optgroup>
                <optgroup label="── Talent Categories ──">
                  <option value="singing">Singing &amp; Vocal Arts</option>
                  <option value="dance">Dance (Solo / Group)</option>
                  <option value="modeling">Modeling</option>
                  <option value="comedy">Stand-Up Comedy</option>
                  <option value="beatboxing">Beatboxing &amp; Rap</option>
                  <option value="instrumental">Instrumental Music</option>
                  <option value="poetry">Poetry &amp; Spoken Word</option>
                  <option value="dramatic">Dramatic Act &amp; Monologue</option>
                  <option value="magic">Magic &amp; Mentalism</option>
                  <option value="other">Other Talent</option>
                </optgroup>
              </>
            ) : (
              <>
                <option value="all">All Squads</option>
                <option value="3-members">3-Member Squads</option>
                <option value="4-members">4-Member Squads (With Teammate 3)</option>
              </>
            )}
          </select>

          {/* Dedicated Refresh Button */}
          <button
            onClick={loadAllData}
            disabled={loading}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap shrink-0"
            title="Fetch latest registrations from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-purple-300'}`} />
            <span>{loading ? 'Fetching...' : 'Refresh Data'}</span>
          </button>
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
              {/* Alphabetical Column Header Row (A, B, C, D, E... L) */}
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
                  <th className="py-1 px-3 border border-gray-700 text-center font-semibold">L</th>
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
                  <td className="py-2 px-3 border border-gray-700">{activeTab === 'day1' ? 'Co-Performers & Team' : 'Teammate 3'}</td>
                </tr>
              </thead>

              <tbody className="bg-[#181824] text-gray-200 divide-y divide-gray-800">
                {filteredDataset.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-10 text-gray-500 italic border border-gray-800">
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
                          row.teammate_1 || (row.teammate_1_name ? `${row.teammate_1_name} (${row.teammate_1_uid || ''})` : 'N/A')
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
                          row.teammate_2 || (row.teammate_2_name ? `${row.teammate_2_name} (${row.teammate_2_uid || ''})` : 'N/A')
                        )}
                      </td>
                      <td className="py-2 px-3 border border-gray-800 text-gray-300 whitespace-nowrap">
                        {activeTab === 'day1' ? (
                          (parseDay1TeamMembers(row).length > 0 || row.team_name || row.entry_type === 'Team') ? (
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-[#f7d978] border border-purple-500/40 text-[10px] font-bold">
                                {row.team_name || 'Team'} ({parseDay1TeamMembers(row).length + 1})
                              </span>
                              <span className="text-gray-300 text-[11px] truncate max-w-[280px]" title={row.team_members || JSON.stringify(parseDay1TeamMembers(row))}>
                                {parseDay1TeamMembers(row).length > 0
                                  ? parseDay1TeamMembers(row).map(m => `${m.fullName || 'Member'}${m.uid ? ` (${m.uid})` : ''}`).join(', ')
                                  : (row.team_members || 'Group Members')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-[11px] italic">Solo Performer</span>
                          )
                        ) : (
                          (row.teammate_3 || row.teammate_3_name) ? (
                            row.teammate_3 || `${row.teammate_3_name} (${row.teammate_3_uid || ''})`
                          ) : (
                            <span className="text-gray-500 text-[11px] italic">No 3rd Teammate</span>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'inquiries' ? (
        /* INQUIRIES & CONTACT MESSAGES TABLE */
        <div className="glass-panel rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['Space_Grotesk'] text-xs">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-gray-400 text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Sender Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Message Body</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredDataset.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400 text-sm font-light">
                      No inquiry messages received yet.
                    </td>
                  </tr>
                ) : (
                  filteredDataset.map((msg) => {
                    const timestamp = new Date(msg.created_at || Date.now()).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    return (
                      <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-mono text-gray-400 text-[11px] whitespace-nowrap">
                          {timestamp}
                        </td>
                        <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                          {msg.name}
                          <div className="text-[11px] font-normal text-[#f7d978]">{msg.email}</div>
                          {msg.phone && (
                            <div className="text-[10px] font-normal text-gray-400">{msg.phone}</div>
                          )}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-semibold">
                            {msg.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-300 min-w-[280px] max-w-md">
                          <p className="whitespace-pre-wrap text-xs bg-black/30 p-3 rounded-xl border border-white/10 text-gray-200">
                            {msg.message}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: [EGT 2.0 Query] ${msg.category || 'Inquiry'}`)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-colors"
                            title="Reply via Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </a>
                          {msg.phone && (
                            <a
                              href={`tel:${msg.phone}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors"
                              title="Call Sender"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="inline-flex items-center p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'analytics' ? (
        /* CATEGORY BREAKDOWN & STUDENT HEADCOUNT ANALYTICS DASHBOARD */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Top Analytics Summary Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-[#0e0c1a] to-[#070709] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider">
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Category &amp; Headcount Analytics</span>
                </div>
                <h2 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold text-white">
                  Registration Category Distribution
                </h2>
                <p className="font-sans text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                  Real-time aggregation of registered acts and total student headcount across Day 1 stage arts and Day 2 technical coding squads. Accounts for lead performers + all team co-performers.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2.5 rounded-xl bg-[#f7d978] hover:bg-[#e6c86e] text-black font-['Space_Grotesk'] text-xs font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Category Report (CSV)</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-gray-400 block">
                  Total Registrations
                </span>
                <span className="font-['Syne'] text-2xl font-bold text-[#f7d978] mt-1 block">
                  {analytics.grandTotalRegistrations}
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  {analytics.grandTotalStudents} total students
                </span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-rose-400 block">
                  Day 1 Registrations
                </span>
                <span className="font-['Syne'] text-2xl font-bold text-rose-400 mt-1 block">
                  {analytics.totalDay1Acts}
                </span>
                <span className="text-[10px] text-rose-300/70 block mt-0.5">
                  {analytics.totalDay1Students} performing artists
                </span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-cyan-400 block">
                  Day 2 Tech Squads
                </span>
                <span className="font-['Syne'] text-2xl font-bold text-cyan-400 mt-1 block">
                  {analytics.totalDay2Squads}
                </span>
                <span className="text-[10px] text-cyan-300/70 block mt-0.5">
                  {analytics.totalDay2Students} tech coders
                </span>
              </div>

              <div className="bg-black/40 border border-white/10 p-4 rounded-2xl">
                <span className="font-['Space_Grotesk'] text-[11px] uppercase tracking-wider text-purple-400 block">
                  Active Categories
                </span>
                <span className="font-['Syne'] text-2xl font-bold text-purple-400 mt-1 block">
                  {analytics.totalActiveCategories}
                </span>
                <span className="text-[10px] text-purple-300/70 block mt-0.5">
                  {analytics.totalDay1CategoriesCount} Day 1 + 1 Day 2
                </span>
              </div>
            </div>
          </div>

          {/* DAY 1 CATEGORY BREAKDOWN TABLE */}
          {(categoryFilter === 'all' || categoryFilter === 'day1') && (
            <div className="glass-panel rounded-3xl border border-rose-500/30 overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-rose-950/30 via-black to-purple-950/20 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
                      <span>Day 1: The Stage Talent Breakdown</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-['Space_Grotesk'] font-bold">
                        {analytics.day1Categories.length} Categories Registered
                      </span>
                    </h3>
                    <p className="font-sans text-xs text-gray-400">
                      Detailed headcount of solo performers and group team members registered under each art category.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveTab('day1'); setCategoryFilter('all'); }}
                  className="text-xs text-rose-300 hover:text-rose-200 font-['Space_Grotesk'] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Day 1 Roster</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-['Space_Grotesk'] text-xs">
                  <thead className="bg-white/5 border-b border-white/10 uppercase text-gray-400 text-[11px] tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Talent Category</th>
                      <th className="py-4 px-6 text-center">Registered Acts</th>
                      <th className="py-4 px-6 text-center">Total Students Performing</th>
                      <th className="py-4 px-6 text-center">Solo vs Team Split</th>
                      <th className="py-4 px-6">Day 1 Share</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {analytics.day1Categories.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12 text-gray-400 text-sm font-light">
                          No Day 1 registrations recorded yet.
                        </td>
                      </tr>
                    ) : (
                      analytics.day1Categories
                        .filter(cat => cat.name.toLowerCase().includes((searchTerm || '').toLowerCase()))
                        .map((cat, idx) => {
                          const actSharePct = analytics.totalDay1Acts > 0
                            ? Math.round((cat.actsCount / analytics.totalDay1Acts) * 100)
                            : 0
                          const studentSharePct = analytics.totalDay1Students > 0
                            ? Math.round((cat.totalStudents / analytics.totalDay1Students) * 100)
                            : 0

                          return (
                            <tr key={cat.name} className="hover:bg-white/5 transition-colors">
                              <td className="py-4 px-6 font-bold text-white whitespace-nowrap">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[11px] text-gray-400">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <span className="text-white text-sm font-['Syne']">{cat.name}</span>
                                    <span className="block text-[11px] text-gray-400 font-mono">
                                      {studentSharePct}% of total Day 1 performers
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-6 text-center whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 font-['Space_Grotesk'] font-bold text-rose-300 text-xs">
                                  {cat.actsCount} {cat.actsCount === 1 ? 'Act' : 'Acts'}
                                </span>
                              </td>

                              <td className="py-4 px-6 text-center whitespace-nowrap">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 font-['Syne'] font-extrabold text-[#f7d978] text-sm">
                                  <Users className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{cat.totalStudents}</span>
                                  <span className="text-[11px] font-normal text-gray-300">Students</span>
                                </span>
                              </td>

                              <td className="py-4 px-6 text-center whitespace-nowrap">
                                <div className="inline-flex items-center gap-2 text-xs font-['Space_Grotesk']">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px]">
                                    {cat.soloCount} Solo
                                  </span>
                                  <span className="text-gray-500">•</span>
                                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px]">
                                    {cat.teamCount} Team Groups
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-6 min-w-[160px]">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                                    <span>{actSharePct}% of acts</span>
                                    <span>{cat.actsCount} / {analytics.totalDay1Acts}</span>
                                  </div>
                                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                    <div
                                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-500"
                                      style={{ width: `${Math.max(actSharePct, 6)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <button
                                  onClick={() => {
                                    setActiveTab('day1')
                                    setCategoryFilter(cat.name)
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-gray-200 hover:text-white text-xs font-['Space_Grotesk'] font-bold transition-all cursor-pointer hover:scale-105"
                                  title={`View all ${cat.name} registrations`}
                                >
                                  <span>View Acts</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-[#f7d978]" />
                                </button>
                              </td>
                            </tr>
                          )
                        })
                    )}
                  </tbody>

                  {/* Day 1 Totals Summary Footer */}
                  {analytics.day1Categories.length > 0 && (
                    <tfoot className="bg-white/5 border-t-2 border-white/15 font-bold">
                      <tr>
                        <td className="py-4 px-6 font-['Syne'] text-white text-sm uppercase">
                          Day 1 Total Active Talent
                        </td>
                        <td className="py-4 px-6 text-center text-rose-300 font-['Space_Grotesk'] text-sm">
                          {analytics.totalDay1Acts} Acts
                        </td>
                        <td className="py-4 px-6 text-center text-[#f7d978] font-['Syne'] text-base">
                          {analytics.totalDay1Students} Performing Students
                        </td>
                        <td className="py-4 px-6 text-center text-gray-300 font-mono text-xs">
                          {analytics.day1Categories.reduce((acc, c) => acc + c.soloCount, 0)} Solo • {analytics.day1Categories.reduce((acc, c) => acc + c.teamCount, 0)} Teams
                        </td>
                        <td className="py-4 px-6 font-mono text-xs text-gray-300">
                          100% of Stage Volume
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => { setActiveTab('day1'); setCategoryFilter('all'); }}
                            className="text-xs text-[#f7d978] hover:underline font-bold"
                          >
                            All Acts &rarr;
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {/* DAY 2 SQUAD CATEGORY & FORMAT BREAKDOWN */}
          {(categoryFilter === 'all' || categoryFilter === 'day2') && (
            <div className="glass-panel rounded-3xl border border-cyan-400/30 overflow-hidden shadow-2xl">
              <div className="p-5 bg-gradient-to-r from-cyan-950/30 via-black to-blue-950/20 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white flex items-center gap-2">
                      <span>Day 2: Wizard's Code Arena (Tech Squad Formats)</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-['Space_Grotesk'] font-bold">
                        {analytics.totalDay2Squads} Squads Registered
                      </span>
                    </h3>
                    <p className="font-sans text-xs text-gray-400">
                      Distribution of 3-Member and 4-Member technical squads competing in the 3-round coding arena.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveTab('day2'); setCategoryFilter('all'); }}
                  className="text-xs text-cyan-300 hover:text-cyan-200 font-['Space_Grotesk'] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Day 2 Squads</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3-Member Squads Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-['Space_Grotesk'] font-bold">
                        Standard Squad (3 Members)
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        {analytics.totalDay2Squads > 0 ? Math.round((analytics.day2_3MemberSquads / analytics.totalDay2Squads) * 100) : 0}% of squads
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="font-['Syne'] text-3xl font-extrabold text-white">
                          {analytics.day2_3MemberSquads}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">Registered Squads</span>
                      </div>
                      <div className="text-right">
                        <span className="font-['Syne'] text-2xl font-bold text-cyan-400">
                          {analytics.day2_3MemberSquads * 3}
                        </span>
                        <span className="text-xs text-gray-400 block">Total Coders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">1 Leader + 2 Teammates</span>
                    <button
                      onClick={() => {
                        setActiveTab('day2')
                        setCategoryFilter('3-members')
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold font-['Space_Grotesk'] cursor-pointer transition-colors"
                    >
                      Filter 3-Member Squads &rarr;
                    </button>
                  </div>
                </div>

                {/* 4-Member Squads Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/20 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-['Space_Grotesk'] font-bold">
                        Full Squad (4 Members)
                      </span>
                      <span className="font-mono text-xs text-gray-400">
                        {analytics.totalDay2Squads > 0 ? Math.round((analytics.day2_4MemberSquads / analytics.totalDay2Squads) * 100) : 0}% of squads
                      </span>
                    </div>

                    <div className="mt-4 flex items-baseline justify-between">
                      <div>
                        <span className="font-['Syne'] text-3xl font-extrabold text-white">
                          {analytics.day2_4MemberSquads}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">Registered Squads</span>
                      </div>
                      <div className="text-right">
                        <span className="font-['Syne'] text-2xl font-bold text-purple-400">
                          {analytics.day2_4MemberSquads * 4}
                        </span>
                        <span className="text-xs text-gray-400 block">Total Coders</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">1 Leader + 3 Teammates</span>
                    <button
                      onClick={() => {
                        setActiveTab('day2')
                        setCategoryFilter('4-members')
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-bold font-['Space_Grotesk'] cursor-pointer transition-colors"
                    >
                      Filter 4-Member Squads &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Day 2 Footer Aggregation */}
              <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="font-['Syne'] font-bold text-gray-300">
                  Total Day 2 Coding Participants: <span className="text-cyan-400 text-sm font-extrabold">{analytics.totalDay2Students} Students</span> across <span className="text-white font-bold">{analytics.totalDay2Squads} Technical Squads</span>
                </span>
                <button
                  onClick={() => { setActiveTab('day2'); setCategoryFilter('all'); }}
                  className="text-xs text-cyan-300 hover:underline font-bold"
                >
                  View All Day 2 Records &rarr;
                </button>
              </div>
            </div>
          )}
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

              {selectedItem.performance_desc && (
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Performance Details / Act Description:</span>
                  <p className="text-gray-200 text-xs leading-relaxed italic">{selectedItem.performance_desc}</p>
                </div>
              )}

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
                <span>⚡ How to set up in 30 Seconds (Day 1 &amp; Day 2):</span>
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
                <li>Click <strong>Extensions</strong> → <strong>Apps Script</strong>, replace all code with the copied script, and click <strong>Save (Ctrl+S)</strong>.</li>
                <li>Click <strong>Deploy</strong> → <strong>Manage deployments</strong> (or <em>New deployment</em> if first time).</li>
                <li>Click the <strong>✏️ Edit (pencil icon)</strong> on the active deployment → Under Version, select <strong className="text-amber-300">"New version"</strong> → Ensure access is set to <strong className="text-amber-300">Anyone</strong>.</li>
                <li>Click <strong>Deploy</strong>, copy the generated Web app URL (ending in <code className="text-[#f7d978]">/exec</code>), and paste it in the fields above!</li>
              </ol>

              <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 font-sans">
                ⚠️ <strong>Important:</strong> Whenever you update Apps Script code in Google Sheets, you <strong>must</strong> select <strong>"New version"</strong> in <em>Manage deployments</em> so the live webhook uses the category-sync script!
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
