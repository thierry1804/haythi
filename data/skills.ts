export interface SkillCategory {
  id: string;
  nameKey: 'languages' | 'databases' | 'frontend' | 'devops' | 'mobile' | 'methodologies';
  technologies: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    nameKey: 'languages',
    technologies: ['PHP', 'Symfony', 'CodeIgniter', 'C#', 'Python', 'ASP.NET'],
  },
  {
    id: 'databases',
    nameKey: 'databases',
    technologies: ['MySQL', 'PostgreSQL', 'SQL Server', 'Sybase'],
  },
  {
    id: 'frontend',
    nameKey: 'frontend',
    technologies: ['JavaScript', 'jQuery', 'HTML5', 'CSS3'],
  },
  {
    id: 'devops',
    nameKey: 'devops',
    technologies: ['Git', 'Linux Debian', 'Apache', 'ETL Talend'],
  },
  {
    id: 'mobile',
    nameKey: 'mobile',
    technologies: ['Android', 'Java'],
  },
  {
    id: 'methodologies',
    nameKey: 'methodologies',
    technologies: ['Scrum', 'Agile', 'ISO 9001'],
  },
];

