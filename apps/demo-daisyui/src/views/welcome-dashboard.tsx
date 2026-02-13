/**
 * DaisyUI Demo: Welcome Dashboard View
 */

import React from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';

const stats = [
  { label: 'Active Views', value: '12', color: 'text-primary' },
  { label: 'Components', value: '48', color: 'text-secondary' },
  { label: 'Data Sources', value: '6', color: 'text-success' },
  { label: 'Users Online', value: '234', color: 'text-warning' },
];

const features = [
  'Multi-Pane Layout',
  'View Registry',
  'Dynamic Launching',
  'Entity Menus',
  'Auth Framework',
  'RBAC',
  'Zustand State',
  'DaisyUI Components',
  'Tailwind CSS',
  'Nx Monorepo',
];

export function WelcomeDashboard(_props: ViewComponentProps) {
  return (
    <div className="p-6 h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-1">Welcome to Code Framez</h2>
      <p className="text-sm text-base-content/60 mb-6">
        A modern component shell platform for building multi-pane applications.
        This demo uses DaisyUI + Tailwind CSS for all UI components.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card bg-base-200 border border-base-300">
            <div className="card-body p-4 items-center text-center">
              <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
              <span className="text-xs text-base-content/50">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-200 border border-base-300">
        <div className="card-body p-4">
          <h3 className="card-title text-sm font-semibold">Platform Features</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {features.map((feature) => (
              <span key={feature} className="badge badge-outline badge-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
