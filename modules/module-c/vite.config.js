import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/16_module_c/",
  build: {
    assetsDir: "assets",
  },
  // server: {
  //   port: 3000,
  //   host: true,
  // }
});
