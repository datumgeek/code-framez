/**
 * Code Framez DaisyUI Demo Application
 *
 * Demonstrates the full platform capabilities using DaisyUI + Tailwind CSS:
 * - Multi-pane layout (nav, main, search, right, bottom)
 * - View component registry and dynamic launching
 * - Entity navigation / context menus
 * - Auth framework with mock adapter
 * - DaisyUI-based shell components
 */

import React, { useMemo } from 'react';
import type { ViewComponentRegistration } from '@code-framez/core/types';
import type { ViewComponentMap } from '@code-framez/react/view-host';
import { Shell } from '@code-framez/react-daisyui/shell';
import type { ShellConfig } from '@code-framez/react-daisyui/shell';
import { AuthProvider, MockAuthAdapter } from '@code-framez/auth/react';
import { AuthBanner } from '@code-framez/react-daisyui/auth-banner';

// ─── View Components ─────────────────────────────────────────
import { WelcomeDashboard } from './views/welcome-dashboard';
import { NavExplorer } from './views/nav-explorer';
import { UserList } from './views/user-list';
import { UserDetail } from './views/user-detail';
import { AnalyticsView } from './views/analytics-view';
import { SearchView } from './views/search-view';
import { ProjectExplorer, MapView, SettingsView } from './views/placeholder-views';

// ─── View Registrations ──────────────────────────────────────

const viewRegistrations: ViewComponentRegistration[] = [
  // Nav Pane
  {
    componentKey: 'nav-explorer',
    displayText: 'Explorer',
    displayIcon: 'folder',
    paneType: 'nav',
    launchAtStartup: true,
    order: 1,
  },

  // Main Pane
  {
    componentKey: 'welcome-dashboard',
    displayText: 'Dashboard',
    displayIcon: 'dashboard',
    paneType: 'main',
    launchAtStartup: true,
    order: 1,
  },
  {
    componentKey: 'user-list',
    displayText: 'Users',
    displayIcon: 'people',
    paneType: 'main',
    order: 2,
    entityTypes: ['user'],
  },
  {
    componentKey: 'user-detail',
    displayText: 'User Detail',
    displayIcon: 'person',
    paneType: 'main',
    order: 3,
    entityTypes: ['user'],
    entityMenu: {
      menuText: 'View User Detail',
      menuIcon: '👤',
      order: 1,
      entityTypes: ['user'],
    },
  },
  {
    componentKey: 'analytics-view',
    displayText: 'Analytics',
    displayIcon: 'bar_chart',
    paneType: 'main',
    order: 4,
  },
  {
    componentKey: 'project-explorer',
    displayText: 'Projects',
    displayIcon: 'folder',
    paneType: 'main',
    order: 5,
  },
  {
    componentKey: 'map-view',
    displayText: 'Map',
    displayIcon: 'map',
    paneType: 'main',
    order: 6,
  },
  {
    componentKey: 'settings-view',
    displayText: 'Settings',
    displayIcon: 'settings',
    paneType: 'main',
    order: 7,
  },

  // Search Pane
  {
    componentKey: 'search-view',
    displayText: 'Search',
    displayIcon: 'search',
    paneType: 'search',
    launchAtStartup: true,
    order: 1,
  },
];

// ─── Component Map ───────────────────────────────────────────

const componentMap: ViewComponentMap = {
  'nav-explorer': NavExplorer,
  'welcome-dashboard': WelcomeDashboard,
  'user-list': UserList,
  'user-detail': UserDetail,
  'analytics-view': AnalyticsView,
  'search-view': SearchView,
  'project-explorer': ProjectExplorer,
  'map-view': MapView,
  'settings-view': SettingsView,
};

// ─── Auth Adapter ────────────────────────────────────────────

const authAdapter = new MockAuthAdapter({
  userId: 'demo-user-1',
  displayName: 'Demo User',
  email: 'demo@code-framez.dev',
  roles: ['admin', 'user'],
});

// ─── App Component ───────────────────────────────────────────

export function App() {
  const shellConfig = useMemo<ShellConfig>(
    () => ({
      title: 'Code Framez',
      subtitle: 'DaisyUI Demo',
      daisyTheme: 'night',
      views: viewRegistrations,
      componentMap,
      authComponent: <AuthBanner />,
      navWidth: 260,
      rightWidth: 340,
      bottomHeight: 220,
    }),
    []
  );

  return (
    <AuthProvider adapter={authAdapter}>
      <Shell config={shellConfig} />
    </AuthProvider>
  );
}
