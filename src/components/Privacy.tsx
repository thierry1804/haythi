import { useI18n } from '../i18n';

export default function Privacy() {
  const { t } = useI18n();

  return (
    <section
      id="privacy"
      className="relative flex w-full flex-col py-20 border-t border-outline-variant/20 bg-surface-container-lowest"
    >
      <div className="px-8 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-tertiary" />
            <span className="font-label text-tertiary text-[10px] uppercase tracking-[0.3em]">
              PROTOCOL_LEGAL
            </span>
          </div>
          <h2 className="font-headline text-2xl md:text-3xl font-bold uppercase tracking-tighter text-on-surface">
            {t('privacyTitle')}
          </h2>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed max-w-prose">
            {t('privacyBody')}
          </p>
          <a
            href="mailto:contact@haythi.mg?subject=PRIVACY_REQUEST"
            className="inline-flex font-label text-[10px] tracking-widest uppercase text-tertiary underline decoration-primary decoration-2 underline-offset-4 hover:text-primary transition-colors"
          >
            contact@haythi.mg
          </a>
        </div>
      </div>
    </section>
  );
}
