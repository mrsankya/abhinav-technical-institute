import React, { useState } from 'react';
import { Language, getTranslation } from '../translations/translations';
import { GOVERNMENT_GR_LIST, GovernmentGrItem } from '../data/grData';

interface GovernmentGrPageProps {
  language: Language;
  onNavigateHome: () => void;
  onOpenEnquiry: () => void;
}

export const GovernmentGrPage: React.FC<GovernmentGrPageProps> = ({
  language,
  onNavigateHome,
  onOpenEnquiry,
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [selectedGr, setSelectedGr] = useState<GovernmentGrItem | null>(null);

  const handleOpenPdfInNewTab = (pdfPath: string) => {
    window.open(pdfPath, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#172033] min-h-screen">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1557C0] hover:text-[#002760] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{language === 'en' ? 'Back to Home' : 'मुख्यपृष्ठावर परत जा'}</span>
          </button>

          <h1 className="font-['Manrope'] text-base sm:text-lg font-black text-[#002760]">
            {language === 'en' ? 'Government Resolutions & Official Orders' : 'शासन निर्णय व अधिकृत मान्यतापत्रे (Govt. GRs)'}
          </h1>

          <button
            onClick={onOpenEnquiry}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#002760] bg-[#FFD21F] hover:bg-[#f0c20f] px-3.5 sm:px-4 py-1.5 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>{language === 'en' ? 'Enquire Now' : 'चौकशी करा'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        
        {/* Section Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-[#1557C0] tracking-widest bg-[#1557C0]/10 px-3 py-1 rounded-full inline-block mb-1">
              Official Institutional Document Portal
            </span>
            <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760]">
              {language === 'en' ? 'Verified Government Resolutions (GR)' : 'अधिकृत महाराष्ट्र शासन निर्णय व आदेश यादी'}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] font-medium">
              {language === 'en'
                ? 'Official Maharashtra Government Resolutions approving trade equivalencies, diploma certifications, DVET affiliations, and job recruitments.'
                : 'अभिनव टेक्निकल इन्स्टिट्यूटच्या अभ्यासक्रमांना १२ वी समकक्षता, पदविका मान्यता, DVET संलग्नता व नोकरी पात्रतेसाठी प्राप्त झालेले सर्व अधिकृत शासन निर्णय (GR).'}
            </p>
          </div>

          <div className="shrink-0 bg-[#F1F5F9] px-4 py-2.5 rounded-2xl border border-[#E2E8F0] text-center">
            <span className="text-xl font-black text-[#002760] block">{GOVERNMENT_GR_LIST.length}</span>
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Official GR Documents</span>
          </div>
        </div>

        {/* GR Cards List */}
        <section className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {GOVERNMENT_GR_LIST.map((gr) => (
              <div
                key={gr.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 group hover:border-[#1557C0]/40 relative overflow-hidden"
              >
                {/* Visual Indicator Strip */}
                <div className="w-1.5 absolute left-0 top-0 bottom-0 bg-[#002760] group-hover:bg-[#1557C0] transition-colors" />

                <div className="space-y-3 flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${gr.badgeColor}`}>
                      {gr.status}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#002760] bg-[#F1F5F9] px-2.5 py-0.5 rounded border border-[#E2E8F0]">
                      {gr.number}
                    </span>
                    {gr.codeNumber && (
                      <span className="text-[11px] font-mono text-gray-500 font-medium">
                        सांकेतांक: {gr.codeNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="font-['Manrope'] text-lg sm:text-xl font-black text-[#002760] group-hover:text-[#1557C0] transition-colors leading-snug">
                    {language === 'en' ? gr.titleEn : gr.titleMr}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#1557C0]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">account_balance</span>
                      <span>{language === 'en' ? gr.deptEn : gr.deptMr}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-gray-500 font-normal">
                      <span className="material-symbols-outlined text-sm text-gray-400">calendar_today</span>
                      <span>{gr.date}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {language === 'en' ? gr.summaryEn : gr.summaryMr}
                  </p>
                </div>

                {/* PDF Action Buttons */}
                <div className="shrink-0 flex flex-wrap items-center gap-3 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F1F5F9]">
                  <button
                    onClick={() => setSelectedGr(gr)}
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#002760] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>Details</span>
                  </button>

                  <a
                    href={gr.pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 bg-[#002760] hover:bg-[#1557C0] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer group/btn"
                  >
                    <span className="material-symbols-outlined text-base group-hover/btn:scale-110 transition-transform">picture_as_pdf</span>
                    <span>{language === 'en' ? 'View GR (PDF)' : 'GR पहा (PDF)'}</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>

                  <a
                    href={gr.pdfPath}
                    download
                    className="inline-flex items-center justify-center w-10 h-10 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1557C0] rounded-xl border border-[#BFDBFE] transition-colors cursor-pointer"
                    title="Download Original PDF"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Modal for GR Detail View & Quick PDF Link */}
      {selectedGr && (
        <div
          onClick={() => setSelectedGr(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#E2E8F0] relative animate-fadeIn"
          >
            <button
              onClick={() => setSelectedGr(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1557C0] uppercase tracking-wider bg-[#1557C0]/10 px-3 py-1 rounded-full">
                {selectedGr.number}
              </span>
              <h3 className="font-['Manrope'] text-xl font-black text-[#002760] pt-1">
                {language === 'en' ? selectedGr.titleEn : selectedGr.titleMr}
              </h3>
              <p className="text-xs text-gray-500 font-semibold">{selectedGr.date}</p>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] text-xs leading-relaxed space-y-2 text-[#334155]">
              <p><strong>Department / Authority:</strong> {language === 'en' ? selectedGr.deptEn : selectedGr.deptMr}</p>
              {selectedGr.codeNumber && <p><strong>Computer Code No:</strong> {selectedGr.codeNumber}</p>}
              <p><strong>Summary:</strong> {language === 'en' ? selectedGr.summaryEn : selectedGr.summaryMr}</p>
              <p><strong>Document File:</strong> <span className="font-mono text-[#1557C0]">{selectedGr.pdfPath}</span></p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedGr(null)}
                className="bg-gray-100 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => handleOpenPdfInNewTab(selectedGr.pdfPath)}
                className="bg-[#002760] hover:bg-[#1557C0] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">picture_as_pdf</span>
                <span>Open PDF Document in New Tab</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
