# 07-02 — AuthProvider

**Source:** `libs/auth/react/src/lib/auth-provider.tsx`

## Overview

The `AuthProvider` is a React context provider that wraps the application and provides authentication state and actions to all descendants.

---

## Props

```typescript
export interface AuthProviderProps {
  adapter: AuthAdapter;
  children: React.ReactNode;
}
```

| Prop | Type | Description |
|------|------|-------------|
| `adapter` | `AuthAdapter` | The concrete auth adapter instance |
| `children` | `React.ReactNode` | Application subtree |

---

## Initialization Flow

```typescript
useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  async function init() {
    try {
      // 1. Subscribe to state changes first
      unsubscribe = adapter.onStateChange((state, user) => {
        setAuthState(state);
        setUser(user);
        setIsLoading(false);
      });
      // 2. Then initialize the adapter
      await adapter.initialize();
    } catch (err) {
      setAuthState('error');
      setError({ code: 'INIT_ERROR', message: err.message });
      setIsLoading(false);
    }
  }

  init();
  return () => unsubscribe?.();
}, [adapter]);
```

Key order:
1. **Subscribe first** — ensures no state changes are missed during initialization
2. **Initialize second** — adapter can emit state changes during init
3. **Cleanup on unmount** — unsubscribes from state changes

---

## Internal State

```typescript
const [authState, setAuthState] = useState<AuthState>('initializing');
const [user, setUser] = useState<AuthUser | undefined>();
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<{ code: string; message: string } | undefined>();
```

---

## Actions

### login

```typescript
const login = useCallback(async (options?: LoginOptions) => {
  setIsLoading(true);
  try {
    await adapter.login(options);
  } catch (err) {
    setError({ code: 'LOGIN_ERROR', message: err.message });
  } finally {
    setIsLoading(false);
  }
}, [adapter]);
```

### logout

```typescript
const logout = useCallback(async (options?: LogoutOptions) => {
  setIsLoading(true);
  try {
    await adapter.logout(options);
  } catch (err) {
    setError({ code: 'LOGOUT_ERROR', message: err.message });
  } finally {
    setIsLoading(false);
  }
}, [adapter]);
```

### getAccessToken

```typescript
const getAccessToken = useCallback(async (scopes?: string[]) => {
  return adapter.getAccessToken(scopes);
}, [adapter]);
```

### RBAC Methods

```typescript
const hasRole = useCallback(
  (role: string) => user?.roles.includes(role) ?? false,
  [user]
);

const hasAnyRole = useCallback(
  (roles: string[]) => roles.some((r) => user?.roles.includes(r)) ?? false,
  [user]
);

const hasAllRoles = useCallback(
  (roles: string[]) => roles.every((r) => user?.roles.includes(r)) ?? false,
  [user]
);
```

---

## Context Value

The context provides both state and actions:

```typescript
interface AuthContextValue extends AuthStateInfo, AuthActions {}
```

| Property | Type | Description |
|----------|------|-------------|
| `state` | `AuthState` | Current auth state |
| `user` | `AuthUser \| undefined` | Authenticated user |
| `error` | `{ code, message } \| undefined` | Last error |
| `isLoading` | `boolean` | Whether an auth operation is in progress |
| `login` | `(options?) => Promise<void>` | Sign in |
| `logout` | `(options?) => Promise<void>` | Sign out |
| `getAccessToken` | `(scopes?) => Promise<AuthToken \| null>` | Get token |
| `hasRole` | `(role) => boolean` | Check single role |
| `hasAnyRole` | `(roles) => boolean` | Check any of roles |
| `hasAllRoles` | `(roles) => boolean` | Check all roles |

The value is memoized with `useMemo` to prevent unnecessary re-renders.

---

## Error Handling

Errors are captured at three points:
1. **Initialization** — `INIT_ERROR` if `adapter.initialize()` throws
2. **Login** — `LOGIN_ERROR` if `adapter.login()` throws
3. **Logout** — `LOGOUT_ERROR` if `adapter.logout()` throws

Errors are stored in state and available via `useAuth().error`.

---

## Usage

```tsx
import { AuthProvider, MockAuthAdapter } from '@code-framez/auth/react';

const adapter = new MockAuthAdapter({
  userId: 'demo',
  displayName: 'Demo User',
  email: 'demo@example.com',
  roles: ['admin', 'user'],
});

function App() {
  return (
    <AuthProvider adapter={adapter}>
      <Shell config={shellConfig} />
    </AuthProvider>
  );
}
```
