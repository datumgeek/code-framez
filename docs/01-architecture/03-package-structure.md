# 01-03 — Package Structure

## Monorepo Layout

Code Framez uses an **Nx monorepo** with the following directory structure:

```
code-framez/
├── apps/
│   └── demo/                        # Demo application
│       ├── index.html
│       ├── tsconfig.json
│       └── src/
│           ├── main.tsx             # Entry point
│           ├── app.tsx              # App shell wiring
│           └── views/               # Demo view components
├── libs/
│   ├── core/                        # Framework-agnostic types
│   │   ├── types/                   # @code-framez/core/types
│   │   └── auth-types/              # @code-framez/core/auth-types
│   ├── react/                       # React-specific libraries
│   │   ├── state/                   # @code-framez/react/state
│   │   └── view-host/              # @code-framez/react/view-host
│   ├── react-material/             # React + MUI components
│   │   ├── shell/                   # @code-framez/react-material/shell
│   │   ├── pane/                    # @code-framez/react-material/pane
│   │   └── entity-menu/            # @code-framez/react-material/entity-menu
│   └── auth/                        # Authentication libraries
│       └── react/                   # @code-framez/auth/react
├── docs/                            # This documentation
├── nx.json                          # Nx workspace config
├── tsconfig.base.json              # Root TypeScript config with path aliases
├── vite.config.ts                   # Vite build config
└── package.json                     # Root package.json
```

## Package Descriptions

### Core Layer (`libs/core/`)

These packages contain only TypeScript type definitions — no runtime code, no framework dependencies.

| Package | Import Path | Contents |
|---------|-------------|----------|
| `types` | `@code-framez/core/types` | `PaneType`, `ViewInstance`, `ShellState`, `ShellActions`, `EntityRef`, `ShellEvent`, and all related interfaces |
| `auth-types` | `@code-framez/core/auth-types` | `AuthUser`, `AuthToken`, `AuthState`, `AuthActions`, `Permission`, `ApiEndpoint`, and provider config types |

### React Layer (`libs/react/`)

React-specific libraries that implement core interfaces using React primitives.

| Package | Import Path | Contents |
|---------|-------------|----------|
| `state` | `@code-framez/react/state` | Zustand store (`useShellStore`), all selector hooks, event system (`onShellEvent`) |
| `view-host` | `@code-framez/react/view-host` | `ViewHostProvider` context, `useViewComponent` hook, `ViewComponentProps` interface, `ViewNotFound` fallback |

### React + Material UI Layer (`libs/react-material/`)

MUI-based visual components for the shell.

| Package | Import Path | Contents |
|---------|-------------|----------|
| `shell` | `@code-framez/react-material/shell` | `Shell` component, `ShellConfig` interface, default theme |
| `pane` | `@code-framez/react-material/pane` | `Pane` component with MUI tabs, close buttons, view content rendering |
| `entity-menu` | `@code-framez/react-material/entity-menu` | `EntityMenu` component, `useEntityMenu` hook |

### Auth Layer (`libs/auth/`)

Authentication framework.

| Package | Import Path | Contents |
|---------|-------------|----------|
| `react` | `@code-framez/auth/react` | `AuthProvider`, `AuthBanner`, `MockAuthAdapter`, `AuthAdapter` interface, auth hooks |

## Dependency Graph

```
@code-framez/core/types ─────────────────────────────────────┐
       │                                                      │
       ├── @code-framez/react/state                           │
       │       │                                              │
       ├── @code-framez/react/view-host                       │
       │       │                                              │
       │       ├── @code-framez/react-material/pane ─────────┤
       │       │       │                                      │
       │       └───────┼── @code-framez/react-material/shell  │
       │               │                                      │
       └───────────────┼── @code-framez/react-material/entity-menu
                       │
@code-framez/core/auth-types                                  │
       │                                                      │
       └── @code-framez/auth/react ───────────────────────────┘
```

## Path Aliases

TypeScript path aliases are configured in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@code-framez/core/*": ["libs/core/*/src/index.ts"],
      "@code-framez/react/*": ["libs/react/*/src/index.ts"],
      "@code-framez/react-material/*": ["libs/react-material/*/src/index.ts"],
      "@code-framez/auth/*": ["libs/auth/*/src/index.ts"]
    }
  }
}
```

Vite resolves these at build time via `resolve.alias` in `vite.config.ts`.

## Library Conventions

Each library follows the same internal structure:

```
libs/<scope>/<name>/
├── tsconfig.json         # Extends root tsconfig.base.json
└── src/
    ├── index.ts          # Public API barrel export
    └── lib/
        └── <name>.ts(x)  # Implementation
```

- **Every public symbol** is re-exported from `src/index.ts`
- **Implementation details** live in `src/lib/`
- **Each library has its own `tsconfig.json`** extending the root config
