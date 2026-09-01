import { COURSES, HERO_CAROUSEL_IMAGES } from '../data/instituteData';
import type { Course } from '../types';

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  titleMr?: string;
  category: string;
  categoryMr?: string;
}

export interface AwardMediaItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  title: string;
  titleMr?: string;
  description?: string;
  descriptionMr?: string;
  badge?: string;
}

export interface AwardsSectionData {
  badge: string;
  badgeMr: string;
  heading: string;
  headingMr: string;
  subheading: string;
  subheadingMr: string;
  mainAwardTitle: string;
  mainAwardTitleMr: string;
  presentedBy: string;
  presentedByMr: string;
  recipientName: string;
  recipientNameMr: string;
  recipientRole: string;
  recipientRoleMr: string;
  year: string;
  description: string;
  descriptionMr: string;
  highlightPoints: { en: string; mr: string }[];
  featuredVideo: {
    src: string;
    title: string;
    titleMr: string;
    subtitle: string;
    subtitleMr: string;
  };
  gallery: AwardMediaItem[];
}

export interface SiteContent {
  hero: {
    badgeText: string;
    badgeTextMr: string;
    badgeTextHi: string;
    heading: string;
    headingMr: string;
    headingHi: string;
    subheading: string;
    subheadingMr: string;
    subheadingHi: string;
    carouselImages: {
      src: string;
      alt: string;
      title: string;
      titleMr?: string;
      category: string;
      categoryMr?: string;
      desc?: string;
      descMr?: string;
    }[];
  };
  contact: {
    phone: string;
    phoneAlt: string;
    whatsapp: string;
    email: string;
    address: string;
    addressMr: string;
    timing: string;
    timingMr: string;
    googleMapsEmbedUrl: string;
  };
  about: {
    principalName: string;
    principalTitle: string;
    principalPhoto: string;
    directorMessage: string;
    directorMessageMr: string;
    statsYears: string;
    statsAlumni: string;
    statsLabs: string;
    statsTrades: string;
  };
  awards: AwardsSectionData;
  courses: Course[];
  gallery: GalleryItem[];
}

