# 07-03 — Auth Hooks

**Source:** `libs/auth/react/src/lib/auth-provider.tsx`

## Overview

Four hooks provide convenient access to authentication state and actions. All read from the `AuthContext` provided by `AuthProvider`.

---

## useAuth

```typescript
export function useAuth(): AuthContextValue;
```

The full auth context. Returns state, user, error, loading flag, and all auth actions.

```tsx
function MyComponent() {
  const { state, user, login, logout, hasRole } = useAuth();

  if (state === 'unauthenticated') {
    return <button onClick={() => login()}>Sign In</button>;
  }

  if (hasRole('admin')) {
    return <AdminPanel user={user} onSignOut={logout} />;
  }

  return <UserPanel user={user} onSignOut={logout} />;
}
```

---

## useAuthUser

```typescript
export function useAuthUser(): AuthUser | undefined;
```

Returns just the current user, or `undefined` if not authenticated.

```tsx
function UserGreeting() {
  const user = useAuthUser();

  if (!user) return null;

  return <span>Hello, {user.displayName}!</span>;
}
```

---

## useAuthState

```typescript
export function useAuthState(): AuthState;
```

Returns the current auth state string: `'initializing'`, `'authenticated'`, `'unauthenticated'`, or `'error'`.

```tsx
function AuthGuard({ children }: { children: React.ReactNode }) {
  const state = useAuthState();

  switch (state) {
    case 'initializing': return <LoadingSpinner />;
    case 'authenticated': return <>{children}</>;
    case 'unauthenticated': return <LoginPrompt />;
    case 'error': return <ErrorMessage />;
  }
}
```

---

## useIsAuthenticated

```typescript
export function useIsAuthenticated(): boolean;
```

Convenience boolean — `true` only when `state === 'authenticated'`.

```tsx
function ConditionalContent() {
  const isAuth = useIsAuthenticated();

  return (
    <div>
      <PublicContent />
      {isAuth && <ProtectedContent />}
    </div>
  );
}
```

---

## Summary

| Hook | Returns | Use Case |
|------|---------|----------|
| `useAuth()` | Full context | When you need actions + state |
| `useAuthUser()` | `AuthUser \| undefined` | Display user info |
| `useAuthState()` | `AuthState` | Conditional rendering by state |
| `useIsAuthenticated()` | `boolean` | Simple auth checks |
