import React, { useState } from 'react';
import { COURSES } from '../data/instituteData';
import { InstituteLogo } from './InstituteLogo';
import { Language, getTranslation } from '../translations/translations';

interface StudentSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: (courseName?: string) => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenVerifyPage?: () => void;
  language: Language;
}

const QUIZ_QUESTIONS = [
  {
    q_en: 'How comfortable are you working with electrical wires, tools, and circuits?',
    q_mr: 'तुम्ही वायर, टूल्स आणि सर्किट्ससोबत काम करताना किती सहज वाटते?',
    options: [
      { text_en: 'Very comfortable – I enjoy hands-on wiring', text_mr: 'खूप सहज – मला प्रॅक्टिकल वायरिंग आवडते', trade: 'Electrician' },
      { text_en: 'Somewhat comfortable', text_mr: 'थोडे सहज', trade: 'Solar Technician' },
      { text_en: 'Prefer computers or office work', text_mr: 'संगणक किंवा कार्यालयीन काम आवडते', trade: 'COPA' },
    ],
  },
  {
    q_en: 'Do you prefer working on computers (typing, software, accounting, data)?',
    q_mr: 'तुम्ही संगणकावर काम करणे (टायपिंग, सॉफ्टवेअर, टॅली, डेटा) पसंत करता का?',
    options: [
      { text_en: 'Yes, I love IT and computers', text_mr: 'हो, मला संगणक व आयटी खूप आवडते', trade: 'COPA' },
      { text_en: 'A bit, for basic accounting/office work', text_mr: 'थोडेफार, मूलभूत कामांसाठी', trade: 'COPA' },
      { text_en: 'No, I prefer mechanical or field work', text_mr: 'नाही, मला प्रत्यक्ष काम आवडते', trade: 'Electrician' },
    ],
  },
  {
    q_en: 'Are you interested in Renewable Energy & Solar Rooftop systems?',
    q_mr: 'तुम्हाला सौर ऊर्जा (Solar Energy) आणि रूफटॉप इन्स्टॉलेशनमध्ये रुची आहे का?',
    options: [
      { text_en: 'Yes, green energy is the future', text_mr: 'हो, सोलर क्षेत्रात करिअर करायचे आहे', trade: 'Solar Technician' },
      { text_en: 'Maybe alongside electrical work', text_mr: 'हो, इलेक्ट्रिकल सोबत शिकायचे आहे', trade: 'Electrician' },
      { text_en: 'Not much', text_mr: 'फारशी नाही', trade: 'RAC & Inverter AC' },
    ],
  },
  {
    q_en: 'What is your educational background?',
    q_mr: 'तुमची शैक्षणिक पात्रता काय आहे?',
    options: [
      { text_en: '10th (SSC) Passed', text_mr: '१० वी उत्तीर्ण', trade: 'Electrician' },
      { text_en: '12th (HSC) Passed', text_mr: '१२ वी उत्तीर्ण', trade: 'COPA' },
      { text_en: 'Graduate / Diploma / ITI', text_mr: 'पदवीधर / डिप्लोमा / ITI', trade: 'Solar Technician' },
    ],
  },
];

