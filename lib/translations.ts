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
    whatsapp: string;
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
      title: 'HAYTHI - Expertise IT & consulting digital',
      subtitle: 'Tech to serve',
      description: 'Consultant IT Freelance | 15+ ans d\'expérience',
      cta1: 'Découvrir mes services',
      cta2: 'Prendre RDV',
    },
    services: {
      title: 'Services d\'excellence IT',
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
        title: 'Management de projets IT',
        description: 'Gestion de projets IT de A à Z, coordination d\'équipes, méthodologies agiles (Scrum Master certifié PMP).',
        certifications: 'PMP, Scrum Master',
      },
      consulting: {
        title: 'Conseil & audit',
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
      title: 'Tech To Serve',
      text: 'Depuis 2009, HAYTHI développe des applications web principalement en PHP avec le framework Symfony. Forte de 15 ans d\'expérience, l\'entreprise a utilisé une large gamme de technologies et acquis une solide expérience en gestion d\'équipe et en gestion de projet. Notre passion pour l\'acquisition de nouvelles connaissances, notre ténacité et notre persévérance nous permettent de nous adapter à toutes les situations.',
      stats: {
        experience: '15+ Ans d\'expérience',
        projects: '50+ Projets réalisés',
        certifications: '4 Certifications',
      },
    },
    skills: {
      title: 'Expertise technique',
      categories: {
        languages: 'Languages & frameworks',
        databases: 'Bases de données',
        frontend: 'Frontend',
        devops: 'DevOps & Outils',
        mobile: 'Mobile',
        methodologies: 'Méthodologies',
      },
    },
    experience: {
      title: 'Parcours professionnel',
    },
    certifications: {
      title: 'Certifications & formations',
    },
    portfolio: {
      title: 'Réalisations & projets',
      viewProject: 'Voir le projet',
    },
    blog: {
      title: 'Blog & insights techniques',
      readMore: 'Lire la suite',
      viewAll: 'Voir tous les articles',
      readTime: 'min de lecture',
    },
    contact: {
      title: 'Discutons de votre projet',
      address: 'Antananarivo, Madagascar',
      email: 'contact@haythi.mg',
      phone: '+261 32 28 383 86',
      whatsapp: 'https://wa.me/261322838386',
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
          projectManagement: 'Management project',
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
      title: 'HAYTHI - IT expertise & digital consulting',
      subtitle: 'Tech to serve',
      description: 'Freelance IT Consultant | 15+ years of experience',
      cta1: 'Discover my services',
      cta2: 'Book an appointment',
    },
    services: {
      title: 'IT excellence services',
      webDev: {
        title: 'Web Development',
        description: 'Custom web applications with Symfony, PHP, CodeIgniter. 15 years of expertise in backend and frontend development.',
        technologies: 'Symfony, PHP, MySQL, JavaScript, jQuery',
      },
      architecture: {
        title: 'IT architecture',
        description: 'Design and development of robust, scalable and secure application architectures.',
        technologies: 'Microservices, REST API, ETL Talend',
      },
      management: {
        title: 'IT project management',
        description: 'End-to-end IT project management, team coordination, agile methodologies (PMP certified Scrum Master).',
        certifications: 'PMP, Scrum Master',
      },
      consulting: {
        title: 'Consulting & audit',
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
      title: 'Tech To Serve',
      text: 'Since 2009, HAYTHI has been developing web applications mainly in PHP with the Symfony framework. With 15 years of experience, we have used a wide range of technologies and acquired solid experience in team management and project management. Our passion for acquiring new knowledge, our tenacity and perseverance allow us to adapt to all situations.',
      stats: {
        experience: '15+ years of experience',
        projects: '50+ projects completed',
        certifications: '4 certifications',
      },
    },
    skills: {
      title: 'Technical Expertise',
      categories: {
        languages: 'Languages & frameworks',
        databases: 'Databases',
        frontend: 'Frontend',
        devops: 'DevOps & tools',
        mobile: 'Mobile',
        methodologies: 'Methodologies',
      },
    },
    experience: {
      title: 'Professional journey',
    },
    certifications: {
      title: 'Certifications & training',
    },
    portfolio: {
      title: 'Achievements & projects',
      viewProject: 'View project',
    },
    blog: {
      title: 'Blog & technical insights',
      readMore: 'Read more',
      viewAll: 'View all articles',
      readTime: 'min read',
    },
    contact: {
      title: 'Let\'s discuss your project',
      address: 'Antananarivo, Madagascar',
      email: 'contact@haythi.mg',
      phone: '+261 32 28 383 86',
      whatsapp: 'https://wa.me/261322838386',
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

