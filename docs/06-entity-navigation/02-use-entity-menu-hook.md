# 06-02 — useEntityMenu Hook

**Source:** `libs/react-material/entity-menu/src/lib/entity-menu.tsx`

## Overview

`useEntityMenu` is a convenience hook that manages all the state needed to open, position, and close an `EntityMenu`. It eliminates the boilerplate of managing `anchorEl` and entity state manually.

---

## API

```typescript
export function useEntityMenu(): {
  anchorEl: HTMLElement | null;
  entity: EntityRef | null;
  isOpen: boolean;
  open: (event: React.MouseEvent<HTMLElement>, entityRef: EntityRef) => void;
  close: () => void;
};
```

| Return Property | Type | Description |
|-----------------|------|-------------|
| `anchorEl` | `HTMLElement \| null` | The DOM element the menu is anchored to |
| `entity` | `EntityRef \| null` | The currently targeted entity |
| `isOpen` | `boolean` | `true` when both `anchorEl` and `entity` are set |
| `open` | `(event, entityRef) => void` | Open the menu for an entity |
| `close` | `() => void` | Close the menu and clear state |

---

## Implementation

```typescript
export function useEntityMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [entity, setEntity] = useState<EntityRef | null>(null);

  const open = useCallback((event: React.MouseEvent<HTMLElement>, entityRef: EntityRef) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setEntity(entityRef);
  }, []);

  const close = useCallback(() => {
    setAnchorEl(null);
    setEntity(null);
  }, []);

  return { anchorEl, entity, isOpen: Boolean(anchorEl && entity), open, close };
}
```

Key details:
- `open()` calls `preventDefault()` and `stopPropagation()` to prevent the click from bubbling (useful when the trigger is inside a link or button)
- `close()` clears both `anchorEl` and `entity`
- `isOpen` is derived from both values being non-null

---

## Usage Pattern

```tsx
import { EntityMenu, useEntityMenu } from '@code-framez/react-material/entity-menu';

function UserList() {
  const entityMenu = useEntityMenu();

  const users = [
    { id: '1', name: 'Alice Chen', email: 'alice@example.com' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  ];

  return (
    <>
      <table>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={(e) =>
                    entityMenu.open(e, {
                      entityType: 'user',
                      entityId: user.id,
                      displayText: user.name,
                      data: { email: user.email },
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

### Pattern Breakdown

1. Call `useEntityMenu()` in the component
2. Attach `entityMenu.open(event, entityRef)` to click handlers
3. Render `<EntityMenu>` conditionally when `entityMenu.entity` is set
4. Pass the hook's properties directly to `EntityMenu` props

---

## Multiple Entity Types

The same hook instance can handle different entity types. The entity type is determined by the `EntityRef` passed to `open()`:

```tsx
<button onClick={(e) => entityMenu.open(e, {
  entityType: 'user', entityId: '1', displayText: 'Alice'
})}>User Actions</button>

<button onClick={(e) => entityMenu.open(e, {
  entityType: 'project', entityId: 'p-42', displayText: 'Project Alpha'
})}>Project Actions</button>
```

The `EntityMenu` component will query the registry for the appropriate entity type each time.
