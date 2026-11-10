import { FormEvent, useRef, useState } from 'react';
import { useI18n } from '../i18n';

type TransmitStatus = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const { t, lang } = useI18n();
  const startedAtRef = useRef(Date.now());
  const [status, setStatus] = useState<TransmitStatus>('idle');
  const [errorKey, setErrorKey] = useState<
    | 'transmitErr'
    | 'transmitErrFields'
    | 'transmitErrSubject'
    | 'transmitErrMessage'
    | 'transmitErrNetwork'
    | 'transmitErrRate'
    | 'transmitErrUpstream'
  >('transmitErr');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    subject: '',
    message: '',
    website: '',
  });

  const fail = (
    key:
      | 'transmitErr'
      | 'transmitErrFields'
      | 'transmitErrSubject'
      | 'transmitErrMessage'
      | 'transmitErrNetwork'
      | 'transmitErrRate'
      | 'transmitErrUpstream',
  ) => {
    setErrorKey(key);
    setStatus('error');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    if (!formData.subject) {
      fail('transmitErrSubject');
      return;
    }
    if (formData.message.trim().length < 10) {
      fail('transmitErrMessage');
      return;
    }
    if (!formData.name.trim() || !emailOk) {
      fail('transmitErrFields');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: formData.name.trim(),
          company: formData.company.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
          website: formData.website,
          startedAt: startedAtRef.current,
          lang,
        }),
      });

      const payload = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !payload?.ok) {
        const code = payload?.error || '';
        if (res.status === 429 || code === 'RATE_LIMIT' || code.endsWith('_LIMIT')) {
          fail('transmitErrRate');
          return;
        }
        if (
          res.status === 502 ||
          code === 'UPSTREAM_THROW' ||
          code === 'UPSTREAM_REJECTED' ||
          code === 'SERVER_CONFIG'
        ) {
          fail('transmitErrUpstream');
          return;
        }
        if (code === 'INVALID_PAYLOAD') {
          fail('transmitErrFields');
          return;
        }
        fail('transmitErr');
        return;
      }

      setStatus('success');
      startedAtRef.current = Date.now();
      setFormData({ name: '', company: '', email: '', subject: '', message: '', website: '' });
    } catch {
      fail('transmitErrNetwork');
    }
  };

  const fieldClass =
    'w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:outline-none focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs focus-visible:ring-0';

  return (
    <section id="contact" className="relative flex w-full flex-col py-24 border-t-2 border-primary/20 overflow-hidden">
      <img
        src="/hero-knot.webp"
        alt=""
        className="section-knot pointer-events-none absolute -left-[22%] bottom-[-18%] w-[min(480px,90vw)] opacity-[0.16] select-none"
        aria-hidden="true"
      />
      <div className="px-8 md:px-12 lg:px-24 relative z-10">
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
                  {t('contactIntro')}
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:contact@haythi.mg"
                  className="flex items-center gap-4 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary"
                >
                  <span
                    className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform"
                    aria-hidden="true"
                  >
                    terminal
                  </span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">
                    contact@haythi.mg
                  </span>
                </a>
                <a
                  href="tel:+261322838386"
                  className="flex items-center gap-4 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tertiary"
                >
                  <span
                    className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform"
                    aria-hidden="true"
                  >
                    call
                  </span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">
                    +261 32 28 383 86
                  </span>
                </a>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary" aria-hidden="true">
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
                  <p className="animate-pulse" aria-hidden="true">
                    _
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative space-y-6 glass-panel p-8 border border-outline-variant/10"
            >
              <div
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              >
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60"
                >
                  IDENTIFIER
                </label>
                <input
                  id="identifier"
                  type="text"
                  name="name"
                  required
                  maxLength={120}
                  value={formData.name}
                  onChange={(e) => {
                    setStatus('idle');
                    setFormData({ ...formData, name: e.target.value });
                  }}
                  className={fieldClass}
                  placeholder="NOM_PRENOM"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="organization"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60"
                >
                  ORGANIZATION
                </label>
                <input
                  id="organization"
                  type="text"
                  name="company"
                  maxLength={160}
                  value={formData.company}
                  onChange={(e) => {
                    setStatus('idle');
                    setFormData({ ...formData, company: e.target.value });
                  }}
                  className={fieldClass}
                  placeholder="ENTREPRISE"
                  autoComplete="organization"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="comms"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60"
                >
                  COMMS_CHANNEL
                </label>
                <input
                  id="comms"
                  type="email"
                  name="email"
                  required
                  maxLength={160}
                  value={formData.email}
                  onChange={(e) => {
                    setStatus('idle');
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className={fieldClass}
                  placeholder="EMAIL_ADDR"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="protocol"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60"
                >
                  PROTOCOL_TYPE
                </label>
                <select
                  id="protocol"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => {
                    setStatus('idle');
                    setFormData({ ...formData, subject: e.target.value });
                  }}
                  className={`${fieldClass} appearance-none`}
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
                <label
                  htmlFor="mission"
                  className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60"
                >
                  MISSION_DETAILS
                </label>
                <textarea
                  id="mission"
                  name="message"
                  required
                  rows={4}
                  minLength={10}
                  maxLength={4000}
                  value={formData.message}
                  onChange={(e) => {
                    setStatus('idle');
                    setFormData({ ...formData, message: e.target.value });
                  }}
                  className={`${fieldClass} resize-none`}
                  placeholder="DESCRIRE_PROJET"
                />
              </div>

              {status === 'success' && (
                <div
                  role="status"
                  className="p-4 bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-label uppercase tracking-widest"
                >
                  {t('transmitOk')}
                </div>
              )}
              {status === 'error' && (
                <div
                  role="alert"
                  className="p-4 bg-primary-container/20 border border-primary/30 text-primary text-xs font-label uppercase tracking-widest"
                >
                  {t(errorKey)}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-tertiary text-on-tertiary font-headline font-bold uppercase tracking-widest text-xs hover:bg-tertiary-fixed active:scale-95 transition-all disabled:opacity-50 glow-tertiary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {status === 'sending' ? t('transmitting') : t('transmit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
