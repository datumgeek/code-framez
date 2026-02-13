/**
 * DaisyUI Demo: Search View
 */

import React, { useState, useCallback } from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';
import { useShellStore, useViewComponentRegistry } from '@code-framez/react/state';

export function SearchView(_props: ViewComponentProps) {
  const [query, setQuery] = useState('');
  const registry = useViewComponentRegistry();
  const launchView = useShellStore((s) => s.launchView);

  const results = Object.values(registry).filter(
    (reg) =>
      query.length > 0 &&
      (reg.displayText.toLowerCase().includes(query.toLowerCase()) ||
        reg.componentKey.toLowerCase().includes(query.toLowerCase()))
  );

  const handleLaunch = useCallback(
    (componentKey: string, displayText: string, paneType: string) => {
      launchView({
        componentKey,
        paneType: paneType as any,
        displayText,
      });
    },
    [launchView]
  );

  return (
    <div className="p-4 h-full overflow-auto">
      <span className="text-xs font-semibold text-base-content/50 tracking-widest uppercase">
        Search Views
      </span>

      <label className="input input-sm input-bordered flex items-center gap-2 mt-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          className="grow bg-transparent text-sm"
          placeholder="Search components..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {results.length > 0 ? (
        <ul className="menu menu-sm w-full p-0">
          {results.map((reg) => (
            <li key={reg.componentKey}>
              <button
                className="flex flex-col items-start rounded-none"
                onClick={() => handleLaunch(reg.componentKey, reg.displayText, reg.paneType)}
              >
                <span className="text-sm font-medium">{reg.displayText}</span>
                <span className="text-xs text-base-content/50">
                  {reg.componentKey} → {reg.paneType}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : query.length > 0 ? (
        <p className="text-sm text-base-content/50 mt-2">No matching components found.</p>
      ) : (
        <p className="text-sm text-base-content/50">Type to search registered view components.</p>
      )}
    </div>
  );
}
