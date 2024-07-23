// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the directory specified in `vercel.json`
    rollupOptions: {
      external: [], // Update or remove if unnecessary
    },
  },
});
