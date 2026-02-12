# 07-04 — AuthAdapter Interface

**Source:** `libs/auth/react/src/lib/auth-provider.tsx`

## Overview

The `AuthAdapter` interface is the contract that any authentication provider implementation must satisfy. It abstracts the specifics of identity providers behind a uniform API.

---

## Interface

```typescript
export interface AuthAdapter {
  initialize(): Promise<void>;
  login(options?: LoginOptions): Promise<void>;
  logout(options?: LogoutOptions): Promise<void>;
  getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
  getUser(): AuthUser | null;
  isAuthenticated(): boolean;
  onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void;
}
```

---

## Method Reference

### initialize

```typescript
initialize(): Promise<void>;
```

Called once when `AuthProvider` mounts. Should:
- Load any cached credentials (e.g., from localStorage or cookies)
- Check if an existing session is valid
- Call the `onStateChange` callback with the initial state

**Note:** `onStateChange` is registered BEFORE `initialize()` is called, so it's safe to emit state changes from within `initialize()`.

### login

```typescript
login(options?: LoginOptions): Promise<void>;
```

Trigger the sign-in flow. This might:
- Open a popup/redirect for OAuth/OIDC
- Send username/password to a custom backend
- Simulate a delay for mock adapters

Should call the `onStateChange` callback with `'authenticated'` and the user on success.

### logout

```typescript
logout(options?: LogoutOptions): Promise<void>;
```

End the session. Should:
- Clear tokens and cached credentials
- Call the `onStateChange` callback with `'unauthenticated'`
- Optionally revoke tokens server-side

### getAccessToken

```typescript
getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
```

Get a valid access token. Should:
- Return the cached token if still valid
- Silently refresh if expired
- Return `null` if not authenticated

### getUser

```typescript
getUser(): AuthUser | null;
```

Synchronous getter for the current user. Returns `null` if not authenticated.

### isAuthenticated

```typescript
isAuthenticated(): boolean;
```

Synchronous check for authentication status.

### onStateChange

```typescript
onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void;
```

Subscribe to auth state changes. Returns an unsubscribe function. The callback receives:
- `state` — the new `AuthState`
- `user` — the `AuthUser` (only when `state === 'authenticated'`)

---

## Implementing a Custom Adapter

### Example: API Key Adapter

```typescript
class ApiKeyAdapter implements AuthAdapter {
  private apiKey: string;
  private user: AuthUser | null = null;
  private stateCallback?: (state: AuthState, user?: AuthUser) => void;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async initialize() {
    const res = await fetch('/api/validate', {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    });
    if (res.ok) {
      this.user = await res.json();
      this.stateCallback?.('authenticated', this.user!);
    } else {
      this.stateCallback?.('unauthenticated');
    }
  }

  async login() {
    // API key auth doesn't have a login flow
    throw new Error('API key authentication does not support interactive login');
  }

  async logout() {
    this.user = null;
    this.stateCallback?.('unauthenticated');
  }

  async getAccessToken() {
    if (!this.user) return null;
    return { token: this.apiKey, tokenType: 'Bearer' };
  }

  getUser() { return this.user; }
  isAuthenticated() { return this.user !== null; }

  onStateChange(callback: (state: AuthState, user?: AuthUser) => void) {
    this.stateCallback = callback;
    return () => { this.stateCallback = undefined; };
  }
}
```

### Key Implementation Rules

1. **Always call the state callback** when auth state changes
2. **Subscribe before init** is guaranteed by `AuthProvider` — you can emit from `initialize()`
3. **Don't throw from normal operations** unless truly exceptional — set error state via callback instead
4. **Return the unsubscribe function** from `onStateChange`
5. **Handle token refresh silently** inside `getAccessToken()`
