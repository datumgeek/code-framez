# 02-03 — Shell State Types

**Source:** `libs/core/types/src/lib/types.ts`

## ShellState

```typescript
interface ShellState {
  panes: Record<PaneType, PaneState>;
  viewComponentRegistry: Record<ViewComponentKey, ViewComponentRegistration>;
  activePaneType?: PaneType;
}
```

The top-level state object for the entire shell. This is the shape of the Zustand store.

| Property | Type | Description |
|----------|------|-------------|
| `panes` | `Record<PaneType, PaneState>` | State for all five pane regions |
| `viewComponentRegistry` | `Record<ViewComponentKey, ViewComponentRegistration>` | All registered view component metadata |
| `activePaneType` | `PaneType \| undefined` | The currently focused pane (defaults to `'main'`) |

### Initial State

When the store is created, `ShellState` is initialized as:

```typescript
{
  panes: {
    nav:    { config: { paneType: 'nav',    visible: true,  ... }, viewInstances: [], activeViewId: undefined },
    main:   { config: { paneType: 'main',   visible: true,  ... }, viewInstances: [], activeViewId: undefined },
    search: { config: { paneType: 'search', visible: false, ... }, viewInstances: [], activeViewId: undefined },
    right:  { config: { paneType: 'right',  visible: false, ... }, viewInstances: [], activeViewId: undefined },
    bottom: { config: { paneType: 'bottom', visible: false, ... }, viewInstances: [], activeViewId: undefined },
  },
  viewComponentRegistry: {},
  activePaneType: 'main',
}
```

---

## ShellActions

```typescript
interface ShellActions {
  registerViewComponent(registration: ViewComponentRegistration): void;
  registerViewComponents(registrations: ViewComponentRegistration[]): void;
  launchView(config: ViewLaunchConfig): ViewId;
  closeView(viewId: ViewId): void;
  moveView(viewId: ViewId, targetPane: PaneType): void;
  setActiveView(paneType: PaneType, viewId: ViewId): void;
  togglePane(paneType: PaneType): void;
  setPaneVisible(paneType: PaneType, visible: boolean): void;
  setActivePane(paneType: PaneType): void;
  updateViewState(viewId: ViewId, state: Partial<ViewInstance>): void;
  resetShell(): void;
}
```

All actions available for modifying shell state. These are implemented in the Zustand store.

### Action Reference

#### `registerViewComponent(registration)`

Adds a single view component to the registry. If `launchAtStartup` is `true`, immediately calls `launchView()`.

**Parameters:**
- `registration: ViewComponentRegistration` — The component metadata

**Side effects:**
- Populates `viewComponentRegistry[registration.componentKey]`
- May launch the view if `launchAtStartup` is set

---

#### `registerViewComponents(registrations)`

Batch-registers multiple view components. All registrations are added to the registry first, then startup views are launched.

**Parameters:**
- `registrations: ViewComponentRegistration[]` — Array of component metadata

**Side effects:**
- Populates `viewComponentRegistry` for each registration
- Launches views with `launchAtStartup: true` after all are registered

---

#### `launchView(config): ViewId`

Creates a new `ViewInstance` and adds it to the target pane.

**Parameters:**
- `config: ViewLaunchConfig` — Launch configuration

**Returns:** `ViewId` — The UUID of the newly created view instance

**State changes:**
1. Creates `ViewInstance` with a new UUID
2. Appends to `panes[config.paneType].viewInstances`
3. Sets `panes[config.paneType].activeViewId` to the new ID
4. Sets `panes[config.paneType].config.visible = true` (auto-shows hidden panes)

**Event emitted:** `'view-launched'` with `{ viewId, paneType, componentKey }`

---

#### `closeView(viewId)`

Removes a view instance from its pane.

**Parameters:**
- `viewId: ViewId` — The view to close

**State changes:**
1. Finds the view across all panes
2. Removes it from `viewInstances`
3. If it was `activeViewId`, selects the nearest remaining tab
4. If no views remain, sets `activeViewId = undefined`

**Event emitted:** `'view-closed'` with `{ viewId, paneType }`

---

#### `moveView(viewId, targetPane)`

Relocates a view from one pane to another.

**Parameters:**
- `viewId: ViewId` — The view to move
- `targetPane: PaneType` — The destination pane

**State changes:**
1. Removes from source pane's `viewInstances`
2. Updates source pane's `activeViewId` if needed
3. Appends to target pane's `viewInstances`
4. Sets target pane's `activeViewId` to the moved view
5. Auto-shows target pane if hidden
6. Updates the view's `paneType` property

**Event emitted:** `'view-moved'` with `{ viewId, fromPane, toPane }`

**No-op:** If `viewId` is already in `targetPane`

---

#### `setActiveView(paneType, viewId)`

Switches the active tab in a pane.

**Parameters:**
- `paneType: PaneType` — The pane
- `viewId: ViewId` — The view to activate

**State changes:**
1. Sets `panes[paneType].activeViewId = viewId`
2. Sets `activePaneType = paneType`

**Event emitted:** `'view-activated'` with `{ viewId, paneType }`

**Guard:** Only applies if the view actually exists in the pane.

---

#### `togglePane(paneType)`

Toggles a pane's visibility.

**Parameters:**
- `paneType: PaneType` — The pane to toggle

**State changes:**
- Inverts `panes[paneType].config.visible`

**Event emitted:** `'pane-toggled'` with `{ paneType, visible }`

---

#### `setPaneVisible(paneType, visible)`

Explicitly sets a pane's visibility.

**Parameters:**
- `paneType: PaneType` — The pane
- `visible: boolean` — Show or hide

**Event emitted:** `'pane-toggled'` with `{ paneType, visible }`

---

#### `setActivePane(paneType)`

Sets which pane is considered "focused."

**Parameters:**
- `paneType: PaneType` — The pane to focus

**Event emitted:** `'pane-activated'` with `{ paneType }`

---

#### `updateViewState(viewId, state)`

Partially updates a view instance's properties.

**Parameters:**
- `viewId: ViewId` — The view to update
- `state: Partial<ViewInstance>` — Properties to merge

**Example:**
```typescript
updateViewState(viewId, { viewState: 'loading', displayText: 'Loading...' });
```

---

#### `resetShell()`

Resets the entire shell state to its initial values. Clears all views, resets pane configs, and empties the registry.

**Event emitted:** `'shell-reset'` with `{}`
