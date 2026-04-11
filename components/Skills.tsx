'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { skillCategories } from '@/data/skills';
import { Badge } from './ui/Badge';

export const Skills = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-section-lg bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase">
            {t.skills.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-surface-container-low border border-outline-variant/5 p-6 hover:bg-surface-container transition-all"
            >
              <h3 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tight mb-4">
                {t.skills.categories[category.nameKey]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge key={tech} variant="tertiary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
