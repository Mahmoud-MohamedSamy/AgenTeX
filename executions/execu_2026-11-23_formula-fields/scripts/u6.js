const url = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim();
await page.goto(url, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX UI Double/.test(await text('main'))) break; } await sleep(2000);
let t = await text('main'); let i = t.indexOf('QA FX UI Double'); log('I1 record page', JSON.stringify(t.slice(i, i + 60)));
const el = page.getByText('QA FX UI Double', { exact: true }).first(); await el.scrollIntoViewIfNeeded(); await shot('I1-record-page');
// H4 inline edit qa_num on record page
const numLbl = page.getByText('QA Num', { exact: true }).first(); const box = await numLbl.boundingBox(); log('num label box', box);
await page.mouse.dblclick(box.x + 300, box.y + box.height / 2); await sleep(1500); await shot('H4-inline-open');
const inp = page.locator('input:focus'); log('focused input', await inp.count());
if (await inp.count()) { await inp.fill('10'); await inp.press('Enter'); await sleep(5000); }
t = await text('main'); i = t.indexOf('QA FX UI Double'); log('after inline edit', JSON.stringify(t.slice(i, i + 60))); await shot('H4-after-inline');
await page.reload({ waitUntil: 'domcontentloaded' }); for (let k = 0; k < 30; k++) { await sleep(2000); if (/QA FX UI Double/.test(await text('main'))) break; }
t = await text('main'); i = t.indexOf('QA FX UI Double'); log('after reload', JSON.stringify(t.slice(i, i + 60)));
