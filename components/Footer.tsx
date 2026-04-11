'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-outline-variant/10 bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand */}
        <Link
          href="/"
          className="rounded-lg bg-white/[0.07] px-2 py-1.5 backdrop-blur-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary/70"
        >
          <Image
            src="/logo.png"
            alt="HAYTHI.MG"
            width={180}
            height={44}
            className="h-7 w-auto object-contain object-left invert brightness-[1.08] contrast-[1.06] drop-shadow-[0_0_14px_rgba(255,180,167,0.38)]"
          />
        </Link>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-8">
          <Link
            href="#services"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-tertiary hover:tracking-[0.3em] transition-all duration-500"
          >
            Services
          </Link>
          <Link
            href="#work"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-tertiary hover:tracking-[0.3em] transition-all duration-500"
          >
            Projets
          </Link>
          <Link
            href="#contact"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-tertiary hover:tracking-[0.3em] transition-all duration-500"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-tertiary hover:tracking-[0.3em] transition-all duration-500"
          >
            Privacy
          </Link>
        </div>

        {/* Copyright */}
        <div className="font-body text-[10px] uppercase tracking-[0.2em] text-white/40">
          &copy; 2024 HAYTHI.MG // KINETIC ARCHIVE PROTOCOL
        </div>
      </div>
    </footer>
  );
};
