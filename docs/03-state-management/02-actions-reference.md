# 03-02 — Actions Reference

**Source:** `libs/react/state/src/lib/shell-store.ts`

## Overview

All mutations to the shell state flow through store actions. Each action uses Immer's draft proxy for immutable updates and may emit events to the event bus.

---

## registerViewComponent

```typescript
registerViewComponent(registration: ViewComponentRegistration): void
```

Register a single view component in the global registry.

**Behaviour:**

1. Adds the registration to `viewComponentRegistry` keyed by `registration.componentKey`
2. If `registration.launchAtStartup` is `true`, immediately calls `launchView()` with the registration's parameters

**Events emitted:** None directly (but `launchView` may emit `view-launched` for startup views)

**Example:**

```typescript
store.registerViewComponent({
  componentKey: 'analytics',
  displayText: 'Analytics',
  displayIcon: '📊',
  paneType: 'main',
});
```

---

## registerViewComponents

```typescript
registerViewComponents(registrations: ViewComponentRegistration[]): void
```

Register multiple view components in a single call.

**Behaviour:**

1. Batch-adds all registrations to `viewComponentRegistry` in a single `set()` call
2. After all registrations are committed, iterates registrations and calls `launchView()` for any with `launchAtStartup: true`

**Why batch first, then launch?** Startup views may depend on other registered components (e.g., a navigation view may query the registry to list available views). Registering all first ensures the registry is complete before any startup views read it.

---

## launchView

```typescript
launchView(config: ViewLaunchConfig): ViewId
```

Create a new view instance and add it to the specified pane.

**Parameters:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `componentKey` | `ViewComponentKey` | Yes | Which component to render |
| `paneType` | `PaneType` | Yes | Target pane |
| `displayText` | `string` | Yes | Tab label |
| `displayIcon` | `string` | No | Tab icon/emoji |
| `componentProps` | `Record<string, unknown>` | No | Props passed to the rendered component |
| `entityType` | `string` | No | Associates the view with an entity type |

**Behaviour:**

1. Generates a UUID v4 as `viewId`
2. Creates a `ViewInstance` with `launchState: 'dynamic'`, `viewState: 'active'`, `createdAt: Date.now()`
3. Pushes the instance into `panes[config.paneType].viewInstances`
4. Sets the new view as the pane's `activeViewId`
5. If the target pane is hidden (`visible: false`), auto-shows it
6. Emits `view-launched` event with `{ viewId, paneType, componentKey }`
7. Returns the generated `viewId`

**Returns:** `ViewId` (UUID string)

---

## closeView

```typescript
closeView(viewId: ViewId): void
```

Remove a view instance from its pane.

**Behaviour:**

1. Searches all panes for a `ViewInstance` with the given `viewId`
2. Removes it from the `viewInstances` array via `splice`
3. If the closed view was the active view:
   - If other views remain, activates the nearest tab (`Math.min(idx, length - 1)`)
   - If no views remain, sets `activeViewId` to `undefined`
4. Emits `view-closed` event with `{ viewId, paneType }`
5. Breaks out of the pane search loop after the first match

**Edge Case:** If `viewId` doesn't exist in any pane, the action is a no-op.

---

## moveView

```typescript
moveView(viewId: ViewId, targetPane: PaneType): void
```

Move a view from its current pane to a different pane.

**Behaviour:**

1. Finds the view in its current pane
2. If already in the target pane, returns immediately (no-op)
3. Removes the view from the source pane via `splice`
4. Updates the source pane's `activeViewId` (falls back to first remaining view)
5. Updates the view's `paneType` to the target
6. Pushes the view into the target pane's `viewInstances`
7. Sets it as the target pane's `activeViewId`
8. Auto-shows the target pane if hidden
9. Emits `view-moved` event with `{ viewId, fromPane, toPane }`

---

## setActiveView

```typescript
setActiveView(paneType: PaneType, viewId: ViewId): void
```

Switch the active tab within a pane.

**Behaviour:**

1. Verifies the `viewId` exists in the specified pane
2. Sets `pane.activeViewId = viewId`
3. Updates `state.activePaneType` to the given `paneType`
4. Emits `view-activated` event with `{ viewId, paneType }`

**Guard:** If the `viewId` doesn't exist in the pane, the action is a no-op.

---

## togglePane

```typescript
togglePane(paneType: PaneType): void
```

Toggle a pane's visibility.

**Behaviour:**

1. Flips `pane.config.visible` to its boolean complement
2. Emits `pane-toggled` event with `{ paneType, visible }` (the new state)

---

## setPaneVisible

```typescript
setPaneVisible(paneType: PaneType, visible: boolean): void
```

Explicitly set a pane's visibility.

**Behaviour:**

1. Sets `pane.config.visible = visible`
2. Emits `pane-toggled` event with `{ paneType, visible }`

**Use case:** Useful when you want to ensure a pane is visible without risk of toggling it closed.

---

## setActivePane

```typescript
setActivePane(paneType: PaneType): void
```

Set the globally active pane (focus indicator).

**Behaviour:**

1. Sets `state.activePaneType = paneType`
2. Emits `pane-activated` event with `{ paneType }`

---

## updateViewState

```typescript
updateViewState(viewId: ViewId, updates: Partial<ViewInstance>): void
```

Merge partial updates into an existing view instance.

**Behaviour:**

1. Finds the view across all panes
2. Uses `Object.assign(view, updates)` to merge changes
3. No event is emitted (this is a low-level update)

**Example:**

```typescript
store.updateViewState(viewId, {
  displayText: 'User Detail — Alice',
  componentProps: { ...existingProps, lastRefreshed: Date.now() },
});
```

---

## resetShell

```typescript
resetShell(): void
```

Reset the entire shell to its initial state.

**Behaviour:**

1. Replaces the entire state tree with `createInitialShellState()`
2. Clears all panes, view instances, and registry entries
3. Emits `shell-reset` event

**Use case:** Rarely used directly. Useful for development resets, logout cleanup, or testing.

---

## Event Summary

| Action | Event(s) Emitted |
|--------|------------------|
| `registerViewComponent` | via `launchView` if `launchAtStartup` |
| `registerViewComponents` | via `launchView` if `launchAtStartup` |
| `launchView` | `view-launched` |
| `closeView` | `view-closed` |
| `moveView` | `view-moved` |
| `setActiveView` | `view-activated` |
| `togglePane` | `pane-toggled` |
| `setPaneVisible` | `pane-toggled` |
| `setActivePane` | `pane-activated` |
| `updateViewState` | — (none) |
| `resetShell` | `shell-reset` |
