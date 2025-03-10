import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // This ensures paths are relative to the root
  server: {
    port: 8080,
    open: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src", // If you're using @ imports
    },
  },
  // This is important for SPA routing
  build: {
    outDir: "dist",
  },
});
