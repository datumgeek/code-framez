# 03-04 — Event System

**Source:** `libs/react/state/src/lib/shell-store.ts`

## Overview

The shell includes a lightweight synchronous event bus. Store actions emit events after state changes, and external code can listen for those events to implement cross-cutting concerns (analytics, logging, synchronization).

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  Store Action (e.g., launchView)                     │
│   1. set(state => { ... })  ← Immer draft mutation   │
│   2. emitEvent('view-launched', payload)             │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────┐
│  emitEvent()                                         │
│   Creates ShellEvent { type, timestamp, payload }    │
│   Iterates eventListeners (Set)                      │
│   Calls each listener(event) inside try/catch        │
└──────────────┬───────────────────────────────────────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
  Listener   Listener  Listener
   (log)    (analytics) (sync)
```

---

## API

### onShellEvent

```typescript
export function onShellEvent(listener: ShellEventListener): () => void;
```

Register a listener for all shell events. Returns an unsubscribe function.

```typescript
const off = onShellEvent((event) => {
  console.log(event.type, event.payload);
});

// Later:
off();
```

### Integration with React

```typescript
import { useEffect } from 'react';
import { onShellEvent } from '@code-framez/react/state';

function AnalyticsTracker() {
  useEffect(() => {
    const off = onShellEvent((event) => {
      sendToAnalytics(event.type, event.payload);
    });
    return off; // Cleanup on unmount
  }, []);

  return null;
}
```

---

## Event Types Emitted

| Event String | Emitted By | Payload |
|-------------|------------|---------|
| `view-launched` | `launchView` | `{ viewId, paneType, componentKey }` |
| `view-closed` | `closeView` | `{ viewId, paneType }` |
| `view-moved` | `moveView` | `{ viewId, fromPane, toPane }` |
| `view-activated` | `setActiveView` | `{ viewId, paneType }` |
| `pane-toggled` | `togglePane`, `setPaneVisible` | `{ paneType, visible }` |
| `pane-activated` | `setActivePane` | `{ paneType }` |
| `shell-reset` | `resetShell` | `{}` |

---

## Listener Storage

Listeners are stored in a module-level `Set<ShellEventListener>`:

```typescript
const eventListeners: Set<ShellEventListener> = new Set();
```

**Why a `Set`?**

- Prevents duplicate registration of the same function reference
- O(1) add, delete, and has operations
- Deterministic iteration order (insertion order) per the ES2015 spec

---

## Error Isolation

Each listener is wrapped in a `try/catch`:

```typescript
function emitEvent(type: ShellEventType, payload: Record<string, unknown>): void {
  const event: ShellEvent = {
    type,
    timestamp: Date.now(),
    payload,
  };
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.error('[code-framez] Event listener error:', err);
    }
  });
}
```

This means:
- A broken listener never crashes the application
- Other listeners always receive the event
- Errors are logged to the console for debugging

---

## Synchronous Execution

Events are dispatched **synchronously** immediately after the Immer state update. This guarantees:

1. Listeners see the **new state** if they call `useShellStore.getState()` inside the callback
2. Events are ordered — listeners for `view-launched` fire before any subsequent `view-activated`
3. No race conditions with batched React renders

---

## Timing Relative to React Renders

```
launchView() called
  ├── set() → Immer produces new state
  ├── emitEvent() → listeners fire synchronously
  └── Zustand notifies React subscribers (async batched)
        └── Components re-render
```

Listeners fire **before** React re-renders, so they can perform side effects (API calls, logging) without waiting for the UI to update.
