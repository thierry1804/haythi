import { useEffect } from 'react';
import { useI18n } from '../i18n';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function SeoHead() {
  const { lang, t } = useI18n();

  useEffect(() => {
    const title = t('seoTitle');
    const description = t('seoDescription');
    const locale = lang === 'FR' ? 'fr_FR' : 'en_US';

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', locale);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
  }, [lang, t]);

  return null;
}
