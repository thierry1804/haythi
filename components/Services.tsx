'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Services = () => {
  const { t } = useLanguage();

  const serviceItems = [
    {
      id: '01',
      icon: 'terminal',
      title: t.services.webDev.title.toUpperCase(),
      description: t.services.webDev.description,
      tags: ['REACT.JS', 'NEXT.JS', 'SYMFONY', 'PHP'],
      colSpan: 'md:col-span-8',
      accentColor: 'tertiary',
      hasImage: true,
    },
    {
      id: '02',
      icon: 'brush',
      title: t.services.consulting.title.toUpperCase(),
      description: t.services.consulting.description,
      tags: [],
      colSpan: 'md:col-span-4',
      accentColor: 'primary',
      statusLine: 'PROTOCOL_AUDIT_READY',
    },
    {
      id: '03',
      icon: 'insights',
      title: t.services.architecture.title.toUpperCase(),
      description: t.services.architecture.description,
      tags: [],
      colSpan: 'md:col-span-4',
      accentColor: 'tertiary',
      progressBar: { label: 'SYS_EFFICIENCY', value: 92 },
    },
    {
      id: '04',
      icon: 'security',
      title: t.services.management.title.toUpperCase(),
      description: t.services.management.description,
      tags: [],
      colSpan: 'md:col-span-8',
      accentColor: 'primary',
      gridItems: ['AWS / AZURE / GCP', 'DOCKER / K8S', 'SCRUM / AGILE', 'PMP CERTIFIED'],
    },
  ];

  return (
    <section id="services" className="relative flex w-full flex-col py-24 data-grid-overlay">
      <div className="px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="flex flex-col gap-4 max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-tertiary"></div>
                <span className="font-label text-tertiary text-[10px] uppercase tracking-[0.3em]">PROTOCOL_02: EXPERTISE</span>
              </div>
              <h2 className="font-headline tracking-tighter text-3xl md:text-5xl font-bold text-on-surface uppercase">
                {t.services.title}
              </h2>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {serviceItems.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${service.colSpan} group relative overflow-hidden bg-surface-container-low border border-outline-variant/5 p-8 transition-all hover:bg-surface-container`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                  <span className={`font-headline text-4xl font-bold ${service.accentColor === 'tertiary' ? 'text-tertiary/20' : 'text-primary/20'}`}>
                    {service.id}
                  </span>
                  <span className={`material-symbols-outlined ${service.accentColor === 'tertiary' ? 'text-tertiary' : 'text-primary'} text-3xl`}>
                    {service.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4 uppercase tracking-tight">
                  {service.title}
                </h3>
                <p className="text-on-surface-variant font-body text-sm mb-8 max-w-md leading-relaxed">
                  {service.description}
                </p>

                {/* Tags */}
                {service.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-container-highest font-headline text-[9px] tracking-widest text-tertiary uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Status Line */}
                {service.statusLine && (
                  <div className="border-t border-outline-variant/10 pt-6 mt-auto">
                    <div className="flex items-center text-[10px] font-headline tracking-widest" style={{ color: service.accentColor === 'primary' ? '#ffb4a7' : '#00daf3' }}>
                      <span className="mr-2">{service.statusLine}</span>
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {service.progressBar && (
                  <div className="space-y-3 mt-auto">
                    <div className="w-full bg-surface-container-highest h-[2px]">
                      <div className="bg-tertiary h-full" style={{ width: `${service.progressBar.value}%` }}></div>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-white/30">
                      <span>{service.progressBar.label}</span>
                      <span>{service.progressBar.value}%</span>
                    </div>
                  </div>
                )}

                {/* Grid Items */}
                {service.gridItems && (
                  <div className="grid grid-cols-2 gap-4">
                    {service.gridItems.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary"></div>
                        <span className="font-mono text-[10px] text-white/40">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Gradient overlay for large cards */}
                {service.colSpan === 'md:col-span-8' && index === 3 && (
                  <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
