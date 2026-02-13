/**
 * @code-framez/react-daisyui/pane
 *
 * DaisyUI / Tailwind CSS pane component with tabbed view management.
 * Mirrors the functionality of the MUI pane but uses DaisyUI tabs.
 */

import React, { useCallback, useMemo } from 'react';
import type { PaneType, ViewInstance } from '@code-framez/core/types';
import { useShellStore, usePaneState, usePaneViews } from '@code-framez/react/state';
import { useViewComponent, ViewNotFound } from '@code-framez/react/view-host';

// ─── View Tab Renderer ───────────────────────────────────────

interface ViewTabContentProps {
  view: ViewInstance;
  isActive: boolean;
}

function ViewTabContent({ view, isActive }: ViewTabContentProps) {
  const Component = useViewComponent(view.componentKey);

  if (!Component) {
    return <ViewNotFound componentKey={view.componentKey} />;
  }

  return (
    <div
      className={`flex flex-col flex-1 overflow-auto h-full ${isActive ? '' : 'hidden'}`}
    >
      <Component
        viewId={view.viewId}
        componentKey={view.componentKey}
        componentProps={view.componentProps}
        entityType={view.entityType}
        entityId={view.entityId}
      />
    </div>
  );
}

// ─── Pane Component ──────────────────────────────────────────

export interface PaneProps {
  /** Which pane region this renders */
  paneType: PaneType;
  /** Optional CSS class */
  className?: string;
}

export function Pane({ paneType, className }: PaneProps) {
  const paneState = usePaneState(paneType);
  const views = usePaneViews(paneType);
  const setActiveView = useShellStore((s) => s.setActiveView);
  const closeView = useShellStore((s) => s.closeView);
  const setActivePane = useShellStore((s) => s.setActivePane);

  const activeViewId = paneState?.activeViewId;

  const handleTabClick = useCallback(
    (viewId: string) => {
      setActiveView(paneType, viewId);
      setActivePane(paneType);
    },
    [paneType, setActiveView, setActivePane]
  );

  const handleClose = useCallback(
    (viewId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      closeView(viewId);
    },
    [closeView]
  );

  if (!paneState?.config.visible) return null;

  if (views.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full text-base-content/30 ${className ?? ''}`}>
        <span className="text-sm">No views open</span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full overflow-hidden ${className ?? ''}`}
      onClick={() => setActivePane(paneType)}
    >
      {/* Tab Bar */}
      <div className="border-b border-base-300 bg-base-200 min-h-[36px] flex items-end overflow-x-auto">
        <div role="tablist" className="tabs tabs-border flex-nowrap">
          {views.map((view) => (
            <button
              key={view.viewId}
              role="tab"
              className={`tab tab-sm gap-1 whitespace-nowrap ${
                view.viewId === activeViewId ? 'tab-active' : ''
              }`}
              onClick={() => handleTabClick(view.viewId)}
            >
              <span className="text-xs">{view.displayText}</span>
              <span
                className="cursor-pointer opacity-50 hover:opacity-100 text-xs leading-none ml-1"
                onClick={(e) => handleClose(view.viewId, e)}
                title="Close"
              >
                ✕
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 overflow-hidden relative">
        {views.map((view) => (
          <ViewTabContent
            key={view.viewId}
            view={view}
            isActive={view.viewId === activeViewId}
          />
        ))}
      </div>
    </div>
  );
}
