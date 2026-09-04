import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UpcomingBatches } from './components/UpcomingBatches';
import { LatestAnnouncements } from './components/LatestAnnouncements';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CommunityReviews } from './components/CommunityReviews';
import { WhatWeProvide } from './components/WhatWeProvide';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import { StudentSectionModal } from './components/StudentSectionModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { AboutUsPage } from './components/AboutUsPage';
import { AccreditationLogosBar } from './components/AccreditationLogosBar';
import { AwardsSection } from './components/AwardsSection';
import { PlacementsPage } from './components/PlacementsPage';
import { GovernmentGrPage } from './components/GovernmentGrPage';
import { CertificateVerifyPage } from './components/CertificateVerifyPage';
import { CertificateVerificationWidget } from './components/CertificateVerificationWidget';
import { NotFoundPage } from './components/NotFoundPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';

import {
  COURSES,
  ANNOUNCEMENTS,
  REVIEWS,
  FAQS,
  MOCK_CERTIFICATES,
} from './data/instituteData';
import type { Course, Announcement, Review, StudentCertificate, Language } from './types';
import {
  fetchCertificates,
  saveCertificate,
  fetchLeads,
  saveLead,
  updateLeadStatus,
  fetchReviews,
  saveReview,
  type Lead,
} from './services/api';
import {
  fetchSiteContent,
  INITIAL_SITE_CONTENT,
  type SiteContent,
} from './services/cms';

