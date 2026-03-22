import { defineConfig } from "vite";

export default defineConfig({
  base: "/halfabuck/", // deployed at gabevelez.com/halfabuck/
  publicDir: "./assets", // game assets served from halfabuck/assets/ in dev
  build: {
    outDir: ".",
    emptyOutDir: false, // don't delete source files
    copyPublicDir: false, // assets are already at root, no need to copy
  },
});
