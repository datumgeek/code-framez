/**
 * Demo: Placeholder views for navigation items
 */

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import type { ViewComponentProps } from '@code-framez/react/view-host';

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Card sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export function ProjectExplorer(_props: ViewComponentProps) {
  return (
    <PlaceholderView
      title="Project Explorer"
      description="Browse and manage projects. This view demonstrates how components register with the shell and can be launched dynamically from the navigation pane."
    />
  );
}

export function MapView(_props: ViewComponentProps) {
  return (
    <PlaceholderView
      title="Map View"
      description="Spatial/geospatial data visualization. This placeholder demonstrates how a map component would integrate into the multi-pane layout."
    />
  );
}

export function SettingsView(_props: ViewComponentProps) {
  return (
    <PlaceholderView
      title="Settings"
      description="Application settings and configuration. This view shows how configuration interfaces can be part of the same shell system as data views."
    />
  );
}
