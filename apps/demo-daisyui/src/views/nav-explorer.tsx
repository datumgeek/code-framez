/**
 * DaisyUI Demo: Navigation Explorer View
 */

import React, { useCallback } from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';
import { useShellStore } from '@code-framez/react/state';

interface NavItem {
  label: string;
  icon: string;
  componentKey: string;
  displayText: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: '📊', componentKey: 'welcome-dashboard', displayText: 'Dashboard' },
  { label: 'Users', icon: '👥', componentKey: 'user-list', displayText: 'Users' },
  { label: 'Analytics', icon: '📈', componentKey: 'analytics-view', displayText: 'Analytics' },
  { label: 'Projects', icon: '📁', componentKey: 'project-explorer', displayText: 'Projects' },
  { label: 'Map View', icon: '🗺️', componentKey: 'map-view', displayText: 'Map' },
  { label: 'Settings', icon: '⚙️', componentKey: 'settings-view', displayText: 'Settings' },
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
    <div className="h-full overflow-auto">
      <div className="px-4 py-3">
        <span className="text-xs font-semibold text-base-content/50 tracking-widest uppercase">
          Navigation
        </span>
      </div>
      <div className="divider my-0"></div>
      <ul className="menu menu-sm w-full p-0">
        {navItems.map((item) => (
          <li key={item.componentKey}>
            <button
              className="rounded-none"
              onClick={() => handleClick(item)}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
