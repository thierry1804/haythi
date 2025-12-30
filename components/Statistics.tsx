'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Statistics = () => {
  const stats = [
    {
      icon: 'rocket_launch',
      number: '500+',
      label: 'Projects Delivered Successfully',
    },
    {
      icon: 'handshake',
      number: '98%',
      label: 'Client Retention Rate',
    },
    {
      icon: 'verified_user',
      number: '10+',
      label: 'Years of Technical Excellence',
    },
  ];

  return (
    <section className="relative flex w-full flex-col bg-white border-b border-gray-100">
      <div className="flex flex-1 justify-center py-5 px-4 md:px-40">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col gap-2 rounded-xl p-8 bg-white border border-border-color shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-blue-50 rounded-lg w-fit text-primary mb-2">
                  <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                </div>
                <p className="text-title text-4xl font-bold leading-tight tracking-tight">{stat.number}</p>
                <p className="text-body text-base font-medium leading-normal">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};


