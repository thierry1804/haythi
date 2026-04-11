'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { blogPosts } from '@/data/blog';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

const categories = ['Tous', 'D\u00e9veloppement', 'Architecture', 'Management', 'Bonnes Pratiques'];

export default function BlogPage() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'Tous' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <section className="pt-32 pb-16 data-grid-overlay">
        <div className="max-w-6xl mx-auto px-8 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-tertiary"></div>
              <span className="font-label text-tertiary text-[10px] uppercase tracking-[0.3em]">DATA_ARCHIVE</span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter text-on-surface uppercase mb-4">
              {t.blog.title}
            </h1>
          </motion.div>

          {/* Search and Filters */}
          <div className="max-w-4xl mb-12">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <input
                  type="text"
                  placeholder="SEARCH_QUERY..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent border-0 border-b border-outline-variant text-on-surface font-body text-xs uppercase tracking-wider focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all placeholder:text-on-surface-variant/20"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 font-headline text-[10px] uppercase tracking-widest transition-all ${
                    selectedCategory === category
                      ? 'bg-tertiary/10 text-tertiary border border-tertiary/20'
                      : 'text-on-surface-variant/40 hover:text-on-surface border border-outline-variant/10 hover:border-outline-variant/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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

                    <p className="text-on-surface-variant text-sm font-body mb-4 line-clamp-3 leading-relaxed">
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
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">NO_DATA_FOUND</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
