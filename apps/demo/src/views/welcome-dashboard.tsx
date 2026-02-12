/**
 * Demo: Welcome Dashboard View
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import type { ViewComponentProps } from '@code-framez/react/view-host';

const stats = [
  { label: 'Active Views', value: '12', color: '#6366f1' },
  { label: 'Components', value: '48', color: '#ec4899' },
  { label: 'Data Sources', value: '6', color: '#10b981' },
  { label: 'Users Online', value: '234', color: '#f59e0b' },
];

export function WelcomeDashboard(_props: ViewComponentProps) {
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Welcome to Code Framez
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        A modern component shell platform for building multi-pane applications.
        This demo showcases the pane system, view management, and dynamic launching.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={6} sm={3} key={stat.label}>
            <Card
              sx={{
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 2, '&:last-child': { pb: 2 } }}>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{ color: stat.color }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Platform Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {[
              'Multi-Pane Layout',
              'View Registry',
              'Dynamic Launching',
              'Entity Menus',
              'Auth Framework',
              'RBAC',
              'Zustand State',
              'MUI Components',
              'TypeScript',
              'Nx Monorepo',
            ].map((feature) => (
              <Chip key={feature} label={feature} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
