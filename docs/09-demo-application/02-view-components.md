# 09-02 — View Components

**Source:** `apps/demo/src/views/`

## Overview

The demo app includes 9 view components that demonstrate different platform capabilities. This document describes each one.

---

## 1. WelcomeDashboard

**File:** `views/welcome-dashboard.tsx`
**Pane:** main | **Startup:** Yes

A landing dashboard with stat cards and feature chips. Demonstrates:
- Reading `viewId` and `componentKey` from props
- Using MUI `Paper`, `Chip`, and typography components
- Responsive card layout with flexbox

---

## 2. NavExplorer

**File:** `views/nav-explorer.tsx`
**Pane:** nav | **Startup:** Yes

A sidebar navigation view that reads the view component registry and lists all main-pane views. Demonstrates:
- `useShellStore` to access `viewComponentRegistry` and `launchView`
- Dynamically discovering views from the registry
- Launching views programmatically on click

---

## 3. UserList

**File:** `views/user-list.tsx`
**Pane:** main | **Entity types:** `['user']`

A table of mock users with action buttons. Demonstrates:
- `useEntityMenu` hook for entity context menus
- `EntityMenu` component rendering
- Creating `EntityRef` objects from row data
- Passing entity data through the menu system

---

## 4. UserDetail

**File:** `views/user-detail.tsx`
**Pane:** main | **Entity menu:** View User Detail

A detail view that displays data from `componentProps`. Demonstrates:
- Receiving entity data via `componentProps`
- Reading `entityType`, `entityId`, and custom fields
- Dynamic display text based on entity data

This is the target of the entity menu action on user entities.

---

## 5. AnalyticsView

**File:** `views/analytics-view.tsx`
**Pane:** main

A metrics display with progress bars and stat numbers. Demonstrates:
- MUI `LinearProgress` for visual data display
- Purely decorative view with no store interaction
- `Paper` component for card layout

---

## 6. SearchView

**File:** `views/search-view.tsx`
**Pane:** search | **Startup:** Yes

A search interface that searches view component registrations. Demonstrates:
- `useViewComponentRegistry` selector
- Local state for search query
- Filtering the registry by display text
- Launching views from search results via `launchView`
- Side-pane view pattern

---

## 7. ProjectExplorer

**File:** `views/placeholder-views.tsx`
**Pane:** main

A placeholder view for project browsing. Displays a simple icon and "Coming Soon" message.

---

## 8. MapView

**File:** `views/placeholder-views.tsx`
**Pane:** main

A placeholder view for map display. Displays a map icon and "Coming Soon" message.

---

## 9. SettingsView

**File:** `views/placeholder-views.tsx`
**Pane:** main

A placeholder view for application settings. Displays a settings icon and "Coming Soon" message.

---

## Capability Matrix

| Component | Store Read | Store Write | Entity Menu | Auth | Shell Events |
|-----------|-----------|-------------|-------------|------|-------------|
| WelcomeDashboard | — | — | — | — | — |
| NavExplorer | `viewComponentRegistry` | `launchView` | — | — | — |
| UserList | — | — | `useEntityMenu` | — | — |
| UserDetail | — | — | — (target) | — | — |
| AnalyticsView | — | — | — | — | — |
| SearchView | `viewComponentRegistry` | `launchView` | — | — | — |
| ProjectExplorer | — | — | — | — | — |
| MapView | — | — | — | — | — |
| SettingsView | — | — | — | — | — |

---

## Placeholder Pattern

The three placeholder views (`ProjectExplorer`, `MapView`, `SettingsView`) share a common pattern and are defined in a single file:

```tsx
export function ProjectExplorer({ viewId }: ViewComponentProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ... }}>
      <span style={{ fontSize: 64 }}>📁</span>
      <Typography variant="h6">Project Explorer</Typography>
      <Typography variant="body2" color="text.secondary">Coming Soon</Typography>
    </Box>
  );
}
```

This pattern makes it easy to scaffold new views and fill them in later.
