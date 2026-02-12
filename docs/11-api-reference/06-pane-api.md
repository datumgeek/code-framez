# 11-06 — Pane API

**Package:** `@code-framez/react-material/pane`
**Source:** `libs/react-material/pane/src/index.ts`

## Components

### Pane

```typescript
function Pane(props: PaneProps): JSX.Element | null;
```

Renders a tabbed container for the specified pane type. Returns `null` if the pane is hidden.

## Types

### PaneProps

```typescript
interface PaneProps {
  paneType: PaneType;
  className?: string;
  sx?: Record<string, unknown>;
}
```
