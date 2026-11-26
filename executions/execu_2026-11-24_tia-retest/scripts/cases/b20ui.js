await go('/settings/integrations/tia'); await sleep(7000);
const t = await text(); await shot('B-20-no-tia-setup-page', { fullPage: true });
return { lines: t.split('\n').map(s => s.trim()).filter(s => /tia|create|recycle|restore|set up/i.test(s)).slice(0, 12), createBtn: await page.locator('button', { hasText: /Create Tia|Create/ }).count(), launcher: await page.locator('[data-testid="tia-launcher"]').count() };
