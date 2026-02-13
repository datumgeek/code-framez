/**
 * @code-framez/react-daisyui/entity-menu
 *
 * DaisyUI entity context menu component.
 * Shows available view actions for a given entity type using DaisyUI dropdown.
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { EntityRef } from '@code-framez/core/types';
import { useShellStore, useEntityMenuItems } from '@code-framez/react/state';

export interface EntityMenuProps {
  /** The entity to show actions for */
  entity: EntityRef;
  /** Anchor element (where the menu opens from) */
  anchorEl: HTMLElement | null;
  /** Whether the menu is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
}

export function EntityMenu({ entity, anchorEl, open, onClose }: EntityMenuProps) {
  const menuItems = useEntityMenuItems(entity.entityType);
  const launchView = useShellStore((s) => s.launchView);
  const menuRef = useRef<HTMLUListElement>(null);

  const handleItemClick = useCallback(
    (componentKey: string) => {
      launchView({
        componentKey,
        paneType: 'main',
        displayText: entity.displayText ?? `${entity.entityType}: ${entity.entityId}`,
        componentProps: {
          entityType: entity.entityType,
          entityId: entity.entityId,
          ...entity.data,
        },
        entityType: entity.entityType,
      });
      onClose();
    },
    [entity, launchView, onClose]
  );

  // Position the menu near the anchor
  useEffect(() => {
    if (open && anchorEl && menuRef.current) {
      const rect = anchorEl.getBoundingClientRect();
      menuRef.current.style.position = 'fixed';
      menuRef.current.style.top = `${rect.bottom + 4}px`;
      menuRef.current.style.left = `${rect.left}px`;
      menuRef.current.style.zIndex = '9999';
    }
  }, [open, anchorEl]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ul
      ref={menuRef}
      className="menu bg-base-200 rounded-box shadow-lg w-56 p-2 border border-base-300"
    >
      {/* Header */}
      <li className="menu-title">
        <span>{entity.displayText ?? entity.entityId}</span>
      </li>

      {menuItems.length === 0 ? (
        <li className="disabled">
          <span className="text-base-content/50 text-sm">No actions available</span>
        </li>
      ) : (
        menuItems.map((item) => (
          <li key={item.componentKey}>
            <button
              className="text-sm"
              onClick={() => handleItemClick(item.componentKey)}
            >
              {item.menuIcon && <span className="text-base">{item.menuIcon}</span>}
              {item.menuText}
            </button>
          </li>
        ))
      )}
    </ul>
  );
}

// ─── Hook for easy entity menu trigger ───────────────────────

export function useEntityMenu() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [entity, setEntity] = useState<EntityRef | null>(null);

  const open = useCallback((event: React.MouseEvent<HTMLElement>, entityRef: EntityRef) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setEntity(entityRef);
  }, []);

  const close = useCallback(() => {
    setAnchorEl(null);
    setEntity(null);
  }, []);

  return {
    anchorEl,
    entity,
    isOpen: Boolean(anchorEl && entity),
    open,
    close,
  };
}
