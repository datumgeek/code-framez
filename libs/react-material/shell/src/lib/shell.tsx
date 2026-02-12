/**
 * @code-framez/react-material/shell
 *
 * The main Shell component - the top-level layout that orchestrates
 * all pane regions into a cohesive multi-pane application workspace.
 *
 * Layout:
 * ┌──────────────────────────────────────────────────────────┐
 * │                     Banner / Toolbar                      │
 * ├───────┬──────────────────────────────┬───────────────────┤
 * │       │                              │                   │
 * │  Nav  │          Main Pane           │   Search / Right  │
 * │  Pane │                              │       Pane        │
 * │       │                              │                   │
 * │       ├──────────────────────────────┤                   │
 * │       │        Bottom Pane           │                   │
 * └───────┴──────────────────────────────┴───────────────────┘
 */

import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTheme } from '@mui/material/styles';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import type { PaneType, ViewComponentRegistration } from '@code-framez/core/types';
import { useShellStore, usePaneState } from '@code-framez/react/state';
import type { ViewComponentMap } from '@code-framez/react/view-host';
import { ViewHostProvider } from '@code-framez/react/view-host';
import { Pane } from '@code-framez/react-material/pane';

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
  /** Custom MUI theme */
  theme?: ReturnType<typeof createTheme>;
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

// ─── Default Theme ───────────────────────────────────────────

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13,
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        },
      },
    },
  },
});

// ─── Shell Component ─────────────────────────────────────────

export function Shell({ config }: { config: ShellConfig }) {
  const theme = config.theme ?? defaultTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ViewHostProvider componentMap={config.componentMap}>
        <ShellLayout config={config} />
      </ViewHostProvider>
    </ThemeProvider>
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

  const theme = useTheme();
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* ─── Banner / App Bar ─── */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 42, gap: 1 }}>
          {/* Nav Toggle */}
          <Tooltip title={navVisible ? 'Hide navigation' : 'Show navigation'}>
            <IconButton
              size="small"
              onClick={() => togglePane('nav')}
              sx={{ color: 'text.secondary' }}
            >
              {navVisible ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Tooltip>

          {/* Logo & Title */}
          {logo && <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>{logo}</Box>}
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="text.primary"
            noWrap
            sx={{ mr: 1 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {subtitle}
            </Typography>
          )}

          {/* Custom Banner Content */}
          {bannerContent && <Box sx={{ ml: 2, flex: 1 }}>{bannerContent}</Box>}

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Search Toggle */}
          <Tooltip title={searchVisible ? 'Hide search' : 'Show search'}>
            <IconButton
              size="small"
              onClick={() => togglePane('search')}
              sx={{ color: searchVisible ? 'primary.main' : 'text.secondary' }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Right Pane Toggle */}
          <Tooltip title={rightVisible ? 'Hide right panel' : 'Show right panel'}>
            <IconButton
              size="small"
              onClick={() => togglePane('right')}
              sx={{ color: rightVisible ? 'primary.main' : 'text.secondary' }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Tooltip>

          {/* Auth */}
          {authComponent}
        </Toolbar>
      </AppBar>

      {/* ─── Main Layout ─── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Nav Pane (Left Sidebar) */}
        {navVisible && (
          <Box
            sx={{
              width: navWidth,
              minWidth: navWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Pane paneType="nav" />
          </Box>
        )}

        {/* Center Area (Main + Bottom) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Main Pane */}
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Pane paneType="main" />
          </Box>

          {/* Bottom Pane */}
          {bottomVisible && (
            <Box
              sx={{
                height: bottomHeight,
                minHeight: bottomHeight,
                borderTop: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
              }}
            >
              <Pane paneType="bottom" />
            </Box>
          )}
        </Box>

        {/* Search Pane (Right side, overlays or alongside) */}
        {searchVisible && (
          <Box
            sx={{
              width: rightWidth,
              minWidth: rightWidth,
              borderLeft: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            }}
          >
            <Pane paneType="search" />
          </Box>
        )}

        {/* Right Pane */}
        {rightVisible && !searchVisible && (
          <Box
            sx={{
              width: rightWidth,
              minWidth: rightWidth,
              borderLeft: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
            }}
          >
            <Pane paneType="right" />
          </Box>
        )}
      </Box>
    </Box>
  );
}
