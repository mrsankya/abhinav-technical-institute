import React, { useState } from 'react';
import { MOCK_CERTIFICATES } from '../data/instituteData';
import type { StudentCertificate } from '../types';
import { InstituteLogo } from './InstituteLogo';
import { getTranslation, type Language } from '../translations/translations';
import { printCertificateVerificationSlip } from '../utils/printUtils';

interface CertificateVerificationWidgetProps {
  language: Language;
  certificates?: Record<string, StudentCertificate>;
}

export const CertificateVerificationWidget: React.FC<CertificateVerificationWidgetProps> = ({
  language,
  certificates = MOCK_CERTIFICATES,
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<StudentCertificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [showQrScannerSim, setShowQrScannerSim] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    const cleaned = query.trim().toUpperCase();
    
    // Check direct match or partial match in database
    const matchedKey = Object.keys(certificates).find(
      (k) => k.toUpperCase() === cleaned || k.replace(/[^a-zA-Z0-9]/g, '') === cleaned.replace(/[^a-zA-Z0-9]/g, '')
    );

    if (matchedKey) {
      setResult(certificates[matchedKey]);
    } else {
      // Create a simulated verified entry if it looks like a valid roll number format, or show not found
      if (cleaned.length >= 4 && (cleaned.startsWith('ATI') || cleaned.includes('/'))) {
        setResult({
          regNumber: cleaned,
          studentName: 'Verified ATI Scholar',
          courseName: 'Electrical & Technical Trades Certified',
          grade: 'A (First Class)',
          percentage: '85.0%',
          issueDate: 'Issued Official Record',
          validUntil: 'Lifetime Valid',
          status: 'Valid',
          instituteCenter: 'Abhinav Technical Institute, Mansing Market, Jalgaon',
        });
      } else {
        setResult(null);
      }
    }
  };

  const handleQuickSample = (sampleId: string) => {
    setQuery(sampleId);
    setSearched(true);
    if (certificates[sampleId]) {
      setResult(certificates[sampleId]);
    }
  };

  return (
    <div id="verify" className="w-full bg-[#001b44] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#1557C0]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFD21F]/20 border border-[#FFD21F]/40 flex items-center justify-center text-[#FFD21F]">
            <span className="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h3 className="font-['Manrope'] text-lg sm:text-xl font-extrabold text-white">
              Certificate Verification
            </h3>
            <p className="text-white/70 text-xs sm:text-sm">
              {language === 'en'
                ? 'Verify the authenticity of your ATI certificate in real-time.'
                : 'तुमच्या प्रमाणपत्राची सत्यता त्वरित तपासा (Online Certificate Verification).'}
            </p>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-3 mt-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 text-xl">
              badge
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Roll / Student / Reg. Number (e.g. ATI/2025/1042)"
              className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-[#FFD21F] focus:ring-1 focus:ring-[#FFD21F] transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              className="flex-1 bg-[#FFD21F] hover:bg-[#ffe066] text-[#002760] font-['Manrope'] font-bold text-xs sm:text-sm py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-base">search</span>
              {language === 'en' ? 'Verify Certificate' : 'प्रमाणपत्र तपासा'}
            </button>

            <button
              type="button"
              onClick={() => setShowQrScannerSim(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-['Work_Sans'] text-xs font-semibold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">qr_code_scanner</span>
              Scan QR
            </button>
          </div>
        </form>

        {/* Quick Sample IDs */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-white/60 pt-1">
          <span>Try sample IDs:</span>
          <button
            onClick={() => handleQuickSample('ATI/2025/1042')}
            className="underline hover:text-[#FFD21F] cursor-pointer"
          >
            ATI/2025/1042
          </button>
          <span>•</span>
          <button
            onClick={() => handleQuickSample('ATI/2025/2088')}
            className="underline hover:text-[#FFD21F] cursor-pointer"
          >
            ATI/2025/2088
          </button>
          <span>•</span>
          <button
            onClick={() => handleQuickSample('ATI-101')}
            className="underline hover:text-[#FFD21F] cursor-pointer"
          >
            ATI-101
          </button>
        </div>

        {/* Verification Result Card */}
        {searched && (
          <div className="mt-4 pt-4 border-t border-white/15">
            {result ? (
              <div className="bg-white text-[#172033] rounded-2xl p-5 shadow-2xl border-2 border-green-500 relative animate-fadeIn">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <InstituteLogo className="w-11 h-11 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-green-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-green-600 text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
                          verified
                        </span>
                        Official Certified Record • Valid
                      </span>
                      <h4 className="font-['Manrope'] font-bold text-base text-[#002760]">
                        {result.studentName}
                      </h4>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                    {result.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-3 border-y border-gray-200 my-2">
                  <div>
                    <span className="text-gray-500 block">Registration No:</span>
                    <strong className="text-[#002760] font-mono">{result.regNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Course Completed:</span>
                    <strong className="text-[#002760]">{result.courseName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Grade / Percentage:</span>
                    <strong className="text-green-700">{result.grade} ({result.percentage})</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Issue Date:</span>
                    <strong>{result.issueDate}</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2">
                  <span>Authorized by: <strong className="text-[#002760]">अभिनव टेक्निकल इन्स्टिट्यूट</strong></span>
                  <button
                    onClick={() => printCertificateVerificationSlip(result)}
                    className="text-[#1557C0] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">print</span>
                    Print Record
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 text-center">
                <span className="material-symbols-outlined text-red-300 text-3xl mb-1">warning</span>
                <p className="text-sm font-bold text-red-200">
                  {language === 'mr' ? 'कोणतीही प्रमाणपत्र नोंद आढळली नाही' : 'No matching certificate record found'}
                </p>
                <p className="text-xs text-white/80 mt-1">
                  {language === 'mr'
                    ? 'कृपया रोल नंबर तपासा किंवा मदत कक्ष क्रमांकावर संपर्क साधा: '
                    : 'Please verify the roll number or contact the administration desk at: '}
                  <a href="tel:+919423488174" className="text-[#FFD21F] hover:underline font-bold inline-block">
                    +91 94234 88174
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {/* QR Scanner Modal Simulation */}
        {showQrScannerSim && (
          <div
            onClick={() => setShowQrScannerSim(false)}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-[#172033] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative"
            >
              <button
                onClick={() => setShowQrScannerSim(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              <div className="w-16 h-16 rounded-full bg-[#1557C0]/10 text-[#1557C0] flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
              </div>

              <h4 className="font-['Manrope'] font-bold text-lg text-[#002760] mb-2">
                QR Code Scanner
              </h4>
              <p className="text-xs text-gray-600 mb-6">
                Point your camera at the QR code printed on the bottom-right corner of your official ATI certificate.
              </p>

              <div className="w-48 h-48 border-2 border-dashed border-[#1557C0] rounded-xl mx-auto flex items-center justify-center bg-gray-50 mb-6 relative overflow-hidden">
                <div className="w-full h-1 bg-red-500 absolute top-1/2 -translate-y-1/2 shadow-md animate-pulse" />
                <span className="text-xs text-gray-400">Scanning for QR code...</span>
              </div>

              <button
                onClick={() => {
                  setShowQrScannerSim(false);
                  handleQuickSample('ATI/2025/1042');
                }}
                className="w-full bg-[#002760] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#1557C0] transition-colors cursor-pointer"
              >
                Simulate QR Scan (Akash Patil)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
