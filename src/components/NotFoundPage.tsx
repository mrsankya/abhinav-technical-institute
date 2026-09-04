import React from 'react';
import { InstituteLogo } from './InstituteLogo';
import type { Language } from '../translations/translations';

interface NotFoundPageProps {
  language: Language;
  onNavigateHome: () => void;
  onExploreCourses: () => void;
  onOpenCertificateVerify: () => void;
  onOpenGovernmentGr: () => void;
  onOpenEnquiry: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  language,
  onNavigateHome,
  onExploreCourses,
  onOpenCertificateVerify,
  onOpenGovernmentGr,
  onOpenEnquiry,
}) => {
  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col justify-between text-[#172033]">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <InstituteLogo className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform drop-shadow-xs" />
            <div className="flex flex-col">
              <span className="font-['Manrope','Yantramanav',sans-serif] text-sm sm:text-base font-black text-[#002760] leading-tight">
                {language === 'en'
                  ? 'Abhinav Technical Institute'
                  : language === 'hi'
                  ? 'अभिनव टेक्निकल इंस्टीट्यूट'
                  : 'अभिनव टेक्निकल इन्स्टिट्यूट'}
              </span>
              <span className="text-[10px] font-bold text-[#1557C0]">Jalgaon, Maharashtra</span>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1557C0] hover:text-[#002760] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">home</span>
            <span>{language === 'mr' ? 'मुख्यपृष्ठ' : 'Home'}</span>
          </button>
        </div>
      </div>

      {/* Main 404 Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center bg-white rounded-3xl p-8 sm:p-14 border border-[#E2E8F0] shadow-xl space-y-6 relative overflow-hidden animate-fadeIn">
          {/* Background Decorative Gradient Circle */}
          <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-[#FFD21F]/15 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-[#1557C0]/10 blur-2xl pointer-events-none" />

          {/* 404 Large Number & Badge */}
          <div className="relative">
            <div className="text-7xl sm:text-9xl font-black text-[#002760]/10 font-['Manrope'] tracking-tighter select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#002760] text-[#FFD21F] flex items-center justify-center shadow-xl border-4 border-white">
                <span className="material-symbols-outlined text-4xl sm:text-5xl">error_outline</span>
              </div>
            </div>
          </div>

          {/* Title & Message */}
          <div className="space-y-2 pt-2">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#E61932] bg-[#E61932]/10 px-3.5 py-1 rounded-full">
              404 • Page Not Found
            </span>
            <h1 className="font-['Manrope'] text-2xl sm:text-4xl font-black text-[#002760]">
              {language === 'mr'
                ? 'हे पृष्ठ सापडले नाही!'
                : language === 'hi'
                ? 'यह पृष्ठ उपलब्ध नहीं है!'
                : 'Oops! Page Not Found'}
            </h1>
            <p className="font-['Work_Sans'] text-xs sm:text-base text-[#64748B] max-w-lg mx-auto leading-relaxed">
              {language === 'mr'
                ? 'तुम्ही शोधत असलेले पान काढून टाकले असावे, त्याचे नाव बदलले असावे किंवा तात्पुरते अनुपलब्ध असावे.'
                : language === 'hi'
                ? 'आप जिस पृष्ठ को ढूंढ रहे हैं वह मौजूद नहीं है या उसका पता बदल गया है।'
                : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
            </p>
          </div>

          {/* Quick Navigation Action Grid */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            <button
              onClick={onNavigateHome}
              className="w-full bg-[#002760] hover:bg-[#1557C0] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">home</span>
              <span>{language === 'mr' ? 'मुख्यपृष्ठावर जा' : 'Go to Homepage'}</span>
            </button>

            <button
              onClick={onExploreCourses}
              className="w-full bg-[#FFD21F] hover:bg-[#f0c20f] text-[#002760] font-black py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_stories</span>
              <span>{language === 'mr' ? 'कोर्सेस व बॅचेस पहा' : 'Explore Courses'}</span>
            </button>

            <button
              onClick={onOpenCertificateVerify}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">verified_user</span>
              <span>{language === 'mr' ? 'प्रमाणपत्र पडताळणी' : 'Verify Certificate'}</span>
            </button>

            <button
              onClick={onOpenGovernmentGr}
              className="w-full bg-blue-50 hover:bg-blue-100 text-[#1557C0] border border-blue-200 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">verified</span>
              <span>{language === 'mr' ? 'शासन निर्णय (Govt. GRs)' : 'Government GRs'}</span>
            </button>
          </div>

          {/* Contact Support Footer Box */}
          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#64748B]">
            <span>Need Help?</span>
            <div className="flex items-center gap-3">
              <a
                href="tel:+919423488174"
                className="inline-flex items-center gap-1 font-bold text-[#1557C0] hover:underline"
                title="Call Helpline"
              >
                <span className="material-symbols-outlined text-[16px]">call</span>
                <span>+91 94234 88174</span>
              </a>
              <span>•</span>
              <a
                href="mailto:info@abhinav-institute.in"
                className="inline-flex items-center gap-1 font-bold text-[#1557C0] hover:underline"
                title="Send Email"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
                <span>info@abhinav-institute.in</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Bottom Copyright Bar */}
      <div className="bg-[#002760] text-white/70 py-4 text-center text-xs border-t border-white/10">
        <p>© 1999–2026 Abhinav Technical Institute, Jalgaon. All Rights Reserved.</p>
      </div>
    </div>
  );
};
