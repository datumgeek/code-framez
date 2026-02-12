# 11-03 — State API

**Package:** `@code-framez/react/state`
**Source:** `libs/react/state/src/index.ts`

## Exports

### useShellStore

```typescript
const useShellStore: UseBoundStore<StoreApi<ShellStore>>;
```

The main Zustand store hook. Use with a selector:

```typescript
const value = useShellStore((state) => state.activePaneType);
```

### ShellStore (type)

```typescript
interface ShellStore extends ShellState, ShellActions {}
```

### usePaneState

```typescript
function usePaneState(paneType: PaneType): PaneState;
```

### useActiveView

```typescript
function useActiveView(paneType: PaneType): ViewInstance | undefined;
```

### usePaneViews

```typescript
function usePaneViews(paneType: PaneType): ViewInstance[];
```

### useViewInstance

```typescript
function useViewInstance(viewId: ViewId): ViewInstance | undefined;
```

### useViewComponentRegistry

```typescript
function useViewComponentRegistry(): Record<ViewComponentKey, ViewComponentRegistration>;
```

### useViewComponentRegistration

```typescript
function useViewComponentRegistration(componentKey: string): ViewComponentRegistration | undefined;
```

### useEntityMenuItems

```typescript
function useEntityMenuItems(entityType: string): Array<{
  componentKey: string;
  menuText: string;
  menuIcon?: string;
  order: number;
}>;
```

### onShellEvent

```typescript
function onShellEvent(listener: ShellEventListener): () => void;
```

Subscribe to shell events. Returns an unsubscribe function.
