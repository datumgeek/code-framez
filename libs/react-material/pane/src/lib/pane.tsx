/**
 * @code-framez/react-material/pane
 *
 * Material UI pane components for the Code Framez shell.
 * Renders pane regions with tabbed view management.
 */

import React, { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
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
    <Box
      sx={{
        display: isActive ? 'flex' : 'none',
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        height: '100%',
      }}
    >
      <Component
        viewId={view.viewId}
        componentKey={view.componentKey}
        componentProps={view.componentProps}
        entityType={view.entityType}
        entityId={view.entityId}
      />
    </Box>
  );
}

// ─── Pane Component ──────────────────────────────────────────

export interface PaneProps {
  /** Which pane region this renders */
  paneType: PaneType;
  /** Optional CSS class */
  className?: string;
  /** Optional inline styles */
  sx?: Record<string, unknown>;
}

export function Pane({ paneType, className, sx }: PaneProps) {
  const paneState = usePaneState(paneType);
  const views = usePaneViews(paneType);
  const setActiveView = useShellStore((s) => s.setActiveView);
  const closeView = useShellStore((s) => s.closeView);
  const setActivePane = useShellStore((s) => s.setActivePane);

  const activeViewId = paneState?.activeViewId;

  const activeTabIndex = useMemo(() => {
    if (!activeViewId || views.length === 0) return 0;
    const idx = views.findIndex((v) => v.viewId === activeViewId);
    return idx >= 0 ? idx : 0;
  }, [activeViewId, views]);

  const handleTabChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      const view = views[newValue];
      if (view) {
        setActiveView(paneType, view.viewId);
        setActivePane(paneType);
      }
    },
    [views, paneType, setActiveView, setActivePane]
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
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'text.disabled',
          ...sx,
        }}
      >
        <Typography variant="body2" color="text.disabled">
          No views open
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        ...sx,
      }}
      onClick={() => setActivePane(paneType)}
    >
      {/* Tab Bar */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          minHeight: 36,
        }}
      >
        <Tabs
          value={activeTabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              py: 0.5,
              px: 1.5,
              fontSize: '0.8rem',
              textTransform: 'none',
            },
          }}
        >
          {views.map((view) => (
            <Tab
              key={view.viewId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{view.displayText}</span>
                  <Tooltip title="Close">
                    <IconButton
                      size="small"
                      onClick={(e) => handleClose(view.viewId, e)}
                      sx={{
                        p: 0.25,
                        ml: 0.5,
                        fontSize: '0.75rem',
                        opacity: 0.6,
                        '&:hover': { opacity: 1 },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* View Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {views.map((view) => (
          <ViewTabContent
            key={view.viewId}
            view={view}
            isActive={view.viewId === activeViewId}
          />
        ))}
      </Box>
    </Box>
  );
}
