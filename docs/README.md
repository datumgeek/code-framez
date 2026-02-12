# Code Framez Documentation

Exhaustive documentation for the Code Framez component shell platform.

## Table of Contents

| # | Section | Description |
|---|---------|-------------|
| 01 | [Architecture Overview](01-architecture/README.md) | Platform design, principles, and structural diagrams |
| 02 | [Core Types](02-core-types/README.md) | Framework-agnostic type definitions (`@code-framez/core/*`) |
| 03 | [State Management](03-state-management/README.md) | Zustand shell store, actions, selectors, and event system |
| 04 | [View System](04-view-system/README.md) | View host, component registry, and dynamic rendering |
| 05 | [Shell & Panes](05-shell-and-panes/README.md) | Shell layout, pane components, and tab management |
| 06 | [Entity Navigation](06-entity-navigation/README.md) | Entity menus, context actions, and entity-aware views |
| 07 | [Authentication](07-authentication/README.md) | Auth framework, adapters, RBAC, and token management |
| 08 | [Theming & Styling](08-theming-and-styling/README.md) | MUI theme customization and default styles |
| 09 | [Demo Application](09-demo-application/README.md) | Demo app walkthrough, view components, and wiring |
| 10 | [Developer Guide](10-developer-guide/README.md) | Building apps, creating views, extending the platform |
| 11 | [API Reference](11-api-reference/README.md) | Complete API reference for every exported symbol |
| 12 | [Deployment](12-deployment/README.md) | Build, CI/CD, and GitHub Pages deployment |

## Package Map

```
libs/
  core/
    types/          → @code-framez/core/types
    auth-types/     → @code-framez/core/auth-types
  react/
    state/          → @code-framez/react/state
    view-host/      → @code-framez/react/view-host
  react-material/
    pane/           → @code-framez/react-material/pane
    entity-menu/    → @code-framez/react-material/entity-menu
    shell/          → @code-framez/react-material/shell
  auth/
    react/          → @code-framez/auth/react
```

## Quick Links

- [Getting Started](10-developer-guide/01-getting-started.md)
- [Creating Your First View](10-developer-guide/02-creating-views.md)
- [Shell Configuration](05-shell-and-panes/01-shell-config.md)
- [All Type Definitions](02-core-types/01-pane-types.md)
- [Full API Reference](11-api-reference/README.md)
