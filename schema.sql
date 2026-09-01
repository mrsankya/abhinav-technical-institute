-- Cloudflare D1 Database Schema for Abhinav Technical Institute
-- Run using: npx wrangler d1 execute abhinav_db --file=./schema.sql

-- 1. Site Content & CMS Table
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  json_data TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  reg_number TEXT PRIMARY KEY,
  student_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  grade TEXT,
  percentage TEXT,
  issue_date TEXT,
  valid_until TEXT DEFAULT 'Lifetime Valid',
  status TEXT DEFAULT 'Valid',
  institute_center TEXT DEFAULT 'Abhinav Technical Institute, Main Campus Jalgaon',
  remarks TEXT,
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Inquiries / Leads Table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  course TEXT NOT NULL,
  qualification TEXT,
  message TEXT,
  status TEXT DEFAULT 'New',
  date TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_mr TEXT,
  description TEXT,
  tag TEXT DEFAULT 'Notice',
  date TEXT,
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Government Resolutions & Orders (GR) Table
CREATE TABLE IF NOT EXISTS government_gr (
  id TEXT PRIMARY KEY,
  title_mr TEXT NOT NULL,
  title_en TEXT,
  number TEXT NOT NULL,
  date TEXT,
  dept_mr TEXT,
  dept_en TEXT,
  summary_mr TEXT,
  summary_en TEXT,
  pdf_path TEXT,
  status TEXT DEFAULT 'GOVT DIPLOMA GR',
  badge_color TEXT DEFAULT 'bg-[#002760] text-white',
  code_number TEXT,
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Student Reviews / Testimonials Table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT,
  rating INTEGER DEFAULT 5,
  comment TEXT NOT NULL,
  date TEXT,
  verified INTEGER DEFAULT 1,
  raw_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Course Admissions Open/Closed Status Table
CREATE TABLE IF NOT EXISTS course_admissions (
  course_id TEXT PRIMARY KEY,
  is_open INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_cert_student ON certificates(student_name);
CREATE INDEX IF NOT EXISTS idx_inquiry_phone ON inquiries(phone);
CREATE INDEX IF NOT EXISTS idx_inquiry_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_gr_number ON government_gr(number);
CREATE INDEX IF NOT EXISTS idx_gr_title_mr ON government_gr(title_mr);
