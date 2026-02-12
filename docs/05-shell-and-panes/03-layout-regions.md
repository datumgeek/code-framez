# 05-03 — Layout Regions

## Overview

The Code Framez shell divides the viewport into five named pane regions, each serving a distinct purpose. This document describes their spatial relationships, sizing, and behavior.

---

## Visual Layout

```
┌──────────────────────────────────────────────────────────┐
│                     Banner / Toolbar (42px)               │
├───────┬──────────────────────────────┬───────────────────┤
│       │                              │                   │
│  Nav  │          Main Pane           │   Search / Right  │
│  Pane │          (flex fill)         │       Pane        │
│ 280px │                              │      320px        │
│       │                              │                   │
│       ├──────────────────────────────┤                   │
│       │    Bottom Pane (250px)       │                   │
└───────┴──────────────────────────────┴───────────────────┘
```

---

## Pane Descriptions

### Nav Pane (Left Sidebar)

| Property | Value |
|----------|-------|
| Position | Left edge |
| Default width | 280px |
| Visible at start | Yes |
| Toggle | Toolbar nav button |
| Typical content | Navigation tree, file explorer, module list |

The nav pane collapses fully when hidden — the main pane expands to fill the freed space.

### Main Pane (Center)

| Property | Value |
|----------|-------|
| Position | Center, fills remaining horizontal space |
| Size | `flex: 1` (dynamic) |
| Visible at start | Yes |
| Toggle | Always visible |
| Typical content | Detail views, editors, dashboards |

The main pane is the primary workspace area. It cannot be hidden. Its width adjusts automatically as side panels open and close.

### Search Pane (Right Side)

| Property | Value |
|----------|-------|
| Position | Right edge |
| Default width | Uses `rightWidth` (320px) |
| Visible at start | No |
| Toggle | Toolbar search button |
| Typical content | Search results, filters |

When visible, it **replaces** the right pane (they share the same screen space).

### Right Pane (Right Side)

| Property | Value |
|----------|-------|
| Position | Right edge |
| Default width | Uses `rightWidth` (320px) |
| Visible at start | No |
| Toggle | Toolbar right panel button |
| Typical content | Properties panel, inspector, details |

Hidden when the search pane is visible. Only one right-side panel shows at a time.

### Bottom Pane

| Property | Value |
|----------|-------|
| Position | Below main pane, above the viewport bottom |
| Default height | `bottomHeight` (250px) |
| Visible at start | No |
| Toggle | Auto-shows when a view is launched into it |
| Typical content | Console output, logs, terminal |

The bottom pane spans the width of the center area (between nav and right panels).

---

## Flex Layout Model

The shell uses nested CSS flexbox:

```
Column flex (full viewport)
├── AppBar (fixed 42px)
└── Row flex (flex: 1)
    ├── Nav Box (fixed width, conditional)
    ├── Column flex (flex: 1, center area)
    │   ├── Main Pane (flex: 1)
    │   └── Bottom Pane (fixed height, conditional)
    ├── Search Pane (fixed width, conditional)
    └── Right Pane (fixed width, conditional, mutually exclusive with search)
```

---

## Pane Borders

Each pane has a 1px border on its shared edge using `theme.palette.divider`:

| Pane | Border |
|------|--------|
| Nav | `borderRight` |
| Bottom | `borderTop` |
| Search | `borderLeft` |
| Right | `borderLeft` |
| Main | No borders (surrounded by other panes) |

---

## Responsive Behaviour

Currently, the layout uses fixed pixel sizes. The main pane is the only "responsive" region — its width is determined by subtracting the widths of visible side panels from the viewport width.

| Viewport Change | Effect |
|----------------|--------|
| Window resize | Main pane grows/shrinks; side panels retain their fixed widths |
| Nav hidden | Main pane expands leftward |
| Search shown | Main pane shrinks; right pane hidden |
| Bottom shown | Main pane shrinks vertically |

---

## Mutual Exclusivity

The search and right panes share the right-side slot:

```tsx
{searchVisible && (
  <Pane paneType="search" />
)}
{rightVisible && !searchVisible && (
  <Pane paneType="right" />
)}
```

If both are set to visible in the store, the search pane takes priority. The right pane only renders when its visibility is `true` AND search visibility is `false`.

---

## Auto-Show Behaviour

When `launchView()` targets a hidden pane, the store automatically makes it visible:

```typescript
// Inside launchView action
if (!pane.config.visible) {
  pane.config.visible = true;
}
```

This means launching a view into the bottom pane will cause the bottom pane to appear without any explicit toggle call.
