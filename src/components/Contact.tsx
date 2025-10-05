import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionTop, setSectionTop] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    if (sectionRef.current) {
      setSectionTop(sectionRef.current.offsetTop);
    }

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const relativeScroll = scrollY - sectionTop + window.innerHeight;
  const parallaxOffset = relativeScroll * 0.15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-br from-slate-50 via-white to-cyan-50 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-300/40 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/40 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${-parallaxOffset * 0.5}px)` }}
      >
        <div className="h-full w-full bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Contactez-nous
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Prêt à transformer vos idées en réalité ? Parlons de votre projet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div
            className="space-y-8"
            style={{
              transform: `translateX(${Math.min(relativeScroll * 0.1 - 50, 0)}px)`,
              opacity: Math.min(relativeScroll / 300, 1),
            }}
          >
            <div className="space-y-6">
              <div className="group flex items-start gap-4 p-6 bg-white backdrop-blur-sm border border-slate-200 rounded-xl hover:border-cyan-400 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Email</h3>
                  <a href="mailto:contact@haythi.com" className="text-slate-600 hover:text-cyan-600 transition-colors">
                    contact@haythi.com
                  </a>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-6 bg-white backdrop-blur-sm border border-slate-200 rounded-xl hover:border-cyan-400 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Téléphone</h3>
                  <a href="tel:+33123456789" className="text-slate-600 hover:text-cyan-600 transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>

              <div className="group flex items-start gap-4 p-6 bg-white backdrop-blur-sm border border-slate-200 rounded-xl hover:border-cyan-400 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">Adresse</h3>
                  <p className="text-slate-600">
                    123 Avenue de l'Innovation<br />
                    75001 Paris, France
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Pourquoi choisir HayThi ?
              </h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full" />
                  Expertise technique reconnue
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  Solutions sur-mesure adaptées
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                  Accompagnement personnalisé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-600 rounded-full" />
                  Délais respectés, qualité garantie
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              transform: `translateX(${Math.max(-relativeScroll * 0.1 + 50, 0)}px)`,
              opacity: Math.min(relativeScroll / 300, 1),
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  required
                  className="w-full px-6 py-4 bg-white backdrop-blur-sm border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Votre email"
                  required
                  className="w-full px-6 py-4 bg-white backdrop-blur-sm border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet"
                  required
                  className="w-full px-6 py-4 bg-white backdrop-blur-sm border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>

              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message"
                  required
                  rows={6}
                  className="w-full px-6 py-4 bg-white backdrop-blur-sm border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="group relative w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Envoyer le message
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
