import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    assetsDir: ".",
    emptyOutDir: true,
    manifest: true,
    outDir: "../public",
  },
  publicDir: "static",
  base: "/tides/",
});
