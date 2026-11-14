await go('/analytics/reports/builder', 12000);
out.url = page.url().replace(H, ''); out.body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 800);
out.dialogs = await page.locator('[role=dialog]').count();
await shot('w5/state'); return fin({ out });
