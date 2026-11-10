import HeroNetworkCanvas from './HeroNetworkCanvas';
import { useI18n } from '../i18n';

export default function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden data-grid-overlay"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <HeroNetworkCanvas />

      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src="/hero-knot.webp"
          alt=""
          className="hero-knot absolute inset-y-0 right-0 h-full w-auto max-w-none select-none"
        />
      </div>

      <div className="relative z-10 px-8 md:px-12 lg:px-24 py-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end justify-between gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-8 animate-hero-in">
              <span className="px-3 py-1 bg-tertiary/10 text-tertiary font-headline text-[10px] tracking-[0.2em] border border-tertiary/20">
                {t('protocol01')}
              </span>
              <div className="h-px w-24 bg-tertiary/20" />
            </div>

            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-on-surface mb-8 leading-[0.9] animate-hero-in [animation-delay:120ms]">
              {t('heroTitleLead')}{' '}
              <span className="text-tertiary">{t('heroTitleAccent')}</span>
            </h1>

            <p className="text-on-surface-variant font-body text-lg leading-relaxed max-w-xl mb-8 animate-hero-in [animation-delay:240ms]">
              {t('heroBody')}
            </p>

            <div className="flex flex-wrap gap-4 animate-hero-in [animation-delay:360ms]">
              <a
                href="#services"
                className="group relative bg-tertiary text-on-tertiary font-headline font-bold uppercase py-4 px-8 text-xs tracking-[0.2em] overflow-hidden transition-all hover:scale-105 active:scale-95 glow-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span className="relative z-10">{t('ctaServices')}</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a
                href="#contact"
                className="bg-transparent border border-outline text-tertiary font-headline uppercase py-4 px-8 text-xs tracking-[0.2em] hover:bg-tertiary/5 hover:border-tertiary/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary"
              >
                {t('ctaRdv')}
              </a>
            </div>
          </div>

          <div className="hidden md:block font-mono text-[10px] text-white/75 space-y-1 text-right animate-hero-in [animation-delay:480ms] [text-shadow:0_1px_2px_rgba(0,0,0,0.9)]">
            <div>LATENCY: 14MS</div>
            <div>THROUGHPUT: 1.2GB/S</div>
            <div>ENCRYPTION: AES-256-GCM</div>
            <div className="text-tertiary">SYS_STABILITY: 99.99%</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-outline-variant/10" />
    </section>
  );
}
