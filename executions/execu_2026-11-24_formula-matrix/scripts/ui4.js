const out = {}; const meta = JSON.parse(fs.readFileSync(RUN + '/out/fieldmeta.json', 'utf8')); const L1 = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower'];
await page.goto(H + `/modules/${made.mod}/records/new`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Inputs \(one field per type\)/i.test(await text())) break; } await sleep(3000);
const sel = page.locator('select').filter({ hasText: 'QA FX Formula Matrix 2' }).first();
out.select = await sel.selectOption({ label: 'QA FX Formula Matrix 2' }).catch(e => 'ERR ' + e.message.split('\n')[0]);
await sleep(8000);
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1500); await sleep(200); }
const U = (await page.innerText('body')).split('\n').map(s => s.trim().toUpperCase());
const w2 = meta.filter(f => /^fx_/.test(f.n) && !L1.includes(f.n.split('_')[1])), w1 = meta.filter(f => /^fx_/.test(f.n) && L1.includes(f.n.split('_')[1]));
out.layout2 = { expectedFx: w2.length, present: w2.filter(f => U.includes(f.label.toUpperCase())).length, layout1FxShown: w1.filter(f => U.includes(f.label.toUpperCase())).length, inputsPresent: meta.filter(f => /^in_/.test(f.n) && U.includes(f.label.toUpperCase())).length };
out.readonlyFx = await page.evaluate(() => [...document.querySelectorAll('input[placeholder="Computed after save"]')].filter(e => e.readOnly).length);
out.editableComputed = await page.evaluate(() => [...document.querySelectorAll('input[placeholder="Computed after save"]')].filter(e => !e.readOnly && !e.disabled).length);
const s2 = page.getByText('fx daysbetween()', { exact: true }).first(); await s2.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1200); await shot('create-form-L2-fx-daysbetween');
// layout 1 again for the read-only count
await sel.selectOption({ label: 'QA FX Formula Matrix 1' }).catch(() => {}); await sleep(8000);
for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1500); await sleep(200); }
out.layout1ReadonlyFx = await page.evaluate(() => [...document.querySelectorAll('input[placeholder="Computed after save"]')].filter(e => e.readOnly).length);
log(out); fs.writeFileSync(RUN + '/out/ui-create2.json', JSON.stringify(out, null, 1));
await page.goto(H + '/', { waitUntil: 'domcontentloaded' }).catch(() => {});
