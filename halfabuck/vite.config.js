import { defineConfig } from "vite";

export default defineConfig({
  base: "/halfabuck/", // deployed at gabevelez.com/halfabuck/
  publicDir: "./assets", // game assets served from halfabuck/assets/ in dev
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "template.html",
      output: {
        entryFileNames: "assets/index-[hash].js",
        chunkFileNames: "assets/index-[hash].js",
        assetFileNames: "assets/index-[hash][extname]",
      },
    },
  },
});
