const techs = [
  'REACT',
  'NODE.JS',
  'DOCKER',
  'AWS',
  'POSTGRES',
  'REDIS',
  'NEXT.JS',
  'KUBERNETES',
  'SYMFONY',
  'PHP',
  'PYTHON',
  'TYPESCRIPT',
];

export default function TechMarquee() {
  const row = [...techs, ...techs];

  return (
    <section className="py-12 bg-surface-container-lowest overflow-hidden border-y border-outline-variant/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0">
            {row.map((tech, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className="font-headline text-sm md:text-base font-bold tracking-[0.3em] text-white/20 uppercase px-4">
                  {tech}
                </span>
                <span className="text-tertiary/40 text-xs">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
