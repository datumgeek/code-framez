# 11-02 — Auth Types API

**Package:** `@code-framez/core/auth-types`
**Source:** `libs/core/auth-types/src/index.ts`

## Types

### AuthState

```typescript
type AuthState = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';
```

### AuthUser

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

### AuthToken

```typescript
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
  scope?: string;
}
```

### AuthProviderType

```typescript
type AuthProviderType = 'oidc' | 'oauth2' | 'saml' | 'custom' | 'mock';
```

### AuthProviderConfig

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

### AuthStateInfo

```typescript
interface AuthStateInfo {
  state: AuthState;
  user: AuthUser | null;
  token: AuthToken | null;
  error: AuthError | null;
  lastAuthenticated?: number;
}
```

### AuthError

```typescript
interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### AuthActions

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

### LoginOptions

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

### LogoutOptions

```typescript
interface LogoutOptions {
  redirectUri?: string;
  revokeToken?: boolean;
  clearLocalData?: boolean;
}
```

### Permission

```typescript
interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}
```

### ApiEndpoint

```typescript
interface ApiEndpoint {
  url: string;
  method?: string;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  requiredPermissions?: string[];
}
```
