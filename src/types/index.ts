export type Language = 'mr' | 'hi' | 'en';

export interface Course {
  id: string;
  name: string;
  nameMr?: string;
  nameHi?: string;
  code: string;
  category: string;
  categoryMr?: string;
  categoryHi?: string;
  description: string;
  descriptionMr?: string;
  descriptionHi?: string;
  fullDescription?: string;
  fullDescriptionMr?: string;
  fullDescriptionHi?: string;
  duration: string;
  durationMr?: string;
  durationHi?: string;
  timing: string;
  timingMr?: string;
  timingHi?: string;
  startDate: string;
  startDateMr?: string;
  startDateHi?: string;
  admissionsOpen: boolean;
  image: string;
  eligibility: string;
  eligibilityMr?: string;
  eligibilityHi?: string;
  syllabus: string[];
  syllabusMr?: string[];
  syllabusHi?: string[];
  subjects?: { name: string; code: string }[];
  careerOpportunities: string[];
  careerOpportunitiesMr?: string[];
  careerOpportunitiesHi?: string[];
  certification: string;
  certificationMr?: string;
  certificationHi?: string;
  batchCapacity?: number;
  enrolled?: number;
}

export interface Announcement {
  id: string;
  title: string;
  titleMr?: string;
  titleHi?: string;
  description: string;
  descriptionMr?: string;
  descriptionHi?: string;
  tag: string;
  tagMr?: string;
  tagHi?: string;
  date: string;
  dateMr?: string;
  dateHi?: string;
  icon: string;
  isNew: boolean;
  linkText?: string;
}

export interface Review {
  id: string;
  name: string;
  course: string;
  rating: number;
  comment: string;
  commentMr?: string;
  commentHi?: string;
  avatar?: string;
  date: string;
  category: 'Practical Training' | 'Helpful Teachers' | 'Career Guidance' | 'Student Support';
}

export interface FaqItem {
  id: string;
  question: string;
  questionMr?: string;
  questionHi?: string;
  answer: string;
  answerMr?: string;
  answerHi?: string;
  category?: string;
}

export interface StudentCertificate {
  regNumber: string;
  studentName: string;
  courseName: string;
  grade: string;
  percentage: string;
  issueDate: string;
  validUntil: string;
  status: 'Valid' | 'Expired' | 'Under Verification';
  instituteCenter: string;
}

export interface Syllabus {
  id: string;
  courseTitle: string;
  courseCode: string;
  category: string;
  duration: string;
  eligibility: string;
  description: string;
  modules: string[];
  practicalRatio: string;
  fileData?: string;
  fileName?: string;
  fileSize?: string;
  downloadUrl?: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  qualification?: string;
  message: string;
  date: string;
  status?: 'New' | 'Contacted' | 'In Progress' | 'Enrolled' | 'Closed';
  notes?: string;
}

export interface Certificate {
  id: string;
  studentName: string;
  fatherName: string;
  course: string;
  grade: string;
  startDate: string;
  endDate: string;
  issueDate: string;
  isValid: boolean;
  remarks?: string;
}

export interface CourseSetting {
  id: string;
  title: string;
  category: string;
  duration: string;
  fee: string;
  seats: number;
  isOpen: boolean;
  batchTiming: string;
}
