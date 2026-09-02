import type { Course, Announcement, Review, FaqItem, StudentCertificate } from '../types';

export const HERO_CAROUSEL_IMAGES = [
  {
    src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-colleges-fqdkck51aj.jpg',
    alt: 'Abhinav Technical Institute Campus & Classroom - Jalgaon',
    title: 'Computer Training & IT Practical Lab',
    titleMr: 'संगणक प्रशिक्षण व प्रॅक्टिकल लॅब',
    category: 'Computer & IT',
    categoryMr: 'संगणक व आयटी',
    desc: 'Students engaged in hands-on computer typing, IT software, MS-CIT, and Tally practical sessions under expert supervision.',
    descMr: 'मार्गदर्शकांच्या देखरेखीखाली संगणक प्रॅक्टिकल, एमएस-सीआयटी, टायपिंग आणि सॉफ्टवेअरचे प्रत्यक्ष सराव वर्ग.'
  },
  {
    src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-9u76812boe.jpg',
    alt: 'Technical Training Lab 1 - Electrical Engineering Workbench',
    title: 'Advanced Electrical Workshop',
    titleMr: 'अत्याधुनिक इलेक्ट्रिकल कार्यशाळा',
    category: 'Electrical Trades',
    categoryMr: 'इलेक्ट्रिकल',
    desc: 'Equipped with 3-phase industrial control boards, motors, transformer test units, and safety testing apparatus.',
    descMr: '३-फेज इंडस्ट्रियल कंट्रोल पॅनेल, मोटर्स आणि ट्रान्सफॉर्मर टेस्टिंग सिस्टीम.'
  },
  {
    src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-xsn20b070w.jpg',
    alt: 'Technical Training Lab 3 - Commercial Wiring & Automation',
    title: 'Commercial Wiring Simulation',
    titleMr: 'कमर्शियल वायरिंग सिम्युलेटर',
    category: 'Wiring & Automation',
    categoryMr: 'वायरिंग आणि ऑटोमेशन',
    desc: 'Real-world simulations for multi-storey residential conduits, commercial switchboards, and distribution systems.',
    descMr: 'इमारतींचे अंतर्गत वायरिंग, कन्सिल्ड फिटिंग्ज आणि वीज वितरण पॅनेलचे प्रात्यक्षिक.'
  },
  {
    src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-hyk2wb2v1e.jpg',
    alt: 'Technical Training Lab 4 - Industrial Practical Training',
    title: 'Industrial Practical Training Workshop',
    titleMr: 'औद्योगिक प्रात्यक्षिक प्रशिक्षण कार्यशाळा',
    category: 'Electrical Trades',
    categoryMr: 'इलेक्ट्रिकल ट्रेड',
    desc: 'Hands-on practical training on industrial machinery, wiring, and electrical tools.',
    descMr: 'सुरक्षित उपकरणांसह आधुनिक वायरिंग आणि फॅब्रिकेशन प्रात्यक्षिक.'
  },
  {
    src: 'https://content3.jdmagicbox.com/v2/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-roefbm6f0w.jpg',
    alt: 'Technical Training Lab 5 - Computer Infrastructure & Equipment',
    title: 'Computer Lab Infrastructure',
    titleMr: 'संगणक प्रयोगशाळा पायाभूत सुविधा',
    category: 'Computer & IT',
    categoryMr: 'संगणक व आयटी',
    desc: 'Individual computer workstations with high-speed internet for every student.',
    descMr: 'प्रत्येक विद्यार्थ्यासाठी स्वतंत्र कॉम्प्युटर आणि हाय-स्पीड इंटरनेट सुविधा.'
  }
];

