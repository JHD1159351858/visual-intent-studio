import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://127.0.0.1:3001',
      '/media': 'http://127.0.0.1:3001',
      '/design-library/previews': 'http://127.0.0.1:3001',
      '/demos': 'http://127.0.0.1:3001'
    }
  },
  test: { include: ['tests/**/*.test.ts'] }
});
