'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

// Calendly widget component
const CalendlyWidget = ({ url }: { url: string }) => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={{ minWidth: '320px', height: '630px' }}
    />
  );
};

export const Contact = () => {
  const { t } = useLanguage();
  const [showCalendly, setShowCalendly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    company: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Email invalide'),
    subject: z.string().min(1, 'Veuillez sélectionner un sujet'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
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
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Here you would send the data to your backend
      console.log('Form data:', data);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative flex w-full flex-col py-16 bg-page-bg-alt">
      <div className="px-4 md:px-40 flex flex-1 justify-center">
        <div className="flex flex-col max-w-[1280px] flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 py-6">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <div>
                <h2 className="text-primary text-sm font-bold uppercase tracking-wider mb-2">Get In Touch</h2>
                <h3 className="text-title text-4xl font-bold leading-tight mb-4">Let's Build Something Great Together</h3>
                <p className="text-body text-lg leading-relaxed">
                  Ready to start your next project? Contact us for a free consultation. Our team will get back to you within 24 hours.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-white border border-border-color flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div>
                    <h4 className="text-title font-bold text-lg">Visit Us</h4>
                    <p className="text-body">123 Tech Boulevard, Suite 500<br/>San Francisco, CA 94107</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-white border border-border-color flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <h4 className="text-title font-bold text-lg">Email Us</h4>
                    <p className="text-body">
                      contact@haythi.com<br/>
                      info@haythi.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-lg bg-white border border-border-color flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <h4 className="text-title font-bold text-lg">Call Us</h4>
                    <p className="text-body">
                      +1 (555) 123-4567<br/>Mon-Fri, 9am - 6pm PST
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full h-48 rounded-xl overflow-hidden mt-4 relative bg-slate-200 border border-slate-300">
                <img 
                  alt="Map showing location in San Francisco" 
                  className="w-full h-full object-cover opacity-80" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBSL9Mupw3pFfV6wq3ykshhgAKvwiX9oGlUWSs-8pQdqPZdAAERbvgZSvJJW01Y2bHmVWxHi7tFXzlITfyMjNOEOJTKoYvC0Tfv646s1yCAgSwsVT9eNk_YTlGvpwDHg9cLlLhFU4o9760h13PJhjxfIV2PycCuPw-2NcrFmsRlcbxJg6stIu4w2yZZBtltUJQHbPlTTdLMNR63tHFLEVsAnDze4b0Y2gBnPxcHAnl07cZL5WAM6FUmix5lgJxRB8PqRXCuBg04L83"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                    <span className="material-symbols-outlined text-white text-2xl">location_on</span>
                  </div>
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
              <div className="bg-white border border-border-color p-8 rounded-xl shadow-lg shadow-slate-200/50">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-title text-sm font-medium">First Name</label>
                      <input
                        type="text"
                        {...register('name')}
                        className="h-12 w-full rounded-lg bg-slate-50 border border-slate-200 px-4 text-title placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="John"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-title text-sm font-medium">Last Name</label>
                      <input
                        type="text"
                        {...register('company')}
                        className="h-12 w-full rounded-lg bg-slate-50 border border-slate-200 px-4 text-title placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-title text-sm font-medium">Email Address</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="h-12 w-full rounded-lg bg-slate-50 border border-slate-200 px-4 text-title placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="john@company.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-title text-sm font-medium">Service Interest</label>
                    <div className="relative">
                      <select
                        {...register('subject')}
                        className="h-12 w-full appearance-none rounded-lg bg-slate-50 border border-slate-200 px-4 text-title focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        defaultValue="Custom Software Development"
                      >
                        <option>Custom Software Development</option>
                        <option>Mobile App Development</option>
                        <option>IT Consulting</option>
                        <option>Cloud Infrastructure</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-title text-sm font-medium">Message</label>
                    <textarea
                      rows={4}
                      {...register('message')}
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 p-4 text-title placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                      Message sent successfully!
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      An error occurred. Please try again.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary hover:bg-primary-dark transition-colors px-6 text-white text-base font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

