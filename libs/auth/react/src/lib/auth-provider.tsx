/**
 * @code-framez/auth/react
 *
 * React authentication context and hooks.
 * Provides a framework-agnostic auth layer that can be backed
 * by Auth0, MSAL, Keycloak, or custom providers.
 */

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type {
  AuthState,
  AuthUser,
  AuthToken,
  AuthActions,
  AuthStateInfo,
  AuthProviderConfig,
  LoginOptions,
  LogoutOptions,
} from '@code-framez/core/auth-types';

// ─── Auth Adapter Interface ──────────────────────────────────

/**
 * Interface that auth provider adapters must implement.
 * Adapters translate between the generic auth interface and specific providers.
 */
export interface AuthAdapter {
  /** Initialize the adapter */
  initialize(): Promise<void>;
  /** Perform login */
  login(options?: LoginOptions): Promise<void>;
  /** Perform logout */
  logout(options?: LogoutOptions): Promise<void>;
  /** Get access token */
  getAccessToken(scopes?: string[]): Promise<AuthToken | null>;
  /** Get current user */
  getUser(): AuthUser | null;
  /** Check if authenticated */
  isAuthenticated(): boolean;
  /** Subscribe to auth state changes */
  onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void;
}

// ─── Context ─────────────────────────────────────────────────

interface AuthContextValue extends AuthStateInfo, AuthActions {}

const AuthContext = createContext<AuthContextValue>({
  state: 'initializing',
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  getAccessToken: async () => null,
  hasRole: () => false,
  hasAnyRole: () => false,
  hasAllRoles: () => false,
});

// ─── Provider ────────────────────────────────────────────────

export interface AuthProviderProps {
  /** Auth adapter (e.g., Auth0Adapter, MSALAdapter) */
  adapter: AuthAdapter;
  /** Children */
  children: React.ReactNode;
}

export function AuthProvider({ adapter, children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>('initializing');
  const [user, setUser] = useState<AuthUser | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | undefined>();

  // Initialize adapter on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function init() {
      try {
        unsubscribe = adapter.onStateChange((state, user) => {
          setAuthState(state);
          setUser(user);
          setIsLoading(false);
        });

        await adapter.initialize();
      } catch (err) {
        setAuthState('error');
        setError({
          code: 'INIT_ERROR',
          message: err instanceof Error ? err.message : 'Failed to initialize auth',
        });
        setIsLoading(false);
      }
    }

    init();
    return () => unsubscribe?.();
  }, [adapter]);

  const login = useCallback(
    async (options?: LoginOptions) => {
      setIsLoading(true);
      try {
        await adapter.login(options);
      } catch (err) {
        setError({
          code: 'LOGIN_ERROR',
          message: err instanceof Error ? err.message : 'Login failed',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [adapter]
  );

  const logout = useCallback(
    async (options?: LogoutOptions) => {
      setIsLoading(true);
      try {
        await adapter.logout(options);
      } catch (err) {
        setError({
          code: 'LOGOUT_ERROR',
          message: err instanceof Error ? err.message : 'Logout failed',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [adapter]
  );

  const getAccessToken = useCallback(
    async (scopes?: string[]) => {
      return adapter.getAccessToken(scopes);
    },
    [adapter]
  );

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

  const value = useMemo<AuthContextValue>(
    () => ({
      state: authState,
      user,
      error,
      isLoading,
      login,
      logout,
      getAccessToken,
      hasRole,
      hasAnyRole,
      hasAllRoles,
    }),
    [authState, user, error, isLoading, login, logout, getAccessToken, hasRole, hasAnyRole, hasAllRoles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hooks ───────────────────────────────────────────────────

/** Access the full auth context */
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/** Get the current user (or undefined) */
export function useAuthUser(): AuthUser | undefined {
  return useContext(AuthContext).user;
}

/** Get the current auth state */
export function useAuthState(): AuthState {
  return useContext(AuthContext).state;
}

/** Check if the user is authenticated */
export function useIsAuthenticated(): boolean {
  return useContext(AuthContext).state === 'authenticated';
}

// ─── Mock Adapter (for development) ─────────────────────────

/**
 * A mock auth adapter for development and testing.
 * Simulates authentication without a real identity provider.
 */
export class MockAuthAdapter implements AuthAdapter {
  private stateCallback?: (state: AuthState, user?: AuthUser) => void;
  private authenticated = false;
  private mockUser: AuthUser;

  constructor(
    mockUser: AuthUser = {
      userId: 'mock-user-1',
      displayName: 'Dev User',
      email: 'dev@example.com',
      roles: ['admin', 'user'],
    }
  ) {
    this.mockUser = mockUser;
  }

  async initialize(): Promise<void> {
    // Simulate initialization delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.stateCallback?.('unauthenticated');
  }

  async login(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.authenticated = true;
    this.stateCallback?.('authenticated', this.mockUser);
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    this.authenticated = false;
    this.stateCallback?.('unauthenticated');
  }

  async getAccessToken(): Promise<AuthToken | null> {
    if (!this.authenticated) return null;
    return {
      token: 'mock-access-token-' + Date.now(),
      expiresAt: Date.now() + 3600 * 1000,
      tokenType: 'Bearer',
    };
  }

  getUser(): AuthUser | null {
    return this.authenticated ? this.mockUser : null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  onStateChange(callback: (state: AuthState, user?: AuthUser) => void): () => void {
    this.stateCallback = callback;
    return () => {
      this.stateCallback = undefined;
    };
  }
}
