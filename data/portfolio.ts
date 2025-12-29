export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: 'Web Development' | 'SI Architecture' | 'Management';
  technologies: string[];
  image?: string;
  link?: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'project-1',
    title: 'Application Web Entreprise',
    description: 'Développement d\'une application web complète pour la gestion d\'entreprise avec Symfony et MySQL.',
    category: 'Web Development',
    technologies: ['Symfony', 'PHP', 'MySQL', 'JavaScript'],
  },
  {
    id: 'project-2',
    title: 'Architecture Microservices',
    description: 'Conception et mise en place d\'une architecture microservices pour une application distribuée.',
    category: 'SI Architecture',
    technologies: ['Microservices', 'API REST', 'Docker'],
  },
  {
    id: 'project-3',
    title: 'Gestion de Projet IT',
    description: 'Management d\'une équipe de 10+ développeurs sur un projet de transformation digitale.',
    category: 'Management',
    technologies: ['Scrum', 'Agile', 'Jira'],
  },
  {
    id: 'project-4',
    title: 'Plateforme E-commerce',
    description: 'Développement d\'une plateforme e-commerce avec CodeIgniter et intégration de paiement.',
    category: 'Web Development',
    technologies: ['CodeIgniter', 'PHP', 'MySQL', 'Stripe'],
  },
  {
    id: 'project-5',
    title: 'Migration vers Cloud',
    description: 'Architecture et migration d\'une infrastructure on-premise vers le cloud avec optimisation des coûts.',
    category: 'SI Architecture',
    technologies: ['AWS', 'Docker', 'Kubernetes'],
  },
  {
    id: 'project-6',
    title: 'Formation Développement',
    description: 'Programme de formation sur les bonnes pratiques de développement et méthodologies agiles.',
    category: 'Management',
    technologies: ['Formation', 'Agile', 'Best Practices'],
  },
];

