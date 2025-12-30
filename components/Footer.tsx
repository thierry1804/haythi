'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-dark-section border-t border-dark-border pt-16 pb-8 text-slate-400">
      <div className="px-4 md:px-40 flex flex-1 justify-center">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-4 mb-12">
            <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined text-primary text-3xl">deployed_code</span>
                <span className="text-xl font-bold">HayThi</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering businesses with cutting-edge technology solutions since 2014.
              </p>
              <div className="flex gap-4 mt-2">
                <a className="text-slate-400 hover:text-white transition-colors" href="#">
                  <span className="sr-only">Twitter</span>
                  <span className="material-symbols-outlined">public</span>
                </a>
                <a className="text-slate-400 hover:text-white transition-colors" href="#">
                  <span className="sr-only">LinkedIn</span>
                  <span className="material-symbols-outlined">work</span>
                </a>
                <a className="text-slate-400 hover:text-white transition-colors" href="#">
                  <span className="sr-only">GitHub</span>
                  <span className="material-symbols-outlined">code</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#about">About Us</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#services">Careers</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#blog">Blog</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li><Link className="hover:text-primary transition-colors" href="#services">Web Development</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#services">Mobile Development</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#services">Cloud Services</Link></li>
                <li><Link className="hover:text-primary transition-colors" href="#services">Data Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Newsletter</h4>
              <p className="text-sm mb-4">Subscribe to our newsletter for the latest tech trends.</p>
              <div className="flex gap-2">
                <input
                  className="h-10 w-full rounded bg-white/5 border border-white/10 px-3 text-white text-sm focus:border-primary focus:outline-none placeholder-slate-500"
                  placeholder="Email"
                  type="email"
                />
                <button className="h-10 px-4 rounded bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors">Go</button>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-border pt-8 px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">© 2024 HayThi. All rights reserved.</p>
            <div className="flex gap-6 text-slate-500 text-sm">
              <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
              <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

