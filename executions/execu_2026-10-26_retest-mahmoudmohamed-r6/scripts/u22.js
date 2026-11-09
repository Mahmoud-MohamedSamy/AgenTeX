// Evidence for the new bug: Deals field list shows the custom 'Pipeline' field (read-only screens).
page.on('dialog', d => d.accept().catch(() => {}));
await go('/settings/modules-and-fields/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', 15000);
const tabs = await page.getByRole('tab').allInnerTexts().catch(() => []);
const ft = page.getByRole('tab', { name: /Fields/i }).first(); if (await ft.count()) { await ft.click(); await sleep(4000); }
const s = page.locator('input[placeholder*="earch"]:visible').first(); if (await s.count()) { await s.fill('Pipeline'); await sleep(2500); }
await shot('pipe-01-field-list');
const rows = (await txt()).split('\n').filter(l => /pipeline/i.test(l)).slice(0, 10);
return done({ tabs, rows });
