import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Plus, Trash2, Download, Search, Award,
  CheckCircle2, XCircle, RefreshCw, Eye
} from 'lucide-react';

import { INITIAL_CERTIFICATES } from '../data/initialCertificates';

export interface Certificate {
  id: string;           // e.g. ATI-2024-000123
  studentName: string;
  fatherName: string;
  course: string;
  grade: string;        // A+, A, B+, B, C
  startDate: string;
  endDate: string;
  issueDate: string;
  isValid: boolean;
  remarks?: string;
}

const COURSES = [
  'Electrician Trade Training',
  'Technical Institutes Trade',
  'Online Computer Training',
  'Vocational Training Centres',
  'Colleges / Higher Education',
  'Institutes & Academy',
  'Consultancy Services',
  'Annual Maintenance (AMC)',
];

const GRADES = ['A+', 'A', 'B+', 'B', 'C', 'Pass'];

// Generates a unique certificate ID
const generateCertId = () => {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ATI-${year}-${rand}`;
};

// Generates QR data URL for a given certificate ID
const generateQR = async (certId: string): Promise<string> => {
  const verifyUrl = `${window.location.origin}${window.location.pathname}#verify?id=${certId}`;
  return await QRCode.toDataURL(verifyUrl, {
    width: 200,
    margin: 1,
    color: { dark: '#0f172a', light: '#ffffff' },
  });
};

