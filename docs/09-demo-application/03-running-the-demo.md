# 09-03 — Running the Demo

## Prerequisites

- Node.js 20+
- npm 10+

---

## Install Dependencies

```bash
npm install
```

---

## Start Development Server

```bash
npx vite --port 4200
```

Or use the configured npm script:

```bash
npx vite
```

The dev server starts at **http://localhost:4200** (or the next available port).

---

## What You'll See

### Initial State

1. **Toolbar**: "Code Framez — Component Shell Platform" with nav toggle, search toggle, right panel toggle, and auth spinner
2. **Nav pane** (left, 260px): Explorer view with clickable links to all main-pane views
3. **Main pane** (center): Dashboard tab showing stat cards and feature chips
4. **Search pane**: Hidden (click the search icon to reveal)
5. **Auth**: Spinner → "Sign In" button (mock adapter completes initialization in ~500ms)

### Things to Try

| Action | What Happens |
|--------|-------------|
| Click a view in the Explorer | Opens a new tab in the main pane |
| Click the × on a tab | Closes that view |
| Switch tabs | Active tab content shows, others hidden but preserved |
| Click ⋯ on a user row | Entity menu appears with "View User Detail" |
| Select "View User Detail" | Opens user detail in a new main tab with entity data |
| Click the search icon | Search pane slides in from the right |
| Type in the search box | Filters registered views by name |
| Click "Sign In" | Mock auth signs in (~300ms), avatar appears in toolbar |
| Click avatar | User menu shows name, email, roles, and sign out |
| Click "Sign Out" | Returns to "Sign In" button |
| Toggle nav button | Nav pane collapses/expands |

---

## Production Build

```bash
npx vite build
```

Output goes to `dist/`. The build:
- Bundles all dependencies
- Tree-shakes unused code
- Sets `base` to `/code-framez/` when `GITHUB_ACTIONS` env var is set

---

## Preview Production Build

```bash
npx vite preview --port 4200
```

Serves the production build locally for testing before deployment.
