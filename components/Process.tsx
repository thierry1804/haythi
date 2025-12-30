'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Process = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: 'travel_explore',
      title: 'Discovery',
      description: 'Deep dive into your business goals and technical requirements.',
    },
    {
      icon: 'design_services',
      title: 'Design',
      description: 'Creating intuitive prototypes and high-fidelity visual assets.',
    },
    {
      icon: 'terminal',
      title: 'Development',
      description: 'Building scalable solutions using modern technology stacks.',
    },
    {
      icon: 'rocket_launch',
      title: 'Deployment',
      description: 'Rigorous testing followed by seamless production launch.',
    },
  ];

  return (
    <section id="process" className="relative flex w-full flex-col py-20 bg-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px]"></div>
      </div>
      <div className="px-4 md:px-40 flex flex-1 justify-center relative z-10">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="flex flex-col gap-4 max-w-[720px] mx-auto text-center mb-16">
            <h2 className="text-primary text-sm font-bold uppercase tracking-wider">How We Work</h2>
            <h3 className="text-title tracking-tight text-3xl md:text-5xl font-bold leading-tight">
              Our Development Process
            </h3>
            <p className="text-body text-lg font-normal leading-relaxed">
              A transparent, agile workflow designed to deliver excellence at every stage.
            </p>
          </div>
          <div className="relative mt-8">
            <div className="hidden md:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-slate-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-60 animate-pulse w-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative flex flex-col pt-0 md:pt-10"
                >
                  <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 z-10 size-20 items-center justify-center rounded-full bg-white border-2 border-slate-200 group-hover:border-primary group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary transition-colors duration-300">{step.icon}</span>
                  </div>
                  <div className="relative flex flex-col items-center text-center p-6 rounded-xl bg-white border border-border-color group-hover:border-primary/50 group-hover:-translate-y-2 group-hover:shadow-xl group-hover:shadow-blue-500/5 transition-all duration-300 h-full mt-4 md:mt-8 cursor-default">
                    <div className="md:hidden mb-4 size-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:text-primary text-slate-400 transition-colors">
                      <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                    </div>
                    <div className="absolute -top-3 bg-white border border-border-color group-hover:border-primary/50 group-hover:bg-blue-50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-slate-500 group-hover:text-primary transition-all uppercase">
                      Step {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 className="text-title text-xl font-bold mb-2 mt-4 group-hover:text-primary transition-colors">{step.title}</h4>
                    <p className="text-body text-sm leading-relaxed mb-4">{step.description}</p>
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


