export interface Experience {
  id: string;
  period: {
    start: string;
    end: string;
  };
  title: string;
  company: string;
  responsibilities: string[];
}

export const experiences: Experience[] = [
  {
    id: 'etech-2023',
    period: {
      start: 'Oct. 2023',
      end: 'Présent',
    },
    title: 'DIRECTEUR DE BUSINESS UNIT',
    company: 'ETECH CONSULTING',
    responsibilities: [
      'Coordination et gestion d\'équipe au niveau de la BU',
      'Optimisation organisationnelle',
      'Amélioration des performances',
    ],
  },
  {
    id: 'vivetic-2021',
    period: {
      start: 'Sep. 2021',
      end: 'Juin 2022',
    },
    title: 'ARCHITECTE SI',
    company: 'VIVETIC GROUP',
    responsibilities: [
      'Elaboration de l\'architecture des applications',
      'Industrialisation de la SI',
      'Formation sur bonnes pratiques (PHP, Symfony, Python, C#, ETL Talend)',
    ],
  },
  {
    id: 'pulse-2019',
    period: {
      start: 'Avr. 2019',
      end: 'Août 2019',
    },
    title: 'TEAM LEADER TRANSVERSE',
    company: 'PULSE',
    responsibilities: [
      'Suivi et supervision des projets',
      'Opérations avant-ventes',
      'Rédaction de spécifications techniques',
    ],
  },
  {
    id: 'makey-2017',
    period: {
      start: 'Fév. 2017',
      end: 'Nov. 2018',
    },
    title: 'MANAGER DU POLE IT',
    company: 'MAKEY SERVICES',
    responsibilities: [
      'Management d\'équipe de 10+ développeurs',
      'Développement web et mobile',
      'Administration serveurs Linux',
    ],
  },
  {
    id: 'vivetic-2009',
    period: {
      start: 'Mai 2009',
      end: 'Jan. 2017',
    },
    title: 'MANAGER DEVELOPPEUR',
    company: 'VIVETIC',
    responsibilities: [
      'Management d\'équipe de développeurs',
      'Garant de la qualité des livrables',
      'Auditeur interne ISO 9001',
    ],
  },
];

