/**
 * DaisyUI Demo: Analytics View
 */

import React from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';

const metrics = [
  { label: 'Page Views', value: '24,521', progress: 72, color: 'progress-primary' },
  { label: 'Sessions', value: '8,342', progress: 58, color: 'progress-secondary' },
  { label: 'Bounce Rate', value: '34.2%', progress: 34, color: 'progress-success' },
  { label: 'Avg Duration', value: '4m 23s', progress: 67, color: 'progress-warning' },
  { label: 'Conversion', value: '3.8%', progress: 38, color: 'progress-accent' },
  { label: 'Revenue', value: '$12,450', progress: 85, color: 'progress-info' },
];

export function AnalyticsView(_props: ViewComponentProps) {
  return (
    <div className="p-6 h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-1">Analytics Overview</h3>
      <p className="text-sm text-base-content/60 mb-4">
        Real-time performance metrics and insights.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="card bg-base-200 border border-base-300">
            <div className="card-body p-4">
              <span className="text-xs text-base-content/50 font-medium">{metric.label}</span>
              <span className="text-2xl font-bold my-1">{metric.value}</span>
              <progress
                className={`progress ${metric.color} w-full h-1.5`}
                value={metric.progress}
                max="100"
              ></progress>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
