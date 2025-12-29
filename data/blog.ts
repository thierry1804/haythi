export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: 'Développement' | 'Architecture' | 'Management' | 'Bonnes Pratiques';
  date: string;
  readTime: number;
  image?: string;
  content?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'symfony-best-practices-2025',
    slug: 'symfony-best-practices-2025',
    title: 'Les bonnes pratiques Symfony en 2025',
    excerpt: 'Découvrez les meilleures pratiques pour développer des applications Symfony modernes, performantes et maintenables en 2025.',
    category: 'Développement',
    date: '2025-01-15',
    readTime: 8,
  },
  {
    id: 'microservices-architecture',
    slug: 'microservices-architecture',
    title: 'Architecture microservices : retour d\'expérience',
    excerpt: 'Retour d\'expérience sur la conception et la mise en place d\'une architecture microservices pour une application distribuée.',
    category: 'Architecture',
    date: '2024-12-10',
    readTime: 12,
  },
  {
    id: 'it-project-management',
    slug: 'it-project-management',
    title: 'Gestion de projet IT : les clés du succès',
    excerpt: 'Les fondamentaux de la gestion de projet IT, méthodologies agiles et bonnes pratiques pour mener à bien vos projets.',
    category: 'Management',
    date: '2024-11-20',
    readTime: 10,
  },
];

