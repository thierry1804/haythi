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
    seoTitle:
      'Consultant IT Freelance — Développement Web, Conseil SI & Architecture | HAYTHI',
    seoDescription:
      'Consultant IT freelance (15+ ans) : développement web, conseil et audit SI, architecture applicative, management de projets Agile/PMP. Interventions remote et internationales. Contactez HAYTHI.',
    heroTitleLead: 'EXPERTISE IT &',
    heroTitleAccent: 'CONSULTING',
    heroBody:
      "Consultant IT freelance | 15+ ans d'expérience. Développement web, conseil SI, architecture applicative et management de projets. Ingénierie logicielle de haute précision — remote et international.",
    ctaServices: 'Découvrir mes services',
    ctaRdv: 'Prendre RDV',
    contactIntro:
      'Prêt pour une nouvelle implémentation ? Envoyez vos coordonnées pour établir une connexion sécurisée.',
    transmit: 'TRANSMIT_PACKET',
    transmitting: 'TRANSMITTING...',
    transmitOk: 'TRANSMISSION_COMPLETE // PACKET_DELIVERED',
    transmitErr: 'ERROR_PROTOCOL // RETRY_OR_MAIL_CONTACT@HAYTHI.MG',
    privacyTitle: 'PRIVACY_POLICY',
    privacyBody:
      "HAYTHI.MG collecte uniquement les données que vous soumettez via le formulaire de contact (identité, organisation, email, type de mission, détails). Ces données servent exclusivement à répondre à votre demande. Elles ne sont ni vendues ni cédées à des tiers. Votre adresse IP n'est pas enregistrée avec votre demande. Conservation : durée nécessaire au traitement de la demande, puis suppression. Mesure d'audience : ce site comptabilise ses visites de façon agrégée, via notre propre serveur (first-party) : page consultée, site d'origine éventuel et langue, sous forme de compteurs journaliers. Aucun cookie, aucune adresse IP, aucun identifiant ni profil individuel n'est enregistré ; aucun traceur publicitaire ou outil d'analyse tiers n'est utilisé, et ces compteurs ne sont ni revendus ni partagés. Contact DPO / responsable : contact@haythi.mg. Vous pouvez demander accès, rectification ou suppression à tout moment.",
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
    seoTitle:
      'Freelance IT Consultant — Web Development, IT Advisory & Architecture | HAYTHI',
    seoDescription:
      'Freelance IT consultant (15+ years): web development, IT advisory & audit, application architecture, Agile/PMP project management. Remote and international engagements. Contact HAYTHI.',
    heroTitleLead: 'IT EXPERTISE &',
    heroTitleAccent: 'CONSULTING',
    heroBody:
      'Freelance IT consultant | 15+ years experience. Web development, IT advisory, application architecture and project management. High-precision software engineering — remote and international.',
    ctaServices: 'Explore services',
    ctaRdv: 'Book a call',
    contactIntro:
      'Ready for a new implementation? Send credentials to establish a secure channel.',
    transmit: 'TRANSMIT_PACKET',
    transmitting: 'TRANSMITTING...',
    transmitOk: 'TRANSMISSION_COMPLETE // PACKET_DELIVERED',
    transmitErr: 'ERROR_PROTOCOL // RETRY_OR_MAIL_CONTACT@HAYTHI.MG',
    privacyTitle: 'PRIVACY_POLICY',
    privacyBody:
      'HAYTHI.MG only collects data you submit via the contact form (identity, organization, email, mission type, details). Data is used solely to answer your request. It is never sold or shared with third parties. Your IP address is not stored with your request. Retention: as long as needed to process the request, then deleted. Audience measurement: this site counts visits in aggregate through our own server (first-party): page viewed, referring site if any, and language, stored as daily counters. No cookies, IP addresses, identifiers or individual profiles are recorded; no third-party advertising trackers or analytics tools are used, and these counters are never resold or shared. Contact: contact@haythi.mg. You may request access, correction, or deletion at any time.',
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