export const StudentSectionModal: React.FC<StudentSectionModalProps> = ({
  isOpen,
  onClose,
  onOpenEnquiry,
  onOpenVerifyPage,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<
    'syllabus' | 'timetable' | 'quiz' | 'calculator' | 'exams' | 'placements' | 'helpdesk'
  >('syllabus');
  const [selectedCourseId, setSelectedCourseId] = useState('electrician');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Quiz state
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  // EMI Calculator state
  const [calcCourseIdx, setCalcCourseIdx] = useState(0);
  const [calcPlan, setCalcPlan] = useState<'lumpsum' | 'emi3' | 'emi6'>('emi3');

  const t = (key: string) => getTranslation(key, language);

  if (!isOpen) return null;

  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const handleDownload = (docName: string) => {
    setDownloadSuccess(docName);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const getCourseName = (c: (typeof COURSES)[0]) => {
    if (language === 'hi' && c.nameHi) return c.nameHi;
    if (language === 'mr' && c.nameMr) return c.nameMr;
    return c.name;
  };

  // Fee calculation helper
  const feesMap: Record<string, number> = {
    'construction-supervisor': 14000,
    electrician: 15000,
    dmlt: 16000,
    'health-sanitary-inspector': 14000,
  };

  const selectedCalcCourse = COURSES[calcCourseIdx] || COURSES[0];
  const baseFee = feesMap[selectedCalcCourse.id] || 12000;
  const lumpSumFee = Math.round(baseFee * 0.9);
  const emi3Month = Math.ceil(baseFee / 3);
  const emi6Month = Math.ceil(baseFee / 6);

  const handleQuizAnswer = (trade: string) => {
    const nextAnswers = [...quizAnswers, trade];
    setQuizAnswers(nextAnswers);
    if (quizStep + 1 < QUIZ_QUESTIONS.length) {
      setQuizStep(quizStep + 1);
    } else {
      // Calculate top recommended trade
      const counts: Record<string, number> = {};
      nextAnswers.forEach((ans) => {
        counts[ans] = (counts[ans] || 0) + 1;
      });
      let topTrade = 'Electrician';
      let max = 0;
      for (const [tr, cnt] of Object.entries(counts)) {
        if (cnt > max) {
          max = cnt;
          topTrade = tr;
        }
      }
      setQuizResult(topTrade);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#001738]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E6ECF3] overflow-hidden"
        id="student-section-modal"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#002760] via-[#0A3D80] to-[#1557C0] text-white flex justify-between items-center relative">
          <div className="flex items-center gap-3.5">
            <InstituteLogo className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 drop-shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/15 px-2 py-0.5 rounded-md border border-[#FFD21F]/30">
                  विद्यार्थी केंद्र (Student Hub)
                </span>
                <span className="text-xs text-white/80">Academic Year 2025–26</span>
              </div>
              <h3 className="font-['Manrope'] text-lg sm:text-2xl font-black tracking-tight mt-0.5">
                {t('studentSection.title')}
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E6ECF3] bg-[#F4F8FD] px-4 sm:px-6 overflow-x-auto no-scrollbar gap-2 py-2">
          {[
            { id: 'syllabus', label: t('studentSection.tabNotes'), icon: 'menu_book' },
            { id: 'timetable', label: t('studentSection.tabSchedule'), icon: 'schedule' },
            { id: 'quiz', label: 'Trade Aptitude Quiz', icon: 'psychology' },
            { id: 'calculator', label: 'Fee & EMI Calculator', icon: 'calculate' },
            { id: 'exams', label: t('studentSection.tabVerify'), icon: 'assignment_turned_in' },
            { id: 'placements', label: language === 'en' ? 'Job Placements' : 'रोजगार व प्लेसमेंट', icon: 'work' },
            { id: 'helpdesk', label: language === 'en' ? 'Helpdesk' : 'मदत केंद्र', icon: 'contact_support' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#002760] text-white shadow-sm'
                  : 'text-[#172033]/70 hover:text-[#002760] hover:bg-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Download notification banner */}
        {downloadSuccess && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Downloaded "{downloadSuccess}" successfully (PDF format).
            </span>
            <button onClick={() => setDownloadSuccess(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6">
          {/* TAB 1: SYLLABUS & STUDY MATERIAL */}
          {activeTab === 'syllabus' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                    {t('studentSection.tabNotes')}
                  </h4>
                  <p className="text-xs text-[#172033]/70">
                    {t('studentSection.subtitle')}
                  </p>
                </div>

                {/* Course Selector Buttons */}
                <div className="flex flex-wrap gap-1.5 bg-[#F4F8FD] p-1 rounded-xl border border-[#E6ECF3]">
                  {COURSES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCourseId(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCourseId === c.id
                          ? 'bg-[#1557C0] text-white shadow-xs'
                          : 'text-[#172033]/70 hover:text-[#002760]'
                      }`}
                    >
                      {getCourseName(c)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Course Overview Card */}
              <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-5">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-[#E6ECF3]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1557C0]/10 text-[#1557C0] text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                        {currentCourse.code}
                      </span>
                      <span className="text-xs font-semibold text-[#172033]/60">{currentCourse.category}</span>
                    </div>
                    <h5 className="font-['Manrope'] text-xl font-extrabold text-[#002760] mt-1">
                      {getCourseName(currentCourse)} Trade
                    </h5>
                    <p className="text-xs text-[#172033]/80 mt-1 max-w-xl">
                      {currentCourse.fullDescription || currentCourse.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(`${currentCourse.name} Full Official Syllabus 2025`)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer self-start md:self-auto shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">download</span>
                    {t('studentSection.downloadPdf')}
                  </button>
                </div>

                {/* Modules Grid */}
                <div className="mt-4">
                  <h6 className="text-xs font-black uppercase text-[#172033]/60 tracking-wider mb-2.5">
                    Core Practical Modules & Theory Breakdown:
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCourse.syllabus.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-[#E6ECF3] rounded-xl p-3 flex items-start gap-2.5 text-xs shadow-2xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#1557C0]/10 text-[#1557C0] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-[#172033] font-medium leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TIMETABLE & SCHEDULE */}
          {activeTab === 'timetable' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                  Academic Year 2025–26 Batch Timetable
                </h4>
                <p className="text-xs text-[#172033]/70">
                  Morning, Afternoon and Special Weekend practical batches scheduled at ATI Jalgaon campus.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COURSES.slice(0, 6).map((c) => (
                  <div
                    key={c.id}
                    className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[#1557C0]">{c.code}</span>
                        <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Regular Batch
                        </span>
                      </div>
                      <h5 className="font-['Manrope'] text-sm font-bold text-[#002760]">{c.name}</h5>
                      <div className="mt-2 space-y-1 text-xs text-[#172033]/80">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#1557C0]">schedule</span>
                          <span>Daily Timing: <strong>{c.timing}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#1557C0]">calendar_month</span>
                          <span>Batch Start: <strong>{c.startDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#1557C0]">location_on</span>
                          <span>Lab: Advanced Workshop 1 & 2</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenEnquiry(c.name)}
                      className="mt-3 w-full py-2 bg-white hover:bg-[#002760] hover:text-white text-[#002760] border border-[#CBD5E1] text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Book Seat in this Batch
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRADE APTITUDE QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#002760] to-[#1557C0] text-white p-6 rounded-3xl space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD21F] bg-[#FFD21F]/20 px-2.5 py-0.5 rounded-md border border-[#FFD21F]/30">
                  Interactive Career Guidance
                </span>
                <h4 className="font-['Manrope'] text-xl font-black">
                  Trade Aptitude & Course Recommendation Quiz
                </h4>
                <p className="text-xs text-white/80 max-w-xl">
                  Answer 4 quick questions to find the perfect technical trade matching your skills, education, and career goals.
                </p>
              </div>

              {!quizResult ? (
                <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-6 space-y-6">
                  <div className="flex justify-between items-center text-xs text-[#172033]/60 font-bold">
                    <span>Question {quizStep + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>Step {quizStep + 1}</span>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-['Manrope'] text-base sm:text-lg font-extrabold text-[#002760]">
                      {language === 'mr' ? QUIZ_QUESTIONS[quizStep].q_mr : QUIZ_QUESTIONS[quizStep].q_en}
                    </h5>
                  </div>

                  <div className="space-y-3">
                    {QUIZ_QUESTIONS[quizStep].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(opt.trade)}
                        className="w-full text-left p-4 bg-white hover:bg-[#F0F6FF] border border-[#E6ECF3] hover:border-[#1557C0] rounded-2xl text-xs sm:text-sm font-bold text-[#172033] transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                      >
                        <span>{language === 'mr' ? opt.text_mr : opt.text_en}</span>
                        <span className="material-symbols-outlined text-[#1557C0] group-hover:translate-x-1 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-[#FFD21F] rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-lg">
                  <div className="w-16 h-16 bg-[#FFD21F]/20 text-[#002760] rounded-2xl flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-3xl">emoji_events</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      ✓ Recommended Trade
                    </span>
                    <h4 className="font-['Manrope'] text-2xl font-black text-[#002760]">
                      {quizResult} Trade
                    </h4>
                    <p className="text-xs text-[#172033]/70 max-w-md mx-auto">
                      Based on your preferences, <strong>{quizResult}</strong> offers you the strongest career scope, practical earning opportunities, and Govt certification.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => onOpenEnquiry(quizResult)}
                      className="w-full sm:w-auto px-6 py-3 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                    >
                      Apply for {quizResult} Admission →
                    </button>
                    <button
                      onClick={resetQuiz}
                      className="w-full sm:w-auto px-6 py-3 bg-[#F4F8FD] hover:bg-[#E6ECF3] text-[#002760] font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Retake Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FEE & EMI CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                  Course Fee & Affordable Installment Calculator
                </h4>
                <p className="text-xs text-[#172033]/70">
                  Calculate 10% lump sum payment discount or easy 3 to 6-month zero-stress installment breakdown.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Selector */}
                <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-5 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#172033]/80 uppercase block mb-1.5">
                      Select Vocational Trade
                    </label>
                    <select
                      value={calcCourseIdx}
                      onChange={(e) => setCalcCourseIdx(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-[#CBD5E1] rounded-xl text-xs font-bold text-[#002760]"
                    >
                      {COURSES.map((c, i) => (
                        <option key={c.id} value={i}>
                          {c.name} ({c.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#172033]/80 uppercase block mb-1.5">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setCalcPlan('lumpsum')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          calcPlan === 'lumpsum'
                            ? 'bg-[#002760] text-white border-[#002760]'
                            : 'bg-white text-[#172033] border-[#CBD5E1]'
                        }`}
                      >
                        Lump Sum (10% Off)
                      </button>
                      <button
                        onClick={() => setCalcPlan('emi3')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          calcPlan === 'emi3'
                            ? 'bg-[#002760] text-white border-[#002760]'
                            : 'bg-white text-[#172033] border-[#CBD5E1]'
                        }`}
                      >
                        3 Easy EMIs
                      </button>
                      <button
                        onClick={() => setCalcPlan('emi6')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          calcPlan === 'emi6'
                            ? 'bg-[#002760] text-white border-[#002760]'
                            : 'bg-white text-[#172033] border-[#CBD5E1]'
                        }`}
                      >
                        6 Easy EMIs
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calculation Summary */}
                <div className="bg-white border border-[#E6ECF3] rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs pb-3 border-b border-[#E6ECF3]">
                      <span className="text-[#172033]/60">Standard Course Fee:</span>
                      <span className="font-bold text-[#172033]">₹{baseFee.toLocaleString('en-IN')}</span>
                    </div>

                    {calcPlan === 'lumpsum' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs text-emerald-600 font-bold">
                          <span>10% One-time Discount:</span>
                          <span>- ₹{(baseFee * 0.1).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider">
                            Total Payable (Lump Sum)
                          </span>
                          <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-emerald-900 mt-1">
                            ₹{lumpSumFee.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-4 bg-[#F0F6FF] rounded-2xl border border-[#CBD5E1]">
                          <span className="text-[10px] font-extrabold uppercase text-[#1557C0] tracking-wider">
                            Monthly Installment ({calcPlan === 'emi3' ? '3 Months' : '6 Months'})
                          </span>
                          <div className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-1">
                            ₹{(calcPlan === 'emi3' ? emi3Month : emi6Month).toLocaleString('en-IN')} / month
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/919423488174?text=${encodeURIComponent(`नमस्कार! मला ${selectedCalcCourse.name} ट्रेडच्या फी स्ट्रक्चरबद्दल आणि हप्त्यांबद्दल चौकशी करायची आहे.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    Get WhatsApp Fee Breakdown Quote
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXAM & VERIFY */}
          {activeTab === 'exams' && (
            <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#1557C0]/10 text-[#1557C0] rounded-2xl flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div>
                <h4 className="font-['Manrope'] text-xl font-bold text-[#002760]">
                  Official Certificate Verification Portal
                </h4>
                <p className="text-xs text-[#172033]/70 max-w-md mx-auto mt-1">
                  Every student completing training receives a Govt recognized QR-coded certificate verified in real-time.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenVerifyPage) onOpenVerifyPage();
                }}
                className="px-6 py-3 bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                Open Certificate Verification Center
              </button>
            </div>
          )}

          {/* TAB 6: PLACEMENTS */}
          {activeTab === 'placements' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                  Alumni Placement Support & Industry Tie-ups
                </h4>
                <p className="text-xs text-[#172033]/70">
                  Our students work with Mahavitaran (MSEDCL), L&T, Jio Fiber, MIDC industries, and successful electrical contracting firms.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Rahul Patil', trade: 'Electrician', company: 'Mahavitaran (MSEDCL)', salary: '₹22,000 / mo' },
                  { name: 'Kiran Sonawane', trade: 'COPA', company: 'District Collector Office IT', salary: '₹18,500 / mo' },
                  { name: 'Vikas Mahajan', trade: 'Solar Technician', company: 'Tata Power Solar Rooftop', salary: '₹25,000 / mo' },
                  { name: 'Sanjay Chaudhari', trade: 'RAC & Inverter AC', company: 'Voltas Authorised Centre', salary: '₹20,000 / mo' },
                  { name: 'Pooja Shinde', trade: 'COPA & Tally', company: 'Jalgaon Merchant Co-op Bank', salary: '₹19,000 / mo' },
                  { name: 'Ganesh More', trade: 'Electrician', company: 'Supreme Industries MIDC', salary: '₹24,000 / mo' },
                ].map((alm, i) => (
                  <div key={i} className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-2xl p-3.5 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#002760]">{alm.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        {alm.salary}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#172033]/80 font-semibold">{alm.trade} Trade</p>
                    <p className="text-[11px] text-[#1557C0] font-medium">{alm.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: HELPDESK */}
          {activeTab === 'helpdesk' && (
            <div className="bg-[#F8FAFC] border border-[#E6ECF3] rounded-3xl p-6 space-y-4">
              <h4 className="font-['Manrope'] text-lg font-bold text-[#002760]">
                Student Helpdesk & Academic Counseling
              </h4>
              <p className="text-xs text-[#172033]/70">
                Facing difficulty in batch timings, exam registration, syllabus notes, or placement assistance?
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-4 rounded-2xl border border-[#E6ECF3] space-y-1">
                  <span className="font-bold text-[#002760] block">Helpline Phone</span>
                  <a href="tel:+919423488174" className="text-[#1557C0] font-bold block text-sm">
                    +91 94234 88174
                  </a>
                  <span className="text-[#172033]/60 text-[11px]">Available Mon–Sat: 8:00 AM – 7:00 PM</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#E6ECF3] space-y-1">
                  <span className="font-bold text-[#002760] block">Campus Address</span>
                  <p className="text-[#172033]/80 text-[11px]">
                    First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
