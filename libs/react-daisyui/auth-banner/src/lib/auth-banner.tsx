/**
 * @code-framez/react-daisyui/auth-banner
 *
 * DaisyUI auth toolbar widget.
 * Shows login/logout and user info in the shell navbar.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@code-framez/auth/react';

export function AuthBanner() {
  const { state, user, isLoading, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  if (isLoading || state === 'initializing') {
    return (
      <div className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm"></span>
      </div>
    );
  }

  if (state === 'unauthenticated') {
    return (
      <button
        className="btn btn-outline btn-primary btn-sm text-xs"
        onClick={() => login()}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        Sign In
      </button>
    );
  }

  if (state === 'authenticated' && user) {
    return (
      <div ref={menuRef} className="dropdown dropdown-end">
        <button
          className="btn btn-ghost btn-circle btn-sm avatar"
          onClick={() => setMenuOpen(!menuOpen)}
          title={`${user.displayName} (${user.email ?? ''})`}
        >
          <div className="w-7 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.displayName} className="rounded-full" />
            ) : (
              user.displayName.charAt(0).toUpperCase()
            )}
          </div>
        </button>

        {menuOpen && (
          <ul className="dropdown-content menu bg-base-200 rounded-box z-50 w-56 p-2 shadow-lg border border-base-300 mt-1">
            <li className="menu-title">
              <span>{user.displayName}</span>
            </li>
            {user.email && (
              <li className="disabled">
                <span className="text-xs text-base-content/50">{user.email}</span>
              </li>
            )}
            {user.roles.length > 0 && (
              <li className="disabled">
                <span className="text-xs text-base-content/50">
                  Roles: {user.roles.join(', ')}
                </span>
              </li>
            )}
            <div className="divider my-0"></div>
            <li>
              <button
                className="text-sm"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </li>
          </ul>
        )}
      </div>
    );
  }

  // Error state
  return (
    <button
      className="btn btn-outline btn-error btn-sm text-xs"
      onClick={() => login()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
      Retry Sign In
    </button>
  );
}
