// Layout builder: open a formula field's properties and check "Insert a field" offers every input type. Does not save.
const meta = JSON.parse(fs.readFileSync(RUN + '/out/fieldmeta.json', 'utf8')); const inputs = meta.filter(f => /^in_/.test(f.n));
await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layout}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/if\(\) · Single Line/i.test(await text())) break; } await sleep(3000);
await shot('builder-L1');
const f = page.getByText('if() · Single Line', { exact: true }).first(); await f.scrollIntoViewIfNeeded(); await f.click(); await sleep(2500);
let t = await text(); if (!/Insert a field/i.test(t)) { const adv = page.getByText(/^Advanced$/i).first(); if (await adv.isVisible().catch(() => false)) { await adv.click(); await sleep(1500); } t = await text(); }
await shot('builder-formula-panel');
const panel = (t.match(/Insert a field[\s\S]*/i) || [''])[0];
const offered = inputs.filter(x => panel.includes(x.label)).map(x => x.label); const missing = inputs.filter(x => !panel.includes(x.label)).map(x => x.label + ' (' + x.dt + ')');
const fxOffered = meta.filter(x => /^fx_/.test(x.n) && panel.includes(x.label)).length;
const out = { panelFound: !!panel, inputs: inputs.length, offered: offered.length, missing, formulasOfferedAsChips: fxOffered, functions: (panel.match(/\b(abs|avg|coalesce|concat|count|daysbetween|hoursbetween|if|isblank|len|lower|max|min|number|round|sum|text|trim|upper)\(/g) || []).filter((v, i, a) => a.indexOf(v) === i) };
log(out); fs.writeFileSync(RUN + '/out/ui-builder.json', JSON.stringify(out, null, 1));
await page.goto(H + '/', { waitUntil: 'domcontentloaded' }).catch(() => {});
