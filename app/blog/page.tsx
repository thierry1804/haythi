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

const categories = ['Tous', 'Développement', 'Architecture', 'Management', 'Bonnes Pratiques'];

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
    <main className="min-h-screen">
      <Header />
      
      <section className="pt-32 pb-16 bg-gray-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              {t.blog.title}
            </h1>
          </motion.div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-medium" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    selectedCategory === category
                      ? 'bg-accent text-white'
                      : 'bg-white text-gray-dark hover:bg-gray-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
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
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-medium text-lg">Aucun article trouvé.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

