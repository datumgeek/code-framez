# 11-07 — Entity Menu API

**Package:** `@code-framez/react-material/entity-menu`
**Source:** `libs/react-material/entity-menu/src/index.ts`

## Components

### EntityMenu

```typescript
function EntityMenu(props: EntityMenuProps): JSX.Element;
```

MUI Menu that displays entity-aware actions.

## Types

### EntityMenuProps

```typescript
interface EntityMenuProps {
  entity: EntityRef;
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}
```

## Hooks

### useEntityMenu

```typescript
function useEntityMenu(): {
  anchorEl: HTMLElement | null;
  entity: EntityRef | null;
  isOpen: boolean;
  open: (event: React.MouseEvent<HTMLElement>, entityRef: EntityRef) => void;
  close: () => void;
};
```

Manages entity menu open/close state. Call `open(event, entityRef)` to show the menu, `close()` to dismiss it.
