import { test as setup } from "@playwright/test";

setup("setup auth for admin", async ({ page, context }) => {
  await page.goto("http://localhost:3002/api/test/auth");
  await context.storageState({ path: ".auth/admin.json" });
});
