# 01-04 — Data Flow

## Overview

Code Framez follows a unidirectional data flow pattern. All state lives in the Zustand shell store. UI components read from selectors and dispatch actions to modify state. Events are emitted as side effects.

## Data Flow Diagram

```
   ┌──────────────┐
   │  ShellConfig  │  (view registrations, component map, theme)
   └──────┬───────┘
          │  provided at app startup
          ▼
   ┌──────────────┐         ┌──────────────────┐
   │    Shell      │────────▶│  ViewHostProvider │
   │  Component    │         │  (component map)  │
   └──────┬───────┘         └──────────────────┘
          │  registers views
          ▼
   ┌──────────────────────────┐
   │     Zustand Shell Store   │
   │  ┌─────────────────────┐ │
   │  │ viewComponentRegistry│ │  ← registered component metadata
   │  ├─────────────────────┤ │
   │  │ panes: {            │ │
   │  │   nav: PaneState    │ │  ← views, active tab, visibility
   │  │   main: PaneState   │ │
   │  │   search: PaneState │ │
   │  │   right: PaneState  │ │
   │  │   bottom: PaneState │ │
   │  │ }                   │ │
   │  ├─────────────────────┤ │
   │  │ activePaneType      │ │  ← which pane is focused
   │  └─────────────────────┘ │
   └──────────┬───────────────┘
              │
     ┌────────┼────────┐
     │        │        │
     ▼        ▼        ▼
  Selectors  Actions  Events
```

## Flow: Registering Views at Startup

1. `App` component creates `ShellConfig` with `views: ViewComponentRegistration[]`
2. `Shell` component renders `ViewHostProvider` with `componentMap`
3. `ShellLayout` calls `registerViewComponents(views)` in a `useEffect`
4. The store populates `viewComponentRegistry`
5. Views with `launchAtStartup: true` are automatically launched via `launchView()`
6. Launched views appear as `ViewInstance` entries in their pane's `viewInstances` array
7. The `Pane` component reads `viewInstances` and renders tabs

## Flow: Dynamic View Launch

1. User clicks a button in a view component (e.g., "Open User Detail")
2. View component calls `launchView()` from `useShellStore`
3. Store creates a `ViewInstance` with a UUID and pushes it into the target pane
4. Store sets `activeViewId` to the new view and auto-shows the pane if hidden
5. Store emits `'view-launched'` event
6. `Pane` component re-renders with the new tab
7. `ViewTabContent` resolves the `componentKey` to a React component via `useViewComponent()`
8. Component renders with `ViewComponentProps`

## Flow: Closing a View

1. User clicks the ✕ button on a tab
2. `Pane` calls `closeView(viewId)`
3. Store removes the `ViewInstance` from its pane's `viewInstances` array
4. Store updates `activeViewId` to the nearest remaining tab
5. Store emits `'view-closed'` event
6. `Pane` re-renders without the closed tab

## Flow: Tab Switching

1. User clicks a different tab in a pane
2. MUI `Tabs` fires `onChange` with the new index
3. `Pane` calls `setActiveView(paneType, viewId)`
4. Store updates `activeViewId` on the pane and `activePaneType` on the shell
5. Store emits `'view-activated'` event
6. `Pane` re-renders; the new tab's content becomes visible (CSS `display: flex` vs `display: none`)

## Flow: Entity Menu Interaction

1. User right-clicks (or clicks an action button) on an entity row
2. Component calls `useEntityMenu().open(event, entityRef)`
3. `EntityMenu` reads `useEntityMenuItems(entity.entityType)` from the store
4. Store scans `viewComponentRegistry` for registrations with matching `entityMenu.entityTypes`
5. Menu items are sorted by `order` and rendered
6. User selects a menu item
7. `EntityMenu` calls `launchView()` with the entity data as `componentProps`
8. A new view opens in `main` pane with the entity's data

## Flow: Authentication

1. `AuthProvider` initializes the `AuthAdapter` on mount
2. Adapter subscribes to state changes via `onStateChange()`
3. Adapter calls `initialize()` (e.g., checks for existing session)
4. Auth state flows to `AuthContext` via React state
5. `AuthBanner` reads from `useAuth()` and renders Sign In / user avatar
6. User clicks Sign In → `adapter.login()` → state changes to `'authenticated'`
7. All components using `useAuth()`, `useIsAuthenticated()`, etc. re-render

## State Update Mechanism

All state mutations use **Zustand + Immer**:

```typescript
set((state) => {
  // Looks like a direct mutation, but Immer produces an immutable update
  state.panes[paneType].viewInstances.push(newView);
  state.panes[paneType].activeViewId = newView.viewId;
});
```

React components subscribe to specific slices via selector hooks:

```typescript
// Only re-renders when nav pane changes
const navState = usePaneState('nav');

// Only re-renders when this specific view changes
const view = useViewInstance(viewId);
```

## Event Subscription (External)

Code outside of React components can subscribe to state-change events:

```typescript
import { onShellEvent } from '@code-framez/react/state';

const unsubscribe = onShellEvent((event) => {
  console.log(event.type, event.payload);
  // e.g., send analytics, trigger side effects
});
```

Events are emitted synchronously after each state mutation. Listeners are wrapped in try/catch to prevent one failing listener from affecting others.
