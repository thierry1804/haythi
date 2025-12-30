'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

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
      className="relative flex min-h-[600px] flex-col overflow-hidden w-full"
      style={{ backgroundColor: '#0f172a' }}
    >
      <div className="flex h-full grow flex-col">
        <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[1280px] flex-1">
            <div className="h-full">
              <div className="p-4 md:p-4 h-full">
                <div 
                  className="flex min-h-[560px] flex-col gap-6 md:gap-8 bg-cover bg-center bg-no-repeat rounded-2xl items-start justify-end px-4 md:px-10 pb-12 relative overflow-hidden group border border-white/5"
                  style={{
                    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.98) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCANkOuW2R39q3wghCONtBrhFzgKJZWL8lyU4wqvOzC6UZ369h2gtkrU5sH6oebO4PKbilzo7Lxq_GMEQYC8hnBj5edPYQ5UgK4xaUBH9O0aMgnNPaYmjvyPJSnyeQL2yyfN52qw93pM_Y2oC96S7hgnZ8KOBPV2p-DGb4vzP9Q2Fc9e4CatDNfBamNsvAAvy4LB8Ugww_QWus8lcFwAWKXgVM3LkYEuqutvH3EkFnuALSqiUONAQwj4pvyPMZzWL1k_mxO4TScQYXz")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-dark-section/40 pointer-events-none"></div>
                  
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
                    <div className="absolute top-[30%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
                    <div className="absolute bottom-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
                    <div className="absolute top-[30%] left-[20%] w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-pulse"></div>
                    <div className="absolute bottom-[40%] right-[30%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" style={{ animationDelay: '700ms' }}></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex flex-col gap-4 text-left max-w-3xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/20 w-fit backdrop-blur-md"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                      <span className="text-blue-200 text-xs font-bold uppercase tracking-wider">Innovate Faster</span>
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="text-white text-4xl md:text-6xl font-bold leading-tight tracking-[-0.033em] md:leading-[1.1] drop-shadow-xl"
                    >
                      Building the Future of Your Business Through Code
                    </motion.h1>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-slate-300 text-sm md:text-lg font-normal leading-relaxed md:max-w-xl"
                    >
                      We transform complex business problems into elegant, scalable software solutions. Partner with us to accelerate your digital transformation.
                    </motion.h2>
                  </div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative z-10 flex flex-wrap gap-3 mt-4"
                  >
                    <button
                      onClick={() => scrollToSection('#contact')}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary-dark transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-500/25"
                    >
                      <span className="truncate">Get a Quote</span>
                    </button>
                    <button
                      onClick={() => scrollToSection('#work')}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition-all text-white text-base font-bold leading-normal tracking-[0.015em] backdrop-blur-md"
                    >
                      <span className="truncate">View Portfolio</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