export default function App() {
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_SITE_CONTENT);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ati_language') as Language;
    return saved === 'mr' || saved === 'hi' || saved === 'en' ? saved : 'mr';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ati_language', lang);
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'placements' | 'gr' | 'verify' | '404'>('home');
  const [verifyInitialId, setVerifyInitialId] = useState('');

  // Interactive modal states
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedCourseForEnquiry, setSelectedCourseForEnquiry] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);

  // Student Section & Admin Panel Modal States
  const [isStudentSectionOpen, setIsStudentSectionOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Dynamic Certificate State shared with Admin Panel & Verification Widget
  const [certificates, setCertificates] = useState<Record<string, StudentCertificate>>(MOCK_CERTIFICATES);

  // Dynamic Admission Leads State for Admin Panel
  const [enquiriesList, setEnquiriesList] = useState<Lead[]>([]);

  // Current URL Hash
  const [currentHash, setCurrentHash] = useState<string>(
    typeof window !== 'undefined' ? window.location.hash : ''
  );

  // Initial load from backend API / persistent storage
  useEffect(() => {
    fetchCertificates().then((certs) => setCertificates(certs));
    fetchLeads().then((leads) => setEnquiriesList(leads));
    fetchSiteContent().then((content) => setSiteContent(content));
    fetchReviews().then((revs) => {
      if (revs && revs.length > 0) setReviewsList(revs);
    });

    const handleCmsUpdate = (e: any) => {
      if (e.detail) {
        setSiteContent(e.detail);
      }
    };
    window.addEventListener('ati_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('ati_cms_updated', handleCmsUpdate);
  }, []);

  // Unified Route Handler
  const handleRoute = (rawHash?: string) => {
    const hash = typeof rawHash === 'string' ? rawHash : window.location.hash || '';
    setCurrentHash(hash);
    const normalized = hash.toLowerCase();

    if (!normalized || normalized === '#' || normalized === '#home' || normalized === '#hero') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '#about' || normalized === '#about-us') {
      setCurrentPage('about');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '#placements' || normalized === '#placement' || normalized === '#alumni') {
      setCurrentPage('placements');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '#gr' || normalized === '#govt-gr' || normalized === '#government-gr') {
      setCurrentPage('gr');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized.startsWith('#verify')) {
      let certId = '';
      if (hash.includes('id=')) {
        certId = hash.split('id=')[1]?.split('&')[0] || '';
      } else if (hash.startsWith('#verify/')) {
        certId = hash.replace('#verify/', '');
      }
      setVerifyInitialId(certId);
      setCurrentPage('verify');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (normalized === '#admin') {
      setIsAdminPanelOpen(true);
    } else if (normalized.startsWith('#super-admin') || normalized.startsWith('#superadmin')) {
      // Handled in render
    } else if (
      normalized === '#batches' ||
      normalized === '#courses' ||
      normalized === '#why-us' ||
      normalized === '#awards' ||
      normalized === '#reviews' ||
      normalized === '#gallery' ||
      normalized === '#location' ||
      normalized === '#contact' ||
      normalized === '#faq'
    ) {
      setCurrentPage('home');
      setTimeout(() => {
        const targetId = normalized.replace('#', '');
        const el = document.getElementById(targetId === 'courses' ? 'batches' : targetId === 'contact' ? 'location' : targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      // Unknown route -> render 404 Page
      setCurrentPage('404');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Central navigation helper that updates hash and triggers routing reliably
  const navigateTo = (route: string) => {
    const targetHash = route.startsWith('#') ? route : `#${route}`;
    if (window.location.hash === targetHash) {
      handleRoute(targetHash);
    } else {
      window.location.hash = targetHash;
    }
  };

  // Hash route listener with 404 fallback
  useEffect(() => {
    const onHashChange = () => {
      handleRoute();
    };

    handleRoute();
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);

  // Dynamic SEO Page Titles & Meta Descriptions Updater
  useEffect(() => {
    const normalized = (currentHash || '').toLowerCase();
    let title = 'Abhinav Technical Institute | Industrial Training & Skill Development, Jalgaon';
    let desc = 'Abhinav Technical Institute (ATI Jalgaon) - Govt. Recognized & ISO 9001:2015 Certified Vocational Training Centre. 100% Practical Industrial Training.';

    if (normalized.startsWith('#super-admin') || normalized.startsWith('#superadmin')) {
      title = 'Super Admin Console | Abhinav Technical Institute';
      desc = 'Administrative management and database control console for Abhinav Technical Institute.';
    } else if (isAdminPanelOpen || normalized === '#admin') {
      title = 'Admin Panel & Leads CRM | Abhinav Technical Institute';
      desc = 'Institute administration portal for certificates, admissions, student leads, and notifications.';
    } else if (currentPage === 'about') {
      title = language === 'mr'
        ? 'आमच्याबद्दल (About Us) | अभिनव टेक्निकल इन्स्टिट्यूट जळगाव'
        : 'About Us & Leadership | Abhinav Technical Institute Jalgaon';
      desc = 'Learn about Abhinav Technical Institute Jalgaon, established in 1999 by Principal Er. P.R. Patil. 100% practical lab training and government accreditations.';
    } else if (currentPage === 'placements') {
      title = language === 'mr'
        ? 'प्लेसमेंट व यशोगाथा (Placements) | अभिनव टेक्निकल इन्स्टिट्यूट'
        : 'Placements & Successful Alumni Stories | Abhinav Technical Institute';
      desc = 'Explore placement records, PWD contractor registration licensing, and self-employment successes of ATI alumni.';
    } else if (currentPage === 'gr') {
      title = language === 'mr'
        ? 'शासन निर्णय व मान्यता (Govt. GRs) | अभिनव टेक्निकल इन्स्टिट्यूट'
        : 'Government Resolutions & Affiliations (GRs) | Abhinav Technical Institute';
      desc = 'Verified Maharashtra Government Resolutions for 12th standard equivalency, DVET affiliations, and job eligibility.';
    } else if (currentPage === 'verify') {
      title = language === 'mr'
        ? 'प्रमाणपत्र पडताळणी (Verify Certificate) | अभिनव टेक्निकल इन्स्टिट्यूट'
        : 'Online Certificate Verification Portal | Abhinav Technical Institute';
      desc = 'Verify official student vocational course completion certificates in real-time from institutional registry.';
    } else if (currentPage === '404') {
      title = language === 'mr'
        ? '४०४ - पृष्ठ सापडले नाही (Page Not Found) | अभिनव टेक्निकल इन्स्टिट्यूट'
        : '404 - Page Not Found | Abhinav Technical Institute';
      desc = 'The page you are looking for does not exist or has been moved.';
    } else {
      title = language === 'mr'
        ? 'अभिनव टेक्निकल इन्स्टिट्यूट जळगाव | व्यावसायिक तांत्रिक प्रशिक्षण केंद्र'
        : 'Abhinav Technical Institute | Practical Technical Education & Skill Development, Jalgaon';
      desc = 'Abhinav Technical Institute Jalgaon - Practical technical training in Electrician, Diesel Mechanic, Construction Supervisor, DMLT, and IT trades.';
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
  }, [currentPage, currentHash, isAdminPanelOpen, language]);

  const handleOpenEnquiry = (courseName?: string) => {
    setSelectedCourseForEnquiry(courseName || '');
    setIsEnquiryOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    navigateTo(sectionId);
  };

  const handleAddReview = async (newReview: Partial<Review>) => {
    const created: Review = {
      id: `rev-${Date.now()}`,
      name: newReview.name || 'Anonymous Student',
      course: newReview.course || 'Vocational Trade',
      rating: newReview.rating || 5,
      comment: newReview.comment || 'Great practical learning experience at ATI Jalgaon.',
      date: 'Just now',
      category: (newReview.category as any) || 'Practical Training',
    };
    const saved = await saveReview(created);
    setReviewsList((prev) => [saved, ...prev.filter((r) => r.id !== saved.id)]);
  };

  const handleAddEnquiry = async (newEnquiry: any) => {
    const saved = await saveLead(newEnquiry);
    setEnquiriesList((prev) => [saved, ...prev.filter((l) => l.id !== saved.id)]);
  };

  const handleAddCertificate = async (newCert: StudentCertificate) => {
    const saved = await saveCertificate(newCert);
    setCertificates((prev) => ({
      ...prev,
      [saved.regNumber]: saved,
    }));
  };

  const handleUpdateLeadStatusProp = async (
    id: string,
    status: 'New' | 'Contacted' | 'Enrolled' | 'Closed'
  ) => {
    await updateLeadStatus(id, status);
    setEnquiriesList((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const normalizedHash = currentHash.toLowerCase();

  // 1. Secret Super Admin Console (URL: #super-admin, password: 9822725265)
  if (normalizedHash.startsWith('#super-admin') || normalizedHash.startsWith('#superadmin')) {
    return (
      <SuperAdminDashboard
        onBackToHome={() => {
          navigateTo('home');
        }}
      />
    );
  }

  return (
    <div className="font-['Work_Sans'] text-[#172033] antialiased overflow-x-hidden bg-white min-h-screen selection:bg-[#FFD21F] selection:text-[#002760]">
      {/* Header */}
      <Header
        language={language}
        activeTab={currentPage}
        onToggleLanguage={handleLanguageChange}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onNavigateSection={(sec) => {
          navigateTo(sec === 'hero' ? 'home' : sec);
        }}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenAboutUs={() => {
          navigateTo('about');
        }}
        onOpenPlacements={() => {
          navigateTo('placements');
        }}
        onOpenGovernmentGr={() => {
          navigateTo('gr');
        }}
        onOpenCertificateVerify={() => {
          setVerifyInitialId('');
          navigateTo('verify');
        }}
      />

      {/* Conditional Full-Screen Page vs Home Dashboard */}
      {currentPage === 'about' ? (
        <AboutUsPage
          language={language}
          onNavigateHome={() => {
            navigateTo('home');
          }}
          onExploreCourses={() => {
            navigateTo('batches');
          }}
          onOpenEnquiry={() => handleOpenEnquiry()}
          onOpenStudentSection={() => setIsStudentSectionOpen(true)}
        />
      ) : currentPage === 'placements' ? (
        <PlacementsPage
          language={language}
          onNavigateHome={() => {
            navigateTo('home');
          }}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />
      ) : currentPage === 'gr' ? (
        <GovernmentGrPage
          language={language}
          onNavigateHome={() => {
            navigateTo('home');
          }}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />
      ) : currentPage === 'verify' ? (
        <CertificateVerifyPage
          language={language}
          initialId={verifyInitialId}
          onNavigateHome={() => {
            navigateTo('home');
          }}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />
      ) : currentPage === '404' ? (
        <NotFoundPage
          language={language}
          onNavigateHome={() => {
            navigateTo('home');
          }}
          onExploreCourses={() => {
            navigateTo('batches');
          }}
          onOpenCertificateVerify={() => {
            setVerifyInitialId('');
            navigateTo('verify');
          }}
          onOpenGovernmentGr={() => {
            navigateTo('gr');
          }}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />
      ) : (
        /* Main Home Content Sections */
        <main className="relative bg-gradient-to-b from-[#F4F8FD] to-white overflow-x-hidden pb-12">
          {/* 1. Hero Section */}
          <Hero
            language={language}
            carouselImages={siteContent.hero.carouselImages}
            onExploreCourses={() => navigateTo('batches')}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />

          {/* 2. Upcoming Batches (10 Trades) */}
          <UpcomingBatches
            courses={siteContent.courses && siteContent.courses.length > 0 ? siteContent.courses : COURSES}
            language={language}
            onSelectCourse={(course) => setSelectedCourse(course)}
            onOpenEnquiryWithCourse={(name) => handleOpenEnquiry(name)}
          />

          {/* 3. Latest Announcements */}
          <LatestAnnouncements
            announcements={ANNOUNCEMENTS}
            language={language}
            onSelectAnnouncement={(ann) => setSelectedAnnouncement(ann)}
          />

          {/* 4. Why Abhinav Technical Institute Stands Out (About Us) */}
          <WhyChooseUs language={language} />

          {/* Official Accreditations Carousel Bar */}
          <AccreditationLogosBar language={language} />

          {/* 5. State Awards & Honors Section (Lokmat Lokratna 2026 & Video Reel) */}
          <AwardsSection
            language={language}
            awardsData={siteContent.awards}
            onOpenEnquiry={() => handleOpenEnquiry()}
          />

          {/* 6. What Our Community Says & Student Reviews */}
          <CommunityReviews
            reviews={reviewsList}
            language={language}
            onOpenWriteReview={() => setIsWriteReviewOpen(true)}
            onOpenAllReviews={() => setIsAllReviewsOpen(true)}
          />

          {/* 6. What We Provide */}
          <WhatWeProvide language={language} />

          {/* 7. Our Centre Gallery */}
          <GallerySection language={language} images={siteContent.gallery} />

          {/* 8. Real-Time Certificate Verification Widget */}
          <div className="max-w-[1200px] mx-auto px-4 md:px-6 mb-16">
            <CertificateVerificationWidget language={language} certificates={certificates} />
          </div>

          {/* 9. Visit Our Centre / Location */}
          <LocationSection
            language={language}
            onOpenContactModal={() => handleOpenEnquiry()}
          />

          {/* 10. FAQ Section */}
          <FaqSection faqs={FAQS} language={language} />
        </main>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        id="floating-whatsapp-btn"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-[#20bd5a] transition-all duration-200"
        href={`https://wa.me/919423488174?text=${encodeURIComponent('नमस्कार! मला अभिनव टेक्निकल इन्स्टिट्यूट जळगाव मधील प्रवेश, बॅचेस व अभ्यासक्रमाबद्दल माहिती हवी आहे.')}`}
        target="_blank"
        rel="noreferrer"
        title="Direct WhatsApp Support"
      >
        <svg
          className="w-7 h-7 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.781-.878-2.057-.978-.276-.101-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.911 1.23 3.112.15.201 2.123 3.242 5.143 4.545.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.04 2C6.495 2 2 6.495 2 12.04c0 1.77.462 3.5 1.341 5.024L2 22l5.098-1.338a10.005 10.005 0 0 0 4.942 1.304c5.545 0 10.04-4.495 10.04-10.04C22.08 6.495 17.585 2 12.04 2zm0 18.258a8.214 8.214 0 0 1-4.19-1.144l-.3-.178-3.114.817.831-3.036-.195-.311a8.204 8.204 0 0 1-1.258-4.366c0-4.542 3.698-8.24 8.24-8.24 4.542 0 8.24 3.698 8.24 8.24 0 4.542-3.698 8.24-8.24 8.24z"/>
        </svg>
      </a>

      {/* Footer */}
      <Footer
        language={language}
        onNavigateSection={(sec) => {
          navigateTo(sec === 'hero' ? 'home' : sec);
        }}
        onOpenEnquiryWithCourse={(name) => handleOpenEnquiry(name)}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenAboutUs={() => {
          navigateTo('about');
        }}
        onOpenPlacements={() => {
          navigateTo('placements');
        }}
        onOpenGovernmentGr={() => {
          navigateTo('gr');
        }}
        onOpenCertificateVerify={() => {
          setVerifyInitialId('');
          navigateTo('verify');
        }}
      />

      {/* Standard Interactive Modals */}
      <Modals
        isEnquiryOpen={isEnquiryOpen}
        onCloseEnquiry={() => setIsEnquiryOpen(false)}
        selectedCourseForEnquiry={selectedCourseForEnquiry}
        selectedCourse={selectedCourse}
        onCloseCourseModal={() => setSelectedCourse(null)}
        onApplyForCourse={(name) => handleOpenEnquiry(name)}
        selectedAnnouncement={selectedAnnouncement}
        onCloseAnnouncementModal={() => setSelectedAnnouncement(null)}
        isWriteReviewOpen={isWriteReviewOpen}
        onCloseWriteReview={() => setIsWriteReviewOpen(false)}
        onSubmitReview={handleAddReview}
        isAllReviewsOpen={isAllReviewsOpen}
        onCloseAllReviews={() => setIsAllReviewsOpen(false)}
        allReviews={reviewsList}
        language={language}
        onAddEnquiry={handleAddEnquiry}
      />



      {/* Admin Panel Modal (With CMS Editor, Leads CRM, Cert Authority, Fee Receipts, Admission Toggle) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        courses={siteContent.courses || COURSES}
        onClose={() => {
          setIsAdminPanelOpen(false);
          if (window.location.hash === '#admin') {
            window.location.hash = '';
            setCurrentHash('');
          }
        }}
        language={language}
        enquiries={enquiriesList}
        certificates={certificates}
        onAddCertificate={handleAddCertificate}
        onUpdateEnquiryStatus={handleUpdateLeadStatusProp}
      />
    </div>
  );
}
