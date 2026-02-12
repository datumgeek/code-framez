# 01-01 — Platform Overview

## What is Code Framez?

Code Framez is an open-source **component shell platform** for building multi-pane, power-user web applications. It is inspired by [Porrtal](https://github.com/comcast/porrtal) and provides the infrastructure ("plumbing") that enterprise-grade applications need — pane management, tabbed views, dynamic component launching, authentication, and state management — so that developers can focus exclusively on building their domain-specific components.

## Who is it for?

Code Framez is designed for teams building:

- **Analytics dashboards** — Bloomberg-terminal-style multi-panel workspaces
- **Enterprise tools** — Admin consoles with deep navigation and entity management
- **Spatial/GIS applications** — Map-centric apps with supporting detail panels
- **Developer tools** — IDE-like layouts with sidebars, editors, and output panels
- **Any power-user application** that needs multiple coordinated panels and views

## What does it provide?

### The Shell

The top-level `Shell` component provides a complete application layout:

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

### Named Pane Regions

Five pre-configured pane regions, each independently manageable:

| Pane | Default Position | Default Visibility | Purpose |
|------|------------------|-------------------|---------|
| `nav` | Left sidebar | Visible | Navigation, tree views, explorer |
| `main` | Center | Visible | Primary content, detail views |
| `search` | Right side | Hidden | Search interfaces, filters |
| `right` | Right side | Hidden | Detail panels, properties |
| `bottom` | Bottom strip | Hidden | Logs, output, secondary info |

### View Management

Every visual component in the application is a **View** — a React component that:
- Is registered in a central component registry
- Can be launched dynamically into any pane
- Appears as a tab that can be activated or closed
- Receives standardized props from the shell

### Entity Navigation

Components can declare themselves as handlers for entity types. When a user interacts with an entity (e.g., clicks a user row), the system can show a context menu of all registered actions for that entity type.

### Authentication

A pluggable auth framework with an adapter pattern supports:
- Auth0, Azure MSAL, Keycloak, OIDC, or custom providers
- Role-based access control (RBAC)
- Access token management
- A mock adapter for development

## Core Philosophy

> **"Leave the plumbing to Code Framez."**

Developers define their components as simple React functions. They register them with the shell. Code Framez handles:

- Pane layout and resizing
- Tab management (activate, close, reorder)
- Dynamic view instantiation
- Cross-component coordination
- Authentication state
- Toolbar and navigation UI

There is zero boilerplate for layout, navigation, or state wiring once the shell is configured.
