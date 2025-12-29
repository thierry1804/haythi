export type Language = 'fr' | 'en';

export interface Translations {
  nav: {
    home: string;
    services: string;
    about: string;
    skills: string;
    experience: string;
    certifications: string;
    blog: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta1: string;
    cta2: string;
  };
  services: {
    title: string;
    webDev: {
      title: string;
      description: string;
      technologies: string;
    };
    architecture: {
      title: string;
      description: string;
      technologies: string;
    };
    management: {
      title: string;
      description: string;
      certifications: string;
    };
    consulting: {
      title: string;
      description: string;
      expertise: string;
    };
    training: {
      title: string;
      description: string;
      domains: string;
    };
  };
  about: {
    title: string;
    text: string;
    stats: {
      experience: string;
      projects: string;
      certifications: string;
    };
  };
  skills: {
    title: string;
    categories: {
      languages: string;
      databases: string;
      frontend: string;
      devops: string;
      mobile: string;
      methodologies: string;
    };
  };
  experience: {
    title: string;
  };
  certifications: {
    title: string;
  };
  portfolio: {
    title: string;
    viewProject: string;
  };
  blog: {
    title: string;
    readMore: string;
    viewAll: string;
    readTime: string;
  };
  contact: {
    title: string;
    address: string;
    email: string;
    phone: string;
    linkedin: string;
    skype: string;
    form: {
      name: string;
      company: string;
      phone: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      bookAppointment: string;
      subjects: {
        webDev: string;
        architecture: string;
        projectManagement: string;
        consulting: string;
        training: string;
        other: string;
      };
    };
  };
  footer: {
    quickLinks: string;
    legal: string;
    followUs: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav: {
      home: 'Accueil',
      services: 'Services',
      about: 'À propos',
      skills: 'Compétences',
      experience: 'Expériences',
      certifications: 'Certifications',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      title: 'HAYTHI - Expertise IT & Conseil Digital',
      subtitle: 'Tech to serve',
      description: 'Consultant IT Freelance | 15+ ans d\'expérience',
      cta1: 'Découvrir mes services',
      cta2: 'Prendre RDV',
    },
    services: {
      title: 'Services d\'Excellence IT',
      webDev: {
        title: 'Développement Web',
        description: 'Applications web sur mesure avec Symfony, PHP, CodeIgniter. 15 ans d\'expertise en développement backend et frontend.',
        technologies: 'Symfony, PHP, MySQL, JavaScript, jQuery',
      },
      architecture: {
        title: 'Architecture SI',
        description: 'Conception et élaboration d\'architectures applicatives robustes, scalables et sécurisées.',
        technologies: 'Microservices, API REST, ETL Talend',
      },
      management: {
        title: 'Management de Projets IT',
        description: 'Gestion de projets IT de A à Z, coordination d\'équipes, méthodologies agiles (Scrum Master certifié PMP).',
        certifications: 'PMP, Scrum Master',
      },
      consulting: {
        title: 'Conseil & Audit',
        description: 'Audit qualité ISO 9001, optimisation des SI, conseil stratégique et opérationnel.',
        expertise: 'ISO 9001, Audit technique',
      },
      training: {
        title: 'Formation',
        description: 'Formation sur les bonnes pratiques de développement, technologies web modernes et gestion de projet.',
        domains: 'PHP, Symfony, Python, C#, ETL Talend',
      },
    },
    about: {
      title: 'Thierry Randriantiana | Manager IT & Développeur Sénior',
      text: 'Depuis 2009, je développe des applications web principalement en PHP avec le framework Symfony. Fort de 15 ans d\'expérience, j\'ai utilisé une large gamme de technologies et acquis une solide expérience en gestion d\'équipe et en gestion de projet. Mon enthousiasme pour l\'acquisition de nouvelles connaissances, ma ténacité et ma persévérance me permettent de m\'adapter à toutes les situations.',
      stats: {
        experience: '15+ Ans d\'expérience',
        projects: '50+ Projets réalisés',
        certifications: '4 Certifications',
      },
    },
    skills: {
      title: 'Expertise Technique',
      categories: {
        languages: 'Langages & Frameworks',
        databases: 'Bases de données',
        frontend: 'Frontend',
        devops: 'DevOps & Outils',
        mobile: 'Mobile',
        methodologies: 'Méthodologies',
      },
    },
    experience: {
      title: 'Parcours Professionnel',
    },
    certifications: {
      title: 'Certifications & Formations',
    },
    portfolio: {
      title: 'Réalisations & Projets',
      viewProject: 'Voir le projet',
    },
    blog: {
      title: 'Blog & Insights Techniques',
      readMore: 'Lire la suite',
      viewAll: 'Voir tous les articles',
      readTime: 'min de lecture',
    },
    contact: {
      title: 'Discutons de Votre Projet',
      address: 'Antananarivo, Madagascar',
      email: 'thierry1804@gmail.com',
      phone: '+261 34 20 018 04',
      linkedin: 'https://www.linkedin.com/in/thierry-randriantiana',
      skype: 'thierrypro75',
      form: {
        name: 'Nom complet',
        company: 'Nom de votre entreprise',
        phone: 'Numéro de téléphone',
        email: 'Email professionnel',
        subject: 'Sujet',
        message: 'Message',
        send: 'Envoyer le message',
        bookAppointment: 'Réserver un créneau de consultation',
        subjects: {
          webDev: 'Développement Web',
          architecture: 'Architecture SI',
          projectManagement: 'Management Projet',
          consulting: 'Conseil',
          training: 'Formation',
          other: 'Autre',
        },
      },
    },
    footer: {
      quickLinks: 'Liens rapides',
      legal: 'Mentions légales',
      followUs: 'Suivez-nous',
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      about: 'About',
      skills: 'Skills',
      experience: 'Experience',
      certifications: 'Certifications',
      blog: 'Blog',
      contact: 'Contact',
    },
    hero: {
      title: 'HAYTHI - IT Expertise & Digital Consulting',
      subtitle: 'Tech to serve',
      description: 'Freelance IT Consultant | 15+ years of experience',
      cta1: 'Discover my services',
      cta2: 'Book an appointment',
    },
    services: {
      title: 'IT Excellence Services',
      webDev: {
        title: 'Web Development',
        description: 'Custom web applications with Symfony, PHP, CodeIgniter. 15 years of expertise in backend and frontend development.',
        technologies: 'Symfony, PHP, MySQL, JavaScript, jQuery',
      },
      architecture: {
        title: 'IT Architecture',
        description: 'Design and development of robust, scalable and secure application architectures.',
        technologies: 'Microservices, REST API, ETL Talend',
      },
      management: {
        title: 'IT Project Management',
        description: 'End-to-end IT project management, team coordination, agile methodologies (PMP certified Scrum Master).',
        certifications: 'PMP, Scrum Master',
      },
      consulting: {
        title: 'Consulting & Audit',
        description: 'ISO 9001 quality audit, IT optimization, strategic and operational consulting.',
        expertise: 'ISO 9001, Technical Audit',
      },
      training: {
        title: 'Training',
        description: 'Training on development best practices, modern web technologies and project management.',
        domains: 'PHP, Symfony, Python, C#, ETL Talend',
      },
    },
    about: {
      title: 'Thierry Randriantiana | IT Manager & Senior Developer',
      text: 'Since 2009, I have been developing web applications mainly in PHP with the Symfony framework. With 15 years of experience, I have used a wide range of technologies and acquired solid experience in team management and project management. My enthusiasm for acquiring new knowledge, my tenacity and perseverance allow me to adapt to all situations.',
      stats: {
        experience: '15+ Years of experience',
        projects: '50+ Projects completed',
        certifications: '4 Certifications',
      },
    },
    skills: {
      title: 'Technical Expertise',
      categories: {
        languages: 'Languages & Frameworks',
        databases: 'Databases',
        frontend: 'Frontend',
        devops: 'DevOps & Tools',
        mobile: 'Mobile',
        methodologies: 'Methodologies',
      },
    },
    experience: {
      title: 'Professional Journey',
    },
    certifications: {
      title: 'Certifications & Training',
    },
    portfolio: {
      title: 'Achievements & Projects',
      viewProject: 'View project',
    },
    blog: {
      title: 'Blog & Technical Insights',
      readMore: 'Read more',
      viewAll: 'View all articles',
      readTime: 'min read',
    },
    contact: {
      title: 'Let\'s Discuss Your Project',
      address: 'Antananarivo, Madagascar',
      email: 'thierry1804@gmail.com',
      phone: '+261 34 20 018 04',
      linkedin: 'https://www.linkedin.com/in/thierry-randriantiana',
      skype: 'thierrypro75',
      form: {
        name: 'Full name',
        company: 'Company name',
        phone: 'Phone number',
        email: 'Business email',
        subject: 'Subject',
        message: 'Message',
        send: 'Send message',
        bookAppointment: 'Book a consultation slot',
        subjects: {
          webDev: 'Web Development',
          architecture: 'IT Architecture',
          projectManagement: 'Project Management',
          consulting: 'Consulting',
          training: 'Training',
          other: 'Other',
        },
      },
    },
    footer: {
      quickLinks: 'Quick links',
      legal: 'Legal notice',
      followUs: 'Follow us',
    },
  },
};

