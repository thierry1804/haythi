import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';

const inter = Inter({ subsets: ['latin', 'latin-ext'] });

export const metadata: Metadata = {
  title: 'HAYTHI - Expertise IT & Conseil Digital',
  description: 'Consultant IT Freelance spécialisé en développement web, architecture SI et management de projets. 15+ ans d\'expérience.',
  keywords: 'consultant IT, développement web, Symfony, PHP, architecture SI, management de projets, Madagascar',
  authors: [{ name: 'Thierry Randriantiana' }],
  openGraph: {
    title: 'HAYTHI - Expertise IT & Conseil Digital',
    description: 'Consultant IT Freelance | 15+ ans d\'expérience',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

