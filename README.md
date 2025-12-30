# Site Web HAYTHI

Site web professionnel multilingue (français/anglais) pour HAYTHI, consultant IT freelance spécialisé en développement web, architecture SI et management de projets.

## Technologies

- **Framework** : Next.js 14+ (App Router) avec TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Formulaires** : React Hook Form + Zod
- **Icônes** : Lucide React
- **Markdown** : React Markdown

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Structure du projet

```
haythi/
├── app/                    # Pages Next.js (App Router)
│   ├── blog/              # Pages blog
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Page d'accueil
│   └── globals.css       # Styles globaux
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   └── blog/             # Composants blog
├── data/                  # Données statiques
├── lib/                   # Utilitaires et contextes
│   ├── context/          # Contextes React (i18n)
│   ├── translations.ts   # Traductions FR/EN
│   └── utils.ts          # Fonctions utilitaires
└── public/                # Fichiers statiques
```

## Fonctionnalités

- ✅ Site multilingue (FR/EN) avec persistance dans localStorage
- ✅ Sections complètes : Hero, Services, À propos, Compétences, Expériences, Certifications, Portfolio, Blog, Contact
- ✅ Formulaire de contact avec validation
- ✅ Intégration Calendly pour prise de rendez-vous
- ✅ Blog avec filtres et recherche
- ✅ Animations au scroll avec Framer Motion
- ✅ Responsive design (mobile, tablette, desktop)
- ✅ SEO optimisé
- ✅ Accessibilité (WCAG 2.1)

## Configuration Calendly

Pour activer l'intégration Calendly, modifiez l'URL dans `components/Contact.tsx` :

```tsx
<CalendlyWidget url="https://calendly.com/votre-username" />
```

## Palette de couleurs

- Noir : `#000000`
- Gris foncé : `#1a1a1a`
- Gris moyen : `#2d2d2d`
- Gris clair : `#e0e0e0`
- Blanc : `#ffffff`
- Accent (bleu) : `#3b82f6`

## Contact

- Email : contact@haythi.mg
- Téléphone : +261 32 28 383 86
- WhatsApp : [HAYTHI](https://wa.me/261322838386)

## Déploiement

### Déploiement automatique via GitHub Actions

Le projet est configuré pour se déployer automatiquement sur votre VPS via SSH à chaque push sur la branche `main` ou `master`.

#### Configuration requise

1. **Secrets GitHub** : Ajoutez les secrets suivants dans les paramètres de votre dépôt GitHub (Settings > Secrets and variables > Actions) :

   - `VPS_HOST` : L'adresse IP ou le domaine de votre VPS (ex: `192.168.1.100` ou `vps.example.com`)
   - `VPS_USER` : Le nom d'utilisateur SSH (ex: `root` ou `deploy`)
   - `VPS_PASSWORD` : Le mot de passe SSH pour se connecter au VPS
   - `VPS_PORT` : Le port SSH (optionnel, par défaut `22`)
   - `VPS_DEPLOY_DIR` : Le répertoire de déploiement sur le VPS (optionnel, par défaut `/var/www/haythi`)

2. **Sécurité** : Assurez-vous que l'authentification par mot de passe SSH est activée sur votre VPS. Si ce n'est pas le cas, modifiez `/etc/ssh/sshd_config` :

   ```bash
   PasswordAuthentication yes
   ```

   Puis redémarrez le service SSH :
   ```bash
   sudo systemctl restart sshd
   ```

#### Configuration Nginx (exemple)

Pour servir le site statique, configurez Nginx comme suit :

```nginx
server {
    listen 80;
    server_name haythi.mg www.haythi.mg;

    root /var/www/haythi/current;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets statiques
    location /_next/static {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Déploiement manuel

Vous pouvez également déployer manuellement en utilisant le script `deploy.sh` :

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Configurer les variables d'environnement
export VPS_HOST="votre-serveur.com"
export VPS_USER="root"
export VPS_PASSWORD="votre-mot-de-passe"
export VPS_PORT="22"
export VPS_DEPLOY_DIR="/var/www/haythi"

# Lancer le déploiement
./deploy.sh
```

**Note** : Le script nécessite `sshpass` pour l'authentification par mot de passe. Il sera installé automatiquement sur Linux/Mac si nécessaire.

## Licence

© 2024 HAYTHI. Tous droits réservés.

