# 03-03 — Selectors & Hooks

**Source:** `libs/react/state/src/lib/shell-store.ts`

## Overview

Selectors are thin, memoized extractions from the Zustand store. Each selector is exported as a custom hook that components can call to subscribe to specific slices of state. Zustand automatically re-renders only the components whose selected slice has changed.

---

## usePaneState

```typescript
export const usePaneState = (paneType: PaneType) =>
  useShellStore((state) => state.panes[paneType]);
```

**Returns:** `PaneState` — the full pane state for the given pane type.

**Re-renders when:** Any property of the pane changes (config, viewInstances, activeViewId).

**Example:**

```typescript
const navPane = usePaneState('nav');
// navPane.config.visible, navPane.viewInstances, navPane.activeViewId
```

---

## useActiveView

```typescript
export const useActiveView = (paneType: PaneType) =>
  useShellStore((state) => {
    const pane = state.panes[paneType];
    if (!pane?.activeViewId) return undefined;
    return pane.viewInstances.find((v) => v.viewId === pane.activeViewId);
  });
```

**Returns:** `ViewInstance | undefined` — the currently active view in the specified pane.

**Re-renders when:** The active view changes or the active view's properties are updated.

**Example:**

```typescript
const activeMainView = useActiveView('main');
if (activeMainView) {
  console.log('Active tab:', activeMainView.displayText);
}
```

---

## usePaneViews

```typescript
export const usePaneViews = (paneType: PaneType) =>
  useShellStore((state) => state.panes[paneType]?.viewInstances ?? []);
```

**Returns:** `ViewInstance[]` — all view instances open in the pane.

**Re-renders when:** Views are added, removed, or modified in the pane.

**Example:**

```typescript
const mainViews = usePaneViews('main');
return (
  <span>{mainViews.length} tab(s) open</span>
);
```

---

## useViewInstance

```typescript
export const useViewInstance = (viewId: ViewId) =>
  useShellStore((state) => {
    for (const pane of Object.values(state.panes)) {
      const view = pane.viewInstances.find((v) => v.viewId === viewId);
      if (view) return view;
    }
    return undefined;
  });
```

**Returns:** `ViewInstance | undefined` — a specific view by its UUID, searching across all panes.

**Re-renders when:** The view's properties change or the view is closed.

**Example:**

```typescript
const view = useViewInstance('abc-123');
// view?.displayText, view?.componentProps, etc.
```

---

## useViewComponentRegistry

```typescript
export const useViewComponentRegistry = () =>
  useShellStore((state) => state.viewComponentRegistry);
```

**Returns:** `Record<ViewComponentKey, ViewComponentRegistration>` — the full component registry.

**Re-renders when:** Any registration is added or modified.

**Example:**

```typescript
const registry = useViewComponentRegistry();
const availableViews = Object.values(registry);
```

---

## useViewComponentRegistration

```typescript
export const useViewComponentRegistration = (componentKey: string) =>
  useShellStore((state) => state.viewComponentRegistry[componentKey]);
```

**Returns:** `ViewComponentRegistration | undefined` — a specific registration by component key.

**Re-renders when:** That specific registration changes.

**Example:**

```typescript
const userDetailReg = useViewComponentRegistration('user-detail');
// userDetailReg?.entityMenu?.entityTypes → ['user']
```

---

## useEntityMenuItems

```typescript
export const useEntityMenuItems = (entityType: string) =>
  useShellStore((state) => {
    const items: Array<{
      componentKey: string;
      menuText: string;
      menuIcon?: string;
      order: number;
    }> = [];
    for (const reg of Object.values(state.viewComponentRegistry)) {
      if (reg.entityMenu && reg.entityMenu.entityTypes.includes(entityType)) {
        items.push({
          componentKey: reg.componentKey,
          menuText: reg.entityMenu.menuText,
          menuIcon: reg.entityMenu.menuIcon,
          order: reg.entityMenu.order ?? 100,
        });
      }
    }
    return items.sort((a, b) => a.order - b.order);
  });
```

**Returns:** `EntityMenuItem[]` — sorted menu items for a given entity type.

**Behaviour:**

1. Iterates all registrations in `viewComponentRegistry`
2. Filters those where `entityMenu.entityTypes` includes the given `entityType`
3. Maps each match to a `{ componentKey, menuText, menuIcon, order }` object
4. Default order is `100` when not specified
5. Sorts ascending by `order`

**Re-renders when:** The registry changes (registrations added/removed).

**Example:**

```typescript
const userMenuItems = useEntityMenuItems('user');
// [
//   { componentKey: 'user-detail', menuText: 'View User Detail', order: 1 },
//   { componentKey: 'user-activity', menuText: 'View Activity', order: 2 },
// ]
```

---

## Custom Selectors

You can create ad-hoc selectors by calling `useShellStore` directly:

```typescript
// Count total open views across all panes
const totalViews = useShellStore((state) =>
  Object.values(state.panes).reduce(
    (sum, pane) => sum + pane.viewInstances.length,
    0
  )
);
```

### Performance Tips

1. **Keep selectors narrow**: Select only the data you need to minimize re-renders.
2. **Avoid new objects**: Creating new objects/arrays in selectors causes re-renders every time. Use `shallow` equality if needed:

   ```typescript
   import { shallow } from 'zustand/shallow';

   const { visible, activeViewId } = useShellStore(
     (state) => ({
       visible: state.panes.nav.config.visible,
       activeViewId: state.panes.nav.activeViewId,
     }),
     shallow
   );
   ```

3. **Use provided hooks**: The pre-built selectors (`usePaneState`, `useActiveView`, etc.) are designed for the most common access patterns.
