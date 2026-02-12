# 08-02 — Custom Themes

## Overview

Override the default theme by passing a custom MUI theme via `ShellConfig.theme`.

---

## Creating a Custom Theme

```typescript
import { createTheme } from '@mui/material';

const myTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    fontSize: 14,
  },
  shape: {
    borderRadius: 8,
  },
});
```

---

## Applying the Theme

```tsx
const shellConfig: ShellConfig = {
  title: 'My App',
  views: [...],
  componentMap: {...},
  theme: myTheme,  // ← overrides the default dark theme
};

<Shell config={shellConfig} />
```

---

## Light Mode

Switch to light mode by setting `palette.mode: 'light'`. MUI will automatically adjust text colors, dividers, and elevation shadows for light backgrounds.

---

## Extending the Default Theme

To modify specific aspects while keeping defaults:

```typescript
import { createTheme } from '@mui/material';

// Start from the default palette and override selectively
const customTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00bcd4' },  // Only change primary color
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
  },
});
```

---

## Theme Tokens Used by Shell Components

| Component | Theme Tokens Used |
|-----------|-------------------|
| AppBar | `background.paper`, `divider` |
| Tab bar | `background.paper`, `divider` |
| Toggle buttons (active) | `primary.main` |
| Toggle buttons (inactive) | `text.secondary` |
| Typography (title) | `text.primary` |
| Typography (subtitle) | `text.secondary` |
| Empty pane text | `text.disabled` |
| AuthBanner avatar | User-provided `avatarUrl` or `primary.main` |
| Pane borders | `divider` |

When customizing, ensure adequate contrast between `background.paper` and `text.primary` / `text.secondary`.
