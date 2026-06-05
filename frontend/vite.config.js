import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import unusedCode from 'vite-plugin-unused-code';

export default defineConfig({
  plugins: [
    react(),
    unusedCode({
      context: 'src', 
      log: 'unused', 
    }),
  ],
  server: {
    port: 6000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
