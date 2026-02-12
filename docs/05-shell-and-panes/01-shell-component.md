# 05-01 — Shell Component

**Source:** `libs/react-material/shell/src/lib/shell.tsx`

## Overview

The `Shell` is the root layout component. It orchestrates all five pane regions (nav, main, search, right, bottom), the toolbar/banner, and the MUI theme. Applications create a `ShellConfig` object and render `<Shell config={...} />`.

---

## Component Tree

```
<Shell config={shellConfig}>
  <ThemeProvider theme={...}>
    <CssBaseline />
    <ViewHostProvider componentMap={config.componentMap}>
      <ShellLayout config={config}>
        <AppBar>
          <Toolbar>
            ├── Nav toggle button
            ├── Logo + Title + Subtitle
            ├── Custom banner content
            ├── Search toggle button
            ├── Right panel toggle button
            └── Auth component
          </Toolbar>
        </AppBar>
        <Box (flex row)>
          ├── Nav Pane (left sidebar, conditional)
          ├── Center Area
          │   ├── Main Pane (flex fill)
          │   └── Bottom Pane (conditional)
          ├── Search Pane (conditional, right side)
          └── Right Pane (conditional, right side, hidden when search is visible)
        </Box>
      </ShellLayout>
    </ViewHostProvider>
  </ThemeProvider>
</Shell>
```

---

## ShellConfig

```typescript
export interface ShellConfig {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  views: ViewComponentRegistration[];
  componentMap: ViewComponentMap;
  theme?: ReturnType<typeof createTheme>;
  bannerContent?: React.ReactNode;
  authComponent?: React.ReactNode;
  navWidth?: number;
  rightWidth?: number;
  bottomHeight?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Application title in the toolbar |
| `subtitle` | `string` | — | Subtitle text next to the title |
| `logo` | `React.ReactNode` | — | Logo element (image, icon, etc.) |
| `views` | `ViewComponentRegistration[]` | — | All view registrations to register at mount |
| `componentMap` | `ViewComponentMap` | — | Map of component keys to React components |
| `theme` | `Theme` | `defaultTheme` | Custom MUI theme |
| `bannerContent` | `React.ReactNode` | — | Custom content between title and action buttons |
| `authComponent` | `React.ReactNode` | — | Auth UI rendered in the toolbar (e.g., `<AuthBanner />`) |
| `navWidth` | `number` | `280` | Navigation pane width in pixels |
| `rightWidth` | `number` | `320` | Right/search pane width in pixels |
| `bottomHeight` | `number` | `250` | Bottom pane height in pixels |

---

## Shell vs. ShellLayout

The component is split into two functions:

### Shell (outer)

Responsibilities:
- Apply MUI theme (custom or default)
- Inject `CssBaseline` for consistent CSS reset
- Wrap everything in `ViewHostProvider` with the component map

### ShellLayout (inner)

Responsibilities:
- Read from the Zustand store (pane visibility, actions)
- Register all view components on mount
- Render the toolbar with toggle buttons
- Render the five pane regions conditionally

This split exists because `useTheme()` must be called inside a `ThemeProvider`, so the layout needs to be a child of the theme provider.

---

## Toolbar Actions

The toolbar provides three toggle buttons:

| Button | Icon | Target Pane | Visual Feedback |
|--------|------|-------------|-----------------|
| Nav toggle | `MenuIcon` / `ChevronLeftIcon` | `nav` | Icon changes based on visibility |
| Search toggle | `SearchIcon` | `search` | Highlighted when visible |
| Right panel toggle | `ChevronRightIcon` | `right` | Highlighted when visible |

Toggle button icons use `primary.main` color when the pane is visible and `text.secondary` when hidden.

---

## View Registration

```typescript
useEffect(() => {
  if (views.length > 0) {
    registerViewComponents(views);
  }
}, []);
```

All view registrations from `ShellConfig.views` are registered in a single `useEffect` on mount. This ensures:
1. All registrations are committed to the store in one batch
2. Startup views (`launchAtStartup: true`) launch after all registrations are complete
3. The registry is fully populated before any component renders

---

## Pane Visibility Logic

```typescript
const navVisible = navPaneState?.config.visible ?? true;
const searchVisible = searchPaneState?.config.visible ?? false;
const rightVisible = rightPaneState?.config.visible ?? false;
const bottomVisible = bottomPaneState?.config.visible ?? false;
```

Each pane's visibility is read from the Zustand store. The layout conditionally renders pane containers based on these booleans.

**Special rule:** The right pane is hidden when the search pane is visible:

```tsx
{rightVisible && !searchVisible && (
  <Box ...>
    <Pane paneType="right" />
  </Box>
)}
```

This prevents two side panels from competing for space on the right side.

---

## Full-Screen Layout

The shell occupies the entire viewport:

```typescript
sx={{
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden',
}}
```

- `100vh × 100vw` fills the browser window
- `overflow: hidden` prevents scrollbars on the shell itself (individual panes handle their own scrolling)
- Column flex direction: toolbar on top, content below
