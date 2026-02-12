/**
 * Demo: Search View
 */

import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary" letterSpacing={1}>
        SEARCH VIEWS
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search components..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mt: 1, mb: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {results.length > 0 ? (
        <List dense disablePadding>
          {results.map((reg) => (
            <ListItemButton
              key={reg.componentKey}
              onClick={() => handleLaunch(reg.componentKey, reg.displayText, reg.paneType)}
            >
              <ListItemText
                primary={reg.displayText}
                secondary={`${reg.componentKey} → ${reg.paneType}`}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                secondaryTypographyProps={{ variant: 'caption' }}
              />
            </ListItemButton>
          ))}
        </List>
      ) : query.length > 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No matching components found.
        </Typography>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Type to search registered view components.
        </Typography>
      )}
    </Box>
  );
}
