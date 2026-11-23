const url = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim();
const val = async () => { const t = await text('main'); const m = t.match(/QA FX UI Double\s*\n?\s*([^\n]*)/i); return m ? m[1] : '?'; };
await page.goto(url, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX UI Double/i.test(await text('main'))) break; }
log('start', await val());
await page.getByRole('button', { name: 'Edit', exact: true }).first().click(); await sleep(4000);
const num = page.getByLabel('QA Num', { exact: true }); await num.fill('10'); await shot('H3-edit-form');
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(6000);
for (let i = 0; i < 20; i++) { if (/QA FX UI Double/i.test(await text('main'))) break; await sleep(1500); }
log('after edit', await val()); await page.getByText(/QA FX UI Double/i).first().scrollIntoViewIfNeeded().catch(() => { }); await shot('H3-after-edit');
// H4 inline edit in the side panel: hover the QA Num value
const lbl = page.getByText(/^QA Num$/i).first(); await lbl.scrollIntoViewIfNeeded(); const b = await lbl.boundingBox(); log('qa num label', b);
await page.mouse.move(b.x + 40, b.y + b.height + 12); await sleep(800); await shot('H4-hover');
const pencils = await page.locator('button[aria-label*="Edit" i]').evaluateAll(x => x.map(e => e.getAttribute('aria-label')).slice(0, 15)); log('edit buttons', pencils);
