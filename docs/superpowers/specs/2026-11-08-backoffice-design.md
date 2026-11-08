# HAYTHI Back-office — Design

Date: 2026-11-08  
Status: ready for approval  
Owner: HAYTHI (single operator)

## Intent

Donner à l’opérateur unique de HAYTHI un back-office pour :

1. **Suivre les visites** de la landing `haythi.mg` (volume, tendance, origines).
2. **Gérer les demandes de devis / contact** : les voir, les qualifier, y répondre par email, les clôturer, les exporter / anonymiser / supprimer.

Le site public et le ton “terminal / protocole” restent inchangés. Le BO est un outil interne, sobre, sécurisé, pas un produit marketing.

## Why now

Le SEO vient d’être posé ; les contacts ne sont aujourd’hui que des emails Resend (pas d’historique applicatif). Sans BO, on ne peut ni mesurer l’effet SEO ni traiter les devis de façon fiable.

## Goals

- Persister chaque soumission contact **légitime** (après filtres anti-spam) avec statut et historique.
- Répondre au lead depuis le BO via Resend.
- Actions RGPD sur fiche lead : **exporter**, **anonymiser**, **supprimer**.
- Stats de visite agrégées (jour / 7j / 30j) dans le même BO.
- Accès réservé à **un seul utilisateur**.
- UI admin **uniquement** en **Docker** ; API contact reste sur l’hôte (`systemd`).

## Non-goals

- Multi-utilisateurs / rôles / équipe commerciale.
- CRM complet, facturation, devis PDF, pipeline Kanban avancé.
- Dockeriser l’API contact ou le front public.
- SSR / migration Next.js.
- Google Analytics / Meta Pixel comme socle.
- Pages services séparées, blog, i18n dédiée du BO (FR suffit).
- Import d’historique email existant (démarrage **base vide**).

## Anti-goals

- Admin indexé par Google.
- Secrets dans l’image Docker ou le dépôt.
- API admin joignable sans authentification forte.
- Analytics cookies invasifs côté visiteurs publics.
- Refonte visuelle “SaaS dashboard” du site public.
- Activer le beacon `/api/t` **avant** mise à jour du texte privacy.

## Constraints

- Stack existante : landing Vite/React dans `/var/www/html` ; API Express Node 20+ sur `127.0.0.1:8787` (`/opt/haythi-api`, unit `haythi-contact`) ; reverse-proxy + Cloudflare devant `haythi.mg`.
- Resend déjà utilisé pour notif interne + ack utilisateur.
- Volume attendu : faible (landing mono-page, un opérateur).
- Privacy : conservation des leads = **durée du traitement uniquement** ; suppression dès dossier terminé.
- Validé opérateur : Cloudflare Access + 2FA applicative ; Docker = UI admin seulement.

## Decisions (agreed)

| Sujet | Décision |
|-------|----------|
| Utilisateurs BO | Un seul compte opérateur |
| Identité | Email Cloudflare Access = identifiant login BO (même personne) |
| Périmètre Docker | Image/conteneur **UI admin** uniquement |
| API | Reste sur l’hôte ; étendue (leads, stats, auth, reply, RGPD) |
| Front public | Beacon + texte privacy mis à jour **avant** activation stats |
| Hébergement admin | `admin.haythi.mg` |
| Accès réseau | Cloudflare Access devant `admin.haythi.mg` |
| Auth app | Session serveur + Argon2id + TOTP obligatoire |
| Stockage | SQLite (WAL) sous `/opt/haythi-api/data/` |
| Historique initial | Base vide |
| Rétention leads | Suppression dès traitement terminé (pas de conservation 24 mois) |
| RGPD UI | Boutons exporter / anonymiser / supprimer |
| Réponse email | Voir section « Reply semantics » |
| Analytics | Beacon first-party après privacy ; CF Web Analytics optionnel en complément |

## Architecture

```
Internet
  │
  ├─ https://haythi.mg          → /var/www/html (statique)
  │     POST /api/contact       → proxy → 127.0.0.1:8787
  │     POST /api/t             → proxy → 127.0.0.1:8787  (beacon, après privacy)
  │
  └─ https://admin.haythi.mg    → Cloudflare Access → conteneur UI (Nginx :8090 local)
        + reverse-proxy /api/*  → 127.0.0.1:8787   (same-site cookies)
```

**Call figé** : `admin.haythi.mg` reverse-proxifie aussi `/api/*` vers l’API hôte pour des cookies de session **same-site** (`Secure`, `HttpOnly`, `SameSite=Strict`). Le public garde `haythi.mg/api/contact` et `haythi.mg/api/t`.

### Composants

1. **`admin/`** — SPA React/Vite, image Docker `nginx:alpine`, `noindex`, headers sécurité.
2. **`server/`** — Express étendu : contact + auth admin + leads + reply + RGPD + beacon + stats.
3. **SQLite** — `leads`, `lead_events`, `sessions`, `admin_user`, agrégats visites.
4. **Infra** — systemd API ; `.env` étendu ; vhost `admin` + proxy ; DNS + CF Access.

### Flux leads

1. `POST /api/contact` avec protections actuelles.
2. **Ne pas persister** les honeypot / timing / spam silencieux / échecs validation (comme aujourd’hui ces cas peuvent répondre `ok` sans mail — ils restent hors BO).
3. Dès validation métier OK : **insert lead** `status=new` **avant** Resend ; champ `email_status` si l’envoi échoue.
4. Notif interne + ack utilisateur (inchangés).
5. BO : liste → fiche → statut / reply / export / anonymiser / supprimer.

### Statuts lead (call figé)

`new` → `in_progress` → `replied` → `closed`  
Branches : `spam`, et depuis tout statut non terminal → actions RGPD.

