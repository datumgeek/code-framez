# 08-03 — Styling Patterns

## Overview

Code Framez uses MUI's `sx` prop as the primary styling mechanism. This document describes the conventions used throughout the codebase.

---

## The sx Prop

MUI's `sx` prop provides a shorthand for applying styles with theme-aware values:

```tsx
<Box sx={{
  bgcolor: 'background.paper',     // theme.palette.background.paper
  color: 'text.primary',           // theme.palette.text.primary
  p: 2,                            // padding: theme.spacing(2) = 16px
  borderRadius: 1,                 // theme.shape.borderRadius * 1
}} />
```

---

## Spacing System

MUI spacing is based on an 8px grid. The `sx` shorthand properties use multipliers:

| sx Value | Pixels |
|----------|--------|
| `0.5` | 4px |
| `1` | 8px |
| `1.5` | 12px |
| `2` | 16px |
| `3` | 24px |

Common shorthand: `p` (padding), `m` (margin), `px`/`py` (horizontal/vertical), `gap`.

---

## Layout Patterns

### Full-Height Flex Container

Used by the Shell and Pane components:

```tsx
sx={{
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}}
```

### Centered Content

Used by empty states and ViewNotFound:

```tsx
sx={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}}
```

### Fixed Sidebar

Used by nav, search, and right panes:

```tsx
sx={{
  width: navWidth,          // fixed pixel width
  minWidth: navWidth,       // prevents shrinking
  borderRight: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}}
```

---

## Tab Styling

Tabs use compact styling for a professional appearance:

```tsx
sx={{
  minHeight: 36,
  '& .MuiTab-root': {
    minHeight: 36,
    py: 0.5,
    px: 1.5,
    fontSize: '0.8rem',
    textTransform: 'none',  // Preserve original case
  },
}}
```

---

## Button Conventions

- `size="small"` for toolbar buttons
- `textTransform: 'none'` to avoid all-caps
- `fontSize: '0.8rem'` for compact toolbar appearance
- Icon buttons use `opacity` transitions for hover effects

---

## Responsive Colour References

Instead of hardcoding colors, use theme references:

```tsx
// ✅ Good — theme-aware
sx={{ color: 'text.secondary', bgcolor: 'background.paper' }}

// ❌ Avoid — breaks with theme changes
sx={{ color: '#9ca3af', bgcolor: '#1e293b' }}
```

---

## View Component Styling

View components should use standard patterns for filling their container:

```tsx
// Recommended wrapper for view components
<Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
  {/* content */}
</Box>
```

- `height: '100%'` fills the tab content area
- `overflow: 'auto'` enables scrolling for long content
- `p: 2` provides consistent padding
