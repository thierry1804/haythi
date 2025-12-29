import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-black mb-4">404</h1>
          <p className="text-xl text-gray-medium mb-8">Page non trouvée</p>
          <Link href="/">
            <Button>Retour à l&apos;accueil</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}