const CertificateManager: React.FC = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [form, setForm] = useState({
    studentName: '',
    fatherName: '',
    course: COURSES[0],
    grade: 'A',
    startDate: '',
    endDate: '',
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('abhinav_certificates');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCerts(parsed);
          return;
        }
      } catch {
        // fallback
      }
    }
    setCerts(INITIAL_CERTIFICATES);
    localStorage.setItem('abhinav_certificates', JSON.stringify(INITIAL_CERTIFICATES));
  }, []);

  const save = (updated: Certificate[]) => {
    setCerts(updated);
    localStorage.setItem('abhinav_certificates', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: Certificate = {
      id: generateCertId(),
      ...form,
      issueDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      isValid: true,
    };

    // Attempt to register certificate with the server-backed registry (Pages Functions)
    try {
      const resp = await fetch(`/api/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCert),
      });
      if (resp.ok) {
        const created = await resp.json();
        save([created, ...certs]);
      } else {
        // Fallback to local client storage if server rejects
        save([newCert, ...certs]);
      }
    } catch (err) {
      // Network error — save locally so issuance still works offline
      save([newCert, ...certs]);
    }

    setForm({ studentName: '', fatherName: '', course: COURSES[0], grade: 'A', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const toggleValidity = (id: string) => {
    const updated = certs.map(c => c.id === id ? { ...c, isValid: !c.isValid } : c);
    save(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Permanently delete this certificate?')) {
      save(certs.filter(c => c.id !== id));
    }
  };

  const handleDownloadPDF = async (cert: Certificate) => {
    const qrDataUrl = await generateQR(cert.id);
    const verifyUrl = `${window.location.origin}${window.location.pathname}#verify?id=${cert.id}`;

    const win = window.open('', '_blank');
    if (!win) { alert('Enable pop-ups to download certificate PDF.'); return; }

    win.document.write(`<!DOCTYPE html>
<html><head>
  <title>Certificate - ${cert.studentName}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    @page { size: A4 landscape; margin: 0; }
    body { font-family: 'Georgia', serif; background: #fff; }
    .page {
      width: 297mm; height: 210mm; position: relative; overflow: hidden;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 18mm 20mm;
    }
    /* Ornamental border */
    .border-outer {
      position: absolute; inset: 6mm;
      border: 4px solid #b45309; border-radius: 4px;
    }
    .border-inner {
      position: absolute; inset: 9mm;
      border: 1.5px solid #fbbf24; border-radius: 2px;
    }
    /* Corner ornaments */
    .corner { position: absolute; width: 18mm; height: 18mm; }
    .corner svg { width: 100%; height: 100%; }
    .tl { top: 5mm; left: 5mm; }
    .tr { top: 5mm; right: 5mm; transform: scaleX(-1); }
    .bl { bottom: 5mm; left: 5mm; transform: scaleY(-1); }
    .br { bottom: 5mm; right: 5mm; transform: scale(-1); }
    /* Header */
    .institute-logo { width: 18mm; height: 18mm; object-fit: contain; margin-bottom: 3mm; }
    .header-title { font-size: 11pt; color: #92400e; letter-spacing: 3px; text-transform: uppercase; font-family: 'Georgia', serif; }
    .divider { width: 80mm; height: 0.5mm; background: linear-gradient(90deg, transparent, #b45309, transparent); margin: 2.5mm auto; }
    .cert-title { font-size: 28pt; color: #1e293b; font-family: 'Georgia', serif; margin: 2mm 0 1mm; letter-spacing: 2px; }
    .cert-sub { font-size: 9pt; color: #64748b; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 5mm; }
    .body-text { font-size: 11pt; color: #374151; text-align: center; line-height: 1.8; }
    .student-name {
      font-size: 22pt; color: #92400e; font-family: 'Georgia', serif;
      font-style: italic; border-bottom: 1px solid #fbbf24;
      padding: 0 10mm 1mm; display: inline-block; margin: 1mm 0;
    }
    .course-name { font-weight: bold; font-size: 13pt; color: #1e293b; }
    .grade-badge {
      display: inline-block; background: #fef3c7; border: 1px solid #f59e0b;
      color: #92400e; font-weight: bold; font-size: 11pt;
      padding: 0.5mm 5mm; border-radius: 2px; margin-left: 2mm;
    }
    /* Footer */
    .footer { position: absolute; bottom: 14mm; left: 20mm; right: 20mm; display: flex; justify-content: space-between; align-items: flex-end; }
    .sign-block { text-align: center; }
    .sign-line { width: 45mm; height: 0.5px; background: #94a3b8; margin: 0 auto 1.5mm; }
    .sign-label { font-size: 7.5pt; color: #64748b; letter-spacing: 1px; text-transform: uppercase; }
    .qr-block { text-align: center; }
    .qr-block img { width: 22mm; height: 22mm; display: block; margin: 0 auto 1.5mm; }
    .cert-id { font-size: 6.5pt; color: #94a3b8; font-family: monospace; }
    .verify-url { font-size: 5.5pt; color: #94a3b8; margin-top: 0.5mm; }
    /* Watermark */
    .watermark {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 60pt; color: rgba(180,83,9,0.04);
      font-family: 'Georgia', serif; white-space: nowrap; pointer-events: none;
      letter-spacing: 8px; text-transform: uppercase;
    }
    .validity-ribbon {
      position: absolute; top: 14mm; right: 14mm;
      background: ${cert.isValid ? '#d1fae5' : '#fee2e2'};
      color: ${cert.isValid ? '#065f46' : '#991b1b'};
      border: 1px solid ${cert.isValid ? '#6ee7b7' : '#fca5a5'};
      font-size: 7pt; font-weight: bold; letter-spacing: 2px;
      text-transform: uppercase; padding: 1mm 4mm; border-radius: 2px;
    }
  </style>
</head>
<body>
<div class="page">
  <div class="border-outer"></div>
  <div class="border-inner"></div>
  <!-- Corner ornaments -->
  <div class="corner tl"><svg viewBox="0 0 100 100"><path d="M5,5 L5,40 M5,5 L40,5" stroke="#b45309" stroke-width="6" fill="none"/><path d="M5,70 L5,95 L30,95" stroke="#b45309" stroke-width="3" fill="none" transform="rotate(180,50,50)"/></svg></div>
  <div class="corner tr"><svg viewBox="0 0 100 100"><path d="M5,5 L5,40 M5,5 L40,5" stroke="#b45309" stroke-width="6" fill="none"/></svg></div>
  <div class="corner bl"><svg viewBox="0 0 100 100"><path d="M5,5 L5,40 M5,5 L40,5" stroke="#b45309" stroke-width="6" fill="none"/></svg></div>
  <div class="corner br"><svg viewBox="0 0 100 100"><path d="M5,5 L5,40 M5,5 L40,5" stroke="#b45309" stroke-width="6" fill="none"/></svg></div>

  <div class="watermark">Abhinav Technical</div>
  <div class="validity-ribbon">${cert.isValid ? '✓ Valid Certificate' : '✗ Revoked'}</div>

  <!-- Header -->
  <div style="text-align:center; margin-bottom:4mm;">
    <img class="institute-logo" src="https://image1.jdomni.in/defaultogimages/v2/A/T/AT.png" alt="logo" />
    <div class="header-title">Abhinav Technical Institute of Industrial Training</div>
    <div style="font-size:7.5pt; color:#92400e; letter-spacing:1px; margin-top:0.5mm;">
      First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India &nbsp;|&nbsp; Ph: +91 94234 88174 / 70404 16582
    </div>
  </div>

  <div class="divider"></div>
  <div class="cert-title">Certificate of Completion</div>
  <div class="cert-sub">Skill Development &amp; Industrial Training</div>
  <div class="divider"></div>

  <div class="body-text" style="margin-top:4mm;">
    This is to certify that
    <br />
    <span class="student-name">${cert.studentName}</span>
    <br />
    <span style="font-size:9pt; color:#64748b;">S/O · D/O &nbsp;${cert.fatherName}</span>
    <br /><br />
    has successfully completed the course in
    <br />
    <span class="course-name">${cert.course}</span>
    &nbsp; with Grade &nbsp; <span class="grade-badge">${cert.grade}</span>
    <br /><br />
    <span style="font-size:9pt; color:#64748b;">
      Training Period: ${cert.startDate} &nbsp;–&nbsp; ${cert.endDate}
    </span>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="sign-block">
      <div class="sign-line"></div>
      <div class="sign-label">Examiner / Instructor</div>
    </div>
    <div class="sign-block">
      <div style="font-size:8pt; color:#94a3b8; margin-bottom:1.5mm;">Issue Date: ${cert.issueDate}</div>
      <div class="sign-line"></div>
      <div class="sign-label">Director &nbsp;|&nbsp; Punjo Patil</div>
    </div>
    <div class="qr-block">
      <img src="${qrDataUrl}" alt="Verify QR" />
      <div class="cert-id">${cert.id}</div>
      <div class="verify-url">Scan to verify &nbsp;|&nbsp; ${verifyUrl.replace('https://', '')}</div>
    </div>
  </div>
</div>
<script>window.onload=()=>{ window.print(); setTimeout(()=>window.close(),500); };</script>
</body></html>`);
    win.document.close();
  };

  const filtered = certs.filter(c =>
    c.studentName.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase()) ||
    c.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <h4 className="font-bold text-slate-900">Certificate Registry</h4>
          <p className="text-xs text-slate-500 mt-0.5">{certs.length} certificate{certs.length !== 1 ? 's' : ''} issued</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name / ID / course..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl w-full sm:w-56 focus:outline-none focus:border-orangeAccent"
            />
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-orangeAccent hover:bg-orangeAccent-dark text-white rounded-xl shadow-sm transition-all shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Issue Certificate
          </button>
        </div>
      </div>

      {/* Issue Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-orange-50/50 border border-orange-200 rounded-2xl p-6 space-y-4">
          <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Award className="h-4 w-4 text-orangeAccent" />
            Issue New Certificate
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Student Full Name *</label>
              <input required value={form.studentName} onChange={e => setForm(p => ({ ...p, studentName: e.target.value }))}
                placeholder="e.g. Rahul Sharma" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Father's / Guardian's Name *</label>
              <input required value={form.fatherName} onChange={e => setForm(p => ({ ...p, fatherName: e.target.value }))}
                placeholder="e.g. Suresh Sharma" className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Course / Trade *</label>
              <select required value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white">
                {COURSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Grade Awarded *</label>
              <select required value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white">
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Training Start Date *</label>
              <input required type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Training End Date *</label>
              <input required type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-orangeAccent bg-white" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 bg-orangeAccent hover:bg-orangeAccent-dark text-white text-xs font-semibold rounded-xl shadow-sm">
              Generate & Issue Certificate
            </button>
          </div>
        </form>
      )}

      {/* Certificate List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Award className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="font-semibold text-slate-500 text-sm">{search ? 'No matching certificates' : 'No certificates issued yet'}</p>
          <p className="text-xs text-slate-400 mt-1">Use "Issue Certificate" to generate your first QR-verified certificate.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cert => (
            <div key={cert.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${cert.isValid ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <Award className={`h-5 w-5 ${cert.isValid ? 'text-emerald-500' : 'text-red-400'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{cert.studentName}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                      cert.isValid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {cert.isValid ? '✓ Valid' : '✗ Revoked'}
                    </span>
                    <span className="text-[9px] font-bold bg-orange-50 text-orangeAccent border border-orange-200 px-2 py-0.5 rounded-full uppercase">
                      Grade {cert.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{cert.course}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{cert.id} &nbsp;·&nbsp; Issued: {cert.issueDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button onClick={() => setPreviewCert(cert)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-xl transition-colors" title="Preview verify page">
                  <Eye className="h-4 w-4" />
                </button>
                <button onClick={() => handleDownloadPDF(cert)}
                  className="inline-flex items-center px-3 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all shadow-sm">
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download PDF
                </button>
                <button onClick={() => toggleValidity(cert.id)}
                  className={`p-2 rounded-xl transition-colors ${cert.isValid
                    ? 'bg-red-50 hover:bg-red-100 text-red-500'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-500'}`}
                  title={cert.isValid ? 'Revoke certificate' : 'Reinstate certificate'}>
                  {cert.isValid ? <XCircle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                </button>
                <button onClick={() => handleDelete(cert.id)}
                  className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-colors" title="Delete permanently">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline Preview Modal */}
      {previewCert && (
        <CertPreviewModal cert={previewCert} onClose={() => setPreviewCert(null)} />
      )}
    </div>
  );
};

// Mini preview modal of how the verification page looks
const CertPreviewModal: React.FC<{ cert: Certificate; onClose: () => void }> = ({ cert, onClose }) => {
  const [qrUrl, setQrUrl] = useState('');
  const verifyUrl = `${window.location.origin}${window.location.pathname}#verify?id=${cert.id}`;

  useEffect(() => {
    generateQR(cert.id).then(setQrUrl);
  }, [cert.id]);

  const copyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    alert('Verification link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
          <CheckCircle2 className="h-6 w-6" />
          <span className="font-bold text-lg font-serif">Certificate Preview</span>
        </div>

        {qrUrl && <img src={qrUrl} alt="QR Code" className="w-36 h-36 mx-auto border-4 border-slate-100 rounded-xl p-1" />}

        <div className="space-y-1 text-left bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Certificate ID</span>
            <span className="font-mono font-bold text-slate-800">{cert.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Student</span>
            <span className="font-bold text-slate-800">{cert.studentName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Course</span>
            <span className="font-bold text-slate-800 text-right max-w-[55%]">{cert.course}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Status</span>
            <span className={`font-bold ${cert.isValid ? 'text-emerald-600' : 'text-red-500'}`}>
              {cert.isValid ? '✓ Genuine & Valid' : '✗ Revoked'}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 break-all">{verifyUrl}</p>

        <div className="flex gap-2">
          <button onClick={copyLink}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all">
            Copy Link
          </button>
          <button onClick={onClose}
            className="flex-1 py-2 bg-orangeAccent hover:bg-orangeAccent-dark text-white text-xs font-semibold rounded-xl transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateManager;
