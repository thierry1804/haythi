import type { Lang } from './i18n';

let sent = false;

/** Origine du referrer externe (sans chemin ni query), ou undefined. */
function externalReferrerOrigin(): string | undefined {
  if (!document.referrer) return undefined;
  try {
    const url = new URL(document.referrer);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    if (url.host === window.location.host) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

/**
 * Mesure d'audience first-party agrégée : une seule requête par chargement de page,
 * sans cookie ni identifiant. Fire-and-forget : les erreurs sont ignorées.
 */
export function sendPageView(lang: Lang): void {
  if (sent) return;
  sent = true;

  const body: { path: string; referrer?: string; lang: Lang } = {
    path: '/',
    lang,
  };
  const referrer = externalReferrerOrigin();
  if (referrer) body.referrer = referrer;

  try {
    void fetch('/api/t', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  } catch {
    // ignoré volontairement
  }
}
