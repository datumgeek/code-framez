# 02-04 — Entity Types

**Source:** `libs/core/types/src/lib/types.ts`

## Overview

The entity system allows components to declare themselves as handlers for specific entity types (e.g., `'user'`, `'project'`, `'dashboard'`). When a user interacts with an entity, the system can dynamically discover and present all available actions.

---

## EntityRef

```typescript
interface EntityRef {
  entityType: string;
  entityId: string;
  displayText?: string;
  data?: Record<string, unknown>;
}
```

A reference to a specific entity instance. Used to trigger entity menus and launch entity-aware views.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `entityType` | `string` | Yes | Type discriminator (e.g., `'user'`, `'project'`) |
| `entityId` | `string` | Yes | Unique entity identifier |
| `displayText` | `string` | No | Human-readable label. Falls back to `"entityType: entityId"` |
| `data` | `Record<string, unknown>` | No | Additional entity data to pass to launched views |

### Example

```typescript
const userRef: EntityRef = {
  entityType: 'user',
  entityId: '42',
  displayText: 'Alice Chen',
  data: { email: 'alice@example.com', role: 'Admin' },
};
```

---

## EntityMenuItem

```typescript
interface EntityMenuItem {
  componentKey: ViewComponentKey;
  menuText: string;
  menuIcon?: string;
  order: number;
}
```

An individual action that can be performed on an entity. Computed by the `useEntityMenuItems()` selector.

| Property | Type | Description |
|----------|------|-------------|
| `componentKey` | `ViewComponentKey` | The component to launch when this action is selected |
| `menuText` | `string` | Text displayed in the menu |
| `menuIcon` | `string \| undefined` | Icon/emoji for the menu item |
| `order` | `number` | Sort position (lower = first) |

---

## EntityMenuConfig

```typescript
interface EntityMenuConfig {
  menuText: string;
  menuIcon?: string;
  order?: number;
  entityTypes: string[];
}
```

Declared on a `ViewComponentRegistration` to make that component available as an entity action.

See [02-02 View Types](02-view-types.md#entitymenuconfig) for full property details.

---

## How Entity Navigation Works

### 1. Registration Phase

When views are registered, some include `entityMenu` configurations:

```typescript
{
  componentKey: 'user-detail',
  displayText: 'User Detail',
  paneType: 'main',
  entityMenu: {
    menuText: 'View User Detail',
    menuIcon: '👤',
    order: 1,
    entityTypes: ['user'],
  },
}
```

### 2. Discovery Phase

When an entity menu is requested for type `'user'`, the `useEntityMenuItems('user')` selector:

1. Iterates all entries in `viewComponentRegistry`
2. Filters registrations where `entityMenu.entityTypes` includes `'user'`
3. Maps each match to an `EntityMenuItem`
4. Sorts by `order` ascending

### 3. Launch Phase

When the user selects a menu item, the `EntityMenu` component calls:

```typescript
launchView({
  componentKey: item.componentKey,
  paneType: 'main',
  displayText: entity.displayText ?? `${entity.entityType}: ${entity.entityId}`,
  componentProps: {
    entityType: entity.entityType,
    entityId: entity.entityId,
    ...entity.data,
  },
  entityType: entity.entityType,
});
```

The launched view component receives the entity data in its `componentProps`.

---

## Multiple Actions per Entity

A single entity type can have many registered actions:

```typescript
// View user detail
{
  componentKey: 'user-detail',
  entityMenu: { menuText: 'View Detail', order: 1, entityTypes: ['user'] },
}

// View user activity
{
  componentKey: 'user-activity',
  entityMenu: { menuText: 'View Activity', order: 2, entityTypes: ['user'] },
}

// Edit user permissions
{
  componentKey: 'user-permissions',
  entityMenu: { menuText: 'Edit Permissions', order: 3, entityTypes: ['user'] },
}
```

All three will appear in the entity menu for any user entity.

---

## Cross-Type Registration

A single component can handle multiple entity types:

```typescript
{
  componentKey: 'audit-log',
  entityMenu: {
    menuText: 'View Audit Log',
    entityTypes: ['user', 'project', 'document'],
    order: 10,
  },
}
```

This component will appear in the entity menu for users, projects, and documents.
