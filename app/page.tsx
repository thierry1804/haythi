import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Skills } from '@/components/Skills';
import { Certifications } from '@/components/Certifications';
import { Portfolio } from '@/components/Portfolio';
import { BlogPreview } from '@/components/BlogPreview';
import { Contact } from '@/components/Contact';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Skills />
      <Certifications />
      <Portfolio />
      <BlogPreview />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}

