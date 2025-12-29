'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Calendar, FolderKanban, Award } from 'lucide-react';

export const About = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Calendar,
      value: '15+',
      label: t.about.stats.experience,
    },
    {
      icon: FolderKanban,
      value: '50+',
      label: t.about.stats.projects,
    },
    {
      icon: Award,
      value: '4',
      label: t.about.stats.certifications,
    },
  ];

  return (
    <section id="about" className="py-section-lg bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-8">
              {t.about.title}
            </h2>
            
            {/* Photo placeholder */}
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gray-light flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-medium">T2S</span>
            </div>

            <p className="text-lg text-gray-medium leading-relaxed mb-12">
              {t.about.text}
            </p>
          </div>

          {/* Stats */}
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="text-4xl font-bold text-black mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

