/**
 * @code-framez/react/view-host
 *
 * React context and component for resolving view component keys
 * to actual React components. This is the bridge between the shell's
 * view registry and actual React component rendering.
 */

import React, { createContext, useContext, useMemo, useCallback } from 'react';
import type { ViewComponentKey } from '@code-framez/core/types';

// ─── Component Map ───────────────────────────────────────────

/**
 * Props that every view component receives from the shell.
 */
export interface ViewComponentProps {
  /** Unique view instance ID */
  viewId: string;
  /** Component key from the registry */
  componentKey: string;
  /** Additional props from launchConfig */
  componentProps?: Record<string, unknown>;
  /** Entity type if applicable */
  entityType?: string;
  /** Entity ID if applicable */
  entityId?: string;
}

/**
 * A React component type that can be hosted in a view.
 */
export type ViewComponent = React.ComponentType<ViewComponentProps>;

/**
 * Map from component keys to actual React components.
 */
export type ViewComponentMap = Record<ViewComponentKey, ViewComponent>;

// ─── Context ─────────────────────────────────────────────────

interface ViewHostContextValue {
  componentMap: ViewComponentMap;
  getComponent: (key: ViewComponentKey) => ViewComponent | undefined;
}

const ViewHostContext = createContext<ViewHostContextValue>({
  componentMap: {},
  getComponent: () => undefined,
});

// ─── Provider ────────────────────────────────────────────────

export interface ViewHostProviderProps {
  /** Map of component keys to React components */
  componentMap: ViewComponentMap;
  children: React.ReactNode;
}

/**
 * Provides the component map to the shell so it can render view instances.
 * Wrap your shell with this provider and pass in all your registered components.
 */
export function ViewHostProvider({ componentMap, children }: ViewHostProviderProps) {
  const getComponent = useCallback(
    (key: ViewComponentKey) => componentMap[key],
    [componentMap]
  );

  const value = useMemo(
    () => ({ componentMap, getComponent }),
    [componentMap, getComponent]
  );

  return (
    <ViewHostContext.Provider value={value}>
      {children}
    </ViewHostContext.Provider>
  );
}

// ─── Hooks ───────────────────────────────────────────────────

/**
 * Hook to access the view component map.
 */
export function useViewHost() {
  return useContext(ViewHostContext);
}

/**
 * Hook to get a specific view component by key.
 */
export function useViewComponent(componentKey: ViewComponentKey): ViewComponent | undefined {
  const { getComponent } = useContext(ViewHostContext);
  return getComponent(componentKey);
}

// ─── Fallback Component ──────────────────────────────────────

/**
 * Shown when a component key can't be resolved.
 */
export function ViewNotFound({ componentKey }: { componentKey: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 24,
        color: '#666',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Component Not Found</div>
        <div style={{ fontSize: 13, marginTop: 8, color: '#999' }}>
          No component registered for key: <code>{componentKey}</code>
        </div>
      </div>
    </div>
  );
}
