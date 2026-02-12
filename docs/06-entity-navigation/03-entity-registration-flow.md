# 06-03 — Entity Registration Flow

## Overview

This document traces the entity navigation system end-to-end: from declaring entity menu configs on view registrations, through discovery, to launching an entity-aware view.

---

## Phase 1: Registration

When the application starts, view registrations include `entityMenu` configs for entity-aware views:

```typescript
const views: ViewComponentRegistration[] = [
  {
    componentKey: 'user-detail',
    displayText: 'User Detail',
    displayIcon: '👤',
    paneType: 'main',
    entityMenu: {
      menuText: 'View User Detail',
      menuIcon: '👤',
      order: 1,
      entityTypes: ['user'],
    },
  },
  {
    componentKey: 'analytics',
    displayText: 'Analytics',
    displayIcon: '📊',
    paneType: 'main',
    // No entityMenu — not an entity action
  },
];
```

These are passed to `Shell` via `ShellConfig.views` and registered into the Zustand store on mount.

```
viewComponentRegistry = {
  'user-detail': { componentKey: 'user-detail', entityMenu: { entityTypes: ['user'], ... }, ... },
  'analytics':   { componentKey: 'analytics',   entityMenu: undefined, ... },
}
```

---

## Phase 2: Entity Interaction

A component (e.g., `UserList`) presents entities and triggers the entity menu:

```tsx
// User clicks "⋯" button on a user row
entityMenu.open(event, {
  entityType: 'user',
  entityId: '42',
  displayText: 'Alice Chen',
  data: { email: 'alice@example.com' },
});
```

---

## Phase 3: Discovery

The `EntityMenu` component mounts and calls `useEntityMenuItems('user')`:

```typescript
const menuItems = useEntityMenuItems('user');
```

The selector:

1. Iterates all entries in `viewComponentRegistry`
2. For each registration with an `entityMenu`:
   - Checks if `entityMenu.entityTypes` includes `'user'`
3. Maps matching registrations to `EntityMenuItem` objects
4. Sorts by `order` ascending

Result:

```typescript
[
  { componentKey: 'user-detail', menuText: 'View User Detail', menuIcon: '👤', order: 1 },
]
```

---

## Phase 4: Menu Rendering

```
┌──────────────────────┐
│  Alice Chen          │  ← entity.displayText
│──────────────────────│
│  👤 View User Detail │  ← from discovery
└──────────────────────┘
```

---

## Phase 5: View Launch

User clicks "View User Detail":

```typescript
launchView({
  componentKey: 'user-detail',
  paneType: 'main',
  displayText: 'Alice Chen',
  componentProps: {
    entityType: 'user',
    entityId: '42',
    email: 'alice@example.com',    // ← spread from entity.data
  },
  entityType: 'user',
});
```

---

## Phase 6: Component Rendering

The `Pane` component resolves `'user-detail'` via `useViewComponent()` and renders:

```tsx
<UserDetail
  viewId="uuid-..."
  componentKey="user-detail"
  componentProps={{ entityType: 'user', entityId: '42', email: 'alice@example.com' }}
  entityType="user"
/>
```

The `UserDetail` component reads data from `componentProps`:

```tsx
function UserDetail({ componentProps }: ViewComponentProps) {
  const userId = componentProps?.entityId as string;
  const email = componentProps?.email as string;
  // Render user details...
}
```

---

## Complete Sequence

```
1. App mounts
   └── registerViewComponents(views)
       └── Store: viewComponentRegistry populated

2. User clicks entity action button
   └── entityMenu.open(event, entityRef)
       └── State: anchorEl + entity set

3. EntityMenu renders
   └── useEntityMenuItems('user')
       └── Selector filters registry
   └── Menu displays matching items

4. User clicks menu item
   └── handleItemClick('user-detail')
       └── launchView({ componentKey, componentProps, ... })
           └── Store: ViewInstance created in main pane
       └── onClose()
           └── Menu closes

5. Pane re-renders
   └── New tab appears: "Alice Chen"
   └── ViewTabContent resolves 'user-detail' → <UserDetail>
   └── UserDetail renders with entity data
```

---

## Adding New Entity Actions

To add a new action for an entity type:

1. **Create the view component** that handles the action
2. **Add a registration** with an `entityMenu` config:

```typescript
{
  componentKey: 'user-permissions',
  displayText: 'Permissions',
  paneType: 'main',
  entityMenu: {
    menuText: 'Edit Permissions',
    menuIcon: '🔐',
    order: 3,
    entityTypes: ['user'],
  },
}
```

3. **Add to component map**: `{ 'user-permissions': UserPermissions }`

The existing `EntityMenu` will automatically discover and display the new action — no changes needed to the menu component or the list component.
