import React, { useRef } from 'react';
import type { Course } from '../types';
import { getTranslation, type Language } from '../translations/translations';

interface UpcomingBatchesProps {
  courses: Course[];
  language: Language;
  onSelectCourse: (course: Course) => void;
  onOpenEnquiryWithCourse: (courseName: string) => void;
}

export const UpcomingBatches: React.FC<UpcomingBatchesProps> = ({
  courses,
  language,
  onSelectCourse,
  onOpenEnquiryWithCourse,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => getTranslation(key, language);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getCourseName = (course: Course) => {
    if (language === 'mr' && course.nameMr) return course.nameMr;
    return course.name;
  };

  return (
    <section id="batches" className="px-4 md:px-6 max-w-[1200px] mx-auto mb-16 py-8">
      {/* Section Header with Left/Right Navigation Controls */}
      <div className="flex justify-between items-end mb-6 md:mb-8">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD21F]/20 border border-[#FFD21F]/40 text-[#002760] font-bold text-xs w-fit">
            <span className="material-symbols-outlined text-sm">school</span>
            <span>{t('batches.title')}</span>
          </div>
          <h2 className="font-['Manrope'] text-2xl sm:text-3xl md:text-4xl text-[#002760] font-extrabold tracking-tight">
            {language === 'mr' ? 'उपलब्ध व्यवसाय अभ्यासक्रम (Courses Available)' : 'Available Vocational Courses'}
          </h2>
          <div className="w-16 h-1 bg-[#FFD21F] rounded-full" />
          <p className="font-['Work_Sans'] text-sm sm:text-base text-[#172033]/70 mt-1">
            {language === 'mr'
              ? 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त व्यवसाय अभ्यासक्रम कोड व विषयांसह पूर्ण तपशील:'
              : 'Government MSBSVET recognized courses with exact subject codes, durations and details:'}
          </p>
        </div>

        {/* Desktop Carousel Navigation Arrows */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-11 h-11 rounded-full border border-[#E6ECF3] bg-white shadow-md flex items-center justify-center text-[#002760] hover:bg-[#002760] hover:text-white transition-all cursor-pointer hover:scale-105"
          >
            <span className="material-symbols-outlined font-bold">arrow_back</span>
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-11 h-11 rounded-full border border-[#E6ECF3] bg-white shadow-md flex items-center justify-center text-[#002760] hover:bg-[#002760] hover:text-white transition-all cursor-pointer hover:scale-105"
          >
            <span className="material-symbols-outlined font-bold">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrolling Bar / Carousel Block */}
      <div className="relative group">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar gap-6 pb-6 snap-x snap-mandatory scroll-smooth"
        >
          {courses.map((course, idx) => {
            const isConstruction = course.code === '304202' || course.id === 'construction-supervisor';
            const isElectrician = course.code === '302409' || course.id === 'electrician';
            const isDMLT = course.code === 'MSBQ201404' || course.id === 'dmlt';

            // Distinct Accent Styling per course
            const theme = isConstruction
              ? {
                  cardBorder: 'border-pink-200 hover:border-pink-400',
                  badgeBg: 'bg-[#BE185D] text-white',
                  headerBg: 'bg-gradient-to-r from-[#9D174D] to-[#E11D48]',
                  codeBadge: 'bg-pink-100 text-pink-900 border-pink-300',
                  accentColor: 'text-[#BE185D]',
                  btnBg: 'bg-[#BE185D] hover:bg-[#9D174D] text-white',
                  btnOutline: 'border-[#BE185D] text-[#BE185D] hover:bg-pink-50',
                }
              : isElectrician
              ? {
                  cardBorder: 'border-emerald-200 hover:border-emerald-400',
                  badgeBg: 'bg-[#047857] text-white',
                  headerBg: 'bg-gradient-to-r from-[#065F46] to-[#059669]',
                  codeBadge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                  accentColor: 'text-[#047857]',
                  btnBg: 'bg-[#047857] hover:bg-[#065F46] text-white',
                  btnOutline: 'border-[#047857] text-[#047857] hover:bg-emerald-50',
                }
              : isDMLT
              ? {
                  cardBorder: 'border-blue-200 hover:border-blue-400',
                  badgeBg: 'bg-[#1D4ED8] text-white',
                  headerBg: 'bg-gradient-to-r from-[#1E40AF] to-[#2563EB]',
                  codeBadge: 'bg-blue-100 text-blue-900 border-blue-300',
                  accentColor: 'text-[#1D4ED8]',
                  btnBg: 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white',
                  btnOutline: 'border-[#1D4ED8] text-[#1D4ED8] hover:bg-blue-50',
                }
              : {
                  cardBorder: 'border-purple-200 hover:border-purple-400',
                  badgeBg: 'bg-[#6B21A8] text-white',
                  headerBg: 'bg-gradient-to-r from-[#581C87] to-[#7E22CE]',
                  codeBadge: 'bg-purple-100 text-purple-900 border-purple-300',
                  accentColor: 'text-[#6B21A8]',
                  btnBg: 'bg-[#6B21A8] hover:bg-[#581C87] text-white',
                  btnOutline: 'border-[#6B21A8] text-[#6B21A8] hover:bg-purple-50',
                };

            return (
              <div
                key={course.id || idx}
                className={`w-[90%] sm:w-[380px] md:w-[420px] lg:w-[460px] bg-white border ${theme.cardBorder} rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col snap-center shrink-0 group/card`}
              >
                {/* Course Top Image & Badge */}
                <div className="aspect-[16/9] w-full overflow-hidden relative bg-gray-100">
                  <img
                    src={course.image}
                    alt={getCourseName(course)}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    <span className={`${theme.badgeBg} text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                      {course.category}
                    </span>
                    <span className="bg-white/90 backdrop-blur text-[#002760] font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-xs">
                      कोड: {course.code}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                    <h3 className="font-['Manrope'] text-lg sm:text-xl font-extrabold leading-tight text-white drop-shadow-sm">
                      {course.name}
                    </h3>
                  </div>
                </div>

                {/* Course Content Details */}
                <div className="p-5 flex flex-col flex-grow gap-4">
                  {/* Marathi Subtitle & Duration */}
                  <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
                    <p className="text-xs sm:text-sm font-semibold text-[#002760] mb-2 leading-relaxed">
                      {course.nameMr}
                    </p>
                    <div className="flex flex-wrap items-center justify-between text-xs text-[#172033]/80 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-base text-[#FFD21F]">timer</span>
                        <span>{course.durationMr || course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-700 font-bold">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>प्रवेश सुरू</span>
                      </div>
                    </div>
                  </div>

                  {/* Subjects & Subject Codes List */}
                  {course.subjects && course.subjects.length > 0 && (
                    <div>
                      <h4 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-[#002760] mb-2.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">menu_book</span>
                        <span>Subjects & Codes (विषय व कोड):</span>
                      </h4>
                      <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                        {course.subjects.map((subj, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-xl text-xs border border-gray-100 transition-colors"
                          >
                            <span className="font-medium text-[#172033] truncate pr-2">
                              {sIdx + 1}. {subj.name}
                            </span>
                            <span className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded border shrink-0 ${theme.codeBadge}`}>
                              {subj.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer Action Buttons */}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onSelectCourse(course)}
                      className={`flex-1 border px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${theme.btnOutline}`}
                    >
                      <span>{language === 'mr' ? 'तपशील पहा' : 'View Full Details'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => onOpenEnquiryWithCourse(course.name)}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${theme.btnBg}`}
                    >
                      <span>{language === 'mr' ? 'प्रवेश अर्ज करा' : 'Apply for Admission'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-[#E6ECF3] bg-white shadow-md flex items-center justify-center text-[#002760] hover:bg-[#002760] hover:text-white transition-all cursor-pointer hover:scale-105"
          >
            <span className="material-symbols-outlined font-bold text-base">arrow_back</span>
          </button>
          <div className="flex items-center gap-2">
            {courses.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = 400;
                    scrollContainerRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
                  }
                }}
                className="w-2.5 h-2.5 rounded-full bg-gray-300 hover:bg-[#002760] transition-all cursor-pointer"
                aria-label={`Scroll to course ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-[#E6ECF3] bg-white shadow-md flex items-center justify-center text-[#002760] hover:bg-[#002760] hover:text-white transition-all cursor-pointer hover:scale-105"
          >
            <span className="material-symbols-outlined font-bold text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};
