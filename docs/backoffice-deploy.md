# Back-office HAYTHI — déploiement

Checklist ordonnée. Spec : `docs/superpowers/specs/2026-11-08-backoffice-design.md`.

```
https://haythi.mg          -> /var/www/html (statique)
  POST /api/contact        -> 127.0.0.1:8787
  POST /api/t              -> 127.0.0.1:8787   (beacon, après privacy)
https://admin.haythi.mg    -> Cloudflare Access -> Apache
  /api/*                   -> 127.0.0.1:8787   (cookies same-site)
  /*                       -> 127.0.0.1:8090   (conteneur Docker UI)
```

## Où se trouvent les fichiers (dépôt vs VPS)

Les commandes ci-dessous s'exécutent **sur le VPS**, où le dépôt n'est pas cloné. Le contenu de `server/` du dépôt est synchronisé dans `/opt/haythi-api` (script `server/deploy/remote-setup.sh`, ou rsync manuel), donc les snippets sont sur le VPS dans `/opt/haythi-api/deploy/`.

| Dépôt (poste de dev) | VPS |
|----------------------|-----|
| `server/deploy/apache-admin.conf.snippet` | `/opt/haythi-api/deploy/apache-admin.conf.snippet` |
| `server/deploy/apache-api-t.conf.snippet` | `/opt/haythi-api/deploy/apache-api-t.conf.snippet` |
| `server/deploy/nginx-api.conf.snippet` | `/opt/haythi-api/deploy/nginx-api.conf.snippet` |
| `server/scripts/create-admin.js` | `/opt/haythi-api/scripts/create-admin.js` |
| `admin/` (UI Docker) | `/opt/haythi-admin/` (copié depuis le poste, voir étape 4) |

Avant l'étape 2, vérifier que les snippets sont bien là : `ls /opt/haythi-api/deploy/`. Sinon, depuis le poste de dev, à la racine du dépôt :

```bash
rsync -a --exclude node_modules --exclude .env --exclude data server/ ubuntu@<ip-vps>:/tmp/haythi-api-upload/
# puis sur le VPS : bash /tmp/haythi-api-upload/deploy/remote-setup.sh   (ou rsync -> /opt/haythi-api avec sudo)
```

## Variables d'environnement (`/opt/haythi-api/.env`, `chmod 600`)

| Variable | Valeur | Remarque |
|----------|--------|----------|
| `SESSION_SECRET` | chaîne aléatoire longue | **Obligatoire en production.** Sans elle l'API démarre mais l'API admin est désactivée (`admin API disabled` dans le journal). Générer : `openssl rand -base64 48`. Changer la valeur invalide toutes les sessions. |
| `ADMIN_ORIGIN` | `https://admin.haythi.mg` | Seule origine CORS autorisée avec cookies. Plusieurs valeurs séparées par des virgules. |
| `DATABASE_PATH` | `data/haythi.sqlite` | Relatif au `WorkingDirectory` du service (`/opt/haythi-api`) donc `/opt/haythi-api/data/haythi.sqlite`. Le dossier `data/` doit appartenir à `www-data`. |
| `NODE_ENV` | `production` | Cookie `Secure` actif. |

Le reste (`RESEND_*`, `ALLOWED_ORIGINS`, quotas) est inchangé : voir `server/.env.example`.

## Checklist

### 1. API (hôte, systemd)

- [ ] Mettre à jour `/opt/haythi-api` (code `server/` du dépôt, snippets inclus dans `/opt/haythi-api/deploy/`), **sans écraser `.env` ni `data/`**. `remote-setup.sh` (`server/deploy/` dans le dépôt, `/opt/haythi-api/deploy/` sur le VPS) exclut les deux du `rsync --delete`.
- [ ] Compléter `/opt/haythi-api/.env` avec `SESSION_SECRET`, `ADMIN_ORIGIN`, `DATABASE_PATH`.
- [ ] Installer les dépendances (modules natifs `better-sqlite3` et `argon2`) :

```bash
cd /opt/haythi-api && sudo -u www-data npm ci --omit=dev
sudo install -d -o www-data -g www-data -m 750 /opt/haythi-api/data
sudo systemctl restart haythi-contact
sudo journalctl -u haythi-contact -n 30 --no-pager
```

Le journal ne doit **pas** contenir `admin API disabled`.

- [ ] Vérifier la santé :

```bash
curl -fsS http://127.0.0.1:8787/healthz
```

