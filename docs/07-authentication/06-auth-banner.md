# 07-06 — AuthBanner

**Source:** `libs/auth/react/src/lib/auth-banner.tsx`

## Overview

The `AuthBanner` is a MUI-based toolbar component that renders authentication UI appropriate to the current auth state. It is designed to be placed in the shell's toolbar via `ShellConfig.authComponent`.

---

## State-Based Rendering

| Auth State | UI Rendered |
|------------|-------------|
| `initializing` / `isLoading` | `CircularProgress` spinner (20px) |
| `unauthenticated` | "Sign In" button with `LoginIcon` |
| `authenticated` | User avatar with dropdown menu |
| `error` | "Retry Sign In" button (error color) |

---

## Initializing / Loading

```tsx
<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  <CircularProgress size={20} />
</Box>
```

A small spinner while the auth system initializes or a login/logout operation is in progress.

---

## Unauthenticated

```tsx
<Button
  size="small"
  variant="outlined"
  startIcon={<LoginIcon />}
  onClick={() => login()}
  sx={{ textTransform: 'none', fontSize: '0.8rem' }}
>
  Sign In
</Button>
```

Compact outlined button that triggers the adapter's login flow.

---

## Authenticated

When the user is signed in, an avatar button opens a dropdown:

```
┌────────────────────┐
│  [A]               │  ← Avatar button (28×28px)
└────────────────────┘
         │ click
         ▼
┌────────────────────┐
│  Demo User         │  ← displayName (disabled, header)
│  demo@example.com  │  ← email (disabled, header)
│────────────────────│
│  Roles: admin, user│  ← roles list (disabled)
│────────────────────│
│  🚪 Sign Out       │  ← logout action
└────────────────────┘
```

### Avatar

- Shows `user.avatarUrl` if available
- Falls back to the first character of `user.displayName` uppercased
- Tooltip shows `"displayName (email)"`
- 28×28px, 0.8rem font size

### Menu Items

1. **User info** (disabled): Display name and email
2. **Roles** (disabled): Comma-separated role list (shown if roles exist)
3. **Sign Out**: Calls `logout()` and closes the menu

---

## Error State

```tsx
<Button
  size="small"
  variant="outlined"
  color="error"
  startIcon={<LoginIcon />}
  onClick={() => login()}
  sx={{ textTransform: 'none', fontSize: '0.8rem' }}
>
  Retry Sign In
</Button>
```

An error-colored "Retry Sign In" button. Clicking triggers a fresh login attempt.

---

## Integration

```tsx
// In ShellConfig
const shellConfig: ShellConfig = {
  title: 'My App',
  views: [...],
  componentMap: {...},
  authComponent: <AuthBanner />,  // ← placed in toolbar
};
```

The `Shell` component renders `authComponent` as the last element in the toolbar, positioned to the right of the search/panel toggle buttons.

---

## Dependencies

The `AuthBanner` calls `useAuth()` internally, so it must be rendered within an `AuthProvider`. In the standard setup:

```
<AuthProvider adapter={...}>
  <Shell config={{ authComponent: <AuthBanner /> }}>
    ...
  </Shell>
</AuthProvider>
```

The `AuthProvider` wraps the `Shell`, and the `Shell` renders the `AuthBanner` inside the toolbar — all within the auth context.
