const phases = [
  {
    id: 'PHASE_01',
    title: 'Diagnostic',
    desc: 'System scan, gap analysis, and vulnerability detection.',
    mark: 'text-tertiary',
    titleColor: 'text-on-surface',
  },
  {
    id: 'PHASE_02',
    title: 'Strategy',
    desc: 'Roadmap design and architectural blueprint definition.',
    mark: 'text-white/30',
    titleColor: 'text-white/60',
  },
  {
    id: 'PHASE_03',
    title: 'Implementation',
    desc: 'Deployment of hardened protocols and infrastructure.',
    mark: 'text-primary',
    titleColor: 'text-on-surface',
  },
  {
    id: 'PHASE_04',
    title: 'Monitoring',
    desc: '24/7 observability and continuous optimization loops.',
    mark: 'text-tertiary',
    titleColor: 'text-on-surface',
  },
];

export default function Process() {
  return (
    <section id="process" className="relative flex w-full flex-col py-24 overflow-hidden">
      <div className="px-8 md:px-12 lg:px-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter mb-16 uppercase text-on-surface">
            Methodology<span className="text-tertiary">.exe</span>
          </h2>
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="relative bg-surface-container-low p-8 border border-outline-variant/15 hover:border-tertiary/30 transition-colors"
              >
                <div className={`font-label ${phase.mark} text-[10px] tracking-[0.3em] mb-4`}>
                  {phase.id}
                </div>
                <h4 className={`font-headline text-lg font-bold uppercase mb-3 ${phase.titleColor}`}>
                  {phase.title}
                </h4>
                <p className="text-xs text-on-surface-variant/70 font-light uppercase tracking-wider leading-relaxed">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
