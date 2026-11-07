const stats = [
  {
    icon: 'rocket_launch',
    index: '01 / 03',
    value: '50+',
    label: 'PROJECTS_DEPLOYED',
    status: 'ACTIVE',
  },
  {
    icon: 'handshake',
    index: '02 / 03',
    value: '98%',
    label: 'CLIENT_RETENTION',
    status: 'STABLE',
  },
  {
    icon: 'verified_user',
    index: '03 / 03',
    value: '15+',
    label: 'YEARS_UPTIME',
    status: 'VERIFIED',
  },
];

export default function Stats() {
  return (
    <section className="relative flex w-full flex-col bg-surface-container-lowest border-y border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="px-8 md:px-12 py-10 md:py-14 border-b md:border-b-0 md:border-r border-outline-variant/10 last:border-0"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="material-symbols-outlined text-tertiary text-2xl">{stat.icon}</span>
              <span className="font-label text-[10px] tracking-widest text-white/20">{stat.index}</span>
            </div>
            <div className="font-headline text-5xl md:text-6xl font-bold tracking-tighter text-on-surface mb-3">
              {stat.value}
            </div>
            <div className="font-label text-[10px] tracking-[0.2em] uppercase text-white/40 mb-4">
              {stat.label}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
              <span className="font-label text-[9px] tracking-widest text-tertiary uppercase">
                {stat.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
