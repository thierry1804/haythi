'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, Linkedin } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#services', label: t.nav.services },
    { href: '#about', label: t.nav.about },
    { href: '#skills', label: t.nav.skills },
    { href: '#experience', label: t.nav.experience },
    { href: '#certifications', label: t.nav.certifications },
    { href: '#blog', label: t.nav.blog },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t.footer.quickLinks}</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-light hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-light" />
                <a
                  href={`mailto:${t.contact.email}`}
                  className="text-gray-light hover:text-white transition-colors duration-300"
                >
                  {t.contact.email}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-light" />
                <a
                  href={`tel:${t.contact.phone.replace(/\s/g, '')}`}
                  className="text-gray-light hover:text-white transition-colors duration-300"
                >
                  {t.contact.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Linkedin className="w-5 h-5 text-gray-light" />
                <a
                  href={t.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-light hover:text-white transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t.footer.followUs}</h3>
            <div className="space-y-4">
              <a
                href={t.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-gray-light hover:text-white transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-medium">
              <p className="text-gray-light text-sm">
                © {new Date().getFullYear()} HAYTHI. {t.footer.legal}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

