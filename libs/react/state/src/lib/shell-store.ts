/**
 * @code-framez/react/state
 *
 * Zustand-based state management for the Code Framez shell.
 * Provides a centralized store for pane layouts, view instances,
 * and the component registry.
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type {
  PaneType,
  PaneState,
  PaneConfig,
  ShellState,
  ShellActions,
  ViewComponentRegistration,
  ViewLaunchConfig,
  ViewInstance,
  ViewId,
  ShellEvent,
  ShellEventType,
  ShellEventListener,
} from '@code-framez/core/types';

// ─── Default Pane Configurations ─────────────────────────────

const defaultPaneConfigs: Record<PaneType, PaneConfig> = {
  nav: {
    paneType: 'nav',
    arrangement: 'tabs-top',
    visible: true,
    defaultSize: '280px',
    minSize: 200,
    maxSize: 500,
  },
  main: {
    paneType: 'main',
    arrangement: 'tabs-top',
    visible: true,
  },
  search: {
    paneType: 'search',
    arrangement: 'tabs-top',
    visible: false,
    defaultSize: '350px',
    minSize: 250,
    maxSize: 600,
  },
  right: {
    paneType: 'right',
    arrangement: 'tabs-top',
    visible: false,
    defaultSize: '300px',
    minSize: 200,
    maxSize: 600,
  },
  bottom: {
    paneType: 'bottom',
    arrangement: 'tabs-top',
    visible: false,
    defaultSize: '250px',
    minSize: 150,
    maxSize: 500,
  },
};

function createDefaultPaneState(config: PaneConfig): PaneState {
  return {
    config,
    viewInstances: [],
    activeViewId: undefined,
  };
}

function createInitialShellState(): ShellState {
  const panes = {} as Record<PaneType, PaneState>;
  for (const [key, config] of Object.entries(defaultPaneConfigs)) {
    panes[key as PaneType] = createDefaultPaneState(config);
  }
  return {
    panes,
    viewComponentRegistry: {},
    activePaneType: 'main',
  };
}

// ─── Event System ────────────────────────────────────────────

const eventListeners: Set<ShellEventListener> = new Set();

function emitEvent(type: ShellEventType, payload: Record<string, unknown>): void {
  const event: ShellEvent = {
    type,
    timestamp: Date.now(),
    payload,
  };
  eventListeners.forEach((listener) => {
    try {
      listener(event);
    } catch (err) {
      console.error('[code-framez] Event listener error:', err);
    }
  });
}

export function onShellEvent(listener: ShellEventListener): () => void {
  eventListeners.add(listener);
  return () => {
    eventListeners.delete(listener);
  };
}

// ─── Store Definition ────────────────────────────────────────

export interface ShellStore extends ShellState, ShellActions {}

export const useShellStore = create<ShellStore>()(
  immer((set, get) => ({
    // ── Initial State ──
    ...createInitialShellState(),

    // ── Actions ──

    registerViewComponent(registration: ViewComponentRegistration): void {
      set((state) => {
        state.viewComponentRegistry[registration.componentKey] = registration;
      });

      // Auto-launch startup views
      if (registration.launchAtStartup) {
        const store = get();
        store.launchView({
          componentKey: registration.componentKey,
          paneType: registration.paneType,
          displayText: registration.displayText,
          displayIcon: registration.displayIcon,
        });
      }
    },

    registerViewComponents(registrations: ViewComponentRegistration[]): void {
      set((state) => {
        for (const reg of registrations) {
          state.viewComponentRegistry[reg.componentKey] = reg;
        }
      });

      // Auto-launch startup views after all registered
      const store = get();
      for (const reg of registrations) {
        if (reg.launchAtStartup) {
          store.launchView({
            componentKey: reg.componentKey,
            paneType: reg.paneType,
            displayText: reg.displayText,
            displayIcon: reg.displayIcon,
          });
        }
      }
    },

    launchView(config: ViewLaunchConfig): ViewId {
      const viewId = uuidv4();
      const now = Date.now();

      const viewInstance: ViewInstance = {
        viewId,
        componentKey: config.componentKey,
        paneType: config.paneType,
        displayText: config.displayText,
        displayIcon: config.displayIcon,
        launchState: 'dynamic',
        viewState: 'active',
        componentProps: config.componentProps,
        entityType: config.entityType,
        createdAt: now,
      };

      set((state) => {
        const pane = state.panes[config.paneType];
        if (pane) {
          pane.viewInstances.push(viewInstance);
          pane.activeViewId = viewId;

          // Auto-show pane if hidden
          if (!pane.config.visible) {
            pane.config.visible = true;
          }
        }
      });

      emitEvent('view-launched', { viewId, paneType: config.paneType, componentKey: config.componentKey });
      return viewId;
    },

    closeView(viewId: ViewId): void {
      set((state) => {
        for (const paneType of Object.keys(state.panes) as PaneType[]) {
          const pane = state.panes[paneType];
          const idx = pane.viewInstances.findIndex((v) => v.viewId === viewId);
          if (idx !== -1) {
            pane.viewInstances.splice(idx, 1);

            // Update active view if needed
            if (pane.activeViewId === viewId) {
              if (pane.viewInstances.length > 0) {
                // Activate the nearest tab
                const newIdx = Math.min(idx, pane.viewInstances.length - 1);
                pane.activeViewId = pane.viewInstances[newIdx].viewId;
              } else {
                pane.activeViewId = undefined;
              }
            }

            emitEvent('view-closed', { viewId, paneType });
            break;
          }
        }
      });
    },

    moveView(viewId: ViewId, targetPane: PaneType): void {
      set((state) => {
        // Find the view in its current pane
        for (const paneType of Object.keys(state.panes) as PaneType[]) {
          const pane = state.panes[paneType];
          const idx = pane.viewInstances.findIndex((v) => v.viewId === viewId);

          if (idx !== -1) {
            if (paneType === targetPane) return; // Already there

            // Remove from source pane
            const [view] = pane.viewInstances.splice(idx, 1);

            // Update source pane active view
            if (pane.activeViewId === viewId) {
              pane.activeViewId = pane.viewInstances[0]?.viewId;
            }

            // Add to target pane
            view.paneType = targetPane;
            const target = state.panes[targetPane];
            target.viewInstances.push(view);
            target.activeViewId = viewId;

            // Auto-show target pane
            if (!target.config.visible) {
              target.config.visible = true;
            }

            emitEvent('view-moved', { viewId, fromPane: paneType, toPane: targetPane });
            break;
          }
        }
      });
    },

    setActiveView(paneType: PaneType, viewId: ViewId): void {
      set((state) => {
        const pane = state.panes[paneType];
        if (pane) {
          const exists = pane.viewInstances.some((v) => v.viewId === viewId);
          if (exists) {
            pane.activeViewId = viewId;
            state.activePaneType = paneType;
            emitEvent('view-activated', { viewId, paneType });
          }
        }
      });
    },

    togglePane(paneType: PaneType): void {
      set((state) => {
        const pane = state.panes[paneType];
        if (pane) {
          pane.config.visible = !pane.config.visible;
          emitEvent('pane-toggled', { paneType, visible: pane.config.visible });
        }
      });
    },

    setPaneVisible(paneType: PaneType, visible: boolean): void {
      set((state) => {
        const pane = state.panes[paneType];
        if (pane) {
          pane.config.visible = visible;
          emitEvent('pane-toggled', { paneType, visible });
        }
      });
    },

    setActivePane(paneType: PaneType): void {
      set((state) => {
        state.activePaneType = paneType;
        emitEvent('pane-activated', { paneType });
      });
    },

    updateViewState(viewId: ViewId, updates: Partial<ViewInstance>): void {
      set((state) => {
        for (const paneType of Object.keys(state.panes) as PaneType[]) {
          const pane = state.panes[paneType];
          const view = pane.viewInstances.find((v) => v.viewId === viewId);
          if (view) {
            Object.assign(view, updates);
            break;
          }
        }
      });
    },

    resetShell(): void {
      set(createInitialShellState());
      emitEvent('shell-reset', {});
    },
  }))
);

// ─── Selector Hooks ──────────────────────────────────────────

/** Get the state of a specific pane */
export const usePaneState = (paneType: PaneType) =>
  useShellStore((state) => state.panes[paneType]);

