# 12-02 — GitHub Actions

**Source:** `.github/workflows/deploy.yml`

## Overview

A GitHub Actions workflow automatically builds and deploys the demo app to GitHub Pages on every push to `main`.

---

## Workflow File

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          GITHUB_ACTIONS: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/apps/demo

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Triggers

| Trigger | Description |
|---------|-------------|
| `push` to `main` | Automatic deploy on every merge/push to main |
| `workflow_dispatch` | Manual trigger from GitHub Actions UI |

---

## Jobs

### Build Job

| Step | Action | Description |
|------|--------|-------------|
| Checkout | `actions/checkout@v4` | Clone the repository |
| Setup Node | `actions/setup-node@v4` | Install Node.js 20, cache npm modules |
| Install | `npm ci` | Clean install from lock file |
| Build | `npm run build` | Run Vite build with `GITHUB_ACTIONS=true` |
| Upload | `actions/upload-pages-artifact@v3` | Package `dist/apps/demo/` as a Pages artifact |

The `GITHUB_ACTIONS: true` environment variable causes Vite to set `base: '/code-framez/'`.

### Deploy Job

| Step | Action | Description |
|------|--------|-------------|
| Deploy | `actions/deploy-pages@v4` | Deploy the artifact to GitHub Pages |

The deploy job depends on the build job (`needs: build`) and runs in the `github-pages` environment.

---

## Permissions

```yaml
permissions:
  contents: read      # Read repo for checkout
  pages: write        # Write to GitHub Pages
  id-token: write     # OIDC token for Pages deployment
```

---

## Concurrency

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

Only one deployment runs at a time. If a new push arrives during a deployment, the in-progress deployment is cancelled.

---

## Build Cache

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: npm
```

The `cache: npm` option caches the `~/.npm` directory between workflow runs, speeding up dependency installation.
