# 01-05 — Technology Stack

## Runtime Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **React** | 19.x | UI framework |
| **React DOM** | 19.x | DOM rendering |
| **@mui/material** | 7.x | Component library (Material UI) |
| **@mui/icons-material** | 7.x | Material icon set |
| **@emotion/react** | 11.x | CSS-in-JS engine for MUI |
| **@emotion/styled** | 11.x | Styled component API for MUI |
| **Zustand** | 5.x | State management |
| **Immer** | 11.x | Immutable state updates |
| **uuid** | 13.x | UUID generation for view instance IDs |

## Development Dependencies

| Library | Version | Purpose |
|---------|---------|---------|
| **TypeScript** | 5.x | Type safety and editor tooling |
| **Vite** | 7.x | Build tool and dev server |
| **@vitejs/plugin-react** | 5.x | React Fast Refresh for Vite |
| **Nx** | 22.x | Monorepo management |
| **@nx/js** | 22.x | JS/TS library support |
| **@nx/react** | 22.x | React project support |
| **@nx/workspace** | 22.x | Workspace utilities |

## Build System

### Vite

The demo application uses Vite as its build tool. Configuration is in `vite.config.ts`:

- **Root:** `apps/demo` — Vite serves from the demo app directory
- **Aliases:** All `@code-framez/*` imports resolve to their library source files
- **Base path:** `/code-framez/` when building for GitHub Pages, `/` for local dev
- **Output:** `dist/apps/demo/`

### Nx

Nx provides:
- Workspace-level configuration (`nx.json`)
- Named inputs for build caching (`production`, `default`, `sharedGlobals`)
- Dependency-aware build ordering (`dependsOn: ["^build"]`)
- Library layout conventions (`libs/` and `apps/` directories)

### TypeScript

The root `tsconfig.base.json` provides:
- **Target:** ES2020
- **Module:** ESNext with bundler resolution
- **JSX:** `react-jsx` (automatic runtime)
- **Strict mode:** Enabled
- **Path aliases:** Map `@code-framez/*` to library sources

Each library and app has its own `tsconfig.json` extending the base config.

## CI/CD

### GitHub Actions

The deployment workflow (`.github/workflows/deploy.yml`) uses:

| Step | Action | Purpose |
|------|--------|---------|
| Checkout | `actions/checkout@v4` | Clone repository |
| Node.js setup | `actions/setup-node@v4` | Install Node 20, cache npm |
| Install | `npm ci` | Reproducible dependency installation |
| Build | `npm run build` | Vite production build |
| Upload artifact | `actions/upload-pages-artifact@v3` | Package `dist/apps/demo/` |
| Deploy | `actions/deploy-pages@v4` | Publish to GitHub Pages |

## Why These Choices?

### React 19
- Dominant ecosystem for component-based UI
- Hooks-based architecture aligns with our composition model
- Broad community and tooling support

### Material UI 7
- Comprehensive component library
- Excellent theming system
- Built-in accessibility
- Dense mode for power-user UIs

### Zustand + Immer
- Minimal boilerplate compared to Redux
- Immer allows intuitive state mutations
- Selector-based subscriptions prevent unnecessary re-renders
- No provider wrapping needed (store is global)

### Vite
- Sub-second hot module replacement
- ESM-native for fast builds
- Plugin ecosystem (React Fast Refresh)
- Simple configuration

### Nx
- First-class monorepo support
- Dependency graph analysis
- Build caching
- Consistent project structure conventions