/** Get the active view in a pane */
export const useActiveView = (paneType: PaneType) =>
  useShellStore((state) => {
    const pane = state.panes[paneType];
    if (!pane?.activeViewId) return undefined;
    return pane.viewInstances.find((v) => v.viewId === pane.activeViewId);
  });

/** Get all views in a pane */
export const usePaneViews = (paneType: PaneType) =>
  useShellStore((state) => state.panes[paneType]?.viewInstances ?? []);

/** Get a specific view by ID */
export const useViewInstance = (viewId: ViewId) =>
  useShellStore((state) => {
    for (const pane of Object.values(state.panes)) {
      const view = pane.viewInstances.find((v) => v.viewId === viewId);
      if (view) return view;
    }
    return undefined;
  });

/** Get all registered view components */
export const useViewComponentRegistry = () =>
  useShellStore((state) => state.viewComponentRegistry);

/** Get a specific registration */
export const useViewComponentRegistration = (componentKey: string) =>
  useShellStore((state) => state.viewComponentRegistry[componentKey]);

/** Get entity menu items for a given entity type */
export const useEntityMenuItems = (entityType: string) =>
  useShellStore((state) => {
    const items: Array<{ componentKey: string; menuText: string; menuIcon?: string; order: number }> = [];
    for (const reg of Object.values(state.viewComponentRegistry)) {
      if (reg.entityMenu && reg.entityMenu.entityTypes.includes(entityType)) {
        items.push({
          componentKey: reg.componentKey,
          menuText: reg.entityMenu.menuText,
          menuIcon: reg.entityMenu.menuIcon,
          order: reg.entityMenu.order ?? 100,
        });
      }
    }
    return items.sort((a, b) => a.order - b.order);
  });
