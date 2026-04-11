'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { BlogPost } from '@/data/blog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface BlogPostContentProps {
  post: BlogPost;
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  const { t, language } = useLanguage();

  const content = `
# ${post.title}

${post.excerpt}

## Introduction

Ceci est un exemple de contenu d'article. Dans une application r\u00e9elle, le contenu serait charg\u00e9 depuis un CMS ou des fichiers markdown.

## Section principale

Le contenu de l'article serait ici, avec des paragraphes, des listes, du code, etc.

\`\`\`php
<?php
// Exemple de code
class Example {
    public function __construct() {
        // Code here
    }
}
\`\`\`

## Conclusion

Voici la conclusion de l'article.
  `;

  return (
    <article className="pt-32 pb-16 data-grid-overlay">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/blog">
            <Button variant="secondary" size="sm" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              RETURN_TO_ARCHIVE
            </Button>
          </Link>

          <div className="mb-6">
            <Badge variant="tertiary">{post.category}</Badge>
          </div>

          <h1 className="font-headline text-3xl md:text-5xl font-bold text-on-surface tracking-tighter uppercase mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-on-surface-variant/60 mb-8 pb-8 border-b border-outline-variant/10">
            <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.date, language === 'fr' ? 'fr-FR' : 'en-US')}</span>
            </div>
            <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} {t.blog.readTime}</span>
            </div>
            <div className="flex items-center gap-2 font-label text-[10px] uppercase tracking-widest">
              <span>AUTHOR: HAYTHI</span>
            </div>
          </div>

          <div className="w-full h-64 bg-surface-container-high flex items-center justify-center mb-8">
            <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">FEATURED_IMAGE</span>
          </div>

          <div className="prose prose-invert prose-lg max-w-none mb-12 [&_h1]:font-headline [&_h1]:tracking-tighter [&_h1]:text-on-surface [&_h2]:font-headline [&_h2]:tracking-tighter [&_h2]:text-on-surface [&_h2]:uppercase [&_p]:text-on-surface-variant [&_p]:font-body [&_p]:leading-relaxed [&_code]:text-tertiary [&_code]:bg-surface-container-high [&_code]:px-1 [&_pre]:bg-surface-container-lowest [&_pre]:border [&_pre]:border-outline-variant/10">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-outline-variant/10">
            <div className="flex items-center gap-4">
              <span className="font-label text-[10px] text-on-surface-variant/40 uppercase tracking-widest">SHARE_PROTOCOL:</span>
              <button className="p-2 hover:bg-surface-container-high transition-all">
                <Share2 className="w-4 h-4 text-tertiary" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  );
};
