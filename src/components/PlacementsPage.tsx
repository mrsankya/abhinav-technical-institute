import React, { useState } from 'react';
import { Language, getTranslation } from '../translations/translations';

interface PlacementsPageProps {
  language: Language;
  onNavigateHome: () => void;
  onOpenEnquiry: () => void;
}

export const PlacementsPage: React.FC<PlacementsPageProps> = ({
  language,
  onNavigateHome,
  onOpenEnquiry,
}) => {
  const t = (key: string) => getTranslation(key, language);
  const [activeImageModal, setActiveImageModal] = useState<string | null>(null);

  // Official Placement Highlights
  const placementHighlights = [
    {
      titleEn: 'Successful Placements & Self-Employment',
      titleMr: 'हजारो यशस्वी विद्यार्थी व स्वयंरोजगार',
      descEn: 'Thousands of alumni employed across PWD, Municipalities, Railways & Private Sector.',
      descMr: 'पीडब्ल्यूडी, जिल्हा परिषद, नगरपालिका, रेल्वे व खाजगी कंपन्यांमध्ये यशस्वीपणे कार्यरत.',
      icon: 'groups',
      color: 'bg-[#002760] text-white',
    },
    {
      titleEn: 'Government License Eligibility',
      titleMr: 'शासकीय कंत्राटदार व परवाना पात्रता',
      descEn: 'Eligible for Class 7-B PWD Contractor registration up to ₹10 Lakhs & Wireman License.',
      descMr: 'वर्ग ७-ब १० लाख रुपयांपर्यंत कंत्राटदार नोंदणी व वीजतंत्री (Wireman) परवाना पात्रता.',
      icon: 'verified_user',
      color: 'bg-[#1557C0] text-white',
    },
    {
      titleEn: '100% Practical Workshop Training',
      titleMr: '१००% प्रत्यक्ष कार्यशाळा प्रशिक्षण',
      descEn: 'State-of-the-art labs, commercial tools & hands-on equipment training.',
      descMr: 'आधुनिक वर्कशॉप उपकरणे व प्रत्यक्ष प्रात्यक्षिक प्रशिक्षणावर भर.',
      icon: 'build',
      color: 'bg-[#BE185D] text-white',
    },
    {
      titleEn: 'Career Guidance & Placement Support',
      titleMr: 'नोकरी मार्गदर्शक व प्लेसमेंट सहाय्य',
      descEn: 'Dedicated support for apprenticeships, job interviews & contractor business setup.',
      descMr: 'नोकरी मार्गदर्शन, अप्रेंटिसशिप व व्यवसाय उभारणीसाठी निरंतर मार्गदर्शन.',
      icon: 'handshake',
      color: 'bg-[#047857] text-white',
    },
  ];

  // Authentic Brochure Placement & Success Story Gallery Assets
  const placementGallery = [
    {
      id: 'gallery-main',
      src: '/assets/placements/placed_students_grid.jpg',
      titleEn: 'Our Placed Students Wall of Honor',
      titleMr: 'अभिनव टेक्निकलच्या विद्यार्थ्यांना नोकरी मिळतेच...!',
      categoryEn: 'Brochure Records',
      categoryMr: 'संस्था अभिलेख',
      descEn: 'Official brochure record displaying hundreds of successfully employed ATI alumni.',
      descMr: 'जळगाव व महाराष्ट्रभरात विविध क्षेत्रात नोकरी व व्यवसायात कार्यरत विद्यार्थी.',
    },
    {
      id: 'gallery-page1',
      src: '/assets/placements/success_stories_page1.png',
      titleEn: 'Student Success Stories - Volume 1',
      titleMr: 'आमच्या यशस्वी विद्यार्थ्यांची यशोगाथा - भाग १',
      categoryEn: 'Alumni Testimonials',
      categoryMr: 'विद्यार्थी मनोगत',
      descEn: 'Real success testimonials of Construction Supervisors & Contractors.',
      descMr: 'कन्स्ट्रक्शन सुपरवायझर व सरकारी कंत्राटदार विद्यार्थ्यांचे मनोगत.',
    },
    {
      id: 'gallery-page2',
      src: '/assets/placements/success_stories_page2.png',
      titleEn: 'Student Success Stories - Volume 2',
      titleMr: 'आमच्या यशस्वी विद्यार्थ्यांची यशोगाथा - भाग २',
      categoryEn: 'Alumni Testimonials',
      categoryMr: 'विद्यार्थी मनोगत',
      descEn: 'Featured stories of Electricians & Industrial Technicians.',
      descMr: 'इलेक्ट्रिशियन व औद्योगिक तंत्रज्ञ विद्यार्थ्यांचे यश.',
    },
    {
      id: 'gallery-page3',
      src: '/assets/placements/success_stories_page3.png',
      titleEn: 'Student Success Stories - Volume 3',
      titleMr: 'आमच्या यशस्वी विद्यार्थ्यांची यशोगाथा - भाग ३',
      categoryEn: 'Alumni Testimonials',
      categoryMr: 'विद्यार्थी मनोगत',
      descEn: 'Stories of Electrical Shop Owners & Automobile Mechanics.',
      descMr: 'इलेक्ट्रिकल शॉप मालक व ऑटोमोबाईल मेकॅनिक विद्यार्थ्यांची प्रगती.',
    },
    {
      id: 'gallery-page4',
      src: '/assets/placements/success_stories_page4.jpg',
      titleEn: 'Student Success Stories - Volume 4',
      titleMr: 'आमच्या यशस्वी विद्यार्थ्यांची यशोगाथा - भाग ४',
      categoryEn: 'Alumni Testimonials',
      categoryMr: 'विद्यार्थी मनोगत',
      descEn: 'Stories of Diesel Mechanics working in FIAT & Maruti Suzuki.',
      descMr: 'फियाट व मारुती सुझुकी मध्ये कार्यरत डिझेल मेकॅनिक विद्यार्थी.',
    },
  ];

  // Authentic Testimonials directly from Brochure Data
  const realBrochureTestimonials = [
    {
      name: 'मयुरा साहेबराव पाटील',
      role: 'सरकारी कंत्राटदार (Patil Construction, रावेर)',
      course: 'Construction Supervisor (2015-16)',
      quote:
        'अभिनव टेक्निकल इन्स्टिट्यूट जळगाव येथून कन्स्ट्रक्शन सुपरवायझर प्रशिक्षण पूर्ण केले. प्रॅक्टिकलचे सखोल शिक्षण मिळाल्यामुळे मी पाटील कन्स्ट्रक्शन नावाने स्वतःचा व्यवसाय सुरू केला व PWD व जिल्हा परिषद परवाना मिळवला.',
      image: '/assets/placements/success_stories_page1.png',
    },
    {
      name: 'संजय गोविंद कुमावत',
      role: 'कंत्राटदार (चाळीसगाव)',
      course: 'Construction Supervisor (2017-18)',
      quote:
        'अभिनव इन्स्टिट्युटमुळे मला चांगल्या प्रकारे प्रॅक्टिकल शिकायला मिळाले. त्यानंतर सरकारी लायसन्स काढून कंत्राट घेण्यास सुरुवात केली. आज माझे मासिक उत्पन्न रु. ५०,०००/- आहे.',
      image: '/assets/placements/success_stories_page1.png',
    },
    {
      name: 'उमेश सदाशिव पाटील',
      role: 'आर्किटेक्ट ऑफिस & कंत्राटदार (जळगाव)',
      course: 'Construction Supervisor (2016-17)',
      quote:
        'सोप्या भाषेत शिकवण्याची सोय असल्यामुळे मला नोकरीत फायदा झाला व आज मी आर्किटेक्ट ऑफिस मध्ये जॉब करतो तसेच स्वतःचे सरकारी लायसन्स काढून कॉन्ट्रॅक्ट सुद्धा घेतो.',
      image: '/assets/placements/success_stories_page2.png',
    },
    {
      name: 'मिलिंद बबनराव नन्नवरे',
      role: 'संचालक (BNT इलेक्ट्रिकल, पिंप्राळा जळगाव)',
      course: 'Electrician (2018-19)',
      quote:
        'नोकरीसारखा पारंपारिक पर्याय न स्वीकारता स्वतःचा व्यवसाय सुरू केला. जळगाव मधील पिंप्राळा येथे BNT इलेक्ट्रिकल हे दुरुस्ती व विक्रीचे दुकान आहे.',
      image: '/assets/placements/success_stories_page2.png',
    },
    {
      name: 'महेंद्र ज्ञानेश्वर महाजन',
      role: 'टेक्निशियन (युनिटेक ऑटोमेशन प्रा.लि., पुणे)',
      course: 'Electrician Trade (2013-14)',
      quote:
        'संस्थेमध्ये उत्कृष्टरित्या औद्योगिक व व्यवसाय प्रशिक्षणाचे प्रॅक्टिकल शिक्षण दिले जाते. त्यामुळे आज मी युनिटेक ऑटोमेशन प्रा.लि. पुणे या कंपनीत चांगल्या पगारावर नोकरीला आहे.',
      image: '/assets/placements/success_stories_page2.png',
    },
    {
      name: 'रविंद्र चुडामण मराठे',
      role: 'मेकॅनिक (फियाट कं. रांजणगाव, पुणे)',
      course: 'Diesel Mechanic (2010-11)',
      quote:
        'संस्थेमध्ये अगदी सहज व सोप्या भाषेत औद्योगिक प्रॅक्टिकलचे ज्ञान दिले जाते. त्यामुळे आज मी फियाट कंपनी रांजणगाव पुणे येथे चांगल्या पदावर कार्यरत आहे.',
      image: '/assets/placements/success_stories_page3.png',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-[#172033] min-h-screen">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1557C0] hover:text-[#002760] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>{language === 'en' ? 'Back to Home' : 'मुख्यपृष्ठावर परत जा'}</span>
          </button>

          <h1 className="font-['Manrope'] text-base sm:text-lg font-black text-[#002760]">
            {language === 'en' ? 'Placement & Student Success' : 'प्लेसमेंट व विद्यार्थी यशोगाथा'}
          </h1>

          <button
            onClick={onOpenEnquiry}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#002760] bg-[#FFD21F] hover:bg-[#f0c20f] px-3.5 sm:px-4 py-2 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">phone_in_talk</span>
            <span>{language === 'en' ? 'Enquire Now' : 'चौकशी करा'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* Section Main Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1557C0]/10 border border-[#1557C0]/20 text-[#1557C0] font-bold text-xs">
            <span className="material-symbols-outlined text-sm">military_tech</span>
            <span>{language === 'mr' ? 'अभिनव टेक्निकल इन्स्टिट्यूट जळगाव' : 'Abhinav Technical Institute'}</span>
          </div>
          <h2 className="font-['Manrope'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#002760] tracking-tight">
            {language === 'mr' ? 'आमचे विद्यार्थी, आमचे यश (Our Students, Our Success)' : 'Our Students, Our Success'}
          </h2>
          <div className="w-20 h-1 bg-[#FFD21F] rounded-full mx-auto" />
          <p className="font-['Work_Sans'] text-sm sm:text-base text-[#172033]/75 leading-relaxed">
            {language === 'mr'
              ? '१९९९ पासून प्रत्यक्ष प्रॅक्टिकल शिक्षण, शासकीय परवाना पात्रता आणि स्वयंरोजगाराच्या संधींमधून घडलेली यशोगाथा.'
              : 'Empowering students since 1999 through practical workshop training, official government licensing, and placement support.'}
          </p>
        </div>

        {/* Highlights Area */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {placementHighlights.map((hl, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl ${hl.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <span className="material-symbols-outlined text-2xl">{hl.icon}</span>
                </div>
              </div>
              <div>
                <h3 className="font-['Manrope'] font-extrabold text-base text-[#002760] mb-1.5 leading-snug">
                  {language === 'en' ? hl.titleEn : hl.titleMr}
                </h3>
                <p className="text-xs text-[#172033]/70 leading-relaxed">
                  {language === 'en' ? hl.descEn : hl.descMr}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Feature Banner: Main Brochure Placement Grid Image */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#1557C0] tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Official Institute Records
              </span>
              <h3 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#002760] mt-2">
                {language === 'mr' ? 'अभिनव टेक्निकलच्या विद्यार्थ्यांना नोकरी मिळतेच...!' : 'Placements & Successful Alumni Wall'}
              </h3>
            </div>
            <button
              onClick={() => setActiveImageModal('/assets/placements/placed_students_grid.jpg')}
              className="inline-flex items-center justify-center gap-2 bg-[#002760] text-white hover:bg-[#1557C0] px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-base">zoom_in</span>
              <span>{language === 'mr' ? 'पूर्ण फोटो झूम करा' : 'View Full Image'}</span>
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 group cursor-pointer"
               onClick={() => setActiveImageModal('/assets/placements/placed_students_grid.jpg')}>
            <img
              src="/assets/placements/placed_students_grid.jpg"
              alt="Abhinav Technical Institute Placed Students Banner"
              className="w-full h-auto object-contain max-h-[650px] mx-auto group-hover:scale-[1.01] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors flex items-center justify-center">
              <span className="bg-black/75 backdrop-blur text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-base">visibility</span>
                <span>{language === 'mr' ? 'पाहण्यासाठी क्लिक करा' : 'Click to View Full Size'}</span>
              </span>
            </div>
          </div>
        </section>

        {/* Brochure Success Story Pages Gallery */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h3 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#002760]">
                {language === 'mr' ? 'आमच्या यशस्वी विद्यार्थ्यांची यशोगाथा' : 'Student Success Stories & Testimonials'}
              </h3>
              <p className="text-xs sm:text-sm text-[#172033]/70 mt-1">
                {language === 'mr'
                  ? 'माहितीपत्रकात प्रसिद्ध झालेल्या विद्यार्थ्यांच्या प्रत्यक्ष यशोगाथा:'
                  : 'Official brochure pages highlighting real student career outcomes and achievements:'}
              </p>
            </div>
          </div>

          {/* Grid Layout: 3 columns desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placementGallery.slice(1).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => setActiveImageModal(item.src)}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                  <img
                    src={item.src}
                    alt={item.titleEn}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#002760]/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {language === 'en' ? item.categoryEn : item.categoryMr}
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-grow gap-3">
                  <div>
                    <h4 className="font-['Manrope'] font-bold text-base text-[#002760] group-hover:text-[#1557C0] transition-colors leading-snug">
                      {language === 'en' ? item.titleEn : item.titleMr}
                    </h4>
                    <p className="text-xs text-[#172033]/70 mt-1 leading-relaxed">
                      {language === 'en' ? item.descEn : item.descMr}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#1557C0] font-bold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">menu_book</span>
                      <span>{language === 'mr' ? 'माहितीपत्रक पान पहा' : 'View Page'}</span>
                    </span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Real Testimonial Quotes from Alumni */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#002760]">
              {language === 'mr' ? 'माजी विद्यार्थ्यांचे अनुभव व प्रतिक्रिया' : 'Alumni Feedback & Success Stories'}
            </h3>
            <p className="text-xs sm:text-sm text-[#172033]/70">
              {language === 'mr'
                ? 'अभिनव टेक्निकल इन्स्टिट्यूटमधून उत्तीर्ण झालेल्या विद्यार्थ्यांचे अनुभव:'
                : 'Real testimonials from our successfully settled civil contractors and industrial technicians:'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realBrochureTestimonials.map((tst, tIdx) => (
              <div
                key={tIdx}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 text-gray-100 select-none pointer-events-none">
                  <span className="material-symbols-outlined text-8xl">format_quote</span>
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#002760] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {tst.name[0]}
                    </div>
                    <div>
                      <h4 className="font-['Manrope'] font-bold text-sm text-[#002760] leading-snug">
                        {tst.name}
                      </h4>
                      <p className="text-[11px] text-[#1557C0] font-semibold">{tst.role}</p>
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {tst.course}
                  </span>

                  <p className="text-xs text-[#172033]/80 leading-relaxed italic">
                    "{tst.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Placement & Skill Development Process */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-md space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-['Manrope'] text-2xl sm:text-3xl font-extrabold text-[#002760]">
              {language === 'mr' ? 'प्रशिक्षण ते रोजगार प्रवास' : 'Career Support Process'}
            </h3>
            <p className="text-xs sm:text-sm text-[#172033]/70">
              {language === 'mr'
                ? 'विद्यार्थ्यांना रोजगारासाठी सक्षम करणारी ४ टप्प्यांची पद्धत:'
                : 'Our proven step-by-step career path from enrollment to placement:'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-[#002760] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
                1
              </div>
              <h4 className="font-['Manrope'] font-bold text-sm text-[#002760]">
                {language === 'mr' ? '१. अभ्यासक्रम निवड' : '1. Trade Admission'}
              </h4>
              <p className="text-xs text-[#172033]/70">
                {language === 'mr' ? 'आवडीनुसार १ किंवा २ वर्षांच्या ट्रेडमध्ये प्रवेश.' : 'Enroll in MSBSVET approved technical trade.'}
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-[#1557C0] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
                2
              </div>
              <h4 className="font-['Manrope'] font-bold text-sm text-[#002760]">
                {language === 'mr' ? '२. प्रॅक्टिकल शिक्षण' : '2. Practical Training'}
              </h4>
              <p className="text-xs text-[#172033]/70">
                {language === 'mr' ? 'आधुनिक वर्कशॉप उपकरणांवर १००% प्रात्यक्षिक.' : '100% hands-on workshop skill training.'}
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-[#BE185D] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
                3
              </div>
              <h4 className="font-['Manrope'] font-bold text-sm text-[#002760]">
                {language === 'mr' ? '३. शासकीय परवाना' : '3. Govt Licensing'}
              </h4>
              <p className="text-xs text-[#172033]/70">
                {language === 'mr' ? 'PWD कंत्राटदार नोंदणी व Wireman परवाना मार्गदर्शन.' : 'Guidance for PWD contractor & Wireman license.'}
              </p>
            </div>

            <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-200 text-center space-y-2 relative">
              <div className="w-10 h-10 rounded-xl bg-[#047857] text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
                4
              </div>
              <h4 className="font-['Manrope'] font-bold text-sm text-[#002760]">
                {language === 'mr' ? '४. नोकरी व स्वयंरोजगार' : '4. Placement & Business'}
              </h4>
              <p className="text-xs text-[#172033]/70">
                {language === 'mr' ? 'शासकीय/खाजगी नोकरी किंवा स्वतःचा उद्योग.' : 'Employment or establishing own enterprise.'}
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Box */}
        <section className="bg-gradient-to-r from-[#002760] via-[#1557C0] to-[#002760] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h3 className="font-['Manrope'] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              {language === 'mr' ? 'तुमच्या उज्ज्वल भविष्याची सुरुवात आजच करा' : 'Start Your Career Journey With Us'}
            </h3>
            <p className="font-['Work_Sans'] text-sm sm:text-base text-white/90 leading-relaxed">
              {language === 'mr'
                ? 'आजच अभिनव टेक्निकल इन्स्टिट्यूट जळगाव मध्ये प्रवेश घ्या व आपल्या कौशल्याने आत्मनिर्भर व्हा!'
                : 'Join Abhinav Technical Institute Jalgaon today and build a solid technical career.'}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto bg-[#FFD21F] text-[#002760] hover:bg-white px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              {language === 'mr' ? 'प्रवेशासाठी चौकशी करा' : 'Apply for Admission'}
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border border-white/30 px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
            >
              {language === 'mr' ? 'अभ्यासक्रम पहा' : 'Explore Courses'}
            </button>
          </div>
        </section>
      </div>

      {/* Lightbox / Zoom Modal for Viewing Full Brochure Images */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-auto bg-white rounded-2xl p-2 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
            <img
              src={activeImageModal}
              alt="Brochure High Resolution Asset"
              className="w-full h-auto object-contain max-h-[82vh] mx-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
