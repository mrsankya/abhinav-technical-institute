import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, Lock, LogOut, Award, BookOpen, Users,
  Settings, Megaphone, Database, CheckCircle2, XCircle,
  Download, Upload, Trash2, Phone, Search, RefreshCw,
  ExternalLink, FileText, Sparkles, AlertTriangle, KeyRound,
  BarChart3, ArrowLeft, Plus, Eye, Edit3, MessageSquare,
  ArrowUp, ArrowDown, Camera, School
} from 'lucide-react';
import CertificateManager from './CertificateManager';
import SyllabusAdmin from './SyllabusAdmin';
import type { Inquiry, Certificate, Syllabus, Course } from '../types';
import { INITIAL_CERTIFICATES } from '../data/initialCertificates';
import { INITIAL_SYLLABUS_LIST } from '../data/initialSyllabus';
import { COURSES } from '../data/instituteData';
import {
  fetchSiteContent,
  saveSiteContent,
  INITIAL_SITE_CONTENT,
  type SiteContent,
} from '../services/cms';
import { saveAdmissions } from '../services/api';
import { compressAndReadFile } from '../utils/imageUtils';

interface SuperAdminDashboardProps {
  onBackToHome: () => void;
}

type TabType = 'overview' | 'certificates' | 'syllabus' | 'leads' | 'courses' | 'notice' | 'backup';

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onBackToHome }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Stats & State
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [admissions, setAdmissions] = useState<Record<string, boolean>>({});
  const [notice, setNotice] = useState('');

  // Course Management State
  const [courseSearch, setCourseSearch] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'add' | 'edit'>('add');
  const [courseForm, setCourseForm] = useState<Course>({
    id: '',
    name: '',
    nameMr: '',
    code: '',
    category: 'Electrical & Power Trades',
    categoryMr: 'इलेक्ट्रिकल व पॉवर ट्रेड्स',
    description: '',
    descriptionMr: '',
    fullDescription: '',
    fullDescriptionMr: '',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / ITI / Graduate',
    eligibilityMr: '१० वी किंवा १२ वी किंवा पदवीधर',
    syllabus: [
      'Workshop Technology & Electrical Safety',
      'Practical Circuit Connections & Measurements',
      'Industrial Machinery & Maintenance',
    ],
    syllabusMr: [
      'कार्यशाळा तंत्रज्ञान व इलेक्ट्रिकल सुरक्षा',
      'प्रत्यक्ष सर्किट जोडणी व मोजमापे',
      'औद्योगिक मशिनरी व मेंटेनन्स',
    ],
    careerOpportunities: [
      'Govt & PWD Registered Electrical Contractor',
      'Industrial Maintenance Wireman / Technician',
      'Direct 2nd Year Entry to Diploma Engineering',
    ],
    careerOpportunitiesMr: [
      'शासकीय व पीडब्ल्यूडी अधिकृत इलेक्ट्रिकल कंत्राटदार',
      'औद्योगिक मेंटेनन्स वायरमन / तंत्रज्ञ',
      'थेट द्वितीय वर्ष डिप्लोमा प्रवेश',
    ],
    certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
    batchCapacity: 30,
    enrolled: 0,
  });

  // Leads Filter & Search
  const [leadSearch, setLeadSearch] = useState('');
  const [leadCourseFilter, setLeadCourseFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');

  // Backup & Restore State
  const [backupMsg, setBackupMsg] = useState('');

  // Check existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('abhinav_superadmin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load all system data
  const refreshAllData = () => {
    try {
      fetchSiteContent().then((content) => {
        if (content) setSiteContent(content);
      });

      const inqStored = localStorage.getItem('ati_leads') || localStorage.getItem('abhinav_inquiries');
      const inq = inqStored ? JSON.parse(inqStored) : [];
      setInquiries(inq);

      const certsStored = localStorage.getItem('ati_certificates') || localStorage.getItem('abhinav_certificates');
      let certsList: Certificate[] = [];
      if (certsStored) {
        const parsed = JSON.parse(certsStored);
        if (Array.isArray(parsed)) {
          certsList = parsed;
        } else if (typeof parsed === 'object') {
          certsList = Object.values(parsed).map((c: any) => ({
            id: c.regNumber || c.id,
            studentName: c.studentName,
            fatherName: c.fatherName || '',
            course: c.courseName || c.course,
            grade: c.grade || 'A Grade',
            startDate: c.startDate || '01-Aug-2023',
            endDate: c.endDate || '31-Jul-2024',
            issueDate: c.issueDate || 'Recent',
            isValid: c.status === 'Valid' || c.isValid !== false,
            remarks: c.remarks || '',
          }));
        }
      }
      setCertificates(certsList.length > 0 ? certsList : INITIAL_CERTIFICATES);

      const syl = JSON.parse(localStorage.getItem('abhinav_syllabi') || '[]');
      setSyllabi(syl.length > 0 ? syl : INITIAL_SYLLABUS_LIST);

      const admStored = localStorage.getItem('ati_course_admissions') || localStorage.getItem('abhinav_admissions');
      const adm = admStored ? JSON.parse(admStored) : {};
      setAdmissions(adm);

      const not = localStorage.getItem('abhinav_notice') || 
        'Welcome to Abhinav Technical Institute! Admissions are now open for the new academic batch. Contact us for details.';
      setNotice(not);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshAllData();
      window.addEventListener('storage', refreshAllData);
      const handleCms = (e: any) => {
        if (e.detail) setSiteContent(e.detail);
      };
      window.addEventListener('ati_cms_updated', handleCms);
      return () => {
        window.removeEventListener('storage', refreshAllData);
        window.removeEventListener('ati_cms_updated', handleCms);
      };
    }
  }, [isAuthenticated]);

  // Course Management Handlers
  const handleToggleCourseAdmission = async (courseId: string, courseName: string) => {
    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    const targetIdx = currentCourses.findIndex((c) => c.id === courseId || c.name === courseName || c.nameMr === courseName);
    if (targetIdx >= 0) {
      const currentStatus = currentCourses[targetIdx].admissionsOpen !== false;
      currentCourses[targetIdx] = {
        ...currentCourses[targetIdx],
        admissionsOpen: !currentStatus,
      };
      const updatedSite = { ...siteContent, courses: currentCourses };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      
      const newAdmissions = { ...admissions, [courseId]: !currentStatus, [courseName]: !currentStatus };
      setAdmissions(newAdmissions);
      await saveAdmissions(newAdmissions);
      
      setBackupMsg(`Admissions for "${currentCourses[targetIdx].nameMr || currentCourses[targetIdx].name}" set to ${!currentStatus ? 'OPEN' : 'CLOSED'} and saved in database.`);
      setTimeout(() => setBackupMsg(''), 4000);
    }
  };

  const handleUploadCoursePhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1200, 800, 0.85);
      const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
      currentCourses[index] = { ...currentCourses[index], image: dataUrl };
      const updatedSite = { ...siteContent, courses: currentCourses };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      setBackupMsg(`Updated course photo for ${currentCourses[index].name} and saved to database.`);
      setTimeout(() => setBackupMsg(''), 4000);
    } catch {
      alert('Failed to read image');
    }
  };

  const handleUploadModalCoursePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1200, 800, 0.85);
      setCourseForm((prev) => ({ ...prev, image: dataUrl }));
    } catch {
      alert('Failed to read image');
    }
  };

  const handleOpenAddCourse = () => {
    const defaultId = `course-${Date.now()}`;
    setCourseForm({
      id: defaultId,
      name: '',
      nameMr: '',
      code: '304' + Math.floor(100 + Math.random() * 900),
      category: 'Technical Vocational Trade',
      categoryMr: 'तांत्रिक व्यवसाय अभ्यासक्रम',
      description: '',
      descriptionMr: '',
      fullDescription: '',
      fullDescriptionMr: '',
      duration: '1 Year',
      durationMr: '१ वर्ष कालावधी',
      timing: '10:00 AM - 2:00 PM',
      timingMr: 'सकाळी १०:०० ते दुपारी २:००',
      startDate: 'प्रवेश सुरू (Admissions Open)',
      startDateMr: 'प्रवेश सुरू (Admissions Open)',
      admissionsOpen: true,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      eligibility: '10th / 12th / ITI / Graduate',
      eligibilityMr: '१० वी किंवा १२ वी किंवा पदवीधर',
      syllabus: [
        'Workshop Technology & Safety (TH-1)',
        'Practical Circuit Assembly & Measurements (PR-1)',
        'Industrial Machine Operations & Troubleshooting',
      ],
      syllabusMr: [
        'कार्यशाळा तंत्रज्ञान व सुरक्षा (थियरी-१)',
        'प्रत्यक्ष सर्किट असेंब्ली व मोजमापे (प्रॅक्टिकल-१)',
        'औद्योगिक मशीन कार्यप्रणाली व समस्या निवारण',
      ],
      careerOpportunities: [
        'Govt & PWD Registered Contractor',
        'Industrial Maintenance Technician',
        'Self-Employed Workshop Entrepreneur',
      ],
      careerOpportunitiesMr: [
        'शासकीय व पीडब्ल्यूडी नोंदणीकृत कंत्राटदार',
        'औद्योगिक मेंटेनन्स तंत्रज्ञ',
        'स्वतःचा स्वतंत्र उद्योग / व्यवसाय',
      ],
      certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
      batchCapacity: 30,
      enrolled: 0,
    });
    setCourseModalMode('add');
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course: Course) => {
    setCourseForm({
      ...course,
      syllabus: course.syllabus || [],
      syllabusMr: course.syllabusMr || [],
      careerOpportunities: course.careerOpportunities || [],
      careerOpportunitiesMr: course.careerOpportunitiesMr || [],
    });
    setCourseModalMode('edit');
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.nameMr) {
      alert('Please enter both the English and Marathi course names.');
      return;
    }

    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    let updatedCourses: Course[];

    if (courseModalMode === 'add') {
      const newEntry: Course = {
        ...courseForm,
        id: courseForm.id.trim() || `course-${Date.now()}`,
      };
      updatedCourses = [newEntry, ...currentCourses];
    } else {
      updatedCourses = currentCourses.map((c) => (c.id === courseForm.id ? { ...courseForm } : c));
    }

    const updatedSite = { ...siteContent, courses: updatedCourses };
    setSiteContent(updatedSite);
    await saveSiteContent(updatedSite);
    setIsCourseModalOpen(false);
    setBackupMsg(
      courseModalMode === 'add'
        ? `Course "${courseForm.nameMr}" added and saved in Cloudflare database!`
        : `Course "${courseForm.nameMr}" updated in Cloudflare database!`
    );
    setTimeout(() => setBackupMsg(''), 4000);
  };

  const handleDeleteCourse = async (courseId: string) => {
    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    const target = currentCourses.find((c) => c.id === courseId);
    if (window.confirm(`Are you sure you want to permanently delete course "${target?.nameMr || target?.name || courseId}"?`)) {
      const updatedCourses = currentCourses.filter((c) => c.id !== courseId);
      const updatedSite = { ...siteContent, courses: updatedCourses };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      setBackupMsg(`Course "${target?.nameMr || target?.name || courseId}" removed from database.`);
      setTimeout(() => setBackupMsg(''), 4000);
    }
  };

  const handleMoveCourseOrder = async (index: number, direction: 'up' | 'down') => {
    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentCourses.length) return;

    const temp = currentCourses[index];
    currentCourses[index] = currentCourses[targetIndex];
    currentCourses[targetIndex] = temp;

    const updatedSite = { ...siteContent, courses: currentCourses };
    setSiteContent(updatedSite);
    await saveSiteContent(updatedSite);
    setBackupMsg('Course display order reordered.');
    setTimeout(() => setBackupMsg(''), 3000);
  };

  const handleResetCourseCatalog = async () => {
    if (window.confirm('Reset course catalog back to official 10 MSBSVET trade presets?')) {
      const updatedSite = { ...siteContent, courses: COURSES };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      setBackupMsg('Course catalog reset to official 10 trade defaults.');
      setTimeout(() => setBackupMsg(''), 4000);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = password.trim();
    if (clean === '9822725265') {
      setIsAuthenticated(true);
      sessionStorage.setItem('abhinav_superadmin_auth', 'true');
      setError('');
    } else {
      setError('Invalid Super Admin authorization key. Access restricted.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('abhinav_superadmin_auth');
    setPassword('');
  };

  // Update Lead Status
  const handleUpdateLeadStatus = (id: string, newStatus: Inquiry['status']) => {
    const updated = inquiries.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setInquiries(updated);
    localStorage.setItem('abhinav_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Add Counselor Note to Lead
  const handleUpdateLeadNotes = (id: string, notes: string) => {
    const updated = inquiries.map(item => item.id === id ? { ...item, notes } : item);
    setInquiries(updated);
    localStorage.setItem('abhinav_inquiries', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  // Delete Lead
  const handleDeleteLead = (id: string) => {
    if (window.confirm('Delete this lead record permanently?')) {
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      localStorage.setItem('abhinav_inquiries', JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
    }
  };

  // Master JSON Export
  const handleExportSystemBackup = () => {
    const fullBackup = {
      system: 'Abhinav Technical Institute Portal',
      timestamp: new Date().toISOString(),
      inquiries: JSON.parse(localStorage.getItem('abhinav_inquiries') || '[]'),
      certificates: JSON.parse(localStorage.getItem('abhinav_certificates') || '[]'),
      syllabi: JSON.parse(localStorage.getItem('abhinav_syllabi') || '[]'),
      admissions: JSON.parse(localStorage.getItem('abhinav_admissions') || '{}'),
      notice: localStorage.getItem('abhinav_notice') || '',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ATI_Master_Backup_${Date.now()}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    document.body.removeChild(dlAnchor);

    setBackupMsg('Full System Database backup JSON exported successfully.');
    setTimeout(() => setBackupMsg(''), 4000);
  };

  // Restore Master JSON Backup
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      try {
        const parsed = JSON.parse(uploadEvent.target?.result as string);
        if (parsed.inquiries) localStorage.setItem('abhinav_inquiries', JSON.stringify(parsed.inquiries));
        if (parsed.certificates) localStorage.setItem('abhinav_certificates', JSON.stringify(parsed.certificates));
        if (parsed.syllabi) localStorage.setItem('abhinav_syllabi', JSON.stringify(parsed.syllabi));
        if (parsed.admissions) localStorage.setItem('abhinav_admissions', JSON.stringify(parsed.admissions));
        if (parsed.notice) localStorage.setItem('abhinav_notice', parsed.notice);

        refreshAllData();
        window.dispatchEvent(new Event('storage'));
        setBackupMsg('System database successfully restored from JSON backup file!');
        setTimeout(() => setBackupMsg(''), 4000);
      } catch (err) {
        alert('Failed to parse backup JSON file. Please ensure it is a valid backup.');
      }
    };
    reader.readAsText(file);
  };

  // Active Courses & Leads Filtering
  const activeCoursesList = siteContent.courses && siteContent.courses.length > 0 ? siteContent.courses : COURSES;
  const courseOptions = Array.from(new Set(activeCoursesList.map((c) => c.nameMr || c.name)));

  const filteredLeads = inquiries.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      item.phone.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
      (item.course || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
      (item.message || '').toLowerCase().includes(leadSearch.toLowerCase());

    const matchesCourse = leadCourseFilter === 'all' || item.course === leadCourseFilter;
    const matchesStatus = leadStatusFilter === 'all' || (item.status || 'New') === leadStatusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // If not logged in, render Master Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-orange-600/30">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
                Super Admin Master Vault
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Restricted Executive Console • Abhinav Technical Institute
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Master Security Key / Authorization Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Master Password"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/25 transition-all text-sm"
            >
              Authorize Super Admin Session
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Super Admin Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-500/30">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">
                Abhinav Technical Institute
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-400">Master Management & Certificate Authority</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToHome}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            View Website
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 rounded-xl border border-rose-800/40 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Lock Console
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800 p-4 shrink-0 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 mb-1">
            System Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'certificates'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Award className="h-4 w-4" />
              <span>Certificates Authority</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {certificates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('syllabus')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'syllabus'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="h-4 w-4" />
              <span>Syllabus & Curriculum</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {syllabi.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4" />
              <span>Student Inquiries CRM</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/30 text-orange-300">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Admissions & Intake</span>
          </button>

          <button
            onClick={() => setActiveTab('notice')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notice'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="h-4 w-4" />
            <span>Notice Broadcaster</span>
          </button>

          <div className="pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'backup'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Database className="h-4 w-4" />
              <span>Master Vault & Backup</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto bg-slate-950">
          
          {backupMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{backupMsg}</span>
            </div>
          )}

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  Executive System Overview
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Real-time operational metrics across admissions, curriculum syllabi, and certified student credentials.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-black text-white">{certificates.length}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Verified Certificates Issued</div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded">
                      Published
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-black text-white">{syllabi.length}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Course Syllabi & PDFs</div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                      <Users className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">
                      Total
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-black text-white">{inquiries.length}</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">Student Leads & Inquiries</div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      Secure
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-black text-white">100%</div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">System Health & Integrity</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Leads */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Inquiries */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm">Recent Student Inquiries</h3>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
                    >
                      View All ({inquiries.length})
                    </button>
                  </div>

                  <div className="space-y-2">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{inq.name}</div>
                          <div className="text-slate-400 text-[11px]">{inq.course} • {inq.phone}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {inq.date}
                        </span>
                      </div>
                    ))}

                    {inquiries.length === 0 && (
                      <div className="text-center py-6 text-slate-500 text-xs">
                        No student inquiries submitted yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* System Control Center */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-bold text-white text-sm">Executive Actions</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('certificates')}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-orange-500/50 transition-all text-left group"
                    >
                      <Award className="h-5 w-5 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-white">Issue Certificate</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Generate verified certificate with QR code.</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('syllabus')}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-orange-500/50 transition-all text-left group"
                    >
                      <Upload className="h-5 w-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-white">Upload Syllabus</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Upload new PDF syllabus for courses.</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('notice')}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-orange-500/50 transition-all text-left group"
                    >
                      <Megaphone className="h-5 w-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-white">Broadcast Alert</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Update live marquee announcement.</p>
                    </button>

                    <button
                      onClick={handleExportSystemBackup}
                      className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-orange-500/50 transition-all text-left group"
                    >
                      <Download className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-white">Export Backup</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Download master system snapshot.</p>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: CERTIFICATES AUTHORITY */}
          {activeTab === 'certificates' && (
            <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl border border-slate-800">
              <CertificateManager />
            </div>
          )}

          {/* TAB 3: SYLLABUS & CURRICULUM */}
          {activeTab === 'syllabus' && (
            <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl border border-slate-800">
              <SyllabusAdmin isSuperAdmin={true} />
            </div>
          )}

          {/* TAB 4: STUDENT INQUIRIES CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-lg font-bold text-white font-serif">
                    Student Leads & Admission CRM
                  </h2>
                  <p className="text-xs text-slate-400">
                    Track prospective student inquiries, update admissions status, and trigger direct WhatsApp communications.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const csvRows = [
                        ['Date', 'Name', 'Phone', 'Email', 'Course', 'Status', 'Message', 'Counselor Notes'],
                        ...inquiries.map(i => [
                          i.date,
                          `"${i.name}"`,
                          `"${i.phone}"`,
                          `"${i.email}"`,
                          `"${i.course}"`,
                          `"${i.status || 'New'}"`,
                          `"${(i.message || '').replace(/"/g, '""')}"`,
                          `"${(i.notes || '').replace(/"/g, '""')}"`,
                        ])
                      ].map(e => e.join(',')).join('\n');

                      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `ATI_Leads_CRM_${Date.now()}.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    Export CRM CSV
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, phone, or course..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <select
                    value={leadCourseFilter}
                    onChange={(e) => setLeadCourseFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="all">All Courses / Trades</option>
                    {courseOptions.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => setLeadStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Enrolled">Enrolled</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Student / Contact</th>
                        <th className="p-3.5">Course / Trade</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Counselor Notes</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLeads.map((inq) => (
                        <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white">{inq.name}</div>
                            <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                              <span>📞 {inq.phone}</span>
                              {inq.email && <span>✉️ {inq.email}</span>}
                            </div>
                            {inq.message && (
                              <div className="text-slate-400 text-[11px] italic mt-1 bg-slate-950 p-1.5 rounded border border-slate-800">
                                "{inq.message}"
                              </div>
                            )}
                          </td>

                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-orange-300 font-medium">
                              {inq.course}
                            </span>
                          </td>

                          <td className="p-3.5 font-mono text-slate-400">
                            {inq.date}
                          </td>

                          <td className="p-3.5">
                            <select
                              value={inq.status || 'New'}
                              onChange={(e) => handleUpdateLeadStatus(inq.id, e.target.value as Inquiry['status'])}
                              className={`px-2 py-1 rounded text-xs font-bold border ${
                                (inq.status === 'Enrolled')
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                  : (inq.status === 'Contacted')
                                  ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                                  : (inq.status === 'In Progress')
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                                  : (inq.status === 'Closed')
                                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                                  : 'bg-orange-950/80 text-orange-300 border-orange-700'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Enrolled">Enrolled</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>

                          <td className="p-3.5 max-w-xs">
                            <input
                              type="text"
                              placeholder="Add counselor remarks..."
                              defaultValue={inq.notes || ''}
                              onBlur={(e) => handleUpdateLeadNotes(inq.id, e.target.value)}
                              className="w-full px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-orange-500"
                            />
                          </td>

                          <td className="p-3.5 text-right space-x-1">
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, greetings from Abhinav Technical Institute regarding your inquiry for ${inq.course}. How can we assist you with admissions?`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 inline-block text-emerald-400 hover:bg-emerald-950 rounded"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </a>

                            <button
                              onClick={() => handleDeleteLead(inq.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredLeads.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            No student inquiry records found matching the filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VOCATIONAL COURSES & ADMISSIONS MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                      MSBSVET अभ्यासक्रम व्यवस्थापन (Course Catalog CMS)
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Total: {activeCoursesList.length} Trades
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-serif mt-1">
                    Vocational Courses & Trade Management
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add new trades, edit syllabus & fees, change photos, reorder, and control admissions intake live on Cloudflare database.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleResetCourseCatalog}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-700"
                  >
                    Reset 10 Trades
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenAddCourse}
                    className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Add New Course</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search by Course Name, Code (e.g. 304202), or Category..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCoursesList
                  .filter((c) => {
                    if (!courseSearch.trim()) return true;
                    const q = courseSearch.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(q) ||
                      (c.nameMr && c.nameMr.toLowerCase().includes(q)) ||
                      c.code.toLowerCase().includes(q) ||
                      c.category.toLowerCase().includes(q) ||
                      (c.categoryMr && c.categoryMr.toLowerCase().includes(q))
                    );
                  })
                  .map((c, idx) => {
                    const isOpen = c.admissionsOpen !== false;
                    return (
                      <div
                        key={c.id || idx}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between gap-3 relative group hover:border-slate-700 transition-all"
                      >
                        <div className="space-y-3">
                          {/* Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className="font-mono text-xs font-extrabold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800">
                                Code: {c.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                {c.categoryMr || c.category}
                              </span>
                            </div>

                            {/* Move Order Controls */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveCourseOrder(idx, 'up')}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === activeCoursesList.length - 1}
                                onClick={() => handleMoveCourseOrder(idx, 'down')}
                                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Image & Info Layout */}
                          <div className="flex gap-3.5 items-start">
                            <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800 group/img">
                              <img
                                src={c.image}
                                alt={c.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src =
                                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                                }}
                              />
                              <label className="absolute inset-0 bg-black/70 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold p-1 text-center">
                                <Camera className="h-4 w-4 mb-0.5 text-orange-400" />
                                <span>Change</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadCoursePhoto(idx, e)}
                                />
                              </label>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <h3 className="font-serif font-bold text-sm text-white leading-snug">
                                {c.nameMr || c.name}
                              </h3>
                              {c.name && c.nameMr && (
                                <p className="text-[11px] text-slate-400 font-medium truncate">
                                  {c.name}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-orange-400 font-medium pt-0.5">
                                <span>⏱️ {c.durationMr || c.duration}</span>
                                <span>•</span>
                                <span>🕒 {c.timingMr || c.timing}</span>
                              </div>
                            </div>
                          </div>

                          {/* Details Row */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                            <span>🎓 पात्रता: <strong className="text-slate-200">{c.eligibilityMr || c.eligibility}</strong></span>
                            <span>•</span>
                            <span>📚 विषय: <strong className="text-slate-200">{(c.syllabus || []).length} Modules</strong></span>
                            <span>•</span>
                            <span>💼 संधी: <strong className="text-slate-200">{(c.careerOpportunities || []).length} Paths</strong></span>
                          </div>
                        </div>

                        {/* Card Action Buttons & Admissions Toggle */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                          {/* Admission Toggle */}
                          <button
                            type="button"
                            onClick={() => handleToggleCourseAdmission(c.id, c.name)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                              isOpen
                                ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700'
                                : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                            <span>{isOpen ? 'प्रवेश सुरू (Open)' : 'Intake Closed'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(c.id)}
                              className="px-2.5 py-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCourse(c)}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 border border-slate-700"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* ADD / EDIT COURSE MODAL */}
              {isCourseModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-fadeIn">
                  <div className="bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-800 overflow-hidden text-slate-100">
                    {/* Modal Top Header */}
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white flex justify-between items-center shrink-0">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-200 bg-black/20 px-2 py-0.5 rounded-md">
                          {courseModalMode === 'add' ? 'नवीन कोर्स तयार करा' : 'कोर्स माहिती संपादन'}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
                          {courseModalMode === 'add'
                            ? 'Add New Vocational Course'
                            : `Edit: ${courseForm.nameMr || courseForm.name}`}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCourseModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Modal Form Scrollable Content */}
                    <form onSubmit={handleSaveCourse} className="p-5 overflow-y-auto space-y-4 text-xs">
                      {/* Row 1: Code & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            MSBSVET Course Code (अभ्यासक्रम सांकेतांक) *
                          </label>
                          <input
                            type="text"
                            required
                            value={courseForm.code}
                            onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                            placeholder="e.g. 304202 or 101201"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Category (वर्गवारी - Marathi & English)
                          </label>
                          <input
                            type="text"
                            value={courseForm.categoryMr || courseForm.category}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                categoryMr: e.target.value,
                                category: e.target.value,
                              })
                            }
                            placeholder="उदा: इलेक्ट्रिकल व पॉवर / Civil & Construction"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Row 2: Course Names */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Course Name in Marathi (कोर्सचे नाव - मराठी) *
                          </label>
                          <input
                            type="text"
                            required
                            value={courseForm.nameMr || ''}
                            onChange={(e) => setCourseForm({ ...courseForm, nameMr: e.target.value })}
                            placeholder="उदा: इलेक्ट्रिशियन (इलेक्ट्रिकल सुपरवायझर)"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-orange-400 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Course Name in English (English Title) *
                          </label>
                          <input
                            type="text"
                            required
                            value={courseForm.name}
                            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                            placeholder="e.g. ELECTRICIAN DIPLOMA – 1 YEAR"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Row 3: Photo Upload & URL */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                        <label className="font-bold text-orange-400 block">
                          Course Cover Image (कोर्सचे छायाचित्र)
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                            <img
                              src={courseForm.image}
                              alt="Course Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src =
                                  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                              }}
                            />
                          </div>
                          <div className="flex-1 w-full space-y-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                value={courseForm.image}
                                onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                                placeholder="https://... or upload from PC/phone"
                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                              />
                              <label className="shrink-0 px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                                <Upload className="h-4 w-4" />
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleUploadModalCoursePhoto}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Duration, Timing & Eligibility */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Duration (कालावधी)
                          </label>
                          <input
                            type="text"
                            value={courseForm.durationMr || courseForm.duration}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                durationMr: e.target.value,
                                duration: e.target.value,
                              })
                            }
                            placeholder="उदा: १ वर्ष / 1 Year"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Timing (बॅच वेळ)
                          </label>
                          <input
                            type="text"
                            value={courseForm.timingMr || courseForm.timing}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                timingMr: e.target.value,
                                timing: e.target.value,
                              })
                            }
                            placeholder="उदा: 10:00 AM - 2:00 PM"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Eligibility (पात्रता)
                          </label>
                          <input
                            type="text"
                            value={courseForm.eligibilityMr || courseForm.eligibility}
                            onChange={(e) =>
                              setCourseForm({
                                ...courseForm,
                                eligibilityMr: e.target.value,
                                eligibility: e.target.value,
                              })
                            }
                            placeholder="उदा: १० वी / १२ वी / ITI"
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      {/* Row 5: Batch Capacity & Admissions Open Toggle */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Batch Capacity (एकूण जागा)
                          </label>
                          <input
                            type="number"
                            value={courseForm.batchCapacity || 30}
                            onChange={(e) =>
                              setCourseForm({ ...courseForm, batchCapacity: Number(e.target.value) || 30 })
                            }
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Enrolled Students (प्रवेशित)
                          </label>
                          <input
                            type="number"
                            value={courseForm.enrolled || 0}
                            onChange={(e) =>
                              setCourseForm({ ...courseForm, enrolled: Number(e.target.value) || 0 })
                            }
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="pt-3 sm:pt-0">
                          <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-400">
                            <input
                              type="checkbox"
                              checked={courseForm.admissionsOpen !== false}
                              onChange={(e) =>
                                setCourseForm({ ...courseForm, admissionsOpen: e.target.checked })
                              }
                              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                            />
                            <span>Admissions Open (प्रवेश सुरू)</span>
                          </label>
                        </div>
                      </div>

                      {/* Row 6: Descriptions */}
                      <div>
                        <label className="font-bold text-slate-300 block mb-1">
                          Short Description (मराठी संक्षिप्त माहिती)
                        </label>
                        <textarea
                          rows={2}
                          value={courseForm.descriptionMr || courseForm.description}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              descriptionMr: e.target.value,
                              description: e.target.value,
                            })
                          }
                          placeholder="कोर्सची प्रमुख वैशिष्ट्ये व माहिती..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-300 block mb-1">
                          Full Detailed Description (सविस्तर तपशील - शासन मान्यता, समकक्षता व संधी)
                        </label>
                        <textarea
                          rows={3}
                          value={courseForm.fullDescriptionMr || courseForm.fullDescription || ''}
                          onChange={(e) =>
                            setCourseForm({
                              ...courseForm,
                              fullDescriptionMr: e.target.value,
                              fullDescription: e.target.value,
                            })
                          }
                          placeholder="महाराष्ट्र शासन मान्यता, ITI व १२ वी समकक्षता, विविध खात्यांमधील भरती संधी..."
                          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Row 7: Syllabus & Career Opportunities (One per line) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Syllabus Modules (अभ्यासक्रम विषय - प्रति ओळ १ विषय)
                          </label>
                          <textarea
                            rows={4}
                            value={(
                              courseForm.syllabusMr && courseForm.syllabusMr.length > 0
                                ? courseForm.syllabusMr
                                : courseForm.syllabus || []
                            ).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              setCourseForm({
                                ...courseForm,
                                syllabusMr: lines,
                                syllabus: lines,
                              });
                            }}
                            placeholder="थियरी विषय १&#10;प्रॅक्टिकल विषय २&#10;इंडस्ट्रियल लॅब..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-0.5">Tip: Write each subject on a new line.</p>
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">
                            Career Opportunities (रोजगार व करिअर संधी - प्रति ओळ १ संधी)
                          </label>
                          <textarea
                            rows={4}
                            value={(
                              courseForm.careerOpportunitiesMr &&
                              courseForm.careerOpportunitiesMr.length > 0
                                ? courseForm.careerOpportunitiesMr
                                : courseForm.careerOpportunities || []
                            ).join('\n')}
                            onChange={(e) => {
                              const lines = e.target.value.split('\n');
                              setCourseForm({
                                ...courseForm,
                                careerOpportunitiesMr: lines,
                                careerOpportunities: lines,
                              });
                            }}
                            placeholder="शासकीय व निमशासकीय भरती पात्र&#10;पीडब्ल्यूडी अधिकृत कंत्राटदार&#10;स्वतंत्र व्यवसाय / वर्कशॉप..."
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-0.5">Tip: Write each career role on a new line.</p>
                        </div>
                      </div>

                      {/* Form Submit Footer */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setIsCourseModalOpen(false)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-600/20 cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{courseModalMode === 'add' ? 'Save & Publish Course' : 'Update Course in Database'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: NOTICE BOARD BROADCASTER */}
          {activeTab === 'notice' && (
            <div className="max-w-2xl bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-white font-serif">Notice Board & Marquee Broadcaster</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Updates the scrolling dynamic banner at the top of the entire website in real-time.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Announcement Message
                </label>
                <textarea
                  rows={4}
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block mb-1">
                  Live Preview:
                </span>
                <p className="text-xs text-slate-300 italic">{notice}</p>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem('abhinav_notice', notice);
                  window.dispatchEvent(new Event('storage'));
                  setBackupMsg('Notice Board announcement successfully broadcasted to website!');
                  setTimeout(() => setBackupMsg(''), 3500);
                }}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
              >
                Broadcast Notice Live
              </button>
            </div>
          )}

          {/* TAB 7: MASTER BACKUP & SYSTEM RECOVERY */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h2 className="text-lg font-bold text-white font-serif">Master System Vault & Data Backup</h2>
                <p className="text-xs text-slate-400">
                  Export, restore, or reset the full operational data including all leads, verified certificates, syllabi, and configuration.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Export Card */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-3">
                      <Download className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Download Full Backup JSON</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Exports certificates, syllabi, admissions, notice board, and leads into a single portable backup file.
                    </p>
                  </div>

                  <button
                    onClick={handleExportSystemBackup}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    Export Master JSON
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                  <div>
                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit mb-3">
                      <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Restore from Backup JSON</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Upload a previously exported backup file to restore complete system records.
                    </p>
                  </div>

                  <label className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                    <Upload className="h-4 w-4" />
                    Choose Backup File
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackup}
                      className="hidden"
                    />
                  </label>
                </div>

              </div>

              {/* Factory Reset */}
              <div className="bg-rose-950/20 border border-rose-900/40 p-5 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Factory System Reset</span>
                </div>
                <p className="text-xs text-slate-400">
                  Resets the database to institute default state (re-populates original syllabi and verified demo certificates, clears inquiries).
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('CRITICAL ACTION: Reset all system records to default institute state?')) {
                      localStorage.setItem('abhinav_inquiries', '[]');
                      localStorage.setItem('abhinav_certificates', JSON.stringify(INITIAL_CERTIFICATES));
                      localStorage.setItem('abhinav_syllabi', JSON.stringify(INITIAL_SYLLABUS_LIST));
                      localStorage.removeItem('abhinav_admissions');
                      refreshAllData();
                      window.dispatchEvent(new Event('storage'));
                      setBackupMsg('System successfully reset to factory defaults.');
                      setTimeout(() => setBackupMsg(''), 4000);
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Perform Factory Reset
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

export default SuperAdminDashboard;
