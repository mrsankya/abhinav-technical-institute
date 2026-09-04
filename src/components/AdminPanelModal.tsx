import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import type { Course, Announcement, StudentCertificate } from '../types';
import { COURSES, HERO_CAROUSEL_IMAGES } from '../data/instituteData';
import { InstituteLogo } from './InstituteLogo';
import { getTranslation, type Language } from '../translations/translations';
import {
  fetchLeads,
  saveLead,
  updateLeadStatus,
  deleteLead,
  fetchCertificates,
  saveCertificate,
  deleteCertificate,
  fetchGovernmentGrs,
  saveGovernmentGr,
  deleteGovernmentGr,
  resetGovernmentGrs,
  fetchAdmissions,
  saveAdmissions,
  type Lead,
} from '../services/api';
import { type GovernmentGrItem } from '../data/grData';
import {
  fetchSiteContent,
  saveSiteContent,
  resetSiteContent,
  INITIAL_SITE_CONTENT,
  type SiteContent,
  type GalleryItem,
  type AwardMediaItem,
} from '../services/cms';
import { compressAndReadFile } from '../utils/imageUtils';
import {
  printOfficialFeeReceipt,
  printCertificateVerificationSlip,
  downloadBrandedStudentQrCode,
} from '../utils/printUtils';

export interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses?: Course[];
  announcements?: Announcement[];
  certificates: Record<string, StudentCertificate>;
  onAddCertificate: (cert: StudentCertificate) => void;
  onAddAnnouncement?: (ann: Announcement) => void;
  enquiries?: Lead[];
  onUpdateEnquiryStatus?: (id: string, status: 'New' | 'Contacted' | 'Enrolled' | 'Closed') => void;
  language: Language;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  courses = COURSES,
  certificates = {},
  onAddCertificate,
  onAddAnnouncement,
  enquiries = [],
  onUpdateEnquiryStatus,
  language,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'cms' | 'gr' | 'leads' | 'certificates' | 'receipts' | 'batches' | 'notices' | 'security'
  >('overview');

  // Password change state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');

  // CMS Content State
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const activeCourses = siteContent.courses && siteContent.courses.length > 0 ? siteContent.courses : COURSES;
  const [cmsSubTab, setCmsSubTab] = useState<'hero' | 'about' | 'awards' | 'courses' | 'gallery' | 'contact'>('hero');
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState(false);

  // Global Toast Notification State
  const [toastNotification, setToastNotification] = useState<{
    show: boolean;
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotification({
      show: true,
      type,
      title,
      message,
    });
    setTimeout(() => {
      setToastNotification((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  // Government GR State
  const [grList, setGrList] = useState<GovernmentGrItem[]>([]);
  const [grSearchQuery, setGrSearchQuery] = useState('');
  const [editingGr, setEditingGr] = useState<GovernmentGrItem | null>(null);
  const [isAddGrModalOpen, setIsAddGrModalOpen] = useState(false);
  const [grSaveSuccess, setGrSaveSuccess] = useState(false);
  const [newGr, setNewGr] = useState<GovernmentGrItem>({
    id: '',
    titleMr: '',
    titleEn: '',
    number: '',
    date: '',
    deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: '',
    summaryEn: '',
    pdfPath: '/gr/gr-01-diploma-course-recognition-2013.pdf',
    status: 'GOVT DIPLOMA GR',
    badgeColor: 'bg-[#002760] text-white',
    codeNumber: '',
  });

  // Course Management CMS State
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
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

  // Leads state
  const [leadsList, setLeadsList] = useState<Lead[]>(enquiries);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterCourse, setLeadFilterCourse] = useState('ALL');

  // Certificate state
  const [certsList, setCertsList] = useState<Record<string, StudentCertificate>>(certificates);
  const [certSearch, setCertSearch] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // New certificate form
  const [newCert, setNewCert] = useState<Partial<StudentCertificate> & { fatherName?: string; remarks?: string }>({
    regNumber: `ATI-2025-${Math.floor(100000 + Math.random() * 900000)}`,
    studentName: '',
    fatherName: '',
    courseName: 'Electrician',
    grade: 'A+ (Distinction)',
    percentage: '88.5%',
    issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    validUntil: 'Lifetime Valid',
    status: 'Valid',
    instituteCenter: 'Abhinav Technical Institute, Main Campus Jalgaon',
    remarks: 'Distinction in Practical Training & Electrical Machine Lab',
  });
  const [certCreatedSuccess, setCertCreatedSuccess] = useState(false);
  const [selectedQrStudent, setSelectedQrStudent] = useState<StudentCertificate | null>(null);
  const [selectedQrCodeUrl, setSelectedQrCodeUrl] = useState<string>('');

  // Receipt / ID card generator state
  const [receiptData, setReceiptData] = useState({
    studentName: '',
    fatherName: '',
    course: 'Electrician',
    phone: '',
    receiptNo: `RCT-2025-${Math.floor(10000 + Math.random() * 90000)}`,
    studentId: `ATI-STU-${Math.floor(100000 + Math.random() * 900000)}`,
    admissionDate: new Date().toISOString().split('T')[0],
    feeAmount: '15000',
    feePaid: '5000',
    paymentMode: 'Cash',
    installmentNo: '1st Installment',
  });

  // Course admission open/closed state
  const [courseAdmissions, setCourseAdmissions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ati_course_admissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    const initial: Record<string, boolean> = {};
    courses.forEach((c) => {
      initial[c.id] = c.admissionsOpen !== false;
    });
    return initial;
  });

  // Notice form state
  const [newNotice, setNewNotice] = useState({
    title: '',
    titleMr: '',
    description: '',
    tag: 'Admissions',
  });
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    if (isOpen) {
      fetchLeads().then((data) => setLeadsList(data));
      fetchCertificates().then((data) => setCertsList(data));
      fetchSiteContent().then((data) => setSiteContent(data));
      fetchGovernmentGrs().then((data) => setGrList(data));
      fetchAdmissions().then((data) => {
        if (data && Object.keys(data).length > 0) setCourseAdmissions(data);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (newCert.regNumber) {
      const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(newCert.regNumber)}`;
      QRCode.toDataURL(verifyUrl, { width: 140, margin: 1 })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    }
  }, [newCert.regNumber]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('ati_admin_password') || '9423488174';
    if (pin.trim() === savedPassword || pin.trim() === '9822725265') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess('');
    setPasswordChangeError('');

    const savedPass = localStorage.getItem('ati_admin_password') || '9423488174';
    if (currentPasswordInput.trim() !== savedPass && currentPasswordInput.trim() !== '9822725265') {
      setPasswordChangeError('Current password is incorrect.');
      return;
    }

    if (!newPasswordInput || newPasswordInput.trim().length < 4) {
      setPasswordChangeError('New password must be at least 4 characters long.');
      return;
    }

    if (newPasswordInput.trim() !== confirmPasswordInput.trim()) {
      setPasswordChangeError('New password and confirmation password do not match.');
      return;
    }

    localStorage.setItem('ati_admin_password', newPasswordInput.trim());
    setPasswordChangeSuccess('✓ Admin password successfully updated! Please remember your new password.');
    showToast('Password Updated', 'Admin passcode updated successfully!', 'success');
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordChangeSuccess(''), 5000);
  };

  const handleSaveCMS = async () => {
    await saveSiteContent(siteContent);
    setCmsSaveSuccess(true);
    showToast(
      'Website Changes Saved',
      'All edited text, images, and content are live and synced to Cloudflare D1 database!',
      'success'
    );
    setTimeout(() => setCmsSaveSuccess(false), 3000);
  };

  const handleResetCMS = async () => {
    if (
      window.confirm(
        'Are you sure you want to reset all website text, images, and content to original defaults?'
      )
    ) {
      const def = await resetSiteContent();
      setSiteContent(def);
      showToast('CMS Reset', 'Website content restored to initial defaults.', 'info');
      alert('Website content successfully reset to defaults!');
    }
  };

  // Hero Carousel Slider handlers
  const handleUploadHeroSlideImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1600, 1000, 0.85);
      setSiteContent((prev) => {
        const heroSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
        heroSlides[index] = { ...heroSlides[index], src: dataUrl };
        return {
          ...prev,
          hero: {
            ...prev.hero,
            carouselImages: heroSlides,
          },
        };
      });
    } catch (err) {
      alert('Failed to read image file');
    }
  };

  const handleUploadNewHeroSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1600, 1000, 0.85);
      const newSlide = {
        src: dataUrl,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        title: 'ATI Practical Training Workshop',
        titleMr: 'कार्यशाळा प्रात्यक्षिक प्रशिक्षण',
        category: 'Live Workshop',
        categoryMr: 'प्रात्यक्षिक कार्यशाळा',
        desc: 'Practical workshop hands-on training with modern equipment at Abhinav Technical Institute Jalgaon.',
        descMr: 'अभिनव टेक्निकल इन्स्टिट्यूट जळगाव — अत्याधुनिक उपकरणांवर थेट प्रॅक्टिकल प्रशिक्षण.',
      };
      setSiteContent((prev) => {
        const heroSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
        return {
          ...prev,
          hero: {
            ...prev.hero,
            carouselImages: [newSlide, ...heroSlides],
          },
        };
      });
    } catch (err) {
      alert('Failed to read image file');
    }
  };

  const handleAddHeroSlide = () => {
    const newSlide = {
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80',
      alt: 'ATI Practical Workshop Training',
      title: 'Workshop Practical Training Lab',
      titleMr: 'कार्यशाळा प्रात्यक्षिक लॅब',
      category: 'Live Workshop',
      categoryMr: 'प्रात्यक्षिक कार्यशाळा',
      desc: 'Hands-on practical training with modern equipment and safety tools.',
      descMr: 'सुरक्षित उपकरणांसह आधुनिक वायरिंग आणि प्रॅक्टिकल कार्यशाळा.',
    };
    setSiteContent((prev) => {
      const heroSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          carouselImages: [...heroSlides, newSlide],
        },
      };
    });
  };

  const handleAddHeroSlideByUrl = () => {
    const url = window.prompt(
      'Enter direct image link or web URL for new Hero Slide:\n(e.g. https://... or /assets/...)',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80'
    );
    if (!url || !url.trim()) return;
    const newSlide = {
      src: url.trim(),
      alt: 'ATI Practical Training Workshop',
      title: 'Workshop Practical Training Lab',
      titleMr: 'कार्यशाळा प्रात्यक्षिक लॅब',
      category: 'Live Workshop',
      categoryMr: 'प्रात्यक्षिक कार्यशाळा',
      desc: 'Hands-on practical training with modern equipment and safety tools.',
      descMr: 'सुरक्षित उपकरणांसह आधुनिक वायरिंग आणि प्रॅक्टिकल कार्यशाळा.',
    };
    setSiteContent((prev) => {
      const heroSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
      return {
        ...prev,
        hero: {
          ...prev.hero,
          carouselImages: [newSlide, ...heroSlides],
        },
      };
    });
    showToast('Hero Slide Added', 'New slide added with image URL. Remember to click "Save All Website Changes" to sync to database.', 'info');
  };

  const handleDeleteHeroSlide = (index: number) => {
    const heroSlides = siteContent.hero.carouselImages && siteContent.hero.carouselImages.length > 0 ? siteContent.hero.carouselImages : HERO_CAROUSEL_IMAGES;
    if (heroSlides.length <= 1) {
      alert('You must keep at least 1 hero banner slide.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete Hero Slide #${index + 1}?`)) {
      setSiteContent((prev) => {
        const currentSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
        currentSlides.splice(index, 1);
        return {
          ...prev,
          hero: {
            ...prev.hero,
            carouselImages: currentSlides,
          },
        };
      });
    }
  };

  const handleMoveHeroSlide = (index: number, direction: 'up' | 'down') => {
    setSiteContent((prev) => {
      const currentSlides = [...(prev.hero.carouselImages && prev.hero.carouselImages.length > 0 ? prev.hero.carouselImages : HERO_CAROUSEL_IMAGES)];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentSlides.length) return prev;
      const temp = currentSlides[index];
      currentSlides[index] = currentSlides[targetIndex];
      currentSlides[targetIndex] = temp;
      return {
        ...prev,
        hero: {
          ...prev.hero,
          carouselImages: currentSlides,
        },
      };
    });
  };

  const handleResetHeroSlides = () => {
    if (window.confirm('Reset Hero Image Slider to the default 5 institute workshop slides?')) {
      setSiteContent((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          carouselImages: HERO_CAROUSEL_IMAGES,
        },
      }));
    }
  };

  const handleUploadPrincipalPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 600, 600, 0.85);
      setSiteContent((prev) => ({
        ...prev,
        about: { ...prev.about, principalPhoto: dataUrl },
      }));
    } catch (err) {
      alert('Failed to read image');
    }
  };

  const handleUploadGalleryImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1000, 700, 0.82);
      setSiteContent((prev) => {
        const updated = [...prev.gallery];
        updated[index] = { ...updated[index], src: dataUrl };
        return { ...prev, gallery: updated };
      });
    } catch (err) {
      alert('Failed to read image');
    }
  };

  const handleUploadNewGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1000, 700, 0.82);
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        src: dataUrl,
        alt: file.name.replace(/\.[^/.]+$/, ''),
        title: 'ATI Practical Training Workshop',
        titleMr: 'कार्यशाळा प्रॅक्टिकल लॅब',
        category: 'Workshop',
        categoryMr: 'कार्यशाळा',
      };
      setSiteContent((prev) => ({
        ...prev,
        gallery: [newItem, ...prev.gallery],
      }));
      showToast('Gallery Photo Added', `Uploaded "${file.name}" to gallery.`, 'info');
    } catch (err) {
      alert('Failed to read image');
    }
  };

  const handleAddGalleryImage = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      alt: 'ATI Practical Training Workshop',
      title: 'Workshop Practical Training Lab',
      titleMr: 'कार्यशाळा प्रॅक्टिकल लॅब',
      category: 'Workshop',
      categoryMr: 'कार्यशाळा',
    };
    setSiteContent({
      ...siteContent,
      gallery: [newItem, ...siteContent.gallery],
    });
  };

  const handleAddGalleryImageByUrl = () => {
    const url = window.prompt(
      'Enter direct image link or web URL for Campus / Workshop Gallery:\n(e.g. https://... or /assets/...)',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    );
    if (!url || !url.trim()) return;
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      src: url.trim(),
      alt: 'Campus & Workshop Practical Photo',
      title: 'Workshop Practical Training Lab',
      titleMr: 'कार्यशाळा प्रॅक्टिकल लॅब',
      category: 'Workshop',
      categoryMr: 'कार्यशाळा',
    };
    setSiteContent((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));
    showToast('Gallery Photo Added', 'Photo added via URL. Click "Save All Website Changes" to sync to database.', 'info');
  };

  const handleDeleteGalleryImage = (id: string) => {
    setSiteContent({
      ...siteContent,
      gallery: siteContent.gallery.filter((g) => g.id !== id),
    });
  };

  // Course Management Handlers
  const handleUploadCourseImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 900, 600, 0.75);
      const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
      currentCourses[index] = { ...currentCourses[index], image: dataUrl };
      const updated = { ...siteContent, courses: currentCourses };
      setSiteContent(updated);
      await saveSiteContent(updated);
      showToast('Course Image Updated', `Updated photo for ${currentCourses[index].name}.`, 'success');
    } catch (err) {
      alert('Failed to read image file');
    }
  };

  const handleUploadModalCourseImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 900, 600, 0.75);
      setCourseForm((prev) => ({ ...prev, image: dataUrl }));
      showToast('Course Image Attached', `Loaded photo "${file.name}".`, 'info');
    } catch (err) {
      alert('Failed to read image file');
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

  const handleSaveCourseForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name || !courseForm.nameMr) {
      alert('Please enter both English and Marathi course names.');
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

    const updatedSite = {
      ...siteContent,
      courses: updatedCourses,
    };
    setSiteContent(updatedSite);
    await saveSiteContent(updatedSite);
    setIsCourseModalOpen(false);
    showToast(
      courseModalMode === 'add' ? 'Course Added & Published' : 'Course Details Updated',
      `"${courseForm.nameMr}" successfully saved and synchronized to Cloudflare D1 database!`,
      'success'
    );
  };

  const handleDeleteCourse = async (courseId: string) => {
    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    const target = currentCourses.find((c) => c.id === courseId);
    if (window.confirm(`Are you sure you want to delete course "${target?.nameMr || target?.name || courseId}"?`)) {
      const updatedCourses = currentCourses.filter((c) => c.id !== courseId);
      const updatedSite = {
        ...siteContent,
        courses: updatedCourses,
      };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      showToast('Course Deleted', `Course was removed from website and database.`, 'info');
    }
  };

  const handleMoveCourse = async (index: number, direction: 'up' | 'down') => {
    const currentCourses = siteContent.courses && siteContent.courses.length > 0 ? [...siteContent.courses] : [...COURSES];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentCourses.length) return;

    const temp = currentCourses[index];
    currentCourses[index] = currentCourses[targetIndex];
    currentCourses[targetIndex] = temp;

    const updatedSite = {
      ...siteContent,
      courses: currentCourses,
    };
    setSiteContent(updatedSite);
    await saveSiteContent(updatedSite);
    showToast('Course Re-ordered', 'Course display order updated.', 'success');
  };

  const handleResetCourses = async () => {
    if (window.confirm('Reset all courses back to official 10 MSBSVET trade defaults?')) {
      const updatedSite = {
        ...siteContent,
        courses: COURSES,
      };
      setSiteContent(updatedSite);
      await saveSiteContent(updatedSite);
      showToast('Courses Reset', 'Courses restored to official 10 trade defaults.', 'info');
    }
  };

  const handleUploadAwardImage = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1400, 1000, 0.85);
      setSiteContent((prev) => {
        const awards = prev.awards || INITIAL_SITE_CONTENT.awards;
        const updatedGallery = [...awards.gallery];
        updatedGallery[index] = { ...updatedGallery[index], src: dataUrl };
        return {
          ...prev,
          awards: {
            ...awards,
            gallery: updatedGallery,
          },
        };
      });
    } catch (err) {
      alert('Failed to read image');
    }
  };

  const handleUploadNewAwardImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressAndReadFile(file, 1400, 1000, 0.85);
      const newMedia: AwardMediaItem = {
        id: `award-img-${Date.now()}`,
        type: 'image',
        src: dataUrl,
        title: 'Award Ceremony Photograph',
        titleMr: 'सन्मान सोहळा छायाचित्र',
        description: 'Prestigious award ceremony moment',
        descriptionMr: 'सन्मान सोहळ्यातील अविस्मरणीय क्षण',
        badge: 'New Photo',
      };
      setSiteContent((prev) => {
        const awards = prev.awards || INITIAL_SITE_CONTENT.awards;
        return {
          ...prev,
          awards: {
            ...awards,
            gallery: [newMedia, ...awards.gallery],
          },
        };
      });
      showToast('Award Photo Added', `Uploaded ceremony photograph "${file.name}".`, 'info');
    } catch (err) {
      alert('Failed to read image');
    }
  };

  const handleAddAwardImageByUrl = () => {
    const url = window.prompt(
      'Enter direct image link or web URL for new Award Ceremony Photograph:\n(e.g. https://... or /assets/awards/...)',
      'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=1200&auto=format&fit=crop&q=80'
    );
    if (!url || !url.trim()) return;
    const newMedia: AwardMediaItem = {
      id: `award-img-${Date.now()}`,
      type: 'image',
      src: url.trim(),
      title: 'Award Ceremony Photograph',
      titleMr: 'सन्मान सोहळा छायाचित्र',
      description: 'Prestigious award ceremony moment',
      descriptionMr: 'सन्मान सोहळ्यातील अविस्मरणीय क्षण',
      badge: 'Ceremony Photo',
    };
    setSiteContent((prev) => {
      const awards = prev.awards || INITIAL_SITE_CONTENT.awards;
      return {
        ...prev,
        awards: {
          ...awards,
          gallery: [newMedia, ...awards.gallery],
        },
      };
    });
    showToast('Award Photo Added', 'Photo added via URL. Click "Save All Website Changes" to sync to database.', 'info');
  };

  const handleDeleteAwardImage = (id: string) => {
    setSiteContent((prev) => {
      const awards = prev.awards || INITIAL_SITE_CONTENT.awards;
      return {
        ...prev,
        awards: {
          ...awards,
          gallery: awards.gallery.filter((g) => g.id !== id),
        },
      };
    });
  };

  const handleUploadAwardVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('Video is larger than 25MB. Please choose an optimized MP4 under 25MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSiteContent((prev) => {
        const awards = prev.awards || INITIAL_SITE_CONTENT.awards;
        return {
          ...prev,
          awards: {
            ...awards,
            featuredVideo: {
              ...awards.featuredVideo,
              src: dataUrl,
            },
          },
        };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: 'New' | 'Contacted' | 'Enrolled' | 'Closed'
  ) => {
    await updateLeadStatus(id, newStatus);
    setLeadsList((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
    );
    showToast('Lead Status Updated', `Lead status updated to "${newStatus}".`, 'success');
    if (onUpdateEnquiryStatus) {
      onUpdateEnquiryStatus(id, newStatus);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
      setLeadsList((prev) => prev.filter((l) => l.id !== id));
      showToast('Lead Deleted', 'Student inquiry lead was removed.', 'info');
    }
  };

  const handleExportLeadsCSV = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Course', 'Qualification', 'Status', 'Date', 'Message'];
    const rows = leadsList.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email || ''}"`,
      `"${l.course}"`,
      `"${l.qualification || ''}"`,
      l.status,
      l.date,
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ATI_Student_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.studentName || !newCert.regNumber) return;

    const certToSave: StudentCertificate = {
      regNumber: newCert.regNumber.trim().toUpperCase(),
      studentName: newCert.studentName.trim(),
      courseName: newCert.courseName || 'Electrician Trade',
      grade: newCert.grade || 'A Grade',
      percentage: newCert.percentage || '85%',
      issueDate: newCert.issueDate || new Date().toLocaleDateString('en-GB'),
      validUntil: newCert.validUntil || 'Lifetime Valid',
      status: 'Valid',
      instituteCenter: newCert.instituteCenter || 'Abhinav Technical Institute, Main Campus Jalgaon',
    };

    await saveCertificate(certToSave);
    setCertsList((prev) => ({
      ...prev,
      [certToSave.regNumber]: certToSave,
    }));
    onAddCertificate(certToSave);

    setCertCreatedSuccess(true);
    showToast(
      'Certificate Issued & Registered',
      `Certificate ${certToSave.regNumber} for ${certToSave.studentName} is registered in database.`,
      'success'
    );
    setTimeout(() => {
      setCertCreatedSuccess(false);
      setNewCert({
        regNumber: `ATI-2025-${Math.floor(100000 + Math.random() * 900000)}`,
        studentName: '',
        fatherName: '',
        courseName: 'Electrician',
        grade: 'A+ (Distinction)',
        percentage: '88.5%',
        issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        validUntil: 'Lifetime Valid',
        status: 'Valid',
        instituteCenter: 'Abhinav Technical Institute, Main Campus Jalgaon',
        remarks: 'Distinction in Practical Training & Electrical Machine Lab',
      });
    }, 2500);
  };

  const handleDeleteCertificate = async (regNumber: string) => {
    if (window.confirm(`Are you sure you want to revoke/delete certificate ${regNumber}?`)) {
      await deleteCertificate(regNumber);
      setCertsList((prev) => {
        const next = { ...prev };
        delete next[regNumber];
        return next;
      });
      showToast('Certificate Revoked', `Certificate ${regNumber} has been revoked and removed.`, 'info');
    }
  };

  const handleToggleAdmission = async (courseId: string) => {
    const next = { ...courseAdmissions, [courseId]: !courseAdmissions[courseId] };
    setCourseAdmissions(next);
    await saveAdmissions(next);
    showToast(
      'Admissions Updated',
      `Course admission status was set to ${next[courseId] ? 'OPEN' : 'CLOSED'} and saved.`,
      'success'
    );
  };

  const handleSaveGr = async (e: React.FormEvent) => {
    e.preventDefault();
    const grToSave: GovernmentGrItem = editingGr
      ? { ...editingGr }
      : {
          ...newGr,
          id: newGr.id.trim() || `gr-${Date.now()}`,
          date: newGr.date.trim() || new Date().toLocaleDateString('mr-IN'),
        };

    if (!grToSave.titleMr || !grToSave.number) {
      alert('Please enter at least the Marathi Title and GR Number.');
      return;
    }

    await saveGovernmentGr(grToSave);
    const updatedGrs = await fetchGovernmentGrs();
    setGrList(updatedGrs);
    setGrSaveSuccess(true);
    showToast(
      'Government GR Saved & Published',
      `"${grToSave.titleMr.substring(0, 50)}..." was successfully uploaded and saved in database!`,
      'success'
    );
    setTimeout(() => setGrSaveSuccess(false), 3000);
    setIsAddGrModalOpen(false);
    setEditingGr(null);
    setNewGr({
      id: '',
      titleMr: '',
      titleEn: '',
      number: '',
      date: '',
      deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
      deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
      summaryMr: '',
      summaryEn: '',
      pdfPath: '/gr/gr-01-diploma-course-recognition-2013.pdf',
      status: 'GOVT DIPLOMA GR',
      badgeColor: 'bg-[#002760] text-white',
      codeNumber: '',
    });
  };

  const handleDeleteGr = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Government Resolution (GR)?')) {
      await deleteGovernmentGr(id);
      setGrList((prev) => prev.filter((item) => item.id !== id));
      showToast('Government GR Deleted', 'Selected resolution was removed from database.', 'info');
    }
  };

  const handleResetGr = async () => {
    if (window.confirm('Reset all Government GR records back to official default 6 documents?')) {
      const def = await resetGovernmentGrs();
      setGrList(def);
      showToast('GR Defaults Restored', 'Government resolutions reset to official default documents.', 'info');
      alert('Government Resolutions reset to defaults!');
    }
  };

  const handleUploadGrPdf = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      alert('PDF is larger than 20MB. Please choose an optimized PDF under 20MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (isEdit && editingGr) {
        setEditingGr({ ...editingGr, pdfPath: dataUrl });
      } else {
        setNewGr({ ...newGr, pdfPath: dataUrl });
      }
      showToast('PDF Document Attached', `File "${file.name}" loaded and ready to save.`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handlePrintSlip = async (cert: StudentCertificate) => {
    try {
      const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(cert.regNumber)}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 200, margin: 1 });
      printCertificateVerificationSlip(cert, qrDataUrl);
    } catch {
      printCertificateVerificationSlip(cert);
    }
  };

  const handlePrintReceipt = () => {
    printOfficialFeeReceipt(receiptData);
  };

  const handleOpenQrModal = async (cert: StudentCertificate) => {
    setSelectedQrStudent(cert);
    try {
      const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(cert.regNumber)}`;
      const url = await QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 1,
        color: { dark: '#002760', light: '#FFFFFF' },
      });
      setSelectedQrCodeUrl(url);
    } catch {
      setSelectedQrCodeUrl('');
    }
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title) return;
    const ann: Announcement = {
      id: `ann-${Date.now()}`,
      title: newNotice.title,
      titleMr: newNotice.titleMr || newNotice.title,
      description: newNotice.description,
      descriptionMr: newNotice.description,
      tag: newNotice.tag,
      tagMr: newNotice.tag,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      icon: 'campaign',
      isNew: true,
    };
    if (onAddAnnouncement) {
      onAddAnnouncement(ann);
    }
    setNoticeSuccess(true);
    showToast('Notice Published', `Announcement "${newNotice.title}" published live.`, 'success');
    setNewNotice({ title: '', titleMr: '', description: '', tag: 'Admissions' });
    setTimeout(() => setNoticeSuccess(false), 3000);
  };

  const filteredLeads = leadsList.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      (l.course || '').toLowerCase().includes(leadSearch.toLowerCase());
    const matchCourse = leadFilterCourse === 'ALL' || l.course.includes(leadFilterCourse);
    return matchSearch && matchCourse;
  });

  const filteredCerts = Object.values(certsList).filter((c) => {
    return (
      c.studentName.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.regNumber.toLowerCase().includes(certSearch.toLowerCase()) ||
      c.courseName.toLowerCase().includes(certSearch.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#001738]/85 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Floating Toast Notification Banner */}
      {toastNotification.show && (
        <div className="fixed top-5 right-5 z-[9999] max-w-md w-[92vw] sm:w-auto animate-in slide-in-from-top-4 duration-300 shadow-2xl">
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 shadow-xl backdrop-blur-md ${
              toastNotification.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-500/50'
                : toastNotification.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-500/50'
                : 'bg-[#002760]/95 text-white border-[#1557C0]/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl text-[#FFD21F]">
                {toastNotification.type === 'success' ? 'check_circle' : toastNotification.type === 'error' ? 'error' : 'info'}
              </span>
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h5 className="font-['Manrope'] font-black text-sm tracking-wide text-white">
                {toastNotification.title}
              </h5>
              <p className="text-xs text-white/90 font-medium mt-0.5 leading-snug">
                {toastNotification.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setToastNotification((prev) => ({ ...prev, show: false }))}
              className="shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        </div>
      )}

      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-[#E6ECF3] overflow-hidden relative"
        id="admin-panel-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#002760] via-[#0A3D80] to-[#1557C0] text-white flex justify-between items-center relative">
          <div className="flex items-center gap-3.5">
            <InstituteLogo className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 drop-shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/15 px-2 py-0.5 rounded-md border border-[#FFD21F]/30">
                  प्रशासन व संपादन पॅनेल (Admin CMS)
                </span>
                <span className="text-xs text-white/80">Site Editor & Management</span>
              </div>
              <h3 className="font-['Manrope'] text-lg sm:text-2xl font-black tracking-tight mt-0.5">
                Abhinav Technical Institute Admin Portal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* PIN Authentication Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 p-6 sm:p-12 flex items-center justify-center bg-[#F4F8FD]">
            <form
              onSubmit={handleLogin}
              className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E6ECF3] shadow-xl max-w-md w-full text-center space-y-6"
            >
              <div className="w-16 h-16 bg-[#002760]/10 text-[#002760] rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-['Manrope'] text-xl font-bold text-[#002760]">
                  Admin PIN Verification
                </h4>
                <p className="text-xs text-[#172033]/70">
                  Please enter institute master password or admin PIN to manage site content and records.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-[#172033]/80 uppercase tracking-wider">
                  Admin Passcode / PIN
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#1557C0] focus:ring-2 focus:ring-[#1557C0]/20"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-rose-600 font-bold text-center">
                    Incorrect password! Access denied.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#002760] hover:bg-[#1557C0] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Access Administration & CMS
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <>
            {/* Admin Tabs */}
            <div className="flex border-b border-[#E6ECF3] bg-[#F4F8FD] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-2 py-2">
              {[
                { id: 'overview', label: 'Overview', icon: 'dashboard' },
                { id: 'cms', label: '🎨 Site Content & Images (CMS)', icon: 'edit_note', highlight: true },
                { id: 'gr', label: `🏛️ Govt. Orders & GR (${grList.length})`, icon: 'policy', highlight: true },
                { id: 'leads', label: `Leads CRM (${leadsList.length})`, icon: 'group' },
                { id: 'certificates', label: `Certificates (${Object.keys(certsList).length})`, icon: 'verified' },
                { id: 'receipts', label: 'Fee Receipt & ID Card', icon: 'badge' },
                { id: 'batches', label: 'Course Admissions', icon: 'event_available' },
                { id: 'notices', label: 'Notice Board', icon: 'campaign' },
                { id: 'security', label: '🔐 Change Password', icon: 'lock_reset' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeAdminTab === tab.id
                      ? tab.highlight
                        ? 'bg-[#FFD21F] text-[#002760] shadow-sm font-extrabold'
                        : 'bg-[#002760] text-white shadow-sm'
                      : tab.highlight
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                      : 'text-[#172033]/70 hover:text-[#002760] hover:bg-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Admin Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
              {/* TAB: GOVERNMENT ORDERS & GR MANAGER */}
              {activeAdminTab === 'gr' && (
                <div className="space-y-6">
                  {/* Top Action Banner */}
                  <div className="bg-gradient-to-r from-[#002760] via-[#0A3D80] to-[#1557C0] text-white p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/20 px-2.5 py-0.5 rounded-md border border-[#FFD21F]/30">
                        Official Government Resolution (GR) Authority
                      </span>
                      <h4 className="font-['Manrope'] text-xl font-black mt-1">
                        Government Orders, GRs & Affiliation Letters
                      </h4>
                      <p className="text-xs text-white/80 mt-0.5">
                        Add, edit, or upload official Maharashtra & Central Government Resolutions, ITI equivalencies & apprentice circulars.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleResetGr}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
                        title="Reset GR list to original default 6 files"
                      >
                        Reset Defaults
                      </button>
                      <button
                        onClick={() => {
                          setEditingGr(null);
                          setNewGr({
                            id: `gr-${Date.now()}`,
                            titleMr: '',
                            titleEn: '',
                            number: '',
                            date: new Date().toLocaleDateString('mr-IN'),
                            deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
                            deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
                            summaryMr: '',
                            summaryEn: '',
                            pdfPath: '/gr/gr-01-diploma-course-recognition-2013.pdf',
                            status: 'GOVT DIPLOMA GR',
                            badgeColor: 'bg-[#002760] text-white',
                            codeNumber: '',
                          });
                          setIsAddGrModalOpen(true);
                        }}
                        className="px-4 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">add_circle</span>
                        Add New GR / Order
                      </button>
                    </div>
                  </div>

                  {grSaveSuccess && (
                    <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl text-center animate-fadeIn">
                      ✓ Government Resolution saved and updated in database successfully!
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#F8FAFC] p-3 rounded-2xl border border-[#E6ECF3]">
                    <div className="relative flex-1 w-full">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                        search
                      </span>
                      <input
                        type="text"
                        value={grSearchQuery}
                        onChange={(e) => setGrSearchQuery(e.target.value)}
                        placeholder="Search by GR Number, Title, or Department..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#1557C0]"
                      />
                    </div>
                    <div className="text-xs font-bold text-[#002760] shrink-0 px-2">
                      Total: {grList.length} GRs
                    </div>
                  </div>

                  {/* GR Items List / Cards */}
                  <div className="space-y-3">
                    {grList
                      .filter((gr) => {
                        if (!grSearchQuery.trim()) return true;
                        const q = grSearchQuery.toLowerCase();
                        return (
                          gr.titleMr.toLowerCase().includes(q) ||
                          gr.titleEn.toLowerCase().includes(q) ||
                          gr.number.toLowerCase().includes(q) ||
                          gr.deptMr.toLowerCase().includes(q) ||
                          (gr.codeNumber && gr.codeNumber.toLowerCase().includes(q))
                        );
                      })
                      .map((gr, idx) => (
                        <div
                          key={gr.id}
                          className="bg-white border border-[#E6ECF3] rounded-2xl p-4 sm:p-5 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#002760] text-[#FFD21F] font-black text-xs flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${gr.badgeColor || 'bg-[#002760] text-white'}`}>
                                {gr.status}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#002760] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                                {gr.number}
                              </span>
                              {gr.codeNumber && (
                                <span className="font-mono text-[11px] text-gray-500">
                                  सांकेतांक: {gr.codeNumber}
                                </span>
                              )}
                            </div>

                            <h5 className="font-['Manrope'] font-bold text-sm text-[#002760] leading-snug">
                              {gr.titleMr}
                            </h5>
                            {gr.titleEn && (
                              <p className="text-xs text-gray-600 font-medium">
                                {gr.titleEn}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#1557C0] font-semibold">
                              <span>🏛️ {gr.deptMr}</span>
                              <span>•</span>
                              <span className="text-gray-500">📅 {gr.date}</span>
                              <span>•</span>
                              <span className="text-gray-400 font-mono text-[10px] truncate max-w-xs">
                                📄 {gr.pdfPath.substring(0, 45)}...
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                            <a
                              href={gr.pdfPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1557C0] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                              title="Preview PDF"
                            >
                              <span className="material-symbols-outlined text-sm">visibility</span>
                              <span>View PDF</span>
                            </a>

                            <button
                              onClick={() => {
                                setEditingGr(gr);
                                setIsAddGrModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteGr(gr.id)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Add / Edit GR Modal */}
                  {isAddGrModalOpen && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#001738]/80 backdrop-blur-xs animate-fadeIn">
                      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#CBD5E1] overflow-hidden">
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#002760] to-[#1557C0] text-white flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-xl text-[#FFD21F]">
                              {editingGr ? 'edit_document' : 'add_circle'}
                            </span>
                            <h4 className="font-['Manrope'] text-base sm:text-lg font-bold">
                              {editingGr ? 'Edit Government Resolution (GR)' : 'Add New Government Resolution (GR)'}
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              setIsAddGrModalOpen(false);
                              setEditingGr(null);
                            }}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">close</span>
                          </button>
                        </div>

                        <form onSubmit={handleSaveGr} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">
                              मराठीत शासन निर्णय / आदेश शीर्षक (Title in Marathi) *
                            </label>
                            <input
                              type="text"
                              required
                              value={editingGr ? editingGr.titleMr : newGr.titleMr}
                              onChange={(e) =>
                                editingGr
                                  ? setEditingGr({ ...editingGr, titleMr: e.target.value })
                                  : setNewGr({ ...newGr, titleMr: e.target.value })
                              }
                              placeholder="उदा: व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्ष कालावधीच्या अभ्यासक्रमांना पदविका मान्यता..."
                              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">
                              English Title (शासन निर्णय शीर्षक - इंग्रजीत)
                            </label>
                            <input
                              type="text"
                              value={editingGr ? editingGr.titleEn : newGr.titleEn}
                              onChange={(e) =>
                                editingGr
                                  ? setEditingGr({ ...editingGr, titleEn: e.target.value })
                                  : setNewGr({ ...newGr, titleEn: e.target.value })
                              }
                              placeholder="e.g. Academic Recognition of 2-Year Vocational Courses as Diploma Course..."
                              className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                शासन निर्णय क्र. / जा.क्र. (GR / Letter Number) *
                              </label>
                              <input
                                type="text"
                                required
                                value={editingGr ? editingGr.number : newGr.number}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, number: e.target.value })
                                    : setNewGr({ ...newGr, number: e.target.value })
                                }
                                placeholder="उदा: शासन निर्णय क्र: व्हीओसी-२०१२/६९७/प्र.क्र.२९२/व्यशि-४"
                                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold font-mono text-xs"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                दिनांक / Issue Date
                              </label>
                              <input
                                type="text"
                                value={editingGr ? editingGr.date : newGr.date}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, date: e.target.value })
                                    : setNewGr({ ...newGr, date: e.target.value })
                                }
                                placeholder="उदा: २१ जानेवारी, २०१३ (21st January 2013)"
                                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                विभाग / मंत्रालय (Department in Marathi)
                              </label>
                              <input
                                type="text"
                                value={editingGr ? editingGr.deptMr : newGr.deptMr}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, deptMr: e.target.value })
                                    : setNewGr({ ...newGr, deptMr: e.target.value })
                                }
                                placeholder="उदा: महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई"
                                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                Department in English
                              </label>
                              <input
                                type="text"
                                value={editingGr ? editingGr.deptEn : newGr.deptEn}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, deptEn: e.target.value })
                                    : setNewGr({ ...newGr, deptEn: e.target.value })
                                }
                                placeholder="e.g. Higher & Technical Education Department, Govt. of Maharashtra"
                                className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                Category / Status Badge
                              </label>
                              <input
                                type="text"
                                value={editingGr ? editingGr.status : newGr.status}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, status: e.target.value })
                                    : setNewGr({ ...newGr, status: e.target.value })
                                }
                                placeholder="e.g. GOVT DIPLOMA GR"
                                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold uppercase text-xs"
                              />
                            </div>

                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                Badge Color Style
                              </label>
                              <select
                                value={editingGr ? editingGr.badgeColor : newGr.badgeColor}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, badgeColor: e.target.value })
                                    : setNewGr({ ...newGr, badgeColor: e.target.value })
                                }
                                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold text-xs"
                              >
                                <option value="bg-[#002760] text-white">Navy Blue (Default)</option>
                                <option value="bg-emerald-700 text-white">Emerald Green (ITI / Equiv)</option>
                                <option value="bg-amber-700 text-white">Amber (Gazette of India)</option>
                                <option value="bg-blue-700 text-white">Blue (HAL / Industry)</option>
                                <option value="bg-purple-700 text-white">Purple (Circular / Board)</option>
                                <option value="bg-rose-700 text-white">Rose (Urgent Notice)</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-bold text-[#172033]/80 block mb-1">
                                सांकेतांक क्र. (Computer Code No)
                              </label>
                              <input
                                type="text"
                                value={editingGr ? (editingGr.codeNumber || '') : (newGr.codeNumber || '')}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, codeNumber: e.target.value })
                                    : setNewGr({ ...newGr, codeNumber: e.target.value })
                                }
                                placeholder="उदा: २०१३०१२११५४५२६३५०८"
                                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">
                              संक्षिप्त सारांश / स्पष्टीकरण (Summary in Marathi)
                            </label>
                            <textarea
                              rows={2}
                              value={editingGr ? editingGr.summaryMr : newGr.summaryMr}
                              onChange={(e) =>
                                editingGr
                                  ? setEditingGr({ ...editingGr, summaryMr: e.target.value })
                                  : setNewGr({ ...newGr, summaryMr: e.target.value })
                              }
                              placeholder="शासन निर्णयाचा संक्षिप्त तपशील प्रविष्ट करा..."
                              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">
                              Summary in English
                            </label>
                            <textarea
                              rows={2}
                              value={editingGr ? editingGr.summaryEn : newGr.summaryEn}
                              onChange={(e) =>
                                editingGr
                                  ? setEditingGr({ ...editingGr, summaryEn: e.target.value })
                                  : setNewGr({ ...newGr, summaryEn: e.target.value })
                              }
                              placeholder="Enter brief description of the resolution in English..."
                              className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                            />
                          </div>

                          {/* PDF Document URL & Upload */}
                          <div className="bg-[#F1F5F9] p-3.5 rounded-2xl border border-[#CBD5E1] space-y-2">
                            <label className="font-bold text-[#002760] block">
                              PDF Document Path / File Upload
                            </label>
                            <div className="flex flex-col sm:flex-row gap-2 items-center">
                              <input
                                type="text"
                                required
                                value={editingGr ? editingGr.pdfPath : newGr.pdfPath}
                                onChange={(e) =>
                                  editingGr
                                    ? setEditingGr({ ...editingGr, pdfPath: e.target.value })
                                    : setNewGr({ ...newGr, pdfPath: e.target.value })
                                }
                                placeholder="/gr/my-gr-file.pdf or URL or upload from device"
                                className="flex-1 w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-mono text-xs"
                              />

                              <label className="shrink-0 px-3.5 py-2 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                                <span className="material-symbols-outlined text-base">upload_file</span>
                                <span>Upload PDF</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => handleUploadGrPdf(e, !!editingGr)}
                                />
                              </label>
                            </div>
                            <p className="text-[10px] text-gray-500">
                              Tip: You can select existing paths like <code className="text-[#1557C0]">/gr/gr-01-diploma-course-recognition-2013.pdf</code> or upload a local PDF directly from your computer/mobile.
                            </p>
                          </div>

                          <div className="flex justify-end gap-2 pt-3 border-t border-[#E6ECF3]">
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddGrModalOpen(false);
                                setEditingGr(null);
                              }}
                              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-base">save</span>
                              <span>{editingGr ? 'Update Resolution' : 'Save & Publish GR'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CMS SITE CONTENT & MEDIA MANAGER */}
              {activeAdminTab === 'cms' && (
                <div className="space-y-6">
                  {/* CMS Header Banner */}
                  <div className="bg-gradient-to-r from-[#002760] via-[#0A3D80] to-[#1557C0] text-white p-5 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/20 px-2.5 py-0.5 rounded-md border border-[#FFD21F]/30">
                        Live Website Editor (CMS)
                      </span>
                      <h4 className="font-['Manrope'] text-xl font-black mt-1">
                        Edit Website Text, Images & Contact Details
                      </h4>
                      <p className="text-xs text-white/80 mt-0.5">
                        Changes saved here will immediately update on the live website and synchronize across devices.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetCMS}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
                        title="Reset to default content"
                      >
                        Reset to Defaults
                      </button>
                      <button
                        onClick={handleSaveCMS}
                        className="px-5 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-base">save</span>
                        Save All Changes
                      </button>
                    </div>
                  </div>

                  {cmsSaveSuccess && (
                    <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl text-center animate-fadeIn">
                      ✓ Website content & images updated and saved to server successfully!
                    </div>
                  )}

                  {/* CMS Sub Navigation */}
                  <div className="flex border-b border-[#E6ECF3] gap-2 pb-2 overflow-x-auto no-scrollbar">
                    {[
                      {
                        id: 'hero',
                        label: `Hero Banner & Slider (${(siteContent.hero.carouselImages && siteContent.hero.carouselImages.length > 0 ? siteContent.hero.carouselImages : HERO_CAROUSEL_IMAGES).length})`,
                        icon: 'view_carousel',
                      },
                      { id: 'about', label: 'About & Director Message', icon: 'person' },
                      { id: 'awards', label: `🏆 Awards & Media (${(siteContent.awards?.gallery || []).length})`, icon: 'workspace_premium' },
                      { id: 'courses', label: 'Courses & Fees', icon: 'school' },
                      { id: 'gallery', label: `Workshop Gallery (${siteContent.gallery.length})`, icon: 'photo_library' },
                      { id: 'contact', label: 'Contact & Location', icon: 'call' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setCmsSubTab(st.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cmsSubTab === st.id
                            ? 'bg-[#1557C0] text-white shadow-xs'
                            : 'bg-[#F4F8FD] text-[#172033]/70 hover:text-[#002760]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{st.icon}</span>
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* 1. HERO SECTION & IMAGE SLIDER EDITOR */}
                  {cmsSubTab === 'hero' && (
                    <div className="space-y-6">
                      {/* Section A: Headlines & Taglines */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
                          <span className="material-symbols-outlined text-xl text-[#002760]">campaign</span>
                          <h5 className="font-['Manrope'] text-base font-bold text-[#002760]">
                            Hero Banner Headlines & Description (मुख्य मथळा व माहिती)
                          </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">
                              Top Badge / Tagline (Marathi)
                            </label>
                            <input
                              type="text"
                              value={siteContent.hero.badgeTextMr}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, badgeTextMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">
                              Top Badge / Tagline (English)
                            </label>
                            <input
                              type="text"
                              value={siteContent.hero.badgeText}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, badgeText: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">
                              Main Heading (Marathi)
                            </label>
                            <input
                              type="text"
                              value={siteContent.hero.headingMr}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, headingMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-black text-sm"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">
                              Main Heading (English)
                            </label>
                            <input
                              type="text"
                              value={siteContent.hero.heading}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, heading: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-black text-sm"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">
                              Sub-heading / Description (Marathi)
                            </label>
                            <textarea
                              value={siteContent.hero.subheadingMr}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, subheadingMr: e.target.value },
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">
                              Sub-heading / Description (English)
                            </label>
                            <textarea
                              value={siteContent.hero.subheading}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  hero: { ...siteContent.hero, subheading: e.target.value },
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section B: Hero Banner Image Carousel / Slider Manager */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-5">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E2E8F0] pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-2xl text-[#1557C0]">view_carousel</span>
                              <h5 className="font-['Manrope'] text-base sm:text-lg font-black text-[#002760]">
                                Hero Banner Image Slider (मुख्य बॅनर स्लायडर)
                              </h5>
                              <span className="text-[11px] font-black bg-[#FFD21F] text-[#002760] px-2.5 py-0.5 rounded-full shadow-2xs">
                                {(siteContent.hero.carouselImages && siteContent.hero.carouselImages.length > 0
                                  ? siteContent.hero.carouselImages
                                  : HERO_CAROUSEL_IMAGES
                                ).length} Slides Active
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                              Upload, edit captions, re-order, or delete slides shown in the rotating banner at the top of the homepage.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={handleResetHeroSlides}
                              className="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-300 transition-all cursor-pointer shadow-2xs"
                              title="Reset to default 5 institute workshop slides"
                            >
                              Reset Default Slides
                            </button>

                            <button
                              type="button"
                              onClick={handleAddHeroSlideByUrl}
                              className="px-3.5 py-2 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                              title="Add new slide by pasting direct image link or web URL"
                            >
                              <span className="material-symbols-outlined text-base">link</span>
                              <span>+ Add Slide via Link/URL</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleAddHeroSlide}
                              className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#002760] text-xs font-bold rounded-xl border border-gray-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-base">add</span>
                              <span>Add Default Slide</span>
                            </button>

                            <label className="px-4 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] text-xs font-black rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-base font-bold">upload</span>
                              <span>📁 Upload Photo (PC / Mobile)</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUploadNewHeroSlide}
                              />
                            </label>
                          </div>
                        </div>

                        {/* Slide Cards List */}
                        <div className="space-y-4">
                          {(siteContent.hero.carouselImages && siteContent.hero.carouselImages.length > 0
                            ? siteContent.hero.carouselImages
                            : HERO_CAROUSEL_IMAGES
                          ).map((slide, idx, arr) => (
                            <div
                              key={idx}
                              className="bg-white border-2 border-[#E2E8F0] hover:border-[#1557C0]/40 rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col md:flex-row gap-5 items-start"
                            >
                              {/* Left Preview & Image Uploader */}
                              <div className="w-full md:w-[280px] shrink-0 space-y-2.5">
                                <div className="relative h-[155px] rounded-xl overflow-hidden shadow-md bg-gray-900 border border-gray-200 group">
                                  <img
                                    src={slide.src}
                                    alt={slide.alt || slide.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                    <span className="bg-[#002760] text-white font-mono font-black text-[10px] px-2 py-0.5 rounded-md shadow-xs">
                                      Slide #{idx + 1}
                                    </span>
                                  </div>
                                  <div className="absolute bottom-2 left-2 right-2 text-white pointer-events-none">
                                    <span className="inline-block bg-[#FFD21F] text-[#002760] font-bold text-[9px] uppercase px-2 py-0.5 rounded-full mb-0.5">
                                      {slide.category || 'Live Workshop'}
                                    </span>
                                    <p className="font-bold text-xs truncate drop-shadow-sm">
                                      {slide.title || 'Slide Title'}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <label className="flex-1 text-center py-2 bg-[#002760] hover:bg-[#1557C0] text-white text-[11px] font-bold rounded-xl shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    <span>Change Photo</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) => handleUploadHeroSlideImage(idx, e)}
                                    />
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleMoveHeroSlide(idx, 'up')}
                                    disabled={idx === 0}
                                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#002760] transition-colors cursor-pointer"
                                    title="Move Up"
                                  >
                                    <span className="material-symbols-outlined text-sm font-bold">arrow_upward</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleMoveHeroSlide(idx, 'down')}
                                    disabled={idx === arr.length - 1}
                                    className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#002760] transition-colors cursor-pointer"
                                    title="Move Down"
                                  >
                                    <span className="material-symbols-outlined text-sm font-bold">arrow_downward</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteHeroSlide(idx)}
                                    className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Delete Slide"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </div>
                              </div>

                              {/* Right Fields & Multilingual Inputs */}
                              <div className="flex-1 w-full space-y-3 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="font-bold text-[#172033]/80 block mb-1">
                                      Slide Tag / Badge (मराठीत)
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.categoryMr || ''}
                                      onChange={(e) => {
                                        const updated = [...(siteContent.hero.carouselImages || HERO_CAROUSEL_IMAGES)];
                                        updated[idx] = { ...updated[idx], categoryMr: e.target.value };
                                        setSiteContent({
                                          ...siteContent,
                                          hero: { ...siteContent.hero, carouselImages: updated },
                                        });
                                      }}
                                      placeholder="उदा: प्रात्यक्षिक कार्यशाळा / संगणक लॅब"
                                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold"
                                    />
                                  </div>

                                  <div>
                                    <label className="font-bold text-[#172033]/80 block mb-1">
                                      Slide Tag / Badge (English)
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.category || ''}
                                      onChange={(e) => {
                                        const updated = [...(siteContent.hero.carouselImages || HERO_CAROUSEL_IMAGES)];
                                        updated[idx] = { ...updated[idx], category: e.target.value };
                                        setSiteContent({
                                          ...siteContent,
                                          hero: { ...siteContent.hero, carouselImages: updated },
                                        });
                                      }}
                                      placeholder="e.g. Live Workshop / Electrical Lab"
                                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="font-bold text-[#172033]/80 block mb-1">
                                      Slide Title (मराठीत शीर्षक) *
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.titleMr || ''}
                                      onChange={(e) => {
                                        const updated = [...(siteContent.hero.carouselImages || HERO_CAROUSEL_IMAGES)];
                                        updated[idx] = { ...updated[idx], titleMr: e.target.value };
                                        setSiteContent({
                                          ...siteContent,
                                          hero: { ...siteContent.hero, carouselImages: updated },
                                        });
                                      }}
                                      placeholder="उदा: संगणक प्रशिक्षण व प्रॅक्टिकल लॅब"
                                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="font-bold text-[#172033]/80 block mb-1">
                                      Slide Title (English) *
                                    </label>
                                    <input
                                      type="text"
                                      value={slide.title || ''}
                                      onChange={(e) => {
                                        const updated = [...(siteContent.hero.carouselImages || HERO_CAROUSEL_IMAGES)];
                                        updated[idx] = { ...updated[idx], title: e.target.value };
                                        setSiteContent({
                                          ...siteContent,
                                          hero: { ...siteContent.hero, carouselImages: updated },
                                        });
                                      }}
                                      placeholder="e.g. Computer Training & IT Practical Lab"
                                      className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-bold text-xs"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Direct Image URL / Path
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.src || ''}
                                    onChange={(e) => {
                                      const updated = [...(siteContent.hero.carouselImages || HERO_CAROUSEL_IMAGES)];
                                      updated[idx] = { ...updated[idx], src: e.target.value };
                                      setSiteContent({
                                        ...siteContent,
                                        hero: { ...siteContent.hero, carouselImages: updated },
                                      });
                                    }}
                                    placeholder="https://... or /assets/..."
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-[11px]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Save Changes CTA Footer */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[#1557C0] text-xl">info</span>
                            <span className="text-xs text-[#002760] font-semibold">
                              All slide additions, edits, and re-orders will be updated across the website when saved.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleSaveCMS}
                            className="px-5 py-2.5 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            <span className="material-symbols-outlined text-base">save</span>
                            <span>Save Hero Slider Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. ABOUT US & DIRECTOR EDITOR */}
                  {cmsSubTab === 'about' && (
                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                      <h5 className="font-['Manrope'] text-base font-bold text-[#002760]">
                        Leadership, Director Message & Stats
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Director / Principal Name</label>
                          <input
                            type="text"
                            value={siteContent.about.principalName}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                about: { ...siteContent.about, principalName: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          />
                        </div>

                        {/* Principal Photo Upload */}
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#172033]/80 block">Principal Photo</label>
                          <div className="flex items-center gap-3">
                            <img
                              src={siteContent.about.principalPhoto}
                              alt="Principal"
                              className="w-12 h-12 rounded-xl object-cover border border-[#CBD5E1] shadow-2xs shrink-0"
                              onError={(e) => {
                                (e.target as any).src = '/assets/principal.png';
                              }}
                            />
                            <div className="flex-1 space-y-1">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002760] hover:bg-[#1557C0] text-white text-[11px] font-bold rounded-xl shadow-2xs cursor-pointer transition-all">
                                <span className="material-symbols-outlined text-[16px]">upload</span>
                                <span>📁 Upload Photo from PC / Phone</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleUploadPrincipalPhoto}
                                />
                              </label>
                              <input
                                type="text"
                                value={siteContent.about.principalPhoto}
                                onChange={(e) =>
                                  setSiteContent({
                                    ...siteContent,
                                    about: { ...siteContent.about, principalPhoto: e.target.value },
                                  })
                                }
                                placeholder="Or enter Image URL"
                                className="w-full px-2.5 py-1 bg-white border border-[#CBD5E1] rounded-lg text-[11px]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="font-bold text-[#172033]/80 block mb-1">
                            Director's Message (Marathi)
                          </label>
                          <textarea
                            value={siteContent.about.directorMessageMr}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                about: { ...siteContent.about, directorMessageMr: e.target.value },
                              })
                            }
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                          />
                        </div>

                        {/* Stats counters */}
                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Years of Excellence Stat</label>
                          <input
                            type="text"
                            value={siteContent.about.statsYears}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                about: { ...siteContent.about, statsYears: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Placed Students Count Stat</label>
                          <input
                            type="text"
                            value={siteContent.about.statsAlumni}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                about: { ...siteContent.about, statsAlumni: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. AWARDS & HONORS EDITOR (LOKMAT LOKRATNA & VIDEO REEL) */}
                  {cmsSubTab === 'awards' && (
                    <div className="space-y-6">
                      {/* Section Top Info Card */}
                      <div className="bg-gradient-to-br from-[#002760] to-[#001738] text-white p-5 rounded-3xl border border-[#FFD21F]/30 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/20 px-2.5 py-0.5 rounded-md border border-[#FFD21F]/30">
                              🏆 State Level Honor & Recognition CMS
                            </span>
                            <h4 className="font-['Manrope'] text-lg sm:text-xl font-black mt-1 text-white">
                              {siteContent.awards?.headingMr || 'लोकमत लोकरत्न सन्मान सोहळा २०२६'}
                            </h4>
                            <p className="text-xs text-slate-200 mt-0.5">
                              Manage award details, highlight points, high-definition ceremony photographs, and featured video reel.
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-[#FFD21F] text-[#002760] font-black text-xs rounded-xl self-start sm:self-auto">
                            {siteContent.awards?.year || '2026'} Edition
                          </span>
                        </div>
                      </div>

                      {/* 1. Header Titles & Taglines */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                        <h5 className="font-['Manrope'] text-base font-bold text-[#002760] flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg text-[#1557C0]">title</span>
                          <span>Section Titles & Badges</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Section Badge (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.badgeMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, badgeMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Section Badge (English)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.badge || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, badge: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Main Heading (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.headingMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, headingMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-black text-sm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Main Heading (English)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.heading || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, heading: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-black text-sm"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">Section Subheading (Marathi)</label>
                            <textarea
                              value={siteContent.awards?.subheadingMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, subheadingMr: e.target.value },
                                })
                              }
                              rows={2}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 2. Award Citation & Details */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                        <h5 className="font-['Manrope'] text-base font-bold text-[#002760] flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg text-[#1557C0]">military_tech</span>
                          <span>Award Citation & Recipient Information</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Award Name (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.mainAwardTitleMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, mainAwardTitleMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Presented By (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.presentedByMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, presentedByMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Recipient Name (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.recipientNameMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, recipientNameMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-[#002760]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-[#172033]/80 block">Recipient Role (Marathi)</label>
                            <input
                              type="text"
                              value={siteContent.awards?.recipientRoleMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, recipientRoleMr: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <label className="font-bold text-[#172033]/80 block">Award Description / Citation (Marathi)</label>
                            <textarea
                              value={siteContent.awards?.descriptionMr || ''}
                              onChange={(e) =>
                                setSiteContent({
                                  ...siteContent,
                                  awards: { ...siteContent.awards, descriptionMr: e.target.value },
                                })
                              }
                              rows={3}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Featured Video Reel Settings */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                        <h5 className="font-['Manrope'] text-base font-bold text-[#002760] flex items-center gap-2">
                          <span className="material-symbols-outlined text-lg text-red-600">movie</span>
                          <span>Featured Video Reel Player</span>
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs items-center">
                          <div className="md:col-span-5 bg-black rounded-2xl overflow-hidden aspect-video relative border border-gray-300 w-full shadow-sm">
                            <video
                              src={siteContent.awards?.featuredVideo?.src || '/assets/awards/lokmat_award_reel.mp4'}
                              controls
                              className="w-full h-full object-contain bg-black"
                            />
                          </div>

                          <div className="md:col-span-7 space-y-3">
                            <div className="space-y-1.5">
                              <label className="font-bold text-[#172033]/80 block">Video Source (MP4 File)</label>
                              <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-all">
                                  <span className="material-symbols-outlined text-sm">upload_file</span>
                                  <span>📁 Upload Video from PC</span>
                                  <input
                                    type="file"
                                    accept="video/mp4,video/*"
                                    className="hidden"
                                    onChange={handleUploadAwardVideo}
                                  />
                                </label>
                                <span className="text-[11px] text-gray-500 font-medium">Max 25MB MP4</span>
                              </div>
                              <input
                                type="text"
                                value={siteContent.awards?.featuredVideo?.src || ''}
                                onChange={(e) =>
                                  setSiteContent({
                                    ...siteContent,
                                    awards: {
                                      ...siteContent.awards,
                                      featuredVideo: {
                                        ...siteContent.awards.featuredVideo,
                                        src: e.target.value,
                                      },
                                    },
                                  })
                                }
                                placeholder="Or enter Video URL (e.g. /assets/awards/lokmat_award_reel.mp4)"
                                className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-mono text-[11px]"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="font-bold text-[#172033]/80 block mb-1">Video Title (Marathi)</label>
                                <input
                                  type="text"
                                  value={siteContent.awards?.featuredVideo?.titleMr || ''}
                                  onChange={(e) =>
                                    setSiteContent({
                                      ...siteContent,
                                      awards: {
                                        ...siteContent.awards,
                                        featuredVideo: {
                                          ...siteContent.awards.featuredVideo,
                                          titleMr: e.target.value,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-[#172033]/80 block mb-1">Video Title (English)</label>
                                <input
                                  type="text"
                                  value={siteContent.awards?.featuredVideo?.title || ''}
                                  onChange={(e) =>
                                    setSiteContent({
                                      ...siteContent,
                                      awards: {
                                        ...siteContent.awards,
                                        featuredVideo: {
                                          ...siteContent.awards.featuredVideo,
                                          title: e.target.value,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 4. Award Ceremony Photographs Gallery */}
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h5 className="font-['Manrope'] text-base font-bold text-[#002760] flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg text-[#1557C0]">photo_library</span>
                              <span>Award Ceremony Photographs ({(siteContent.awards?.gallery || []).length} Photos)</span>
                            </h5>
                            <p className="text-xs text-[#172033]/70">
                              Add, replace, or update captions for official stage & celebration photographs.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                            <button
                              type="button"
                              onClick={handleAddAwardImageByUrl}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                              title="Add ceremony photo by pasting direct image link or web URL"
                            >
                              <span className="material-symbols-outlined text-base">link</span>
                              <span>+ Add Photo via Link/URL</span>
                            </button>

                            <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] text-xs font-black rounded-xl shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95">
                              <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                              <span>📁 Upload Photo from PC</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleUploadNewAwardImage}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(siteContent.awards?.gallery || []).map((photo, idx) => (
                            <div
                              key={photo.id || idx}
                              className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-3.5 space-y-2.5 text-xs shadow-2xs hover:shadow-xs transition-shadow"
                            >
                              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-[#E2E8F0]">
                                <img
                                  src={photo.src}
                                  alt={photo.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as any).src = 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800';
                                  }}
                                />
                                {photo.badge && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[#FFD21F] text-[10px] font-black uppercase tracking-wider border border-white/20">
                                    {photo.badge}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#CBD5E1] hover:bg-gray-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                                  <span className="material-symbols-outlined text-[13px]">refresh</span>
                                  <span>Replace Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleUploadAwardImage(idx, e)}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAwardImage(photo.id)}
                                  className="text-rose-600 hover:text-rose-700 text-[10px] font-bold underline cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                <div>
                                  <label className="text-[10px] text-[#172033]/70 font-bold block">
                                    Photo Link / Direct Image URL
                                  </label>
                                  <input
                                    type="text"
                                    value={photo.src || ''}
                                    onChange={(e) => {
                                      const updated = [...siteContent.awards.gallery];
                                      updated[idx] = { ...updated[idx], src: e.target.value };
                                      setSiteContent({
                                        ...siteContent,
                                        awards: { ...siteContent.awards, gallery: updated },
                                      });
                                    }}
                                    placeholder="https://... or /assets/awards/..."
                                    className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-[11px] font-mono"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-[#172033]/70 font-bold block">Badge / Tag</label>
                                  <input
                                    type="text"
                                    value={photo.badge || ''}
                                    onChange={(e) => {
                                      const updated = [...siteContent.awards.gallery];
                                      updated[idx] = { ...updated[idx], badge: e.target.value };
                                      setSiteContent({
                                        ...siteContent,
                                        awards: { ...siteContent.awards, gallery: updated },
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-xs"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-[#172033]/70 font-bold block">Caption (Marathi)</label>
                                  <input
                                    type="text"
                                    value={photo.titleMr || ''}
                                    onChange={(e) => {
                                      const updated = [...siteContent.awards.gallery];
                                      updated[idx] = { ...updated[idx], titleMr: e.target.value };
                                      setSiteContent({
                                        ...siteContent,
                                        awards: { ...siteContent.awards, gallery: updated },
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] text-[#172033]/70 font-bold block">Description (Marathi)</label>
                                  <input
                                    type="text"
                                    value={photo.descriptionMr || ''}
                                    onChange={(e) => {
                                      const updated = [...siteContent.awards.gallery];
                                      updated[idx] = { ...updated[idx], descriptionMr: e.target.value };
                                      setSiteContent({
                                        ...siteContent,
                                        awards: { ...siteContent.awards, gallery: updated },
                                      });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-[11px]"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. COURSES & TRADES CMS MANAGER */}
                  {cmsSubTab === 'courses' && (
                    <div className="space-y-6">
                      {/* Subtab Header */}
                      <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1557C0] bg-[#1557C0]/10 px-2 py-0.5 rounded-md">
                              अभ्यासक्रम व्यवस्थापन (Course Catalog CMS)
                            </span>
                            <span className="text-xs font-bold text-gray-500">
                              Total: {(siteContent.courses && siteContent.courses.length > 0 ? siteContent.courses : COURSES).length} Courses
                            </span>
                          </div>
                          <h5 className="font-['Manrope'] text-lg font-black text-[#002760] mt-1">
                            Vocational Courses & Trade Management
                          </h5>
                          <p className="text-xs text-gray-600 font-medium">
                            Add, edit syllabus, update photos, change durations & manage all vocational trades live on website.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                          <button
                            type="button"
                            onClick={handleResetCourses}
                            className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            Reset 10 Trades
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAddCourse}
                            className="px-5 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-base">add_circle</span>
                            <span>+ Add New Course</span>
                          </button>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#F8FAFC] p-3 rounded-2xl border border-[#E6ECF3]">
                        <div className="relative flex-1 w-full">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                            search
                          </span>
                          <input
                            type="text"
                            value={courseSearchQuery}
                            onChange={(e) => setCourseSearchQuery(e.target.value)}
                            placeholder="Search by Course Name, Code (e.g. 304202), or Category..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#1557C0]"
                          />
                        </div>
                      </div>

                      {/* Course Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(siteContent.courses && siteContent.courses.length > 0 ? siteContent.courses : COURSES)
                          .filter((c) => {
                            if (!courseSearchQuery.trim()) return true;
                            const q = courseSearchQuery.toLowerCase();
                            return (
                              c.name.toLowerCase().includes(q) ||
                              (c.nameMr && c.nameMr.toLowerCase().includes(q)) ||
                              c.code.toLowerCase().includes(q) ||
                              c.category.toLowerCase().includes(q) ||
                              (c.categoryMr && c.categoryMr.toLowerCase().includes(q))
                            );
                          })
                          .map((c, idx) => (
                            <div
                              key={c.id || idx}
                              className="bg-white border border-[#E6ECF3] rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-3 relative group"
                            >
                              <div className="space-y-3">
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="w-6 h-6 rounded-full bg-[#002760] text-[#FFD21F] font-black text-xs flex items-center justify-center shrink-0">
                                      {idx + 1}
                                    </span>
                                    <span className="font-mono text-xs font-extrabold text-[#1557C0] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                                      Code: {c.code}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                      {c.categoryMr || c.category}
                                    </span>
                                    {c.admissionsOpen ? (
                                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        प्रवेश सुरू
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                                        Closed
                                      </span>
                                    )}
                                  </div>

                                  {/* Move Order Controls */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveCourse(idx, 'up')}
                                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-[#002760] disabled:opacity-30 cursor-pointer"
                                      title="Move Up"
                                    >
                                      <span className="material-symbols-outlined text-base">arrow_upward</span>
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === (siteContent.courses?.length || COURSES.length) - 1}
                                      onClick={() => handleMoveCourse(idx, 'down')}
                                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-[#002760] disabled:opacity-30 cursor-pointer"
                                      title="Move Down"
                                    >
                                      <span className="material-symbols-outlined text-base">arrow_downward</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Image & Info Layout */}
                                <div className="flex gap-3.5 items-start">
                                  <div className="relative w-24 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[#E2E8F0] group/img">
                                    <img
                                      src={c.image}
                                      alt={c.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                                      }}
                                    />
                                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[10px] font-bold p-1 text-center">
                                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                                      <span>Change</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleUploadCourseImage(idx, e)}
                                      />
                                    </label>
                                  </div>

                                  <div className="flex-1 min-w-0 space-y-1">
                                    <h6 className="font-['Manrope'] font-black text-sm text-[#002760] leading-snug">
                                      {c.nameMr || c.name}
                                    </h6>
                                    {c.name && c.nameMr && (
                                      <p className="text-[11px] text-gray-500 font-medium truncate">
                                        {c.name}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-[#1557C0] font-semibold pt-0.5">
                                      <span>⏱️ {c.durationMr || c.duration}</span>
                                      <span>•</span>
                                      <span>🕒 {c.timingMr || c.timing}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Details Pill Row */}
                                <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-600 bg-[#F8FAFC] p-2 rounded-xl border border-[#E6ECF3]">
                                  <span>🎓 पात्रता: <strong className="text-[#002760]">{c.eligibilityMr || c.eligibility}</strong></span>
                                  <span>•</span>
                                  <span>📚 विषय: <strong className="text-[#002760]">{(c.syllabus || []).length} Modules</strong></span>
                                  <span>•</span>
                                  <span>💼 संधी: <strong className="text-[#002760]">{(c.careerOpportunities || []).length} Paths</strong></span>
                                </div>
                              </div>

                              {/* Card Action Buttons */}
                              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCourse(c.id)}
                                  className="px-3 py-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                  <span>Delete</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditCourse(c)}
                                  className="px-4 py-1.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                  <span>Edit Course</span>
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>

                      {/* ADD / EDIT COURSE MODAL */}
                      {isCourseModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
                          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#CBD5E1] overflow-hidden">
                            {/* Modal Top Header */}
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#002760] via-[#0A3D80] to-[#1557C0] text-white flex justify-between items-center shrink-0">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/20 px-2 py-0.5 rounded-md">
                                  {courseModalMode === 'add' ? 'नवीन कोर्स तयार करा' : 'कोर्स माहिती संपादन'}
                                </span>
                                <h4 className="font-['Manrope'] text-lg sm:text-xl font-black mt-0.5">
                                  {courseModalMode === 'add' ? 'Add New Vocational Course' : `Edit: ${courseForm.nameMr || courseForm.name}`}
                                </h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsCourseModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">close</span>
                              </button>
                            </div>

                            {/* Modal Form Scrollable Content */}
                            <form onSubmit={handleSaveCourseForm} className="p-5 overflow-y-auto space-y-4 text-xs">
                              {/* Row 1: Code & Category */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    MSBSVET Course Code (अभ्यासक्रम सांकेतांक) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={courseForm.code}
                                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                                    placeholder="e.g. 304202 or 101201"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Category (वर्गवारी - Marathi & English)
                                  </label>
                                  <input
                                    type="text"
                                    value={courseForm.categoryMr || courseForm.category}
                                    onChange={(e) => setCourseForm({ ...courseForm, categoryMr: e.target.value, category: e.target.value })}
                                    placeholder="उदा: इलेक्ट्रिकल व पॉवर / Civil & Construction"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                  />
                                </div>
                              </div>

                              {/* Row 2: Course Names */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Course Name in Marathi (कोर्सचे नाव - मराठी) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={courseForm.nameMr || ''}
                                    onChange={(e) => setCourseForm({ ...courseForm, nameMr: e.target.value })}
                                    placeholder="उदा: इलेक्ट्रिशियन (इलेक्ट्रिकल सुपरवायझर)"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#002760]"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Course Name in English (English Title) *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={courseForm.name}
                                    onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                                    placeholder="e.g. ELECTRICIAN DIPLOMA – 1 YEAR"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-bold"
                                  />
                                </div>
                              </div>

                              {/* Row 3: Photo Upload & URL */}
                              <div className="bg-[#F1F5F9] p-4 rounded-2xl border border-[#CBD5E1] space-y-3">
                                <label className="font-bold text-[#002760] block">
                                  Course Cover Image (कोर्सचे छायाचित्र)
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-900 border border-[#CBD5E1] shrink-0">
                                    <img
                                      src={courseForm.image}
                                      alt="Course Preview"
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
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
                                        className="flex-1 px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono"
                                      />
                                      <label className="shrink-0 px-3.5 py-2 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                                        <span className="material-symbols-outlined text-base">upload_file</span>
                                        <span>Upload Photo</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={handleUploadModalCourseImage}
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Row 4: Duration, Timing & Eligibility */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Duration (कालावधी)
                                  </label>
                                  <input
                                    type="text"
                                    value={courseForm.durationMr || courseForm.duration}
                                    onChange={(e) => setCourseForm({ ...courseForm, durationMr: e.target.value, duration: e.target.value })}
                                    placeholder="उदा: १ वर्ष / 1 Year"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Timing (बॅच वेळ)
                                  </label>
                                  <input
                                    type="text"
                                    value={courseForm.timingMr || courseForm.timing}
                                    onChange={(e) => setCourseForm({ ...courseForm, timingMr: e.target.value, timing: e.target.value })}
                                    placeholder="उदा: 10:00 AM - 2:00 PM"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Eligibility (पात्रता)
                                  </label>
                                  <input
                                    type="text"
                                    value={courseForm.eligibilityMr || courseForm.eligibility}
                                    onChange={(e) => setCourseForm({ ...courseForm, eligibilityMr: e.target.value, eligibility: e.target.value })}
                                    placeholder="उदा: १० वी / १२ वी / ITI"
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                  />
                                </div>
                              </div>

                              {/* Row 5: Batch Capacity & Admissions Open Toggle */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-[#F8FAFC] p-3 rounded-2xl border border-[#E6ECF3]">
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Batch Capacity (एकूण जागा)
                                  </label>
                                  <input
                                    type="number"
                                    value={courseForm.batchCapacity || 30}
                                    onChange={(e) => setCourseForm({ ...courseForm, batchCapacity: Number(e.target.value) || 30 })}
                                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Enrolled Students (प्रवेशित)
                                  </label>
                                  <input
                                    type="number"
                                    value={courseForm.enrolled || 0}
                                    onChange={(e) => setCourseForm({ ...courseForm, enrolled: Number(e.target.value) || 0 })}
                                    className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                                  />
                                </div>
                                <div className="pt-3 sm:pt-0">
                                  <label className="flex items-center gap-2 cursor-pointer font-bold text-[#002760]">
                                    <input
                                      type="checkbox"
                                      checked={courseForm.admissionsOpen !== false}
                                      onChange={(e) => setCourseForm({ ...courseForm, admissionsOpen: e.target.checked })}
                                      className="w-4 h-4 accent-[#002760] rounded cursor-pointer"
                                    />
                                    <span>Admissions Open (प्रवेश सुरू)</span>
                                  </label>
                                </div>
                              </div>

                              {/* Row 6: Descriptions */}
                              <div>
                                <label className="font-bold text-[#172033]/80 block mb-1">
                                  Short Description (मराठी संक्षिप्त माहिती)
                                </label>
                                <textarea
                                  rows={2}
                                  value={courseForm.descriptionMr || courseForm.description}
                                  onChange={(e) => setCourseForm({ ...courseForm, descriptionMr: e.target.value, description: e.target.value })}
                                  placeholder="कोर्सची प्रमुख वैशिष्ट्ये व माहिती..."
                                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                />
                              </div>

                              <div>
                                <label className="font-bold text-[#172033]/80 block mb-1">
                                  Full Detailed Description (सविस्तर तपशील - शासन मान्यता, समकक्षता व संधी)
                                </label>
                                <textarea
                                  rows={3}
                                  value={courseForm.fullDescriptionMr || courseForm.fullDescription || ''}
                                  onChange={(e) => setCourseForm({ ...courseForm, fullDescriptionMr: e.target.value, fullDescription: e.target.value })}
                                  placeholder="महाराष्ट्र शासन मान्यता, ITI व १२ वी समकक्षता, विविध खात्यांमधील भरती संधी..."
                                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                                />
                              </div>

                              {/* Row 7: Syllabus & Career Opportunities (One per line) */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Syllabus Modules (अभ्यासक्रम विषय - प्रति ओळ १ विषय)
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={(courseForm.syllabusMr && courseForm.syllabusMr.length > 0 ? courseForm.syllabusMr : courseForm.syllabus || []).join('\n')}
                                    onChange={(e) => {
                                      const lines = e.target.value.split('\n');
                                      setCourseForm({
                                        ...courseForm,
                                        syllabusMr: lines,
                                        syllabus: lines,
                                      });
                                    }}
                                    placeholder="थियरी विषय १&#10;प्रॅक्टिकल विषय २&#10;इंडस्ट्रियल लॅब..."
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono"
                                  />
                                  <p className="text-[10px] text-gray-500 mt-0.5">Tip: Write each subject on a new line.</p>
                                </div>

                                <div>
                                  <label className="font-bold text-[#172033]/80 block mb-1">
                                    Career Opportunities (रोजगार व करिअर संधी - प्रति ओळ १ संधी)
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={(courseForm.careerOpportunitiesMr && courseForm.careerOpportunitiesMr.length > 0 ? courseForm.careerOpportunitiesMr : courseForm.careerOpportunities || []).join('\n')}
                                    onChange={(e) => {
                                      const lines = e.target.value.split('\n');
                                      setCourseForm({
                                        ...courseForm,
                                        careerOpportunitiesMr: lines,
                                        careerOpportunities: lines,
                                      });
                                    }}
                                    placeholder="शासकीय व निमशासकीय भरती पात्र&#10;पीडब्ल्यूडी अधिकृत कंत्राटदार&#10;स्वतंत्र व्यवसाय / वर्कशॉप..."
                                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-mono"
                                  />
                                  <p className="text-[10px] text-gray-500 mt-0.5">Tip: Write each career role on a new line.</p>
                                </div>
                              </div>

                              {/* Form Submit Footer */}
                              <div className="flex justify-end gap-2 pt-3 border-t border-[#E6ECF3]">
                                <button
                                  type="button"
                                  onClick={() => setIsCourseModalOpen(false)}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-6 py-2 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-base">save</span>
                                  <span>{courseModalMode === 'add' ? 'Save & Publish Course' : 'Update Course in Database'}</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. GALLERY PHOTOS MANAGER */}
                  {cmsSubTab === 'gallery' && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <h5 className="font-['Manrope'] text-base font-bold text-[#002760]">
                            Manage Workshop & Campus Gallery Photos
                          </h5>
                          <p className="text-xs text-[#172033]/70">
                            Upload photos directly from PC or phone, or paste direct image links to update the campus gallery.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddGalleryImageByUrl}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                            title="Add gallery photo by pasting direct image link or web URL"
                          >
                            <span className="material-symbols-outlined text-base">link</span>
                            <span>+ Add Photo via Link/URL</span>
                          </button>

                          <label className="px-3.5 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] text-xs font-black rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95">
                            <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
                            <span>📁 Upload Photo from PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleUploadNewGalleryImage}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {siteContent.gallery.map((g, idx) => (
                          <div
                            key={g.id}
                            className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-3.5 space-y-2.5 text-xs shadow-2xs hover:shadow-xs transition-shadow"
                          >
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-[#E2E8F0]">
                              <img
                                src={g.src}
                                alt={g.alt || g.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800';
                                }}
                              />
                              {(g.categoryMr || g.category) && (
                                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[#FFD21F] text-[10px] font-black uppercase tracking-wider border border-white/20">
                                  {g.categoryMr || g.category}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-2 pt-1">
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-[#CBD5E1] hover:bg-gray-100 rounded-lg text-[10px] font-bold cursor-pointer transition-all">
                                <span className="material-symbols-outlined text-[13px]">refresh</span>
                                <span>Replace Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleUploadGalleryImage(idx, e)}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(g.id)}
                                className="text-rose-600 hover:text-rose-700 text-[10px] font-bold underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <label className="text-[10px] text-[#172033]/70 font-bold block">
                                  Photo Link / Direct Image URL
                                </label>
                                <input
                                  type="text"
                                  value={g.src || ''}
                                  onChange={(e) => {
                                    const updated = [...siteContent.gallery];
                                    updated[idx] = { ...updated[idx], src: e.target.value };
                                    setSiteContent({ ...siteContent, gallery: updated });
                                  }}
                                  placeholder="https://... or /assets/..."
                                  className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-[11px] font-mono"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-[#172033]/70 font-bold block">Category / Trade Tag</label>
                                <input
                                  type="text"
                                  value={g.categoryMr || g.category || ''}
                                  onChange={(e) => {
                                    const updated = [...siteContent.gallery];
                                    updated[idx] = { ...updated[idx], categoryMr: e.target.value, category: e.target.value };
                                    setSiteContent({ ...siteContent, gallery: updated });
                                  }}
                                  placeholder="उदा: संगणक लॅब / कार्यशाळा"
                                  className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-xs"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-[#172033]/70 font-bold block">Caption / Title (मराठी)</label>
                                <input
                                  type="text"
                                  value={g.titleMr || ''}
                                  onChange={(e) => {
                                    const updated = [...siteContent.gallery];
                                    updated[idx] = { ...updated[idx], titleMr: e.target.value };
                                    setSiteContent({ ...siteContent, gallery: updated });
                                  }}
                                  placeholder="उदा: प्रॅक्टिकल कार्यशाळा लॅब"
                                  className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-xs font-bold"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-[#172033]/70 font-bold block">Caption / Title (English)</label>
                                <input
                                  type="text"
                                  value={g.title || ''}
                                  onChange={(e) => {
                                    const updated = [...siteContent.gallery];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    setSiteContent({ ...siteContent, gallery: updated });
                                  }}
                                  placeholder="e.g. Electrical Machine & Motor Lab"
                                  className="w-full px-2 py-1 bg-white border border-[#CBD5E1] rounded-lg text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. CONTACT & LOCATION EDITOR */}
                  {cmsSubTab === 'contact' && (
                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 space-y-4">
                      <h5 className="font-['Manrope'] text-base font-bold text-[#002760]">
                        Helpline Phone Numbers, Address & Google Map
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Primary Phone Number</label>
                          <input
                            type="text"
                            value={siteContent.contact.phone}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                contact: { ...siteContent.contact, phone: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">WhatsApp Number (No +)</label>
                          <input
                            type="text"
                            value={siteContent.contact.whatsapp}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                contact: { ...siteContent.contact, whatsapp: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Email Address</label>
                          <input
                            type="email"
                            value={siteContent.contact.email}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                contact: { ...siteContent.contact, email: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Working Hours Timing</label>
                          <input
                            type="text"
                            value={siteContent.contact.timing}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                contact: { ...siteContent.contact, timing: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="font-bold text-[#172033]/80 block mb-1">
                            Campus Full Address (English & Marathi)
                          </label>
                          <textarea
                            value={siteContent.contact.address}
                            onChange={(e) =>
                              setSiteContent({
                                ...siteContent,
                                contact: { ...siteContent.contact, address: e.target.value },
                              })
                            }
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Save Bar */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-[#E6ECF3]">
                    <button
                      onClick={handleSaveCMS}
                      className="px-6 py-3 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">save</span>
                      Save All Website Changes
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 1: OVERVIEW */}
              {activeAdminTab === 'overview' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]/60">Total Leads</span>
                        <span className="material-symbols-outlined text-[#1557C0]">person_add</span>
                      </div>
                      <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-2">
                        {leadsList.length}
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                        Active student applicants
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]/60">Certificates Issued</span>
                        <span className="material-symbols-outlined text-emerald-600">verified</span>
                      </div>
                      <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-2">
                        {Object.keys(certsList).length}
                      </div>
                      <span className="text-[11px] font-semibold text-[#1557C0] mt-1">
                        QR verifiable credentials
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]/60">Offered Trades</span>
                        <span className="material-symbols-outlined text-amber-500">school</span>
                      </div>
                      <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-2">
                        10 Trades
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-600 mt-1">
                        Govt Recognized & ISO
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#172033]/60">Alumni Placed</span>
                        <span className="material-symbols-outlined text-purple-600">work</span>
                      </div>
                      <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-2">
                        5,000+
                      </div>
                      <span className="text-[11px] font-semibold text-[#172033]/70 mt-1">
                        Since 1999 in Jalgaon
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Banner */}
                  <div className="bg-gradient-to-r from-[#002760] to-[#1557C0] rounded-2xl p-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h4 className="font-['Manrope'] text-lg font-bold">Quick Administrative Tools</h4>
                      <p className="text-xs text-white/80 mt-0.5">
                        Edit website text & images, issue new certificates, or manage student leads.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setActiveAdminTab('cms')}
                        className="px-3.5 py-2 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">edit_note</span>
                        Edit Website (CMS)
                      </button>
                      <button
                        onClick={() => setActiveAdminTab('certificates')}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer"
                      >
                        + Issue Certificate
                      </button>
                      <button
                        onClick={() => setActiveAdminTab('receipts')}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 cursor-pointer"
                      >
                        Print Fee Receipt
                      </button>
                    </div>
                  </div>

                  {/* Recent Leads Preview */}
                  <div className="border border-[#E6ECF3] rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-['Manrope'] text-sm font-bold text-[#002760]">
                        Recent Admission Leads
                      </h5>
                      <button
                        onClick={() => setActiveAdminTab('leads')}
                        className="text-xs font-bold text-[#1557C0] hover:underline"
                      >
                        View All Leads →
                      </button>
                    </div>
                    <div className="divide-y divide-[#E6ECF3]">
                      {leadsList.slice(0, 3).map((lead) => (
                        <div key={lead.id} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-[#172033]">{lead.name}</span>
                            <span className="text-[#172033]/60 ml-2">• {lead.course}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[#172033]/60">{lead.phone}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                lead.status === 'New'
                                  ? 'bg-amber-100 text-amber-800'
                                  : lead.status === 'Enrolled'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {lead.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LEADS CRM */}
              {activeAdminTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                        Student Leads & Admissions CRM
                      </h4>
                      <p className="text-xs text-[#172033]/70">
                        Inquiries received from website forms, course modals, and student counseling.
                      </p>
                    </div>
                    <button
                      onClick={handleExportLeadsCSV}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-base">download</span>
                      Export CSV
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="Search student name, phone, or trade..."
                      className="flex-1 px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#1557C0]"
                    />
                    <select
                      value={leadFilterCourse}
                      onChange={(e) => setLeadFilterCourse(e.target.value)}
                      className="px-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#172033] focus:outline-none"
                    >
                      <option value="ALL">All Trade Courses</option>
                      {activeCourses.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Leads Table */}
                  <div className="border border-[#E6ECF3] rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#002760] text-white uppercase text-[10px] tracking-wider font-extrabold">
                          <tr>
                            <th className="p-3.5">Student Name</th>
                            <th className="p-3.5">Contact / Phone</th>
                            <th className="p-3.5">Target Trade</th>
                            <th className="p-3.5">Qualification</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5">Date</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6ECF3] bg-white">
                          {filteredLeads.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="p-8 text-center text-[#172033]/60">
                                No student inquiries match your filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredLeads.map((lead) => (
                              <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="p-3.5 font-bold text-[#002760]">
                                  {lead.name}
                                  {lead.email && (
                                    <span className="block text-[10px] text-[#172033]/60 font-normal">
                                      {lead.email}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3.5">
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="font-bold text-[#1557C0] hover:underline block"
                                  >
                                    {lead.phone}
                                  </a>
                                  <a
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`नमस्कार ${lead.name}, अभिनव टेक्निकल इन्स्टिट्यूट जळगाव कडून संपर्क साधत आहोत.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-emerald-600 font-bold hover:underline inline-flex items-center gap-0.5 mt-0.5"
                                  >
                                    WhatsApp Chat →
                                  </a>
                                </td>
                                <td className="p-3.5 font-semibold text-[#172033]">
                                  {lead.course}
                                </td>
                                <td className="p-3.5 text-[#172033]/80">
                                  {lead.qualification || '10th Passed'}
                                </td>
                                <td className="p-3.5">
                                  <select
                                    value={lead.status}
                                    onChange={(e) =>
                                      handleStatusChange(lead.id, e.target.value as any)
                                    }
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold border cursor-pointer ${
                                      lead.status === 'New'
                                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                                        : lead.status === 'Enrolled'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : 'bg-blue-50 text-blue-800 border-blue-300'
                                    }`}
                                  >
                                    <option value="New">New Lead</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Enrolled">Enrolled</option>
                                    <option value="Closed">Closed</option>
                                  </select>
                                </td>
                                <td className="p-3.5 text-[#172033]/60">{lead.date}</td>
                                <td className="p-3.5 text-right">
                                  <button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                                    title="Delete Lead"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CERTIFICATES */}
              {activeAdminTab === 'certificates' && (
                <div className="space-y-6">
                  {/* Issue New Certificate Form */}
                  <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-['Manrope'] text-base font-black text-[#002760]">
                          Issue New Verified Certificate
                        </h4>
                        <p className="text-xs text-[#172033]/70">
                          Auto-generates official ATI registration ID and verifiable QR code.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateCertificate} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Registration Number *
                          </label>
                          <input
                            type="text"
                            value={newCert.regNumber}
                            onChange={(e) => setNewCert({ ...newCert, regNumber: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold uppercase text-[#002760]"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Student Full Name *
                          </label>
                          <input
                            type="text"
                            value={newCert.studentName}
                            onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                            placeholder="e.g. Ramesh Suresh Patil"
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Trade / Course *
                          </label>
                          <select
                            value={newCert.courseName}
                            onChange={(e) => setNewCert({ ...newCert, courseName: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                          >
                            {activeCourses.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Grade Awarded
                          </label>
                          <select
                            value={newCert.grade}
                            onChange={(e) => setNewCert({ ...newCert, grade: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                          >
                            <option value="A+ (Distinction)">A+ (Distinction)</option>
                            <option value="A Grade">A Grade (First Class)</option>
                            <option value="B+ Grade">B+ Grade (Second Class)</option>
                            <option value="Pass">Pass</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Percentage / Marks
                          </label>
                          <input
                            type="text"
                            value={newCert.percentage}
                            onChange={(e) => setNewCert({ ...newCert, percentage: e.target.value })}
                            placeholder="88.5%"
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-[#172033]/80 uppercase block mb-1">
                            Date of Issue
                          </label>
                          <input
                            type="text"
                            value={newCert.issueDate}
                            onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* QR Preview & Submit */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E6ECF3]">
                        {qrCodeDataUrl && (
                          <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#E6ECF3]">
                            <img src={qrCodeDataUrl} alt="QR Preview" className="w-12 h-12" />
                            <span className="text-[10px] text-[#172033]/70">
                              Instant QR code linked to #verify?id={newCert.regNumber}
                            </span>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer ml-auto"
                        >
                          + Issue & Save Certificate
                        </button>
                      </div>

                      {certCreatedSuccess && (
                        <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center">
                          ✓ Certificate for {newCert.studentName} issued and synced with verification server!
                        </div>
                      )}
                    </form>
                  </div>

                  {/* Existing Certificates Repository */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-['Manrope'] text-sm font-bold text-[#002760]">
                        Issued Certificates Repository ({filteredCerts.length})
                      </h4>
                      <input
                        type="text"
                        value={certSearch}
                        onChange={(e) => setCertSearch(e.target.value)}
                        placeholder="Search student or cert ID..."
                        className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs"
                      />
                    </div>

                    <div className="border border-[#E6ECF3] rounded-2xl overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-[#002760] text-white uppercase text-[10px] tracking-wider font-extrabold">
                            <tr>
                              <th className="p-3.5">Registration ID</th>
                              <th className="p-3.5">Student Name</th>
                              <th className="p-3.5">Course / Trade</th>
                              <th className="p-3.5">Grade</th>
                              <th className="p-3.5">QR Code</th>
                              <th className="p-3.5">Issue Date</th>
                              <th className="p-3.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E6ECF3] bg-white">
                            {filteredCerts.map((cert) => (
                              <tr key={cert.regNumber} className="hover:bg-[#F8FAFC]">
                                <td className="p-3.5 font-mono font-bold text-[#002760]">
                                  {cert.regNumber}
                                </td>
                                <td className="p-3.5 font-bold text-[#172033]">{cert.studentName}</td>
                                <td className="p-3.5 text-[#172033]/80">{cert.courseName}</td>
                                <td className="p-3.5">
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                                    {cert.grade}
                                  </span>
                                </td>
                                <td className="p-3.5">
                                  <button
                                    onClick={() => handleOpenQrModal(cert)}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#002760] rounded-lg font-bold text-[11px] border border-[#CBD5E1] transition-colors cursor-pointer"
                                    title="Click to view full QR Sticker"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                                    <span>View QR</span>
                                  </button>
                                </td>
                                <td className="p-3.5 text-[#172033]/60">{cert.issueDate}</td>
                                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() =>
                                      downloadBrandedStudentQrCode(
                                        cert.studentName,
                                        cert.regNumber,
                                        cert.courseName
                                      )
                                    }
                                    className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 inline-flex items-center gap-1 cursor-pointer"
                                    title={`Download ${cert.studentName}'s QR Sticker`}
                                  >
                                    <span className="material-symbols-outlined text-[13px]">download</span>
                                    <span>Download QR</span>
                                  </button>
                                  <button
                                    onClick={() => handlePrintSlip(cert)}
                                    className="px-2.5 py-1 bg-[#1557C0] text-white text-[10px] font-bold rounded-lg hover:bg-[#002760] inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[13px]">print</span>
                                    <span>Print Slip</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCertificate(cert.regNumber)}
                                    className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg hover:bg-rose-100 cursor-pointer"
                                  >
                                    Revoke
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FEE RECEIPT & STUDENT ID CARD */}
              {activeAdminTab === 'receipts' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form Controls */}
                    <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 space-y-4">
                      <h4 className="font-['Manrope'] text-base font-bold text-[#002760]">
                        Receipt & Student ID Details
                      </h4>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="font-bold text-[#172033]/80 block mb-1">Student Full Name</label>
                          <input
                            type="text"
                            value={receiptData.studentName}
                            onChange={(e) => setReceiptData({ ...receiptData, studentName: e.target.value })}
                            placeholder="e.g. Anand Vilas Patil"
                            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Father's Name</label>
                            <input
                              type="text"
                              value={receiptData.fatherName}
                              onChange={(e) => setReceiptData({ ...receiptData, fatherName: e.target.value })}
                              placeholder="Vilas Patil"
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={receiptData.phone}
                              onChange={(e) => setReceiptData({ ...receiptData, phone: e.target.value })}
                              placeholder="+91 94234 88174"
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Trade / Course</label>
                            <select
                              value={receiptData.course}
                              onChange={(e) => setReceiptData({ ...receiptData, course: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            >
                              {activeCourses.map((c) => (
                                <option key={c.id} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Total Fee (₹)</label>
                            <input
                              type="text"
                              value={receiptData.feeAmount}
                              onChange={(e) => setReceiptData({ ...receiptData, feeAmount: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Amount Paid Now (₹)</label>
                            <input
                              type="text"
                              value={receiptData.feePaid}
                              onChange={(e) => setReceiptData({ ...receiptData, feePaid: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold text-emerald-700"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#172033]/80 block mb-1">Payment Mode</label>
                            <select
                              value={receiptData.paymentMode}
                              onChange={(e) => setReceiptData({ ...receiptData, paymentMode: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI / Online (GPay/PhonePe)">UPI / Online (GPay/PhonePe)</option>
                              <option value="Bank Transfer (NEFT/RTGS)">Bank Transfer</option>
                              <option value="Cheque / DD">Cheque / DD</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handlePrintReceipt}
                        className="w-full py-3 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">print</span>
                        Print Official Fee Receipt & ID Card
                      </button>
                    </div>

                    {/* Live Printable Preview */}
                    <div className="border border-[#CBD5E1] rounded-3xl p-5 bg-white shadow-sm space-y-4">
                      <div className="text-center border-b border-[#E6ECF3] pb-3">
                        <InstituteLogo className="w-12 h-12 mx-auto mb-1" />
                        <h4 className="font-['Manrope'] text-sm font-black text-[#002760]">
                          ABHINAV TECHNICAL INSTITUTE
                        </h4>
                        <p className="text-[10px] text-[#172033]/70">
                          Navi Peth, Jalgaon • Phone: +91 9423488174
                        </p>
                        <div className="mt-2 inline-block bg-[#002760] text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                          OFFICIAL ADMISSION FEE RECEIPT
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#172033]/60">Receipt No:</span>
                          <span className="font-mono font-bold">{receiptData.receiptNo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#172033]/60">Student ID:</span>
                          <span className="font-mono font-bold">{receiptData.studentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#172033]/60">Student Name:</span>
                          <span className="font-bold">{receiptData.studentName || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#172033]/60">Course / Trade:</span>
                          <span className="font-bold text-[#1557C0]">{receiptData.course}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#172033]/60">Total Course Fee:</span>
                          <span>₹{receiptData.feeAmount}</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#002760] bg-[#F4F8FD] p-2 rounded-lg">
                          <span>Amount Received:</span>
                          <span className="text-emerald-700 font-black">₹{receiptData.feePaid} ({receiptData.paymentMode})</span>
                        </div>
                        <div className="flex justify-between text-[#172033]/80">
                          <span>Balance Remaining:</span>
                          <span className="font-bold text-amber-800">
                            ₹{Math.max(0, Number(receiptData.feeAmount || 0) - Number(receiptData.feePaid || 0))}
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 flex justify-between items-end border-t border-[#E6ECF3] text-[10px] text-[#172033]/70">
                        <div>
                          <p>Authorized Institute Stamp</p>
                        </div>
                        <div className="text-right">
                          <div className="h-6"></div>
                          <p className="border-t border-[#172033]/30 pt-1 font-bold">Principal / Director Signature</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COURSE ADMISSIONS TOGGLE */}
              {activeAdminTab === 'batches' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                      Course Admission Status & Seat Management
                    </h4>
                    <p className="text-xs text-[#172033]/70">
                      Toggle admissions open/closed in real-time across the website.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCourses.map((course) => {
                      const isOpenNow = courseAdmissions[course.id] !== false;
                      return (
                        <div
                          key={course.id}
                          className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4 flex justify-between items-center"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-[#1557C0]">
                                {course.code}
                              </span>
                              <span className="text-xs text-[#172033]/60">• {course.duration}</span>
                            </div>
                            <h5 className="font-['Manrope'] text-sm font-bold text-[#002760] mt-0.5">
                              {course.name} Trade
                            </h5>
                            <p className="text-[11px] text-[#172033]/70 mt-0.5">
                              Batch Timing: {course.timing} • Capacity: {course.batchCapacity || 30} Seats
                            </p>
                          </div>

                          <button
                            onClick={() => handleToggleAdmission(course.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                              isOpenNow
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                : 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                            }`}
                          >
                            {isOpenNow ? 'Admissions OPEN' : 'CLOSED'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: NOTICE BOARD BROADCASTER */}
              {activeAdminTab === 'notices' && (
                <div className="space-y-6">
                  <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 sm:p-6 shadow-xs max-w-xl">
                    <h4 className="font-['Manrope'] text-base font-black text-[#002760] mb-1">
                      Broadcast New Announcement
                    </h4>
                    <p className="text-xs text-[#172033]/70 mb-4">
                      Appears instantly on top ticker, announcements section, and student portal.
                    </p>

                    <form onSubmit={handleCreateNotice} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">Notice Title (English)</label>
                        <input
                          type="text"
                          value={newNotice.title}
                          onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                          placeholder="e.g. New Electrician Practical Batch Starting Next Week"
                          className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">Notice Title (Marathi)</label>
                        <input
                          type="text"
                          value={newNotice.titleMr}
                          onChange={(e) => setNewNotice({ ...newNotice, titleMr: e.target.value })}
                          placeholder="उदा. नवीन इलेक्ट्रिशियन प्रॅक्टिकल बॅच पुढील आठवड्यात सुरू"
                          className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">Notice Description</label>
                        <textarea
                          value={newNotice.description}
                          onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                          rows={3}
                          placeholder="Detailed instructions for students..."
                          className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-xl"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                      >
                        Broadcast Notice to Website
                      </button>

                      {noticeSuccess && (
                        <div className="p-2.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl text-center">
                          ✓ Announcement broadcasted successfully!
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* TAB: SECURITY & CHANGE PASSWORD */}
              {activeAdminTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-6 sm:p-8 max-w-lg shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#002760] text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">lock_reset</span>
                      </div>
                      <div>
                        <h4 className="font-['Manrope'] text-lg font-black text-[#002760]">
                          Change Admin Password
                        </h4>
                        <p className="text-xs text-[#172033]/70">
                          Set a secure custom passcode for accessing the administration and CMS panel.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">
                          Current Password *
                        </label>
                        <input
                          type="password"
                          value={currentPasswordInput}
                          onChange={(e) => setCurrentPasswordInput(e.target.value)}
                          placeholder="Enter your existing password"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl font-bold tracking-wider"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">
                          New Password * (Min 4 characters)
                        </label>
                        <input
                          type="password"
                          value={newPasswordInput}
                          onChange={(e) => setNewPasswordInput(e.target.value)}
                          placeholder="Enter new strong password"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl font-bold tracking-wider"
                          required
                        />
                      </div>

                      <div>
                        <label className="font-bold text-[#172033]/80 block mb-1">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="Re-type new password"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl font-bold tracking-wider"
                          required
                        />
                      </div>

                      {passwordChangeError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                          ⚠️ {passwordChangeError}
                        </div>
                      )}

                      {passwordChangeSuccess && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
                          {passwordChangeSuccess}
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                      >
                        <span className="material-symbols-outlined text-base">save</span>
                        Save & Update Password
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* QR Code Sticker Modal */}
              {selectedQrStudent && selectedQrCodeUrl && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#001738]/80 backdrop-blur-xs animate-in fade-in duration-150">
                  <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#CBD5E1] text-center space-y-4">
                    <div className="flex justify-between items-center border-b border-[#E6ECF3] pb-3">
                      <h4 className="font-['Manrope'] text-sm font-bold text-[#002760]">
                        Student QR Verification Sticker
                      </h4>
                      <button
                        onClick={() => setSelectedQrStudent(null)}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>

                    <div className="bg-[#F8FAFC] border-2 border-[#002760] rounded-2xl p-4 space-y-3">
                      <div className="text-[11px] font-extrabold text-[#002760] uppercase">
                        Abhinav Technical Institute
                      </div>
                      <img
                        src={selectedQrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto bg-white p-2 rounded-xl shadow-xs border border-[#CBD5E1]"
                      />
                      <div className="space-y-0.5">
                        <div className="font-['Manrope'] text-sm font-black text-[#002760] uppercase">
                          {selectedQrStudent.studentName}
                        </div>
                        <div className="font-mono text-xs font-bold text-[#0284C7]">
                          {selectedQrStudent.regNumber}
                        </div>
                        <div className="text-[11px] font-semibold text-[#475569]">
                          {selectedQrStudent.courseName}
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 py-1 rounded-lg">
                        ✓ Scan to verify online
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          downloadBrandedStudentQrCode(
                            selectedQrStudent.studentName,
                            selectedQrStudent.regNumber,
                            selectedQrStudent.courseName
                          )
                        }
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">download</span>
                        Download PNG
                      </button>
                      <button
                        onClick={() => handlePrintSlip(selectedQrStudent)}
                        className="flex-1 py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">print</span>
                        Print Slip
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
