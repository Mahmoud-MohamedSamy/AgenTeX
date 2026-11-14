await go('/analytics/dashboards/builder', 15000);
out.body = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 1500); out.url = page.url().replace(H, '');
await shot('w5/W5-30-state'); return fin({ out });
