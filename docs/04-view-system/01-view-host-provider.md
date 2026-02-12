# 04-01 — ViewHostProvider

**Source:** `libs/react/view-host/src/lib/view-host.tsx`

## Overview

The `ViewHostProvider` is a React context provider that supplies a **component map** — a lookup from `ViewComponentKey` strings to actual React component implementations. It is the bridge between the shell's abstract registry and the concrete React components that render in tabs.

---

## Why a Separate Provider?

The Zustand store holds **metadata** (registrations with component keys, display text, pane assignments) but not the actual React components. This separation allows:

1. **Framework agnosticism in types**: The `@code-framez/core/types` package has zero React dependency
2. **Lazy loading**: Components can be dynamically imported and added to the map
3. **Testing**: Tests can provide mock component maps without touching the store
4. **Multiple shells**: Different parts of the app could use different component maps

---

## Architecture

```
Application
│
├── ViewHostProvider  ← wraps the shell
│   │  componentMap: { 'user-detail': UserDetail, 'analytics': AnalyticsView, ... }
│   │
│   └── Shell
│       ├── Pane (nav)
│       │   └── ViewTabContent
│       │       └── useViewComponent('nav-explorer')  ← looks up in context
│       │           └── renders <NavExplorer />
│       ├── Pane (main)
│       │   └── ViewTabContent
│       │       └── useViewComponent('user-detail')
│       │           └── renders <UserDetail />
│       └── ...
```

---

## API

### ViewHostProvider

```typescript
export interface ViewHostProviderProps {
  componentMap: ViewComponentMap;
  children: React.ReactNode;
}

export function ViewHostProvider({ componentMap, children }: ViewHostProviderProps): JSX.Element;
```

| Prop | Type | Description |
|------|------|-------------|
| `componentMap` | `ViewComponentMap` | Map from component keys to React components |
| `children` | `React.ReactNode` | The shell and its subtree |

#### Usage

```tsx
import { ViewHostProvider } from '@code-framez/react/view-host';
import { Shell } from '@code-framez/react-material/shell';

const componentMap = {
  'welcome': WelcomeDashboard,
  'user-detail': UserDetail,
  'analytics': AnalyticsView,
};

function App() {
  return (
    <ViewHostProvider componentMap={componentMap}>
      <Shell config={shellConfig} />
    </ViewHostProvider>
  );
}
```

### ViewComponentMap

```typescript
export type ViewComponentMap = Record<ViewComponentKey, ViewComponent>;
```

A plain object mapping string keys to React component types.

---

## Internal Context

```typescript
interface ViewHostContextValue {
  componentMap: ViewComponentMap;
  getComponent: (key: ViewComponentKey) => ViewComponent | undefined;
}
```

The context stores:
- `componentMap` — the raw map for direct access
- `getComponent` — a memoized lookup function (via `useCallback`)

The context value is memoized with `useMemo` to prevent unnecessary re-renders.

---

## Hooks

### useViewHost

```typescript
export function useViewHost(): ViewHostContextValue;
```

Access the full view host context. Returns `{ componentMap, getComponent }`.

### useViewComponent

```typescript
export function useViewComponent(componentKey: ViewComponentKey): ViewComponent | undefined;
```

Look up a single component by key. Returns `undefined` if the key is not in the map.

---

## Performance

- `getComponent` is wrapped in `useCallback` with `[componentMap]` dependency — it only recreates when the map reference changes
- The context value is wrapped in `useMemo` with `[componentMap, getComponent]` — avoids re-rendering all context consumers on unrelated parent re-renders
- In practice, the component map is created once at application startup and its reference remains stable
