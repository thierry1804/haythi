'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { skillCategories } from '@/data/skills';
import { Badge } from './ui/Badge';

export const Skills = () => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-section-lg bg-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.skills.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-black mb-4">
                {t.skills.categories[category.nameKey]}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.technologies.map((tech) => (
                  <Badge key={tech} variant="primary">
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

