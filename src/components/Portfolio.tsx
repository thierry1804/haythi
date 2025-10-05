import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

const projects = [
  {
    title: 'Plateforme E-Commerce',
    category: 'Développement Web',
    description: 'Solution complète de commerce en ligne avec gestion des stocks et analytics avancés',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Système ERP',
    category: 'Consultance SI',
    description: 'Implémentation d\'un ERP sur-mesure pour optimiser les processus métier',
    tags: ['Cloud', 'Microservices', 'API'],
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    title: 'Dashboard Analytics',
    category: 'Data & IA',
    description: 'Tableau de bord interactif avec visualisations en temps réel et prédictions IA',
    tags: ['Python', 'TensorFlow', 'D3.js'],
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    title: 'Infrastructure Cloud',
    category: 'DevOps',
    description: 'Migration et optimisation d\'infrastructure vers une architecture cloud-native',
    tags: ['AWS', 'Kubernetes', 'Terraform'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Application Mobile',
    category: 'Développement Mobile',
    description: 'Application cross-platform avec synchronisation temps réel',
    tags: ['React Native', 'Firebase', 'Redux'],
    gradient: 'from-cyan-400 to-teal-500',
  },
  {
    title: 'Sécurité & Audit',
    category: 'Cybersécurité',
    description: 'Audit complet de sécurité et mise en place de mesures de protection',
    tags: ['Pentesting', 'SIEM', 'Conformité'],
    gradient: 'from-blue-600 to-indigo-600',
  },
];

export default function Portfolio() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relativeScroll = scrollY - sectionTop + window.innerHeight;

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(6, 182, 212, 0.15) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translateY(${relativeScroll * -0.1}px)`,
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-600" />
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Réalisations
            </h2>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Quelques projets qui illustrent notre expertise et notre engagement envers l'excellence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const cardOffset = (relativeScroll - index * 200) * 0.08;
            const isVisible = relativeScroll > index * 100;

            return (
              <div
                key={index}
                className="group relative"
                style={{
                  transform: `translateY(${Math.max(-cardOffset, -30)}px) rotateX(${Math.max(-cardOffset * 0.5, -5)}deg)`,
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.5s ease-out',
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${project.gradient} opacity-0 group-hover:opacity-75 blur-xl transition-all duration-500 rounded-2xl`} />

                <div className="relative h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:border-transparent transition-all duration-500">
                  <div className={`h-2 bg-gradient-to-r ${project.gradient}`} />

                  <div className="p-8">
                    <div className="inline-block px-4 py-1 bg-cyan-100 border border-cyan-300 rounded-full text-sm text-cyan-700 mb-4">
                      {project.category}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-cyan-600 transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg border border-slate-300 group-hover:border-cyan-400 transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-cyan-600 group-hover:text-cyan-700 transition-colors duration-300">
                      <span className="text-sm font-semibold mr-2">Voir le projet</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
