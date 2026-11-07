export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-surface"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0, 218, 243, 0.07), transparent 70%), radial-gradient(ellipse 40% 35% at 80% 20%, rgba(255, 180, 167, 0.05), transparent 60%)',
        }}
      />

      <div className="relative z-10 px-8 md:px-12 lg:px-24 pt-28 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center border border-tertiary/60 px-3 py-1.5 mb-8">
            <span className="font-label text-tertiary text-[10px] uppercase tracking-[0.25em]">
              PROTOCOL_01: SERVICES
            </span>
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter leading-[0.95] mb-8 max-w-5xl">
            <span className="text-on-surface">EXPERTISE IT &amp;</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
              CONSULTING
            </span>
          </h1>

          <p className="font-body text-on-surface-variant text-sm md:text-base max-w-2xl leading-relaxed mb-10">
            Consultant IT Freelance | 15+ ans d&apos;expérience. Solutions d&apos;ingénierie logicielle
            de haute précision. Nous transformons des concepts complexes en infrastructures numériques
            résilientes et performantes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="#services"
              className="inline-flex items-center justify-center px-6 py-3.5 bg-tertiary text-on-tertiary font-headline text-xs font-bold uppercase tracking-widest hover:bg-tertiary-fixed transition-colors"
            >
              DÉCOUVRIR MES SERVICES
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-primary text-tertiary font-headline text-xs font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors"
            >
              PRENDRE RDV
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 md:right-12 hidden sm:block font-mono text-[10px] text-white/30 space-y-1 text-right">
        <p>LATENCY: 14MS</p>
        <p>THROUGHPUT: 1.2GB/S</p>
        <p>ENCRYPTION: AES-256-GCM</p>
        <p>
          SYS_STABILITY: <span className="text-tertiary">99.99%</span>
        </p>
      </div>
    </section>
  );
}
