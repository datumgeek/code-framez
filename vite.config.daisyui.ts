import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/** Shared path aliases for all @code-framez packages */
function codeFramezAliases(dir: string) {
  return {
    '@code-framez/core/types': path.resolve(dir, 'libs/core/types/src/index.ts'),
    '@code-framez/core/auth-types': path.resolve(dir, 'libs/core/auth-types/src/index.ts'),
    '@code-framez/react/state': path.resolve(dir, 'libs/react/state/src/index.ts'),
    '@code-framez/react/view-host': path.resolve(dir, 'libs/react/view-host/src/index.ts'),
    '@code-framez/react-material/pane': path.resolve(dir, 'libs/react-material/pane/src/index.ts'),
    '@code-framez/react-material/entity-menu': path.resolve(dir, 'libs/react-material/entity-menu/src/index.ts'),
    '@code-framez/react-material/shell': path.resolve(dir, 'libs/react-material/shell/src/index.ts'),
    '@code-framez/react-material/auth-banner': path.resolve(dir, 'libs/react-material/auth-banner/src/index.ts'),
    '@code-framez/react-daisyui/pane': path.resolve(dir, 'libs/react-daisyui/pane/src/index.ts'),
    '@code-framez/react-daisyui/entity-menu': path.resolve(dir, 'libs/react-daisyui/entity-menu/src/index.ts'),
    '@code-framez/react-daisyui/shell': path.resolve(dir, 'libs/react-daisyui/shell/src/index.ts'),
    '@code-framez/react-daisyui/auth-banner': path.resolve(dir, 'libs/react-daisyui/auth-banner/src/index.ts'),
    '@code-framez/auth/react': path.resolve(dir, 'libs/auth/react/src/index.ts'),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'apps/demo-daisyui',
  base: process.env.GITHUB_ACTIONS ? '/code-framez/daisyui/' : '/',
  resolve: {
    alias: codeFramezAliases(__dirname),
  },
  server: {
    port: 4201,
    host: true,
  },
  build: {
    outDir: '../../dist/apps/demo-daisyui',
    emptyOutDir: true,
  },
});
