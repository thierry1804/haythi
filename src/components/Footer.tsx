import { Zap, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Consultance SI', href: '#' },
      { label: 'Développement Web', href: '#' },
      { label: 'Architecture Cloud', href: '#' },
      { label: 'Cybersécurité', href: '#' },
    ],
    company: [
      { label: 'À Propos', href: '#about' },
      { label: 'Réalisations', href: '#portfolio' },
      { label: 'Contact', href: '#contact' },
      { label: 'Carrières', href: '#' },
    ],
    legal: [
      { label: 'Mentions Légales', href: '#' },
      { label: 'Politique de Confidentialité', href: '#' },
      { label: 'CGV', href: '#' },
      { label: 'RGPD', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' },
  ];

  return (
    <footer className="relative bg-slate-50 border-t border-slate-200 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg opacity-30" />
                <Zap className="relative w-8 h-8 text-cyan-600" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                HayThi
              </span>
            </div>
            <p className="text-slate-600 mb-6 max-w-sm">
              Votre partenaire de confiance pour la transformation digitale et l'innovation technologique.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="p-3 bg-white border border-slate-300 rounded-lg text-slate-600 hover:text-cyan-600 hover:border-cyan-400 hover:bg-slate-50 transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-slate-800 font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-cyan-600 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-cyan-600 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-800 font-semibold mb-4 text-lg">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-cyan-600 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-cyan-600 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-slate-800 font-semibold mb-4 text-lg">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-cyan-600 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-cyan-600 group-hover:w-4 transition-all duration-300" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} HayThi. Tous droits réservés.
            </p>
            <p className="text-slate-500 text-sm">
              Conçu avec passion pour l'innovation
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
    </footer>
  );
}
