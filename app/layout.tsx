import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'HAYTHI.MG // Expertise IT & Conseil Digital',
  description: 'Consultant IT Freelance spécialisé en développement web, architecture SI et management de projets. 15+ ans d\'expérience.',
  keywords: 'consultant IT, développement web, Symfony, PHP, architecture SI, management de projets, Madagascar',
  authors: [{ name: 'HAYTHI' }],
  openGraph: {
    title: 'HAYTHI.MG // Expertise IT & Conseil Digital',
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
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} bg-surface text-on-surface font-body overflow-x-hidden antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
