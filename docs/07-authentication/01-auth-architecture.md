# 07-01 — Auth Architecture

**Source:** `libs/auth/react/src/lib/auth-provider.tsx`

## Overview

Code Framez uses an **adapter pattern** for authentication. The framework defines a generic `AuthAdapter` interface, and applications supply a concrete implementation (Auth0, MSAL, Keycloak, or the included `MockAuthAdapter`).

---

## Architecture

```
┌────────────────────────────────────────────────┐
│                Application                      │
│                                                 │
│  const adapter = new Auth0Adapter(config);      │
│  <AuthProvider adapter={adapter}>               │
│    <Shell config={...} />                       │
│  </AuthProvider>                                │
└─────────────────────┬──────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────┐
│          AuthProvider (React Context)            │
│                                                 │
│  State: authState, user, error, isLoading       │
│  Actions: login(), logout(), getAccessToken()   │
│  RBAC: hasRole(), hasAnyRole(), hasAllRoles()   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  AuthAdapter (interface)                 │   │
│  │  initialize(), login(), logout()         │   │
│  │  getAccessToken(), getUser()             │   │
│  │  isAuthenticated(), onStateChange()      │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────┬──────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    MockAdapter   Auth0Adapter  MSALAdapter
    (built-in)    (custom)      (custom)
```

---

## Auth State Machine

```
                    ┌────────────┐
   App mounts ───► │initializing│
                    └──────┬─────┘
              adapter.initialize()
              adapter.onStateChange()
              ┌───────────┼───────────┐
              ▼           ▼           ▼
       ┌──────────┐ ┌───────────┐ ┌─────┐
       │authen-   │ │unauthen-  │ │error│
       │ticated   │ │ticated    │ │     │
       └────┬─────┘ └─────┬─────┘ └──┬──┘
            │              │          │
            │   login()    │  login() │
            │◄─────────────┘◄─────────┘
            │              │
            │   logout()   │
            └─────────────►│
```

### States

| State | `isLoading` | `user` | Description |
|-------|------------|--------|-------------|
| `initializing` | `true` | `undefined` | Adapter is initializing |
| `authenticated` | `false` | `AuthUser` | User is signed in |
| `unauthenticated` | `false` | `undefined` | No active session |
| `error` | `false` | `undefined` | Initialization or auth failure |

---

## Separation of Concerns

| Layer | Package | Responsibility |
|-------|---------|----------------|
| Types | `@code-framez/core/auth-types` | Interface definitions (zero deps) |
| Provider | `@code-framez/auth/react` | React context, hooks, adapter interface, mock adapter |
| UI | `@code-framez/auth/react` | `AuthBanner` component |
| Shell | `@code-framez/react-material/shell` | Renders `authComponent` in toolbar |

The auth system is **optional**. Applications that don't need auth can omit the `AuthProvider` wrapper and the `authComponent` config.
