# 02-05 — Event Types

**Source:** `libs/core/types/src/lib/types.ts`

## Overview

Code Framez includes a lightweight pub/sub event system. Components can listen for lifecycle events (views launched, tabs switched, panes toggled) without tight coupling. Events are dispatched synchronously through registered listeners.

---

## ShellEventType

```typescript
type ShellEventType =
  | 'viewLaunched'
  | 'viewClosed'
  | 'viewActivated'
  | 'paneToggled'
  | 'viewComponentRegistered'
  | 'entityMenuRequested'
  | 'authStateChanged';
```

| Event | Trigger | Description |
|-------|---------|-------------|
| `viewLaunched` | `launchView()` | A new view instance was created and added to a pane |
| `viewClosed` | `closeView()` | A view instance was removed from a pane |
| `viewActivated` | `activateView()` | A tab was switched (a view became the active view in its pane) |
| `paneToggled` | `togglePane()` | A pane's visibility was toggled |
| `viewComponentRegistered` | `registerViewComponent()` | A new view component was registered in the registry |
| `entityMenuRequested` | Entity menu opened | An entity context menu was opened for an entity |
| `authStateChanged` | Auth state transitions | Authentication state changed (logged in, logged out, etc.) |

---

## ShellEvent

```typescript
interface ShellEvent {
  type: ShellEventType;
  timestamp: number;
  payload?: Record<string, unknown>;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `type` | `ShellEventType` | The event discriminator |
| `timestamp` | `number` | `Date.now()` value when the event was emitted |
| `payload` | `Record<string, unknown> \| undefined` | Event-specific data |

### Event Payloads by Type

| Event Type | Typical Payload Keys | Example Values |
|------------|---------------------|----------------|
| `viewLaunched` | `viewInstanceId`, `componentKey`, `paneType` | `{ viewInstanceId: 'abc-123', componentKey: 'user-detail', paneType: 'main' }` |
| `viewClosed` | `viewInstanceId`, `paneType` | `{ viewInstanceId: 'abc-123', paneType: 'main' }` |
| `viewActivated` | `viewInstanceId`, `paneType` | `{ viewInstanceId: 'abc-123', paneType: 'main' }` |
| `paneToggled` | `paneType`, `visible` | `{ paneType: 'search', visible: true }` |
| `viewComponentRegistered` | `componentKey`, `paneType` | `{ componentKey: 'analytics', paneType: 'main' }` |
| `entityMenuRequested` | `entityType`, `entityId` | `{ entityType: 'user', entityId: '42' }` |
| `authStateChanged` | `state`, `userId` | `{ state: 'authenticated', userId: 'demo-user' }` |

---

## ShellEventListener

```typescript
type ShellEventListener = (event: ShellEvent) => void;
```

A callback function that receives a `ShellEvent`. Listeners can be selective (filtering by `event.type`) or global (handling all events).

---

## Event System Implementation

### Subscribing

```typescript
import { onShellEvent } from '@code-framez/react/state';

// Subscribe — returns an unsubscribe function
const unsubscribe = onShellEvent((event) => {
  console.log(`[${event.type}]`, event.payload);
});

// Unsubscribe when done
unsubscribe();
```

### Internal Mechanics

The event system is backed by a `Set<ShellEventListener>`:

```
┌─────────────────────────────────────────────────┐
│  Event System                                    │
│                                                  │
│  listeners: Set<ShellEventListener>              │
│                                                  │
│  onShellEvent(listener) ──► listeners.add        │
│  emitEvent(event)       ──► forEach(listener)    │
│  unsubscribe()          ──► listeners.delete     │
└─────────────────────────────────────────────────┘
```

### Emission Points

Events are emitted inside the Zustand store actions:

| Store Action | Event Emitted |
|--------------|---------------|
| `launchView()` | `viewLaunched` |
| `closeView()` | `viewClosed` |
| `activateView()` | `viewActivated` |
| `togglePane()` | `paneToggled` |
| `registerViewComponent()` | `viewComponentRegistered` |

### Error Isolation

Each listener is invoked inside a `try/catch` block. If a listener throws, the error is logged to `console.error` and the remaining listeners continue to receive the event:

```typescript
const emitEvent = (event: ShellEvent) => {
  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.error('Shell event listener error:', err);
    }
  });
};
```

---

## Use Cases

### Analytics Logging

```typescript
onShellEvent((event) => {
  if (event.type === 'viewLaunched') {
    trackAnalytics('view_opened', {
      component: event.payload?.componentKey,
      pane: event.payload?.paneType,
    });
  }
});
```

### State Synchronization

```typescript
onShellEvent((event) => {
  if (event.type === 'authStateChanged') {
    const { state } = event.payload ?? {};
    if (state === 'unauthenticated') {
      // Clear sensitive data from local state
    }
  }
});
```

### Debugging

```typescript
onShellEvent((event) => {
  console.table({
    type: event.type,
    timestamp: new Date(event.timestamp).toISOString(),
    ...event.payload,
  });
});
```
