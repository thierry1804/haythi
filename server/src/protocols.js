/** Libellés des types de mission (clé du formulaire -> libellé affiché). */
export const PROTOCOLS = {
  "web-dev": "Développement Web",
  architecture: "Architecture SI",
  management: "Management project",
  consulting: "Conseil",
  training: "Formation",
};

export function protocolLabel(key) {
  return PROTOCOLS[key] ?? key;
}

/**
 * Objet d'une réponse admin : `Re: [HAYTHI] <libellé>`. Si l'objet saisi se
 * réduit à la clé brute du lead (ex. `Re: web-dev`), il est remplacé par la
 * forme normalisée ; tout autre objet saisi est conservé.
 */
export function replySubject(subject, leadSubjectKey) {
  const bare = subject.replace(/^(re:\s*)+/i, "").replace(/^\[HAYTHI\]\s*/i, "").trim();
  if (bare === leadSubjectKey || bare === "") {
    return `Re: [HAYTHI] ${protocolLabel(leadSubjectKey)}`;
  }
  return subject;
}
