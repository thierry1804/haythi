import { useEffect, useState } from 'react';

const navItems = [
  { label: 'FLUX', href: '#home' },
  { label: 'SERVICES', href: '#services' },
  { label: 'CONSULTING', href: '#process' },
  { label: 'PROJETS', href: '#work' },
  { label: 'TERMINAL', href: '#contact' },
];

export default function Header() {
  const [active, setActive] = useState('#home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');

  useEffect(() => {
    const onScroll = () => {
      const ids = ['home', 'services', 'process', 'work', 'contact'];
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-tertiary/10 ambient-shadow">
      <div className="flex justify-between items-center px-6 md:px-12 h-20">
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src="/mark-light.webp"
            alt="HAYTHI.MG"
            className="h-9 w-auto md:h-10 object-contain drop-shadow-[0_0_12px_rgba(255,180,167,0.35)] group-hover:opacity-90 transition-opacity"
          />
          <span className="hidden sm:block font-headline text-sm md:text-base font-bold tracking-[0.22em] text-on-surface uppercase">
            HAYTHI
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-headline uppercase tracking-widest text-xs transition-colors ${
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
            aria-label="Toggle language"
            onClick={() => setLang((l) => (l === 'FR' ? 'EN' : 'FR'))}
            className="text-white/40 hover:text-tertiary hover:bg-tertiary/10 p-2 transition-all font-headline text-[10px] tracking-widest uppercase"
          >
            {lang}
          </button>
          <a
            aria-label="Aller à la section contact"
            href="#contact"
            className="hidden md:flex text-tertiary hover:bg-surface-container-high p-2 transition-all"
          >
            <span className="material-symbols-outlined text-xl">terminal</span>
          </a>
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-2 bg-primary-container text-white font-headline text-[10px] tracking-widest uppercase hover:brightness-110 transition-all"
          >
            CONNECT
          </a>
          <button
            type="button"
            className="md:hidden text-on-surface p-2"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-tertiary/10 px-6 py-4 space-y-3 bg-surface">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block font-headline uppercase tracking-widest text-xs text-white/60 hover:text-tertiary py-2"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="inline-flex px-4 py-2 bg-primary-container text-white font-headline text-[10px] tracking-widest uppercase"
          >
            CONNECT
          </a>
        </div>
      )}
    </header>
  );
}
