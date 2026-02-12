/**
 * Demo: Analytics View
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import type { ViewComponentProps } from '@code-framez/react/view-host';

const metrics = [
  { label: 'Page Views', value: '24,521', progress: 72, color: '#6366f1' },
  { label: 'Sessions', value: '8,342', progress: 58, color: '#ec4899' },
  { label: 'Bounce Rate', value: '34.2%', progress: 34, color: '#10b981' },
  { label: 'Avg Duration', value: '4m 23s', progress: 67, color: '#f59e0b' },
  { label: 'Conversion', value: '3.8%', progress: 38, color: '#8b5cf6' },
  { label: 'Revenue', value: '$12,450', progress: 85, color: '#06b6d4' },
];

export function AnalyticsView(_props: ViewComponentProps) {
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Analytics Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Real-time performance metrics and insights.
      </Typography>

      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.label}>
            <Card sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ my: 1 }}>
                  {metric.value}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={metric.progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: metric.color,
                      borderRadius: 3,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
