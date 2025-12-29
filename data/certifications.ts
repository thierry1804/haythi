export interface Certification {
  id: string;
  title: string;
  year: string;
  issuer: string;
  badge?: string;
  link?: string;
}

export const certifications: Certification[] = [
  {
    id: 'pmp-2024',
    title: 'PMP - Project Management Professional',
    year: '2024',
    issuer: 'Google/Coursera',
    link: 'https://www.credly.com/badges/478c7406-f7f2-4ed6-93f5-016428157da2/public_url',
  },
  {
    id: 'software-architect-2022',
    title: 'Software Architect',
    year: '2022',
    issuer: 'Udemy',
    link: 'https://www.udemy.com/certificate/UC-6504fc50-91c7-40b2-836a-41a27609a569/',
  },
  {
    id: 'iso-9001',
    title: 'ISO 9001 Auditor',
    year: '2010, 2020',
    issuer: 'VIVETIC',
  },
  {
    id: 'istqb-2013',
    title: 'ISTQB Foundation Level',
    year: '2013',
    issuer: 'ISTQB',
  },
];

