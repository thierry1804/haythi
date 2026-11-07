import { useI18n } from '../i18n';

const projects = [
  {
    title: 'Electracker',
    titleColor: 'text-primary',
    timestamp: '2023.08',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDO3bi5wXVCMLBGI400_wFCCE0ZxxEXIAxRw99AOKlOGr825_kQPyOO1KKpndfq5h0Okyp_pwiT1SHpH8-n85RP1L8xNTqQ-w1fkMb1ildpte3IQ9HaFUqYh-fuotmBXhfNvxReOvpdGkitiaYxMtMjK6DOLsdDJ1cwM779JeVg_8pNpLvCgwrtsrCtZ90ZiAVKfGUIcPlfFH1YfNPTW1_heFai5LX1ISLgkDL6XgmaebDcJ3eao1yOfykk0KCHGGMPTUDI_lcMrWg',
    badges: [
      { label: 'IoT_INTEGRATION', className: 'bg-surface-container-highest text-on-surface' },
      { label: 'REAL_TIME', className: 'bg-tertiary/20 text-tertiary' },
    ],
    description:
      'Système complexe de surveillance énergétique. Analyse prédictive des flux électriques et monitoring temps réel pour infrastructures industrielles.',
    tags: ['Energy Analytics', 'InfluxDB', 'React_Core'],
    status: { label: 'ACTIVE_NODE', color: 'text-tertiary', dot: 'bg-tertiary' },
    mailtoSubject: 'NODE // Electracker',
    linkDecoration: 'decoration-primary',
  },
  {
    title: 'Piggyback',
    titleColor: 'text-tertiary',
    timestamp: '2024.01',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdR22M6AcqEKBMSMyogsikYDiC3BhNky70Yo5yehUiAgAdUfz6idJcA7V2NIWgQdPsVUM0hj2UWeyRr19F5Ln32NeV7sQ_rdnJnifKjK90WoiMDIyIjJJcqZfVKmJC1z3FDz_eBqerP_d4ARJdMMeq_XT9xRjpItTxziJRC5wpYjmpe4ZHhVHK87_alBiql9iXCSoGs7IsO3EDkVidFVfaRxnnpEM7UPKo8F9JvXmmNt0hBKkqSaNbunQcuA2GmJaTcKOU4EghXg4',
    badges: [
      { label: 'CLOUD_INFRA', className: 'bg-surface-container-highest text-on-surface' },
      { label: 'ENCRYPTED', className: 'bg-primary/20 text-primary' },
    ],
    description:
      'Protocole de sauvegarde redondant et infrastructure cloud hybride. Garantit l’intégrité des données via une architecture multi-tenant sécurisée.',
    tags: ['Data Security', 'AWS_Edge', 'Rust_Backend'],
    status: { label: 'SECURE_UPLINK', color: 'text-primary', dot: 'bg-primary' },
    mailtoSubject: 'NODE // Piggyback',
    linkDecoration: 'decoration-tertiary',
  },
];

export default function Portfolio() {
  const { t } = useI18n();

  return (
    <section id="work" className="relative flex w-full flex-col data-grid-overlay">
      <div className="px-8 md:px-12 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-on-surface flex items-center gap-4">
              NODES_DÉPLOYÉS
              <span className="h-px w-48 bg-outline-variant/30 hidden sm:block" />
            </h2>
            <span className="font-label text-[10px] uppercase text-tertiary hidden md:block">
              FILTER: ALL_CATEGORIES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project) => (
              <article
                key={project.title}
                className="group relative flex flex-col bg-surface-container-lowest border border-outline-variant/10 hover:border-tertiary/40 transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    alt={project.title}
                    src={project.image}
                    className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.badges.map((badge) => (
                      <span
                        key={badge.label}
                        className={`px-2 py-1 text-[8px] font-label tracking-widest uppercase ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h3
                      className={`font-headline text-3xl md:text-4xl font-bold uppercase tracking-tighter ${project.titleColor}`}
                    >
                      {project.title}
                    </h3>
                    <span className="font-label text-[10px] text-on-surface-variant/40 shrink-0">
                      TIMESTAMP // {project.timestamp}
                    </span>
                  </div>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8">
                    {project.description}
                  </p>
                  <div className="mt-auto space-y-4">
                    <div className="flex flex-wrap gap-3">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-surface-container border border-outline-variant/20 text-[10px] font-label uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
                      <span
                        className={`text-[10px] font-label uppercase flex items-center gap-2 ${project.status.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${project.status.dot}`} />
                        {project.status.label}
                      </span>
                      <a
                        href={`mailto:contact@haythi.mg?subject=${encodeURIComponent(project.mailtoSubject)}`}
                        className={`font-label text-[10px] text-on-surface uppercase underline ${project.linkDecoration} decoration-2 underline-offset-4 hover:text-tertiary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary`}
                      >
                        {t('projectCta')}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-20 p-12 bg-surface-container relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 font-mono text-[10px] text-tertiary leading-relaxed break-all p-4 pointer-events-none select-none">
              01011001 01001111 01010101 00100000 01000001 01010010 01000101 00100000 01001000
              01000101 01010010 01000101
            </div>
            <div className="relative z-10 max-w-3xl">
              <h4 className="font-headline text-sm tracking-widest uppercase text-tertiary mb-6">
                IT_CONSULTING
              </h4>
              <p className="font-body text-lg md:text-xl text-on-surface leading-relaxed">
                “L&apos;ingénierie logicielle ne consiste pas seulement à écrire du code, mais à
                concevoir des systèmes résilients qui survivent aux environnements de production les
                plus hostiles.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
