const L = 'e647a303-e5a7-46a0-b199-9ef1644ab3c0';
await page.goto(`${H}/modules/${T.LEADS}/records/${L}`, { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=QA RT 2624 timeline lead', { timeout: 120000 }); await sleep(3000);
await page.locator('text=/^Timeline$/').first().click(); await sleep(6000); await shot('2624-5-timeline.png');
const t = await text(); return (t.match(/(attachment|deleted|restored)[^\n]{0,80}/gi) || []).slice(0, 10);
