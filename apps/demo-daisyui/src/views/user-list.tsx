/**
 * DaisyUI Demo: User List View
 */

import React from 'react';
import type { ViewComponentProps } from '@code-framez/react/view-host';
import { useShellStore } from '@code-framez/react/state';

const mockUsers = [
  { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '4', name: 'Dan Martinez', email: 'dan@example.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Eve Johnson', email: 'eve@example.com', role: 'Editor', status: 'Active' },
];

export function UserList(_props: ViewComponentProps) {
  const launchView = useShellStore((s) => s.launchView);

  return (
    <div className="p-4 h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-3">Users</h3>
      <div className="overflow-x-auto">
        <table className="table table-sm table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover">
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content w-7 rounded-full">
                        <span className="text-xs">{user.name.charAt(0)}</span>
                      </div>
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-base-content/60">{user.email}</span>
                </td>
                <td>
                  <span className="badge badge-outline badge-sm">{user.role}</span>
                </td>
                <td>
                  <span
                    className={`badge badge-sm ${
                      user.status === 'Active' ? 'badge-success' : 'badge-ghost'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="text-right">
                  <button
                    className="btn btn-ghost btn-xs"
                    title="Open user detail"
                    onClick={() =>
                      launchView({
                        componentKey: 'user-detail',
                        paneType: 'main',
                        displayText: user.name,
                        componentProps: { userId: user.id, userName: user.name },
                        entityType: 'user',
                      })
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
