'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Portfolio = () => {
  const { t } = useLanguage();

  const projects = [
    {
      id: 'electracker',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO3bi5wXVCMLBGI400_wFCCE0ZxxEXIAxRw99AOKlOGr825_kQPyOO1KKpndfq5h0Okyp_pwiT1SHpH8-n85RP1L8xNTqQ-w1fkMb1ildpte3IQ9HaFUqYh-fuotmBXhfNvxReOvpdGkitiaYxMtMjK6DOLsdDJ1cwM779JeVg_8pNpLvCgwrtsrCtZ90ZiAVKfGUIcPlfFH1YfNPTW1_heFai5LX1ISLgkDL6XgmaebDcJ3eao1yOfykk0KCHGGMPTUDI_lcMrWg',
      tags: ['IoT_INTEGRATION', 'REAL_TIME'],
      tagColors: ['bg-surface-container-highest', 'bg-tertiary/20 text-tertiary'],
      title: 'Electracker',
      titleColor: 'text-primary',
      timestamp: '2023.08',
      description: 'Syst\u00e8me complexe de surveillance \u00e9nerg\u00e9tique. Analyse pr\u00e9dictive des flux \u00e9lectriques et monitoring temps r\u00e9el pour infrastructures industrielles.',
      techTags: ['Energy Analytics', 'InfluxDB', 'React_Core'],
      status: 'ACTIVE_NODE',
      statusColor: 'text-tertiary',
      link: 'VIEW_DATA_STRUCTURE',
      linkDecor: 'decoration-primary',
    },
    {
      id: 'piggyback',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdR22M6AcqEKBMSMyogsikYDiC3BhNky70Yo5yehUiAgAdUfz6idJcA7V2NIWgQdPsVUM0hj2UWeyRr19F5Ln32NeV7sQ_rdnJnifKjK90WoiMDIyIjJJcqZfVKmJC1z3FDz_eBqerP_d4ARJdMMeq_XT9xRjpItTxziJRC5wpYjmpe4ZHhVHK87_alBiql9iXCSoGs7IsO3EDkVidFVfaRxnnpEM7UPKo8F9JvXmmNt0hBKkqSaNbunQcuA2GmJaTcKOU4EghXg4',
      tags: ['CLOUD_INFRA', 'ENCRYPTED'],
      tagColors: ['bg-surface-container-highest', 'bg-primary/20 text-primary'],
      title: 'Piggyback',
      titleColor: 'text-tertiary',
      timestamp: '2024.01',
      description: 'Protocole de sauvegarde redondant et infrastructure cloud hybride. Garantit l\u2019int\u00e9grit\u00e9 des donn\u00e9es via une architecture multi-tenant s\u00e9curis\u00e9e.',
      techTags: ['Data Security', 'AWS_Edge', 'Rust_Backend'],
      status: 'SECURE_UPLINK',
      statusColor: 'text-primary',
      link: 'ACCESS_PROTOCOL',
      linkDecor: 'decoration-tertiary',
    },
  ];

  return (
    <section id="work" className="relative flex w-full flex-col data-grid-overlay">
      <div className="px-8 md:px-12 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-on-surface flex items-center gap-4">
              NODES_D&Eacute;PLOY&Eacute;S
              <span className="h-[1px] w-48 bg-outline-variant/30"></span>
            </h2>
            <span className="font-label text-[10px] uppercase text-tertiary hidden md:block">FILTER: ALL_CATEGORIES</span>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative flex flex-col bg-surface-container-lowest border border-outline-variant/10 hover:border-tertiary/40 transition-all duration-500 overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={project.title}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 ${project.tagColors[i]} text-[8px] font-label tracking-widest uppercase`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className={`font-headline text-3xl md:text-4xl font-bold uppercase tracking-tighter ${project.titleColor}`}>
                      {project.title}
                    </h3>
                    <span className="font-label text-[10px] text-on-surface-variant/40">
                      TIMESTAMP // {project.timestamp}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Tech Tags & Footer */}
                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {project.techTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-surface-container border border-outline-variant/20 text-[10px] font-label uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
                      <span className={`text-[10px] font-label ${project.statusColor} uppercase flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${project.statusColor === 'text-tertiary' ? 'bg-tertiary' : 'bg-primary'}`}></span>
                        {project.status}
                      </span>
                      <a className={`font-label text-[10px] text-on-surface uppercase underline ${project.linkDecor} decoration-2 underline-offset-4 hover:text-tertiary transition-colors cursor-pointer`}>
                        {project.link}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* IT Consulting Banner */}
          <div className="mt-20 p-12 bg-surface-container relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 font-label text-[8px] opacity-10 leading-none text-on-surface">
              01011001 01001111 01010101 00100000 01000001 01010010 01000101 00100000 01001000 01000101 01010010 01000101
            </div>
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="md:w-1/3">
                <h4 className="font-headline text-3xl font-bold uppercase tracking-tighter text-on-surface mb-2">IT_CONSULTING</h4>
                <div className="h-1 w-12 bg-tertiary"></div>
              </div>
              <div className="md:w-2/3">
                <p className="font-body text-sm text-on-surface-variant leading-relaxed italic">
                  &ldquo;L&apos;ing&eacute;nierie logicielle ne consiste pas seulement &agrave; &eacute;crire du code, mais &agrave; concevoir des syst&egrave;mes r&eacute;silients qui survivent aux environnements de production les plus hostiles.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
