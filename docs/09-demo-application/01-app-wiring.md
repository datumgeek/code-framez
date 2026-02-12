# 09-01 — App Wiring

**Source:** `apps/demo/src/app.tsx`

## Overview

The demo app's `App` component is the glue that wires together registrations, component implementations, authentication, and the shell.

---

## Component Tree

```
<App>
  <AuthProvider adapter={MockAuthAdapter}>
    <Shell config={shellConfig}>
      <ThemeProvider>
        <CssBaseline />
        <ViewHostProvider componentMap={componentMap}>
          <ShellLayout>
            <!-- All panes render here -->
          </ShellLayout>
        </ViewHostProvider>
      </ThemeProvider>
    </Shell>
  </AuthProvider>
</App>
```

---

## Step 1: View Registrations

9 view registrations define what views exist and where they belong:

```typescript
const viewRegistrations: ViewComponentRegistration[] = [
  // Nav Pane (1 view)
  { componentKey: 'nav-explorer',       paneType: 'nav',    launchAtStartup: true },

  // Main Pane (6 views)
  { componentKey: 'welcome-dashboard',  paneType: 'main',   launchAtStartup: true },
  { componentKey: 'user-list',          paneType: 'main',   entityTypes: ['user'] },
  { componentKey: 'user-detail',        paneType: 'main',   entityMenu: { entityTypes: ['user'], ... } },
  { componentKey: 'analytics-view',     paneType: 'main'  },
  { componentKey: 'project-explorer',   paneType: 'main'  },
  { componentKey: 'map-view',           paneType: 'main'  },
  { componentKey: 'settings-view',      paneType: 'main'  },

  // Search Pane (1 view)
  { componentKey: 'search-view',        paneType: 'search', launchAtStartup: true },
];
```

### Startup Views

Three views have `launchAtStartup: true`:
- `nav-explorer` → opens in the nav pane
- `welcome-dashboard` → opens as the first tab in main
- `search-view` → opens in the search pane (pane is hidden until toggled)

### Entity Menu Registration

Only `user-detail` declares an `entityMenu`:
```typescript
entityMenu: {
  menuText: 'View User Detail',
  menuIcon: '👤',
  order: 1,
  entityTypes: ['user'],
}
```

---

## Step 2: Component Map

Maps component keys to actual React components:

```typescript
const componentMap: ViewComponentMap = {
  'nav-explorer':       NavExplorer,
  'welcome-dashboard':  WelcomeDashboard,
  'user-list':          UserList,
  'user-detail':        UserDetail,
  'analytics-view':     AnalyticsView,
  'search-view':        SearchView,
  'project-explorer':   ProjectExplorer,
  'map-view':           MapView,
  'settings-view':      SettingsView,
};
```

Every key in the registrations must have a corresponding entry here.

---

## Step 3: Auth Adapter

```typescript
const authAdapter = new MockAuthAdapter({
  userId: 'demo-user-1',
  displayName: 'Demo User',
  email: 'demo@code-framez.dev',
  roles: ['admin', 'user'],
});
```

The mock adapter simulates authentication with predefined user credentials.

---

## Step 4: Shell Config

```typescript
const shellConfig = useMemo<ShellConfig>(() => ({
  title: 'Code Framez',
  subtitle: 'Component Shell Platform',
  views: viewRegistrations,
  componentMap,
  authComponent: <AuthBanner />,
  navWidth: 260,
  rightWidth: 340,
  bottomHeight: 220,
}), []);
```

| Property | Value |
|----------|-------|
| Title | "Code Framez" |
| Subtitle | "Component Shell Platform" |
| Nav width | 260px |
| Right/search width | 340px |
| Bottom height | 220px |
| Auth | `<AuthBanner />` in toolbar |
| Theme | Default dark theme (not overridden) |

---

## Step 5: Rendering

```tsx
export function App() {
  return (
    <AuthProvider adapter={authAdapter}>
      <Shell config={shellConfig} />
    </AuthProvider>
  );
}
```

The `AuthProvider` wraps the `Shell` so that `AuthBanner` (rendered inside the shell's toolbar) can access the auth context.
