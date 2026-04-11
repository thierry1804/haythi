'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  const navLinks = [
    { href: '#home', label: 'FLUX' },
    { href: '#services', label: 'SERVICES' },
    { href: '#process', label: 'CONSULTING' },
    { href: '#work', label: 'PROJETS' },
    { href: '#contact', label: 'TERMINAL' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-tertiary/10 ambient-shadow">
      <div className="flex justify-between items-center px-6 md:px-12 h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg bg-white/[0.08] px-2.5 py-1.5 backdrop-blur-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary/70"
        >
          <Image
            src="/logo.png"
            alt="HAYTHI.MG"
            width={200}
            height={48}
            className="h-8 w-auto md:h-9 object-contain object-left invert brightness-[1.08] contrast-[1.06] drop-shadow-[0_0_18px_rgba(255,180,167,0.42)]"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-headline uppercase tracking-widest text-xs transition-colors ${
                index === 0
                  ? 'text-tertiary border-b border-tertiary pb-1'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="text-white/40 hover:text-tertiary hover:bg-tertiary/10 p-2 transition-all font-headline text-[10px] tracking-widest uppercase"
            aria-label="Toggle language"
          >
            {language.toUpperCase()}
          </button>

          {/* Icons */}
          <button className="hidden md:flex text-tertiary hover:bg-surface-container-high p-2 transition-all">
            <span className="material-symbols-outlined">terminal</span>
          </button>

          {/* CTA Button */}
          <button className="hidden md:flex items-center justify-center bg-primary-container text-on-primary-container px-6 py-2 font-headline uppercase text-xs tracking-[0.2em] hover:brightness-110 active:scale-95">
            <span>Connect</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-high transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/10">
          <div className="flex flex-col px-6 py-6 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white/40 hover:text-tertiary hover:bg-tertiary/5 px-4 py-3 font-headline text-[10px] tracking-widest uppercase transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
