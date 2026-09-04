import React, { useState, useEffect, useRef } from 'react';
import { InstituteLogo } from './InstituteLogo';
import { Language, LANGUAGES, getTranslation } from '../translations/translations';

interface HeaderProps {
  language: Language;
  activeTab?: 'home' | 'about' | 'placements' | 'gr' | 'verify';
  onToggleLanguage: (lang: Language) => void;
  onOpenEnquiry: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenStudentSection?: () => void;
  onOpenAdminPanel: () => void;
  onOpenAboutUs: () => void;
  onOpenPlacements: () => void;
  onOpenGovernmentGr: () => void;
  onOpenCertificateVerify: () => void;
}

const TOP_ANNOUNCEMENTS = [
  {
    id: 1,
    tagKey: 'ticker.admissionsOpenTag',
    textKey: 'ticker.admissionsOpenText',
    actionKey: 'ticker.admissionsOpenAction',
    icon: 'campaign',
    badgeColor: 'bg-[#FFD21F] text-[#002760]',
  },
  {
    id: 2,
    tagKey: 'ticker.newBatchTag',
    textKey: 'ticker.newBatchText',
    actionKey: 'ticker.newBatchAction',
    icon: 'bolt',
    badgeColor: 'bg-[#22C55E] text-white',
  },
  {
    id: 3,
    tagKey: 'ticker.noticeTag',
    textKey: 'ticker.noticeText',
    actionKey: 'ticker.noticeAction',
    icon: 'verified',
    badgeColor: 'bg-[#38BDF8] text-[#002760]',
  },
];

