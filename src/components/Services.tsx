import { useEffect, useRef, useState } from 'react';
import { Code2, Database, Globe, Zap, Shield, Cpu } from 'lucide-react';

const services = [
  {
    icon: Database,
    title: 'Consultance SI',
    description: 'Optimisation et transformation de vos systèmes d\'information pour une performance maximale',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Code2,
    title: 'Développement Web',
    description: 'Applications web modernes et performantes avec les dernières technologies',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    icon: Globe,
    title: 'Architecture Cloud',
    description: 'Conception et déploiement d\'infrastructures cloud scalables et sécurisées',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Audit et optimisation des performances de vos applications et systèmes',
    color: 'from-cyan-400 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Cybersécurité',
    description: 'Protection et sécurisation de vos données et infrastructures',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    icon: Cpu,
    title: 'IA & Innovation',
    description: 'Intégration de solutions d\'intelligence artificielle pour automatiser vos processus',
    color: 'from-indigo-500 to-slate-600',
  },
];

export default function Services() {
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
  const parallaxOffset = relativeScroll * 0.3;

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${-parallaxOffset}px)` }}
      >
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Nos Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Des solutions complètes pour accompagner votre transformation digitale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const cardParallax = (relativeScroll - index * 100) * 0.05;

            return (
              <div
                key={index}
                className="group relative"
                style={{
                  transform: `translateY(${Math.max(-cardParallax, -20)}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                     style={{ background: `linear-gradient(to right, ${service.color})` }} />

                <div className="relative h-full p-8 bg-white backdrop-blur-sm border border-slate-200 rounded-xl hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
                  <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${service.color} mb-6 group-hover:rotate-12 transition-transform duration-500`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-cyan-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                    {service.description}
                  </p>

                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
