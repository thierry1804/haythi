# HAYTHI

Landing [haythi.mg](https://haythi.mg) — offre IT freelance (dev web, conseil, architecture SI, management de projets) + API de contact sécurisée via Resend.

## Stack

| Partie | Techno |
|--------|--------|
| Front | React 18, TypeScript, Vite, Tailwind |
| API contact | Node 20+, Express, Zod, Resend |
| i18n | FR / EN |

## Prérequis

- Node.js ≥ 20
- Compte [Resend](https://resend.com) (clé API + domaine vérifié)
- Optionnel : Cloudflare Turnstile

## Installation

```bash
npm install
npm --prefix server install
```

## Développement

Deux processus :

```bash
# Front (http://localhost:5173) — proxy /api → :8787
npm run dev

# API contact
cp server/.env.example server/.env   # puis renseigner RESEND_*
npm run dev:api
```

## Build front

```bash
npm run build
# sortie dans dist/
```

## API contact

Service Express (`server/`) exposé en local sur `127.0.0.1:8787`.

| Endpoint | Rôle |
|----------|------|
| `GET /healthz` | Santé |
| `POST /api/contact` | Formulaire (notif interne + accusé utilisateur) |

Protections : rate-limit, honeypot, quotas email/IP, CORS, Turnstile optionnel, IP réelle derrière Cloudflare.

Config : voir `server/.env.example`.

## Déploiement

Scripts PowerShell dans `scripts/` (deploy API, repair, tests proxy Apache/Nginx).  
Unit systemd et snippets Nginx / Apache : `server/deploy/`.

Back-office (`admin.haythi.mg`, UI Docker sur `127.0.0.1:8090`, Cloudflare Access) : voir [docs/backoffice-deploy.md](docs/backoffice-deploy.md).

## Scripts utiles

```bash
npm run lint
npm run typecheck
npm run preview
```

## Licence

Projet privé.
