# Engineer's Got Talent 2.0 🎭✨

<div align="center">

![EGT 2.0 Banner](https://img.shields.io/badge/Engineer's%20Got%20Talent-2.0-f7d978?style=for-the-badge&labelColor=070709)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white&labelColor=20232a)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white&labelColor=1a1a2e)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white&labelColor=1c1c1c)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)

**Official Registration & Event Portal**  
Organized by **Alexa Developers Community** — Department of CSE, Chandigarh University

[🌐 Live Site](https://egt-2-0.vercel.app) · [📅 Day 1 — The Stage](https://egt-2-0.vercel.app/day-1) · [🔮 Day 2 — Wizarding Tech Arena](https://egt-2-0.vercel.app/day-2)

</div>

---

## 📖 About

**Engineer's Got Talent 2.0** is a two-day flagship event by the Alexa Developers Community at Chandigarh University. The site serves as the complete event portal — featuring event details, performer/team registration, rules, and an admin dashboard.

| | **Day 1 — The Stage** | **Day 2 — Wizarding Tech Arena** |
|---|---|---|
| **Date** | 9 September 2026 | 10 September 2026 |
| **Venue** | A1 Auditorium, Chandigarh University | TBD |
| **Theme** | Non-Tech Talent Showcase | Harry Potter × Tech Challenges |
| **Format** | Solo, Duo, Group Performances | Teams of 3–4 |
| **Events** | Singing, Dance, Instrumental, Comedy, Drama | Chamber of Logic, QR Horcrux Hunt |
| **Registration ID** | `EGT2-P-XXXX` | `EGT2-T-XXXX` |

---

## 🗺️ Sitemap

```
https://egt-2-0.vercel.app/
├── /                        → Home Page (event overview, hero, featured)
├── /day-1                   → Day 1: The Stage — event info, rules, categories
├── /day-2                   → Day 2: Wizarding Tech Arena — squad info, rounds
├── /register-day1           → Day 1 Performer Registration Form
├── /register-day2           → Day 2 Tech Squad Registration Form
├── /guidelines              → Combined Rules & Guidelines Page
└── /admin                   → Admin Portal (requires Supabase auth, hidden from sitemap)
```

> **Note:** `/admin` is intentionally excluded from `sitemap.xml` and is auth-protected.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Styling** | TailwindCSS v4 + Vanilla CSS |
| **Animations** | GSAP 3 (ScrollTrigger), CSS animations |
| **Icons** | Lucide React, Material Symbols |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (admin only) |
| **Deployment** | Vercel |
| **Confetti** | canvas-confetti |
| **Fonts** | Google Fonts — Bricolage Grotesque, Syne, Space Grotesk, Plus Jakarta Sans, Instrument Serif, JetBrains Mono, Outfit |

---

## 📁 Project Structure

```
egt-2.0/
├── public/
│   ├── favicon.png
│   ├── favicon.svg
│   ├── icons.svg
│   └── sitemap.xml
├── src/
│   ├── assets/              # Images, logos
│   ├── components/
│   │   ├── ArcaneCursor.jsx         # Custom animated cursor
│   │   ├── ContactModal.jsx         # Contact Us popup
│   │   ├── CurtainOverlay.jsx       # Theatre curtain opening animation
│   │   ├── Footer.jsx               # Site-wide footer
│   │   ├── Header.jsx               # Navigation header
│   │   ├── InteractiveWizardPortrait.jsx  # Day 2 animated wizard
│   │   └── PageTransitionOverlay.jsx      # Page transition effects
│   ├── pages/
│   │   ├── AdminPage.jsx            # Admin dashboard (auth-gated)
│   │   ├── Day1Page.jsx             # Day 1 event info page
│   │   ├── Day1RegistrationPage.jsx # Day 1 performer registration form
│   │   ├── Day2Page.jsx             # Day 2 event info page
│   │   ├── Day2RegistrationPage.jsx # Day 2 tech squad registration form
│   │   ├── GuidelinesPage.jsx       # Rules & guidelines
│   │   ├── HomePage.jsx             # Main landing/home page
│   │   └── NotFoundPage.jsx         # 404 page
│   ├── App.jsx                      # Root component, routing logic
│   ├── main.jsx                     # React DOM entry point
│   ├── supabaseClient.js            # Supabase client, all DB helpers
│   ├── App.css                      # Global app styles
│   └── index.css                    # Tailwind + design tokens
├── .env                             # Local environment variables (git-ignored)
├── .env.example                     # Environment variable template
├── index.html                       # HTML shell
├── supabase_schema.sql              # Full Supabase DB schema + migrations
├── vercel.json                      # Vercel deployment + security headers config
└── vite.config.js                   # Vite build config
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js ≥ 18
- A [Supabase](https://supabase.com) project (free tier is fine)

### 1. Clone the repository
```bash
git clone https://github.com/alexadevcu/EGT-2.0.git
cd EGT-2.0
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Set up the Supabase database
Run the SQL in `supabase_schema.sql` in your **Supabase Dashboard → SQL Editor**. It creates:
- `day1_registrations` table with RLS policies
- `day2_registrations` table with RLS policies
- UNIQUE constraints on `uid` columns to block duplicate registrations

### 5. Start the dev server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment (Vercel)

This project is deployed on Vercel with the following configuration in `vercel.json`:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **SPA routing:** All routes rewrite to `/index.html`
- **Security headers:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-XSS-Protection`

To deploy your own instance:
1. Fork the repo and connect it to Vercel
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Project Settings → Environment Variables
3. Deploy 🚀

---

## 🗄️ Database Schema

### `day1_registrations`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT | Auto-increment primary key |
| `reg_id` | VARCHAR | Unique ID e.g. `EGT2-P-0001` |
| `full_name` | TEXT | Performer name (solo leader) |
| `uid` | VARCHAR | **UNIQUE** — Student UID / Roll No |
| `email` | TEXT | Contact email |
| `phone` | VARCHAR | WhatsApp number |
| `department` | TEXT | Academic department |
| `academic_year` | TEXT | 1st / 2nd / 3rd / 4th Year |
| `section` | TEXT | Section (e.g. 801-A) |
| `group_name` | TEXT | Group A / Group B |
| `block` | TEXT | Hostel block |
| `category` | TEXT | Performance category |
| `requires_audio_track` | TEXT | Yes / No |
| `audio_track_url` | TEXT | Drive/audio link (URL-validated) |
| `entry_type` | TEXT | Solo / Duo / Team |
| `team_name` | TEXT | Group/team name |
| `team_members` | TEXT | Serialized teammate info |
| `performance_desc` | TEXT | Description of performance |
| `previous_performance_link` | TEXT | Previous video link (URL-validated) |
| `instagram` | TEXT | Instagram handle |
| `created_at` | TIMESTAMPTZ | Auto-set timestamp |

### `day2_registrations`
| Column | Type | Description |
|---|---|---|
| `id` | BIGINT | Auto-increment primary key |
| `reg_id` | VARCHAR | Unique ID e.g. `EGT2-T-0001` |
| `leader_name` | TEXT | Squad leader's name |
| `uid` | VARCHAR | **UNIQUE** — Leader's student UID |
| `email` | TEXT | Leader's email |
| `phone` | VARCHAR | Leader's WhatsApp number |
| `department` | TEXT | Academic department |
| `academic_year` | TEXT | Year of study |
| `section` | TEXT | Section |
| `group_name` | TEXT | Group A / Group B |
| `block` | TEXT | Hostel block |
| `squad_name` | TEXT | Team/squad name |
| `teammate_1_name` … `teammate_3_block` | TEXT | Teammate 1–3 details (name, uid, section, group, block) |
| `created_at` | TIMESTAMPTZ | Auto-set timestamp |

---

## 🔐 Security

This project implements multiple layers of security:

| Area | Implementation |
|---|---|
| **Database** | Row Level Security (RLS) on all tables — anon can only INSERT, read requires auth |
| **Duplicate prevention** | UNIQUE constraint on `uid` column server-side |
| **Input sanitization** | `sanitizeInput()` strips null bytes, zero-width chars, HTML entities, caps at 500 chars |
| **URL validation** | `sanitizeUrl()` accepts only `http:` / `https:` — blocks `javascript:`, `data:` |
| **Admin brute force** | 5 failed attempts → 15 minute login lockout |
| **HTTP headers** | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` |
| **Production build** | All `console.*` and `debugger` statements dropped via esbuild |
| **External links** | All `target="_blank"` links include `rel="noopener noreferrer"` |
| **DB-sourced URLs** | `safeHref()` validates before rendering as `href` in admin — blocks `javascript:` injection |
| **Table injection** | Supabase table names validated against whitelist before any DB operation |
| **Webhook validation** | Google Sheets webhook URL must be valid `https://` before `fetch()` is called |
| **Form field limits** | `maxLength` on all inputs (name: 100, UID: 30, email: 150, URLs: 500) |

> **Admin accounts** must be created directly in the Supabase Dashboard with public signups **disabled**.

---

## 🎨 Design System

- **Primary palette:** Gold (`#f7d978`), Deep dark (`#070709`)
- **Day 1 accent:** Rose / Red
- **Day 2 accent:** Cyan / Electric blue
- **Base font:** Plus Jakarta Sans
- **Display fonts:** Syne (headings), Bricolage Grotesque, Cinzel (titles)
- **Mono font:** JetBrains Mono, Space Grotesk

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (localhost:5173) |
| `npm run build` | Production build (output: `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint static analysis |

---

## 🤝 Credits

| Role | Name |
|---|---|
| **Event Organizer** | Alexa Developers Community (ADC), Chandigarh University |
| **Web Development** | ADC Web Team @2026 |
| **Event Conceived by** | [Aayushi Mishra](https://linktr.ee/Aayushi_mishra) & ADC Core Team |
| **Department** | Department of CSE – Takshashila, Chandigarh University |

---

## 📬 Contact

- 📧 **Email:** adc.cu@cumail.in
- 🌐 **Website:** [alexa-developers-at-cu.vercel.app](https://alexa-developers-at-cu.vercel.app/)
- 📸 **Instagram:** [@alexadev.cu](https://www.instagram.com/alexadev.cu)
- 💼 **LinkedIn:** [Alexa Devs CU](https://www.linkedin.com/company/alexadevscu/)
- 💬 **WhatsApp Channel:** [Join Announcements](https://chat.whatsapp.com/GQScMwZ7X6EKAjfqAFkz4q)

---

<div align="center">

Made with ❤️ by **ADC Web Team @2026**  
Department of CSE – Takshashila • Chandigarh University

</div>
