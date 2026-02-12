# 05-02 — Pane Component

**Source:** `libs/react-material/pane/src/lib/pane.tsx`

## Overview

The `Pane` component renders a tabbed container for a specific pane region. It manages a scrollable tab bar, tab switching, close buttons, and delegates content rendering to resolved view components.

---

## Props

```typescript
export interface PaneProps {
  paneType: PaneType;
  className?: string;
  sx?: Record<string, unknown>;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `paneType` | `PaneType` | Which pane region to render (`nav`, `main`, `search`, `right`, `bottom`) |
| `className` | `string` | Optional CSS class |
| `sx` | `Record<string, unknown>` | MUI sx prop for additional styling |

---

## Component Structure

```
<Pane paneType="main">
  ├── Visibility check  → returns null if pane is hidden
  ├── Empty state       → "No views open" if no view instances
  └── Content
      ├── Tab Bar (MUI Tabs, scrollable)
      │   ├── Tab 1: [displayText] [×]
      │   ├── Tab 2: [displayText] [×]
      │   └── Tab N: [displayText] [×]
      └── View Content (flex container)
          ├── ViewTabContent (view 1, display: 'flex' if active, 'none' if not)
          ├── ViewTabContent (view 2, ...)
          └── ViewTabContent (view N, ...)
```

---

## Rendering Strategy: All Views Mounted

All views in a pane are always mounted in the DOM. Only the active view is displayed:

```tsx
<Box sx={{ display: isActive ? 'flex' : 'none', ... }}>
  <Component ... />
</Box>
```

**Why?** Hiding with CSS instead of unmounting preserves component state (scroll position, form inputs, selections) when switching between tabs.

---

## Tab Bar

Uses MUI `Tabs` component with:
- `variant="scrollable"` — handles overflow with horizontal scrolling
- `scrollButtons="auto"` — shows scroll arrows only when tabs overflow
- Compact styling: `minHeight: 36px`, `fontSize: 0.8rem`, `textTransform: 'none'`

Each tab label includes:
- Display text from `ViewInstance.displayText`
- A close `IconButton` with `CloseIcon` (14px)

### Close Button

```tsx
<IconButton
  size="small"
  onClick={(e) => handleClose(view.viewId, e)}
  sx={{ p: 0.25, ml: 0.5, fontSize: '0.75rem', opacity: 0.6, '&:hover': { opacity: 1 } }}
>
  <CloseIcon sx={{ fontSize: 14 }} />
</IconButton>
```

- `event.stopPropagation()` prevents the close click from also triggering tab selection
- Subtle opacity (0.6) with hover reveal (1.0) for clean appearance

---

## Tab Switching

```typescript
const activeTabIndex = useMemo(() => {
  if (!activeViewId || views.length === 0) return 0;
  const idx = views.findIndex((v) => v.viewId === activeViewId);
  return idx >= 0 ? idx : 0;
}, [activeViewId, views]);

const handleTabChange = useCallback(
  (_: React.SyntheticEvent, newValue: number) => {
    const view = views[newValue];
    if (view) {
      setActiveView(paneType, view.viewId);
      setActivePane(paneType);
    }
  },
  [views, paneType, setActiveView, setActivePane]
);
```

- Tab index is derived from `activeViewId` position in the `views` array
- Falls back to index 0 if the active view is not found
- Switching a tab also sets the pane as the globally active pane

---

## Empty State

When a pane has no views:

```tsx
<Box sx={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: 'text.disabled',
}}>
  <Typography variant="body2" color="text.disabled">
    No views open
  </Typography>
</Box>
```

---

## ViewTabContent

Internal component that resolves and renders a single view:

```tsx
function ViewTabContent({ view, isActive }: ViewTabContentProps) {
  const Component = useViewComponent(view.componentKey);

  if (!Component) {
    return <ViewNotFound componentKey={view.componentKey} />;
  }

  return (
    <Box sx={{ display: isActive ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'auto', height: '100%' }}>
      <Component
        viewId={view.viewId}
        componentKey={view.componentKey}
        componentProps={view.componentProps}
        entityType={view.entityType}
        entityId={view.entityId}
      />
    </Box>
  );
}
```

Props passed to the resolved component:
- `viewId` — the view instance UUID
- `componentKey` — the registration key
- `componentProps` — custom data from the launch config
- `entityType` — entity type (if launched from entity menu)
- `entityId` — entity ID (if launched from entity menu)

---

## Store Interactions

| Hook / Selector | Purpose |
|-----------------|---------|
| `usePaneState(paneType)` | Pane config and active view ID |
| `usePaneViews(paneType)` | Array of open view instances |
| `useShellStore(s => s.setActiveView)` | Switch active tab |
| `useShellStore(s => s.closeView)` | Close a tab |
| `useShellStore(s => s.setActivePane)` | Set global focus to this pane |
