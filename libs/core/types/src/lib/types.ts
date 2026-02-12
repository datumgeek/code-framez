/**
 * @code-framez/core/types
 *
 * Core type definitions for the Code Framez platform.
 * These types are framework-agnostic and define the fundamental
 * data structures for the pane/view system.
 */

// ─── Pane Types ──────────────────────────────────────────────

/**
 * Named regions in the application shell where views can be displayed.
 */
export type PaneType = 'nav' | 'main' | 'search' | 'right' | 'bottom';

/**
 * Arrangement options for how panes display their content.
 */
export type PaneArrangement = 'tabs-top' | 'tabs-bottom' | 'tabs-left' | 'accordion';

/**
 * Configuration for a pane region in the shell.
 */
export interface PaneConfig {
  /** Unique pane type identifier */
  paneType: PaneType;
  /** How the pane arranges its child views */
  arrangement: PaneArrangement;
  /** Whether this pane is currently visible */
  visible: boolean;
  /** Default width/height as CSS value (e.g., '300px', '25%') */
  defaultSize?: string;
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;
}

// ─── View Types ──────────────────────────────────────────────

/**
 * Unique identifier for a view instance.
 */
export type ViewId = string;

/**
 * Unique identifier for a view component type (used in the registry).
 */
export type ViewComponentKey = string;

/**
 * Launch state for a view - how it was created.
 */
export type ViewLaunchState = 'static' | 'dynamic';

/**
 * State of a view within the pane system.
 */
export type ViewState = 'active' | 'inactive' | 'loading' | 'error';

/**
 * Describes how a view can be launched.
 */
export interface ViewLaunchConfig {
  /** Component key in the registry */
  componentKey: ViewComponentKey;
  /** Which pane to launch in */
  paneType: PaneType;
  /** Display text / title */
  displayText: string;
  /** Icon identifier (MUI icon name or custom) */
  displayIcon?: string;
  /** Additional props to pass to the component */
  componentProps?: Record<string, unknown>;
  /** Entity type this view handles */
  entityType?: string;
  /** Menu text for entity menus */
  menuText?: string;
  /** Sort order in menus */
  menuOrder?: number;
}

/**
 * A fully resolved view instance that lives in a pane.
 */
export interface ViewInstance {
  /** Unique instance identifier */
  viewId: ViewId;
  /** Component key from the registry */
  componentKey: ViewComponentKey;
  /** Which pane this view lives in */
  paneType: PaneType;
  /** Display text / title for the tab */
  displayText: string;
  /** Icon identifier */
  displayIcon?: string;
  /** How this view was launched */
  launchState: ViewLaunchState;
  /** Current state of the view */
  viewState: ViewState;
  /** Props passed to the component */
  componentProps?: Record<string, unknown>;
  /** Entity type this view is associated with */
  entityType?: string;
  /** Entity identifier if applicable */
  entityId?: string;
  /** Timestamp when the view was created */
  createdAt: number;
}

// ─── View Registration ───────────────────────────────────────

/**
 * Registration entry for a view component.
 * This is what developers use to register their components with the shell.
 */
export interface ViewComponentRegistration {
  /** Unique key for this component */
  componentKey: ViewComponentKey;
  /** Display name */
  displayText: string;
  /** Icon identifier */
  displayIcon?: string;
  /** Default pane to show in */
  paneType: PaneType;
  /** Whether to auto-launch when shell starts */
  launchAtStartup?: boolean;
  /** Entity types this component can display */
  entityTypes?: string[];
  /** Menu configuration for entity menus */
  entityMenu?: EntityMenuConfig;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Display order */
  order?: number;
  /** Required permissions to access this view */
  permissions?: string[];
}

/**
 * Entity menu configuration for a view component.
 */
export interface EntityMenuConfig {
  /** Menu item text */
  menuText: string;
  /** Menu item icon */
  menuIcon?: string;
  /** Sort order (lower = first) */
  order?: number;
  /** Entity types this menu applies to */
  entityTypes: string[];
}

// ─── Shell State Types ───────────────────────────────────────

/**
 * State of a single pane, including its views and active tab.
 */
export interface PaneState {
  /** Pane configuration */
  config: PaneConfig;
  /** Views currently in this pane */
  viewInstances: ViewInstance[];
  /** Currently active (focused) view ID */
  activeViewId?: ViewId;
}

/**
 * Complete shell state - the top-level state object.
 */
export interface ShellState {
  /** State of each pane region */
  panes: Record<PaneType, PaneState>;
  /** View component registry */
  viewComponentRegistry: Record<ViewComponentKey, ViewComponentRegistration>;
  /** Currently focused pane */
  activePaneType?: PaneType;
}

// ─── Action Types ────────────────────────────────────────────

/**
 * Actions that can be dispatched to modify shell state.
 */
export interface ShellActions {
  /** Register a view component */
  registerViewComponent(registration: ViewComponentRegistration): void;
  /** Register multiple view components */
  registerViewComponents(registrations: ViewComponentRegistration[]): void;
  /** Launch a new view instance in a pane */
  launchView(config: ViewLaunchConfig): ViewId;
  /** Close a view instance */
  closeView(viewId: ViewId): void;
  /** Move a view to a different pane */
  moveView(viewId: ViewId, targetPane: PaneType): void;
  /** Set the active view in a pane */
  setActiveView(paneType: PaneType, viewId: ViewId): void;
  /** Toggle pane visibility */
  togglePane(paneType: PaneType): void;
  /** Set pane visibility explicitly */
  setPaneVisible(paneType: PaneType, visible: boolean): void;
  /** Set the focused pane */
  setActivePane(paneType: PaneType): void;
  /** Update a view's state */
  updateViewState(viewId: ViewId, state: Partial<ViewInstance>): void;
  /** Reset shell to initial state */
  resetShell(): void;
}

// ─── Entity Navigation Types ─────────────────────────────────

/**
 * An entity reference that can be used to navigate to views.
 */
export interface EntityRef {
  /** Type of entity (e.g., 'user', 'project', 'dashboard') */
  entityType: string;
  /** Unique identifier for the entity */
  entityId: string;
  /** Display text for the entity */
  displayText?: string;
  /** Additional entity data */
  data?: Record<string, unknown>;
}

/**
 * An entity menu item - an action available for an entity.
 */
export interface EntityMenuItem {
  /** Component key to launch */
  componentKey: ViewComponentKey;
  /** Menu item text */
  menuText: string;
  /** Menu item icon */
  menuIcon?: string;
  /** Sort order */
  order: number;
}

// ─── Event Types ─────────────────────────────────────────────

/**
 * Event types emitted by the shell.
 */
export type ShellEventType =
  | 'view-launched'
  | 'view-closed'
  | 'view-activated'
  | 'view-moved'
  | 'pane-toggled'
  | 'pane-activated'
  | 'shell-reset';

/**
 * Shell event payload.
 */
export interface ShellEvent {
  type: ShellEventType;
  timestamp: number;
  payload: Record<string, unknown>;
}

/**
 * Shell event listener.
 */
export type ShellEventListener = (event: ShellEvent) => void;
