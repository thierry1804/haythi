'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { HeroLines } from './HeroLines';

export const Hero = () => {
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden data-grid-overlay"
    >
      {/* Background Ambient Glows — sous le flux de lignes pour ne pas les masquer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Animated Lines Layer — au-dessus des halos, sous le contenu */}
      <HeroLines />

      <div className="px-8 md:px-12 lg:px-24 py-24 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <span className="px-3 py-1 bg-tertiary/10 text-tertiary font-headline text-[10px] tracking-[0.2em] border border-tertiary/20">
                PROTOCOL_01: SERVICES
              </span>
              <div className="h-px w-24 bg-tertiary/20"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-on-surface mb-8 leading-[0.9]"
            >
              EXPERTISE IT &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-on-primary-container to-tertiary">
                CONSULTING
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-on-surface-variant font-body text-lg leading-relaxed max-w-xl mb-8"
            >
              {t.hero.description}. Solutions d&apos;ing&eacute;nierie logicielle de haute pr&eacute;cision. Nous transformons des concepts complexes en infrastructures num&eacute;riques r&eacute;silientes et performantes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => scrollToSection('#contact')}
                className="group relative bg-tertiary text-on-tertiary font-headline font-bold uppercase py-4 px-8 text-xs tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 glow-tertiary"
              >
                <span className="relative z-10">{t.hero.cta1}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              <button
                onClick={() => scrollToSection('#work')}
                className="bg-transparent border border-outline text-tertiary font-headline uppercase py-4 px-8 text-xs tracking-[0.2em] hover:bg-tertiary/5 hover:border-tertiary/50 transition-all"
              >
                {t.hero.cta2}
              </button>
            </motion.div>
          </div>

          {/* Right Metadata */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="hidden md:block font-mono text-[10px] text-white/30 space-y-1 text-right"
          >
            <div>LATENCY: 14MS</div>
            <div>THROUGHPUT: 1.2GB/S</div>
            <div>ENCRYPTION: AES-256-GCM</div>
            <div className="text-tertiary">SYS_STABILITY: 99.99%</div>
          </motion.div>
        </div>
      </div>

      {/* Bottom border tonal shift */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-outline-variant/10"></div>
    </section>
  );
};
