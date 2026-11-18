const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D + '/records/96cae089-e8c6-497e-9c50-610a19340d2e', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1500); if (/Deal Information/.test(await text())) break; }
await sleep(2500);
const amt = page.getByText('Amount', { exact: true }).first();
await amt.scrollIntoViewIfNeeded({ timeout: 10000 }).catch(() => log('no Amount label'));
await sleep(1200); await shot('t06-deal-fields.png');
const t = await text(); const i = t.indexOf('Deal Information'); log(t.slice(i, i + 900).replace(/\n/g, ' | '));
