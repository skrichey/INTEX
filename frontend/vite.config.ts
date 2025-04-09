import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://cineniche-fkazataxamgph8bu.westus3-01.azurewebsites.net/api',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
