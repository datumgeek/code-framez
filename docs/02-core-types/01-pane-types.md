# 02-01 — Pane Types

**Source:** `libs/core/types/src/lib/types.ts`

## PaneType

```typescript
type PaneType = 'nav' | 'main' | 'search' | 'right' | 'bottom';
```

A string union of the five named pane regions in the shell. Every view instance, pane state, and layout operation references a `PaneType`.

| Value | Position | Default Visible | Typical Use |
|-------|----------|----------------|-------------|
| `'nav'` | Left sidebar | Yes | Navigation trees, explorer, tool palette |
| `'main'` | Center | Yes | Primary content: dashboards, detail views, editors |
| `'search'` | Right side | No | Search interfaces, filter panels |
| `'right'` | Right side | No | Detail/properties panel |
| `'bottom'` | Bottom strip | No | Logs, output, console, secondary info |

**Note:** `search` and `right` occupy the same physical slot. When `search` is visible, `right` is hidden (and vice versa). This is controlled by the `Shell` component's layout logic.

---

## PaneArrangement

```typescript
type PaneArrangement = 'tabs-top' | 'tabs-bottom' | 'tabs-left' | 'accordion';
```

Controls how a pane arranges its child views.

| Value | Description |
|-------|------------|
| `'tabs-top'` | Horizontal tab bar at the top of the pane (default for all panes) |
| `'tabs-bottom'` | Horizontal tab bar at the bottom |
| `'tabs-left'` | Vertical tab bar on the left side |
| `'accordion'` | Accordion/collapsible sections instead of tabs |

**Current implementation:** Only `'tabs-top'` is fully implemented in the MUI pane component. The other values are defined for future use.

---

## PaneConfig

```typescript
interface PaneConfig {
  paneType: PaneType;
  arrangement: PaneArrangement;
  visible: boolean;
  defaultSize?: string;
  minSize?: number;
  maxSize?: number;
}
```

Configuration for a pane region. Each pane has exactly one `PaneConfig` instance in the shell state.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `paneType` | `PaneType` | Yes | Which pane this config belongs to |
| `arrangement` | `PaneArrangement` | Yes | How child views are arranged |
| `visible` | `boolean` | Yes | Whether the pane is currently visible |
| `defaultSize` | `string` | No | CSS size value (e.g., `'280px'`, `'25%'`) |
| `minSize` | `number` | No | Minimum size in pixels |
| `maxSize` | `number` | No | Maximum size in pixels |

### Default Configurations

| Pane | Arrangement | Visible | Default Size | Min | Max |
|------|-------------|---------|-------------|-----|-----|
| `nav` | `tabs-top` | `true` | `280px` | 200 | 500 |
| `main` | `tabs-top` | `true` | — | — | — |
| `search` | `tabs-top` | `false` | `350px` | 250 | 600 |
| `right` | `tabs-top` | `false` | `300px` | 200 | 600 |
| `bottom` | `tabs-top` | `false` | `250px` | 150 | 500 |

---

## PaneState

```typescript
interface PaneState {
  config: PaneConfig;
  viewInstances: ViewInstance[];
  activeViewId?: ViewId;
}
```

The runtime state of a single pane, combining its configuration with its current views and selection.

| Property | Type | Description |
|----------|------|-------------|
| `config` | `PaneConfig` | The pane's configuration (mutated by `togglePane`, `setPaneVisible`) |
| `viewInstances` | `ViewInstance[]` | Ordered array of views currently in this pane |
| `activeViewId` | `ViewId \| undefined` | The `viewId` of the currently selected (visible) tab |

### Behavior Notes

- When a view is launched, it is appended to `viewInstances` and becomes `activeViewId`
- When the active view is closed, `activeViewId` shifts to the nearest remaining tab
- When `viewInstances` becomes empty, `activeViewId` is `undefined`
- The `Pane` component renders `"No views open"` when `viewInstances` is empty
