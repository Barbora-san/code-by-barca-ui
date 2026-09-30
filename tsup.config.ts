import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  // Všechny komponenty používají hooky / DOM → v Next.js App Routeru musí být client.
  banner: { js: '"use client";' },
});
