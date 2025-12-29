import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { blogPosts } from '@/data/blog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Header />
      <BlogPostContent post={post} />
      <Footer />
    </main>
  );
}

  // Placeholder content - in real app, this would come from a CMS or markdown file
  const content = `
# ${post.title}

${post.excerpt}

## Introduction

Ceci est un exemple de contenu d'article. Dans une application réelle, le contenu serait chargé depuis un CMS ou des fichiers markdown.

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
    <main className="min-h-screen">
      <Header />
      
      <article className="pt-32 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/blog">
              <Button variant="outline" size="sm" className="mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au blog
              </Button>
            </Link>

            <div className="mb-6">
              <Badge variant="primary">{post.category}</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-gray-medium mb-8 pb-8 border-b border-gray-light">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(post.date, language === 'fr' ? 'fr-FR' : 'en-US')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>{post.readTime} {t.blog.readTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>Par Thierry Randriantiana</span>
              </div>
            </div>

            <div className="w-full h-96 bg-gray-light rounded-lg mb-8 flex items-center justify-center">
              <span className="text-gray-medium">Image featured</span>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-light">
              <div className="flex items-center space-x-4">
                <span className="text-gray-medium">Partager :</span>
                <button className="p-2 rounded-lg hover:bg-gray-light transition-colors duration-300">
                  <Share2 className="w-5 h-5 text-gray-medium" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

