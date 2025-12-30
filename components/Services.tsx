'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { services } from '@/data/services';

export const Services = () => {
  const { t } = useLanguage();

  const getServiceData = (service: typeof services[0]) => {
    const serviceData = t.services[service.titleKey] as any;
    return {
      title: serviceData.title,
      description: serviceData.description,
    };
  };

  // Map service IDs to Material Symbols and service data
  const serviceDataMap: Record<string, { icon: string; title: string; description: string }> = {
    'web-dev': {
      icon: 'code',
      title: 'Custom Software',
      description: 'Tailored solutions built from the ground up to fit your specific business processes and workflows.'
    },
    'architecture': {
      icon: 'cloud_upload',
      title: 'DevOps & Cloud',
      description: 'Scalable, secure, and efficient cloud infrastructure management on AWS, Azure, or GCP.'
    },
    'management': {
      icon: 'lightbulb',
      title: 'IT Consulting',
      description: 'Strategic technology planning to align IT initiatives with your long-term business goals.'
    },
    'consulting': {
      icon: 'smartphone',
      title: 'Mobile App Dev',
      description: 'Native and cross-platform mobile applications for iOS and Android that engage users.'
    },
  };

  return (
    <section id="services" className="relative flex w-full flex-col py-16 bg-page-bg-alt">
      <div className="px-4 md:px-40 flex flex-1 justify-center">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="flex flex-col gap-10 px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex flex-col gap-4 max-w-[720px]">
                <h2 className="text-primary text-sm font-bold uppercase tracking-wider">Our Expertise</h2>
                <h3 className="text-title tracking-tight text-3xl md:text-5xl font-bold leading-tight">
                  Comprehensive IT Services
                </h3>
                <p className="text-body text-lg font-normal leading-relaxed">
                  From custom software to cloud infrastructure, we provide end-to-end technical services tailored to your specific business needs.
                </p>
              </div>
              <button className="flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors">
                View All Services <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['web-dev', 'consulting', 'management', 'architecture'].map((serviceId, index) => {
                const serviceData = serviceDataMap[serviceId] || serviceDataMap['web-dev'];
                
                return (
                  <motion.div
                    key={serviceId}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group flex flex-1 gap-6 rounded-xl border border-border-color bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all p-6 flex-col"
                  >
                    <div className="size-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{serviceData.icon}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-title text-xl font-bold leading-tight">{serviceData.title}</h4>
                      <p className="text-body text-sm font-normal leading-relaxed">{serviceData.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

