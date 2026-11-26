const meta = JSON.parse(fs.readFileSync(RUN + '/out/fieldmeta.json', 'utf8')); const inputs = meta.filter(f => /^in_/.test(f.n));
await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layout}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/if\(\) · Single Line/i.test(await text())) break; } await sleep(3000);
await page.getByPlaceholder('Search field types').fill('Formula'); await sleep(1500);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('if() · Single Line', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down();
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 100 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); }
await sleep(400); await page.mouse.up(); await sleep(3500); await shot('builder-new-formula-panel');
const t = await text(); const panel = (t.match(/Field Properties[\s\S]*/i) || [''])[0];
const chipsArea = (panel.match(/Insert a field[\s\S]*/i) || [panel])[0];
const chipLines = chipsArea.split(String.fromCharCode(10)).map(s => s.trim()); const offered = inputs.filter(x => chipLines.includes(x.n)).map(x => x.n); const missing = inputs.filter(x => !chipLines.includes(x.n)).map(x => x.n + ' (' + x.dt + ')');
const fns = (chipsArea.match(/\b(abs|avg|coalesce|concat|count|daysbetween|hoursbetween|if|isblank|len|lower|max|min|number|round|sum|text|trim|upper)\b/g) || []).filter((v, i, a) => a.indexOf(v) === i);
const out = { panelFound: !!panel, insertFieldFound: /Insert a field/i.test(panel), offered: offered.length, missing, functions: fns.length, fnList: fns.join(','), fxChips: meta.filter(x => /^fx_/.test(x.n) && chipLines.includes(x.n)).length, chipsSample: chipLines.filter(Boolean).slice(0, 60).join(','), panelHead: panel.slice(0, 300).replace(/\n/g, ' | ') };
log(out); fs.writeFileSync(RUN + '/out/ui-builder.json', JSON.stringify(out, null, 1));
// discard: Cancel without saving
await page.getByRole('button', { name: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1500);
const dis = page.getByRole('button', { name: /Discard|Leave|Yes/ }).first(); if (await dis.isVisible().catch(() => false)) await dis.click(); await sleep(1500);
