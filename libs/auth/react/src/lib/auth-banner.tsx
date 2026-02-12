/**
 * @code-framez/auth/react - Auth Banner Component
 *
 * MUI-based auth UI component that shows login/logout
 * and user info in the shell toolbar.
 */

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from './auth-provider';

export function AuthBanner() {
  const { state, user, isLoading, login, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  if (isLoading || state === 'initializing') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (state === 'unauthenticated') {
    return (
      <Button
        size="small"
        variant="outlined"
        startIcon={<LoginIcon />}
        onClick={() => login()}
        sx={{ textTransform: 'none', fontSize: '0.8rem' }}
      >
        Sign In
      </Button>
    );
  }

  if (state === 'authenticated' && user) {
    return (
      <>
        <Tooltip title={`${user.displayName} (${user.email ?? ''})`}>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <Avatar
              src={user.avatarUrl}
              alt={user.displayName}
              sx={{ width: 28, height: 28, fontSize: '0.8rem' }}
            >
              {user.displayName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {user.displayName}
              </Typography>
              {user.email && (
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Box>
          </MenuItem>
          <Divider />
          {user.roles.length > 0 && (
            <MenuItem disabled>
              <Typography variant="caption" color="text.secondary">
                Roles: {user.roles.join(', ')}
              </Typography>
            </MenuItem>
          )}
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </>
    );
  }

  // Error state
  return (
    <Button
      size="small"
      variant="outlined"
      color="error"
      startIcon={<LoginIcon />}
      onClick={() => login()}
      sx={{ textTransform: 'none', fontSize: '0.8rem' }}
    >
      Retry Sign In
    </Button>
  );
}
