# 07-05 — MockAuthAdapter

**Source:** `libs/auth/react/src/lib/auth-provider.tsx`

## Overview

The `MockAuthAdapter` is a built-in auth adapter for development and testing. It simulates authentication flows with configurable delays and a mock user, without requiring any external identity provider.

---

## Class Definition

```typescript
export class MockAuthAdapter implements AuthAdapter {
  private stateCallback?: (state: AuthState, user?: AuthUser) => void;
  private authenticated = false;
  private mockUser: AuthUser;

  constructor(mockUser?: AuthUser);
}
```

---

## Constructor

```typescript
constructor(
  mockUser: AuthUser = {
    userId: 'mock-user-1',
    displayName: 'Dev User',
    email: 'dev@example.com',
    roles: ['admin', 'user'],
  }
)
```

Accepts an optional `AuthUser` with default values suitable for development.

---

## Method Behaviour

### initialize

```typescript
async initialize(): Promise<void>
```

- Waits 500ms (simulating startup)
- Emits `'unauthenticated'` (user starts logged out)

### login

```typescript
async login(): Promise<void>
```

- Waits 300ms (simulating network request)
- Sets `authenticated = true`
- Emits `'authenticated'` with the mock user

### logout

```typescript
async logout(): Promise<void>
```

- Waits 200ms (simulating network request)
- Sets `authenticated = false`
- Emits `'unauthenticated'`

### getAccessToken

```typescript
async getAccessToken(): Promise<AuthToken | null>
```

- Returns `null` if not authenticated
- Returns a mock token with:
  - `token`: `'mock-access-token-' + Date.now()`
  - `expiresAt`: current time + 1 hour
  - `tokenType`: `'Bearer'`

### getUser

Returns the mock user if authenticated, `null` otherwise.

### isAuthenticated

Returns the `authenticated` boolean.

### onStateChange

Stores the callback. Returns an unsubscribe function that clears it.

---

## Simulated Delays

| Operation | Delay | Rationale |
|-----------|-------|-----------|
| Initialize | 500ms | Simulates checking stored credentials |
| Login | 300ms | Simulates OAuth redirect/popup |
| Logout | 200ms | Simulates session cleanup |

These delays make the loading states visible in the UI during development, helping ensure loading indicators are correctly implemented.

---

## Usage

### Default User

```typescript
const adapter = new MockAuthAdapter();
// User: { userId: 'mock-user-1', displayName: 'Dev User', ... }
```

### Custom User

```typescript
const adapter = new MockAuthAdapter({
  userId: 'demo-admin',
  displayName: 'Admin User',
  email: 'admin@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=admin',
  roles: ['admin', 'super-admin'],
});
```

### In the Demo App

```typescript
const authAdapter = useMemo(
  () => new MockAuthAdapter({
    userId: 'demo-user',
    displayName: 'Demo User',
    email: 'demo@code-framez.dev',
    roles: ['admin', 'user'],
  }),
  []
);

<AuthProvider adapter={authAdapter}>
  <Shell config={shellConfig} />
</AuthProvider>
```
