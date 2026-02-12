# 01-02 — Design Principles

## Guiding Principles

### 1. Component-First Architecture

Every piece of visible UI is a **View Component**. The shell itself is purely structural — it provides the panes, tabs, and toolbar, but all content comes from registered view components.

**Implication:** There is no "page" concept. There are no routes in the traditional sense. The shell is always present, and views are launched into panes dynamically.

### 2. Registry-Driven Composition

Components are not hard-wired into the layout. Instead, they are:

1. **Registered** — Declared in a `ViewComponentRegistration[]` array with metadata
2. **Mapped** — Linked to actual React components via a `ViewComponentMap`
3. **Launched** — Instantiated into panes on demand (at startup or dynamically)

This separation means:
- Components don't know about the shell's internal layout
- The shell doesn't know about component internals
- New components can be added without modifying the shell
- Components can be conditionally included based on permissions

### 3. Framework-Agnostic Core

The type definitions in `@code-framez/core/*` contain zero framework-specific code. They are pure TypeScript interfaces and type aliases.

```
┌─────────────────────────────────────┐
│        @code-framez/core/types      │  ← Pure TypeScript
│     @code-framez/core/auth-types    │  ← Pure TypeScript
├─────────────────────────────────────┤
│       @code-framez/react/state      │  ← React + Zustand
│     @code-framez/react/view-host    │  ← React context
├─────────────────────────────────────┤
│  @code-framez/react-material/shell  │  ← React + MUI
│  @code-framez/react-material/pane   │  ← React + MUI
│   @code-framez/react-material/...   │  ← React + MUI
├─────────────────────────────────────┤
│       @code-framez/auth/react       │  ← React context
└─────────────────────────────────────┘
```

This layering allows future Angular or other framework implementations to share the same core types.

### 4. Immutable State with Immer

All state mutations flow through Zustand with the Immer middleware. This means:
- State updates look like direct mutations but produce immutable snapshots
- React components re-render only when their selected state slice changes
- No manual spread operators or deep cloning required
- Time-travel debugging is possible

### 5. Event-Driven Side Effects

The shell emits events for all significant state changes:

| Event | Trigger |
|-------|---------|
| `view-launched` | A new view instance is created in a pane |
| `view-closed` | A view instance is removed |
| `view-activated` | A tab becomes the active tab in a pane |
| `view-moved` | A view is relocated to a different pane |
| `pane-toggled` | A pane's visibility is toggled |
| `pane-activated` | A pane becomes the focused pane |
| `shell-reset` | The shell state is reset to defaults |

External code can subscribe to these events via `onShellEvent()` without coupling to the state store.

### 6. Adapter Pattern for Authentication

Authentication providers are abstracted behind an `AuthAdapter` interface. The platform ships with a `MockAuthAdapter` for development. Production adapters implement the same interface for Auth0, MSAL, Keycloak, etc.

This means:
- Switching identity providers requires changing one adapter, not application code
- Tests can use the mock adapter
- Multiple providers can coexist

### 7. Declarative Configuration

The entire application is configured through a single `ShellConfig` object:

```typescript
const config: ShellConfig = {
  title: 'My App',
  views: [...],          // What components exist
  componentMap: {...},   // How to render them
  theme: myTheme,        // How it looks
  authComponent: <AuthBanner />,  // Auth UI
};
```

No imperative setup, no initialization sequences, no lifecycle hacks.

### 8. Convention over Configuration

Sensible defaults are provided for everything:
- Nav pane: 280px wide, visible by default
- Main pane: fills remaining space, visible
- Search/Right/Bottom: hidden until needed, auto-shown when a view launches
- Dark theme with indigo/pink accent colors
- Tab-based view arrangement in all panes

Override only what you need.
