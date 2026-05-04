import { defineConfig } from "vite";

export default defineConfig({
  base: "/halfabuck/", // deployed at gabevelez.com/halfabuck/
  publicDir: "./assets", // game assets served from halfabuck/assets/ in dev
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
