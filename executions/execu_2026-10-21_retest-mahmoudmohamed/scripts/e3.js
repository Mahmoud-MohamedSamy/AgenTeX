const sec = async () => (await txt()).split('Layout and operation')[1]?.split('Back\nNext')[0];
const out = {};
for (const op of ['Update existing only', 'Add and update']) { await page.getByText(op, { exact: true }).click(); await sleep(2000); out[op] = await sec(); await shot('1518-' + op.replace(/ /g, '-')); }
// layout control
const sel = page.locator('select').first(); const isSel = await sel.count();
out.layoutCtl = isSel ? await sel.evaluate(s => [...s.options].map(o => o.text + (o.selected ? '*' : ''))) : 'not select';
if (isSel) { await sel.selectOption({ label: 'Test' }); await sleep(2000); out.testLayout = await sec(); await shot('1519-02-addupdate-test-layout'); await sel.selectOption({ label: 'Standard' }); await sleep(2000); out.stdLayout = await sec(); }
return done(out);
