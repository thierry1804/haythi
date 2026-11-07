import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Lang = 'FR' | 'EN';

const messages = {
  FR: {
    navFlux: 'FLUX',
    navServices: 'SERVICES',
    navConsulting: 'CONSULTING',
    navProjects: 'PROJETS',
    navTerminal: 'TERMINAL',
    connect: 'CONNECT',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    toggleLang: 'Passer en anglais',
    protocol01: 'PROTOCOL_01: SERVICES',
    heroTitleLead: 'EXPERTISE IT &',
    heroTitleAccent: 'CONSULTING',
    heroBody:
      "Consultant IT Freelance | 15+ ans d'expérience. Solutions d'ingénierie logicielle de haute précision. Nous transformons des concepts complexes en infrastructures numériques résilientes et performantes.",
    ctaServices: 'Découvrir mes services',
    ctaRdv: 'Prendre RDV',
    contactIntro:
      'Prêt pour une nouvelle implémentation ? Envoyez vos coordonnées pour établir une connexion sécurisée.',
    transmit: 'TRANSMIT_PACKET',
    transmitting: 'TRANSMITTING...',
    transmitOk: 'TRANSMISSION_COMPLETE // MESSAGE_QUEUED_TO_MAIL_CLIENT',
    transmitErr: 'ERROR_PROTOCOL // CHECK_FIELDS_OR_MAIL_CLIENT',
    privacyTitle: 'PRIVACY_POLICY',
    privacyBody:
      "HAYTHI.MG collecte uniquement les données que vous soumettez via le formulaire de contact (identité, organisation, email, type de mission, détails). Ces données servent exclusivement à répondre à votre demande. Elles ne sont ni vendues ni cédées à des tiers. Conservation : durée nécessaire au traitement de la demande, puis suppression. Contact DPO / responsable : contact@haythi.mg. Vous pouvez demander accès, rectification ou suppression à tout moment.",
    footerPrivacy: 'Privacy',
    footerServices: 'Services',
    footerProjects: 'Projets',
    footerContact: 'Contact',
    projectCta: 'INIT_CONTACT',
  },
  EN: {
    navFlux: 'FLUX',
    navServices: 'SERVICES',
    navConsulting: 'CONSULTING',
    navProjects: 'PROJECTS',
    navTerminal: 'TERMINAL',
    connect: 'CONNECT',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toggleLang: 'Switch to French',
    protocol01: 'PROTOCOL_01: SERVICES',
    heroTitleLead: 'IT EXPERTISE &',
    heroTitleAccent: 'CONSULTING',
    heroBody:
      'Freelance IT Consultant | 15+ years experience. High-precision software engineering. We turn complex concepts into resilient, high-performance digital infrastructures.',
    ctaServices: 'Explore services',
    ctaRdv: 'Book a call',
    contactIntro:
      'Ready for a new implementation? Send credentials to establish a secure channel.',
    transmit: 'TRANSMIT_PACKET',
    transmitting: 'TRANSMITTING...',
    transmitOk: 'TRANSMISSION_COMPLETE // MESSAGE_QUEUED_TO_MAIL_CLIENT',
    transmitErr: 'ERROR_PROTOCOL // CHECK_FIELDS_OR_MAIL_CLIENT',
    privacyTitle: 'PRIVACY_POLICY',
    privacyBody:
      'HAYTHI.MG only collects data you submit via the contact form (identity, organization, email, mission type, details). Data is used solely to answer your request. It is never sold or shared with third parties. Retention: as long as needed to process the request, then deleted. Contact: contact@haythi.mg. You may request access, correction, or deletion at any time.',
    footerPrivacy: 'Privacy',
    footerServices: 'Services',
    footerProjects: 'Projects',
    footerContact: 'Contact',
    projectCta: 'INIT_CONTACT',
  },
} as const;

export type MessageKey = keyof (typeof messages)['FR'];

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('haythi-lang');
    return saved === 'EN' || saved === 'FR' ? saved : 'FR';
  });

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    localStorage.setItem('haythi-lang', next);
    document.documentElement.lang = next === 'FR' ? 'fr' : 'en';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'FR' ? 'fr' : 'en';
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang(lang === 'FR' ? 'EN' : 'FR');
  }, [lang, setLang]);

  const t = useCallback((key: MessageKey) => messages[lang][key], [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
