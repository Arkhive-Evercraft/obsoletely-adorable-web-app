import { test as setup } from "@playwright/test";

setup("setup auth for user", async ({ page, context }) => {
  await page.goto("http://localhost:3001/api/test/auth");
  await context.storageState({ path: ".auth/user.json" });
});
