import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    // Thêm đoạn cấu hình proxy này
    proxy: {
      '/api': {
        target: 'https://localhost:7012', // Cổng của Backend .NET
        changeOrigin: true,
        secure: false, // Bỏ qua lỗi SSL tự ký (quan trọng vì backend là https)
      }
    }
  }
});
