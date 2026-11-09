# Back-office HAYTHI — reste à faire

État au **2026-11-08**. Spec : [`docs/superpowers/specs/2026-11-08-backoffice-design.md`](superpowers/specs/2026-11-08-backoffice-design.md).  
Déploiement détaillé : [`docs/backoffice-deploy.md`](backoffice-deploy.md).

## Déjà fait (code)

| Élément | Statut |
|---------|--------|
| API : SQLite, leads, auth Argon2+TOTP, reply Resend, RGPD (export / anonymiser / supprimer) | Fait (branche `feat/backoffice`) |
| Beacon `POST /api/t` + stats admin | Fait |
| UI admin React + Docker (`nginx-unprivileged`, `:8090→8080`) | Fait |
| Privacy FR/EN + beacon front | Fait |
| SEO landing (meta, OG, JSON-LD, sitemap, robots) | Fait (souvent encore **non commit** dans le working tree) |
| Script `scripts/deploy-vps.sh` (upload API + admin Docker + `dist/`) | Fait |
| Tests locaux API | 44/44 |
| Essai local BO | OK (`http://127.0.0.1:5174`, compte `admin@localhost`) |

Ce qui **n’a pas** été fait depuis cet environnement : poussée SSH réelle vers `148.113.46.75` (mot de passe interactif requis).

---

## À faire maintenant — déploiement VPS

Ordre recommandé. Cocher au fur et à mesure.

### A. Envoyer le code

Sur le poste de dev (terminal interactif) :

```bash
cd /media/thr/FCCA9572CA9529C2/projets/haythi
bash scripts/deploy-vps.sh
```

Le script : build front + admin → sync `/opt/haythi-api` → complète `.env` (`SESSION_SECRET`, `ADMIN_ORIGIN`, `DATABASE_PATH`) si absents → Docker `/opt/haythi-admin` → `dist/` dans `/var/www/html`.

Vérifier sur le VPS :

```bash
curl -fsS http://127.0.0.1:8787/healthz
curl -sI http://127.0.0.1:8090/ | head -5
sudo journalctl -u haythi-contact -n 30 --no-pager   # pas de « admin API disabled »
```

### B. Apache — vhost `admin.haythi.mg`

- [ ] Certificat SSL pour `admin.haythi.mg` (certbot ou origine Cloudflare).
- [ ] Installer le snippet :

```bash
sudo a2enmod proxy proxy_http headers ssl rewrite
sudo cp /opt/haythi-api/deploy/apache-admin.conf.snippet /etc/apache2/sites-available/admin.haythi.mg.conf
# Adapter SSLCertificateFile / KeyFile dans le fichier
sudo a2ensite admin.haythi.mg
sudo apache2ctl configtest && sudo systemctl reload apache2
```

### C. Apache — activer `POST /api/t` (site public)

**Uniquement après** que le front avec le texte privacy soit bien en ligne sur `haythi.mg`.

- [ ] Coller `/opt/haythi-api/deploy/apache-api-t.conf.snippet` dans le vhost HTTPS de `haythi.mg` (à côté de `/api/contact`).
- [ ] `sudo apache2ctl configtest && sudo systemctl reload apache2`
- [ ] Test : `curl -s -o /dev/null -w '%{http_code}\n' -X POST https://haythi.mg/api/t -H 'Content-Type: application/json' -H 'Origin: https://haythi.mg' -d '{"path":"/","lang":"FR"}'` → `204`

### D. DNS + Cloudflare Access

- [ ] DNS `admin` → IP du VPS (proxifié orange), SSL Full (strict).
- [ ] Zero Trust → Access → application self-hosted `admin.haythi.mg`.
- [ ] Politique Allow : **un seul email** (opérateur), pas « Everyone ».
- [ ] Pare-feu hôte : 443 limité aux plages Cloudflare (**obligatoire** — détail dans `backoffice-deploy.md`, section 6). Ne pas ouvrir l’admin à `0.0.0.0/0` sur l’IP nue.

### E. Compte admin production

- [ ] Créer le compte (email = allowlist Access), scanner le TOTP **immédiatement** :

```bash
cd /opt/haythi-api
sudo -u www-data node scripts/create-admin.js operateur@example.com 'MOT_DE_PASSE_LONG'
```

- [ ] Rotation mdp / TOTP (v1) : relancer la même commande (`create-admin.js`). La page Compte de l’UI ne fait que la déconnexion.

### F. Vérifications métier

- [ ] Sans session Access : `https://admin.haythi.mg` → redirection Cloudflare Access.
- [ ] Login BO (Access + mdp + TOTP) OK.
- [ ] Formulaire contact → lead visible dans le BO.
- [ ] Réponse devis → mail prospect + copie `contact@haythi.mg`.
- [ ] Export / anonymiser / supprimer OK.
- [ ] Quelques visites sur `haythi.mg` → stats dans le dashboard.
- [ ] Privacy page mentionne la mesure d’audience first-party.

---

## Git / intégration (hors VPS)

| Action | Statut |
|--------|--------|
| Branche `feat/backoffice` avec les commits back-office | Existe |
| Merge dans `master` / PR | **À décider** (pas encore fait) |
| Commit des changements SEO / front encore dirty dans le working tree | **À faire** si pas déjà inclus |
| Ne pas committer `server/.env` local | Respecter `.gitignore` |

---

## Suites optionnelles (non bloquantes v1)

- Filtre leads par sujet dans l’UI.
- Rappel / filtre « leads `closed` à purger » sur le dashboard (bannière déjà sur la fiche).
- Page Compte : changer mdp / re-enroll TOTP dans l’UI (aujourd’hui CLI seulement).
- Job de purge auto des leads `closed` (volontairement manuel pour l’instant).
- Smoke navigateur E2E automatisé.
- Backup chiffré automatique de `/opt/haythi-api/data/`.

---

## Références rapides

| Besoin | Fichier |
|--------|---------|
| Procédure complète deploy | `docs/backoffice-deploy.md` |
| Spec produit / sécurité | `docs/superpowers/specs/2026-11-08-backoffice-design.md` |
| Plan d’implémentation | `docs/superpowers/plans/2026-11-08-backoffice.md` |
| Script upload VPS | `scripts/deploy-vps.sh` |
| Snippets Apache/Nginx | `server/deploy/` |
