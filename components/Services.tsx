'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { services } from '@/data/services';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const Services = () => {
  const { t } = useLanguage();

  const getServiceData = (service: typeof services[0]) => {
    const serviceData = t.services[service.titleKey] as any;
    return {
      title: serviceData.title,
      description: serviceData.description,
      details: serviceData.technologies || serviceData.certifications || serviceData.expertise || serviceData.domains,
    };
  };

  return (
    <section id="services" className="py-section-lg bg-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.services.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const serviceData = getServiceData(service);
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-3">
                      {serviceData.title}
                    </h3>
                    <p className="text-gray-medium mb-4">
                      {serviceData.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {serviceData.details.split(', ').map((tech: string, i: number) => (
                        <Badge key={i} variant="primary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

