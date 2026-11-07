import { FormEvent, useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className="relative flex w-full flex-col py-24 border-t-2 border-primary/20">
      <div className="px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8 text-on-surface">
                  CONTACT_
                  <br />
                  <span className="text-tertiary">ROOT</span>
                </h2>
                <p className="font-body text-on-surface-variant text-sm max-w-sm mb-12 leading-relaxed">
                  Prêt pour une nouvelle implémentation ? Envoyez vos coordonnées pour établir une
                  connexion sécurisée.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:contact@haythi.mg"
                  className="flex items-center gap-4 group"
                >
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">
                    terminal
                  </span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">
                    contact@haythi.mg
                  </span>
                </a>
                <a href="tel:+261322838386" className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">
                    call
                  </span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">
                    +261 32 28 383 86
                  </span>
                </a>
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">
                    location_on
                  </span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">
                    Antananarivo, Madagascar
                  </span>
                </div>
              </div>

              <div className="mt-8 bg-surface-container-low border border-outline-variant/30 p-6 overflow-hidden relative">
                <div className="absolute inset-0 grid-pattern opacity-10" />
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  <span className="ml-4 font-label text-[10px] text-white/20">
                    terminal — contact_protocol.sh
                  </span>
                </div>
                <div className="font-mono text-[11px] text-tertiary/80 space-y-1 relative z-10">
                  <p>&gt; init contact --secure</p>
                  <p className="text-white/40">Establishing encrypted channel...</p>
                  <p className="text-tertiary">CONNECTION ESTABLISHED: TLS 1.3</p>
                  <p className="text-on-surface">RESPONSE_TIME: &lt; 24h</p>
                  <p className="text-on-surface">AVAILABILITY: MON-FRI 09:00-18:00 GMT+3</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 border border-outline-variant/10">
              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  IDENTIFIER
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                  placeholder="NOM_PRENOM"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  ORGANIZATION
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                  placeholder="ENTREPRISE"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  COMMS_CHANNEL
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                  placeholder="EMAIL_ADDR"
                />
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  PROTOCOL_TYPE
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 uppercase text-xs appearance-none"
                >
                  <option value="" disabled className="bg-surface-container">
                    SELECT_PROTOCOL
                  </option>
                  <option value="web-dev" className="bg-surface-container">
                    Développement Web
                  </option>
                  <option value="architecture" className="bg-surface-container">
                    Architecture SI
                  </option>
                  <option value="management" className="bg-surface-container">
                    Management project
                  </option>
                  <option value="consulting" className="bg-surface-container">
                    Conseil
                  </option>
                  <option value="training" className="bg-surface-container">
                    Formation
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">
                  MISSION_DETAILS
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs resize-none"
                  placeholder="DESCRIRE_PROJET"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-tertiary text-on-tertiary font-headline font-bold uppercase tracking-widest text-xs hover:bg-tertiary-fixed active:scale-95 transition-all glow-tertiary"
              >
                TRANSMIT_PACKET
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
