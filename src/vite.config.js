import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  build: {
    assetsDir: ".",
    emptyOutDir: true,
    manifest: true,
    outDir: "../public",
    rolldownOptions: {
      output: {
        entryFileNames: (file) => {
          // Don't hash service worker name (see https://web.dev/articles/service-worker-lifecycle#avoid-url-change).
          return file.facadeModuleId?.endsWith("/sw.js")
            ? `[name].js`
            : `[name]-[hash].js`;
        },
      },
    },
  },
  base: "/tides/",
  input: ["index.html", "sw.js"],
  publicDir: "static",
});
