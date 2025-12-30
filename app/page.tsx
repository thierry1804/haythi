import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Statistics } from '@/components/Statistics';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { Portfolio } from '@/components/Portfolio';
import { Contact } from '@/components/Contact';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="h-16"></div>
      <Hero />
      <Statistics />
      <Services />
      <Process />
      <Portfolio />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}

