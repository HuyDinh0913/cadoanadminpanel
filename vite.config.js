import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [react()],
  server: {
    // Chạy frontend trên cổng 5173
    port: 5173,
    proxy: {
      // Cấu hình proxy cho '/api'
      '/api': {
        target: 'https://cadoanmancoiproject.onrender.com/',//'http://localhost:3000', // Backend API của bạn
        changeOrigin: true, // Cần thiết cho virtual hosts
        secure: false, // Tắt nếu backend dùng http
      },
    },
  },
});
