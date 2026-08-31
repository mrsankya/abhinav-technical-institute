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
    id: 'gr-2013-diploma-equivalency',
    titleMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्ष कालावधीच्या अभ्यासक्रमांना "पदविका अभ्यासक्रम" (Diploma Course) नाव व प्रमाणपत्र मान्यता',
    titleEn: 'Recognition of 2-Year Vocational Examination Board Courses as "Diploma Course" (पदविका अभ्यासक्रम)',
    number: 'शासन निर्णय क्र: व्हीओसी-२०१२/६९७/प्र.क्र.२९२/व्यशि-४',
    date: '२१ जानेवारी, २०१३ (21st January 2013)',
    deptMr: 'महाराष्ट्र शासन, उच्च व तंत्र शिक्षण विभाग, मंत्रालय, मुंबई',
    deptEn: 'Higher & Technical Education Department, Govt. of Maharashtra',
    summaryMr: 'व्यवसाय शिक्षण परीक्षा मंडळाच्या २ वर्षे कालावधीच्या पूर्णवेळ स्वरूपाच्या अभ्यासक्रमांना "प्रमाणपत्र अभ्यासक्रम" ऐवजी "पदविका अभ्यासक्रम" (Diploma Course) अशा नावाने अधिकृत मान्यता देण्याबाबतचा महाराष्ट्र शासन निर्णय.',
    summaryEn: 'Official Maharashtra Government Resolution granting "Diploma Course" (पदविका अभ्यासक्रम) status and diploma certification to 2-year full-time vocational courses.',
    pdfPath: '/gr/gr-2013-diploma-equivalency.pdf',
    status: 'OFFICIAL GOVT DIPLOMA GR',
    badgeColor: 'bg-[#002760] text-white',
    codeNumber: '२०१३०१२११५४५२६३५०८',
  },
  {
    id: 'gr-12th-equivalency',
    titleMr: '२ वर्षे कालावधी आयटीआय/व्यवसाय अभ्यासक्रमास १२ वी समकक्षता शासन निर्णय',
    titleEn: '12th Standard Academic Equivalency Order for 2-Year Vocational Trades',
    number: 'GR No: VTC-2004/891/CR-142',
    date: '15th June 2004',
    deptMr: 'महाराष्ट्र शासन कौशल्य विकास, रोजगार व उद्योजकता विभाग, मंत्रालय मुंबई',
    deptEn: 'Department of Skill Development & Entrepreneurship, Govt. of Maharashtra',
    summaryMr: 'अभिनव टेक्निकल मधील २ वर्षे कालावधीचे व्यावसायिक कोर्सेस उत्तीर्ण विद्यार्थ्यांना १२ वी समकक्षता बहाल करणारा अधिकृत महाराष्ट्र शासन निर्णय.',
    summaryEn: 'Official Maharashtra Government Resolution recognizing 2-year vocational trade courses as equivalent to 12th Standard (HSC).',
    pdfPath: '/gr/gr-2013-diploma-equivalency.pdf',
    status: '12th EQUIVALENCY',
    badgeColor: 'bg-emerald-600 text-white',
  },
  {
    id: 'gr-dvet-affiliation',
    titleMr: 'DVET व महाराष्ट्र राज्य कौशल्य परीक्षा मंडळ अधिकृत संस्था मान्यता व संलग्नता',
    titleEn: 'DVET & MSBSDE Examination Board Trade Affiliation Order',
    number: 'Order No: DVET/REG/JL/782',
    date: '10th August 2004',
    deptMr: 'व्यवसाय शिक्षण व प्रशिक्षण संचालनालय (DVET) महाराष्ट्र राज्य',
    deptEn: 'Directorate of Vocational Education and Training (DVET), Maharashtra',
    summaryMr: 'इलेक्ट्रिशियन, डिझेल मेकॅनिक, कन्स्ट्रक्शन सुपरवायझर व वायरमन ट्रेड्ससाठी व्यवसाय शिक्षण व प्रशिक्षण संचालनालयाची (DVET) अधिकृत संस्था मान्यता.',
    summaryEn: 'Official affiliation order granting government registration for Electrician, Wireman, Diesel Mechanic, and Construction Supervisor trades.',
    pdfPath: '/gr/gr-2013-diploma-equivalency.pdf',
    status: 'DVET AFFILIATED',
    badgeColor: 'bg-blue-600 text-white',
  },
  {
    id: 'gr-msedcl-recruitment',
    titleMr: 'शासकीय आयटीआय समकक्ष नोकरी व महावितरण भरती अल्टरनेटिव्ह क्वॉलिफिकेशन मान्यता',
    titleEn: 'Alternative Job Qualification Approval for Govt & MSEDCL Recruitment',
    number: 'GR No: MSEDCL/HR/TECH-44819',
    date: '18th November 2010',
    deptMr: 'महाराष्ट्र राज्य विद्युत वितरण कंपनी मर्यादित (महावितरण) व सार्वजनिक बांधकाम विभाग',
    deptEn: 'Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL / महावितरण)',
    summaryMr: 'महावितरण, सार्वजनिक बांधकाम विभाग व महापारेषण मधील भरतीसाठी अभिनव इन्स्टिट्यूटच्या प्रमाणपत्रांना शासकीय आयटीआय समकक्ष मान्यता.',
    summaryEn: 'Official government order approving trade certificates issued by MSBSDE / Abhinav Technical Institute as equivalent to Govt ITI.',
    pdfPath: '/gr/gr-2013-diploma-equivalency.pdf',
    status: 'GOVT JOB ELIGIBLE',
    badgeColor: 'bg-purple-600 text-white',
  },
];
