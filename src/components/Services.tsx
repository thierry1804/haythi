export default function Services() {
  return (
    <section id="services" className="relative flex w-full flex-col py-24 data-grid-overlay">
      <div className="px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 max-w-2xl mb-16">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-tertiary" />
              <span className="font-label text-tertiary text-[10px] uppercase tracking-[0.3em]">
                PROTOCOL_02: EXPERTISE
              </span>
            </div>
            <h2 className="font-headline tracking-tighter text-3xl md:text-5xl font-bold text-on-surface uppercase">
              Services IT freelance
            </h2>
            <p className="text-on-surface-variant font-body text-sm md:text-base leading-relaxed max-w-xl">
              Offre complète pour entreprises et équipes produit : développement web, conseil SI,
              architecture et pilotage de projets — en remote comme en mission internationale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-low border border-outline-variant/5 p-8 transition-all hover:bg-surface-container">
              <div className="flex justify-between items-start mb-12">
                <span className="font-headline text-4xl font-bold text-tertiary/20">01</span>
                <span className="material-symbols-outlined text-tertiary text-3xl">terminal</span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4 uppercase tracking-tight">
                DÉVELOPPEMENT WEB
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-8 max-w-md leading-relaxed">
                Applications web sur mesure (React, Next.js, Symfony, PHP). 15 ans d&apos;expertise
                backend et frontend pour livrer des produits robustes et maintenables.
              </p>
              <div className="flex flex-wrap gap-2">
                {['REACT.JS', 'NEXT.JS', 'SYMFONY', 'PHP'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface-container-highest font-headline text-[9px] tracking-widest text-tertiary uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 group relative overflow-hidden bg-surface-container-low border border-outline-variant/5 p-8 transition-all hover:bg-surface-container flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <span className="font-headline text-4xl font-bold text-primary/20">02</span>
                <span className="material-symbols-outlined text-primary text-3xl">brush</span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4 uppercase tracking-tight">
                CONSEIL &amp; AUDIT
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-8 max-w-md leading-relaxed">
                Conseil IT et audit SI : qualité ISO 9001, optimisation des systèmes d&apos;information,
                recommandations stratégiques et opérationnelles.
              </p>
              <div className="border-t border-outline-variant/10 pt-6 mt-auto">
                <div className="flex items-center text-[10px] font-headline tracking-widest text-primary">
                  <span className="mr-2">PROTOCOL_AUDIT_READY</span>
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 group relative overflow-hidden bg-surface-container-low border border-outline-variant/5 p-8 transition-all hover:bg-surface-container flex flex-col">
              <div className="flex justify-between items-start mb-12">
                <span className="font-headline text-4xl font-bold text-tertiary/20">03</span>
                <span className="material-symbols-outlined text-tertiary text-3xl">insights</span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4 uppercase tracking-tight">
                ARCHITECTURE SI
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-8 max-w-md leading-relaxed">
                Architecture SI et conception applicative : systèmes robustes, scalables et
                sécurisés, alignés sur vos contraintes métier et cloud.
              </p>
              <div className="space-y-3 mt-auto">
                <div className="w-full bg-surface-container-highest h-0.5">
                  <div className="bg-tertiary h-full w-[92%]" />
                </div>
                <div className="flex justify-between font-mono text-[9px] text-white/30">
                  <span>SYS_EFFICIENCY</span>
                  <span>92%</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 group relative overflow-hidden bg-surface-container-low border border-outline-variant/5 p-8 transition-all hover:bg-surface-container">
              <div className="flex justify-between items-start mb-12">
                <span className="font-headline text-4xl font-bold text-primary/20">04</span>
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
              </div>
              <h3 className="font-headline text-xl md:text-2xl font-bold text-on-surface mb-4 uppercase tracking-tight">
                MANAGEMENT DE PROJETS IT
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-8 max-w-md leading-relaxed">
                Management de projets IT de bout en bout : coordination d&apos;équipes, Agile/Scrum,
                certification PMP — du cadrage à la mise en production.
              </p>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {['AWS / AZURE / GCP', 'DOCKER / K8S', 'SCRUM / AGILE', 'PMP CERTIFIED'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary" />
                      <span className="font-mono text-[10px] text-white/40">{item}</span>
                    </div>
                  )
                )}
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
