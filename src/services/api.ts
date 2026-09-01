import type { StudentCertificate, Review, Announcement } from '../types';
import { MOCK_CERTIFICATES, REVIEWS } from '../data/instituteData';
import { INITIAL_CERTIFICATES } from '../data/initialCertificates';
import { GOVERNMENT_GR_LIST, type GovernmentGrItem } from '../data/grData';

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : '/api';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  qualification: string;
  message?: string;
  date: string;
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed';
}

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Rohan Deshmukh',
    phone: '+91 98220 11234',
    email: 'rohan.d@gmail.com',
    course: 'Electrician (Wireman & Industrial)',
    qualification: '10th Passed',
    message: 'Need info about upcoming morning batch timings and fees.',
    date: '14 Feb 2025',
    status: 'New',
  },
  {
    id: 'lead-102',
    name: 'Pooja Patil',
    phone: '+91 97654 44321',
    email: 'pooja.patil99@gmail.com',
    course: 'Solar Technician & Rooftop PV',
    qualification: '12th Science',
    message: 'Inquiring for Govt subsidized solar installation training.',
    date: '13 Feb 2025',
    status: 'Contacted',
  },
  {
    id: 'lead-103',
    name: 'Nitin Chaudhari',
    phone: '+91 94222 87654',
    email: 'nitin.c@outlook.com',
    course: 'RAC & Inverter AC Specialist',
    qualification: 'ITI Diploma',
    message: 'Looking for fast-track AC repair certification course.',
    date: '12 Feb 2025',
    status: 'Enrolled',
  },
];

// Helper to seed initial certificates map
function getInitialCertificatesMap(): Record<string, StudentCertificate> {
  const map: Record<string, StudentCertificate> = { ...MOCK_CERTIFICATES };
  INITIAL_CERTIFICATES.forEach((c) => {
    map[c.id] = {
      regNumber: c.id,
      studentName: c.studentName,
      courseName: c.course,
      grade: c.grade,
      percentage: '88.0%',
      issueDate: c.issueDate,
      validUntil: 'Lifetime Valid',
      status: c.isValid ? 'Valid' : 'Expired',
      instituteCenter: 'Abhinav Technical Institute, Main Campus Jalgaon',
    };
  });
  return map;
}

// ----------------------
// CERTIFICATES
// ----------------------
export async function fetchCertificates(): Promise<Record<string, StudentCertificate>> {
  try {
    const res = await fetch(`${API_BASE}/certificates`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const map: Record<string, StudentCertificate> = {};
        data.forEach((c: any) => {
          const key = c.regNumber || c.id;
          map[key] = {
            regNumber: key,
            studentName: c.studentName,
            courseName: c.courseName || c.course,
            grade: c.grade || 'A Grade',
            percentage: c.percentage || '85%',
            issueDate: c.issueDate || 'Recent',
            validUntil: c.validUntil || 'Lifetime Valid',
            status: c.status || (c.isValid !== false ? 'Valid' : 'Expired'),
            instituteCenter: c.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
          };
        });
        localStorage.setItem('ati_certificates', JSON.stringify(map));
        return map;
      }
    }
  } catch (e) {
    // API failed or offline -> fallback to localStorage
  }

  const stored = localStorage.getItem('ati_certificates');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  const initial = getInitialCertificatesMap();
  localStorage.setItem('ati_certificates', JSON.stringify(initial));
  return initial;
}

export async function getCertificateById(id: string): Promise<StudentCertificate | null> {
  const cleaned = id.trim().toUpperCase();
  try {
    const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(cleaned)}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const c = await res.json();
      return {
        regNumber: c.regNumber || c.id,
        studentName: c.studentName,
        courseName: c.courseName || c.course,
        grade: c.grade || 'A Grade',
        percentage: c.percentage || '85%',
        issueDate: c.issueDate || 'Recent',
        validUntil: c.validUntil || 'Lifetime Valid',
        status: c.status || (c.isValid !== false ? 'Valid' : 'Expired'),
        instituteCenter: c.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
      };
    }
  } catch (e) {}

  const all = await fetchCertificates();
  const matchedKey = Object.keys(all).find(
    (k) =>
      k.toUpperCase() === cleaned ||
      k.replace(/[^a-zA-Z0-9]/g, '') === cleaned.replace(/[^a-zA-Z0-9]/g, '')
  );
  if (matchedKey) return all[matchedKey];
  return null;
}