export const COURSES: Course[] = [
  {
    id: 'construction-supervisor',
    name: 'CONSTRUCTION SUPERVISOR – 1 YEAR',
    nameMr: 'कन्स्ट्रक्शन सुपरवायझर – १ वर्ष कालावधी (बांधकाम पर्यवेक्षक / स्थापत्य अभियंत्रिकी सहायक)',
    code: '304202',
    category: 'Civil & Construction',
    categoryMr: 'बांधकाम व स्थापत्य',
    description: 'Civil construction supervision, surveying, estimation, costing & site management.',
    descriptionMr: 'कन्स्ट्रक्शन सुपरवायझर – १ वर्ष कालावधी (बांधकाम पर्यवेक्षक / स्थापत्य अभियंत्रिकी सहायक)',
    fullDescription: 'MSBSVET Course Code 304202. Government ITI alternative qualification. Equivalent to 12th Std & ITI. Eligible for Class 7-B Govt Contractor registration up to ₹10 Lakhs.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त कोर्स (कोर्स कोड: 304202). आयटीआय व १२ वी समकक्ष मान्यता. जिल्हा परिषद, पीडब्ल्यूडी, नगररचना, सिडको, म्हाडा भरतीसाठी पात्र.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / College Student / Graduate',
    eligibilityMr: '१०वी किंवा १२वी किंवा कॉलेज विद्यार्थी किंवा पदवीधर',
    subjects: [
      { name: 'Construction Material and Practices (TH-1)', code: '30420211' },
      { name: 'Estimating and Costing (TH-II)', code: '30420212' },
      { name: 'Surveying and Leveling (TH-III)', code: '30420213' },
      { name: 'Construction Material and Practices (PR-I)', code: '30420221' },
      { name: 'Surveying and Leveling (PR-III)', code: '30420222' }
    ],
    syllabus: [
      'Construction Material and Practices (TH-1) [Subject Code: 30420211]',
      'Estimating and Costing (TH-II) [Subject Code: 30420212]',
      'Surveying and Leveling (TH-III) [Subject Code: 30420213]',
      'Construction Material and Practices (PR-I) [Subject Code: 30420221]',
      'Surveying and Leveling (PR-III) [Subject Code: 30420222]'
    ],
    syllabusMr: [
      'बांधकाम साहित्य आणि पद्धती (थियरी-१) [कोड: 30420211]',
      'अंदाजबजेट व मूल्यनिर्धारण (थियरी-२) [कोड: 30420212]',
      'सर्व्हेइंग आणि लेव्हलिंग (थियरी-३) [कोड: 30420213]',
      'बांधकाम साहित्य व पद्धती प्रॅक्टिकल (PR-I) [कोड: 30420221]',
      'सर्व्हेइंग आणि लेव्हलिंग प्रॅक्टिकल (PR-III) [कोड: 30420222]'
    ],
    careerOpportunities: [
      'PWD & Zilla Parishad Construction Supervisor',
      'Government Registered Contractor (Class 7-B)',
      'Direct 2nd Year Entry to Civil Diploma',
      'Site Estimator, Surveyor & Quality Engineer'
    ],
    careerOpportunitiesMr: [
      'पीडब्ल्यूडी व जिल्हा परिषद बांधकाम पर्यवेक्षक',
      'शासकीय नोंदणीकृत कंत्राटदार (वर्ग ७-ब १० लाखांपर्यंत)',
      'थेट द्वितीय वर्ष सिव्हिल डिप्लोमा प्रवेश',
      'साईट इस्टिमेटर, सर्व्हेअर व क्वालिटी सुपरवायझर'
    ],
    certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
    batchCapacity: 30,
    enrolled: 26
  },
  {
    id: 'electrician',
    name: 'ELECTRICIAN – 2 YEARS',
    nameMr: 'इलेक्ट्रिशियन – २ वर्ष कालावधी (वीजतंत्री व औद्योगिक वायरिंग)',
    code: '302409',
    category: 'Electrical Trades',
    categoryMr: 'इलेक्ट्रिकल ट्रेड',
    description: 'Comprehensive 2-year trade training covering electrical wiring, power systems & practice.',
    descriptionMr: 'इलेक्ट्रिशियन – २ वर्ष कालावधी (वीजतंत्री व औद्योगिक वायरिंग)',
    fullDescription: 'MSBSVET Course Code 302409. 2-Year comprehensive trade with 2 months compulsory summer internship. Includes Wireman License & Mahavitaran recruitment eligibility.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त २ वर्षांचा कोर्स (कोर्स कोड: 302409). महावितरण भरती, वीजतंत्री (Wireman) व सुपरवायझर परवाना मिळवण्यासाठी उपयुक्त.',
    duration: '2 Years',
    durationMr: '२ वर्ष कालावधी',
    timing: '8:00 AM - 12:00 PM',
    timingMr: 'सकाळी ८:०० ते दुपारी १२:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / College Student / Graduate',
    eligibilityMr: '१०वी किंवा १२वी किंवा कॉलेज विद्यार्थी किंवा पदवीधर',
    subjects: [
      { name: 'English (Communication Skills)', code: '90000001' },
      { name: 'Business Economics', code: '90000012' },
      { name: 'Computer Application', code: '90000022' },
      { name: 'Basic Electricity and Measurement', code: '30240011' },
      { name: 'Electrician Practice', code: '30240012' },
      { name: 'Workshop Calculation, Science and Drawing', code: '30240013' }
    ],
    syllabus: [
      'English (Communication Skills) [Subject Code: 90000001]',
      'Business Economics [Subject Code: 90000012]',
      'Computer Application [Subject Code: 90000022]',
      'Basic Electricity and Measurement [Subject Code: 30240011]',
      'Electrician Practice [Subject Code: 30240012]',
      'Workshop Calculation, Science and Drawing [Subject Code: 30240013]'
    ],
    syllabusMr: [
      'संभाषण कौशल्य व इंग्रजी संवाद [कोड: 90000001]',
      'व्यवसाय अर्थशास्त्र व उद्योजकता [कोड: 90000012]',
      'संगणक ॲप्लिकेशन व आयटी टूल्स [कोड: 90000022]',
      'मूलभूत विद्युतशास्त्र व मोजमापे [कोड: 30240011]',
      'इलेक्ट्रिशियन प्रॅक्टिस व कार्यशाळा [कोड: 30240012]',
      'वर्कशॉप कॅल्क्युलेशन, सायन्स व इंजिनिअरिंग ड्रॉइंग [कोड: 30240013]'
    ],
    careerOpportunities: [
      'Wireman & Supervisor License Holder',
      'Mahavitaran (MSEDCL) Electrical Assistant',
      'Industrial Maintenance Electrician',
      'NCVT/DGT National Apprenticeship Certificate Holder'
    ],
    careerOpportunitiesMr: [
      'शासकीय वायरमन व सुपरवायझर परवाना धारक',
      'महावितरण (MSEDCL) विद्युत सहायक भरती पात्र',
      'औद्योगिक मेंटेनन्स इलेक्ट्रिशियन',
      'थेट २ऱ्या वर्षात इलेक्ट्रिकल डिप्लोमा प्रवेश'
    ],
    certification: 'MSBSVET Govt ITI Equivalent Certified',
    batchCapacity: 35,
    enrolled: 29
  },
  {
    id: 'wireman',
    name: 'WIREMAN – 1 YEAR',
    nameMr: 'वायरमन – १ वर्ष कालावधी (औद्योगिक व घरगुती वायरिंग)',
    code: '301201',
    category: 'Electrical Trades',
    categoryMr: 'इलेक्ट्रिकल ट्रेड',
    description: 'Professional wireman trade training with government wireman permit exam preparation.',
    descriptionMr: 'वायरमन – १ वर्ष कालावधी (औद्योगिक व घरगुती वायरिंग)',
    fullDescription: 'MSBSVET Course Code 301201. 1-Year practical trade focusing on domestic wiring, industrial panels, switchgear, safety grounding, and PWD wireman licensing.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा कोर्स (कोर्स कोड: 301201). घरगुती व औद्योगिक वायरिंग, पॅनेल बोर्ड, अर्थिंग व शासकीय परवाना परीक्षा.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th Pass',
    eligibilityMr: '१०वी किंवा १२वी उत्तीर्ण',
    subjects: [
      { name: 'Basic Electrical Theory & Safety', code: '30120111' },
      { name: 'Domestic & Commercial Wiring', code: '30120112' },
      { name: 'Industrial Wiring & Control Panels', code: '30120113' },
      { name: 'Electrical Workshop Practical', code: '30120121' }
    ],
    syllabus: [
      'Basic Electrical Theory & Safety [Code: 30120111]',
      'Domestic & Commercial Wiring Methods [Code: 30120112]',
      'Industrial Wiring & Control Panels [Code: 30120113]',
      'Electrical Workshop Practical & Earthing [Code: 30120121]'
    ],
    syllabusMr: [
      'विद्युतशास्त्र थियरी व सुरक्षा नियम [कोड: 30120111]',
      'घरगुती व व्यावसायिक वायरिंग तंत्र [कोड: 30120112]',
      'औद्योगिक वायरिंग व कंट्रोल पॅनेल [कोड: 30120113]',
      'इलेक्ट्रिकल वर्कशॉप प्रॅक्टिकल व अर्थिंग [कोड: 30120121]'
    ],
    careerOpportunities: [
      'Govt. Certified Wireman License Holder',
      'Industrial Electrical Maintenance Technician',
      'Electrical Contractor & Service Shop Owner'
    ],
    careerOpportunitiesMr: [
      'शासकीय अधिकृत वायरमन परवाना',
      'औद्योगिक इलेक्ट्रिकल मेंटेनन्स तंत्रज्ञ',
      'स्वतःचा स्वतंत्र इलेक्ट्रिकल व्यवसाय'
    ],
    certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
    batchCapacity: 30,
    enrolled: 24
  },
  {
    id: 'dmlt',
    name: 'DMLT – 2 YEARS',
    nameMr: 'DMLT (डी.एम.एल.टी. - मेडिकल लॅबोरेटरी टेक्नॉलॉजी)',
    code: 'MSBQ201404',
    category: 'Paramedical & Medical',
    categoryMr: 'पॅरामेडिकल व लॅब',
    description: 'Medical Laboratory Technology diploma registered with Maharashtra Paramedical Council.',
    descriptionMr: 'DMLT (डी.एम.एल.टी. - मेडिकल लॅबोरेटरी टेक्नॉलॉजी)',
    fullDescription: 'MSBSVET Course Code MSBQ201404. Registered with Maharashtra Paramedical Council. Practical training in clinical pathology, biochemistry, hematology, and diagnostic lab operations.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त व महाराष्ट्र पॅरामेडिकल कौन्सिलमध्ये नोंदणीकृत २ वर्षांचा डिप्लोमा.',
    duration: '2 Years',
    durationMr: '२ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
    eligibility: '12th Science / B.Sc. Appeared / Graduate',
    eligibilityMr: '१२वी सायन्स किंवा B.Sc. किंवा पदवीधर',
    subjects: [
      { name: 'Clinical Pathology & Biochemistry', code: '20140411' },
      { name: 'Microbiology & Serological Diagnostics', code: '20140412' },
      { name: 'Hematology & Blood Banking Techniques', code: '20140413' },
      { name: 'Histopathology & Lab Automation', code: '20140421' }
    ],
    syllabus: [
      'Clinical Pathology & Biochemistry [Code: 20140411]',
      'Microbiology & Serological Diagnostics [Code: 20140412]',
      'Hematology & Blood Banking Techniques [Code: 20140413]',
      'Histopathology & Lab Automation [Code: 20140421]'
    ],
    syllabusMr: [
      'क्लिनिकल पॅथॉलॉजी व बायोकेमिस्ट्री [कोड: 20140411]',
      'मायक्रोबायोलॉजी व सेरोलॉजी डायग्नोस्टिक्स [कोड: 20140412]',
      'हेमॅटॉलॉजी व ब्लड बँकिंग तंत्रज्ञान [कोड: 20140413]',
      'हिस्टोपॅथॉलॉजी व लॅब ऑटोमेशन [कोड: 20140421]'
    ],
    careerOpportunities: [
      'Registered Medical Laboratory Technician',
      'Pathology Lab & Diagnostic Center Supervisor',
      'Government & Private Hospital Lab Officer'
    ],
    careerOpportunitiesMr: [
      'नोंदणीकृत मेडिकल लॅब तंत्रज्ञ (पॅथॉलॉजिस्ट सहायक)',
      'स्वतःची पॅथॉलॉजी लॅब व कलेक्शन सेंटर',
      'शासकीय व खाजगी हॉस्पिटल लॅब ऑफिसर'
    ],
    certification: 'Maharashtra Paramedical Council Registered & MSBSVET Recognized',
    batchCapacity: 25,
    enrolled: 22
  },
  {
    id: 'health-sanitary-inspector',
    name: 'HEALTH SANITARY INSPECTOR (S.I.) – 1 YEAR',
    nameMr: 'हेल्थ सॅनेटरी इन्स्पेक्टर (स्वच्छता निरीक्षक S.I.)',
    code: 'MSBQ201238',
    category: 'Health & Sanitation',
    categoryMr: 'आरोग्य व स्वच्छता',
    description: 'Sanitary Inspector certification for Municipal Corporation, Public Health & Hospital Sanitation.',
    descriptionMr: 'हेल्थ सॅनेटरी इन्स्पेक्टर (स्वच्छता निरीक्षक S.I.)',
    fullDescription: 'Government-approved MSBSVET course MSBQ201238. Prepares students for Sanitary Inspector (S.I.) roles in Municipal Corporations, Railways, Public Health Dept, and Hospitals.',
    fullDescriptionMr: 'महाराष्ट्र राज्य कौशल्य विकास मंडळ (MSBSVET) मान्यता प्राप्त कोर्स (कोर्स कोड: MSBQ201238). स्वच्छता निरीक्षक पद भरतीसाठी उपयुक्त.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / College Student / Graduate',
    eligibilityMr: '१०वी किंवा १२वी किंवा कॉलेज विद्यार्थी किंवा पदवीधर',
    subjects: [
      { name: 'Public Health & Hygiene Standards', code: '20123811' },
      { name: 'Municipal Solid Waste & Sewage Management', code: '20123812' },
      { name: 'Water Purification & Epidemic Control', code: '20123813' },
      { name: 'Food Safety & Sanitation Inspection', code: '20123821' }
    ],
    syllabus: [
      'Public Health & Hygiene Standards [Code: 20123811]',
      'Municipal Solid Waste & Sewage Management [Code: 20123812]',
      'Water Purification & Epidemic Control [Code: 20123813]',
      'Food Safety & Sanitation Inspection [Code: 20123821]'
    ],
    syllabusMr: [
      'सार्वजनिक आरोग्य व स्वच्छता मानके [कोड: 20123811]',
      'घनकचरा व सांडपाणी व्यवस्थापन [कोड: 20123812]',
      'जलशुद्धीकरण व साथरोग नियंत्रण [कोड: 20123813]',
      'अन्न सुरक्षा व स्वच्छता तपासणी [कोड: 20123821]'
    ],
    careerOpportunities: [
      'Sanitary Inspector (Mahanagarpalika / Nagar Parishad)',
      'Public Health Department Hygiene Officer',
      'Indian Railways Sanitation Inspector'
    ],
    careerOpportunitiesMr: [
      'महानगरपालिका / नगरपरिषद स्वच्छता निरीक्षक',
      'सार्वजनिक आरोग्य विभाग स्वच्छता अधिकारी',
      'भारतीय रेल्वे स्वच्छता निरीक्षक'
    ],
    certification: 'MSBSVET Govt. Recognized & ISO 9001:2015 Certified',
    batchCapacity: 30,
    enrolled: 24
  },
  {
    id: 'computer-operator',
    name: 'COMPUTER OPERATOR & AI SKILLS (COPA) – 1 YEAR',
    nameMr: 'संगणक ऑपरेटर व एआय स्किल्स (COPA / MS-CIT / Tally GST)',
    code: 'MSBQ103001',
    category: 'Computer & IT',
    categoryMr: 'संगणक व आयटी',
    description: 'Computer operations, digital accounting with Tally GST, modern AI productivity tools & office automation.',
    descriptionMr: 'संगणक ऑपरेटर व एआय स्किल्स (COPA / MS-CIT / Tally GST)',
    fullDescription: 'MSBSVET Course Code MSBQ103001. 1-Year computer trade covering MS Office, Tally Prime with GST, AI productivity, Marathi typing, DTP, and web applications.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा संगणक कोर्स. एमएस ऑफिस, टॅली प्राईम जीएसटी, एआय टूल्स, मराठी टायपिंग व शासकीय भरतीसाठी पात्र.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '8:00 AM - 12:00 PM',
    timingMr: 'सकाळी ८:०० ते दुपारी १२:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / College Student / Graduate',
    eligibilityMr: '१०वी किंवा १२वी किंवा कॉलेज विद्यार्थी किंवा पदवीधर',
    subjects: [
      { name: 'Computer Fundamentals & OS', code: '10300111' },
      { name: 'Advanced MS Office & AI Tools', code: '10300112' },
      { name: 'Financial Accounting & Tally Prime GST', code: '10300113' },
      { name: 'Computer Lab Practical & Typing', code: '10300121' }
    ],
    syllabus: [
      'Computer Fundamentals & Operating Systems [Code: 10300111]',
      'Advanced MS Office Suite & AI Productivity Tools [Code: 10300112]',
      'Financial Accounting & Tally Prime with GST [Code: 10300113]',
      'Computer Lab Practical, Typing & Web Operations [Code: 10300121]'
    ],
    syllabusMr: [
      'संगणक मूलभूत ज्ञान व ऑपरेटिंग सिस्टीम्स [कोड: 10300111]',
      'ॲडव्हान्स एमएस ऑफिस व एआय टूल्स [कोड: 10300112]',
      'टॅली प्राईम विथ जीएसटी व फायनान्शियल अकाउंटिंग [कोड: 10300113]',
      'कॉम्प्युटर लॅब प्रॅक्टिकल, टायपिंग व इंटरनेट ऑपरेशन्स [कोड: 10300121]'
    ],
    careerOpportunities: [
      'Govt & Bank Data Entry Operator',
      'Tally GST Accountant & Office Executive',
      'IT Support & Digital Service Center Owner'
    ],
    careerOpportunitiesMr: [
      'शासकीय व बँक डेटा एन्ट्री ऑपरेटर',
      'टॅली जीएसटी अकाउंटंट व ऑफिस ॲडमिन',
      'आपले सरकार सेवा केंद्र / सीएससी चालक'
    ],
    certification: 'MSBSVET Govt. ITI Equivalent Certified',
    batchCapacity: 30,
    enrolled: 25
  },
  {
    id: 'diesel-mechanic',
    name: 'DIESEL MECHANIC – 1 YEAR',
    nameMr: 'डिझेल मेकॅनिक – १ वर्ष कालावधी (ऑटो इंजिनिअरिंग व मेकॅनिकल)',
    code: 'MSBQ102001',
    category: 'Mechanical Trades',
    categoryMr: 'मेकॅनिकल व ऑटोमोबाइल',
    description: 'Internal combustion engines, fuel injection systems, vehicle diagnostics & transmission repair.',
    descriptionMr: 'डिझेल मेकॅनिक – १ वर्ष कालावधी (ऑटो इंजिनिअरिंग व मेकॅनिकल)',
    fullDescription: 'MSBSVET Course Code MSBQ102001. 1-Year hands-on trade training on IC engines, fuel injection pumps, auto electricals, MSRTC bus maintenance, and commercial vehicle overhauling.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा मेकॅनिकल कोर्स. एसटी महामंडळ, रेल्वे, ऑटोमोबाइल वर्कशॉप व मेकॅनिक पदांसाठी पात्र.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th Standard Pass',
    eligibilityMr: '१०वी उत्तीर्ण',
    subjects: [
      { name: 'IC Engine Technology & Maintenance', code: '10200111' },
      { name: 'Fuel Injection Pumps & Injectors', code: '10200112' },
      { name: 'Auto Electrical Systems & Diagnostics', code: '10200113' },
      { name: 'Workshop Practical & Overhauling', code: '10200121' }
    ],
    syllabus: [
      'IC Engine Technology & Maintenance [Code: 10200111]',
      'Fuel Injection Pumps & Injectors [Code: 10200112]',
      'Auto Electrical Systems & Diagnostics [Code: 10200113]',
      'Workshop Practical & Overhauling [Code: 10200121]'
    ],
    syllabusMr: [
      'आय.सी. इंजिन तंत्रज्ञान व मेंटेनन्स [कोड: 10200111]',
      'फ्युएल इंजेक्शन पंप्स व इंजेक्टर्स [कोड: 10200112]',
      'ऑटो इलेक्ट्रिकल सिस्टीम व टेस्टिंग [कोड: 10200113]',
      'वर्कशॉप प्रॅक्टिकल व इंजिन ओव्हरहॉलिंग [कोड: 10200121]'
    ],
    careerOpportunities: [
      'MSRTC & Railway Workshop Mechanic',
      'Automobile Service Center Technician',
      'Commercial Vehicle Workshop Owner'
    ],
    careerOpportunitiesMr: [
      'एसटी महामंडळ व रेल्वे वर्कशॉप मेकॅनिक',
      'ऑटोमोबाइल सर्व्हिस सेंटर तंत्रज्ञ',
      'स्वतःचे व्यावसायिक वर्कशॉप'
    ],
    certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
    batchCapacity: 25,
    enrolled: 19
  },
  {
    id: 'fitter-turner',
    name: 'FITTER & TURNER – 1 YEAR',
    nameMr: 'फिटर व टर्नर – १ वर्ष कालावधी (मेकॅनिकल मशीनिंग व लेथ वर्क)',
    code: '104201',
    category: 'Mechanical Trades',
    categoryMr: 'मेकॅनिकल व ऑटोमोबाइल',
    description: 'Precision bench fitting, lathe machine operation, shaping, drilling & blueprint reading.',
    descriptionMr: 'फिटर व टर्नर – १ वर्ष कालावधी (मेकॅनिकल मशीनिंग व लेथ वर्क)',
    fullDescription: 'MSBSVET Course Code 104201. 1-Year mechanical workshop trade on precision measuring tools, lathe turning, threading, fitting assembly, and industrial fabrication.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा फिटर व टर्नर कोर्स. लेथ मशीन, थ्रेडिंग, प्रिसिजन फिटिंग व औद्योगिक उत्पादन कंपन्यांसाठी उपयुक्त.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th Standard Pass',
    eligibilityMr: '१०वी उत्तीर्ण',
    subjects: [
      { name: 'Workshop Theory & Precision Measuring', code: '10420111' },
      { name: 'Lathe Operation & Turning Practice', code: '10420112' },
      { name: 'Engineering Drawing & Blueprint Reading', code: '10420113' },
      { name: 'Machine Shop Practical', code: '10420121' }
    ],
    syllabus: [
      'Workshop Theory & Precision Measuring [Code: 10420111]',
      'Lathe Operation & Turning Practice [Code: 10420112]',
      'Engineering Drawing & Blueprint Reading [Code: 10420113]',
      'Machine Shop Practical [Code: 10420121]'
    ],
    syllabusMr: [
      'कार्यशाळा थियरी व प्रिसिजन मोजमापे [कोड: 10420111]',
      'लेथ मशीन ऑपरेशन व टर्निंग प्रॅक्टिस [कोड: 10420112]',
      'इंजिनिअरिंग ड्रॉइंग व ब्लूप्रिंट वाचन [कोड: 10420113]',
      'मशीन शॉप प्रॅक्टिकल [कोड: 10420121]'
    ],
    careerOpportunities: [
      'MIDC Industrial Lathe & Machine Operator',
      'Ordnance Factory & Defence Units Technician',
      'Precision Mechanical Workshop Owner'
    ],
    careerOpportunitiesMr: [
      'एमआयडीसी मॅन्युफॅक्चरिंग लेथ ऑपरेटर',
      'ऑर्डनन्स फॅक्टरी व डिफेन्स युनिट्स तंत्रज्ञ',
      'स्वतःचा फॅब्रिकेशन व मशीनिंग व्यवसाय'
    ],
    certification: 'MSBSVET Govt. ITI Equivalent Certified',
    batchCapacity: 25,
    enrolled: 20
  },
  {
    id: 'solar-technician',
    name: 'SOLAR ENERGY & EV TECHNICIAN – 1 YEAR',
    nameMr: 'सोलर एनर्जी व ईव्ही चार्जिंग तंत्रज्ञ – १ वर्ष कालावधी',
    code: '305201',
    category: 'Renewable Energy',
    categoryMr: 'सौर ऊर्जा व ईव्ही',
    description: 'Solar PV rooftop installation, grid-tied inverters, net metering & EV charging station maintenance.',
    descriptionMr: 'सोलर एनर्जी व ईव्ही चार्जिंग तंत्रज्ञ – १ वर्ष कालावधी',
    fullDescription: 'MSBSVET Course Code 305201. 1-Year modern trade on Solar Rooftop System designing, PM Surya Ghar Muft Bijli Yojana installation, inverters, and EV charging station setup.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा सोलर व ईव्ही कोर्स. पीएम सूर्यघर योजना, सोलर पॅनेल इन्स्टॉलेशन, नेट मीटरिंग व ईव्ही चार्जिंग स्टेशन उभारणी.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th / 12th / ITI Pass',
    eligibilityMr: '१०वी किंवा १२वी किंवा आयटीआय उत्तीर्ण',
    subjects: [
      { name: 'Solar PV Systems & Sizing', code: '30520111' },
      { name: 'Inverters, Battery Storage & Net Metering', code: '30520112' },
      { name: 'EV Charging Stations & Electrical Safety', code: '30520113' },
      { name: 'Rooftop Solar Installation Practical', code: '30520121' }
    ],
    syllabus: [
      'Solar PV Systems & Sizing [Code: 30520111]',
      'Inverters, Battery Storage & Net Metering [Code: 30520112]',
      'EV Charging Stations & Electrical Safety [Code: 30520113]',
      'Rooftop Solar Installation Practical [Code: 30520121]'
    ],
    syllabusMr: [
      'सौर फोटोव्होल्टेईक प्रणाली व डिझायनिंग [कोड: 30520111]',
      'इन्व्हर्टर, बॅटरी स्टोरेज व नेट मीटरिंग [कोड: 30520112]',
      'ईव्ही चार्जिंग स्टेशन व सुरक्षा [कोड: 30520113]',
      'रूफटॉप सोलर इन्स्टॉलेशन प्रॅक्टिकल [कोड: 30520121]'
    ],
    careerOpportunities: [
      'Certified Solar Rooftop EPC Contractor',
      'PM Surya Ghar Scheme Authorized Installer',
      'EV Station Maintenance Specialist'
    ],
    careerOpportunitiesMr: [
      'सौर ऊर्जा रूफटॉप अधिकृत कंत्राटदार',
      'पीएम सूर्यघर योजना मान्यताप्राप्त इन्स्टॉलर',
      'ईव्ही चार्जिंग स्टेशन मेंटेनन्स तंत्रज्ञ'
    ],
    certification: 'MSBSVET Govt. Recognized Certified',
    batchCapacity: 30,
    enrolled: 23
  },
  {
    id: 'ac-refrigeration',
    name: 'AC & REFRIGERATION MECHANIC – 1 YEAR',
    nameMr: 'एसी व रेफ्रिजरेशन मेकॅनिक – १ वर्ष कालावधी',
    code: '303201',
    category: 'HVAC & Cooling',
    categoryMr: 'एसी व रेफ्रिजरेशन',
    description: 'Split & Inverter AC installation, gas charging, refrigerator troubleshooting & industrial HVAC.',
    descriptionMr: 'एसी व रेफ्रिजरेशन मेकॅनिक – १ वर्ष कालावधी',
    fullDescription: 'MSBSVET Course Code 303201. 1-Year hands-on trade training on Inverter AC PCB testing, copper pipe brazing, compressor overhauling, leak testing, and cold storage refrigeration.',
    fullDescriptionMr: 'महाराष्ट्र शासन MSBSVET मान्यताप्राप्त १ वर्षाचा एसी व रेफ्रिजरेटर कोर्स. इन्व्हर्टर एसी, गॅस चार्जिंग, ब्रेझिंग व व्यावसायिक कुलिंग सिस्टीम्स.',
    duration: '1 Year',
    durationMr: '१ वर्ष कालावधी',
    timing: '10:00 AM - 2:00 PM',
    timingMr: 'सकाळी १०:०० ते दुपारी २:००',
    startDate: 'प्रवेश सुरू (Admissions Open)',
    startDateMr: 'प्रवेश सुरू (Admissions Open)',
    admissionsOpen: true,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    eligibility: '10th Standard Pass',
    eligibilityMr: '१०वी उत्तीर्ण',
    subjects: [
      { name: 'Refrigeration Cycle & Thermodynamics', code: '30320111' },
      { name: 'Split & Inverter AC Systems', code: '30320112' },
      { name: 'Gas Charging & Leak Testing', code: '30320113' },
      { name: 'HVAC Workshop Practical & Brazing', code: '30320121' }
    ],
    syllabus: [
      'Refrigeration Cycle & Thermodynamics [Code: 30320111]',
      'Split & Inverter AC Systems [Code: 30320112]',
      'Gas Charging, Recovery & Leak Testing [Code: 30320113]',
      'HVAC Workshop Practical & Brazing [Code: 30320121]'
    ],
    syllabusMr: [
      'रेफ्रिजरेशन सायकल व थर्माडायनामिक्स [कोड: 30320111]',
      'स्प्लिट व इन्व्हर्टर एसी कार्यप्रणाली [कोड: 30320112]',
      'गॅस चार्जिंग, रिकव्हरी व लिक टेस्टिंग [कोड: 30320113]',
      'एचव्हीएसी वर्कशॉप प्रॅक्टिकल व कॉपर ब्रेझिंग [कोड: 30320121]'
    ],
    careerOpportunities: [
      'Authorized HVAC & AC Service Franchise Owner',
      'Commercial Cold Storage Maintenance Technician',
      'Corporate AMC Cooling Specialist'
    ],
    careerOpportunitiesMr: [
      'अधिकृत एसी सर्व्हिस सेंटर चालक',
      'कमर्शियल कोल्ड स्टोरेज मेंटेनन्स तंत्रज्ञ',
      'कॉर्पोरेट कुलिंग व एसी एएमसी तंत्रज्ञ'
    ],
    certification: 'MSBSVET Govt. Recognized & ITI Equivalent',
    batchCapacity: 25,
    enrolled: 21
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Admissions Open for New Batches',
    titleMr: 'नवीन बॅचेससाठी प्रवेश सुरू आहेत',
    description: 'Admissions are now open for the upcoming October and November batches with special scholarship support for merit students.',
    descriptionMr: 'ऑक्टोबर आणि नोव्हेंबरच्या आगामी बॅचेससाठी प्रवेश सुरू झाले आहेत.',
    tag: 'Admissions',
    date: 'Active',
    icon: 'notifications',
    isNew: true
  },
  {
    id: 'ann-2',
    title: 'New Batch Starting Soon',
    titleMr: 'नवीन बॅच लवकरच सुरू होत आहे',
    description: 'Industrial wiring and electrical maintenance course begins next week. Limited seats available in the morning batch.',
    descriptionMr: 'औद्योगिक वायरिंग आणि इलेक्ट्रिकल मेंटेनन्स कोर्स पुढील आठवड्यात सुरू होत आहे.',
    tag: 'Batches',
    date: 'Starting Next Week',
    icon: 'bolt',
    isNew: true
  },
  {
    id: 'ann-3',
    title: 'Important Notice for Students',
    titleMr: 'विद्यार्थ्यांसाठी महत्त्वाची सूचना',
    description: 'Online Certificate Verification portal is now active for all current students and alumni with instant QR verification.',
    descriptionMr: 'सर्व माजी आणि चालू विद्यार्थ्यांसाठी ऑनलाइन प्रमाणपत्र पडताळणी पोर्टल आता सुरू झाले आहे.',
    tag: 'Notice',
    date: 'System Update',
    icon: 'info',
    isNew: true
  },
  {
    id: 'ann-4',
    title: 'Campus Placement Drive 2026',
    titleMr: 'कॅम्पस प्लेसमेंट मोहीम २०२६',
    description: 'Top industrial manufacturing companies from Jalgaon, Pune & Nashik visiting ATI campus next month for hiring certified technicians.',
    descriptionMr: 'जळगाव, पुणे आणि नाशिकमधील आघाडीच्या औद्योगिक कंपन्या पुढील महिन्यात कॅम्पसला भेट देणार आहेत.',
    tag: 'Placements',
    date: 'Upcoming',
    icon: 'work',
    isNew: false
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Kiran Vispute',
    course: 'MS-CIT & Computer',
    rating: 5,
    comment: "My MScIT experience was a rollercoaster! It's definitely a program that throws you into the deep end, covering a huge range of topics in a short time. Best class in Jalgaon district.",
    commentMr: 'माझा MS-CIT चा अनुभव खूप छान राहिला! जळगाव जिल्ह्यातील सर्वोत्तम क्लास.',
    commentHi: 'मेरा MS-CIT का अनुभव बहुत शानदार रहा! जलगांव जिले में सबसे बेहतरीन क्लास।',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    date: '17th March 2025',
    category: 'Practical Training'
  },
  {
    id: 'rev-2',
    name: 'Shubham',
    course: 'Technical & Vocational',
    rating: 5,
    comment: 'Abhinav Technical Institute is only one Class (institute) for all Type Courses fully study. Patil Sir Guidelines is right way and best suggestions. Best Class For all Courses and helpful any courses requirements to visit Abhinav Technical Institute Jalgaon. Highly specialist and good teaching staff thank you for this kind of teaching.',
    commentMr: 'अभिनव टेक्निकल इन्स्टिट्यूट हे सर्व प्रकारच्या कोर्सेससाठी जळगावमधील एकमेव सर्वोत्तम केंद्र आहे. पाटील सरांचे मार्गदर्शन खूप उत्तम आहे.',
    commentHi: 'अभिनव टेक्निकल इंस्टीट्यूट जलगांव में सभी प्रकार के टेक्निकल कोर्सेस के लिए सर्वश्रेष्ठ संस्थान है। पाटिल सर का मार्गदर्शन बहुत ही उत्तम है।',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    date: '22nd February 2023',
    category: 'Helpful Teachers'
  },
  {
    id: 'rev-3',
    name: 'Rahul',
    course: 'Electrician Trade',
    rating: 5,
    comment: 'This institute is bright the future of student thus me and my friend is bright future thank you Abhinav Technical Institute Jalgaon.',
    commentMr: 'या इन्स्टिट्यूटमुळे माझे आणि माझ्या मित्रांचे भविष्य उज्ज्वल झाले. खूप खूप धन्यवाद अभिनव टेक्निकल इन्स्टिट्यूट!',
    commentHi: 'इस इंस्टीट्यूट ने मेरा और मेरे दोस्तों का भविष्य उज्ज्वल बनाया। धन्यवाद अभिनव टेक्निकल इंस्टीट्यूट!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    date: '6th September 2017',
    category: 'Career Guidance'
  },
  {
    id: 'rev-4',
    name: 'Nikhil Patil',
    course: 'Electrician Practical',
    rating: 5,
    comment: 'This institute is bright future and career for student this student is bright future my and my friends thanks Abhinav Technical Institute.',
    commentMr: 'विद्यार्थ्यांच्या करिअरसाठी अत्यंत उत्तम संस्था. धन्यवाद अभिनव टेक्निकल इन्स्टिट्यूट.',
    commentHi: 'छात्रों के करियर के लिए अत्यंत उत्तम संस्थान। धन्यवाद अभिनव टेक्निकल इंस्टीट्यूट।',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    date: '1st September 2017',
    category: 'Practical Training'
  },
  {
    id: 'rev-5',
    name: 'Adil Shaikh',
    course: 'Technical Vocational',
    rating: 5,
    comment: '(ABHINAV TECHNICAL INSTITUTE) is the best technical institute in Jalgaon Maharashtra...',
    commentMr: 'अभिनव टेक्निकल इन्स्टिट्यूट ही जळगाव महाराष्ट्रातील सर्वोत्तम तांत्रिक शिक्षण संस्था आहे.',
    commentHi: 'अभिनव टेक्निकल इंस्टीट्यूट जलगांव महाराष्ट्र का सर्वश्रेष्ठ तकनीकी शिक्षण संस्थान है।',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    date: '7th July 2018',
    category: 'Student Support'
  },
  {
    id: 'rev-6',
    name: 'Om Kailas Gurav',
    course: 'Electrician Trade',
    rating: 5,
    comment: 'Excellent electrical training institute with 100% practical lab experience.',
    commentMr: 'इलेक्ट्रिशियन ट्रेडसाठी अत्यंत उत्कृष्ट प्रॅक्टिकल संस्था.',
    commentHi: 'इलेक्ट्रिशियन ट्रेड के लिए उत्कृष्ट प्रैक्टिकल संस्थान।',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    date: '23rd October 2020',
    category: 'Practical Training'
  },
  {
    id: 'rev-7',
    name: 'Kishor',
    course: 'Electrician ITI',
    rating: 5,
    comment: 'Excellent ITI Institute for Electrician Trade and practical workshops.',
    commentMr: 'इलेक्ट्रिशियन ट्रेडचे उत्तम प्रात्यक्षिक प्रशिक्षण.',
    commentHi: 'इलेक्ट्रिशियन ट्रेड का बेहतरीन प्रैक्टिकल प्रशिक्षण।',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    date: '19th August 2020',
    category: 'Practical Training'
  },
  {
    id: 'rev-8',
    name: 'Bhagyashri Patil',
    course: 'Construction Supervisor ITI',
    rating: 5,
    comment: 'Best Construction Supervisor & Computer Training ITI Institute in Jalgaon.',
    commentMr: 'कन्स्ट्रक्शन सुपरवायझर व संगणक प्रशिक्षणासाठी उत्तम संस्था.',
    commentHi: 'कंस्ट्रक्शन सुपरवाइजर व कंप्यूटर प्रशिक्षण के लिए सर्वश्रेष्ठ संस्थान।',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    date: '19th August 2020',
    category: 'Helpful Teachers'
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Where is Abhinav Technical Institute located in Jalgaon?',
    questionMr: 'अभिनव टेक्निकल इन्स्टिट्यूट जळगावमध्ये कुठे स्थित आहे?',
    questionHi: 'अभिनव टेक्निकल इंस्टीट्यूट जलगांव में कहां स्थित है?',
    answer: 'Abhinav Technical Institute is located at First Floor, Mansing Market, near railway station, Jalgaon, Maharashtra 425001, India.',
    answerMr: 'अभिनव टेक्निकल इन्स्टिट्यूट पहिला मजला, मानसिंग मार्केट, रेल्वे स्टेशनजवळ, जळगाव, महाराष्ट्र ४२५००१, भारत येथे स्थित आहे.',
    answerHi: 'अभिनव टेक्निकल इंस्टीट्यूट पहली मंजिल, मानसिंह मार्केट, रेलवे स्टेशन के पास, जलगांव, महाराष्ट्र ४२५००१, भारत में स्थित है।'
  },
  {
    id: 'faq-2',
    question: 'When was Abhinav Technical Institute established?',
    questionMr: 'अभिनव टेक्निकल इन्स्टिट्यूटची स्थापना कधी झाली?',
    questionHi: 'अभिनव टेक्निकल इंस्टीट्यूट की स्थापना कब हुई थी?',
    answer: 'Abhinav Technical Institute was established in the year 1997, offering over 27+ years of excellence in vocational skill development, computer IT, and ITI technical trade education.',
    answerMr: 'अभिनव टेक्निकल इन्स्टिट्यूटची स्थापना १९९७ मध्ये झाली असून, ही संस्था मागील २७+ वर्षांपासून तांत्रिक, संगणक व आयटीआय ट्रेड्स शिक्षणात कार्यरत आहे.',
    answerHi: 'अभिनव टेक्निकल इंस्टीट्यूट की स्थापना वर्ष १९९७ में हुई थी और यह पिछले २७+ वर्षों से तकनीकी, कंप्यूटर और आईटीआई ट्रेड्स शिक्षा प्रदान कर रहा है।'
  },
  {
    id: 'faq-3',
    question: 'What courses are offered at Abhinav Technical Institute?',
    questionMr: 'अभिनव टेक्निकल इन्स्टिट्यूटमध्ये कोणते अभ्यासक्रम उपलब्ध आहेत?',
    questionHi: 'अभिनव टेक्निकल इंस्टीट्यूट में कौन-कौन से पाठ्यक्रम उपलब्ध हैं?',
    answer: 'The institute offers ITI Electrician, Wireman, Welder, COPA (Computer Operator & Programming Assistant), MS-CIT, Tally Prime & GST, DTP, Construction Supervisor, and Solar Energy Technician courses.',
    answerMr: 'इन्स्टिट्यूटमध्ये आयटीआय इलेक्ट्रिशियन, वायरमन, वेल्डर, कोपा (COPA), एमएस-सीआयटी, टॅली प्राईम, डीटीपी, कन्स्ट्रक्शन सुपरवायझर व सोलर टेक्नॉलॉजी कोर्सेस उपलब्ध आहेत.',
    answerHi: 'संस्थान में आईटीआई इलेक्ट्रिशियन, वायरमैन, वेल्डर, कोपा (COPA), एमएस-सीआईटी, टैली प्राइम, डीटीपी, कंस्ट्रक्शन सुपरवाइजर व सोलर टेक्नोलॉजी कोर्सेस उपलब्ध हैं।'
  },
  {
    id: 'faq-4',
    question: 'Are the certificates issued by Abhinav Technical Institute government recognized?',
    questionMr: 'अभिनव इन्स्टिट्यूटची प्रमाणपत्रे शासनमान्य आहेत का?',
    questionHi: 'क्या अभिनव इंस्टीट्यूट के प्रमाणपत्र सरकारी मान्यता प्राप्त हैं?',
    answer: 'Yes, Abhinav Technical Institute is a Government Recognized & ISO 9001:2015 Certified institute. All trade certificates are 100% valid for government jobs and private sector employment across India.',
    answerMr: 'होय, अभिनव टेक्निकल इन्स्टिट्यूट ही शासनमान्य आणि ISO 9001:2015 प्रमाणित संस्था आहे. सर्व प्रमाणपत्रे शासकीय व खाजगी नोकरीसाठी वैध आहेत.',
    answerHi: 'हां, अभिनव टेक्निकल इंस्टीट्यूट सरकारी मान्यता प्राप्त और ISO 9001:2015 प्रमाणित संस्थान है। सभी प्रमाणपत्र सरकारी और निजी नौकरियों के लिए मान्य हैं।'
  },
  {
    id: 'faq-5',
    question: 'What are the office visiting hours and batch timings?',
    questionMr: 'कार्यालयीन वेळ आणि बॅचची वेळ काय आहे?',
    questionHi: 'कार्यालय का समय और बैच का समय क्या है?',
    answer: 'The institute office is open Monday through Saturday from 09:00 AM to 06:00 PM. Flexible morning, afternoon, and evening batch timings are available for students.',
    answerMr: 'इन्स्टिट्यूट कार्यालय सोमवार ते शनिवार सकाळी ९:०० ते संध्याकाळी ६:०० वाजेपर्यंत उघडे असते. विद्यार्थ्यांसाठी सकाळ व संध्याकाळच्या लवचिक बॅचेस उपलब्ध आहेत.',
    answerHi: 'संस्थान कार्यालय सोमवार से शनिवार सुबह ९:०० बजे से शाम ६:०० बजे तक खुला रहता है। छात्रों के लिए सुबह और शाम के फ्लेक्सिबल बैच समय उपलब्ध हैं।'
  },
  {
    id: 'faq-6',
    question: 'What is the customer rating of Abhinav Technical Institute on JustDial?',
    questionMr: 'जस्टडायलवर अभिनव इन्स्टिट्यूटला किती रेटिंग आहे?',
    questionHi: 'जस्टडायल पर अभिनव इंस्टीट्यूट की रेटिंग क्या है?',
    answer: 'Abhinav Technical Institute holds a top rating of 4.4 out of 5 stars based on 142+ verified customer ratings & student reviews on JustDial.',
    answerMr: 'जस्टडायलवर १४२+ पडताळणी केलेल्या विद्यार्थ्यांच्या रिव्ह्यूजच्या आधारे अभिनव इन्स्टिट्यूटला ४.४ स्टार्स रेटिंग मिळाले आहे.',
    answerHi: 'जस्टडायल पर १४२+ सत्यापित छात्रों की समीक्षाओं के आधार पर अभिनव इंस्टीट्यूट को ४.४ स्टार्स रेटिंग प्राप्त है।'
  },
  {
    id: 'faq-7',
    question: 'How can I verify my certificate online?',
    questionMr: 'मी माझे प्रमाणपत्र ऑनलाइन कसे तपासू शकतो?',
    questionHi: 'मैं अपना प्रमाणपत्र ऑनलाइन कैसे सत्यापित कर सकता हूं?',
    answer: 'You can instantly verify your certificate by entering your Registration / Roll Number in the "Certificate Verification" section on this website or by scanning the QR code printed on your certificate.',
    answerMr: 'तुम्ही या वेबसाइटवरील "प्रमाणपत्र पडताळणी" टूलमध्ये तुमचा रजिस्ट्रेशन / रोल नंबर टाकून किंवा प्रमाणपत्रावरील QR कोड स्कॅन करून लगेच तपासू शकता.',
    answerHi: 'आप इस वेबसाइट पर "प्रमाणपत्र सत्यापन" अनुभाग में अपना पंजीकरण / रोल नंबर दर्ज करके या प्रमाणपत्र पर मुद्रित क्यूआर कोड को स्कैन करके तुरंत सत्यापित कर सकते हैं।'
  }
];

