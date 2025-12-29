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
    <section id="blog" className="py-section-lg bg-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t.blog.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {latestPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gray-medium rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-sm">{post.category}</span>
                </div>

                <div className="flex-1">
                  <div className="mb-3">
                    <Badge variant="primary">{post.category}</Badge>
                  </div>
                  
                  <h3 className="text-xl font-bold text-black mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-medium mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center space-x-4 text-sm text-gray-medium mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.date, language === 'fr' ? 'fr-FR' : 'en-US')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} {t.blog.readTime}</span>
                    </div>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" size="sm" className="w-full">
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

