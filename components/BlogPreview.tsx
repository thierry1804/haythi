'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { blogPosts } from '@/data/blog';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDate } from '@/lib/utils';

export const BlogPreview = () => {
  const { t, language } = useLanguage();
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-section-lg">
      <div className="max-w-6xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase">
            {t.blog.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                <div className="w-full h-48 bg-surface-container-highest flex items-center justify-center mb-4">
                  <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">{post.category}</span>
                </div>

                <div className="flex-1">
                  <div className="mb-3">
                    <Badge variant="tertiary">{post.category}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-on-surface font-headline mb-3 uppercase tracking-tight">
                    {post.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.date, language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime} {t.blog.readTime}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    {t.blog.readMore}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blog">
            <Button size="lg">
              {t.blog.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
