const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D + '/records/96cae089-e8c6-497e-9c50-610a19340d2e', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1500); if (/QA CUR1117/.test(await text())) break; }
await sleep(3000);
await shot('t04-deal-usd.png');
let t = await text(); for (const k of ['Amount', 'Currency', 'Exchange Rate', 'Expected Revenue']) { const i = t.indexOf('\n' + k + '\n'); log(k + ' => ' + (i < 0 ? 'n/a' : t.slice(i + 1, i + 80).replace(/\n/g, ' | '))); }
await page.goto(H + '/modules/' + D + '/records/new', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1500); if (/Deal Name/i.test(await text())) break; }
await sleep(2500);
const lab = page.getByText('Currency', { exact: true }).first(); await lab.scrollIntoViewIfNeeded().catch(() => {});
await sleep(800); await shot('t05-deal-create.png');
const box = await lab.boundingBox(); log('currency label ' + JSON.stringify(box));
