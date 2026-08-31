const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '25mb' }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

const CERTS_PATH = path.join(__dirname, 'certs.json');
const LEADS_PATH = path.join(__dirname, 'leads.json');
const ANNOUNCEMENTS_PATH = path.join(__dirname, 'announcements.json');
const COURSES_PATH = path.join(__dirname, 'courses.json');
const CONTENT_PATH = path.join(__dirname, 'content.json');
const GR_PATH = path.join(__dirname, 'gr.json');
const REVIEWS_PATH = path.join(__dirname, 'reviews.json');
const ADMISSIONS_PATH = path.join(__dirname, 'admissions.json');

function readJSON(filePath, defaultValue = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    return defaultValue;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing to', filePath, e);
  }
}

// ----------------------
// CERTIFICATES API
// ----------------------
app.get('/api/certificates', (req, res) => {
  const certs = readJSON(CERTS_PATH, []);
  res.json(certs);
});

app.get('/api/certificates/:id', (req, res) => {
  const id = String(req.params.id || '').toUpperCase().trim();
  const certs = readJSON(CERTS_PATH, []);
  const found = certs.find(
    (c) =>
      String(c.regNumber || c.id || '').toUpperCase().trim() === id ||
      String(c.regNumber || c.id || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase() ===
        id.replace(/[^a-zA-Z0-9]/g, '')
  );
  if (found) return res.json(found);
  return res.status(404).json({ error: 'Certificate not found' });
});

app.post('/api/certificates', (req, res) => {
  const cert = req.body;
  const certId = cert.regNumber || cert.id;
  if (!cert || !certId) {
    return res.status(400).json({ error: 'Invalid certificate payload' });
  }
  const certs = readJSON(CERTS_PATH, []);
  const existingIndex = certs.findIndex(
    (c) => String(c.regNumber || c.id || '').toUpperCase() === String(certId).toUpperCase()
  );

  const formattedCert = {
    regNumber: cert.regNumber || cert.id,
    id: cert.id || cert.regNumber,
    studentName: cert.studentName,
    fatherName: cert.fatherName || '',
    courseName: cert.courseName || cert.course || 'Vocational Trade',
    course: cert.course || cert.courseName || 'Vocational Trade',
    grade: cert.grade || 'A Grade',
    percentage: cert.percentage || '85%',
    issueDate: cert.issueDate || new Date().toLocaleDateString(),
    validUntil: cert.validUntil || 'Lifetime Valid',
    status: cert.status || 'Valid',
    isValid: cert.status === 'Valid' || cert.isValid !== false,
    instituteCenter: cert.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
    remarks: cert.remarks || 'Practical Training Certified',
  };

  if (existingIndex >= 0) {
    certs[existingIndex] = formattedCert;
  } else {
    certs.unshift(formattedCert);
  }
  writeJSON(CERTS_PATH, certs);
  return res.status(201).json(formattedCert);
});

app.delete('/api/certificates/:id', (req, res) => {
  const id = String(req.params.id || '').toUpperCase().trim();
  let certs = readJSON(CERTS_PATH, []);
  certs = certs.filter(
    (c) => String(c.regNumber || c.id || '').toUpperCase().trim() !== id
  );
  writeJSON(CERTS_PATH, certs);
  return res.json({ success: true, message: 'Certificate deleted' });
});

// ----------------------
// LEADS / INQUIRIES API
// ----------------------
app.get('/api/inquiries', (req, res) => {
  const leads = readJSON(LEADS_PATH, []);
  res.json(leads);
});

app.post('/api/inquiries', (req, res) => {
  const lead = req.body;
  if (!lead || !lead.name || !lead.phone) {
    return res.status(400).json({ error: 'Name and Phone are required' });
  }
  const leads = readJSON(LEADS_PATH, []);
  const newLead = {
    id: lead.id || `lead-${Date.now()}`,
    name: lead.name,
    phone: lead.phone,
    email: lead.email || '',
    course: lead.course || lead.courseName || 'General Inquiry',
    qualification: lead.qualification || 'Not Specified',
    message: lead.message || '',
    date: lead.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: lead.status || 'New',
  };
  leads.unshift(newLead);
  writeJSON(LEADS_PATH, leads);
  return res.status(201).json(newLead);
});

app.patch('/api/inquiries/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const leads = readJSON(LEADS_PATH, []);
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found' });
  leads[idx] = { ...leads[idx], ...updates };
  writeJSON(LEADS_PATH, leads);
  return res.json(leads[idx]);
});

app.delete('/api/inquiries/:id', (req, res) => {
  const id = req.params.id;
  let leads = readJSON(LEADS_PATH, []);
  leads = leads.filter((l) => l.id !== id);
  writeJSON(LEADS_PATH, leads);
  return res.json({ success: true, message: 'Lead deleted' });
});

// ----------------------
// ANNOUNCEMENTS API
// ----------------------
app.get('/api/announcements', (req, res) => {
  const announcements = readJSON(ANNOUNCEMENTS_PATH, []);
  res.json(announcements);
});

