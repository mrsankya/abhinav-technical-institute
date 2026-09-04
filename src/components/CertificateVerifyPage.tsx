import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getTranslation, type Language } from '../translations/translations';
import { InstituteLogo } from './InstituteLogo';
import type { StudentCertificate } from '../types';
import { getCertificateById, fetchCertificates } from '../services/api';
import { printCertificateVerificationSlip } from '../utils/printUtils';
import { EmptyState } from './EmptyState';

interface CertificateVerifyPageProps {
  language: Language;
  initialId?: string;
  onNavigateHome: () => void;
  onOpenEnquiry: () => void;
}

export const CertificateVerifyPage: React.FC<CertificateVerifyPageProps> = ({
  language,
  initialId = '',
  onNavigateHome,
  onOpenEnquiry,
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [query, setQuery] = useState(initialId);
  const [result, setResult] = useState<StudentCertificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const performLookup = async (certId: string) => {
    if (!certId.trim()) return;
    setLoading(true);
    setSearched(true);
    const cleaned = certId.trim().toUpperCase();

    const cert = await getCertificateById(cleaned);
    if (cert) {
      setResult(cert);
      const verifyUrl = `${window.location.origin}/#verify?id=${encodeURIComponent(cert.regNumber)}`;
      QRCode.toDataURL(verifyUrl, { width: 160, margin: 1 })
        .then((url) => setQrCodeDataUrl(url))
        .catch(() => {});
    } else {
      setResult(null);
      setQrCodeDataUrl('');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialId) {
      setQuery(initialId);
      performLookup(initialId);
    }
  }, [initialId]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performLookup(query);
  };

  const handleSampleClick = (sampleId: string) => {
    setQuery(sampleId);
    performLookup(sampleId);
  };

  const handlePrintSlip = () => {
    if (result) {
      printCertificateVerificationSlip(result, qrCodeDataUrl);
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] text-[#172033] min-h-screen">
      {/* Top Header Navigation */}
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
            {language === 'en' ? 'Certificate Verification Portal' : 'ऑनलाइन प्रमाणपत्र पडताळणी केंद्र'}
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

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Verification Input Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase text-[#1557C0] tracking-widest bg-[#1557C0]/10 px-3.5 py-1 rounded-full">
              Real-time Verification
            </span>
            <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760]">
              {language === 'en' ? 'Verify ATI Student Credentials' : 'प्रमाणपत्राची सत्यता आत्ताच तपासा'}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              {language === 'en'
                ? 'Enter Student Roll Number / Registration ID or Scan QR Code printed on the certificate.'
                : 'तुमचा रोल नंबर / रजिस्ट्रेशन आयडी टाका किंवा प्रमाणपत्रावरील QR कोड स्कॅन करा.'}
            </p>
          </div>

          <form onSubmit={handleVerify} className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                badge
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Roll / Reg. Number (e.g. ATI-2024-884920)"
                className="w-full bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl pl-12 pr-4 py-4 text-[#002760] font-bold text-sm sm:text-base placeholder:text-gray-400 focus:outline-none focus:border-[#1557C0] transition-all uppercase"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#002760] hover:bg-[#1557C0] text-white font-['Manrope'] font-extrabold text-sm py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">search</span>
                {loading
                  ? 'Searching Registry...'
                  : language === 'en'
                  ? 'Verify Record'
                  : 'प्रमाणपत्र शोधा व तपासा'}
              </button>

              <button
                type="button"
                onClick={() => setShowQrScanner(true)}
                className="bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1557C0] border border-[#BFDBFE] font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                <span>Scan QR Code</span>
              </button>
            </div>

            {/* Quick Sample IDs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-gray-500">
              <span className="font-semibold">Sample Records to Test:</span>
              {['ATI-2024-884920', 'ATI-2024-419203', 'ATI-2025-103984'].map((sampleId) => (
                <button
                  key={sampleId}
                  type="button"
                  onClick={() => handleSampleClick(sampleId)}
                  className="bg-gray-100 hover:bg-gray-200 text-[#002760] font-mono font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                >
                  {sampleId}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* QR Scanner Modal Simulator */}
        {showQrScanner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-['Manrope'] font-bold text-[#002760]">Scan Certificate QR</h4>
                <button
                  onClick={() => setShowQrScanner(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              <div className="border-2 border-dashed border-[#1557C0] rounded-2xl p-8 bg-[#F4F8FD] space-y-3">
                <span className="material-symbols-outlined text-5xl text-[#1557C0] animate-pulse">
                  qr_code_scanner
                </span>
                <p className="text-xs text-[#172033]/70">
                  Align the certificate QR code in front of camera or select sample to verify.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowQrScanner(false);
                  handleSampleClick('ATI-2024-884920');
                }}
                className="w-full py-2.5 bg-[#002760] text-white text-xs font-bold rounded-xl"
              >
                Simulate Scan: ATI-2024-884920
              </button>
            </div>
          </div>
        )}

        {/* Verification Result Section */}
        {searched && (
          <div className="animate-fadeIn">
            {result ? (
              <div className="bg-white rounded-3xl border-2 border-emerald-500 shadow-2xl overflow-hidden">
                {/* Status Bar */}
                <div className="bg-emerald-600 text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl bg-white/20 p-1.5 rounded-full">
                      check_circle
                    </span>
                    <div>
                      <h3 className="font-['Manrope'] font-black text-lg">
                        OFFICIAL CERTIFICATE VERIFIED & VALID
                      </h3>
                      <p className="text-xs text-white/90">
                        Authenticated from Abhinav Technical Institute Institutional Registry.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handlePrintSlip}
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-emerald-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-base">print</span>
                    Print Official Slip
                  </button>
                </div>

                {/* Certificate Details */}
                <div className="p-6 sm:p-10 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-[#E2E8F0] pb-6">
                    <div className="flex items-center gap-4">
                      <InstituteLogo className="w-16 h-16 shrink-0" />
                      <div>
                        <span className="text-xs font-mono font-bold text-[#1557C0] uppercase tracking-wider">
                          Registration ID: {result.regNumber}
                        </span>
                        <h2 className="font-['Manrope'] text-2xl sm:text-3xl font-black text-[#002760] mt-0.5">
                          {result.studentName}
                        </h2>
                        <p className="text-xs text-[#64748B]">{result.instituteCenter}</p>
                      </div>
                    </div>

                    {qrCodeDataUrl && (
                      <div className="bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] flex items-center gap-3 self-center md:self-auto">
                        <img src={qrCodeDataUrl} alt="Security QR" className="w-20 h-20" />
                        <div className="text-left text-[11px] text-[#64748B] max-w-[130px]">
                          <span className="font-bold text-emerald-600 block">✓ Digital Seal</span>
                          Scanned & verified on institutional blockchain record.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Completed Trade
                      </span>
                      <span className="font-['Manrope'] font-bold text-sm sm:text-base text-[#002760]">
                        {result.courseName}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Performance Grade
                      </span>
                      <span className="font-['Manrope'] font-black text-sm sm:text-base text-emerald-700">
                        {result.grade}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Percentage / Score
                      </span>
                      <span className="font-['Manrope'] font-bold text-sm sm:text-base text-[#002760]">
                        {result.percentage}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Date of Issue
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-[#002760]">
                        {result.issueDate}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Validity Status
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-emerald-600">
                        {result.validUntil || 'Lifetime Valid'}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                      <span className="text-xs font-bold text-[#64748B] block mb-1">
                        Institute Verification
                      </span>
                      <span className="font-bold text-xs text-[#1557C0]">
                        Govt. Reg. ISO 9001:2015
                      </span>
                    </div>
                  </div>

                  {/* Institution Disclaimer Footnote */}
                  <div className="p-4 bg-[#F1F5F9] rounded-2xl text-xs text-[#64748B] flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#1557C0]">info</span>
                    <span>
                      This verification slip is electronically generated and authenticated against the official records of Abhinav Technical Institute, Navi Peth, Jalgaon, Maharashtra.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon="badge"
                title="No Matching Certificate Found"
                titleMr="कोणतीही प्रमाणपत्र नोंद आढळली नाही"
                description={`No certificate matching ID "${query}" was found in our registry. Please check the roll number or contact the administration desk at +91 94234 88174.`}
                descriptionMr={`"${query}" या क्रमांकाचे कोणतेही प्रमाणपत्र रेकॉर्ड सापडले नाही. कृपया क्रमांक तपासून पुन्हा प्रयत्न करा किंवा मदत कक्षाशी संपर्क साधा.`}
                language={language}
                primaryActionLabel="Try Sample ID (ATI-2024-884920)"
                primaryActionLabelMr="नमुना आयडी तपासा (ATI-2024-884920)"
                onPrimaryAction={() => handleSampleClick('ATI-2024-884920')}
                secondaryActionLabel="Call Helpline (+91 94234 88174)"
                secondaryActionLabelMr="मदत कक्ष कॉल (+91 94234 88174)"
                onSecondaryAction={() => {
                  window.location.href = 'tel:+919423488174';
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
