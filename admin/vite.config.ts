import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En dev, l'API Express (server/) tourne sur 8787 par défaut ; on la proxifie
// pour rester same-origin (cookies de session + CSRF).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': process.env.VITE_API_PROXY ?? 'http://127.0.0.1:8787',
    },
  },
});