export const Header: React.FC<HeaderProps> = ({
  language,
  activeTab = 'home',
  onToggleLanguage,
  onOpenEnquiry,
  onNavigateSection,
  onOpenStudentSection,
  onOpenAdminPanel,
  onOpenAboutUs,
  onOpenPlacements,
  onOpenGovernmentGr,
  onOpenCertificateVerify,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isAnnouncementPaused, setIsAnnouncementPaused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsLangDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatic scrolling ticker timer
  useEffect(() => {
    if (isAnnouncementPaused) return;

    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % TOP_ANNOUNCEMENTS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAnnouncementPaused]);

  const handleNextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev + 1) % TOP_ANNOUNCEMENTS.length);
  };

  const handlePrevAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => (prev - 1 + TOP_ANNOUNCEMENTS.length) % TOP_ANNOUNCEMENTS.length);
  };

  const handleNavClick = (sectionId: string) => {
    setIsMenuOpen(false);
    onNavigateSection(sectionId);
  };

  const handleStudentSectionClick = () => {
    setIsMenuOpen(false);
    onOpenStudentSection();
  };

  const handleAdminPanelClick = () => {
    setIsMenuOpen(false);
    onOpenAdminPanel();
  };

  const currentItem = TOP_ANNOUNCEMENTS[currentAnnouncementIndex];

  return (
    <>
      {/* 1. Top Announcement Bar with Moving Marquee of All 3 Announcements */}
      <div
        className="bg-[#002760] text-white w-full py-2 px-2 sm:px-4 z-50 relative border-b border-white/10 shadow-xs overflow-hidden"
        id="top-announcement-bar"
      >
        <div className="max-w-[1400px] mx-auto flex items-center gap-3 text-xs sm:text-sm">
          {/* Fixed Left Live Badge */}
          <div className="flex items-center gap-2 shrink-0 bg-[#001738] px-2.5 py-1 rounded-full border border-white/15 shadow-2xs z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD21F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD21F]"></span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFD21F]">
              {language === 'mr' ? 'ताज्या सूचना' : language === 'hi' ? 'ताज़ा सूचना' : 'LATEST'}
            </span>
          </div>

          {/* Continuous Moving Track */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-marquee flex items-center gap-8 cursor-pointer">
              {[...TOP_ANNOUNCEMENTS, ...TOP_ANNOUNCEMENTS].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.badgeColor}`}
                  >
                    {t(item.tagKey)}
                  </span>
                  <span className="font-['Work_Sans'] text-xs sm:text-sm text-white/95 font-medium">
                    {t(item.textKey)}
                  </span>
                  <button
                    onClick={() => {
                      if (item.id === 3) {
                        onOpenCertificateVerify();
                      } else {
                        onOpenEnquiry();
                      }
                    }}
                    className="text-[#FFD21F] hover:text-white underline font-bold transition-colors cursor-pointer text-xs shrink-0"
                  >
                    {t(item.actionKey)} →
                  </button>
                  <span className="text-white/30 text-xs px-2">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Header */}
      <header
        id="main-header"
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 bg-white border-b border-[#E6ECF3] w-full ${
          isScrolled ? 'shadow-md py-2' : 'shadow-xs py-2 xl:py-3'
        }`}
      >
        <div className="flex justify-between items-center w-full px-2.5 sm:px-4 lg:px-6 xl:px-8 max-w-[1440px] mx-auto gap-2 sm:gap-3 min-w-0">
          {/* Brand */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0 flex-1 lg:flex-initial"
            id="header-brand"
          >
            <InstituteLogo className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 xl:w-12 xl:h-12 group-hover:scale-105 transition-transform drop-shadow-xs shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-['Manrope','Yantramanav',sans-serif] text-xs sm:text-base xl:text-lg font-black text-[#002760] tracking-tight leading-snug truncate sm:whitespace-nowrap">
                {language === 'en'
                  ? 'Abhinav Technical Institute'
                  : language === 'hi'
                  ? 'अभिनव टेक्निकल इंस्टीट्यूट'
                  : 'अभिनव टेक्निकल इन्स्टिट्यूट'}
              </span>
              <span className="text-[9px] sm:text-[11px] font-bold text-[#1557C0] tracking-wide items-center gap-1 hidden sm:flex">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#F57C00]"></span>
                <span>{t('nav.tagline')}</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-3 text-xs xl:text-sm font-bold text-[#172033]/80 shrink-0">
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('hero')}
              className={`transition-colors cursor-pointer py-1 px-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'home'
                  ? 'text-[#1557C0] font-black'
                  : 'hover:text-[#1557C0]'
              }`}
            >
              {t('nav.home')}
            </button>

            {/* 2. About Us */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenAboutUs();
              }}
              className={`transition-colors cursor-pointer py-1 px-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'about'
                  ? 'text-[#1557C0] font-black'
                  : 'hover:text-[#1557C0]'
              }`}
            >
              {t('nav.about')}
            </button>

            {/* 3. Courses */}
            <button
              onClick={() => handleNavClick('batches')}
              className="hover:text-[#1557C0] transition-colors cursor-pointer py-1 px-1.5 rounded-md whitespace-nowrap"
            >
              {t('nav.courses')}
            </button>

            {/* 4. Placements */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenPlacements();
              }}
              className={`transition-colors cursor-pointer py-1 px-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'placements'
                  ? 'text-[#1557C0] font-black'
                  : 'hover:text-[#1557C0]'
              }`}
            >
              {t('nav.placements')}
            </button>

            {/* 5. Govt. Orders & GR */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenGovernmentGr();
              }}
              className={`transition-colors cursor-pointer py-1 px-1.5 rounded-md whitespace-nowrap ${
                activeTab === 'gr'
                  ? 'text-[#1557C0] font-black'
                  : 'hover:text-[#1557C0]'
              }`}
            >
              {t('nav.gr')}
            </button>

            {/* 6. Verify Certificate */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenCertificateVerify();
              }}
              className={`transition-all cursor-pointer py-1 px-2 xl:px-2.5 rounded-lg flex items-center gap-1 font-bold text-xs whitespace-nowrap ${
                activeTab === 'verify'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">verified_user</span>
              <span>{t('nav.certVerification')}</span>
            </button>
          </nav>

          {/* Actions: Phone, WhatsApp, Language & Quick Enquiry */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-3 shrink-0">
            {/* Call / WhatsApp Quick Contact Pill (Large Desktop >= 1340px) */}
            <div className="hidden 2xl:flex items-center bg-[#F4F8FD] hover:bg-[#EBF3FC] border border-[#1557C0]/25 rounded-xl px-2.5 py-1.5 transition-all shadow-2xs">
              <a
                href="tel:+919423488174"
                className="flex items-center gap-1.5 font-['Manrope'] font-bold text-xs text-[#002760] hover:text-[#1557C0] whitespace-nowrap transition-colors mr-2"
                title="Call Institute (+91 94234 88174)"
              >
                <span className="material-symbols-outlined text-[17px] text-[#1557C0]">call</span>
                <span>+91 94234 88174</span>
              </a>
              <div className="h-4 w-px bg-gray-300 mr-2"></div>
              <a
                className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] transition-all hover:scale-110 shadow-xs"
                href="https://wa.me/919423488174"
                target="_blank"
                rel="noreferrer"
                title="Chat on WhatsApp"
              >
                <svg
                  className="w-3.5 h-3.5 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.301-.15-1.781-.878-2.057-.978-.276-.101-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.911 1.23 3.112.15.201 2.123 3.242 5.143 4.545.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.04 2C6.495 2 2 6.495 2 12.04c0 1.77.462 3.5 1.341 5.024L2 22l5.098-1.338a10.005 10.005 0 0 0 4.942 1.304c5.545 0 10.04-4.495 10.04-10.04C22.08 6.495 17.585 2 12.04 2zm0 18.258a8.214 8.214 0 0 1-4.19-1.144l-.3-.178-3.114.817.831-3.036-.195-.311a8.204 8.204 0 0 1-1.258-4.366c0-4.542 3.698-8.24 8.24-8.24 4.542 0 8.24 3.698 8.24 8.24 0 4.542-3.698 8.24-8.24 8.24z"/>
                </svg>
              </a>
            </div>

            {/* Language Switcher Dropdown (मराठी | हिंदी | English) */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1 h-8 px-2 sm:px-2.5 rounded-xl border border-[#1557C0]/30 bg-[#F4F8FD] hover:bg-[#1557C0] hover:text-white text-[#002760] font-bold text-xs transition-all cursor-pointer shadow-2xs whitespace-nowrap"
                title={t('nav.selectLanguage')}
              >
                <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#1557C0] group-hover:text-white">translate</span>
                <span className="text-[11px] sm:text-xs">{LANGUAGES.find((l) => l.id === language)?.nativeName}</span>
                <span className="material-symbols-outlined text-[13px] sm:text-[14px]">expand_more</span>
              </button>

              {/* Language Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-[#E6ECF3] py-1.5 z-50 animate-fadeIn">
                  {LANGUAGES.map((langOpt) => (
                    <button
                      key={langOpt.id}
                      onClick={() => {
                        onToggleLanguage(langOpt.id);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                        language === langOpt.id
                          ? 'bg-[#1557C0] text-white font-bold'
                          : 'text-[#172033] hover:bg-[#F4F8FD] hover:text-[#1557C0]'
                      }`}
                    >
                      <span>{langOpt.nativeName}</span>
                      {language === langOpt.id && (
                        <span className="material-symbols-outlined text-sm">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Enquiry CTA */}
            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 xl:px-4 py-1.5 bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-['Manrope'] font-black text-xs rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px]">edit_document</span>
              <span className="hidden sm:inline">{t('nav.quickEnquiry')}</span>
              <span className="sm:hidden">{language === 'mr' ? 'अर्ज करा' : 'Apply'}</span>
            </button>

            {/* Mobile Hamburger 3-Line Menu Button */}
            <button
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#002760] hover:bg-[#1557C0] active:scale-95 text-white transition-all lg:hidden rounded-xl shadow-md border border-[#FFD21F]/40 cursor-pointer shrink-0"
              id="menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close navigation sidebar' : 'Open navigation sidebar'}
              title="Menu / मेनू"
            >
              {isMenuOpen ? (
                <svg className="w-5 h-5 text-[#FFD21F]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer (Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col bg-white shadow-2xl w-80 max-w-[85vw] h-full rounded-r-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="mobile-nav"
      >
        <div className="p-4 flex justify-between items-center border-b border-[#E6ECF3] bg-[#F4F8FD]">
          <div className="flex items-center gap-2.5">
            <InstituteLogo className="w-9 h-9" />
            <span className="font-['Manrope','Yantramanav',sans-serif] text-sm font-black text-[#002760] leading-tight">
              {language === 'en' ? 'Abhinav Technical Institute' : language === 'hi' ? 'अभिनव टेक्निकल इंस्टीट्यूट' : 'अभिनव टेक्निकल इन्स्टिट्यूट'}
            </span>
          </div>
          <button
            className="text-[#172033]/60 hover:text-[#002760] transition-colors p-1 cursor-pointer"
            id="close-menu-btn"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Language Switcher Pills in Mobile Drawer */}
          <div className="mb-4 pb-3 border-b border-[#E6ECF3]">
            <span className="text-xs font-bold text-gray-500 uppercase block mb-2 px-1">{t('nav.selectLanguage')}</span>
            <div className="grid grid-cols-3 gap-1.5 bg-[#F4F8FD] p-1 rounded-xl border border-[#E2E8F0]">
              {LANGUAGES.map((langOpt) => (
                <button
                  key={langOpt.id}
                  onClick={() => {
                    onToggleLanguage(langOpt.id);
                  }}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    language === langOpt.id
                      ? 'bg-[#1557C0] text-white shadow-xs'
                      : 'text-[#002760] hover:bg-white'
                  }`}
                >
                  {langOpt.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* 1. Home */}
          <button
            onClick={() => handleNavClick('hero')}
            className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 font-semibold text-sm text-left transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'bg-[#F4F8FD] text-[#1557C0]'
                : 'text-[#172033]/80 hover:bg-[#F4F8FD] hover:text-[#1557C0]'
            }`}
          >
            <span className="material-symbols-outlined text-xl text-[#1557C0]">home</span>
            {t('nav.home')}
          </button>

          {/* 2. About Us */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenAboutUs();
            }}
            className={`w-full flex items-center gap-3.5 rounded-xl px-4 py-3 font-semibold text-sm text-left transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#F4F8FD] text-[#1557C0]'
                : 'text-[#172033]/80 hover:bg-[#F4F8FD] hover:text-[#1557C0]'
            }`}
          >
            <span className="material-symbols-outlined text-xl text-[#1557C0]">info</span>
            {t('nav.about')}
          </button>

          {/* 3. Courses */}
          <button
            onClick={() => handleNavClick('batches')}
            className="w-full flex items-center gap-3.5 text-[#172033]/80 hover:bg-[#F4F8FD] hover:text-[#1557C0] rounded-xl px-4 py-3 font-semibold text-sm text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl text-[#1557C0]">auto_stories</span>
            {t('nav.courses')}
          </button>

          {/* 4. Placements */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenPlacements();
            }}
            className="w-full flex items-center gap-3.5 text-[#172033]/80 hover:bg-[#F4F8FD] hover:text-[#1557C0] rounded-xl px-4 py-3 font-semibold text-sm text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl text-[#1557C0]">work</span>
            {t('nav.placements')}
          </button>

          {/* 5. Govt. Orders & GR */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenGovernmentGr();
            }}
            className="w-full flex items-center gap-3.5 text-[#172033]/80 hover:bg-[#F4F8FD] hover:text-[#1557C0] rounded-xl px-4 py-3 font-semibold text-sm text-left transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl text-[#1557C0]">verified</span>
            {t('nav.gr')}
          </button>

          {/* 6. Verify Certificate */}
          <button
            onClick={() => {
              setIsMenuOpen(false);
              onOpenCertificateVerify();
            }}
            className="w-full flex items-center gap-3.5 text-[#059669] bg-emerald-50 hover:bg-emerald-100 rounded-xl px-4 py-3 font-bold text-sm text-left transition-colors cursor-pointer border border-emerald-200"
          >
            <span className="material-symbols-outlined text-xl text-[#059669]">verified_user</span>
            {t('nav.certVerification')}
          </button>





          <div className="pt-4 mt-4 border-t border-[#E6ECF3]">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full bg-[#1557C0] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#002760] transition-colors cursor-pointer"
            >
              {t('nav.quickEnquiry')}
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-[#E6ECF3] bg-[#F4F8FD] text-xs text-[#172033]/70 space-y-2.5">
          <div>
            <p className="font-bold text-[#002760] font-['Manrope','Yantramanav',sans-serif]">
              {language === 'en' ? 'Abhinav Technical Institute' : language === 'hi' ? 'अभिनव टेक्निकल इंस्टीट्यूट' : 'अभिनव टेक्निकल इन्स्टिट्यूट'}
            </p>
            <p className="text-[11px] text-[#172033]/80 mt-0.5">{t('location.addressVal')}</p>
          </div>

          <div className="space-y-1 pt-1 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#1557C0]">call</span>
              <div className="flex flex-wrap gap-x-2 text-xs font-bold text-[#1557C0]">
                <a href="tel:+919423488174" className="hover:underline">
                  +91 94234 88174
                </a>
                <span>/</span>
                <a href="tel:+917040416582" className="hover:underline">
                  70404 16582
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#1557C0]">mail</span>
              <a
                href="mailto:info@abhinav-institute.in"
                className="text-xs font-semibold text-[#1557C0] hover:underline"
                title="Send Email to Abhinav Technical Institute"
              >
                info@abhinav-institute.in
              </a>
            </div>

            <div className="pt-1">
              <a
                href={`https://wa.me/919423488174?text=${encodeURIComponent('नमस्कार! मला अभिनव टेक्निकल इन्स्टिट्यूट जळगाव मधील प्रवेश, बॅचेस व अभ्यासक्रमाबद्दल माहिती हवी आहे.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.301-.15-1.781-.878-2.057-.978-.276-.101-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.911 1.23 3.112.15.201 2.123 3.242 5.143 4.545.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.04 2C6.495 2 2 6.495 2 12.04c0 1.77.462 3.5 1.341 5.024L2 22l5.098-1.338a10.005 10.005 0 0 0 4.942 1.304c5.545 0 10.04-4.495 10.04-10.04C22.08 6.495 17.585 2 12.04 2zm0 18.258a8.214 8.214 0 0 1-4.19-1.144l-.3-.178-3.114.817.831-3.036-.195-.311a8.204 8.204 0 0 1-1.258-4.366c0-4.542 3.698-8.24 8.24-8.24 4.542 0 8.24 3.698 8.24 8.24 0 4.542-3.698 8.24-8.24 8.24z"/>
                </svg>
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-[#002760]/40 z-[55] backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          id="nav-overlay"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};
