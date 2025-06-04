import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcssVite from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr'; // 👉 добавляем

export default defineConfig({
  plugins: [react(), tailwindcssVite(), svgr()], // 👉 добавляем svgr сюда
});

