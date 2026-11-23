const url = fs.readFileSync(RUN + '/out/h1-url.txt', 'utf8').trim();
const val = async () => { const t = await text('main'); const m = t.match(/QA FX UI DOUBLE\s*\n\s*(\S+)/); return m ? m[1] : '?'; };
await page.goto(url, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX UI DOUBLE/.test(await text('main'))) break; }
log('start', await val());
const lbl = page.getByText(/^QA Num$/i).first(); await lbl.scrollIntoViewIfNeeded(); const b = await lbl.boundingBox();
await page.mouse.move(b.x + 40, b.y + b.height + 12); await sleep(800);
const btns = page.locator('button[aria-label="Edit field"]'); const n = await btns.count(); let best = -1, dist = 1e9;
for (let i = 0; i < n; i++) { const bb = await btns.nth(i).boundingBox(); if (!bb) continue; const d = Math.abs(bb.y - (b.y + b.height + 12)); if (d < dist) { dist = d; best = i; } }
await btns.nth(best).click(); await sleep(1500);
let inp = page.getByLabel('QA Num', { exact: true }).last(); if (!(await inp.count())) inp = page.locator('input:visible').last();
log('input', await inp.count(), await inp.inputValue().catch(() => '?'));
await inp.fill('7'); await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(5000);
log('after inline edit (no reload)', await val()); await shot('H4-after-inline');
await page.reload({ waitUntil: 'domcontentloaded' }); for (let k = 0; k < 30; k++) { await sleep(2000); if (/QA FX UI DOUBLE/.test(await text('main'))) break; }
log('after reload', await val());
