/**
 * @code-framez/core/auth-types
 *
 * Authentication and authorization type definitions.
 * Framework-agnostic types for the auth system.
 */

// ─── User Types ──────────────────────────────────────────────

/**
 * Authentication state of the current user.
 */
export type AuthState = 'initializing' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * Represents the currently authenticated user.
 */
export interface AuthUser {
  /** Unique user identifier from the identity provider */
  userId: string;
  /** Display name */
  displayName: string;
  /** Email address */
  email?: string;
  /** Avatar/profile picture URL */
  avatarUrl?: string;
  /** Roles assigned to this user */
  roles: string[];
  /** Raw claims/attributes from the identity provider */
  claims?: Record<string, unknown>;
}

/**
 * An access token for authenticating API requests.
 */
export interface AuthToken {
  /** The actual token string */
  token: string;
  /** When the token expires (Unix timestamp in ms) */
  expiresAt: number;
  /** Scopes granted by this token */
  scopes?: string[];
  /** Token type (usually 'Bearer') */
  tokenType: string;
}

// ─── Auth Provider Types ─────────────────────────────────────

/**
 * Supported authentication provider types.
 */
export type AuthProviderType = 'auth0' | 'msal' | 'keycloak' | 'oidc' | 'custom';

/**
 * Configuration for an authentication provider.
 */
export interface AuthProviderConfig {
  /** Provider type identifier */
  type: AuthProviderType;
  /** Provider display name */
  name: string;
  /** Client/Application ID */
  clientId: string;
  /** Authority/Issuer URL */
  authority: string;
  /** Redirect URI after login */
  redirectUri?: string;
  /** Post-logout redirect URI */
  postLogoutRedirectUri?: string;
  /** OAuth scopes to request */
  scopes?: string[];
  /** Audience (for Auth0) */
  audience?: string;
  /** Additional provider-specific options */
  options?: Record<string, unknown>;
}

// ─── Auth State ──────────────────────────────────────────────

/**
 * Complete authentication state.
 */
export interface AuthStateInfo {
  /** Current auth state */
  state: AuthState;
  /** Authenticated user info (if authenticated) */
  user?: AuthUser;
  /** Current access token */
  accessToken?: AuthToken;
  /** Error information if state is 'error' */
  error?: AuthError;
  /** Whether auth operations are in progress */
  isLoading: boolean;
}

/**
 * Authentication error.
 */
export interface AuthError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Original error from the provider */
  originalError?: unknown;
}

// ─── Auth Actions ────────────────────────────────────────────

/**
 * Actions for the auth system.
 */
export interface AuthActions {
  /** Initiate login flow */
  login(options?: LoginOptions): Promise<void>;
  /** Initiate logout flow */
  logout(options?: LogoutOptions): Promise<void>;
  /** Get the current access token (refreshing if needed) */
  getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
  /** Check if user has a specific role */
  hasRole(role: string): boolean;
  /** Check if user has any of the specified roles */
  hasAnyRole(roles: string[]): boolean;
  /** Check if user has all of the specified roles */
  hasAllRoles(roles: string[]): boolean;
}

export interface LoginOptions {
  /** Specific scopes to request */
  scopes?: string[];
  /** Redirect URI override */
  redirectUri?: string;
  /** Login hint (e.g., pre-fill email) */
  loginHint?: string;
  /** Additional parameters */
  extraParams?: Record<string, string>;
}

export interface LogoutOptions {
  /** Redirect URI after logout */
  postLogoutRedirectUri?: string;
  /** Whether to also logout from the identity provider */
  federated?: boolean;
}

// ─── RBAC Types ──────────────────────────────────────────────

/**
 * Permission entry for role-based access control.
 */
export interface Permission {
  /** Permission key */
  key: string;
  /** Human-readable description */
  description?: string;
  /** Roles that have this permission */
  roles: string[];
}

/**
 * API endpoint registration for token injection.
 */
export interface ApiEndpoint {
  /** Unique endpoint identifier */
  key: string;
  /** Base URL for the API */
  baseUrl: string;
  /** Scopes required to access this API */
  scopes: string[];
  /** Token injection strategy */
  tokenStrategy: 'auto' | 'manual' | 'none';
}
