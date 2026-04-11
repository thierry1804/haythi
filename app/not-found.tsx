import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <div className="pt-32 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-label text-[10px] tracking-[0.3em] uppercase text-tertiary mb-4">ERROR_PROTOCOL</p>
          <h1 className="text-7xl font-bold text-on-surface font-headline tracking-tighter mb-4">404</h1>
          <p className="text-on-surface-variant font-body mb-8">NODE_NOT_FOUND // La page demand&eacute;e n&apos;existe pas</p>
          <Link href="/">
            <Button>RETURN_TO_ROOT</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
