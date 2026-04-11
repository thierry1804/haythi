'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Calendar, FolderKanban, Award } from 'lucide-react';

export const About = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Calendar, value: '15+', label: t.about.stats.experience },
    { icon: FolderKanban, value: '50+', label: t.about.stats.projects },
    { icon: Award, value: '4', label: t.about.stats.certifications },
  ];

  return (
    <section id="about" className="py-section-lg">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase mb-8">
              {t.about.title}
            </h2>

            <div className="w-32 h-32 mx-auto mb-8 bg-surface-container-high flex items-center justify-center">
              <span className="text-4xl font-bold text-tertiary font-headline">T2S</span>
            </div>

            <p className="text-lg text-on-surface-variant leading-relaxed mb-12 font-body">
              {t.about.text}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-tertiary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-tertiary" />
                  </div>
                  <div className="text-4xl font-bold text-on-surface font-headline mb-2">{stat.value}</div>
                  <div className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
