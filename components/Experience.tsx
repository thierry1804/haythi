'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { experiences } from '@/data/experience';
import { Card } from './ui/Card';

export const Experience = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="py-section-lg bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.experience.title}
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-light transform md:-translate-x-1/2"></div>

            {/* Timeline items */}
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
                  {/* Timeline dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>

                  {/* Content card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-5/12 ${
                      index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                    }`}
                  >
                    <Card hover className="h-full">
                      <div className="text-sm text-accent font-semibold mb-2">
                        {exp.period.start} – {exp.period.end}
                      </div>
                      <h3 className="text-xl font-bold text-black mb-1">
                        {exp.title}
                      </h3>
                      <div className="text-lg text-gray-medium mb-4">
                        {exp.company}
                      </div>
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-accent mr-2">•</span>
                            <span className="text-gray-medium">{resp}</span>
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
      </div>
    </section>
  );
};

