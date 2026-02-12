# 02-06 — Auth Types

**Source:** `libs/core/auth-types/src/lib/auth-types.ts`

## Overview

Authentication types are defined in a separate package (`@code-framez/core/auth-types`) to decouple auth concerns from the core shell types. This allows applications that don't need authentication to skip the auth package entirely.

---

## AuthState

```typescript
type AuthState = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';
```

The finite set of authentication states.

| State | Meaning |
|-------|---------|
| `initializing` | Auth system is loading/checking stored credentials |
| `authenticated` | User is signed in and has a valid session |
| `unauthenticated` | No active session (welcome state or post-logout) |
| `error` | Authentication failed (bad credentials, network error, etc.) |

### State Transitions

```
                   ┌────────────┐
                   │initializing│
                   └──────┬─────┘
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       ┌──────────┐ ┌───────────┐ ┌─────┐
       │ authen-  │ │unauthen-  │ │error│
       │ ticated  │ │ticated    │ │     │
       └────┬─────┘ └─────┬─────┘ └──┬──┘
            │              │          │
            └──────►◄──────┘◄─────────┘
           (login/logout/retry)
```

---

## AuthUser

```typescript
interface AuthUser {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  roles?: string[];
  permissions?: string[];
  metadata?: Record<string, unknown>;
}
```

Represents the currently authenticated user.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique user identifier |
| `displayName` | `string` | Yes | User's display name |
| `email` | `string` | No | Email address |
| `avatarUrl` | `string` | No | URL for the user's avatar |
| `roles` | `string[]` | No | Role-based access control roles |
| `permissions` | `string[]` | No | Fine-grained permissions |
| `metadata` | `Record<string, unknown>` | No | Provider-specific additional data |

---

## AuthToken

```typescript
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
}
```

Token information for API authentication.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `accessToken` | `string` | Yes | JWT or opaque access token |
| `refreshToken` | `string` | No | Token for obtaining new access tokens |
| `expiresAt` | `number` | No | Unix timestamp (ms) when the token expires |
| `tokenType` | `string` | No | Token type (e.g., `'Bearer'`) |
| `scope` | `string` | No | OAuth scopes granted |

---

## AuthProviderType

```typescript
type AuthProviderType = 'oidc' | 'oauth2' | 'saml' | 'custom' | 'mock';
```

Discriminator for the authentication strategy.

| Type | Use Case |
|------|----------|
| `oidc` | OpenID Connect (e.g., Auth0, Keycloak, Azure AD) |
| `oauth2` | OAuth 2.0 (e.g., GitHub, Google) |
| `saml` | SAML 2.0 enterprise SSO |
| `custom` | Custom authentication backend |
| `mock` | Development/testing with `MockAuthAdapter` |

---

## AuthProviderConfig

```typescript
interface AuthProviderConfig {
  type: AuthProviderType;
  clientId?: string;
  authority?: string;
  redirectUri?: string;
  scopes?: string[];
  customConfig?: Record<string, unknown>;
}
```

Configuration passed to the `AuthProvider` to initialize the adapter.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `type` | `AuthProviderType` | Yes | Which auth strategy to use |
| `clientId` | `string` | No | OAuth/OIDC client ID |
| `authority` | `string` | No | Identity provider URL |
| `redirectUri` | `string` | No | Post-login redirect URI |
| `scopes` | `string[]` | No | Requested scopes |
| `customConfig` | `Record<string, unknown>` | No | Adapter-specific configuration |

---

## AuthStateInfo

```typescript
interface AuthStateInfo {
  state: AuthState;
  user: AuthUser | null;
  token: AuthToken | null;
  error: AuthError | null;
  lastAuthenticated?: number;
}
```

A complete snapshot of the current authentication state.

| Property | Type | Description |
|----------|------|-------------|
| `state` | `AuthState` | Current auth state |
| `user` | `AuthUser \| null` | Authenticated user or `null` |
| `token` | `AuthToken \| null` | Current auth tokens or `null` |
| `error` | `AuthError \| null` | Last error or `null` |
| `lastAuthenticated` | `number \| undefined` | Timestamp of last successful auth |

---

## AuthError

```typescript
interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

Structured error information from the auth system.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `code` | `string` | Yes | Machine-readable error code (e.g., `'INVALID_CREDENTIALS'`) |
| `message` | `string` | Yes | Human-readable description |
| `details` | `Record<string, unknown>` | No | Additional error context |

---

## AuthActions

```typescript
interface AuthActions {
  login: (options?: LoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => Promise<void>;
  refreshToken: () => Promise<AuthToken | null>;
  getAccessToken: () => Promise<string | null>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}
```

Imperative authentication actions exposed by the `useAuth()` hook.

| Method | Return | Description |
|--------|--------|-------------|
| `login(options?)` | `Promise<void>` | Trigger the login flow |
| `logout(options?)` | `Promise<void>` | End the session |
| `refreshToken()` | `Promise<AuthToken \| null>` | Refresh the access token |
| `getAccessToken()` | `Promise<string \| null>` | Get the current valid access token |
| `hasRole(role)` | `boolean` | Check if user has a specific role |
| `hasPermission(perm)` | `boolean` | Check if user has a specific permission |
| `hasAnyRole(roles)` | `boolean` | Check if user has any of the given roles |

---

## LoginOptions

```typescript
interface LoginOptions {
  username?: string;
  password?: string;
  provider?: string;
  scopes?: string[];
  prompt?: 'login' | 'consent' | 'select_account';
  redirectUri?: string;
  state?: string;
}
```

Options passed to `login()`. Relevant properties depend on the auth adapter.

---

## LogoutOptions

```typescript
interface LogoutOptions {
  redirectUri?: string;
  revokeToken?: boolean;
  clearLocalData?: boolean;
}
```

Options passed to `logout()`.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `redirectUri` | `string` | — | Where to redirect after logout |
| `revokeToken` | `boolean` | — | Whether to revoke the token server-side |
| `clearLocalData` | `boolean` | — | Whether to clear all local auth data |

---

## Permission

```typescript
interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}
```

A fine-grained permission for RBAC.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `resource` | `string` | Yes | The resource being protected (e.g., `'users'`) |
| `action` | `string` | Yes | The action (e.g., `'read'`, `'write'`, `'delete'`) |
| `conditions` | `Record<string, unknown>` | No | Additional constraints (e.g., `{ ownOnly: true }`) |

---

## ApiEndpoint

```typescript
interface ApiEndpoint {
  url: string;
  method?: string;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}
```

Describes a protected API endpoint for declarative access control.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `url` | `string` | — | Endpoint URL or path pattern |
| `method` | `string` | `'GET'` | HTTP method |
| `requiresAuth` | `boolean` | `false` | Whether a valid session is required |
| `requiredRoles` | `string[]` | `[]` | Roles required for access |
| `requiredPermissions` | `string[]` | `[]` | Permissions required for access |

---

## Package Relationship

```
@code-framez/core/auth-types      Pure type definitions (no runtime deps)
         │
         ▼
@code-framez/auth/react            Runtime auth provider + adapter
         │
         ▼
@code-framez/react-material/shell  AuthBanner UI in the toolbar
```

The types package has **zero runtime dependencies** — it's purely TypeScript interfaces and type aliases, enabling tree-shaking and lightweight consumption.
