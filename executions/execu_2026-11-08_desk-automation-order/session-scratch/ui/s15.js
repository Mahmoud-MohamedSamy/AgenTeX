const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF E9 pattern', 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions();
  await L.setCond(0, 'Subject', 'starts with', 'QA AO WF E9 ');
  for (let i = 1; i < 3; i++) { await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500); await L.setCond(i, 'Subject', 'contains', 'x' + i); }
  const setVal = (loc, val) => loc.evaluate((e, v) => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); }, val);
  const patIn = async () => { const v = await main.locator('input').evaluateAll(b => b.map(x => x.value)); const i = v.findIndex(x => /^[(]?[0-9]+ (and|or)/.test(x)); return i >= 0 ? main.locator('input').nth(i) : null; };
  const E9 = {};
  for (const p of ['1 and', '(1 and 2', '1 and 4', '1 and 2', '1 and 2 or 3', '1 && 2 || 3', '(1 or 2) and 3']) {
    let pin = await patIn();
    if (!pin) { await clk(main.getByRole('button', { name: /Edit Pattern/i }).first()).catch(() => {}); await page.waitForTimeout(500); pin = await patIn(); }
    if (!pin) { E9[p] = 'no pattern box: ' + JSON.stringify(await main.locator('input').evaluateAll(b => b.map(x => x.value))); continue; }
    await setVal(pin, p); await clk(main.getByRole('button', { name: 'Apply', exact: true }).first()); await page.waitForTimeout(600);
    E9[p] = (await L.condText()).split('\n').filter(l => /Criteria Pattern \(|invalid|paren|unused|missing|mix|bracket|unknown|refer|must|every|between|use each/i.test(l)).slice(0, 4);
    await shot('s15-' + p.replace(/\W+/g, '_'));
  }
  log('E9', E9);
};
