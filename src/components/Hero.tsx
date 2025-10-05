import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const opacity = Math.max(1 - scrollY / 600, 0);
  const scale = Math.max(1 - scrollY / 2000, 0.8);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div
        className="absolute inset-0 opacity-20"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"
           style={{ transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"
           style={{ transform: `translate(${-scrollY * 0.2}px, ${scrollY * 0.3}px)` }} />

      <div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
        style={{ opacity, transform: `scale(${scale})` }}
      >
        <div className="mb-8 relative">
          <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20" />
          <h1 className="relative text-7xl md:text-9xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            HayThi
          </h1>
        </div>

        <p className="text-xl md:text-3xl text-slate-700 mb-4 max-w-3xl font-semibold">
          Consultance en Systèmes d'Information
        </p>
        <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl">
          & Développement Web Innovant
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(6,182,212,0.3)]">
            <span className="relative z-10">Découvrir nos services</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <button className="px-8 py-4 border-2 border-cyan-600 rounded-lg font-semibold text-cyan-700 hover:bg-cyan-50 transition-all duration-300 hover:shadow-lg">
            Nous contacter
          </button>
        </div>

        <div className="absolute bottom-10 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-600" />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
