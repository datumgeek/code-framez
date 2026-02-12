# 11-05 — Shell API

**Package:** `@code-framez/react-material/shell`
**Source:** `libs/react-material/shell/src/index.ts`

## Components

### Shell

```typescript
function Shell(props: { config: ShellConfig }): JSX.Element;
```

The root layout component. Wraps everything in MUI ThemeProvider, CssBaseline, and ViewHostProvider.

## Types

### ShellConfig

```typescript
interface ShellConfig {
  title: string;
  subtitle?: string;
  logo?: React.ReactNode;
  views: ViewComponentRegistration[];
  componentMap: ViewComponentMap;
  theme?: ReturnType<typeof createTheme>;
  bannerContent?: React.ReactNode;
  authComponent?: React.ReactNode;
  navWidth?: number;       // default: 280
  rightWidth?: number;     // default: 320
  bottomHeight?: number;   // default: 250
}
```
