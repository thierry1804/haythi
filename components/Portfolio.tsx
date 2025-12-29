'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { portfolioItems } from '@/data/portfolio';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export const Portfolio = () => {
  const { t } = useLanguage();

  return (
    <section id="portfolio" className="py-section-lg bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.portfolio.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gray-light rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-medium text-sm">{item.category}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-medium mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto"
                >
                  {t.portfolio.viewProject}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

