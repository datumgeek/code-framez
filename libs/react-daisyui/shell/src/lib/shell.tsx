/**
 * @code-framez/react-daisyui/shell
 *
 * DaisyUI / Tailwind CSS shell component.
 * Provides the same multi-pane layout as the MUI shell but
 * built entirely with Tailwind utility classes and DaisyUI components.
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────────┐
 * │                     Navbar / Toolbar                      │
 * ├───────┬──────────────────────────────┬───────────────────┤
 * │       │                              │                   │
 * │  Nav  │          Main Pane           │   Search / Right  │
 * │  Pane │                              │       Pane        │
 * │       │                              │                   │
 * │       ├──────────────────────────────┤                   │
 * │       │        Bottom Pane           │                   │
 * └───────┴──────────────────────────────┴───────────────────┘
 */

import React, { useEffect } from 'react';
import type { PaneType, ViewComponentRegistration } from '@code-framez/core/types';
import { useShellStore, usePaneState } from '@code-framez/react/state';
import type { ViewComponentMap } from '@code-framez/react/view-host';
import { ViewHostProvider } from '@code-framez/react/view-host';
import { Pane } from '@code-framez/react-daisyui/pane';

// ─── Shell Config ────────────────────────────────────────────

export interface ShellConfig {
  /** Application title */
  title: string;
  /** Application subtitle */
  subtitle?: string;
  /** Logo URL or React node */
  logo?: React.ReactNode;
  /** View component registrations */
  views: ViewComponentRegistration[];
  /** Component implementations keyed by componentKey */
  componentMap: ViewComponentMap;
  /** DaisyUI theme name (e.g. 'dark', 'night', 'dracula', 'synthwave') */
  daisyTheme?: string;
  /** Banner/toolbar content */
  bannerContent?: React.ReactNode;
  /** Auth component to render in the toolbar */
  authComponent?: React.ReactNode;
  /** Nav pane width in pixels */
  navWidth?: number;
  /** Right/search pane width in pixels */
  rightWidth?: number;
  /** Bottom pane height in pixels */
  bottomHeight?: number;
}

// ─── Shell Component ─────────────────────────────────────────

export function Shell({ config }: { config: ShellConfig }) {
  const theme = config.daisyTheme ?? 'night';

  return (
    <div data-theme={theme} className="h-screen w-screen overflow-hidden bg-base-100 text-base-content">
      <ViewHostProvider componentMap={config.componentMap}>
        <ShellLayout config={config} />
      </ViewHostProvider>
    </div>
  );
}

function ShellLayout({ config }: { config: ShellConfig }) {
  const {
    title,
    subtitle,
    logo,
    views,
    bannerContent,
    authComponent,
    navWidth = 280,
    rightWidth = 320,
    bottomHeight = 250,
  } = config;

  const registerViewComponents = useShellStore((s) => s.registerViewComponents);
  const togglePane = useShellStore((s) => s.togglePane);
  const navPaneState = usePaneState('nav');
  const searchPaneState = usePaneState('search');
  const rightPaneState = usePaneState('right');
  const bottomPaneState = usePaneState('bottom');

  const navVisible = navPaneState?.config.visible ?? true;
  const searchVisible = searchPaneState?.config.visible ?? false;
  const rightVisible = rightPaneState?.config.visible ?? false;
  const bottomVisible = bottomPaneState?.config.visible ?? false;

  // Register all view components on mount
  useEffect(() => {
    if (views.length > 0) {
      registerViewComponents(views);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* ─── Navbar ─── */}
      <div className="navbar bg-base-200 border-b border-base-300 min-h-[42px] h-[42px] px-2 gap-1">
        {/* Nav Toggle */}
        <button
          className="btn btn-ghost btn-sm btn-square"
          onClick={() => togglePane('nav')}
          title={navVisible ? 'Hide navigation' : 'Show navigation'}
        >
          {navVisible ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Logo & Title */}
        {logo && <div className="flex items-center mr-1">{logo}</div>}
        <span className="font-bold text-sm truncate mr-1">{title}</span>
        {subtitle && (
          <span className="text-xs text-base-content/50 truncate hidden sm:inline">{subtitle}</span>
        )}

        {/* Custom Banner Content */}
        {bannerContent && <div className="ml-2 flex-1">{bannerContent}</div>}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Toggle */}
        <button
          className={`btn btn-ghost btn-sm btn-square ${searchVisible ? 'text-primary' : ''}`}
          onClick={() => togglePane('search')}
          title={searchVisible ? 'Hide search' : 'Show search'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Right Pane Toggle */}
        <button
          className={`btn btn-ghost btn-sm btn-square ${rightVisible ? 'text-primary' : ''}`}
          onClick={() => togglePane('right')}
          title={rightVisible ? 'Hide right panel' : 'Show right panel'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Auth */}
        {authComponent}
      </div>

      {/* ─── Main Layout ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Nav Pane (Left Sidebar) */}
        {navVisible && (
          <div
            className="border-r border-base-300 overflow-hidden flex flex-col shrink-0"
            style={{ width: navWidth, minWidth: navWidth }}
          >
            <Pane paneType="nav" />
          </div>
        )}

        {/* Center Area (Main + Bottom) */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Main Pane */}
          <div className="flex-1 overflow-hidden">
            <Pane paneType="main" />
          </div>

          {/* Bottom Pane */}
          {bottomVisible && (
            <div
              className="border-t border-base-300 overflow-hidden shrink-0"
              style={{ height: bottomHeight, minHeight: bottomHeight }}
            >
              <Pane paneType="bottom" />
            </div>
          )}
        </div>

        {/* Search Pane */}
        {searchVisible && (
          <div
            className="border-l border-base-300 overflow-hidden shrink-0"
            style={{ width: rightWidth, minWidth: rightWidth }}
          >
            <Pane paneType="search" />
          </div>
        )}

        {/* Right Pane */}
        {rightVisible && !searchVisible && (
          <div
            className="border-l border-base-300 overflow-hidden shrink-0"
            style={{ width: rightWidth, minWidth: rightWidth }}
          >
            <Pane paneType="right" />
          </div>
        )}
      </div>
    </div>
  );
}