- **`closed`** = traitement terminé → l’opérateur **supprime** (ou anonymise) le lead pour respecter la rétention « dès terminé ». Pas de job auto v1 : l’UI doit le rappeler clairement sur les leads `closed` encore présents.
- Notes internes optionnelles via events (builder’s call sur UX exacte).

### Reply semantics (validé)

- Destinataire : email du prospect.
- `From` : même identité Resend que l’API actuelle (`RESEND_FROM`).
- `Reply-To` : `contact@haythi.mg`.
- **Cc** : `contact@haythi.mg` (copie opérateur).
- Corps : texte + HTML simple.
- Objet : préfixe clair du type `Re: [HAYTHI] …` basé sur le sujet du lead (builder affine le template).
- Contenu de la réponse **stocké** dans `lead_events` (audit).

### Flux visites

1. Mettre à jour le texte privacy (landing) pour mentionner la mesure d’audience first-party agrégée, sans publicité tiers.
2. Ensuite seulement : beacon `POST /api/t` (path, referrer, `lang`, pas de PII).
3. Agrégation quotidienne ; pas d’IP en clair longue durée (hash salé journalier ou compteurs — builder’s call).
4. BO : totaux / tendance / top referrers.

### Flux auth admin

1. Cloudflare Access (allowlist email opérateur).
2. Login app : identifiant (= cet email) + mot de passe Argon2id + TOTP.
3. Cookie session same-site sur `admin.haythi.mg`.

## UI admin

1. **Login** (+ setup TOTP premier boot).
2. **Dashboard** : visites 7j/30j, leads `new`, dernier contact.
3. **Leads** : liste (filtre statut / sujet), fiche, changement statut, composer reply, **Exporter** (JSON), **Anonymiser**, **Supprimer** (confirmations destructives).
4. **Compte** : mot de passe, re-enroll TOTP (invalide sessions).

Style : UI interne normale, sombre calme cohérent HAYTHI. FR only.

## Sécurité

- Cloudflare Access + TOTP obligatoires.
- Rate-limit `/api/admin/login` ; CSRF sur mutations ; Zod partout ; Helmet ; body limits.
- Compte admin via script one-shot local.
- Secrets dans `/opt/haythi-api/.env` (`chmod 600`).
- Image Docker multi-stage, non-root, zéro secret.
- CSP / `X-Frame-Options` / `Referrer-Policy` / `noindex` sur admin.
- Audit : login, reply, status, export, anonymize, delete.
- Backups `data/` documentés (manuel OK v1).

## API (esquisse)

Public :

- `POST /api/contact` — + persist lead légitime
- `POST /api/t` — beacon (après privacy)
- `GET /healthz` — localhost

Admin (session sauf login / setup TOTP bootstrap) :

- `POST /api/admin/login` | `logout`
- `POST /api/admin/totp/setup` | `verify`
- `GET /api/admin/me`
- `GET /api/admin/leads` | `GET /api/admin/leads/:id`
- `PATCH /api/admin/leads/:id` — status
- `POST /api/admin/leads/:id/reply`
- `GET /api/admin/leads/:id/export` — JSON téléchargeable
- `POST /api/admin/leads/:id/anonymize`
- `DELETE /api/admin/leads/:id`
- `GET /api/admin/stats/visits`

## Docker UI

- Path : `admin/`
- Dockerfile multi-stage → `nginx:alpine`
- Compose : `127.0.0.1:8090:8080` ; proxy hôte → ce port pour `admin.haythi.mg`
- Prérequis deploy : Docker installé sur le VPS (à vérifier à l’install)
- Snippets proxy : privilégier **Apache** si c’est le vhost actuel (scripts existants) ; fournir équivalent Nginx si besoin

## Déploiement (ordre)

1. Étendre API + SQLite ; redémarrer systemd.
2. Proxy : `/api/admin/*` sur vhost admin (+ `/api/t` sur public **seulement après** étape privacy).
3. Script création admin + enroll TOTP.
4. Conteneur UI + DNS `admin` + Cloudflare Access (email unique).
5. Mettre à jour privacy sur le front → rebuild/deploy `dist/`.
6. Activer beacon front + proxy `/api/t` → redeploy front.
7. Vérifs : Access, TOTP, lead test, reply+Cc, export/anonymize/delete, stats.

## Builder’s calls (restants)

- Schéma SQL exact ; lib SQLite.
- Rollup pageviews.
- Lib TOTP / sessions.
- CSP détaillée ; structure React admin.
- Backup auto v1 (manuel OK).
- Template exact sujet/corps reply.
- Rappel UI « lead closed → supprimer » (badge / filtre).

## Calls figés par le design (hors builder libre)

- Statuts : `new | in_progress | replied | closed | spam`.
- Persist uniquement après passage anti-spam / validation ; persist même si Resend échoue (`email_status`).
- Proxy same-site via `/api` sur `admin.haythi.mg`.
- Pas d’import historique.
- Privacy avant beacon.
- Reply : To prospect, From Resend, Reply-To + Cc `contact@haythi.mg`, texte+HTML, stocké en audit.

## Success criteria

- Lead de test visible dans le BO.
- Reply reçu par le prospect + copie `contact@haythi.mg`.
- Export JSON / anonymisation / suppression fonctionnels.
- Lead `closed` clairement à purger ; pas de rétention longue automatique.
- Privacy mise à jour **avant** que `/api/t` reçoive du trafic.
- Visites visibles après activation beacon.
- Sans Access / sans TOTP → pas d’accès BO.
- Image Docker sans secrets ; contact public inchangé fonctionnellement.

## Open for human

Aucun point bloquant restant. Approuver ce document = feu vert pour le plan d’implémentation (`writing-plans`).
