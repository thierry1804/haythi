function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const PROTOCOLS = {
  FR: {
    'web-dev': 'Développement Web',
    architecture: 'Architecture SI',
    management: 'Management de projet',
    consulting: 'Conseil',
    training: 'Formation',
  },
  EN: {
    'web-dev': 'Web Development',
    architecture: 'IS Architecture',
    management: 'Project Management',
    consulting: 'Consulting',
    training: 'Training',
  },
};

const COPY = {
  FR: {
    subject: '[HAYTHI] Accuse de reception',
    preheader: 'Votre message a bien été reçu — réponse sous 24h ouvrables.',
    badge: 'TRANSMISSION_ACK',
    title: 'CONTACT_ROOT',
    hello: (name) => `Bonjour ${name},`,
    body: 'Nous avons bien reçu votre message via haythi.mg. Une connexion sécurisée est établie.',
    topicLabel: 'PROTOCOL_TYPE',
    etaLabel: 'RESPONSE_TIME',
    etaValue: '< 24h ouvrables (lun–ven)',
    cta: 'RETOUR_SITE',
    footer: 'HAYTHI.MG — Expertise IT & Conseil Digital',
    closing: 'À bientôt,',
    team: 'L’équipe HAYTHI',
  },
  EN: {
    subject: '[HAYTHI] Message received',
    preheader: 'Your message was received — reply within 24 business hours.',
    badge: 'TRANSMISSION_ACK',
    title: 'CONTACT_ROOT',
    hello: (name) => `Hello ${name},`,
    body: 'We received your message via haythi.mg. A secure channel is established.',
    topicLabel: 'PROTOCOL_TYPE',
    etaLabel: 'RESPONSE_TIME',
    etaValue: '< 24 business hours (Mon–Fri)',
    cta: 'BACK_TO_SITE',
    footer: 'HAYTHI.MG — IT Expertise & Digital Consulting',
    closing: 'Talk soon,',
    team: 'The HAYTHI team',
  },
};

export function buildAckEmail({ lang = 'FR', name, subjectKey }) {
  const locale = lang === 'EN' ? 'EN' : 'FR';
  const t = COPY[locale];
  const protocol =
    PROTOCOLS[locale][subjectKey] || PROTOCOLS.FR[subjectKey] || subjectKey;
  const safeName = escapeHtml(name);
  const safeProtocol = escapeHtml(protocol);

  const text = [
    t.hello(name),
    '',
    t.body,
    '',
    `${t.topicLabel}: ${protocol}`,
    `${t.etaLabel}: ${t.etaValue}`,
    '',
    t.closing,
    t.team,
    '',
    'https://haythi.mg',
    'contact@haythi.mg',
  ].join('\n');

  const html = `<!DOCTYPE html>
<html lang="${locale === 'FR' ? 'fr' : 'en'}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>${escapeHtml(t.subject)}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,sans-serif!important}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:#0e0e0e;color:#e4e2e1;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(t.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0e0e0e;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#131313;border:1px solid rgba(0,218,243,0.18);">
          <tr>
            <td style="padding:20px 24px;border-bottom:1px solid rgba(0,218,243,0.12);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#e4e2e1;">
                    HAYTHI<span style="color:#00daf3;">.MG</span>
                  </td>
                  <td align="right" style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#00daf3;">
                    ${escapeHtml(t.badge)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 8px 24px;">
              <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#00daf3;margin-bottom:12px;">
                &gt; init ack --secure
              </div>
              <h1 style="margin:0 0 18px 0;font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:28px;line-height:1;font-weight:700;letter-spacing:-0.04em;text-transform:uppercase;color:#e4e2e1;">
                CONTACT_<br /><span style="color:#00daf3;">ROOT</span>
              </h1>
              <p style="margin:0 0 14px 0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#e4e2e1;">
                ${t.hello(safeName)}
              </p>
              <p style="margin:0 0 22px 0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#cac5c4;">
                ${escapeHtml(t.body)}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1b1c1c;border:1px solid rgba(172,137,131,0.25);margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid rgba(172,137,131,0.18);">
                    <div style="font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(228,226,225,0.45);margin-bottom:6px;">${escapeHtml(t.topicLabel)}</div>
                    <div style="font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;color:#00daf3;">${safeProtocol}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;">
                    <div style="font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(228,226,225,0.45);margin-bottom:6px;">${escapeHtml(t.etaLabel)}</div>
                    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;color:#e4e2e1;">${escapeHtml(t.etaValue)}</div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 6px 0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:14px;color:#e4e2e1;">${escapeHtml(t.closing)}</p>
              <p style="margin:0 0 26px 0;font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#00daf3;">${escapeHtml(t.team)}</p>
              <a href="https://haythi.mg" style="display:inline-block;background:#00daf3;color:#003640;font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;padding:14px 22px;">
                ${escapeHtml(t.cta)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 24px 24px 24px;border-top:1px solid rgba(0,218,243,0.12);">
              <p style="margin:0 0 8px 0;font-family:'Space Grotesk',Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(228,226,225,0.45);">
                ${escapeHtml(t.footer)}
              </p>
              <p style="margin:0;font-family:Inter,Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:#cac5c4;">
                <a href="mailto:contact@haythi.mg" style="color:#00daf3;text-decoration:none;">contact@haythi.mg</a>
                &nbsp;·&nbsp;
                <a href="https://haythi.mg" style="color:#00daf3;text-decoration:none;">haythi.mg</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    subject: t.subject,
    text,
    html,
  };
}
