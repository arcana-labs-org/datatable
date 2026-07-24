import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { defineConfig } from "vite";

// The Svelte adapter intentionally reproduces the exact React/Vue markup
// (divs with grid roles, spans acting as clear buttons); the a11y hints would
// ask for a different DOM. `state_referenced_locally` flags the deliberate
// "initial value" pattern also used by the React adapter (useState(value)).
export const svelteWarningFilter = {
  onwarn(warning: { code: string }, handler: (warning: { code: string }) => void) {
    if (warning.code.startsWith("a11y") || warning.code === "state_referenced_locally") return;
    handler(warning);
  }
};

export default defineConfig({
  plugins: [
    vue(),
    react(),
    svelte(svelteWarningFilter),
    // The Angular entry is compiled by `ngc` (npm run build:angular), not by
    // this bundle — see tsconfig.angular.json.
    dts({ include: ["src"], exclude: ["src/angular", "src/angular.ts"], tsconfigPath: "./tsconfig.json" })
  ],
  build: {
    minify: "oxc",
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        vue: resolve(__dirname, "src/vue.ts"),
        react: resolve(__dirname, "src/react.ts"),
        svelte: resolve(__dirname, "src/svelte.ts")
      },
      formats: ["es", "cjs"],
      fileName: (format, entry) => `${entry}.${format === "es" ? "js" : "cjs"}`
    },
    rollupOptions: {
      external: ["vue", "react", "react-dom", "react/jsx-runtime", /^svelte(\/|$)/, /^@arcanalabs\/ui-components(\/|$)/],
      output: {
        exports: "named",
        assetFileNames: (asset) => asset.name?.endsWith(".css") ? "arcanalabs-datatable.css" : "assets/[name][extname]"
      }
    }
  }
});
