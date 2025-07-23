import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/2025_ntub_library_reading_plan/', // 請將此處換成你的倉庫名稱
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 將所有 node_modules 中的模組打包到一個 chunk 中
            return 'vendor';
          }
        },
      },
    },
  },
});
