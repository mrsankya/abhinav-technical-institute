# Abhinav Technical Institute — Project Memory & Architecture

## 🌐 Live URLs & Endpoints
- **Primary Site:** https://abhinav-institute.pages.dev
- **GitHub Repository:** https://github.com/mrsankya/abhinav-technical-institute
- **Certificate Verification Portal:** https://abhinav-institute.pages.dev/#verify
- **Admin Panel:** https://abhinav-institute.pages.dev/#admin
- **Super Admin Console:** https://abhinav-institute.pages.dev/#super-admin
- **Backend API:** `http://localhost:4000/api` (`/api/certificates`, `/api/inquiries`, `/api/announcements`, `/api/content`)

---

## 🔐 Access Credentials
- **Admin Panel Password:** `9423488174` (also supports `1234` or `admin`)
- **Super Admin Password:** `9822725265` (Secret URL `#super-admin`, no public button)

---

## 📁 Project Location & Scripts
`C:\Users\sanke\abhinav institute`

### 🚀 Commands
- **Launch Full Stack (Frontend + Backend):** Run `start_dev_servers.bat`
- **Start Frontend Only:** `npm run dev` (Port 5173)
- **Start Backend API Only:** `npm run start:server` (Port 4000)
- **Production Build:** `npm run build`
- **Deploy to Cloudflare Pages:**
  ```bash
  npm run build
  npx wrangler pages deploy dist --project-name=abhinav-institute --branch=master
  ```

---

## 🎨 Unified Frontend & Backend Architecture

### 1. Modern Designer UI Integration
- **Header:** Top announcement ticker, institute brand logo, bilingual/trilingual toggle (मराठी `mr`, हिंदी `hi`, English `en`), quick navigation links (Home, About Us, Student Section, Certificate Verify, Placements, Govt GR, Admin Panel), mobile drawer.
- **Hero Section:** High-impact banner with accreditation badge, key statistics, quick admission CTA, trade explorer.
- **Upcoming Batches (10 Vocational Trades):** Real-time course cards with admission open/closed indicators, timings, duration, and direct WhatsApp inquiry.
- **Why Abhinav Technical Institute:** Legacy since 1999, Govt recognized & ISO 9001:2015 certified, 100% practical lab training.
- **Accreditation Logos Bar:** Official NCVT/DGET, MSBTE, ISO 9001:2015, Skill India alignment badges.
- **Community Reviews:** Verified student testimonials with rating breakdown and interactive "Write a Review" modal.
- **Gallery Section:** Workshop labs, commercial wiring setups, and computer practicals.
- **Location Section:** Google Maps embedding & visit center details at Mansing Market, Navi Peth, Jalgaon.
- **FAQ Section:** Expandable accordion answering common admission and certification queries.

### 2. Backend & Data Services (`server/server.js` & `src/services/api.ts`)
- **Certificate Registry API:**
  - `GET /api/certificates` & `GET /api/certificates/:id`
  - `POST /api/certificates` & `DELETE /api/certificates/:id`
  - Persisted in `server/certs.json` with seamless local storage sync & offline fallback.
- **Student Leads CRM API:**
  - `GET /api/inquiries`, `POST /api/inquiries`, `PATCH /api/inquiries/:id`, `DELETE /api/inquiries/:id`
  - Persisted in `server/leads.json` and synchronized with admin dashboard.
- **Announcements API:**
  - `GET /api/announcements`, `POST /api/announcements`
  - Persisted in `server/announcements.json`.

### 3. Integrated Student Tools (`StudentSectionModal.tsx`)
- **Tab 1: Syllabus & Study Material:** Full module breakdown for all 10 trades with PDF syllabus download.
- **Tab 2: Timetable & Batches:** Morning/Evening batch schedules with lab allocation.
- **Tab 3: Trade Aptitude Quiz:** 4-question interactive career counseling quiz that recommends the best trade based on student interest.
- **Tab 4: Fee & EMI Calculator:** Calculates 10% lump sum payment discount or 3/6 month monthly installments with direct WhatsApp quote generator.
- **Tab 5: Certificate Verification Link:** Fast redirect to the verification center.
- **Tab 6: Placements & Alumni:** Placement packages at Mahavitaran, Tata Power, L&T, Voltas, etc.
- **Tab 7: Helpdesk:** Direct helpline connection (+91 9423488174) and campus address.

### 4. Comprehensive Admin Console (`AdminPanelModal.tsx` & `SuperAdminDashboard.tsx`)
- **Tab 1: Overview:** KPI overview of total leads, issued certificates, trades, and recent inquiries.
- **Tab 2: Leads & Inquiries CRM:** Filter by trade, status updater (New / Contacted / Enrolled / Closed), WhatsApp chat links, CSV export, delete.
- **Tab 3: Certificate Authority:** Issue official certificates with auto-generated registration IDs, QR code generation via `qrcode`, printable verification slip, revoke.
- **Tab 4: Fee Receipt & Student ID Card Generator:** Print-ready official admission fee receipt with receipt number, payment mode, balance; and student photo identity card.
- **Tab 5: Course Admissions Toggle:** Live real-time toggling of Admissions Open / Closed for all 10 trades.
- **Tab 6: Notice Broadcaster:** Broadcast marquee notices and emergency ticker updates.

---

## 🗂️ Key Files
| File | Purpose |
|---|---|
| `src/App.tsx` | Main orchestrator & routing (#super-admin, #verify, #admin, pages) |
| `src/services/api.ts` | Unified backend API and LocalStorage synchronizer |
| `server/server.js` | Express API server (port 4000) for certs, leads, and notices |
| `src/components/Header.tsx` | Top navbar with announcement ticker & language switcher |
| `src/components/AdminPanelModal.tsx` | 6-tab Admin Console (Password: 9423488174) |
| `src/components/SuperAdminDashboard.tsx` | Secret Super Admin Console (Password: 9822725265) |
| `src/components/StudentSectionModal.tsx` | Student portal with Quiz, Fee Calculator, Syllabus, Timetable |
| `src/components/CertificateVerifyPage.tsx` | Full certificate verification page with QR code seal & print slip |
| `src/components/CertificateVerificationWidget.tsx` | Homepage verification widget |
| `src/data/instituteData.ts` | Course syllabi, batches, announcements, reviews, initial certificates |
| `src/translations/translations.ts` | Trilingual translation dictionary (Marathi, Hindi, English) |
| `start_dev_servers.bat` | One-click launcher for Frontend and Backend |

---

## 🕐 Last Updated
**Date:** 2026-08-28 | Attached frontend designer's new UI with full backend Express API, Super Admin console, Admin CRM, Certificate QR authority, Fee & EMI calculator, Aptitude quiz, and Student ID/Receipt generator. Added continuous moving marquee ticker for #top-announcement-bar with hover-pause. Optimized #main-header layout with max-w-[1440px] and spacious responsive alignment for PC screens without congestion. Implemented direct image file uploading from PC/phone with automatic WebP/JPEG canvas compression for Principal photo, Hero Carousel, Course cards, and Workshop Gallery in the Admin Panel CMS. Removed password hints from the Admin login modal. Fixed printing in Admin Panel and Certificate Verification to generate clean isolated A4 PDF receipts and verification slips without printing the website UI. Added Admin ability to view student QR codes and directly download branded student QR code stickers (with Student Name, Reg ID, Course, and Institute branding). Renamed all nav/section labels to 'Certificate Verification'. Removed 1234/default fallback passwords and added dedicated '🔐 Change Password' tab in the Admin Panel allowing the client to set and change their custom admin password anytime. Successfully deployed live to Cloudflare Pages production at https://abhinav-institute.pages.dev.
