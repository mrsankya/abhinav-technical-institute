import React, { useState, useEffect, useRef } from 'react';
import { HERO_CAROUSEL_IMAGES } from '../data/instituteData';
import { Language, getTranslation } from '../translations/translations';
import { InstituteLogo } from './InstituteLogo';

interface HeroProps {
  language: Language;
  onExploreCourses: () => void;
  onOpenEnquiry: () => void;
  carouselImages?: any[];
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onExploreCourses,
  onOpenEnquiry,
  carouselImages,
}) => {
  const slides = carouselImages && carouselImages.length > 0 ? carouselImages : HERO_CAROUSEL_IMAGES;
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const t = (key: string) => getTranslation(key, language);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    resetTimer();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
    resetTimer();
  };

  return (
    <section id="hero" className="px-4 md:px-6 max-w-[1200px] mx-auto pt-6 md:pt-10 mb-8 overflow-hidden">
      <div className="flex flex-col gap-6">
        {/* 1. Image Carousel */}
        <div className="relative w-full sm:w-[94%] md:w-full mx-auto">
          <div className="relative h-[240px] sm:h-[320px] md:h-[400px] rounded-[24px] overflow-hidden shadow-xl border border-[#E6ECF3] group bg-gray-900">
            {/* Slide Images */}
            {slides.map((img, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block bg-[#FFD21F] text-[#002760] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full mb-1">
                    {language === 'mr' ? img.categoryMr || img.category || 'Live Workshop' : img.category || 'Live Workshop'}
                  </span>
                  <p className="font-['Manrope'] font-bold text-sm sm:text-base drop-shadow-md">
                    {language === 'mr' ? img.titleMr || img.title : img.title}
                  </p>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-md text-[#002760] transition-all hover:scale-110 z-20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white backdrop-blur rounded-full flex items-center justify-center shadow-md text-[#002760] transition-all hover:scale-110 z-20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentSlide(idx);
                  resetTimer();
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentSlide
                    ? 'w-7 h-2 bg-[#002760]'
                    : 'w-2 h-2 bg-[#E6ECF3] hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 2. Trust Badge */}
        <div className="flex items-center gap-2 px-2 sm:px-4">
          <div className="w-6 h-1 bg-[#FFD21F] rounded-full" />
          <span className="font-['Manrope'] text-[11px] font-bold text-[#002760] tracking-widest uppercase">
            {t('hero.trustBadge')}
          </span>
        </div>

        {/* 3. Main Heading */}
        <div className="px-2 sm:px-4">
          <h1 className="font-['Manrope'] text-[32px] sm:text-[42px] md:text-[48px] text-[#002760] leading-[1.1] font-extrabold tracking-tight">
            {t('hero.headingLine1')}<br />
            <span className="text-[#1557C0]">{t('hero.headingLine2')}</span>
          </h1>
        </div>

        {/* 4. Supporting Text */}
        <div className="px-2 sm:px-4">
          <p className="font-['Work_Sans'] text-base md:text-lg text-[#172033]/80 font-medium leading-relaxed max-w-2xl">
            {t('hero.subheading')}
          </p>
        </div>

        {/* 5. CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 px-2 sm:px-4">
          <button
            onClick={onExploreCourses}
            className="flex-1 sm:flex-none bg-[#002760] hover:bg-[#1557C0] text-white font-['Work_Sans'] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer hover:shadow-lg"
          >
            {t('hero.exploreBtn')}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
          <button
            onClick={onOpenEnquiry}
            className="flex-1 sm:flex-none bg-white border-2 border-[#1557C0] text-[#1557C0] font-['Work_Sans'] font-semibold py-3.5 px-6 rounded-xl text-sm hover:bg-[#1557C0]/5 transition-colors cursor-pointer"
          >
            {t('hero.enquiryBtn')}
          </button>
        </div>

        {/* 6. Official Horizontal Institute Banner (Modeled directly after user's reference banner) */}
        <div className="px-2 sm:px-4 mt-2">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#3D1E16]/20 bg-[#2D1610] text-white transition-all">
            {/* Top Dark Brown Section */}
            <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-[#2A130C] via-[#3E1F16] to-[#2A130C] relative">
              {/* Header Row: Centered big font without border, establishment year on right */}
              <div className="relative flex justify-between items-center mb-2 sm:mb-3">
                <div className="w-24 hidden sm:block" />
                <div className="text-center flex-1">
                  <span className="font-['Manrope','Yantramanav',sans-serif] text-base sm:text-lg md:text-xl font-extrabold text-[#FFD21F] tracking-wider drop-shadow-sm">
                    {language === 'en' ? 'GOVT. APPROVED INSTITUTE' : language === 'hi' ? 'शासनमान्यता प्राप्त संस्थान' : 'शासनमान्यता प्राप्त'}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-[#FFD21F] tracking-wide">
                    {language === 'en' ? 'ESTABLISHED : 2010' : language === 'hi' ? 'स्थापना : २०१०' : 'स्थापना : २०१०'}
                  </span>
                </div>
              </div>

              {/* Main Banner Header Grid: Left Logo | Center Title | Right Govt Seal */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 py-2">
                {/* Left Logo Badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1.5 border-2 border-[#FFD21F] shadow-lg flex items-center justify-center shrink-0">
                    <InstituteLogo className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Center Main Institute Name Banner Title */}
                <div className="text-center flex-1 px-2">
                  <h2 className="font-['Manrope','Yantramanav',sans-serif] text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                    {language === 'en'
                      ? 'ABHINAV TECHNICAL INSTITUTE, JALGAON'
                      : language === 'hi'
                      ? 'अभिनव टेक्निकल इंस्टीट्यूट, जलगांव'
                      : 'अभिनव टेक्निकल इन्स्टिट्यूट, जळगाव'}
                  </h2>
                  <p className="text-[#FFD21F] text-xs sm:text-sm font-bold tracking-widest uppercase mt-1">
                    IT HUB FOR STUDENTS • JALGAON
                  </p>
                </div>

                {/* Right Govt/ISO Vocational Examination Emblem Badge */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#002760] to-[#1557C0] p-1.5 border-2 border-[#FFD21F] shadow-lg flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-white text-2xl sm:text-3xl">verified</span>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-[#FFD21F] leading-tight uppercase">
                      ISO 9001:2015
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Yellow Strip with Full Address & Phone Helplines */}
            <div className="bg-[#FFB800] text-[#2D1610] font-bold text-xs sm:text-sm md:text-base py-3 px-4 sm:px-8 text-center border-t border-[#FFD21F]">
              <p className="leading-snug tracking-wide">
                {language === 'en'
                  ? 'Shop No. 12-16, 1st Floor, Manasingh Market, Station Road, Jalgaon 425001 • Mob : +91 94234 88174 / 98220 54321'
                  : language === 'hi'
                  ? 'दुकान नं. १२-१६, पहली मंजिल, मानसिंह मार्केट, स्टेशन रोड, जलगांव ४२५००१ • मोबा : ९४२३४ ८८१७४ / ९८२२० ५४३२१'
                  : 'दुकान क्र. १२-१६, पहिला मजला, मानसिंग मार्केट, स्टेशन रोड, जळगाव ४२५००१ • मोबा : ९४२३४ ८८१७४ / ९८२२० ५४३२१'}
              </p>
            </div>
          </div>
        </div>

        {/* 7. Statistics Cards Grid (groups, workspace_premium, handyman, support_agent) */}
        <div className="px-2 sm:px-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-[#E6ECF3]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* 1. groups -> 1500+ Students Trained */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4F8FD] flex items-center justify-center text-[#1557C0] mb-2 border border-[#d9e2fc]">
                  <span className="material-symbols-outlined text-2xl">groups</span>
                </div>
                <span className="font-['Manrope'] font-extrabold text-[#002760] text-xl sm:text-2xl">
                  1500+
                </span>
                <span className="text-xs text-[#172033]/70 font-medium mt-0.5">
                  {t('hero.statStudents')}
                </span>
              </div>

              {/* 2. workspace_premium -> 15+ Years of Excellence */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4F8FD] flex items-center justify-center text-[#1557C0] mb-2 border border-[#d9e2fc]">
                  <span className="material-symbols-outlined text-2xl">workspace_premium</span>
                </div>
                <span className="font-['Manrope'] font-extrabold text-[#002760] text-xl sm:text-2xl">
                  15+
                </span>
                <span className="text-xs text-[#172033]/70 font-medium mt-0.5">
                  {t('hero.statYears')}
                </span>
              </div>

              {/* 3. handyman -> 100% Practical Training */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4F8FD] flex items-center justify-center text-[#1557C0] mb-2 border border-[#d9e2fc]">
                  <span className="material-symbols-outlined text-2xl">handyman</span>
                </div>
                <span className="font-['Manrope'] font-extrabold text-[#002760] text-xl sm:text-2xl">
                  100%
                </span>
                <span className="text-xs text-[#172033]/70 font-medium mt-0.5">
                  {t('hero.statPractical')}
                </span>
              </div>

              {/* 4. support_agent -> 100% Student Support */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#F4F8FD] flex items-center justify-center text-[#1557C0] mb-2 border border-[#d9e2fc]">
                  <span className="material-symbols-outlined text-2xl">support_agent</span>
                </div>
                <span className="font-['Manrope'] font-extrabold text-[#002760] text-xl sm:text-2xl">
                  100%
                </span>
                <span className="text-xs text-[#172033]/70 font-medium mt-0.5">
                  {t('hero.statSupport')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
