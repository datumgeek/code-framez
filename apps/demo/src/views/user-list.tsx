/**
 * Demo: User List View
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { ViewComponentProps } from '@code-framez/react/view-host';
import { useShellStore } from '@code-framez/react/state';

const mockUsers = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '4', name: 'Dan Martinez', email: 'dan@example.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Eve Johnson', email: 'eve@example.com', role: 'Editor', status: 'Active' },
];

export function UserList(_props: ViewComponentProps) {
  const launchView = useShellStore((s) => s.launchView);

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Users
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={user.role} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    size="small"
                    color={user.status === 'Active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Open user detail">
                    <IconButton
                      size="small"
                      onClick={() =>
                        launchView({
                          componentKey: 'user-detail',
                          paneType: 'main',
                          displayText: user.name,
                          componentProps: { userId: user.id, userName: user.name },
                          entityType: 'user',
                        })
                      }
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
