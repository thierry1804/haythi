'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Process = () => {
  const { t } = useLanguage();

  const steps = [
    {
      phase: 'PHASE_01',
      title: 'Diagnostic',
      description: 'System scan, gap analysis, and vulnerability detection.',
      borderColor: 'border-tertiary',
      phaseColor: 'text-tertiary',
      titleColor: 'text-on-surface',
    },
    {
      phase: 'PHASE_02',
      title: 'Strategy',
      description: 'Roadmap design and architectural blueprint definition.',
      borderColor: 'border-outline-variant',
      phaseColor: 'text-white/20',
      titleColor: 'text-white/60',
    },
    {
      phase: 'PHASE_03',
      title: 'Implementation',
      description: 'Deployment of hardened protocols and infrastructure.',
      borderColor: 'border-primary',
      phaseColor: 'text-primary',
      titleColor: 'text-on-surface',
    },
    {
      phase: 'PHASE_04',
      title: 'Monitoring',
      description: '24/7 observability and continuous optimization loops.',
      borderColor: 'border-tertiary',
      phaseColor: 'text-tertiary',
      titleColor: 'text-on-surface',
      glow: true,
    },
  ];

  return (
    <section id="process" className="relative flex w-full flex-col py-24 overflow-hidden">
      <div className="px-8 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter mb-16 uppercase text-on-surface">
            Methodology<span className="text-tertiary">.exe</span>
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-surface-container-low p-8 border-l-2 ${step.borderColor} ${step.glow ? 'shadow-[0_0_15px_rgba(0,218,243,0.1)]' : ''}`}
              >
                <div className={`font-label ${step.phaseColor} text-[10px] tracking-[0.3em] mb-4`}>
                  {step.phase}
                </div>
                <h4 className={`font-headline text-lg font-bold uppercase mb-3 ${step.titleColor}`}>
                  {step.title}
                </h4>
                <p className="text-xs text-on-surface-variant/70 font-light uppercase tracking-wider leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
