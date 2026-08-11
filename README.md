# Kavach Insurance Landing Page

A React + Vite landing page for Kavach, an affordable protection concept built for gig workers and students.

## Project setup

```bash
npm install
```

### Local development

```bash
npm run dev
```

Open the local server URL shown by Vite after startup.

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## GitHub Actions

This repository includes CI and GitHub Pages deployment workflows:

- `.github/workflows/ci.yml` — installs dependencies, runs lint, and builds on `push` and `pull_request` to `main`
- `.github/workflows/pages.yml` — builds the app and deploys the `dist/` output to GitHub Pages on every push to `main`

## Deployment

The app is configured to deploy automatically to GitHub Pages using the workflow in `.github/workflows/pages.yml`.

Once the workflow runs successfully, the site should be available via GitHub Pages for this repository.

## Repository structure

- `index.html` — Vite entry template
- `src/` — React source files
- `public/` — static assets
- `package.json` — dependencies and scripts
- `tailwind.config.js` — Tailwind CSS config
- `vite.config.js` — Vite config

## Notes

- `dist/` is ignored by Git because it is generated at build time.
- The deployment workflow uses `npm ci` and `npm run build` so the published output matches the production build.
