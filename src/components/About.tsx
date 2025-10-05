import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Users, Award, Target } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '150+', label: 'Projets réalisés' },
  { icon: Users, value: '50+', label: 'Clients satisfaits' },
  { icon: Award, value: '10+', label: 'Années d\'expérience' },
  { icon: Target, value: '98%', label: 'Taux de satisfaction' },
];

export default function About() {
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
  const parallaxOffset = relativeScroll * 0.2;

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      >
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-300/40 to-blue-300/40 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-20"
        style={{ transform: `translateY(${parallaxOffset * 0.8}px)` }}
      >
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-300/40 to-indigo-300/40 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${-parallaxOffset * 0.3}px)` }}
      >
        <div className="h-full w-full bg-[linear-gradient(to_right,#cbd5e1_2px,transparent_2px),linear-gradient(to_bottom,#cbd5e1_2px,transparent_2px)] bg-[size:6rem_6rem]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            className="space-y-8"
            style={{
              transform: `translateX(${Math.min(relativeScroll * 0.1 - 50, 0)}px)`,
              opacity: Math.min(relativeScroll / 300, 1),
            }}
          >
            <div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                À Propos
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-500 to-blue-500 mb-8" />
            </div>

            <p className="text-xl text-slate-700 leading-relaxed">
              <span className="text-cyan-600 font-semibold">HayThi</span> est une entreprise innovante spécialisée dans la consultance en systèmes d'information et le développement web de pointe.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Nous accompagnons les entreprises dans leur transformation digitale en proposant des solutions sur-mesure, performantes et évolutives. Notre expertise technique combinée à une approche stratégique nous permet de créer de la valeur durable pour nos clients.
            </p>

            <p className="text-lg text-slate-600 leading-relaxed">
              Notre équipe d'experts passionnés utilise les technologies les plus récentes pour concevoir des systèmes robustes, sécurisés et adaptés aux enjeux de demain.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="px-6 py-3 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-300 rounded-lg">
                <span className="text-cyan-700 font-semibold">Innovation</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg">
                <span className="text-blue-700 font-semibold">Excellence</span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-slate-100 border border-indigo-300 rounded-lg">
                <span className="text-indigo-700 font-semibold">Performance</span>
              </div>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-6"
            style={{
              transform: `translateX(${Math.max(-relativeScroll * 0.1 + 50, 0)}px)`,
              opacity: Math.min(relativeScroll / 300, 1),
            }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 bg-white backdrop-blur-sm border border-slate-200 rounded-xl hover:border-cyan-400 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  style={{
                    transform: `translateY(${Math.sin((relativeScroll + index * 100) * 0.01) * 10}px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />

                  <div className="relative">
                    <Icon className="w-12 h-12 text-cyan-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