export async function saveCertificate(cert: StudentCertificate): Promise<StudentCertificate> {
  try {
    await fetch(`${API_BASE}/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cert),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const all = await fetchCertificates();
  all[cert.regNumber] = cert;
  localStorage.setItem('ati_certificates', JSON.stringify(all));
  return cert;
}

export async function deleteCertificate(regNumber: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/certificates/${encodeURIComponent(regNumber)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const all = await fetchCertificates();
  delete all[regNumber];
  localStorage.setItem('ati_certificates', JSON.stringify(all));
  return true;
}

// ----------------------
// LEADS / INQUIRIES
// ----------------------
export async function fetchLeads(): Promise<Lead[]> {
  try {
    const res = await fetch(`${API_BASE}/inquiries`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('ati_leads', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  const stored = localStorage.getItem('ati_leads');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  localStorage.setItem('ati_leads', JSON.stringify(INITIAL_LEADS));
  return INITIAL_LEADS;
}

export async function saveLead(lead: Partial<Lead>): Promise<Lead> {
  const newLead: Lead = {
    id: lead.id || `lead-${Date.now()}`,
    name: lead.name || 'Student Candidate',
    phone: lead.phone || '',
    email: lead.email || '',
    course: lead.course || 'Vocational Trade Inquiry',
    qualification: lead.qualification || 'Not Specified',
    message: lead.message || '',
    date:
      lead.date ||
      new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    status: (lead.status as any) || 'New',
  };

  try {
    await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchLeads();
  const updated = [newLead, ...current.filter((l) => l.id !== newLead.id)];
  localStorage.setItem('ati_leads', JSON.stringify(updated));
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: 'New' | 'Contacted' | 'Enrolled' | 'Closed'
): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/inquiries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchLeads();
  const updated = current.map((l) => (l.id === id ? { ...l, status } : l));
  localStorage.setItem('ati_leads', JSON.stringify(updated));
  return true;
}

export async function deleteLead(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/inquiries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchLeads();
  const updated = current.filter((l) => l.id !== id);
  localStorage.setItem('ati_leads', JSON.stringify(updated));
  return true;
}

// ----------------------
// GOVERNMENT ORDERS & GR API
// ----------------------
export async function fetchGovernmentGrs(): Promise<GovernmentGrItem[]> {
  try {
    const res = await fetch(`${API_BASE}/gr`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('ati_government_grs', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  const stored = localStorage.getItem('ati_government_grs');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }

  localStorage.setItem('ati_government_grs', JSON.stringify(GOVERNMENT_GR_LIST));
  return GOVERNMENT_GR_LIST;
}

export async function saveGovernmentGr(gr: GovernmentGrItem): Promise<GovernmentGrItem> {
  let savedResult: GovernmentGrItem | null = null;
  try {
    const res = await fetch(`${API_BASE}/gr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gr),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      savedResult = await res.json();
    }
  } catch (e) {}

  const finalGr = savedResult || gr;
  const current = await fetchGovernmentGrs();
  const existingIdx = current.findIndex((item) => item.id === finalGr.id);
  let updated: GovernmentGrItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = finalGr;
  } else {
    updated = [finalGr, ...current];
  }
  localStorage.setItem('ati_government_grs', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ati_gr_updated', { detail: updated }));
  return finalGr;
}

export async function deleteGovernmentGr(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/gr/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchGovernmentGrs();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem('ati_government_grs', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('ati_gr_updated', { detail: updated }));
  return true;
}

export async function resetGovernmentGrs(): Promise<GovernmentGrItem[]> {
  try {
    await fetch(`${API_BASE}/gr/reset`, {
      method: 'POST',
      signal: AbortSignal.timeout(2000),
    });
  } catch (e) {}

  localStorage.setItem('ati_government_grs', JSON.stringify(GOVERNMENT_GR_LIST));
  window.dispatchEvent(new CustomEvent('ati_gr_updated', { detail: GOVERNMENT_GR_LIST }));
  return GOVERNMENT_GR_LIST;
}

// ----------------------
// ADMISSIONS TOGGLE API
// ----------------------
export async function fetchAdmissions(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`${API_BASE}/admissions`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        localStorage.setItem('ati_course_admissions', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  const stored = localStorage.getItem('ati_course_admissions');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return {};
}

export async function saveAdmissions(admissions: Record<string, boolean>): Promise<Record<string, boolean>> {
  try {
    await fetch(`${API_BASE}/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(admissions),
      signal: AbortSignal.timeout(2500),
    });
  } catch (e) {}

  localStorage.setItem('ati_course_admissions', JSON.stringify(admissions));
  window.dispatchEvent(new CustomEvent('ati_admissions_updated', { detail: admissions }));
  return admissions;
}

// ----------------------
// ANNOUNCEMENTS
// ----------------------
export async function deleteAnnouncement(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/announcements/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}
  return true;
}

// ----------------------
// REVIEWS / TESTIMONIALS
// ----------------------
export async function fetchReviews(): Promise<Review[]> {
  try {
    const res = await fetch(`${API_BASE}/reviews`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem('ati_reviews', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  const stored = localStorage.getItem('ati_reviews');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  localStorage.setItem('ati_reviews', JSON.stringify(REVIEWS));
  return REVIEWS;
}

export async function saveReview(review: Review): Promise<Review> {
  try {
    await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchReviews();
  const updated = [review, ...current.filter((r) => r.id !== review.id)];
  localStorage.setItem('ati_reviews', JSON.stringify(updated));
  return review;
}

export async function deleteReview(id: string): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  const current = await fetchReviews();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem('ati_reviews', JSON.stringify(updated));
  return true;
}
