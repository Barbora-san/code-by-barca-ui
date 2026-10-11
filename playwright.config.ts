import { defineConfig } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never", outputFolder: "tests/report" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1400, height: 1000 },
    colorScheme: "dark",
    // CBB_CHROMIUM: cesta ke Chromiu, když nemáš stažené prohlížeče Playwrightu (např. v CI kontejneru).
    launchOptions: process.env.CBB_CHROMIUM ? { executablePath: process.env.CBB_CHROMIUM } : {},
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node scripts/serve-static.mjs demo/dist ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
