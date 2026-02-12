# 03-01 — Store Architecture

**Source:** `libs/react/state/src/lib/shell-store.ts`

## Overview

Code Framez centralizes its runtime state in a single **Zustand** store enhanced with the **Immer** middleware. This gives the platform immutable-by-default state updates with a mutable-looking API.

---

## Technology Choice

| Library | Role | Why |
|---------|------|-----|
| **Zustand 5** | State container | Tiny (~1 KB), no provider boilerplate, first-class React hooks, excellent TypeScript support |
| **Immer 11** | Immutable update helper | Write "mutating" code inside producers; Immer produces structural-sharing immutable copies |
| **uuid 13** | ID generation | RFC 4122 v4 UUIDs for view instance IDs |

### Why Not Redux / Context / Jotai?

- **Redux**: Too much boilerplate for this use case. Zustand provides the same single-store model with 90 % less ceremony.
- **Context**: Local state scattering makes it hard to build a coherent shell with pane–view–registry relationships.
- **Jotai/Recoil**: Atom-based patterns fragment state across many atoms. The shell benefits from a unified state tree.

---

## Store Shape

The store type is the intersection of state and actions:

```typescript
export interface ShellStore extends ShellState, ShellActions {}
```

### State Tree

```
ShellStore
├── panes: Record<PaneType, PaneState>
│   ├── nav
│   │   ├── config: PaneConfig
│   │   ├── viewInstances: ViewInstance[]
│   │   └── activeViewId: ViewId | undefined
│   ├── main
│   │   └── ...
│   ├── search
│   │   └── ...
│   ├── right
│   │   └── ...
│   └── bottom
│       └── ...
├── viewComponentRegistry: Record<ViewComponentKey, ViewComponentRegistration>
└── activePaneType: PaneType
```

### State Sections

| Section | Type | Purpose |
|---------|------|---------|
| `panes` | `Record<PaneType, PaneState>` | Layout model — config, open views, and active tab per pane |
| `viewComponentRegistry` | `Record<ViewComponentKey, ViewComponentRegistration>` | Global registry of all registered view components |
| `activePaneType` | `PaneType` | Currently focused pane |

---

## Middleware Stack

```typescript
export const useShellStore = create<ShellStore>()(
  immer((set, get) => ({
    ...createInitialShellState(),
    // actions...
  }))
);
```

The middleware wraps in this order:

```
create  →  immer  →  core store
```

### What Immer Provides

Inside `set()` calls, the `state` parameter is a **draft proxy**. Mutations to the draft are recorded and replayed as immutable structural updates:

```typescript
// This looks like mutation but produces an immutable update
set((state) => {
  state.panes.nav.config.visible = true;
});
```

Behind the scenes, Immer:

1. Creates a proxy around the current state
2. Records all property accesses and mutations
3. Produces a new state object sharing unchanged subtrees (structural sharing)
4. React sees a new reference → re-renders relevant selectors

---

## Store Creation Flow

```
Application start
       │
       ▼
createInitialShellState()
       │
       ├── For each PaneType (nav, main, search, right, bottom):
       │     createDefaultPaneState(defaultPaneConfigs[paneType])
       │
       ▼
 create<ShellStore>()(immer(...))
       │
       ▼
 Store is ready, exported as useShellStore
```

---

## Accessing the Store

### In React Components (recommended)

```typescript
import { useShellStore, usePaneState } from '@code-framez/react/state';

// Direct selector
const activePaneType = useShellStore((s) => s.activePaneType);

// Convenience hook
const navPane = usePaneState('nav');
```

### Outside React (imperative)

```typescript
// Get current state snapshot
const state = useShellStore.getState();

// Call an action
useShellStore.getState().launchView({
  componentKey: 'user-detail',
  paneType: 'main',
  displayText: 'User Detail',
});

// Subscribe to changes
const unsubscribe = useShellStore.subscribe((state) => {
  console.log('State changed:', state.activePaneType);
});
```

---

## Immutability Guarantees

All state updates go through Immer drafts. This means:

1. **No accidental mutation**: Even if consumer code tries to mutate state obtained from a selector, it won't affect the store (the selector returns the finalized immutable value, not the draft).

2. **Structural sharing**: Unchanged parts of the state tree retain referential identity, so `React.memo` and `useMemo` work correctly.

3. **Time-travel debugging**: Because each state transition produces a new object, tools like Redux DevTools (via Zustand's devtools middleware) can replay state changes.

---

## Package Exports

```typescript
// libs/react/state/src/index.ts
export {
  useShellStore,
  usePaneState,
  useActiveView,
  usePaneViews,
  useViewInstance,
  useViewComponentRegistry,
  useViewComponentRegistration,
  useEntityMenuItems,
  onShellEvent,
} from './lib/shell-store';
export type { ShellStore } from './lib/shell-store';
```
