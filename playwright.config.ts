import { config as dotenvConfig } from "dotenv";
import { defineConfig, devices } from "@playwright/test";

dotenvConfig();

const isCI = !!process.env.CI;

const crossBrowserConfig = {
  testDir: "./tests/visual/cross-browser",
  snapshotPathTemplate: ".test/snaps/{projectName}/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
  },
};

export default defineConfig({
  timeout: 1000 * 60,
  workers: isCI ? 1 : undefined,
  retries: isCI ? 2 : 0,
  forbidOnly: isCI,
  testDir: "./tests",
  fullyParallel: true,

  outputDir: ".test/spec/output",
  snapshotPathTemplate:
    ".test/spec/snaps/{projectName}/{testFilePath}/{arg}{ext}",
  testMatch: "*.spec.{ts,tsx}",
  reporter: [
    [
      "html",
      {
        outputFolder: ".test/spec/results",
        open: "never",
      },
    ],
    ["allure-playwright"],
    isCI ? ["github"] : ["line"],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "on",
    video: "retain-on-failure",
    headless: process.env.CI === "true" ? true : false,
  },
  projects: [
    {
      name: "cross-chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
      ...crossBrowserConfig,
    },

    {
      name: "cross-firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["cross-chromium"],
      ...crossBrowserConfig,
    },

    // {
    //   name: "cross-browser",
    //   use: { ...devices["Desktop Safari"] },
    //   dependencies: ["cross-firefox"],
    //   ...crossBrowserConfig,
    // },
  ],
});
