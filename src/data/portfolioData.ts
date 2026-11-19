export type PageId = 'home' | 'about' | 'education' | 'skills' | 'python' | 'contact';

export interface EducationEntry {
  id: string;
  degree: string;
  branch?: string;
  institution: string;
  duration?: string;
  currentStatus?: string;
  semesters?: {
    semester: string;
    sgpa: string;
    status: string;
  }[];
  stageLabel: string;
}

export interface TechnicalSkill {
  id: string;
  name: string;
  description: string;
}

export interface LanguageItem {
  language: string;
  proficiency: string;
}

export const PORTFOLIO_DATA = {
  name: 'A. Gnanadeep Sai',
  shortName: 'Gnanadeep',
  heroGreeting: "Hi, I'm Gnanadeep.",
  heroTagline: 'Building the Future Through Code.',
  heroSupportingIntro:
    'B.Tech AIML student at Jain University, Bangalore, interested in technology and problem-solving.',
  profileImage: '/assets/aistudio/image_f39b2877.png',
  status: 'Fresher',
  academicStatus: 'Second Year – Semester 3',
  degreeShort: 'B.Tech – Artificial Intelligence and Machine Learning',
  university: 'Jain University, Bangalore',
  aboutIntroduction:
    'A. Gnanadeep Sai is a B.Tech Artificial Intelligence and Machine Learning student at Jain University, Bangalore, currently in Second Year – Semester 3. As a fresher with a dedicated interest in technology and problem-solving, he focuses on building strong technical foundations across Python, SQL, and Data Structures.',
  aboutSecondary:
    'Through structured coursework in Artificial Intelligence and Machine Learning (2025–2029), he approaches software development with clarity, logical precision, and a commitment to continuous learning.',
  education: [
    {
      id: 'btech',
      stageLabel: '01 · Undergraduate Degree (2025–2029)',
      degree: 'B.Tech – Artificial Intelligence and Machine Learning',
      branch: 'Artificial Intelligence and Machine Learning',
      institution: 'Jain University, Bangalore',
      duration: '2025–2029',
      currentStatus: 'Second Year – Semester 3',
      semesters: [
        { semester: 'Semester 1', sgpa: '6.75', status: 'Completed' },
        { semester: 'Semester 2', sgpa: '6.60', status: 'Completed' },
        { semester: 'Semester 3', sgpa: 'In Progress', status: 'Current Semester' },
      ],
    },
    {
      id: 'intermediate',
      stageLabel: '02 · Higher Secondary Education',
      degree: 'Intermediate',
      institution: 'Sri Chaitanya Junior College',
    },
    {
      id: 'tenth',
      stageLabel: '03 · Secondary School Education',
      degree: '10th Standard',
      institution: 'Keshava Reddy EM School',
    },
  ] as EducationEntry[],
  skills: [
    {
      id: 'python',
      name: 'Python',
      description:
        'Core language for structured programming, algorithmic problem-solving, object-oriented design, and Artificial Intelligence and Machine Learning coursework.',
    },
    {
      id: 'sql',
      name: 'SQL',
      description:
        'Structured Query Language for designing relational database schemas, managing structured records, writing joins, and performing analytical queries.',
    },
    {
      id: 'data-structures',
      name: 'Data Structures',
      description:
        'Organization and manipulation of data using linear and non-linear structures to write efficient, well-structured algorithms.',
    },
  ] as TechnicalSkill[],
  languages: [
    { language: 'Telugu', proficiency: 'Native' },
    { language: 'English', proficiency: 'Professional' },
    { language: 'Tamil', proficiency: 'Conversational' },
  ] as LanguageItem[],
  contact: {
    email: 'gnanadeepsai0609@gmail.com',
    phoneDisplay: '+91 88869 21370',
    phoneHref: 'tel:+918886921370',
    emailHref: 'mailto:gnanadeepsai0609@gmail.com',
    githubUrl: 'https://github.com/juug25btech16938-cloud?tab=repositories',
    githubLabel: 'github.com/juug25btech16938-cloud',
    linkedinUrl: 'https://www.linkedin.com/in/a-gnanadeep-sai-91984a412',
    linkedinLabel: 'linkedin.com/in/a-gnanadeep-sai-91984a412',
  },
};
