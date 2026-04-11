'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { experiences } from '@/data/experience';
import { Card } from './ui/Card';

export const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-section-lg">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase">
            {t.experience.title}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-outline-variant/20 transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="absolute left-8 md:left-1/2 w-3 h-3 bg-tertiary transform md:-translate-x-1/2 z-10"></div>

                <div className={`ml-20 md:ml-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                }`}>
                  <Card hover className="h-full">
                    <div className="text-[10px] text-tertiary font-label uppercase tracking-widest mb-2">
                      {exp.period.start} &ndash; {exp.period.end}
                    </div>
                    <h3 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tight mb-1">
                      {exp.title}
                    </h3>
                    <div className="text-sm text-primary mb-4 font-label uppercase tracking-wider">
                      {exp.company}
                    </div>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start text-sm text-on-surface-variant">
                          <span className="w-1 h-1 bg-tertiary mt-2 mr-3 shrink-0"></span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
