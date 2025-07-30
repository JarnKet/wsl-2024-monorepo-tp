import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/16_module_e",
  build: {
    // assetsDir: "/16_module_e/images",
    // assetsDir: "/images",
    assetsDir: "assets",
    outDir: "16_module_e"
  },
});
