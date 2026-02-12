# 11-08 — Auth React API

**Package:** `@code-framez/auth/react`
**Source:** `libs/auth/react/src/index.ts`

## Components

### AuthProvider

```typescript
function AuthProvider(props: AuthProviderProps): JSX.Element;

interface AuthProviderProps {
  adapter: AuthAdapter;
  children: React.ReactNode;
}
```

### AuthBanner

```typescript
function AuthBanner(): JSX.Element;
```

MUI toolbar component showing auth state (spinner / sign-in button / avatar menu / retry button).

## Interfaces

### AuthAdapter

```typescript
interface AuthAdapter {
  initialize(): Promise<void>;
  login(options?: LoginOptions): Promise<void>;
  logout(options?: LogoutOptions): Promise<void>;
  getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
  getUser(): AuthUser | null;
  isAuthenticated(): boolean;
  onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void;
}
```

## Classes

### MockAuthAdapter

```typescript
class MockAuthAdapter implements AuthAdapter {
  constructor(mockUser?: AuthUser);
  initialize(): Promise<void>;
  login(options?: LoginOptions): Promise<void>;
  logout(options?: LogoutOptions): Promise<void>;
  getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
  getUser(): AuthUser | null;
  isAuthenticated(): boolean;
  onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void;
}
```

## Hooks

### useAuth

```typescript
function useAuth(): AuthContextValue;

interface AuthContextValue {
  state: AuthState;
  user: AuthUser | undefined;
  error: { code: string; message: string } | undefined;
  isLoading: boolean;
  login: (options?: LoginOptions) => Promise<void>;
  logout: (options?: LogoutOptions) => Promise<void>;
  getAccessToken: (scopes?: string[]) => Promise<AuthToken | null>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}
```

### useAuthUser

```typescript
function useAuthUser(): AuthUser | undefined;
```

### useAuthState

```typescript
function useAuthState(): AuthState;
```

### useIsAuthenticated

```typescript
function useIsAuthenticated(): boolean;
```
