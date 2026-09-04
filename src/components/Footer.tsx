import React from 'react';
import { InstituteLogo } from './InstituteLogo';
import { Language, getTranslation } from '../translations/translations';

interface FooterProps {
  language: Language;
  onNavigateSection: (sectionId: string) => void;
  onOpenEnquiryWithCourse?: (courseName: string) => void;
  onOpenEnquiry?: () => void;
  onOpenAboutUs?: () => void;
  onOpenPlacements?: () => void;
  onOpenGovernmentGr?: () => void;
  onOpenCertificateVerify?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onNavigateSection,
  onOpenEnquiryWithCourse,
  onOpenEnquiry,
  onOpenAboutUs,
  onOpenPlacements,
  onOpenGovernmentGr,
  onOpenCertificateVerify,
}) => {
  const t = (key: string) => getTranslation(key, language);

  const coursesList = [
    'Construction Supervisor',
    'Electrician',
    'DMLT',
    'Health Sanitary Inspector (S.I.)',
    'Computer & AI Skills',
    'Diesel Mechanic'
  ];

  return (
    <footer className="bg-[#002760] text-white w-full">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Row 1: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Column 1: Institute */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <InstituteLogo className="w-12 h-12 shrink-0 drop-shadow-md" />
              <div className="flex flex-col">
                <span className="font-['Manrope','Yantramanav',sans-serif] text-lg font-black tracking-tight leading-tight text-white">
                  {language === 'en' ? 'Abhinav Technical Institute' : language === 'hi' ? 'अभिनव टेक्निकल इंस्टीट्यूट' : 'अभिनव टेक्निकल इन्स्टिट्यूट'}
                </span>
                <span className="text-[10px] font-bold tracking-wider leading-none text-[#FFD21F] mt-1">
                  {t('nav.tagline')}
                </span>
              </div>
            </div>

            <p className="text-white/70 text-sm leading-relaxed">
              {t('footer.aboutDesc')}
            </p>

            <p className="text-[#FFD21F] font-bold text-[10px] uppercase tracking-wider">
              Govt. Approved | ISO Certified 9001:2015
            </p>

            <div className="flex gap-2.5 mt-2">
              <a
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD21F] hover:text-[#002760] transition-all"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Facebook"
              >
                <span className="material-symbols-outlined text-base">public</span>
              </a>
              <a
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD21F] hover:text-[#002760] transition-all"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Instagram"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
              </a>
              <a
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD21F] hover:text-[#002760] transition-all"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                title="YouTube"
              >
                <span className="material-symbols-outlined text-base">play_circle</span>
              </a>
              <a
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FFD21F] hover:text-[#002760] transition-all"
                href={`https://wa.me/919423488174?text=${encodeURIComponent('नमस्कार! मला अभिनव टेक्निकल इन्स्टिट्यूट जळगाव मधील प्रवेश, बॅचेस व अभ्यासक्रमाबद्दल माहिती हवी आहे.')}`}
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <span className="material-symbols-outlined text-base">chat</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-['Manrope'] font-bold text-lg mb-4 sm:mb-6 border-b border-white/10 pb-2 text-[#FFD21F]">
              {t('footer.quickLinks')}
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <button
                onClick={() => onNavigateSection('hero')}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.home')}
              </button>
              <button
                onClick={() => {
                  if (onOpenAboutUs) {
                    onOpenAboutUs();
                  } else {
                    onNavigateSection('why-us');
                  }
                }}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.about')}
              </button>
              <button
                onClick={() => onNavigateSection('batches')}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.courses')}
              </button>
              <button
                onClick={() => {
                  if (onOpenPlacements) onOpenPlacements();
                }}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.placements')}
              </button>
              <button
                onClick={() => {
                  if (onOpenGovernmentGr) onOpenGovernmentGr();
                }}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.gr')}
              </button>
              <button
                onClick={() => onNavigateSection('reviews')}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('reviews.title')}
              </button>
              <button
                onClick={() => onNavigateSection('gallery')}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.gallery')}
              </button>
              <button
                onClick={() => onNavigateSection('location')}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.contact')}
              </button>
            </nav>
          </div>

          {/* Column 3: Students */}
          <div>
            <h4 className="font-['Manrope'] font-bold text-lg mb-4 sm:mb-6 border-b border-white/10 pb-2 text-[#FFD21F]">
              {t('nav.studentSection')}
            </h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <button
                onClick={onOpenEnquiry}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {t('nav.quickEnquiry')}
              </button>
              <button
                onClick={() => {
                  if (onOpenCertificateVerify) {
                    onOpenCertificateVerify();
                  } else {
                    onNavigateSection('verify');
                  }
                }}
                className="text-left text-[#FFD21F] hover:underline transition-colors font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>{t('nav.certVerification')}</span>
              </button>
              <button
                onClick={() => {
                  if (onOpenGovernmentGr) onOpenGovernmentGr();
                }}
                className="text-left text-white/70 hover:text-[#FFD21F] transition-colors cursor-pointer"
              >
                {language === 'mr' ? 'शासन निर्णय व मान्यता' : 'Government GRs & Affiliations'}
              </button>
            </nav>
          </div>

          {/* Column 4: Our Courses */}
          <div>
            <h4 className="font-['Manrope'] font-bold text-lg mb-4 sm:mb-6 border-b border-white/10 pb-2 text-[#FFD21F]">
              {t('footer.coursesTitle')}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {coursesList.map((c) => (
                <button
                  key={c}
                  onClick={() => onOpenEnquiryWithCourse && onOpenEnquiryWithCourse(c)}
                  className="text-left text-white/70 hover:text-[#FFD21F] transition-colors py-0.5 truncate cursor-pointer"
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() => onNavigateSection('batches')}
              className="text-[#FFD21F] font-bold text-xs mt-4 flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
            >
              {t('batches.viewDetailsBtn')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Row 2: Contact Information in Footer */}
        <div className="pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 text-white/80 text-xs sm:text-sm bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#FFD21F] shrink-0 mt-0.5">
                location_on
              </span>
              <div>
                <strong className="block text-white font-['Manrope'] mb-1">{t('location.addressLabel')}</strong>
                <p className="leading-relaxed text-xs">
                  {t('location.addressVal')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/80 text-xs sm:text-sm bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#FFD21F] shrink-0 mt-0.5">
                call
              </span>
              <div>
                <strong className="block text-white font-['Manrope'] mb-1">{t('location.helplineLabel')}</strong>
                <div className="flex flex-col gap-0.5 text-xs font-bold">
                  <a href="tel:+919423488174" className="hover:text-[#FFD21F] transition-colors">
                    +91 94234 88174
                  </a>
                  <a href="tel:+917040416582" className="hover:text-[#FFD21F] transition-colors">
                    +91 70404 16582
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/80 text-xs sm:text-sm bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#FFD21F] shrink-0 mt-0.5">
                chat
              </span>
              <div>
                <strong className="block text-white font-['Manrope'] mb-1">WhatsApp & Mail</strong>
                <a href="https://wa.me/919423488174" target="_blank" rel="noreferrer" className="hover:text-[#FFD21F] transition-colors block text-xs font-bold">
                  +91 94234 88174
                </a>
                <a href="mailto:info@abhinav-institute.in" className="hover:text-[#FFD21F] transition-colors block text-xs mt-0.5 text-white/90 underline font-medium">
                  info@abhinav-institute.in
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-white/80 text-xs sm:text-sm bg-white/5 p-4 rounded-xl border border-white/10">
              <span className="material-symbols-outlined text-[#FFD21F] shrink-0 mt-0.5">
                schedule
              </span>
              <div>
                <strong className="block text-white font-['Manrope'] mb-1">{t('location.hoursLabel')}</strong>
                <p className="text-xs text-white/90">
                  {t('location.hoursVal')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 bg-[#001c45]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[11px] text-white/70">
            <p>{t('footer.copyright')}</p>
            <span className="hidden sm:block text-white/30">|</span>
            <p className="flex items-center gap-1">
              <span>Made by</span>
              <a
                href="https://sanket-portfolio-211.pages.dev/"
                target="_blank"
                rel="noreferrer"
                className="text-[#FFD21F] font-extrabold hover:underline inline-flex items-center gap-1 transition-all hover:text-white group"
                title="View SS Projects Portfolio"
              >
                <span>SS Projects</span>
                <span className="material-symbols-outlined text-[13px] group-hover:translate-x-0.5 transition-transform">
                  open_in_new
                </span>
              </a>
            </p>
          </div>
          <div className="text-[#FFD21F] font-bold text-xs tracking-widest uppercase font-['Manrope']">
            Learn • Practice • Grow
          </div>
        </div>
      </div>
    </footer>
  );
};
