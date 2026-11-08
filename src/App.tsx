import { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Services from './components/Services';
import TechMarquee from './components/TechMarquee';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Footer from './components/Footer';
import { I18nProvider, useI18n } from './i18n';
import { sendPageView } from './analytics';

function PageViewBeacon() {
  const { lang } = useI18n();
  useEffect(() => {
    sendPageView(lang);
    // une seule fois au montage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

function App() {
  return (
    <I18nProvider>
      <PageViewBeacon />
      <div className="min-h-screen bg-surface text-on-surface">
        <Header />
        <main>
          <Hero />
          <Stats />
          <Services />
          <TechMarquee />
          <Process />
          <Portfolio />
          <Contact />
          <Privacy />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  );
}

export default App;
