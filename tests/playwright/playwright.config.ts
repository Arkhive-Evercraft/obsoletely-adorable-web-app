import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
import fs from "fs";
import path from "path";

// Ensure .auth directory exists
const authDir = path.resolve(".auth");
if (!fs.existsSync(authDir)) {
  fs.mkdirSync(authDir);
  console.log(".auth directory created");
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    // Setup Projects
    {
      name: "admin-setup",
      testMatch: /admin\.setup\.ts/,
    },
    {
      name: "user-setup",
      testMatch: /user\.setup\.ts/,
    },

    // Admin App Tests
    {
      name: "admin-chromium",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3002",
        storageState: ".auth/admin.json",
      },
      dependencies: process.env.CI ? ["admin-setup"] : [],
    },

    // User App Tests
    {
      name: "user-chromium",
      testDir: "./tests/user",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3001",
        storageState: ".auth/user.json",
      },
      dependencies: process.env.CI ? ["user-setup"] : [],
    },
  ],

  webServer: process.env.CI
    ? [
        {
          reuseExistingServer: true,
          command: "pnpm start:admin",
          url: "http://localhost:3002",
        },
        {
          reuseExistingServer: true,
          command: "pnpm start:user",
          url: "http://localhost:3001",
        },
      ]
    : undefined,
});
