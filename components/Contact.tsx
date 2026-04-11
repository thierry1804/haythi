'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caract\u00e8res'),
    company: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Email invalide'),
    subject: z.string().min(1, 'Veuillez s\u00e9lectionner un sujet'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caract\u00e8res'),
  });

  type ContactFormData = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form data:', data);
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative flex w-full flex-col py-24 border-t-2 border-primary/20">
      <div className="px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="font-headline text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8 text-on-surface">
                  CONTACT_<br /><span className="text-tertiary">ROOT</span>
                </h2>
                <p className="font-body text-on-surface-variant text-sm max-w-sm mb-12 leading-relaxed">
                  Pr&ecirc;t pour une nouvelle impl&eacute;mentation ? Envoyez vos coordonn&eacute;es pour &eacute;tablir une connexion s&eacute;curis&eacute;e.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">terminal</span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">{t.contact.email}</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">call</span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">{t.contact.phone}</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <span className="material-symbols-outlined text-primary group-hover:scale-125 transition-transform">location_on</span>
                  <span className="font-label text-xs tracking-widest uppercase text-on-surface">{t.contact.address}</span>
                </div>
              </div>

              {/* Terminal-style visualization */}
              <div className="mt-8 bg-surface-container-low border border-outline-variant/30 p-6 overflow-hidden relative">
                <div className="absolute inset-0 grid-pattern opacity-10"></div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                  <span className="ml-4 font-label text-[10px] text-white/20">terminal &mdash; contact_protocol.sh</span>
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
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 glass-panel p-8 border border-outline-variant/10">
                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">IDENTIFIER</label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                    placeholder="NOM_PRENOM"
                  />
                  {errors.name && (
                    <p className="text-xs text-error">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">ORGANIZATION</label>
                  <input
                    type="text"
                    {...register('company')}
                    className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                    placeholder="ENTREPRISE"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">COMMS_CHANNEL</label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs"
                    placeholder="EMAIL_ADDR"
                  />
                  {errors.email && (
                    <p className="text-xs text-error">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">PROTOCOL_TYPE</label>
                  <select
                    {...register('subject')}
                    className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 uppercase text-xs appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled className="bg-surface-container">SELECT_PROTOCOL</option>
                    <option value="web-dev" className="bg-surface-container">{t.contact.form.subjects.webDev}</option>
                    <option value="architecture" className="bg-surface-container">{t.contact.form.subjects.architecture}</option>
                    <option value="management" className="bg-surface-container">{t.contact.form.subjects.projectManagement}</option>
                    <option value="consulting" className="bg-surface-container">{t.contact.form.subjects.consulting}</option>
                    <option value="training" className="bg-surface-container">{t.contact.form.subjects.training}</option>
                  </select>
                  {errors.subject && (
                    <p className="text-xs text-error">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">MISSION_DETAILS</label>
                  <textarea
                    rows={4}
                    {...register('message')}
                    className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface font-body focus:ring-0 focus:border-tertiary focus:bg-tertiary/[0.02] transition-all py-2 placeholder:opacity-20 uppercase text-xs resize-none"
                    placeholder="DESCRIRE_PROJET"
                  />
                  {errors.message && (
                    <p className="text-xs text-error">{errors.message.message}</p>
                  )}
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 bg-tertiary/10 border border-tertiary/20 text-tertiary text-xs font-label uppercase tracking-widest">
                    TRANSMISSION_COMPLETE // MESSAGE_RECEIVED
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 bg-error-container/20 border border-error/20 text-error text-xs font-label uppercase tracking-widest">
                    ERROR_PROTOCOL // RETRY_TRANSMISSION
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-tertiary text-on-tertiary font-headline font-bold uppercase tracking-widest text-xs hover:bg-tertiary-fixed active:scale-95 transition-all disabled:opacity-50 glow-tertiary"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      TRANSMITTING...
                    </span>
                  ) : (
                    'TRANSMIT_PACKET'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