export const INITIAL_AWARDS_CONTENT: AwardsSectionData = {
  badge: 'Prestigious Recognition & State Honors',
  badgeMr: 'विशेष राज्यस्तरीय गौरव व सन्मान',
  heading: 'Lokmat Lokratna Sanman Award 2026',
  headingMr: 'लोकमत लोकरत्न सन्मान सोहळा २०२६',
  subheading:
    'State-level prestigious recognition awarded by Lokmat Media Group & Godavari Foundation for 26+ years of stellar contribution in technical education and youth employment.',
  subheadingMr:
    'तंत्रशिक्षण, कौशल्य विकास आणि हजारो तरुणांच्या रोजगार निर्मितीतील २६+ वर्षांच्या उल्लेखनीय व निस्वार्थ सेवेबद्दल लोकमत वृत्तपत्र समूह व गोदावरी फाउंडेशन तर्फे विशेष सन्मान!',
  mainAwardTitle: 'Lokmat Lokratna Award 2026',
  mainAwardTitleMr: 'लोकमत लोकरत्न पुरस्कार २०२६',
  presentedBy: 'Lokmat Media Group & Godavari Foundation',
  presentedByMr: 'सन्माननीय लोकमत वृत्तपत्र समूह व गोदावरी फाउंडेशन',
  recipientName: 'Prof. P. R. Patil',
  recipientNameMr: 'प्रा. पी. आर. पाटील',
  recipientRole: 'Founder & Principal, Abhinav Technical Institute, Jalgaon',
  recipientRoleMr: 'संस्थापक व संचालक, अभिनव टेक्निकल इन्स्टिट्यूट, जळगाव',
  year: '2026',
  description:
    'In recognition of outstanding dedication towards vocational skills training, practical workshop excellence, and empowering rural & urban youth with career and self-employment opportunities.',
  descriptionMr:
    'गेल्या २६ वर्षांपासून खान्देश व संपूर्ण महाराष्ट्रातील हजारो विद्यार्थ्यांना आधुनिक उपकरणांवर प्रत्यक्ष प्रॅक्टिकल तांत्रिक प्रशिक्षण देऊन त्यांना स्वतःच्या पायावर उभे करण्याचे व उद्योग-व्यवसायात यशस्वी करण्याचे अविरत कार्य केल्याबद्दल हा सर्वोच्च सन्मान प्रदान करण्यात आला.',
  highlightPoints: [
    {
      en: '26+ Years of Proven Excellence in Technical & Skill Education',
      mr: 'तांत्रिक शिक्षण व प्रॅक्टिकल कौशल्य विकासातील २६+ वर्षांचे अखंड योगदान',
    },
    {
      en: '5,000+ Students Successfully Placed & Self-Employed Across Maharashtra',
      mr: '५,०००+ विद्यार्थ्यांना प्रत्यक्ष प्रॅक्टिकल प्रशिक्षण व १००% रोजगार मार्गदर्शन',
    },
    {
      en: 'Grand Felicitation on Stage by Renowned Leaders & Education Dignitaries',
      mr: 'राज्यातील मान्यवर नेते, शिक्षणतज्ज्ञ व मान्यवरांच्या शुभहस्ते सन्मानपत्र व मानचिन्ह प्रदान',
    },
    {
      en: 'Leading Pioneer of Govt.-Recognized Vocational Trades in North Maharashtra',
      mr: 'उत्तर महाराष्ट्रात १०वी व १२वी नंतरच्या रोजगाराभिमुख तांत्रिक शिक्षणाचा अग्रगण्य दीपस्तंभ',
    },
  ],
  featuredVideo: {
    src: '/assets/awards/lokmat_award_reel.mp4',
    title: 'Lokmat Lokratna Award Ceremony Video Reel',
    titleMr: 'लोकमत लोकरत्न सन्मान सोहळा - विशेष व्हिडिओ रील',
    subtitle: 'Watch the grand award ceremony moments and felicitation of Principal Prof. P. R. Patil',
    subtitleMr: 'मुख्य मंचावरील भव्य सन्मान सोहळा आणि प्राचार्य प्रा. पी. आर. पाटील यांच्या सत्काराचे क्षणचित्रे',
  },
  gallery: [
    {
      id: 'award-img-4',
      type: 'image',
      src: '/assets/awards/lokmat_award_4.jpg',
      title: 'Principal Prof. P. R. Patil with the Prestigious Lokmat Lokratna Trophy',
      titleMr: 'प्रा. पी. आर. पाटील - लोकमत लोकरत्न सन्मान ट्रॉफी स्वीकारताना',
      description: 'Proud moment with the official trophy and certificate of honor.',
      descriptionMr: 'लोकमत वृत्तपत्र समूहाचे अधिकृत सन्मानचिन्ह व सन्मानपत्रासह संस्थापक प्राचार्य.',
      badge: 'Trophy Moment',
    },
    {
      id: 'award-img-3',
      type: 'image',
      src: '/assets/awards/lokmat_award_3.jpg',
      title: 'Stage Felicitation by Dignitaries & Guests of Honor',
      titleMr: 'मान्यवरांच्या हस्ते मुख्य मंचावर सन्मान सोहळा',
      description: 'Felicitated on the grand stage of Lokmat Lokratna Sanman Sohala 2026.',
      descriptionMr: 'भव्य मंचावर मान्यवरांच्या शुभहस्ते शाल, श्रीफळ व मानचिन्ह देऊन गौरव.',
      badge: 'Main Stage',
    },
    {
      id: 'award-img-1',
      type: 'image',
      src: '/assets/awards/lokmat_award_1.jpg',
      title: 'Abhinav Technical Institute Team & Dignitaries at the Event',
      titleMr: 'अभिनव टेक्निकल इन्स्टिट्यूट परिवार - सन्मान सोहळा',
      description: 'Group photograph commemorating the prestigious state-level award.',
      descriptionMr: 'अभिनव टेक्निकल इन्स्टिट्यूट परिवाराचा सन्मान सोहळ्यातील आनंदोत्सव.',
      badge: 'Celebration',
    },
    {
      id: 'award-img-5',
      type: 'image',
      src: '/assets/awards/lokmat_award_5.jpg',
      title: 'Commemoration with Family & Well-wishers',
      titleMr: 'कुटुंब व हितचिंतकांसह संस्मरणीय क्षण',
      description: 'Cherished memories of the award celebration ceremony.',
      descriptionMr: 'सन्मान सोहळ्यानंतर कुटुंबीय व सहकाऱ्यांसोबत आनंददायी क्षण.',
      badge: 'Memories',
    },
    {
      id: 'award-img-2',
      type: 'image',
      src: '/assets/awards/lokmat_award_2.jpg',
      title: 'Grand Welcome & Stage Entrance at Lokmat Lokratna 2026',
      titleMr: 'मंचाकडे आगमन व गौरव सोहळा प्रवेश',
      description: 'Welcome and felicitation procession at the award venue.',
      descriptionMr: 'सन्मान सोहळ्यातील पारंपरिक फेटा व आदरातिथ्यासह आगमन.',
      badge: 'Grand Entrance',
    },
  ],
};

