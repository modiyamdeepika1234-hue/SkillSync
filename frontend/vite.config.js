import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://skillsync-9-xixq.onrender.com',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'https://skillsync-9-xixq.onrender.com',
        ws: true,
        changeOrigin: true,
      },
    },
  },
});