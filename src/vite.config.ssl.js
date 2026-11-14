import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    {
      ...basicSsl(),
      apply: "serve", // Prevents running during production builds
    },
  ],
});