app.post('/api/announcements', (req, res) => {
  const ann = req.body;
  if (!ann || !ann.title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const list = readJSON(ANNOUNCEMENTS_PATH, []);
  const newAnn = {
    id: ann.id || `ann-${Date.now()}`,
    title: ann.title,
    titleMr: ann.titleMr || ann.title,
    titleHi: ann.titleHi || ann.title,
    description: ann.description || '',
    descriptionMr: ann.descriptionMr || ann.description || '',
    tag: ann.tag || 'Notice',
    tagMr: ann.tagMr || 'सूचना',
    date: ann.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    icon: ann.icon || 'campaign',
    isNew: ann.isNew !== false,
  };
  list.unshift(newAnn);
  writeJSON(ANNOUNCEMENTS_PATH, list);
  return res.status(201).json(newAnn);
});

app.delete('/api/announcements/:id', (req, res) => {
  const id = req.params.id;
  let list = readJSON(ANNOUNCEMENTS_PATH, []);
  list = list.filter((a) => a.id !== id);
  writeJSON(ANNOUNCEMENTS_PATH, list);
  return res.json({ success: true, message: 'Announcement deleted' });
});

// ----------------------
// GOVERNMENT ORDERS & GR API
// ----------------------
app.get('/api/gr', (req, res) => {
  const grList = readJSON(GR_PATH, []);
  res.json(grList);
});

app.post('/api/gr', (req, res) => {
  const gr = req.body;
  if (!gr || !gr.titleMr || !gr.number) {
    return res.status(400).json({ error: 'Title in Marathi and GR Number are required' });
  }
  const grList = readJSON(GR_PATH, []);
  const grId = gr.id || `gr-${Date.now()}`;
  const existingIdx = grList.findIndex((item) => item.id === grId);

  const formattedGr = {
    id: grId,
    titleMr: gr.titleMr,
    titleEn: gr.titleEn || gr.titleMr,
    number: gr.number,
    date: gr.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    deptMr: gr.deptMr || 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: gr.deptEn || 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: gr.summaryMr || '',
    summaryEn: gr.summaryEn || gr.summaryMr || '',
    pdfPath: gr.pdfPath || '/gr/gr-01-diploma-course-recognition-2013.pdf',
    status: gr.status || 'GOVERNMENT RESOLUTION',
    badgeColor: gr.badgeColor || 'bg-[#002760] text-white',
    codeNumber: gr.codeNumber || '',
  };

  if (existingIdx >= 0) {
    grList[existingIdx] = formattedGr;
  } else {
    grList.unshift(formattedGr);
  }
  writeJSON(GR_PATH, grList);
  return res.status(201).json(formattedGr);
});

app.delete('/api/gr/:id', (req, res) => {
  const id = req.params.id;
  let grList = readJSON(GR_PATH, []);
  grList = grList.filter((item) => item.id !== id);
  writeJSON(GR_PATH, grList);
  return res.json({ success: true, message: 'Government GR deleted' });
});

app.post('/api/gr/reset', (req, res) => {
  try {
    if (fs.existsSync(GR_PATH)) {
      fs.unlinkSync(GR_PATH);
    }
  } catch (e) {}
  return res.json({ success: true, message: 'GR list reset to default' });
});

// ----------------------
// ADMISSIONS TOGGLE API
// ----------------------
app.get('/api/admissions', (req, res) => {
  const admissions = readJSON(ADMISSIONS_PATH, {});
  res.json(admissions);
});

app.post('/api/admissions', (req, res) => {
  const admissions = req.body;
  if (!admissions) return res.status(400).json({ error: 'Payload required' });
  writeJSON(ADMISSIONS_PATH, admissions);
  return res.json({ success: true, admissions });
});

// ----------------------
// REVIEWS / TESTIMONIALS API
// ----------------------
app.get('/api/reviews', (req, res) => {
  const reviews = readJSON(REVIEWS_PATH, []);
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const rev = req.body;
  if (!rev || !rev.name || !rev.comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }
  const list = readJSON(REVIEWS_PATH, []);
  const newRev = {
    id: rev.id || `rev-${Date.now()}`,
    name: rev.name,
    course: rev.course || 'Vocational Trade',
    rating: Number(rev.rating) || 5,
    comment: rev.comment,
    date: rev.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    verified: rev.verified !== false,
  };
  list.unshift(newRev);
  writeJSON(REVIEWS_PATH, list);
  return res.status(201).json(newRev);
});

app.delete('/api/reviews/:id', (req, res) => {
  const id = req.params.id;
  let list = readJSON(REVIEWS_PATH, []);
  list = list.filter((r) => r.id !== id);
  writeJSON(REVIEWS_PATH, list);
  return res.json({ success: true, message: 'Review deleted' });
});

// ----------------------
// CMS / SITE CONTENT & MEDIA API
// ----------------------
app.get('/api/content', (req, res) => {
  const content = readJSON(CONTENT_PATH, null);
  res.json(content || {});
});

app.post('/api/content', (req, res) => {
  const content = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Content payload required' });
  }
  writeJSON(CONTENT_PATH, content);
  return res.json({ success: true, message: 'Content saved successfully', content });
});

app.post('/api/content/reset', (req, res) => {
  try {
    if (fs.existsSync(CONTENT_PATH)) {
      fs.unlinkSync(CONTENT_PATH);
    }
  } catch (e) {}
  return res.json({ success: true, message: 'Content reset to default' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Abhinav Institute API Server running on http://localhost:${port}`));
