import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: __dirname,
  base: process.env.DOCS_BASE ?? "/arcanalabs-datatable/",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true }
});
