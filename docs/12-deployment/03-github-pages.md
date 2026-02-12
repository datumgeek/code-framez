# 12-03 — GitHub Pages

## Overview

The demo app is deployed to GitHub Pages at:

**https://datumgeek.github.io/code-framez/**

---

## Setup Requirements

### 1. Enable GitHub Pages

In the repository settings:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

This allows the workflow to deploy directly without a separate branch.

### 2. Base Path Configuration

The Vite config uses a conditional base path:

```typescript
base: process.env.GITHUB_ACTIONS ? '/code-framez/' : '/'
```

GitHub Pages serves project sites at `https://<user>.github.io/<repo>/`, so the base path must match the repository name.

---

## How It Works

```
Push to main
    │
    ▼
GitHub Actions triggers
    │
    ├── npm ci
    ├── npx vite build (GITHUB_ACTIONS=true → base: '/code-framez/')
    ├── Upload dist/apps/demo/ as artifact
    │
    ▼
Deploy to GitHub Pages
    │
    ▼
https://datumgeek.github.io/code-framez/
```

---

## SPA Routing

Since Code Framez is a single-page application, all routes need to resolve to `index.html`. GitHub Pages doesn't support server-side rewrites, but the demo currently uses no client-side routing (it's a single shell URL), so this is not an issue.

For future SPA routing, add a `404.html` that redirects to `index.html`:

```html
<!-- dist/apps/demo/404.html -->
<!DOCTYPE html>
<html>
<head>
  <script>
    // Redirect all 404s to index.html for SPA routing
    window.location.replace(
      window.location.origin + '/code-framez/' +
      '?redirect=' + encodeURIComponent(window.location.pathname)
    );
  </script>
</head>
</html>
```

---

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the build output with your domain
2. Configure DNS to point to GitHub Pages
3. Update the `base` path in Vite config to `'/'`

---

## Deployment Status

Check deployment status:
- **GitHub Actions tab**: See build/deploy logs
- **Settings → Pages**: See current deployment URL and status
- **Environment deployments**: See the `github-pages` environment history