export const INITIAL_SITE_CONTENT: SiteContent = {
  hero: {
    badgeText: 'Govt. Recognized & ISO 9001:2015 Certified',
    badgeTextMr: 'शासनमान्य व ISO 9001:2015 प्रमाणित संस्था',
    badgeTextHi: 'सरकारी मान्यता प्राप्त एवं ISO 9001:2015 प्रमाणित',
    heading: 'Master Practical Technical Skills for a Secure Career',
    headingMr: 'प्रत्यक्ष प्रात्यक्षिक व तांत्रिक प्रशिक्षणातून घडवा तुमचे उज्ज्वल भविष्य',
    headingHi: 'व्यावहारिक तकनीकी प्रशिक्षण के साथ बनाएं सुरक्षित भविष्य',
    subheading:
      'Abhinav Technical Institute Jalgaon provides 100% hands-on industry training across 10 in-demand vocational trades with guaranteed placement support.',
    subheadingMr:
      'अभिनव टेक्निकल इन्स्टिट्यूट जळगाव — १० वी व १२ वी नंतरच्या रोजगाराभिमुख १० टेक्निकल ट्रेड्सचे दर्जेदार प्रॅक्टिकल ट्रेनिंग व १००% प्लेसमेंट मार्गदर्शन.',
    subheadingHi:
      'अभिनव टेक्निकल इंस्टीट्यूट जलगांव — 10वीं और 12वीं के बाद 10 रोजगारोन्मुखी टेक्निकल ट्रेड्स का व्यावहारिक प्रशिक्षण और प्लेसमेंट सहायता।',
    carouselImages: HERO_CAROUSEL_IMAGES,
  },
  contact: {
    phone: '+91 94234 88174',
    phoneAlt: '+91 98227 25265',
    whatsapp: '919423488174',
    email: 'info@abhinavjalgaon.com',
    address: 'Abhinav Technical Institute, Near Mansing Market, Navi Peth, Jalgaon – 425001, Maharashtra',
    addressMr: 'अभिनव टेक्निकल इन्स्टिट्यूट, मानसिंग मार्केट जवळ, नवी पेठ, जळगाव – ४२५००१, महाराष्ट्र',
    timing: 'Monday – Saturday: 8:00 AM – 7:00 PM',
    timingMr: 'सोमवार ते शनिवार: सकाळी ८:०० ते संध्याकाळी ७:००',
    googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Navi+Peth+Jalgaon&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  about: {
    principalName: 'Prof. P. R. Patil',
    principalTitle: 'Founder & Principal Director',
    principalPhoto: '/assets/awards/lokmat_award_4.jpg',
    directorMessage:
      'Since 1999, our mission has been to transform aspiring youth into highly skilled, employable technical professionals through rigorous hands-on workshop training and discipline.',
    directorMessageMr:
      '१९९९ पासून आमचा एकच ध्यास आहे — ग्रामीण व शहरी भागातील विद्यार्थ्यांना आधुनिक उपकरणांवर प्रत्यक्ष प्रॅक्टिकल शिकवून त्यांना स्वतःच्या पायावर उभे करणे.',
    statsYears: '26+',
    statsAlumni: '5,000+',
    statsLabs: '6+',
    statsTrades: '10',
  },
  awards: INITIAL_AWARDS_CONTENT,
  courses: COURSES,
  gallery: [
    {
      id: 'gal-1',
      src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-colleges-fqdkck51aj.jpg',
      alt: 'Computer Training & IT Practical Lab',
      title: 'Computer IT Lab Workstation',
      titleMr: 'संगणक प्रशिक्षण लॅब',
      category: 'Computer',
      categoryMr: 'संगणक व आयटी',
    },
    {
      id: 'gal-2',
      src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-9u76812boe.jpg',
      alt: 'Electrical Engineering Workshop',
      title: 'Electrical Machine & Motor Panel Lab',
      titleMr: 'इलेक्ट्रिकल मशीन व मोटर पॅनेल कार्यशाळा',
      category: 'Electrical',
      categoryMr: 'इलेक्ट्रिकल ट्रेड',
    },
    {
      id: 'gal-3',
      src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-xsn20b070w.jpg',
      alt: 'Commercial Wiring Simulation Bench',
      title: 'Commercial & Domestic Wiring Workbench',
      titleMr: 'घरगुती व औद्योगिक वायरिंग सिम्युलेटर',
      category: 'Wiring',
      categoryMr: 'वायरिंग प्रॅक्टिकल',
    },
    {
      id: 'gal-4',
      src: 'https://content3.jdmagicbox.com/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-hyk2wb2v1e.jpg',
      alt: 'Industrial Tools & Equipment',
      title: 'Industrial Tools & Safety Workshop',
      titleMr: 'औद्योगिक सुरक्षा व टूल्स कार्यशाळा',
      category: 'Workshop',
      categoryMr: 'कार्यशाळा',
    },
    {
      id: 'gal-5',
      src: 'https://content3.jdmagicbox.com/v2/comp/jalgaon/dc/9999px257.x257.100521174144.m3k2dc/catalogue/abhinav-technical-institute-of-industrial-training-institute-and-skill-development-education-navi-peth-jalgaon-jalgaon-computer-training-institutes-roefbm6f0w.jpg',
      alt: 'Individual Computer Workstations',
      title: 'Typing, Tally GST & Office Automation Lab',
      titleMr: 'टायपिंग व टॅली जीएसटी लॅब',
      category: 'Computer',
      categoryMr: 'संगणक व आयटी',
    },
  ],
};

const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : '/api';

export async function fetchSiteContent(): Promise<SiteContent> {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.hero || data.courses)) {
        const merged: SiteContent = {
          ...INITIAL_SITE_CONTENT,
          ...data,
          hero: { ...INITIAL_SITE_CONTENT.hero, ...(data.hero || {}) },
          contact: { ...INITIAL_SITE_CONTENT.contact, ...(data.contact || {}) },
          about: { ...INITIAL_SITE_CONTENT.about, ...(data.about || {}) },
          awards: data.awards || INITIAL_AWARDS_CONTENT,
          courses: data.courses && Array.isArray(data.courses) && data.courses.length > 0
            ? data.courses
            : INITIAL_SITE_CONTENT.courses,
          gallery: data.gallery && Array.isArray(data.gallery) && data.gallery.length > 0
            ? data.gallery
            : INITIAL_SITE_CONTENT.gallery,
        };
        localStorage.setItem('ati_site_content', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Remote site_content fetch failed, falling back to cached content:', e);
  }

  const stored = localStorage.getItem('ati_site_content');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed.hero || parsed.courses)) {
        const merged: SiteContent = {
          ...INITIAL_SITE_CONTENT,
          ...parsed,
          hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          contact: { ...INITIAL_SITE_CONTENT.contact, ...(parsed.contact || {}) },
          about: { ...INITIAL_SITE_CONTENT.about, ...(parsed.about || {}) },
          awards: parsed.awards || INITIAL_AWARDS_CONTENT,
          courses: parsed.courses && Array.isArray(parsed.courses) && parsed.courses.length >= 4
            ? parsed.courses
            : INITIAL_SITE_CONTENT.courses,
          gallery: parsed.gallery && Array.isArray(parsed.gallery) && parsed.gallery.length > 0
            ? parsed.gallery
            : INITIAL_SITE_CONTENT.gallery,
        };
        return merged;
      }
    } catch {}
  }

  localStorage.setItem('ati_site_content', JSON.stringify(INITIAL_SITE_CONTENT));
  return INITIAL_SITE_CONTENT;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  // Always update local cache and broadcast immediately for responsive UI
  localStorage.setItem('ati_site_content', JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('ati_cms_updated', { detail: content }));

  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn('Cloudflare D1 save returned status:', res.status);
    }
  } catch (e) {
    console.warn('Cloudflare D1 save failed, cached locally:', e);
  }

  return content;
}

export async function resetSiteContent(): Promise<SiteContent> {
  try {
    await fetch(`${API_BASE}/content/reset`, {
      method: 'POST',
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.warn('Remote reset failed:', e);
  }

  localStorage.setItem('ati_site_content', JSON.stringify(INITIAL_SITE_CONTENT));
  window.dispatchEvent(new CustomEvent('ati_cms_updated', { detail: INITIAL_SITE_CONTENT }));
  return INITIAL_SITE_CONTENT;
}
