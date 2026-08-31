export interface GovernmentGrItem {
  id: string;
  titleEn: string;
  titleMr: string;
  number: string;
  date: string;
  deptEn: string;
  deptMr: string;
  summaryEn: string;
  summaryMr: string;
  pdfPath: string;
  status: string;
  badgeColor: string;
  codeNumber?: string;
}

export const GOVERNMENT_GR_LIST: GovernmentGrItem[] = [
  {
    id: 'gr-01-diploma-course-recognition-2013',
    titleMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्ष कालावधीच्या अभ्यासक्रमांना "पदविका अभ्यासक्रम" (Diploma Course) नावाने प्रमाणपत्र मान्यता',
    titleEn: 'Academic Recognition of 2-Year Full-Time Vocational Examination Board Courses as "Diploma Course" (पदविका अभ्यासक्रम)',
    number: 'शासन निर्णय क्र: व्हीओसी-२०१२/६९७/प्र.क्र.२९२/व्यशि-४',
    date: '२१ जानेवारी, २०१३ (21st January 2013)',
    deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्षे कालावधीच्या पूर्णवेळ स्वरूपाच्या अभ्यासक्रमांना "प्रमाणपत्र अभ्यासक्रम" ऐवजी "पदविका अभ्यासक्रम" (Diploma Course) अशा नावाने प्रमाणपत्र प्रदान करण्यास मान्यता देण्याबाबत.',
    summaryEn: 'Official Government Resolution granting "Diploma Course" (पदविका अभ्यासक्रम) status to 2-year full-time vocational courses.',
    pdfPath: '/gr/gr-01-diploma-course-recognition-2013.pdf',
    status: 'GOVT DIPLOMA GR',
    badgeColor: 'bg-[#002760] text-white',
    codeNumber: '२०१३०१२११५४५२६३५०८',
  },
  {
    id: 'gr-02-alternate-qualification-iti-2012',
    titleMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या १ वर्ष व २ वर्ष कालावधीच्या अभ्यासक्रमांना औद्योगिक प्रशिक्षण संस्थांमधील (ITI) अभ्यासक्रमांशी नोकरीसाठी पर्यायी शैक्षणिक अर्हता (Alternate Qualification) निश्चित करणेबाबत',
    titleEn: 'Approval of Vocational Examination Board 1 & 2 Year Courses as Alternate Academic Qualification for ITI Jobs',
    number: 'शासन निर्णय क्र: व्हीओसी-२०१२/५९१/प्र.क्र.२४५(ब)/व्यशि-४',
    date: '२८ सप्टेंबर, २०१२ (28th September 2012)',
    deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: '१ वर्ष व २ वर्ष कालावधीच्या व्यवसाय परीक्षा मंडळाच्या विविध गटातील अभ्यासक्रमांना औद्योगिक प्रशिक्षण संस्थांमधील (ITI) अभ्यासक्रमांशी नोकरीसाठी पर्यायी शैक्षणिक अर्हता (Alternate Qualification) म्हणून मान्यता.',
    summaryEn: 'Official Government Resolution recognizing 1-Year and 2-Year vocational courses as equivalent alternate academic qualifications for ITI jobs across Maharashtra.',
    pdfPath: '/gr/gr-02-alternate-qualification-iti-2012.pdf',
    status: 'ITI ALTERNATE QUALIFICATION',
    badgeColor: 'bg-emerald-700 text-white',
    codeNumber: '२०१२०९२८१५०३२४२४०२',
  },
  {
    id: 'gr-03-gazette-of-india-apprenticeship-2017',
    titleMr: 'भारत का राजपत्र (The Gazette of India) - शिक्षुता (पंचम संशोधन) नियम २०१७ - शिक्षु अधिनियम १९६१ अंतर्गत अप्रेंटिसशिप मान्यता',
    titleEn: 'The Gazette of India Extraordinary Notification - Apprenticeship Rules 2017 under Apprentices Act 1961',
    number: 'अधिसूचना: सा.का.नि. 1139(अ) / G.S.R. 1139(E) (No. 761)',
    date: '७ सितम्बर, २०१७ (7th September 2017)',
    deptMr: 'कौशल विकास एवं उद्यमशीलता मंत्रालय, भारत सरकार (Ministry of Skill Development & Entrepreneurship, Govt. of India)',
    deptEn: 'Ministry of Skill Development and Entrepreneurship, Govt. of India',
    summaryMr: 'महाराष्ट्र राज्य व्यावसायिक शिक्षा परीक्षा बोर्ड व राज्य मंडळांच्या १ व २ वर्षांच्या ट्रेड उत्तीर्ण उमेदवारांसाठी शिक्षु अधिनियम १९६१ अंतर्गत नॅशनल अप्रेंटिसशिप ट्रेनिंग व कालावधी निश्चितीचे भारत राजपत्र.',
    summaryEn: 'Official Gazette of India notification providing National Apprenticeship Scheme eligibility and training duration rules under Apprentices Act 1961.',
    pdfPath: '/gr/gr-03-gazette-of-india-apprenticeship-2017.pdf',
    status: 'GAZETTE OF INDIA (GOVT OF INDIA)',
    badgeColor: 'bg-amber-700 text-white',
    codeNumber: 'REGD. NO. D. L.-33004/99',
  },
  {
    id: 'gr-04-msbsvet-hal-apprenticeship-letter-2025',
    titleMr: 'हिंदुस्तान एरोनॉस्टिक्स लिमिटेड (HAL) नाशिक आस्थापनेत MSBSVET उत्तीर्ण विद्यार्थ्यांना नोकरी / शिकाऊ उमेदवारी (Apprenticeship) संधी देण्याबाबत अधिकृत मंडळ पत्र',
    titleEn: 'Official MSBSVET Board Letter to Hindustan Aeronautics Limited (HAL) Nashik for Student Recruitment & Apprenticeship',
    number: 'जा.क्र.मराकौयिशिशमं/का.क्र.७/शैक्षणिक/२०२५/१७१९',
    date: '१२ सप्टेंबर, २०२५ (12th September 2025)',
    deptMr: 'महाराष्ट्र राज्य कौशल्य, व्यवसाय शिक्षण व प्रशिक्षण मंडळ, मुंबई',
    deptEn: 'Maharashtra State Board of Skill, Vocational Education & Training (MSBSVET)',
    summaryMr: 'HAL नाशिक (Hindustan Aeronautics Ltd.) विमान विभागात मंडळाचे पदविका व प्रमाणपत्र उत्तीर्ण विद्यार्थ्यांना नोकरी व शिकाऊ उमेदवारीच्या संधी उपलब्ध करून देण्याबाबतचे अधिकृत पत्र.',
    summaryEn: 'Official Board communication to HAL Aircraft Division Nashik recognizing MSBSVET passed candidates as eligible for recruitment & apprenticeship opportunities.',
    pdfPath: '/gr/gr-04-msbsvet-hal-apprenticeship-letter-2025.pdf',
    status: 'HAL RECRUITMENT LETTER',
    badgeColor: 'bg-blue-700 text-white',
  },
  {
    id: 'gr-05-msbve-apprenticeship-circular-2019',
    titleMr: 'व्यवसाय शिक्षण परीक्षा मंडळाचे अभ्यासक्रम शिकाऊ उमेदवारी (Apprenticeship Scheme 1961) अंतर्गत समाविष्ट असल्याबाबतचे अधिकृत परिपत्रक',
    titleEn: 'Official MSBVE Board Circular for Apprenticeship Scheme 1961 Integration & Student Registration',
    number: 'परिपत्रक क्र: मराव्यशिमं/का-१२/२०१९/११९१',
    date: '८ डिसेंबर, २०१९ (8th December 2019)',
    deptMr: 'महाराष्ट्र राज्य व्यवसाय शिक्षण परीक्षा मंडळ, शासकीय तंत्र निकेतन इमारत, वांद्रे (पूर्व), मुंबई',
    deptEn: 'Maharashtra State Board of Vocational Education Examination (MSBVET)',
    summaryMr: 'भारत सरकारच्या www.apprenticeship.gov.in पोर्टलवर नोंदणी करून शिकाऊ उमेदवारी अधिनियम १९६१ अंतर्गत प्राधान्याने भरती मेळावे व शिकाऊ भरतीबाबत परिपत्रक.',
    summaryEn: 'Official Board directive ensuring all MSBVE vocational trade students are registered under the National Apprenticeship portal for industry & govt jobs.',
    pdfPath: '/gr/gr-05-msbve-apprenticeship-circular-2019.pdf',
    status: 'MSBVET CIRCULAR',
    badgeColor: 'bg-purple-700 text-white',
  },
  {
    id: 'gr-06-12th-equivalency-2-year-courses-2012',
    titleMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्ष कालावधीच्या अभ्यासक्रमांना उच्च शिक्षणासाठी +२ स्तराज्या समकक्षता (12th Standard HSC Equivalency) निश्चित करणेबाबत',
    titleEn: 'Official Government Resolution granting 12th Standard HSC Equivalency (+२ स्तर समकक्षता) for 2-Year Vocational Courses',
    number: 'शासन निर्णय क्र: व्हीओसी-२०१२/५९१/प्र.क्र.२४५(अ)/व्यशि-४',
    date: '२८ सप्टेंबर, २०१२ (28th September 2012)',
    deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: 'इयत्ता १० वी उत्तीर्ण झाल्यानंतर २ वर्ष कालावधीचे व्यावसायिक अभ्यासक्रम पूर्ण करणाऱ्या विद्यार्थ्यांना इयत्ता १२ वी (सर्व विद्या शाखा) उत्तीर्ण समजण्याबाबतचा अधिकृत महाराष्ट्र शासन निर्णय.',
    summaryEn: 'Official Maharashtra Government Resolution granting 12th Standard (HSC) academic equivalency to 2-year vocational trade courses for higher degree admissions.',
    pdfPath: '/gr/gr-06-12th-equivalency-2-year-courses-2012.pdf',
    status: '12TH HSC EQUIVALENCY GR',
    badgeColor: 'bg-emerald-800 text-white',
    codeNumber: '२०१२०९२८१५०२३४२४०२',
  },
];
