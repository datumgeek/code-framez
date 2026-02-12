# 03-05 — Default Configuration

**Source:** `libs/react/state/src/lib/shell-store.ts`

## Overview

When the store initializes, it creates a default pane configuration for all five pane types. These defaults control initial visibility, sizing, and arrangement.

---

## Default Pane Configs

```typescript
const defaultPaneConfigs: Record<PaneType, PaneConfig> = {
  nav:    { paneType: 'nav',    arrangement: 'tabs-top', visible: true,  defaultSize: '280px', minSize: 200, maxSize: 500 },
  main:   { paneType: 'main',   arrangement: 'tabs-top', visible: true  },
  search: { paneType: 'search', arrangement: 'tabs-top', visible: false, defaultSize: '350px', minSize: 250, maxSize: 600 },
  right:  { paneType: 'right',  arrangement: 'tabs-top', visible: false, defaultSize: '300px', minSize: 200, maxSize: 600 },
  bottom: { paneType: 'bottom', arrangement: 'tabs-top', visible: false, defaultSize: '250px', minSize: 150, maxSize: 500 },
};
```

### Summary Table

| Pane | Visible at Start | Default Size | Min Size | Max Size | Arrangement |
|------|-----------------|-------------|----------|----------|-------------|
| `nav` | Yes | 280px | 200px | 500px | tabs-top |
| `main` | Yes | — (flex fill) | — | — | tabs-top |
| `search` | No | 350px | 250px | 600px | tabs-top |
| `right` | No | 300px | 200px | 600px | tabs-top |
| `bottom` | No | 250px | 150px | 500px | tabs-top |

### Key Observations

- **`main`** has no size constraints because it fills the remaining space via CSS `flex: 1`.
- **Side panels** (`nav`, `search`, `right`) use fixed widths as their `defaultSize`.
- **`bottom`** uses a fixed height.
- All panes default to `tabs-top` arrangement.
- Only `nav` and `main` are visible at startup. Other panes become visible when a view is launched into them or when toggled manually.

---

## Initial State Factory

```typescript
function createDefaultPaneState(config: PaneConfig): PaneState {
  return {
    config,
    viewInstances: [],
    activeViewId: undefined,
  };
}

function createInitialShellState(): ShellState {
  const panes = {} as Record<PaneType, PaneState>;
  for (const [key, config] of Object.entries(defaultPaneConfigs)) {
    panes[key as PaneType] = createDefaultPaneState(config);
  }
  return {
    panes,
    viewComponentRegistry: {},
    activePaneType: 'main',
  };
}
```

### Factory Flow

```
createInitialShellState()
├── nav    → { config: {...}, viewInstances: [], activeViewId: undefined }
├── main   → { config: {...}, viewInstances: [], activeViewId: undefined }
├── search → { config: {...}, viewInstances: [], activeViewId: undefined }
├── right  → { config: {...}, viewInstances: [], activeViewId: undefined }
├── bottom → { config: {...}, viewInstances: [], activeViewId: undefined }
├── viewComponentRegistry: {}
└── activePaneType: 'main'
```

### Initial State Properties

| Property | Initial Value | Notes |
|----------|--------------|-------|
| `panes` | 5 pane states | One per `PaneType` |
| `viewComponentRegistry` | `{}` (empty) | Populated by `registerViewComponent(s)` |
| `activePaneType` | `'main'` | Main pane has initial focus |

---

## resetShell() and State Factory

The `resetShell()` action reuses the same factory:

```typescript
resetShell(): void {
  set(createInitialShellState());
  emitEvent('shell-reset', {});
}
```

This ensures a reset returns to the **exact same initial state** the application started with — no leftover view instances, no stale registry entries, and all pane configs returned to defaults.

---

## Customizing Defaults

Currently, default configurations are hardcoded in the store module. To customize defaults per application, two approaches are available:

### 1. Override After Initialization

```typescript
const store = useShellStore.getState();
store.setPaneVisible('nav', false);  // Start with nav hidden
```

### 2. Fork the Store (Advanced)

Copy the store file and modify `defaultPaneConfigs` directly. This is acceptable for major layout changes.

### Future Enhancement

A planned enhancement is to accept a `ShellConfig.paneDefaults` option that would be merged with the hardcoded defaults during store creation.
