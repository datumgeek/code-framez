import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'apps/demo',
  base: process.env.GITHUB_ACTIONS ? '/code-framez/' : '/',
  resolve: {
    alias: {
      '@code-framez/core/types': path.resolve(__dirname, 'libs/core/types/src/index.ts'),
      '@code-framez/core/auth-types': path.resolve(__dirname, 'libs/core/auth-types/src/index.ts'),
      '@code-framez/react/state': path.resolve(__dirname, 'libs/react/state/src/index.ts'),
      '@code-framez/react/view-host': path.resolve(__dirname, 'libs/react/view-host/src/index.ts'),
      '@code-framez/react-material/pane': path.resolve(__dirname, 'libs/react-material/pane/src/index.ts'),
      '@code-framez/react-material/entity-menu': path.resolve(__dirname, 'libs/react-material/entity-menu/src/index.ts'),
      '@code-framez/react-material/shell': path.resolve(__dirname, 'libs/react-material/shell/src/index.ts'),
      '@code-framez/auth/react': path.resolve(__dirname, 'libs/auth/react/src/index.ts'),
    },
  },
  server: {
    port: 4200,
    host: true,
  },
  build: {
    outDir: '../../dist/apps/demo',
    emptyOutDir: true,
  },
});
