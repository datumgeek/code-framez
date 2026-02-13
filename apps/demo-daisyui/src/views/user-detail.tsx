/**
 * DaisyUI Demo: User Detail View
 */

import React from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';

export function UserDetail({ componentProps }: ViewComponentProps) {
  const userName = (componentProps?.userName as string) ?? 'Unknown User';
  const userId = (componentProps?.userId as string) ?? '?';

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="card bg-base-200 border border-base-300">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content w-14 rounded-full">
                <span className="text-xl">{userName.charAt(0)}</span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">{userName}</h3>
              <span className="text-xs text-base-content/50">User ID: {userId}</span>
            </div>
          </div>

          <div className="divider my-1"></div>

          <h4 className="text-sm font-semibold mb-2">Details</h4>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Status</span>
              <span className="badge badge-success badge-sm">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Created</span>
              <span className="text-sm">Jan 15, 2026</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-base-content/60">Last Login</span>
              <span className="text-sm">Feb 12, 2026</span>
            </div>
          </div>

          <div className="divider my-1"></div>

          <p className="text-xs text-base-content/50">
            This is a dynamically launched view. It was opened by clicking an entity
            action in the Users list, demonstrating the dynamic view launch system.
          </p>
        </div>
      </div>
    </div>
  );
}
