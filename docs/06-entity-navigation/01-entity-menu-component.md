# 06-01 — Entity Menu Component

**Source:** `libs/react-material/entity-menu/src/lib/entity-menu.tsx`

## Overview

The `EntityMenu` is a MUI `Menu` that displays all available actions for a given entity. It dynamically discovers actions by querying the view component registry for registrations that declare an `entityMenu` config matching the entity's type.

---

## Props

```typescript
export interface EntityMenuProps {
  entity: EntityRef;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `entity` | `EntityRef` | The entity to show actions for |
| `anchorEl` | `HTMLElement \| null` | DOM element the menu is anchored to |
| `open` | `boolean` | Whether the menu is visible |
| `onClose` | `() => void` | Callback when the menu should close |

---

## Rendering

### With Menu Items

```
┌──────────────────────┐
│  Alice Chen          │  ← disabled header (displayText)
│──────────────────────│
│  👤 View User Detail │  ← clickable menu item
│  📊 View Activity    │
│  🔐 Edit Permissions │
└──────────────────────┘
```

The menu header shows `entity.displayText` or falls back to `entity.entityId`. A `Divider` separates the header from the action items.

### With No Items

```
┌──────────────────────┐
│  No actions available│
└──────────────────────┘
```

When no registrations match the entity type, a single disabled item is shown.

---

## Item Click Handler

```typescript
const handleItemClick = useCallback(
  (componentKey: string) => {
    launchView({
      componentKey,
      paneType: 'main',
      displayText: entity.displayText ?? `${entity.entityType}: ${entity.entityId}`,
      componentProps: {
        entityType: entity.entityType,
        entityId: entity.entityId,
        ...entity.data,
      },
      entityType: entity.entityType,
    });
    onClose();
  },
  [entity, launchView, onClose]
);
```

When a menu item is clicked:

1. **Launches a view** in the `main` pane with:
   - The menu item's `componentKey`
   - Display text from the entity (or a fallback)
   - Entity data spread into `componentProps`
   - `entityType` set on the view instance
2. **Closes the menu** via `onClose()`

### Data Flow to the Launched View

The launched view component receives:

```typescript
{
  viewId: 'uuid-...',
  componentKey: 'user-detail',
  componentProps: {
    entityType: 'user',
    entityId: '42',
    // ...any additional fields from entity.data
    email: 'alice@example.com',
    role: 'Admin',
  },
  entityType: 'user',
}
```

---

## Store Interactions

| Hook / Selector | Purpose |
|-----------------|---------|
| `useEntityMenuItems(entityType)` | Discover menu items from the registry |
| `useShellStore(s => s.launchView)` | Launch the selected view |

---

## Styling

- Uses MUI `Menu`, `MenuItem`, `ListItemIcon`, `ListItemText`, `Divider`, `Typography`
- Menu icons are rendered as emoji `<span>` elements at 18px font size
- Follows the active MUI theme for colors and spacing
