'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { certifications } from '@/data/certifications';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const Certifications = () => {
  const { t } = useLanguage();

  return (
    <section id="certifications" className="py-section-lg bg-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.certifications.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2">
                      {cert.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary">{cert.year}</Badge>
                      <span className="text-sm text-gray-medium">
                        {cert.issuer}
                      </span>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-accent hover:text-blue-600 transition-colors duration-300"
                      >
                        <span className="text-sm font-medium">Voir le certificat</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

