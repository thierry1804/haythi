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
    <section id="certifications" className="py-section-lg bg-surface-container-lowest">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase">
            {t.certifications.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tertiary/10 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-tertiary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-on-surface font-headline uppercase tracking-tight mb-2">
                      {cert.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge>{cert.year}</Badge>
                      <span className="text-xs text-on-surface-variant">{cert.issuer}</span>
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-tertiary hover:text-tertiary-fixed transition-colors font-label text-[10px] uppercase tracking-widest"
                      >
                        <span>VIEW_CERTIFICATE</span>
                        <ExternalLink className="w-3 h-3" />
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