Réponse attendue : `{"ok":true,"quota":{...}}`.

Sauvegarde (manuelle, v1) : `sudo cp -a /opt/haythi-api/data /root/haythi-data-$(date +%F)`.

### 2. Proxy Apache admin

- [ ] Docker installé sur le VPS : `docker --version && docker compose version`.
- [ ] Certificat pour `admin.haythi.mg` (certbot ou certificat d'origine Cloudflare), puis adapter les chemins `SSLCertificateFile` du snippet.
- [ ] Installer le vhost :

```bash
sudo a2enmod proxy proxy_http headers ssl rewrite
sudo cp /opt/haythi-api/deploy/apache-admin.conf.snippet /etc/apache2/sites-available/admin.haythi.mg.conf
sudo a2ensite admin.haythi.mg
sudo apache2ctl configtest && sudo systemctl reload apache2
```

Le vhost envoie `/api/` vers `127.0.0.1:8787` et le reste vers `127.0.0.1:8090`. Nginx : reprendre les mêmes deux `location` en `proxy_pass`.

### 3. Création du compte admin (une seule fois)

L'email doit être celui de l'allowlist Cloudflare Access. Mot de passe : 12 caractères minimum.

```bash
cd /opt/haythi-api
sudo -u www-data node scripts/create-admin.js operateur@example.com 'MOT_DE_PASSE_LONG'
```

Le script lit `/opt/haythi-api/.env` (donc `DATABASE_PATH`) via dotenv : lancer depuis `/opt/haythi-api`, avec le même utilisateur que le service pour que la base reste lisible par `www-data`.

- [ ] Scanner immédiatement l'URL `otpauth://` affichée dans une application TOTP : elle n'est **pas réaffichée**. Relancer la commande régénère mot de passe et secret TOTP, et invalide les sessions.
- [ ] Effacer l'historique shell si le mot de passe y figure : `history -d $(history 1 | awk '{print $1}')`.

### 4. Conteneur UI (Docker, port 8090)

`admin/` n'est pas dans `/opt/haythi-api` : le copier d'abord depuis le poste de dev, à la racine du dépôt :

```bash
rsync -a --exclude node_modules --exclude dist admin/ ubuntu@<ip-vps>:/tmp/haythi-admin-upload/
ssh ubuntu@<ip-vps> 'sudo mkdir -p /opt/haythi-admin && sudo rsync -a --delete /tmp/haythi-admin-upload/ /opt/haythi-admin/'
```

Puis sur le VPS :

```bash
cd /opt/haythi-admin
docker compose up -d --build
docker compose ps
curl -sI http://127.0.0.1:8090/ | head -5
```

Le compose publie `127.0.0.1:8090:80` : le conteneur n'est joignable que via Apache. L'image ne contient aucun secret.

### 5. DNS

- [ ] Cloudflare : enregistrement `admin` (A/AAAA vers le VPS), proxifié (nuage orange). Mode SSL/TLS : Full (strict).

### 6. Cloudflare Access

- [ ] Zero Trust > Access > Applications > Self-hosted, domaine `admin.haythi.mg`.
- [ ] Politique **Allow** avec une seule règle : *Emails* = email de l'opérateur (allowlist), aucune autre règle, pas de « Everyone ».
- [ ] Idéal : pare-feu du VPS limitant 443 aux plages IP Cloudflare, pour ne pas contourner Access en tapant l'origine directement.

### 7. Privacy et front (déjà dans le code)

Le texte de confidentialité (`src/components/Privacy.tsx`, mesure d'audience first-party agrégée) et le beacon (`src/analytics.ts`, `POST /api/t`) sont déjà dans le front. Ils sont déployés ensemble :

- [ ] `npm run build`, puis déployer `dist/` vers `/var/www/html`.
- [ ] Vérifier dans le navigateur que la page de confidentialité mentionne la mesure d'audience.

Tant que le proxy `/api/t` n'est pas activé (étape 8), le beacon reçoit un 404 du site, sans effet pour le visiteur.

### 8. Activer `/api/t` (public)

**Uniquement après l'étape 7** (privacy en ligne).

- [ ] Apache : coller le contenu de `/opt/haythi-api/deploy/apache-api-t.conf.snippet` dans le `<VirtualHost *:443>` de `haythi.mg` (fichier du site, souvent `/etc/apache2/sites-available/000-default-le-ssl.conf`), à côté de `<Location "/api/contact">`. Nginx : bloc `location = /api/t` de `/opt/haythi-api/deploy/nginx-api.conf.snippet`.

```bash
sudo apache2ctl configtest && sudo systemctl reload apache2
# Nginx : sudo nginx -t && sudo systemctl reload nginx
```

### 9. Vérifications (curl)

Santé API (depuis le VPS) :

```bash
curl -fsS http://127.0.0.1:8787/healthz
```

UI admin locale (conteneur) :

```bash
curl -sI http://127.0.0.1:8090/ | grep -iE '^(HTTP|x-robots-tag|content-security-policy)'
```

Attendu : `200`, `X-Robots-Tag: noindex, nofollow, noarchive`.

Cloudflare Access (depuis n'importe où, sans session) : doit rediriger vers la connexion Access, jamais servir l'UI.

```bash
curl -sI https://admin.haythi.mg/ | grep -iE '^(HTTP|location)'
curl -s -o /dev/null -w '%{http_code}\n' https://admin.haythi.mg/api/admin/me
```

Attendu : `302` avec `location: https://<équipe>.cloudflareaccess.com/...` ; `/api/admin/me` renvoie `302` (ou `403`), pas `401` ni JSON.

Admin sans session, en contournant Access depuis le VPS (teste Apache + API) :

```bash
curl -sk --resolve admin.haythi.mg:443:127.0.0.1 \
  -o /dev/null -w '%{http_code}\n' https://admin.haythi.mg/api/admin/me
```

Attendu : `401`.

Login (depuis le VPS, via Apache, contournant Access). Remplacer email, mot de passe et code TOTP à 6 chiffres :

```bash
curl -sk --resolve admin.haythi.mg:443:127.0.0.1 \
  -c /tmp/haythi-cj -D - -X POST https://admin.haythi.mg/api/admin/login \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://admin.haythi.mg' \
  -d '{"email":"operateur@example.com","password":"MOT_DE_PASSE_LONG","totp":"123456"}'
```

Attendu : `200 {"ok":true}` avec deux `Set-Cookie` (`haythi_admin` HttpOnly Secure SameSite=Strict, et `haythi_csrf`). Mauvais identifiants ou TOTP : `401 {"error":"invalid_credentials"}`. Puis :

```bash
curl -sk --resolve admin.haythi.mg:443:127.0.0.1 -b /tmp/haythi-cj \
  https://admin.haythi.mg/api/admin/me
curl -sk --resolve admin.haythi.mg:443:127.0.0.1 -b /tmp/haythi-cj \
  'https://admin.haythi.mg/api/admin/stats/visits?days=7'
rm -f /tmp/haythi-cj
```

Attendu : `{"email":"operateur@example.com"}` puis les stats de visites.

Beacon public `POST /api/t` (privacy déployée, étape 8 faite) :

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST https://haythi.mg/api/t \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://haythi.mg' \
  -d '{"path":"/","lang":"FR"}'
```

Attendu : `204`. Charge invalide : `422`. Origine non autorisée (`-H 'Origin: https://evil.example'`) : `403`. Méthode GET : bloquée par le proxy.

Contact inchangé :

```bash
curl -s -X POST https://haythi.mg/api/contact -H 'Content-Type: application/json' \
  -H 'Origin: https://haythi.mg' -d '{}'
```

Attendu : `422 {"ok":false,"error":"INVALID_PAYLOAD"}`.

Parcours complet (critères de réussite de la spec) : envoyer un lead de test depuis le formulaire, le voir dans le back-office, répondre (copie `contact@haythi.mg`), exporter, anonymiser, supprimer ; vérifier que les visites apparaissent après quelques chargements de `https://haythi.mg`.

## Dépannage rapide

| Symptôme | Cause probable |
|----------|----------------|
| `/api/admin/*` répond `404` | `SESSION_SECRET` absent : API admin désactivée. Voir `journalctl -u haythi-contact`. |
| Login OK mais `/me` renvoie `401` | Cookie `Secure` non accepté : accès en HTTP, ou `X-Forwarded-Proto` absent. |
| Erreur CORS dans l'UI | `ADMIN_ORIGIN` différent de l'origine réelle de l'UI. |
| Base vide après un déploiement | `data/` écrasé par un `rsync --delete` : l'exclure, restaurer la sauvegarde. |
| `/api/t` renvoie `403` | Origine ou referer hors `ALLOWED_ORIGINS`. |
