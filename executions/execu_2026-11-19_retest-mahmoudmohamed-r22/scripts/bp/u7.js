const out = {};
await page.goto(H + '/views/all/tickets/b5328b28-4ce9-4896-838e-cb8df66e7441', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 tk K1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
let t = (await text()).replace(/\s+/g, ' '); let i = t.search(/Steps/); out.steps = t.slice(i, i + 160);
await page.getByRole('tab', { name: /history/i }).first().click().catch(async () => { await page.getByText(/^History$/i).last().click(); }); await sleep(5000);
t = (await text()).replace(/\s+/g, ' '); i = t.search(/HISTORY/); out.hist = t.slice(i, i + 900);
await shot('3065-12-owner-history-4808.png'); return out;
