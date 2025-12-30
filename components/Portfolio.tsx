'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/context/LanguageContext';
import { portfolioItems } from '@/data/portfolio';

export const Portfolio = () => {
  const { t } = useLanguage();

  return (
    <section id="work" className="relative flex w-full flex-col py-16 bg-page-bg-alt">
      <div className="px-4 md:px-40 flex flex-1 justify-center">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="flex flex-col gap-10 px-4 py-6">
            <div className="flex flex-col gap-4 max-w-[720px]">
              <h2 className="text-primary text-sm font-bold uppercase tracking-wider">Featured Work</h2>
              <h3 className="text-title tracking-tight text-3xl md:text-4xl font-bold leading-tight">
                Success Stories
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: 'fintrack',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgUabgg52sKRnHz1hVPitdHgv8JWCXKiHl1bd63OasXihRu4HLYn03U716h7MUaYkajRsALvmzhEwhTxxAzNh7GLraEnxCCxGQpizlyxLwRNOMni0GCWCvW5A6GB58bNe9om9x_wdJHvWyovpAxYs0Z2G1M2yNcsvzLiGYm2ueKaJwUEEgpLKEsxLCp2sAwZNOOAl87G6_kzLGNUyAeDljGAbwZqMbr-MNPSMu6KjwKzkpWuFFqQ_q1eajBMScG2raafw6axep6_6R',
                  tags: ['FinTech', 'Web App'],
                  title: 'FinTrack Analytics Platform',
                  description: 'Re-engineered a legacy financial system into a modern, real-time analytics dashboard serving 10k+ users.'
                },
                {
                  id: 'shopflow',
                  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfXMN2Bt3pQzs57HMmxDg6I3Znin20W9FsFW79ozqNcTPtbSfjhahUUv9OnCo8yYDsCisfzy2v62-9zH3BCwUlRLR6lDWuVukDfivLrOnFeAHI8ZfqHKhiScbw5xWObns_6DAa87-45efcVYff9UgfAAhQBxFI5gg_AXNJETkNnaMQuSctjGNau4P-Lo89zU-TAA0iiPlm9gry7q1j1CPKCffRP2iBT8rUFd5qmylltMB3cSPwUIzUyLvLGNvSAokyYwvwUsCeaWMh',
                  tags: ['E-Commerce', 'Mobile'],
                  title: 'ShopFlow Mobile Experience',
                  description: 'Developed a cross-platform mobile application that increased mobile conversion rates by 45%.'
                }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-white border border-border-color shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={item.image}
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary border border-blue-100">{item.tags[0]}</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">{item.tags[1]}</span>
                    </div>
                    <h4 className="text-title text-xl font-bold">{item.title}</h4>
                    <p className="text-body text-sm leading-relaxed line-clamp-2">{item.description}</p>
                    <a className="mt-2 inline-flex items-center text-sm font-bold text-primary hover:text-primary-dark transition-colors" href="#">
                      Read Case Study <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
                    </a>
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

