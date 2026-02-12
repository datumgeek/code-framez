# 12-01 — Vite Build

**Source:** `vite.config.ts`

## Overview

Code Framez uses Vite 7 as its build tool and development server. The configuration handles path aliases for the monorepo, base path for GitHub Pages, and output directory management.

---

## Configuration

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'apps/demo',
  base: process.env.GITHUB_ACTIONS ? '/code-framez/' : '/',
  resolve: {
    alias: {
      '@code-framez/core/types': path.resolve(__dirname, 'libs/core/types/src/index.ts'),
      '@code-framez/core/auth-types': path.resolve(__dirname, 'libs/core/auth-types/src/index.ts'),
      '@code-framez/react/state': path.resolve(__dirname, 'libs/react/state/src/index.ts'),
      '@code-framez/react/view-host': path.resolve(__dirname, 'libs/react/view-host/src/index.ts'),
      '@code-framez/react-material/pane': path.resolve(__dirname, 'libs/react-material/pane/src/index.ts'),
      '@code-framez/react-material/entity-menu': path.resolve(__dirname, 'libs/react-material/entity-menu/src/index.ts'),
      '@code-framez/react-material/shell': path.resolve(__dirname, 'libs/react-material/shell/src/index.ts'),
      '@code-framez/auth/react': path.resolve(__dirname, 'libs/auth/react/src/index.ts'),
    },
  },
  server: {
    port: 4200,
    host: true,
  },
  build: {
    outDir: '../../dist/apps/demo',
    emptyOutDir: true,
  },
});
```

---

## Key Settings

### root

```typescript
root: 'apps/demo'
```

The build root is the demo app directory, where `index.html` lives.

### base

```typescript
base: process.env.GITHUB_ACTIONS ? '/code-framez/' : '/'
```

- **Local development**: Base path is `/` (root)
- **GitHub Actions**: Base path is `/code-framez/` (the repository name as a subpath on GitHub Pages)

This ensures asset URLs are correct in both environments.

### resolve.alias

Maps `@code-framez/*` import paths to their source files in the monorepo. Vite resolves these at build time, so no pre-compilation step is needed.

### server

```typescript
server: { port: 4200, host: true }
```

- Port 4200 (Nx convention)
- `host: true` enables access from external devices (useful in dev containers)

### build

```typescript
build: {
  outDir: '../../dist/apps/demo',
  emptyOutDir: true,
}
```

Output goes to `dist/apps/demo/` relative to the workspace root. The directory is emptied before each build.

---

## Build Command

```bash
npx vite build
```

### Output Structure

```
dist/apps/demo/
├── index.html
├── assets/
│   ├── index-[hash].js      ← bundled application
│   └── index-[hash].css     ← bundled styles
```

---

## Optimizations

Vite provides out of the box:
- **Tree shaking**: Unused exports are removed
- **Code splitting**: Dynamic imports create separate chunks
- **Minification**: JavaScript and CSS are minified with esbuild
- **Asset hashing**: Filenames include content hashes for cache busting
