import React, { useState } from 'react';
import type { Course, Announcement, Review } from '../types';
import { COURSES } from '../data/instituteData';
import { getTranslation, type Language } from '../translations/translations';

interface ModalsProps {
  // Enquiry
  isEnquiryOpen: boolean;
  onCloseEnquiry: () => void;
  selectedCourseForEnquiry?: string;
  onAddEnquiry?: (enquiry: {
    id: string;
    name: string;
    phone: string;
    email: string;
    course: string;
    qualification: string;
    message?: string;
    date: string;
    status: 'New' | 'Contacted' | 'Enrolled';
  }) => void;

  // Course Details
  selectedCourse: Course | null;
  onCloseCourseModal: () => void;
  onApplyForCourse: (courseName: string) => void;

  // Announcement
  selectedAnnouncement: Announcement | null;
  onCloseAnnouncementModal: () => void;

  // Write Review
  isWriteReviewOpen: boolean;
  onCloseWriteReview: () => void;
  onSubmitReview: (newReview: Partial<Review>) => void;

  // All Reviews
  isAllReviewsOpen: boolean;
  onCloseAllReviews: () => void;
  allReviews: Review[];

  language: Language;
}

export const Modals: React.FC<ModalsProps> = ({
  isEnquiryOpen,
  onCloseEnquiry,
  selectedCourseForEnquiry,
  selectedCourse,
  onCloseCourseModal,
  onApplyForCourse,
  selectedAnnouncement,
  onCloseAnnouncementModal,
  isWriteReviewOpen,
  onCloseWriteReview,
  onSubmitReview,
  isAllReviewsOpen,
  onCloseAllReviews,
  allReviews,
  language,
  onAddEnquiry,
}) => {
  const t = (key: string) => getTranslation(key, language);

  // Enquiry state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    course: selectedCourseForEnquiry || 'Electrician',
    qualification: '10th Passed',
    message: '',
  });
  const [enquiryErrors, setEnquiryErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [whatsappRedirectUrl, setWhatsappRedirectUrl] = useState('');

  // Review state
  const [reviewForm, setReviewForm] = useState({
    name: '',
    course: 'Electrician',
    rating: 5,
    comment: '',
    category: 'Practical Training' as const,
  });
  const [reviewErrors, setReviewErrors] = useState<{ name?: string; comment?: string }>({});
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const validateEnquiry = () => {
    const errors: { name?: string; phone?: string; email?: string } = {};
    const trimmedName = enquiryForm.name.trim();
    const cleanPhone = enquiryForm.phone.replace(/\D/g, '');

    if (!trimmedName) {
      errors.name = language === 'mr' ? 'कृपया आपले पूर्ण नाव प्रविष्ट करा.' : 'Please enter your full name.';
    } else if (trimmedName.length < 3) {
      errors.name = language === 'mr' ? 'नाव किमान ३ अक्षरांचे असणे आवश्यक आहे.' : 'Name must be at least 3 characters.';
    }

    if (!cleanPhone) {
      errors.phone = language === 'mr' ? 'कृपया १० अंकी मोबाईल नंबर प्रविष्ट करा.' : 'Please enter 10-digit mobile number.';
    } else if (cleanPhone.length < 10) {
      errors.phone = language === 'mr' ? 'मोबाईल नंबर किमान १० अंकांचा असावा.' : 'Phone number must be at least 10 digits.';
    }

    if (enquiryForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiryForm.email.trim())) {
      errors.email = language === 'mr' ? 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.' : 'Please enter a valid email address.';
    }

    setEnquiryErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEnquiry()) {
      return;
    }

    const studentName = enquiryForm.name.trim();
    const studentPhone = enquiryForm.phone.trim();
    const targetCourse = enquiryForm.course || 'Electrician';
    const qual = enquiryForm.qualification || '10th Passed';
    const userMsg = enquiryForm.message ? `\n💬 *संदेश / प्रश्न:* ${enquiryForm.message.trim()}` : '';

    const waText =
      language === 'mr'
        ? `🎓 *अभिनव टेक्निकल इन्स्टिट्यूट जळगाव — नवीन प्रवेश चौकशी*\n\n` +
          `👤 *विद्यार्थ्याचे नाव:* ${studentName}\n` +
          `📱 *मोबाईल नंबर:* ${studentPhone}\n` +
          `🛠️ *निवडलेला कोर्स / ट्रेड:* ${targetCourse}\n` +
          `📚 *शैक्षणिक पात्रता:* ${qual}` +
          `${userMsg}\n\n` +
          `नमस्कार सर, मला या कोर्सच्या प्रवेश प्रक्रिया, बॅच वेळ व फी सवलतीबद्दल माहिती हवी आहे.`
        : language === 'hi'
        ? `🎓 *अभिनव टेक्निकल इंस्टीट्यूट जलगांव — नया प्रवेश पूछताछ*\n\n` +
          `👤 *छात्र का नाम:* ${studentName}\n` +
          `📱 *मोबाइल नंबर:* ${studentPhone}\n` +
          `🛠️ *चुना गया ट्रेड:* ${targetCourse}\n` +
          `📚 *शैक्षणिक योग्यता:* ${qual}` +
          `${userMsg}\n\n` +
          `नमस्ते सर, मुझे इस कोर्स के एडमिशन और फीस के बारे में जानकारी चाहिए।`
        : `🎓 *Abhinav Technical Institute Jalgaon — New Admission Inquiry*\n\n` +
          `👤 *Student Name:* ${studentName}\n` +
          `📱 *Mobile Number:* ${studentPhone}\n` +
          `🛠️ *Target Trade / Course:* ${targetCourse}\n` +
          `📚 *Qualification:* ${qual}` +
          `${userMsg}\n\n` +
          `Hello, please provide details regarding course admission, syllabus, fee concession, and batch timings.`;

    const waUrl = `https://wa.me/919423488174?text=${encodeURIComponent(waText)}`;
    setWhatsappRedirectUrl(waUrl);

    if (onAddEnquiry) {
      onAddEnquiry({
        id: `lead-${Date.now()}`,
        name: studentName,
        phone: studentPhone || '+91 94234 88174',
        email: enquiryForm.email || 'applicant@gmail.com',
        course: targetCourse,
        qualification: qual,
        message: enquiryForm.message || 'Direct website WhatsApp inquiry',
        date: new Date().toLocaleDateString('en-GB'),
        status: 'New',
      });
    }

    setEnquirySubmitted(true);

    // Auto redirect to WhatsApp
    try {
      window.open(waUrl, '_blank');
    } catch {}
  };

  const validateReview = () => {
    const errors: { name?: string; comment?: string } = {};
    if (!reviewForm.name.trim()) {
      errors.name = language === 'mr' ? 'कृपया आपले नाव प्रविष्ट करा.' : 'Please enter your name.';
    }
    if (!reviewForm.comment.trim() || reviewForm.comment.trim().length < 8) {
      errors.comment = language === 'mr' ? 'कृपया किमान ८ अक्षरांचा अभिप्राय लिहा.' : 'Please write at least 8 characters feedback.';
    }
    setReviewErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReview()) return;

    onSubmitReview({
      name: reviewForm.name || 'Verified Student',
      course: reviewForm.course,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      category: reviewForm.category,
      date: 'Just now',
    });
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      onCloseWriteReview();
      setReviewForm({
        name: '',
        course: 'Electrician',
        rating: 5,
        comment: '',
        category: 'Practical Training',
      });
      setReviewErrors({});
    }, 1800);
  };

  return (
    <>
      {/* 1. Admission Enquiry Modal */}
      {isEnquiryOpen && (
        <div
          onClick={onCloseEnquiry}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-[#E6ECF3] my-8 animate-fadeIn"
          >
            <button
              onClick={onCloseEnquiry}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {enquirySubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: '"FILL" 1' }}>
                    check_circle
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Manrope'] text-2xl font-black text-[#002760]">
                    {language === 'mr' ? 'चौकशी यशस्वीरित्या नोंदवली!' : language === 'hi' ? 'पूछताछ दर्ज की गई!' : 'Inquiry Submitted!'}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {language === 'mr'
                      ? 'तुमची माहिती आमच्याकडे नोंदवली गेली आहे. त्वरित माहितीसाठी खालील बटणावर क्लिक करून व्हॉट्सअ‍ॅपवर कनेक्ट व्हा.'
                      : 'Your details have been saved. Click the button below to connect on WhatsApp directly.'}
                  </p>
                </div>

                {whatsappRedirectUrl && (
                  <a
                    href={whatsappRedirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl shadow-md transition-all hover:scale-102 cursor-pointer text-sm"
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.301-.15-1.781-.878-2.057-.978-.276-.101-.477-.15-.678.15-.2.3-.778.978-.954 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.787-1.68-2.088-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.632-.929-2.235-.245-.588-.493-.508-.678-.518l-.578-.01c-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.911 1.23 3.112.15.201 2.123 3.242 5.143 4.545.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.781-.728 2.032-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.04 2C6.495 2 2 6.495 2 12.04c0 1.77.462 3.5 1.341 5.024L2 22l5.098-1.338a10.005 10.005 0 0 0 4.942 1.304c5.545 0 10.04-4.495 10.04-10.04C22.08 6.495 17.585 2 12.04 2zm0 18.258a8.214 8.214 0 0 1-4.19-1.144l-.3-.178-3.114.817.831-3.036-.195-.311a8.204 8.204 0 0 1-1.258-4.366c0-4.542 3.698-8.24 8.24-8.24 4.542 0 8.24 3.698 8.24 8.24 0 4.542-3.698 8.24-8.24 8.24z"/>
                    </svg>
                    <span>{language === 'mr' ? 'व्हॉट्सअ‍ॅपवर मेसेज पाठवा' : language === 'hi' ? 'व्हाट्सएप पर चैट करें' : 'Open WhatsApp Chat'}</span>
                  </a>
                )}

                <button
                  onClick={() => {
                    setEnquirySubmitted(false);
                    onCloseEnquiry();
                  }}
                  className="text-xs text-gray-500 hover:text-gray-800 font-bold underline cursor-pointer mt-2 block mx-auto"
                >
                  {language === 'mr' ? 'खिडकी बंद करा' : 'Close Window'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#1557C0]/10 text-[#1557C0] flex items-center justify-center">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div>
                    <h3 className="font-['Manrope'] text-xl font-bold text-[#002760]">
                      {t('enquiry.title')}
                    </h3>
                    <p className="text-xs text-[#172033]/60">
                      {t('enquiry.subtitle')}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleEnquirySubmit} className="flex flex-col gap-3.5 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('enquiry.fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => {
                        setEnquiryForm({ ...enquiryForm, name: e.target.value });
                        if (enquiryErrors.name) setEnquiryErrors({ ...enquiryErrors, name: undefined });
                      }}
                      placeholder={t('enquiry.fullNamePlh')}
                      className={`w-full bg-[#F4F8FD] border rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none font-medium transition-all ${
                        enquiryErrors.name ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-[#CBD5E1] focus:border-[#1557C0]'
                      }`}
                    />
                    {enquiryErrors.name && (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">error</span>
                        <span>{enquiryErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#002760] mb-1">
                        {t('enquiry.phone')} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={enquiryForm.phone}
                        onChange={(e) => {
                          setEnquiryForm({ ...enquiryForm, phone: e.target.value });
                          if (enquiryErrors.phone) setEnquiryErrors({ ...enquiryErrors, phone: undefined });
                        }}
                        placeholder={t('enquiry.phonePlh')}
                        className={`w-full bg-[#F4F8FD] border rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none font-medium transition-all ${
                          enquiryErrors.phone ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-[#CBD5E1] focus:border-[#1557C0]'
                        }`}
                      />
                      {enquiryErrors.phone && (
                        <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">error</span>
                          <span>{enquiryErrors.phone}</span>
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#002760] mb-1">
                        {t('enquiry.course')}
                      </label>
                      <select
                        value={enquiryForm.course}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, course: e.target.value })}
                        className="w-full bg-[#F4F8FD] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-[#1557C0] font-bold text-[#002760]"
                      >
                        {COURSES.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('enquiry.qualification')}
                    </label>
                    <input
                      type="text"
                      value={enquiryForm.qualification}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, qualification: e.target.value })}
                      placeholder={t('enquiry.qualificationPlh')}
                      className="w-full bg-[#F4F8FD] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:border-[#1557C0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('enquiry.message')}
                    </label>
                    <textarea
                      rows={2}
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                      placeholder={t('enquiry.messagePlh')}
                      className="w-full bg-[#F4F8FD] border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none focus:border-[#1557C0]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 w-full bg-[#002760] hover:bg-[#1557C0] text-white font-['Manrope'] font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === 'mr' ? 'चौकशी अर्ज पाठवा (WhatsApp वर कनेक्ट करा)' : t('enquiry.submitBtn')}</span>
                    <span className="material-symbols-outlined text-sm">send</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Course Details Modal */}
      {selectedCourse && (
        <div
          onClick={onCloseCourseModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#E6ECF3] my-8 animate-fadeIn max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onCloseCourseModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors z-10"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="relative rounded-2xl overflow-hidden mb-5 aspect-[16/8] bg-gray-100">
              <img
                src={selectedCourse.image}
                alt={selectedCourse.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                <div>
                  <span className="bg-[#FFD21F] text-[#002760] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {selectedCourse.category}
                  </span>
                  <h3 className="font-['Manrope'] text-2xl font-bold text-white mt-1">
                    {language === 'hi' && selectedCourse.nameHi ? selectedCourse.nameHi : language === 'mr' && selectedCourse.nameMr ? selectedCourse.nameMr : selectedCourse.name}
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-[#172033]/80 text-sm leading-relaxed mb-6">
              {language === 'hi' && selectedCourse.fullDescriptionHi
                ? selectedCourse.fullDescriptionHi
                : language === 'mr' && selectedCourse.fullDescriptionMr
                ? selectedCourse.fullDescriptionMr
                : selectedCourse.fullDescription || selectedCourse.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F4F8FD] border border-[#E6ECF3] mb-6">
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('batches.duration')}</span>
                <strong className="text-xs sm:text-sm text-[#002760]">{selectedCourse.duration}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('batches.timing')}</span>
                <strong className="text-xs sm:text-sm text-[#002760]">{selectedCourse.timing}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('batches.startDate')}</span>
                <strong className="text-xs sm:text-sm text-[#1557C0]">{selectedCourse.startDate}</strong>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase block">{t('batches.eligibilityTitle')}</span>
                <strong className="text-xs sm:text-sm text-[#002760]">{selectedCourse.eligibility}</strong>
              </div>
            </div>

            {/* Subjects & Subject Codes (if available) */}
            {selectedCourse.subjects && selectedCourse.subjects.length > 0 && (
              <div className="mb-6">
                <h4 className="font-['Manrope'] font-bold text-base text-[#002760] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1557C0]">format_list_numbered</span>
                  <span>{language === 'mr' ? 'अभ्यासक्रम विषय व कोड (Subjects & Codes)' : 'Subjects & Examination Codes'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedCourse.subjects.map((subj, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <span className="font-semibold text-[#172033]">{subj.name}</span>
                      <span className="font-mono font-bold text-[11px] bg-[#002760] text-white px-2 py-0.5 rounded-md">
                        {subj.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Syllabus Modules */}
            {(((language === 'mr' && selectedCourse.syllabusMr && selectedCourse.syllabusMr.length > 0)
              ? selectedCourse.syllabusMr
              : selectedCourse.syllabus) || []).length > 0 && (
              <div className="mb-6">
                <h4 className="font-['Manrope'] font-bold text-base text-[#002760] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1557C0]">menu_book</span>
                  <span>{language === 'mr' ? 'अभ्यासक्रमाचे प्रमुख घटक (Syllabus Modules)' : t('batches.syllabusTitle')}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(((language === 'mr' && selectedCourse.syllabusMr && selectedCourse.syllabusMr.length > 0)
                    ? selectedCourse.syllabusMr
                    : selectedCourse.syllabus) || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#172033]/85 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100"
                    >
                      <span className="material-symbols-outlined text-[#1557C0] text-sm mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Opportunities & Jobs */}
            {(((language === 'mr' && selectedCourse.careerOpportunitiesMr && selectedCourse.careerOpportunitiesMr.length > 0)
              ? selectedCourse.careerOpportunitiesMr
              : selectedCourse.careerOpportunities) || []).length > 0 && (
              <div className="mb-6">
                <h4 className="font-['Manrope'] font-bold text-base text-[#002760] mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">work</span>
                  <span>{language === 'mr' ? 'रोजगार व करिअर संधी (Career & Job Scope)' : 'Career Opportunities & Jobs'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(((language === 'mr' && selectedCourse.careerOpportunitiesMr && selectedCourse.careerOpportunitiesMr.length > 0)
                    ? selectedCourse.careerOpportunitiesMr
                    : selectedCourse.careerOpportunities) || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#172033]/90 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200"
                    >
                      <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5 shrink-0">
                        verified
                      </span>
                      <span className="leading-snug font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#E6ECF3]">
              <a
                href={`https://wa.me/919423488174?text=${encodeURIComponent(`नमस्कार! मला ${selectedCourse.name} (${selectedCourse.code}) कोर्सच्या प्रवेशाबद्दल आणि बॅच वेळेबद्दल माहिती हवी आहे.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-['Manrope'] font-bold py-3.5 rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">chat</span>
                <span>WhatsApp वर विचारा</span>
              </a>
              <button
                onClick={() => {
                  onCloseCourseModal();
                  onApplyForCourse(selectedCourse.name);
                }}
                className="flex-1 bg-[#002760] hover:bg-[#1557C0] text-white font-['Manrope'] font-bold py-3.5 rounded-xl shadow-md transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'mr' ? 'प्रवेश अर्ज करा (Apply Now)' : t('batches.enrollBtn')}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Announcement Details Modal */}
      {selectedAnnouncement && (
        <div
          onClick={onCloseAnnouncementModal}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#E6ECF3]"
          >
            <button
              onClick={onCloseAnnouncementModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#1557C0]/10 text-[#1557C0] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">{selectedAnnouncement.icon}</span>
            </div>

            <span className="bg-[#FFD21F]/30 text-[#002760] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border border-[#FFD21F]">
              {selectedAnnouncement.tag} • {selectedAnnouncement.date}
            </span>

            <h3 className="font-['Manrope'] text-xl font-bold text-[#002760] mt-2 mb-3">
              {language === 'hi' && selectedAnnouncement.titleHi
                ? selectedAnnouncement.titleHi
                : language === 'mr' && selectedAnnouncement.titleMr
                ? selectedAnnouncement.titleMr
                : selectedAnnouncement.title}
            </h3>

            <p className="text-[#172033]/80 text-sm leading-relaxed mb-6">
              {language === 'hi' && selectedAnnouncement.descriptionHi
                ? selectedAnnouncement.descriptionHi
                : language === 'mr' && selectedAnnouncement.descriptionMr
                ? selectedAnnouncement.descriptionMr
                : selectedAnnouncement.description}
            </p>

            <button
              onClick={() => {
                onCloseAnnouncementModal();
                onCloseEnquiry();
              }}
              className="w-full bg-[#002760] hover:bg-[#1557C0] text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer"
            >
              {t('nav.quickEnquiry')}
            </button>
          </div>
        </div>
      )}

      {/* 4. Write Review Modal */}
      {isWriteReviewOpen && (
        <div
          onClick={onCloseWriteReview}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-[#E6ECF3] my-8"
          >
            <button
              onClick={onCloseWriteReview}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-3xl">done</span>
                </div>
                <h4 className="font-['Manrope'] font-bold text-xl text-[#002760] mb-1">
                  {t('reviewModal.submitBtn')}
                </h4>
              </div>
            ) : (
              <div>
                <h3 className="font-['Manrope'] text-xl font-bold text-[#002760] mb-1">
                  {t('reviewModal.title')}
                </h3>

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3.5 mt-3">
                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('reviewModal.rating')}
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="text-[#FFD21F] p-1 cursor-pointer"
                        >
                          <span
                            className="material-symbols-outlined text-3xl"
                            style={{ fontVariationSettings: star <= reviewForm.rating ? '"FILL" 1' : '"FILL" 0' }}
                          >
                            star
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('reviewModal.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewForm.name}
                      onChange={(e) => {
                        setReviewForm({ ...reviewForm, name: e.target.value });
                        if (reviewErrors.name) setReviewErrors({ ...reviewErrors, name: undefined });
                      }}
                      className={`w-full bg-[#F4F8FD] border rounded-xl px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none transition-all ${
                        reviewErrors.name ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-[#E6ECF3] focus:border-[#1557C0]'
                      }`}
                    />
                    {reviewErrors.name && (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">error</span>
                        <span>{reviewErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#002760] mb-1">
                      {t('reviewModal.comment')} *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewForm.comment}
                      onChange={(e) => {
                        setReviewForm({ ...reviewForm, comment: e.target.value });
                        if (reviewErrors.comment) setReviewErrors({ ...reviewErrors, comment: undefined });
                      }}
                      className={`w-full bg-[#F4F8FD] border rounded-xl px-3.5 py-2 text-sm focus:bg-white focus:outline-none transition-all ${
                        reviewErrors.comment ? 'border-red-400 focus:border-red-500 bg-red-50/20' : 'border-[#E6ECF3] focus:border-[#1557C0]'
                      }`}
                    />
                    {reviewErrors.comment && (
                      <p className="text-[11px] font-bold text-red-600 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">error</span>
                        <span>{reviewErrors.comment}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#002760] hover:bg-[#1557C0] text-white font-bold py-3.5 rounded-xl shadow-md transition-colors text-sm cursor-pointer mt-1"
                  >
                    {t('reviewModal.submitBtn')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. All Reviews Modal */}
      {isAllReviewsOpen && (
        <div
          onClick={onCloseAllReviews}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-[#E6ECF3] my-8 max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onCloseAllReviews}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-3xl text-[#FFD21F]" style={{ fontVariationSettings: '"FILL" 1' }}>
                star
              </span>
              <div>
                <h3 className="font-['Manrope'] text-xl font-bold text-[#002760]">
                  {t('reviews.allReviewsBtn')}
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {allReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-[#F4F8FD] border border-[#E6ECF3] flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-['Manrope'] font-bold text-sm text-[#002760]">
                        {rev.name}
                      </span>
                      <span className="bg-[#1557C0]/10 text-[#1557C0] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {rev.course}
                      </span>
                    </div>
                    <div className="flex text-[#FFD21F]">
                      {[...Array(Math.floor(rev.rating))].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: '"FILL" 1' }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#172033]/80 italic">
                    "{language === 'hi' && rev.commentHi ? rev.commentHi : language === 'mr' && rev.commentMr ? rev.commentMr : rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
