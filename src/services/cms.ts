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
  courses: Course[];
  gallery: GalleryItem[];
}

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
    principalName: 'Prof. S. N. Patil',
    principalTitle: 'Founder & Principal Director',
    principalPhoto: '/assets/principal.png',
    directorMessage:
      'Since 1999, our mission has been to transform aspiring youth into highly skilled, employable technical professionals through rigorous hands-on workshop training and discipline.',
    directorMessageMr:
      '१९९९ पासून आमचा एकच ध्यास आहे — ग्रामीण व शहरी भागातील विद्यार्थ्यांना आधुनिक उपकरणांवर प्रत्यक्ष प्रॅक्टिकल शिकवून त्यांना स्वतःच्या पायावर उभे करणे.',
    statsYears: '26+',
    statsAlumni: '5,000+',
    statsLabs: '6+',
    statsTrades: '10',
  },
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
    const res = await fetch(`${API_BASE}/content`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.hero) {
        localStorage.setItem('ati_site_content', JSON.stringify(data));
        return data;
      }
    }
  } catch (e) {}

  const stored = localStorage.getItem('ati_site_content');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.courses && parsed.courses.length >= 4) {
        return parsed;
      }
    } catch {}
  }

  localStorage.setItem('ati_site_content', JSON.stringify(INITIAL_SITE_CONTENT));
  return INITIAL_SITE_CONTENT;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  try {
    await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
      signal: AbortSignal.timeout(3000),
    });
  } catch (e) {}

  localStorage.setItem('ati_site_content', JSON.stringify(content));
  window.dispatchEvent(new CustomEvent('ati_cms_updated', { detail: content }));
  return content;
}

export async function resetSiteContent(): Promise<SiteContent> {
  try {
    await fetch(`${API_BASE}/content/reset`, {
      method: 'POST',
      signal: AbortSignal.timeout(2000),
    });
  } catch (e) {}

  localStorage.setItem('ati_site_content', JSON.stringify(INITIAL_SITE_CONTENT));
  window.dispatchEvent(new CustomEvent('ati_cms_updated', { detail: INITIAL_SITE_CONTENT }));
  return INITIAL_SITE_CONTENT;
}
