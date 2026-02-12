# 10-03 — Entity Actions

## Overview

The entity system enables context-aware actions on business objects (users, projects, documents, etc.). This guide shows how to make your views appear in entity context menus.

---

## Step 1: Define the Entity Type

Decide on a string identifier for your entity type. Common examples:
- `'user'`
- `'project'`
- `'document'`
- `'order'`

There is no formal registry of entity types — any string works.

---

## Step 2: Register with entityMenu

Add an `entityMenu` config to your view registration:

```typescript
{
  componentKey: 'order-detail',
  displayText: 'Order Detail',
  displayIcon: '📋',
  paneType: 'main',
  entityMenu: {
    menuText: 'View Order Detail',
    menuIcon: '📋',
    order: 1,
    entityTypes: ['order'],
  },
}
```

| Property | Description |
|----------|-------------|
| `menuText` | Text shown in the context menu |
| `menuIcon` | Emoji or icon for the menu item |
| `order` | Sort position (lower = higher in menu) |
| `entityTypes` | Array of entity types this action applies to |

---

## Step 3: Trigger the Entity Menu

In a list or data view, use the `useEntityMenu` hook:

```tsx
import { EntityMenu, useEntityMenu } from '@code-framez/react-material/entity-menu';

function OrderList() {
  const entityMenu = useEntityMenu();

  const orders = [
    { id: 'ORD-001', customer: 'Acme Corp', total: 1250 },
    { id: 'ORD-002', customer: 'TechStart', total: 830 },
  ];

  return (
    <>
      <table>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer}</td>
              <td>
                <button
                  onClick={(e) =>
                    entityMenu.open(e, {
                      entityType: 'order',
                      entityId: order.id,
                      displayText: `Order ${order.id}`,
                      data: { customer: order.customer, total: order.total },
                    })
                  }
                >
                  ⋯
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {entityMenu.entity && (
        <EntityMenu
          entity={entityMenu.entity}
          anchorEl={entityMenu.anchorEl}
          open={entityMenu.isOpen}
          onClose={entityMenu.close}
        />
      )}
    </>
  );
}
```

---

## Step 4: Handle Entity Data in Your View

The launched view receives entity data in `componentProps`:

```tsx
function OrderDetail({ componentProps }: ViewComponentProps) {
  const orderId = componentProps?.entityId as string;
  const customer = componentProps?.customer as string;
  const total = componentProps?.total as number;

  return (
    <div>
      <h2>Order: {orderId}</h2>
      <p>Customer: {customer}</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

---

## Multiple Actions per Entity

Register multiple views for the same entity type:

```typescript
// View 1
{
  componentKey: 'order-detail',
  entityMenu: { menuText: 'View Detail', order: 1, entityTypes: ['order'] },
}

// View 2
{
  componentKey: 'order-history',
  entityMenu: { menuText: 'View History', order: 2, entityTypes: ['order'] },
}

// View 3
{
  componentKey: 'order-invoice',
  entityMenu: { menuText: 'Generate Invoice', order: 3, entityTypes: ['order'] },
}
```

All three appear in the entity menu for any order entity.

---

## Cross-Type Views

A single view can handle multiple entity types:

```typescript
{
  componentKey: 'audit-log',
  entityMenu: {
    menuText: 'View Audit Log',
    entityTypes: ['user', 'project', 'order'],
    order: 99,
  },
}
```

The view component can check `componentProps.entityType` to handle different entities.
