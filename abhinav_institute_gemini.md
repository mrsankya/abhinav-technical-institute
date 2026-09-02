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
**Date:** 2026-09-01 | Fetched latest changes from GitHub repository `mrsankya/abhinav-technical-institute.git`. Updates pulled and implemented include:
1. **Official Logo & Favicon:** Set `images/offlical logo.png` ("ATI - Skills Work For Employment - TRAINING SKILLS") as the official website logo (`src/assets/logo.png`, `public/logo.png`, `public/assets/logo.png`) and website favicon (`public/favicon.png`, `index.html`).
2. **Govt. Orders & GR Admin Database & Management (`src/components/AdminPanelModal.tsx`, `server/server.cjs`, `server/gr.json`, `src/services/api.ts`, `src/components/GovernmentGrPage.tsx`):**
   - Added dedicated `🏛️ Govt. Orders & GR` management tab inside the Admin Panel.
   - Admin can add new GRs with file upload or path, edit title (Marathi/English), GR number, department, date, category tag, badge color style, summary, and code number.
   - Supports deleting, searching, and resetting to official defaults.
   - All changes persist to backend JSON database (`server/gr.json`) with offline LocalStorage fallback and dispatch dynamic DOM sync events (`ati_gr_updated`).
3. **Database Persistence for Reviews & Admissions:** Added `/api/reviews` and `/api/admissions` endpoints with client synchronization.
4. **Header Responsive Layout Fix (`src/components/Header.tsx`):** Fixed layout overflow on intermediate screens and mobile viewports so the yellow Quick Enquiry button, language switcher, and brand title stay strictly within the display without going off-screen.
5. **Accreditation Logos Bar (`src/components/AccreditationLogosBar.tsx`):** Connected high-resolution official accreditation logos from `images/` into `public/assets/accreditations/`.
6. **Built & Deployed to Production:** Re-built production bundle (`npm run build`) and deployed directly to the primary production domain (`https://abhinav-institute.pages.dev`) and pushed clean commits to GitHub `origin main`.
7. **State-Level Awards & Honors Section (Lokmat Lokratna 2026 & Video Reel) (`src/components/AwardsSection.tsx`, `src/services/cms.ts`, `src/components/AdminPanelModal.tsx`, `src/App.tsx`):**
   - Showcases the prestigious **"लोकमत लोकरत्न सन्मान सोहळा २०२६" (Lokmat Lokratna Award)** presented to Principal Prof. P. R. Patil by Lokmat Media Group & Godavari Foundation.
   - 16:9 widescreen HD video reel player (`aspect-video`) with `object-contain bg-black` ensuring zero side-cropping.
   - Includes 5 full HD ceremony photos and full CMS editor in the Admin Panel (`🏆 Awards & Media`).
