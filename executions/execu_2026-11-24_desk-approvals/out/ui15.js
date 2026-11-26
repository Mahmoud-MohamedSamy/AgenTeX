await go('/approvals'); await sleep(4000);
const g = page.getByRole('button', { name: /^(AR|EN|العربية|English|Language)/i }).first(); if (await g.count()) { await g.click(); await sleep(1000); const en = page.getByText(/^English$/).first(); if (await en.count()) { await en.click(); await sleep(4000); } }
const o = { dir: await page.evaluate(() => document.documentElement.dir || 'ltr'), lang: await page.evaluate(() => document.documentElement.lang) };
o.sample = (await page.locator('[data-testid="approvals-page"]').innerText().catch(() => '')).slice(0, 120);
await go('/settings/personal/locale'); await sleep(4000); o.locale = await page.locator('main select').evaluateAll(es => es.map(e => e.value));
return o;
