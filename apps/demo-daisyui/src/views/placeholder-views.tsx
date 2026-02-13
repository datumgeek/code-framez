/**
 * DaisyUI Demo: Placeholder views for navigation items
 */

import React from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body p-4">
          <p className="text-sm text-base-content/60">{description}</p>
        </div>
      </div>
    </div>
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
