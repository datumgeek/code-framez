# 10-04 — Extending the Platform

## Overview

Code Framez is designed to be extended. This guide covers common extension patterns.

---

## Adding a New Library Package

### 1. Create the Package Structure

```
libs/
  my-scope/
    my-package/
      tsconfig.json
      src/
        index.ts
        lib/
          my-module.ts
```

### 2. Add Path Alias

In `tsconfig.base.json`, add a path alias:

```json
{
  "compilerOptions": {
    "paths": {
      "@code-framez/my-scope/my-package": ["libs/my-scope/my-package/src/index.ts"]
    }
  }
}
```

### 3. Add Vite Alias

In `vite.config.ts`, add a resolve alias:

```typescript
resolve: {
  alias: {
    '@code-framez/my-scope/my-package': path.resolve(
      __dirname,
      'libs/my-scope/my-package/src/index.ts'
    ),
  },
}
```

### 4. Export from index.ts

```typescript
// libs/my-scope/my-package/src/index.ts
export { myFunction, MyClass } from './lib/my-module';
```

---

## Creating a Custom Auth Adapter

Implement the `AuthAdapter` interface to connect to your identity provider:

```typescript
import type { AuthAdapter } from '@code-framez/auth/react';
import type { AuthState, AuthUser, AuthToken } from '@code-framez/core/auth-types';

export class MyIdPAdapter implements AuthAdapter {
  private client: IdPClient;
  private callback?: (state: AuthState, user?: AuthUser) => void;

  constructor(config: { clientId: string; domain: string }) {
    this.client = new IdPClient(config);
  }

  async initialize() {
    const session = await this.client.checkSession();
    if (session) {
      this.callback?.('authenticated', session.user);
    } else {
      this.callback?.('unauthenticated');
    }
  }

  async login(options?: LoginOptions) {
    await this.client.loginWithPopup(options);
    const user = this.client.getUser();
    this.callback?.('authenticated', user);
  }

  async logout() {
    await this.client.logout();
    this.callback?.('unauthenticated');
  }

  async getAccessToken(scopes?: string[]) {
    return this.client.getToken(scopes);
  }

  getUser() { return this.client.getUser(); }
  isAuthenticated() { return this.client.isAuthenticated(); }

  onStateChange(cb: (state: AuthState, user?: AuthUser) => void) {
    this.callback = cb;
    return () => { this.callback = undefined; };
  }
}
```

---

## Adding a New Pane Type

The current pane types are hardcoded (`nav`, `main`, `search`, `right`, `bottom`). To add a new pane:

1. Add the new type to `PaneType` in `libs/core/types/src/lib/types.ts`
2. Add default config in `defaultPaneConfigs` in the shell store
3. Add layout rendering in `ShellLayout` in the shell component
4. Update the toolbar if toggle controls are needed

---

## Creating Alternative UI Libraries

The platform separates framework-agnostic logic from UI:

| Layer | Can Replace? | How |
|-------|-------------|-----|
| `@code-framez/core/types` | No | Foundation types |
| `@code-framez/react/state` | No | Core state (React-specific but UI-agnostic) |
| `@code-framez/react/view-host` | No | Component resolution |
| `@code-framez/react-material/*` | **Yes** | Create `@code-framez/react-chakra/*` or similar |

To use a different component library:
1. Create new packages (e.g., `libs/react-chakra/shell/`, `libs/react-chakra/pane/`)
2. Implement the same component contracts using your preferred library
3. Import your shell/pane instead of the MUI versions

---

## Adding Middleware to the Store

Zustand supports middleware composition:

```typescript
import { devtools } from 'zustand/middleware';

export const useShellStore = create<ShellStore>()(
  devtools(
    immer((set, get) => ({
      // ... store definition
    })),
    { name: 'code-framez-shell' }
  )
);
```

Useful middleware:
- `devtools` — Redux DevTools integration
- `persist` — Save/restore state to localStorage
- `subscribeWithSelector` — Fine-grained subscriptions