8. **Mobile Navigation 3-Line Menu (`src/components/Header.tsx`):** High-contrast dark navy & gold 3-line hamburger button using responsive SVG for guaranteed visibility across all mobile phones and tablets.
9. **Super Admin & Database Tables Verified:** All 7 backend tables (`certs.json`, `leads.json`, `gr.json`, `content.json`, `announcements.json`, `reviews.json`, `admissions.json`) validated, seeded, and synchronized with Super Admin Dashboard (`#super-admin`, Key: `9822725265`).
10. **Hero Banner Image Slider CMS & Dynamic Management (`src/components/Hero.tsx`, `src/components/AdminPanelModal.tsx`, `src/services/cms.ts`):**
    - Built comprehensive Hero Banner Image Slider CMS manager inside the Admin Panel (`#admin` -> `🎨 Site Content & Images (CMS)` -> `Hero Banner & Slider`).
    - Added ability to upload new photos directly from computer/mobile with automatic compression (`compressAndReadFile`), enter custom image URLs, edit bilingual titles (Marathi/English), edit category tags ("Live Workshop", "संगणक व आयटी", "इलेक्ट्रिकल", etc.), re-order slides with Move Up/Down controls, delete slides, and reset to institute defaults.
    - Fixed slider dot navigation and category badge rendering in [`Hero.tsx`](file:///C:/Users/sanke/abhinav%20institute/src/components/Hero.tsx) so live updates in the Admin Panel reflect instantly on the homepage.
11. **Cloudflare D1 Database Government GR & Toast Notifications (`functions/api/gr/`, `functions/api/reviews/`, `functions/api/admissions/`, `schema.sql`, `AdminPanelModal.tsx`):**
    - Created dedicated Cloudflare Pages serverless endpoints for `/api/gr`, `/api/reviews`, and `/api/admissions` with automated D1 schema table provisioning on `abhinav_db`.
    - Added floating global Toast Notification banner system inside the Admin Panel (`showToast`) providing immediate visual confirmation and feedback on all save, upload, delete, and update operations.
12. **Complete Course & Vocational Trade CMS Manager (`src/components/AdminPanelModal.tsx`, `src/App.tsx`, `src/services/cms.ts`):**
    - Built comprehensive Course Manager under `Admin Panel` -> `🎨 Site Content & Images (CMS)` -> `Courses & Fees`.
    - Allows admins to **+ Add New Course**, **Edit Course Details** (bilingual Marathi & English titles, MSBSVET course codes, category tags, batch capacity, enrolled count, duration, timing, eligibility, short and detailed descriptions, syllabus modules, career opportunities, and admissions open/closed status).
    - Supports direct **photo upload and replacement** from computer or mobile phone with automatic image compression (`compressAndReadFile`) as well as custom image URLs.
    - Added course **reordering (Move Up / Down)**, **course deletion**, and **reset to default 10 trades**.
    - All course updates are persisted live in Cloudflare D1 SQL database (`site_content` table) and synchronize dynamically across the homepage upcoming batches carousel and course modals.
13. **Super Admin Dashboard Course Sync & Fix (`src/components/SuperAdminDashboard.tsx`):**
    - Fixed issue where the Super Admin Dashboard (`#super-admin`) was showing hardcoded obsolete dummy categories instead of the real Abhinav Technical Institute courses.
    - Replaced with the complete live Course Catalog CMS + Admissions Control dashboard, synchronized directly with Cloudflare D1 SQL database (`api/content`).
    - Super Admin can now add, edit, change photos, reorder, delete, and toggle admissions for all vocational trades with instant global persistence.
14. **Footer Developer Attribution & Portfolio Link (`src/components/Footer.tsx`):**
    - Added "Made by SS Projects" credit in the footer bottom bar with direct link to portfolio [`https://sanket-portfolio-211.pages.dev/`](https://sanket-portfolio-211.pages.dev/).
15. **Interactive Course Cards & Enriched Course Details Modal (`src/components/UpcomingBatches.tsx`, `src/components/Modals.tsx`):**
    - Entire course cards across the homepage carousel are now fully interactive with smooth hover lift (`hover:-translate-y-1 hover:shadow-2xl`) and pointer cursor.
    - Clicking anywhere on a course card (photo, title, body, or "View Full Details") immediately opens the full-screen Course Details Modal.
    - Modal now renders bilingual syllabus modules, subjects with MSBSVET codes, career and job opportunities, and dual actions (Direct WhatsApp Inquiry and Online Admission Application).
16. **Hero Official Banner Updates (`src/components/Hero.tsx`, `public/assets/banner_badge.jpg`):**
    - Updated established year to 1997 (`ESTABLISHED : 1997` / `स्थापना : १९९७`).
    - Updated helpline phone numbers to `+91 94234 88174 / 70404 16582` across English, Marathi, and Hindi locales.
    - Updated right-side banner badge/emblem to the official image (`/assets/banner_badge.jpg`).
17. **Google Maps Embed & Official Address Update (`src/components/LocationSection.tsx`, `src/translations/translations.ts`, `src/services/cms.ts`, `src/data/instituteData.ts`, `src/utils/printUtils.ts`, `src/components/StudentSectionModal.tsx`):**
    - Updated Google Maps embed iframe and directions link to the official Abhinav Technical Institute place ID on Google Maps (`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d885.0260476088392!2d75.56362056956677!3d21.017332398789332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd90fa2e88aa277%3A0x7afc00903a74ff53!2sAbhinav%20Technical%20Institute!5e1!3m2!1sen!2sus!4v1788375445306!5m2!1sen!2sus`).
    - Updated institute address across all pages, footer, hero, student portal, and print templates to: `First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India`.


