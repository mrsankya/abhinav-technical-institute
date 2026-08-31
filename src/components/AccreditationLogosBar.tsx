import React, { useRef, useState } from 'react';
import { Language, getTranslation } from '../translations/translations';

interface AccreditationLogosBarProps {
  language?: Language;
  className?: string;
}

const ACCREDITATIONS = [
  {
    id: 'msbsvet',
    name: 'MSBSVET Board',
    subNameMr: 'महाराष्ट्र राज्य कौशल्य मंडळ',
    subNameHi: 'महाराष्ट्र राज्य कौशल्य मंडल',
    subNameEn: 'Govt. of Maharashtra',
    logo: '/assets/accreditations/msbsvet_kaushalyam.jpg',
    tag: 'Govt. Board',
  },
  {
    id: 'ncvet',
    name: 'NCVET',
    subNameMr: 'कौशल गुणवत्ता प्रगति',
    subNameHi: 'कौशल गुणवत्ता प्रगति',
    subNameEn: 'Govt. of India',
    logo: '/assets/accreditations/ncvet_logo.jpeg',
    tag: 'National Council',
  },
  {
    id: 'mssds',
    name: 'MSSDS',
    subNameMr: 'महाराष्ट्र कौशल्य विकास',
    subNameHi: 'महाराष्ट्र कौशल विकास सोसायटी',
    subNameEn: 'Maha Skill Society',
    logo: '/assets/accreditations/mssds_logo.jpg',
    tag: 'State Mission',
  },
  {
    id: 'pmkvy',
    name: 'PMKVY',
    subNameMr: 'प्रधानमंत्री कौशल विकास',
    subNameHi: 'प्रधानमंत्री कौशल विकास योजना',
    subNameEn: 'Skill Scheme',
    logo: '/assets/accreditations/pmkvy_logo.png',
    tag: 'Govt. of India',
  },
  {
    id: 'nsdc',
    name: 'Skill India / NSDC',
    subNameMr: 'कौशल भारत - कुशल भारत',
    subNameHi: 'कौशल भारत - कुशल भारत',
    subNameEn: 'National Skill Corp',
    logo: '/assets/accreditations/skill_india_nsdc.png',
    tag: 'Skill Mission',
  },
  {
    id: 'ati',
    name: 'ATI Training Skills',
    subNameMr: 'कौशल्याने रोजगार प्राप्ती',
    subNameHi: 'कौशल से रोजगार',
    subNameEn: 'Skills For Employment',
    logo: '/assets/accreditations/ati_skills_logo.png',
    tag: 'Certified Center',
  },
];

export const AccreditationLogosBar: React.FC<AccreditationLogosBarProps> = ({
  language = 'mr',
  className = '',
}) => {
  const currentLang: Language = (language || 'mr') as Language;
  const t = (key: string) => getTranslation(key, currentLang);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div
      id="our-accreditations-bar"
      className={`w-full max-w-[1200px] mx-auto px-4 md:px-6 mb-16 ${className}`}
    >
      <div className="bg-white/95 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          
          {/* Left Title Section */}
          <div className="shrink-0 text-center lg:text-left flex flex-col items-center lg:items-start">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1557C0] bg-[#1557C0]/10 px-3 py-1 rounded-full mb-2">
              Govt Recognized
            </span>
            <h2 className="font-['Manrope','Yantramanav',sans-serif] text-2xl sm:text-3xl font-extrabold text-[#002760] tracking-tight leading-tight">
              {currentLang === 'en' ? (
                <>Our Accreditations</>
              ) : currentLang === 'hi' ? (
                <>हमारी मान्यता एवं संबद्धता</>
              ) : (
                <>आमच्या मान्यता व दर्जा</>
              )}
            </h2>
            <div className="w-12 h-1 bg-[#FFD21F] rounded-full mt-2" />
          </div>

          {/* Right Horizontal Scrolling Carousel Track */}
          <div className="flex-1 w-full relative group">
            {/* Left Scroll Arrow */}
            <button
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-[#002760] hover:bg-[#002760] hover:text-white shadow-lg hover:scale-110'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll accreditations left"
            >
              <span className="material-symbols-outlined font-bold text-lg">arrow_back</span>
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="w-full overflow-x-auto hide-scrollbar flex items-center gap-4 sm:gap-6 py-2 px-6 scroll-smooth"
            >
              {ACCREDITATIONS.map((item) => (
                <div
                  key={item.id}
                  className="w-40 sm:w-44 shrink-0 bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center justify-between text-center cursor-pointer group hover:border-[#1557C0]/40"
                  title={item.name}
                >
                  <div className="w-full flex justify-center mb-1.5">
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#1557C0] group-hover:text-white transition-colors">
                      {item.tag}
                    </span>
                  </div>

                  <div className="w-20 h-20 sm:w-24 sm:h-24 mb-2.5 flex items-center justify-center p-1.5 rounded-xl bg-slate-50/80 group-hover:bg-blue-50/40 transition-colors">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                      loading="lazy"
                    />
                  </div>

                  <div className="w-full">
                    <span className="text-xs sm:text-[13px] font-extrabold text-[#002760] leading-tight block tracking-tight group-hover:text-[#1557C0] transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium leading-tight block mt-0.5 truncate">
                      {currentLang === 'en'
                        ? item.subNameEn
                        : currentLang === 'hi'
                        ? item.subNameHi
                        : item.subNameMr}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Scroll Arrow */}
            <button
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white text-[#002760] hover:bg-[#002760] hover:text-white shadow-lg hover:scale-110'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-40'
              }`}
              aria-label="Scroll accreditations right"
            >
              <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
