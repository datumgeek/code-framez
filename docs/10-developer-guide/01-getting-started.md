# 10-01 — Getting Started

## Overview

This guide walks through setting up a new application using Code Framez.

---

## Prerequisites

- Node.js 20+
- npm 10+
- Familiarity with React and TypeScript

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/datumgeek/code-framez.git
cd code-framez
npm install
```

---

## Step 2: Understand the Structure

```
code-framez/
├── apps/demo/          ← Demo application (start here)
├── libs/
│   ├── core/
│   │   ├── types/      ← Framework-agnostic type definitions
│   │   └── auth-types/ ← Auth type definitions
│   ├── react/
│   │   ├── state/      ← Zustand shell store
│   │   └── view-host/  ← ViewHostProvider and component resolution
│   ├── react-material/
│   │   ├── shell/      ← Shell layout component
│   │   ├── pane/       ← Tabbed pane component
│   │   └── entity-menu/← Entity context menu
│   └── auth/
│       └── react/      ← AuthProvider, MockAuthAdapter, AuthBanner
```

---

## Step 3: Create Your App Component

The minimal app needs:

```tsx
import { Shell } from '@code-framez/react-material/shell';
import type { ShellConfig } from '@code-framez/react-material/shell';
import type { ViewComponentRegistration } from '@code-framez/core/types';
import type { ViewComponentMap } from '@code-framez/react/view-host';

// Your view component
function HelloView() {
  return <div style={{ padding: 24 }}>Hello, Code Framez!</div>;
}

// Register it
const views: ViewComponentRegistration[] = [
  {
    componentKey: 'hello',
    displayText: 'Hello',
    paneType: 'main',
    launchAtStartup: true,
  },
];

// Map key to component
const componentMap: ViewComponentMap = {
  'hello': HelloView,
};

// Configure and render the shell
const config: ShellConfig = {
  title: 'My App',
  views,
  componentMap,
};

export function App() {
  return <Shell config={config} />;
}
```

---

## Step 4: Add Authentication (Optional)

```tsx
import { AuthProvider, MockAuthAdapter, AuthBanner } from '@code-framez/auth/react';

const adapter = new MockAuthAdapter();

const config: ShellConfig = {
  title: 'My App',
  views,
  componentMap,
  authComponent: <AuthBanner />,
};

export function App() {
  return (
    <AuthProvider adapter={adapter}>
      <Shell config={config} />
    </AuthProvider>
  );
}
```

---

## Step 5: Start the Dev Server

```bash
npx vite --port 4200
```

Open http://localhost:4200.

---

## Step 6: Add More Views

Create new view components, register them, add them to the component map, and they'll appear in the shell.

See [10-02 Creating Views](02-creating-views.md) for detailed guidance.
