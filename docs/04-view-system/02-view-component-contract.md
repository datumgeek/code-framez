# 04-02 — View Component Contract

**Source:** `libs/react/view-host/src/lib/view-host.tsx`

## Overview

Every view rendered inside a Code Framez pane must satisfy the `ViewComponent` type. This document describes the props contract, the component type, and the rules for authoring view components.

---

## ViewComponentProps

```typescript
export interface ViewComponentProps {
  viewId: string;
  componentKey: string;
  componentProps?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
}
```

These props are automatically injected by the `Pane` component when rendering a view tab.

| Prop | Type | Always Present | Description |
|------|------|---------------|-------------|
| `viewId` | `string` | Yes | UUID of this view instance |
| `componentKey` | `string` | Yes | The registration key (e.g., `'user-detail'`) |
| `componentProps` | `Record<string, unknown>` | No | Custom data from `ViewLaunchConfig.componentProps` |
| `entityType` | `string` | No | Entity type when launched from an entity menu |
| `entityId` | `string` | No | Entity ID when launched from an entity menu |

---

## ViewComponent Type

```typescript
export type ViewComponent = React.ComponentType<ViewComponentProps>;
```

Any React component (function or class) that accepts `ViewComponentProps` qualifies.

---

## Authoring a View Component

### Minimal View

```tsx
import type { ViewComponentProps } from '@code-framez/react/view-host';

export function MyView({ viewId, componentKey }: ViewComponentProps) {
  return <div>Hello from {componentKey} (instance {viewId})</div>;
}
```

### Entity-Aware View

```tsx
export function UserDetail({ componentProps, entityType }: ViewComponentProps) {
  const userId = componentProps?.entityId as string;
  const userName = componentProps?.displayText as string;

  return (
    <div>
      <h2>{userName ?? 'Unknown User'}</h2>
      <p>Entity type: {entityType}</p>
      <p>User ID: {userId}</p>
    </div>
  );
}
```

### View with Shell Interaction

```tsx
import { useShellStore } from '@code-framez/react/state';

export function NavExplorer({ viewId }: ViewComponentProps) {
  const registry = useShellStore((s) => s.viewComponentRegistry);
  const launchView = useShellStore((s) => s.launchView);

  return (
    <ul>
      {Object.values(registry)
        .filter((r) => r.paneType === 'main')
        .map((r) => (
          <li key={r.componentKey}>
            <button onClick={() => launchView({
              componentKey: r.componentKey,
              paneType: r.paneType,
              displayText: r.displayText,
            })}>
              {r.displayIcon} {r.displayText}
            </button>
          </li>
        ))}
    </ul>
  );
}
```

---

## Rules for View Components

### 1. Accept ViewComponentProps

The component's props type must be compatible with `ViewComponentProps`. You can extend it but must accept the base props.

### 2. Fill Available Space

View components are rendered inside a flex container that fills the pane tab area. Use `height: 100%` or flexbox to fill the available space:

```tsx
<div style={{ height: '100%', overflow: 'auto', padding: 16 }}>
  {/* content */}
</div>
```

### 3. Don't Manage Your Own Lifecycle

The pane component handles mounting/unmounting. Views should not:
- Manage their own close buttons (the pane tab provides close)
- Try to unmount themselves (call `closeView(viewId)` instead)
- Assume they are the only view (there may be multiple tabs)

### 4. Use componentProps for Data

Pass data to views via `ViewLaunchConfig.componentProps`, not via global state:

```typescript
// Good: data flows through componentProps
launchView({
  componentKey: 'user-detail',
  paneType: 'main',
  displayText: 'Alice Chen',
  componentProps: { userId: '42', name: 'Alice Chen' },
});

// Avoid: setting global state that the view reads
```

### 5. Keep Components Stateless Where Possible

Views can use local state, but prefer reading from the shell store and `componentProps`. This makes views easier to launch, close, and re-launch.

---

## Multiple Instances

The same component can be open in multiple tabs simultaneously. Each receives a unique `viewId`:

```
Pane: main
├── Tab 1: UserDetail (viewId: "abc-111", componentProps: { userId: "1" })
├── Tab 2: UserDetail (viewId: "abc-222", componentProps: { userId: "2" })
└── Tab 3: AnalyticsView (viewId: "abc-333")
```

Components should not assume they are singletons. Use `viewId` to scope any local state.
