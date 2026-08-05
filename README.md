# Lincmox Documentation

Documentation officielle du projet [Lincmox](https://doc.lincmox.ovh/) — construite avec [Docusaurus](https://docusaurus.io/).

## Prérequis

- Node.js >= 18.0
- npm ou yarn

## Installation

```bash
npm install
```

## Développement

```bash
npm start
```

Le site sera disponible sur `http://localhost:3000`.

## Build

```bash
npm run build
```

Le site statique sera généré dans le dossier `build/`.

## Structure

```
docs/
├── index.md                  # Page d'accueil
├── introduction/             # Présentation du projet
├── get-started/              # Installation & mise à jour
├── documentation/            # CLI, daemon, GUI, simulation
├── github/                   # Dépôts GitHub
└── changelog/                # Changelog des versions
```

## Déploiement

```bash
npm run deploy
```

Voir la [documentation Docusaurus](https://docusaurus.io/docs/deployment) pour les options de déploiement (Vercel, Netlify, GitHub Pages, etc.).
