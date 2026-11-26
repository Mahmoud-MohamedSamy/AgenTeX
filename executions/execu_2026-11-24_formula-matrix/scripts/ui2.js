// Create form for each layout: formula fields shown and locked; inputs editable. Does not save anything.
const meta = JSON.parse(fs.readFileSync(RUN + '/out/fieldmeta.json', 'utf8'));
const L1 = ['if', 'concat', 'coalesce', 'min', 'max', 'sum', 'avg', 'count', 'upper', 'lower'];
const out = {};
await page.goto(H + `/modules/${made.mod}/records/new`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Inputs \(one field per type\)/i.test(await text())) break; }
await sleep(3000); await shot('create-form-default');
const t0 = await text(); out.layoutPicker = (t0.match(/QA FX Formula Matrix \d/g) || []).filter((v, i, a) => a.indexOf(v) === i);
const scan = async (lay) => {
  for (let i = 0; i < 40; i++) { await page.mouse.wheel(0, 1500); await sleep(200); }
  const body = (await page.innerText('body')).split('\n').map(s => s.trim()).filter(Boolean); const U = body.map(x => x.toUpperCase());
  const want = meta.filter(f => /^fx_/.test(f.n) && (lay === 1) === L1.includes(f.n.split('_')[1]));
  const other = meta.filter(f => /^fx_/.test(f.n) && (lay === 1) !== L1.includes(f.n.split('_')[1]));
  const present = want.filter(f => U.includes(f.label.toUpperCase())).length;
  const leaked = other.filter(f => U.includes(f.label.toUpperCase())).length;
  const computed = (await page.innerText('body')).match(/Computed after save/gi)?.length || 0;
  // editable controls bound to formula fields?
  const editableFx = await page.evaluate(() => [...document.querySelectorAll('input:not([type=hidden]):not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])')].filter(e => /fx_/.test((e.name || '') + (e.id || '') + (e.getAttribute('data-field') || '') + (e.closest('[data-field-name]')?.getAttribute('data-field-name') || ''))).length);
  const inputsPresent = meta.filter(f => /^in_/.test(f.n)).filter(f => U.includes(f.label.toUpperCase())).length;
  await page.evaluate(() => window.scrollTo(0, 0));
  return { expectedFx: want.length, present, otherLayoutFx: leaked, computedAfterSave: computed, editableFxControls: editableFx, inputsPresent }; };
out.default = await scan(1);
// switch layout if a picker exists
const pick = page.getByText(/QA FX Formula Matrix 1/).first();
if (await pick.isVisible().catch(() => false)) { await pick.click().catch(() => {}); await sleep(1000); const o2 = page.getByText(/QA FX Formula Matrix 2/).last(); if (await o2.isVisible().catch(() => false)) { await o2.click(); await sleep(6000); await shot('create-form-layout2'); out.layout2 = await scan(2); } }
log(out); fs.writeFileSync(RUN + '/out/ui-create.json', JSON.stringify(out, null, 1));
await page.goto(H + '/', { waitUntil: 'domcontentloaded' }).catch(() => {});
