const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const CERTS_PATH = path.join(__dirname, 'certs.json');
const LEADS_PATH = path.join(__dirname, 'leads.json');
const ANNOUNCEMENTS_PATH = path.join(__dirname, 'announcements.json');
const COURSES_PATH = path.join(__dirname, 'courses.json');
const CONTENT_PATH = path.join(__dirname, 'content.json');

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
