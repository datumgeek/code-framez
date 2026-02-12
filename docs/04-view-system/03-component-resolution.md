# 04-03 — Component Resolution

**Source:** `libs/react-material/pane/src/lib/pane.tsx`, `libs/react/view-host/src/lib/view-host.tsx`

## Overview

When a pane needs to render a view tab, it must resolve the view's `componentKey` string to an actual React component. This document traces the full resolution path.

---

## Resolution Flow

```
ViewInstance.componentKey (string)
         │
         ▼
useViewComponent(componentKey)         ← view-host hook
         │
         ├── Found in componentMap?
         │      │
         │      Yes ──► Render <Component {...viewComponentProps} />
         │
         └── Not found?
                │
                └──── Render <ViewNotFound componentKey={key} />
```

---

## Step-by-Step

### 1. Pane Iterates View Instances

The `Pane` component reads `usePaneViews(paneType)` to get all `ViewInstance` objects. For each, it renders a tab and a content area.

### 2. Tab Content Resolves Component

Inside content rendering (the `ViewTabContent` internal component):

```tsx
function ViewTabContent({ view }: { view: ViewInstance }) {
  const Component = useViewComponent(view.componentKey);

  if (!Component) {
    return <ViewNotFound componentKey={view.componentKey} />;
  }

  return (
    <Component
      viewId={view.viewId}
      componentKey={view.componentKey}
      componentProps={view.componentProps}
      entityType={view.entityType}
    />
  );
}
```

### 3. useViewComponent Lookup

```typescript
export function useViewComponent(componentKey: ViewComponentKey): ViewComponent | undefined {
  const { getComponent } = useContext(ViewHostContext);
  return getComponent(componentKey);
}
```

This reads from the `ViewHostContext`, which was provided by the `ViewHostProvider` at the top of the component tree.

### 4. getComponent Implementation

```typescript
const getComponent = useCallback(
  (key: ViewComponentKey) => componentMap[key],
  [componentMap]
);
```

A simple object property lookup — O(1) performance.

---

## ViewNotFound Fallback

When a component key doesn't exist in the map:

```tsx
export function ViewNotFound({ componentKey }: { componentKey: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 24,
      color: '#666',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Component Not Found</div>
        <div style={{ fontSize: 13, marginTop: 8, color: '#999' }}>
          No component registered for key: <code>{componentKey}</code>
        </div>
      </div>
    </div>
  );
}
```

This happens when:
- A view registration references a component key not in the `componentMap`
- A typo in the component key
- The component was removed but the registration remains

---

## Registration vs. Resolution

These are two separate concerns:

| Concern | System | Storage | Holds |
|---------|--------|---------|-------|
| **Registration** | Zustand store | `viewComponentRegistry` | Metadata (key, displayText, paneType, entityMenu, etc.) |
| **Resolution** | ViewHostProvider | `componentMap` | Actual React component reference |

Both must agree on the same `componentKey` strings. The demo app wires them together:

```tsx
// Registration metadata → store
const views: ViewComponentRegistration[] = [
  { componentKey: 'user-detail', displayText: 'User Detail', paneType: 'main', ... },
];

// Resolution mapping → ViewHostProvider
const componentMap: ViewComponentMap = {
  'user-detail': UserDetail,
};
```

---

## Debugging Mismatches

If a view tab shows the `ViewNotFound` fallback:

1. Check the view's `componentKey` in the Zustand store
2. Verify the same key exists in the `componentMap` passed to `ViewHostProvider`
3. Ensure the component is imported correctly (not `undefined`)

Using the event system for diagnostics:

```typescript
onShellEvent((event) => {
  if (event.type === 'view-launched') {
    const key = event.payload?.componentKey;
    const map = /* access your componentMap */;
    if (!map[key as string]) {
      console.warn(`View launched with unresolvable key: ${key}`);
    }
  }
});
```