export const MOCK_CERTIFICATES: Record<string, StudentCertificate> = {
  'ATI/2025/1042': {
    regNumber: 'ATI/2025/1042',
    studentName: 'Akash D. Patil',
    courseName: 'Electrician & Industrial Wiring',
    grade: 'A+ (Distinction)',
    percentage: '89.4%',
    issueDate: '15 June 2025',
    validUntil: 'Lifetime Valid',
    status: 'Valid',
    instituteCenter: 'Abhinav Technical Institute, Mansing Market, Jalgaon'
  },
  'ATI/2025/2088': {
    regNumber: 'ATI/2025/2088',
    studentName: 'Pooja S. Sonawane',
    courseName: 'Computer Operator and Programming Assistant (COPA)',
    grade: 'A+ (Distinction)',
    percentage: '92.0%',
    issueDate: '10 July 2025',
    validUntil: 'Lifetime Valid',
    status: 'Valid',
    instituteCenter: 'Abhinav Technical Institute, Mansing Market, Jalgaon'
  },
  'ATI/2025/3150': {
    regNumber: 'ATI/2025/3150',
    studentName: 'Ramesh B. More',
    courseName: 'Commercial Wireman Specialist',
    grade: 'A',
    percentage: '84.5%',
    issueDate: '20 August 2025',
    validUntil: 'Lifetime Valid',
    status: 'Valid',
    instituteCenter: 'Abhinav Technical Institute, Mansing Market, Jalgaon'
  },
  'ATI-101': {
    regNumber: 'ATI-101',
    studentName: 'Ganesh V. Chaudhari',
    courseName: 'Industrial Welding & Fabrication (Welder)',
    grade: 'A',
    percentage: '86.2%',
    issueDate: '05 September 2025',
    validUntil: 'Lifetime Valid',
    status: 'Valid',
    instituteCenter: 'Abhinav Technical Institute, Mansing Market, Jalgaon'
  }
};
