/**
 * @code-framez/react-material/entity-menu
 *
 * Entity context menu component.
 * Shows available view actions for a given entity type.
 */

import React, { useCallback, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
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

  if (menuItems.length === 0) {
    return (
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem disabled>
          <Typography variant="body2" color="text.secondary">
            No actions available
          </Typography>
        </MenuItem>
      </Menu>
    );
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem disabled>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {entity.displayText ?? entity.entityId}
        </Typography>
      </MenuItem>
      <Divider />
      {menuItems.map((item) => (
        <MenuItem key={item.componentKey} onClick={() => handleItemClick(item.componentKey)}>
          {item.menuIcon && (
            <ListItemIcon>
              <span style={{ fontSize: 18 }}>{item.menuIcon}</span>
            </ListItemIcon>
          )}
          <ListItemText>{item.menuText}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
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
