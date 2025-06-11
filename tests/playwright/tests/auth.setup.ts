// playwright/tests/auth.setup.ts
import { test as setup } from '@playwright/test';
import fs from 'fs';

setup('authenticate admin', async ({ page, context }) => {
  await page.goto('http://localhost:3002/api/test/auth'); // sets the cookie
  await context.storageState({ path: '.auth/admin.json' });
});

setup('authenticate user', async ({ page, context }) => {
  await page.goto('http://localhost:3001/api/test/auth'); // sets the cookie
  await context.storageState({ path: '.auth/user.json' });
});
