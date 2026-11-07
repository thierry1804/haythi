import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

export default function Header() {
  const { lang, toggleLang, t } = useI18n();
  const [active, setActive] = useState('#home');
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t('navFlux'), href: '#home' },
    { label: t('navServices'), href: '#services' },
    { label: t('navConsulting'), href: '#process' },
    { label: t('navProjects'), href: '#work' },
    { label: t('navTerminal'), href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => {
      const ids = ['home', 'services', 'process', 'work', 'contact', 'privacy'];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY + 120 >= el.offsetTop) {
          setActive(`#${id}`);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-tertiary/10 ambient-shadow">
      <div className="flex justify-between items-center px-6 md:px-12 h-20">
        <a href="#home" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <img
            src="/mark-light.webp"
            alt="HAYTHI.MG"
            className="h-9 w-auto md:h-10 object-contain drop-shadow-[0_0_12px_rgba(255,180,167,0.35)] group-hover:opacity-90 transition-opacity"
          />
          <span className="hidden sm:block font-headline text-sm md:text-base font-bold tracking-[0.22em] text-on-surface uppercase">
            HAYTHI
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-headline uppercase tracking-widest text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary ${
                active === item.href
                  ? 'text-tertiary border-b border-tertiary pb-1'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            aria-label={t('toggleLang')}
            onClick={toggleLang}
            className="text-white/40 hover:text-tertiary hover:bg-tertiary/10 p-2 transition-all font-headline text-[10px] tracking-widest uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
          >
            {lang}
          </button>
          <a
            aria-label={t('navTerminal')}
            href="#contact"
            className="hidden md:flex text-tertiary hover:bg-surface-container-high p-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">
              terminal
            </span>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-2 bg-primary-container text-white font-headline text-[10px] tracking-widest uppercase hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary"
          >
            {t('connect')}
          </a>
          <button
            type="button"
            className={`burger md:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tertiary ${
              mobileOpen ? 'is-open' : ''
            }`}
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`mobile-panel md:hidden ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-panel-inner border-t border-tertiary/10 px-6 pb-6 pt-2 bg-surface/95 backdrop-blur-md">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ transitionDelay: mobileOpen ? `${80 + index * 50}ms` : '0ms' }}
              className={`mobile-link block font-headline uppercase tracking-widest text-xs py-3 border-b border-outline-variant/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-tertiary ${
                active === item.href ? 'text-tertiary' : 'text-white/60 hover:text-tertiary'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            style={{ transitionDelay: mobileOpen ? `${80 + navItems.length * 50}ms` : '0ms' }}
            className="mobile-link mt-5 inline-flex px-4 py-2.5 bg-primary-container text-white font-headline text-[10px] tracking-widest uppercase"
          >
            {t('connect')}
          </a>
        </div>
      </div>
    </header>
  );
}
