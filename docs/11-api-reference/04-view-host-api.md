# 11-04 — View Host API

**Package:** `@code-framez/react/view-host`
**Source:** `libs/react/view-host/src/index.ts`

## Types

### ViewComponentProps

```typescript
interface ViewComponentProps {
  viewId: string;
  componentKey: string;
  componentProps?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
}
```

### ViewComponent

```typescript
type ViewComponent = React.ComponentType<ViewComponentProps>;
```

### ViewComponentMap

```typescript
type ViewComponentMap = Record<ViewComponentKey, ViewComponent>;
```

## Components

### ViewHostProvider

```typescript
function ViewHostProvider(props: ViewHostProviderProps): JSX.Element;

interface ViewHostProviderProps {
  componentMap: ViewComponentMap;
  children: React.ReactNode;
}
```

### ViewNotFound

```typescript
function ViewNotFound(props: { componentKey: string }): JSX.Element;
```

Fallback component shown when a component key can't be resolved.

## Hooks

### useViewHost

```typescript
function useViewHost(): {
  componentMap: ViewComponentMap;
  getComponent: (key: ViewComponentKey) => ViewComponent | undefined;
};
```

### useViewComponent

```typescript
function useViewComponent(componentKey: ViewComponentKey): ViewComponent | undefined;
```
