# Bureau d'Études et Constructions (BEC)

Site vitrine officiel de BEC, cabinet d'architecture, d'ingénierie et de construction basé à Lubumbashi (RDC).

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

Le site utilise PostgreSQL pour le CMS, les messages de contact et les candidatures. Les pages publiques sont rendues à la demande afin que les changements réalisés dans l'administration soient visibles sans nouvelle compilation.

### Variables d'environnement

Copier `.env.example` vers `.env.local` pour le développement ou vers `.env.production` sur le serveur, puis remplacer toutes les valeurs d'exemple.

En production, les variables suivantes sont obligatoires :

- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD` (unique et robuste)
- `SESSION_SECRET` (au moins 32 caractères aléatoires)
- `NEXT_PUBLIC_SITE_URL` (par exemple `https://www.votre-domaine.cd`)

`EMAIL_HOST`, `EMAIL_USER` et `EMAIL_PASS` sont nécessaires seulement pour l'envoi des notifications e-mail. Les formulaires continuent d'être enregistrés dans l'administration si SMTP n'est pas configuré.

## Déploiement sur un VPS Hostinger avec Docker

Le dépôt contient un `Dockerfile` et un fichier `docker-compose.production.yml`. Ils déploient l'application, PostgreSQL et trois volumes persistants : base de données, images téléversées et candidatures.

Sur le VPS, après avoir cloné le dépôt :

```bash
cp .env.example .env.production
nano .env.production
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Ajouter également dans `.env.production` les variables PostgreSQL utilisées par Docker :

```dotenv
POSTGRES_USER=bec
POSTGRES_PASSWORD=choisir-un-mot-de-passe-de-base-de-donnees-unique
POSTGRES_DB=bec
```

L'application écoute uniquement sur `127.0.0.1:3000`. Configurer ensuite Nginx (ou le proxy Hostinger) pour transmettre le domaine HTTPS vers `http://127.0.0.1:3000`. Ne pas exposer PostgreSQL sur Internet.

Pour mettre à jour le site :

```bash
git pull
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

Les migrations Prisma s'exécutent automatiquement au démarrage du conteneur. Les volumes Docker ne doivent pas être supprimés : ils contiennent les données du CMS et les fichiers téléversés.

Avant le premier dépôt GitHub, vérifier qu'aucun fichier `.env`, contenu de `public/uploads/` ou candidature n'est ajouté : ces chemins sont déjà ignorés par Git.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Hook Form, Zod.
