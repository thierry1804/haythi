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

## Licence

© 2024 HAYTHI. Tous droits réservés.

