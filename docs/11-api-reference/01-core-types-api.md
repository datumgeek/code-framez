# 11-01 — Core Types API

**Package:** `@code-framez/core/types`
**Source:** `libs/core/types/src/index.ts`

## Types

### PaneType

```typescript
type PaneType = 'nav' | 'main' | 'search' | 'right' | 'bottom';
```

### PaneArrangement

```typescript
type PaneArrangement = 'tabs-top' | 'tabs-bottom' | 'tabs-left' | 'tabs-right';
```

### PaneConfig

```typescript
interface PaneConfig {
  paneType: PaneType;
  arrangement: PaneArrangement;
  visible: boolean;
  defaultSize?: string;
  minSize?: number;
  maxSize?: number;
}
```

### PaneState

```typescript
interface PaneState {
  config: PaneConfig;
  viewInstances: ViewInstance[];
  activeViewId: ViewId | undefined;
}
```

### ViewId

```typescript
type ViewId = string;
```

### ViewComponentKey

```typescript
type ViewComponentKey = string;
```

### ViewLaunchState

```typescript
type ViewLaunchState = 'startup' | 'dynamic';
```

### ViewState

```typescript
type ViewState = 'active' | 'inactive' | 'loading' | 'error';
```

### ViewInstance

```typescript
interface ViewInstance {
  viewId: ViewId;
  componentKey: ViewComponentKey;
  paneType: PaneType;
  displayText: string;
  displayIcon?: string;
  launchState: ViewLaunchState;
  viewState: ViewState;
  componentProps?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
  createdAt: number;
}
```

### ViewLaunchConfig

```typescript
interface ViewLaunchConfig {
  componentKey: ViewComponentKey;
  paneType: PaneType;
  displayText: string;
  displayIcon?: string;
  componentProps?: Record<string, unknown>;
  entityType?: string;
}
```

### ViewComponentRegistration

```typescript
interface ViewComponentRegistration {
  componentKey: ViewComponentKey;
  displayText: string;
  displayIcon?: string;
  paneType: PaneType;
  launchAtStartup?: boolean;
  order?: number;
  entityTypes?: string[];
  entityMenu?: EntityMenuConfig;
}
```

### EntityMenuConfig

```typescript
interface EntityMenuConfig {
  menuText: string;
  menuIcon?: string;
  order?: number;
  entityTypes: string[];
}
```

### EntityRef

```typescript
interface EntityRef {
  entityType: string;
  entityId: string;
  displayText?: string;
  data?: Record<string, unknown>;
}
```

### EntityMenuItem

```typescript
interface EntityMenuItem {
  componentKey: ViewComponentKey;
  menuText: string;
  menuIcon?: string;
  order: number;
}
```

### ShellState

```typescript
interface ShellState {
  panes: Record<PaneType, PaneState>;
  viewComponentRegistry: Record<ViewComponentKey, ViewComponentRegistration>;
  activePaneType: PaneType;
}
```

### ShellActions

```typescript
interface ShellActions {
  registerViewComponent(registration: ViewComponentRegistration): void;
  registerViewComponents(registrations: ViewComponentRegistration[]): void;
  launchView(config: ViewLaunchConfig): ViewId;
  closeView(viewId: ViewId): void;
  moveView(viewId: ViewId, targetPane: PaneType): void;
  setActiveView(paneType: PaneType, viewId: ViewId): void;
  togglePane(paneType: PaneType): void;
  setPaneVisible(paneType: PaneType, visible: boolean): void;
  setActivePane(paneType: PaneType): void;
  updateViewState(viewId: ViewId, updates: Partial<ViewInstance>): void;
  resetShell(): void;
}
```

### ShellEventType

```typescript
type ShellEventType =
  | 'viewLaunched' | 'viewClosed' | 'viewActivated'
  | 'paneToggled' | 'viewComponentRegistered'
  | 'entityMenuRequested' | 'authStateChanged';
```

### ShellEvent

```typescript
interface ShellEvent {
  type: ShellEventType;
  timestamp: number;
  payload?: Record<string, unknown>;
}
```

### ShellEventListener

```typescript
type ShellEventListener = (event: ShellEvent) => void;
```
