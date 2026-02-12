# Code Framez

A modern **component shell platform** for building multi-pane power-user web applications — inspired by [Porrtal](https://github.com/comcast/porrtal).

Code Framez provides the plumbing for complex multi-pane applications (like Bloomberg terminals, analytics dashboards, or enterprise tools) so developers can focus on building components rather than infrastructure.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Banner / Toolbar                      │
├───────┬──────────────────────────────┬───────────────────┤
│       │                              │                   │
│  Nav  │          Main Pane           │   Search / Right  │
│  Pane │        (tabbed views)        │       Pane        │
│       │                              │                   │
│       ├──────────────────────────────┤                   │
│       │        Bottom Pane           │                   │
└───────┴──────────────────────────────┴───────────────────┘
```

## Quick Start

```bash
# Install dependencies
npm install

# Start the demo application
npm run dev

# Build for production
npm run build
```

The demo runs at **http://localhost:4200**.

## Package Structure

### Core (Framework-Agnostic)

| Package | Path | Description |
|---------|------|-------------|
| `@code-framez/core/types` | `libs/core/types` | Pane, view, shell, entity type definitions |
| `@code-framez/core/auth-types` | `libs/core/auth-types` | Auth state, user, token, RBAC types |

### React Libraries

| Package | Path | Description |
|---------|------|-------------|
| `@code-framez/react/state` | `libs/react/state` | Zustand shell store, selector hooks, event system |
| `@code-framez/react/view-host` | `libs/react/view-host` | View component context, registry bridge |

### React + Material UI Components

| Package | Path | Description |
|---------|------|-------------|
| `@code-framez/react-material/shell` | `libs/react-material/shell` | Main Shell layout component |
| `@code-framez/react-material/pane` | `libs/react-material/pane` | Tabbed pane component |
| `@code-framez/react-material/entity-menu` | `libs/react-material/entity-menu` | Entity context menu |

### Auth

| Package | Path | Description |
|---------|------|-------------|
| `@code-framez/auth/react` | `libs/auth/react` | Auth provider, hooks, mock adapter, auth banner |

## Key Concepts

### Pane System

The shell has 5 named pane regions: `nav`, `main`, `search`, `right`, `bottom`. Each pane:
- Hosts multiple views as tabs
- Can be toggled visible/hidden
- Has configurable size constraints
- Tracks its own active view

### View System

Views are the fundamental content units. Register components with the shell:

```tsx
const viewRegistrations: ViewComponentRegistration[] = [
  {
    componentKey: 'my-dashboard',
    displayText: 'Dashboard',
    paneType: 'main',
    launchAtStartup: true,
  },
];

const componentMap: ViewComponentMap = {
  'my-dashboard': MyDashboardComponent,
};
```

### Dynamic View Launching

Launch views programmatically from any component:

```tsx
import { useShellStore } from '@code-framez/react/state';

function MyComponent() {
  const launchView = useShellStore((s) => s.launchView);

  return (
    <button onClick={() => launchView({
      componentKey: 'user-detail',
      paneType: 'main',
      displayText: 'User: Alice',
      componentProps: { userId: '123' },
    })}>
      Open User
    </button>
  );
}
```

### Entity Menu System

Register entity-aware views for context menus:

```tsx
{
  componentKey: 'user-detail',
  displayText: 'User Detail',
  paneType: 'main',
  entityTypes: ['user'],
  entityMenu: {
    menuText: 'View Detail',
    entityTypes: ['user'],
    order: 1,
  },
}
```

### Auth Framework

Pluggable authentication with adapter pattern:

```tsx
import { AuthProvider, MockAuthAdapter, AuthBanner } from '@code-framez/auth/react';

const adapter = new MockAuthAdapter(); // or Auth0Adapter, MSALAdapter, etc.

<AuthProvider adapter={adapter}>
  <Shell config={{ ...config, authComponent: <AuthBanner /> }} />
</AuthProvider>
```

## Building a New App

1. **Define your views** — Create React components for each view
2. **Register views** — Create `ViewComponentRegistration[]` for the shell
3. **Map components** — Create a `ViewComponentMap` linking keys to components
4. **Configure shell** — Create a `ShellConfig` with title, theme, views, etc.
5. **Add auth** — Choose an auth adapter (or use `MockAuthAdapter`)
6. **Render** — Wrap `<Shell>` in `<AuthProvider>`

## Tech Stack

- **React 19** — UI framework
- **Material UI 7** — Component library
- **Zustand + Immer** — State management
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Nx** — Monorepo management

## License

ISC