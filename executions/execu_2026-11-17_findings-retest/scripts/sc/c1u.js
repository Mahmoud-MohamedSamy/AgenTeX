await page.goto(H + '/settings/company/details', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(1500); if (/Home currency/i.test(await text())) break; }
await sleep(2000);
await shot('C1-1-company-details.png');
const t = await text(); let i = t.search(/Currency/); log('TEXT ' + t.slice(0, 2500).replace(/\n/g, ' | '));
const cur = page.getByText('Currencies', { exact: true }).first(); await cur.scrollIntoViewIfNeeded().catch(() => {});
await sleep(800); await shot('C1-2-currencies.png');
// find any currency control in company profile
const ctl = await page.locator('label, [class*=label]').filter({ hasText: /^Currency$/ }).all(); log('currency labels ' + ctl.length);
const btns = await page.locator('main button').allInnerTexts(); log('buttons ' + btns.map(s => s.trim()).filter(Boolean).join(' | '));
