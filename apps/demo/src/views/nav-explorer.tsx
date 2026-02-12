/**
 * Demo: Navigation Tree View
 */

import React, { useCallback } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from '@mui/icons-material/Map';
import type { ViewComponentProps } from '@code-framez/react/view-host';
import { useShellStore } from '@code-framez/react/state';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  componentKey: string;
  displayText: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, componentKey: 'welcome-dashboard', displayText: 'Dashboard' },
  { label: 'Users', icon: <PeopleIcon />, componentKey: 'user-list', displayText: 'Users' },
  { label: 'Analytics', icon: <BarChartIcon />, componentKey: 'analytics-view', displayText: 'Analytics' },
  { label: 'Projects', icon: <FolderIcon />, componentKey: 'project-explorer', displayText: 'Projects' },
  { label: 'Map View', icon: <MapIcon />, componentKey: 'map-view', displayText: 'Map' },
  { label: 'Settings', icon: <SettingsIcon />, componentKey: 'settings-view', displayText: 'Settings' },
];

export function NavExplorer(_props: ViewComponentProps) {
  const launchView = useShellStore((s) => s.launchView);

  const handleClick = useCallback(
    (item: NavItem) => {
      launchView({
        componentKey: item.componentKey,
        paneType: 'main',
        displayText: item.displayText,
      });
    },
    [launchView]
  );

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" letterSpacing={1}>
          NAVIGATION
        </Typography>
      </Box>
      <Divider />
      <List dense disablePadding>
        {navItems.map((item) => (
          <ListItemButton
            key={item.componentKey}
            onClick={() => handleClick(item)}
            sx={{
              py: 1,
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
