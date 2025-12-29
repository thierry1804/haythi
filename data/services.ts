import { Code, Network, Briefcase, FileSearch, GraduationCap } from 'lucide-react';
import { Translations } from '@/lib/translations';

export interface Service {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: keyof Translations['services'];
  descriptionKey: keyof Translations['services'];
  detailsKey: keyof Translations['services'];
}

export const services: Service[] = [
  {
    id: 'web-dev',
    icon: Code,
    titleKey: 'webDev',
    descriptionKey: 'webDev',
    detailsKey: 'webDev',
  },
  {
    id: 'architecture',
    icon: Network,
    titleKey: 'architecture',
    descriptionKey: 'architecture',
    detailsKey: 'architecture',
  },
  {
    id: 'management',
    icon: Briefcase,
    titleKey: 'management',
    descriptionKey: 'management',
    detailsKey: 'management',
  },
  {
    id: 'consulting',
    icon: FileSearch,
    titleKey: 'consulting',
    descriptionKey: 'consulting',
    detailsKey: 'consulting',
  },
  {
    id: 'training',
    icon: GraduationCap,
    titleKey: 'training',
    descriptionKey: 'training',
    detailsKey: 'training',
  },
];

