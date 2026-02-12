# 10-02 — Creating Views

## Overview

A "view" is a React component that runs inside one of the shell's tabbed panes. This guide shows how to create, register, and use views.

---

## Step 1: Create the Component

Create a new file in your app's views directory:

```tsx
// src/views/my-view.tsx
import type { ViewComponentProps } from '@code-framez/react/view-host';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function MyView({ viewId, componentKey, componentProps }: ViewComponentProps) {
  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Typography variant="h6">My Custom View</Typography>
      <Typography variant="body2" color="text.secondary">
        View ID: {viewId}
      </Typography>
      {componentProps?.message && (
        <Typography>{String(componentProps.message)}</Typography>
      )}
    </Box>
  );
}
```

### Requirements

- Accept `ViewComponentProps` (or a compatible type)
- Fill the available space (`height: '100%'`)
- Handle `componentProps` gracefully (may be undefined)

---

## Step 2: Register the View

Add a registration to your view registrations array:

```typescript
const views: ViewComponentRegistration[] = [
  // ... existing views
  {
    componentKey: 'my-view',
    displayText: 'My View',
    displayIcon: '✨',
    paneType: 'main',
    order: 10,
  },
];
```

### Registration Properties

| Property | Required | Description |
|----------|----------|-------------|
| `componentKey` | Yes | Unique string key |
| `displayText` | Yes | Tab label |
| `paneType` | Yes | Which pane it opens in |
| `displayIcon` | No | Icon for menus/lists |
| `launchAtStartup` | No | Auto-open when shell mounts |
| `order` | No | Sort position in lists |
| `entityMenu` | No | Entity menu configuration |
| `entityTypes` | No | Entity types this view handles |

---

## Step 3: Add to Component Map

```typescript
const componentMap: ViewComponentMap = {
  // ... existing components
  'my-view': MyView,
};
```

The key must match `componentKey` in the registration.

---

## Step 4: Launch the View

### Programmatically

```typescript
import { useShellStore } from '@code-framez/react/state';

function SomeComponent() {
  const launchView = useShellStore((s) => s.launchView);

  return (
    <button onClick={() => launchView({
      componentKey: 'my-view',
      paneType: 'main',
      displayText: 'My View',
      componentProps: { message: 'Hello from launcher!' },
    })}>
      Open My View
    </button>
  );
}
```

### At Startup

Set `launchAtStartup: true` in the registration.

### From an Entity Menu

Add an `entityMenu` config (see [10-03 Entity Actions](03-entity-actions.md)).

---

## Views in Different Panes

| Pane | Use Case | Notes |
|------|----------|-------|
| `nav` | Navigation, tree views, lists | Left sidebar, always visible by default |
| `main` | Primary content, editors, details | Center area, always visible |
| `search` | Search results, filters | Right side, toggled via toolbar |
| `right` | Properties, inspector | Right side, mutually exclusive with search |
| `bottom` | Console, logs, terminal | Below main, toggled automatically |

---

## Multiple Instances

The same component can be opened multiple times with different data:

```typescript
// Open two instances of the same view with different data
launchView({ componentKey: 'my-view', paneType: 'main', displayText: 'View A', componentProps: { id: 1 } });
launchView({ componentKey: 'my-view', paneType: 'main', displayText: 'View B', componentProps: { id: 2 } });
```

Each gets a unique `viewId`. Use `viewId` to scope any local state.
