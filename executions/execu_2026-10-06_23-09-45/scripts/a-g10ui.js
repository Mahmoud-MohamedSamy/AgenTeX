const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
await go(`/modules/${OPEN}`, 7000);
await page.locator('button', { has: page.locator('svg') }).filter({ hasText: /^$/ }).nth(0);
const plus = page.locator('header button, nav button').filter({ hasText: /^$/ });
await page.mouse.click(661, 28); await sleep(1200);
const o = page.getByText('QA MF Open1', { exact: true }); if (await o.count()) { await o.last().click(); await sleep(3000); }
const t = (await txt()).replace(/\s+/g, ' ');
const s = await shot('G10-agent-quick-create');
rec('G10.ui', 'INFO', `quick-create form text: ${['QA MF L-Admin', 'QA MF L-Agent', 'Default', 'Layout'].map(n => n + ':' + t.includes(n)).join(' ')}`, { shot: s });
await page.keyboard.press('Escape');
return done();
