'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Statistics = () => {
  const stats = [
    {
      icon: 'rocket_launch',
      number: '50+',
      label: 'PROJECTS_DEPLOYED',
      status: 'ACTIVE',
    },
    {
      icon: 'handshake',
      number: '98%',
      label: 'CLIENT_RETENTION',
      status: 'STABLE',
    },
    {
      icon: 'verified_user',
      number: '15+',
      label: 'YEARS_UPTIME',
      status: 'VERIFIED',
    },
  ];

  return (
    <section className="relative flex w-full flex-col bg-surface-container-lowest border-y border-outline-variant/10">
      <div className="flex flex-1 justify-center py-5 px-4 md:px-12 lg:px-24">
        <div className="flex flex-col max-w-6xl flex-1 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-outline-variant/10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col gap-3 p-8 bg-surface hover:bg-surface-container transition-all group"
              >
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-tertiary text-3xl">{stat.icon}</span>
                  <span className="font-label text-[10px] tracking-widest uppercase text-white/20">{String(index + 1).padStart(2, '0')} / 03</span>
                </div>
                <p className="text-on-surface text-4xl font-bold font-headline leading-tight tracking-tighter mt-4">{stat.number}</p>
                <div className="flex items-center justify-between">
                  <p className="text-on-surface-variant text-[10px] font-headline uppercase tracking-widest">{stat.label}</p>
                  <span className="flex items-center gap-1.5 text-[9px] font-label text-tertiary uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                    {stat.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
