import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pedals/',
  build: {
    outDir: 'dist/pedals',
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
