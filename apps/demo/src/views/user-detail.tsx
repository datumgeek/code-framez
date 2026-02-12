/**
 * Demo: User Detail View
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { ViewComponentProps } from '@code-framez/react/view-host';

export function UserDetail({ componentProps }: ViewComponentProps) {
  const userName = (componentProps?.userName as string) ?? 'Unknown User';
  const userId = (componentProps?.userId as string) ?? '?';

  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Card sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, fontSize: '1.5rem', bgcolor: 'primary.main' }}>
              {userName.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                User ID: {userId}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Chip label="Active" size="small" color="success" />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Created</Typography>
              <Typography variant="body2">Jan 15, 2026</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Last Login</Typography>
              <Typography variant="body2">Feb 12, 2026</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            This is a dynamically launched view. It was opened by clicking an entity
            action in the Users list, demonstrating the dynamic view launch system.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
