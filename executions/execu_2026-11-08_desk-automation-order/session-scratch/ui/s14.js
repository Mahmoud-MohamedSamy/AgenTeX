const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF G4 dbl', 'Edit');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions();
  await L.setCond(0, 'Subject', 'starts with', 'QA AO WF G4 ');
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500);
  await L.setCond(1, 'Subject', 'contains', 'عربي😀‍<b>x</b>');
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(500);
  await L.setCond(2, 'Subject', 'changed');
  const E9 = {};
  const patIn = async () => {
    const v = await main.locator('input').evaluateAll(b => b.map(x => x.value));
    const i = v.length - 1;
    return (i > 9 && /^[(]?[0-9]|^$/.test(v[i])) ? main.locator('input').nth(i) : null;
  };
  const setVal = (loc, val) => loc.evaluate((e, v) => { const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); }, val);
  for (const p of ['1 and', '(1 and 2', '1 and 4', '1 and 2', '1 and 2 or 3', '1 && 2 || 3', '(1 or 2) and 3']) {
    let pin = await patIn();
    if (!pin || !(await main.getByRole('button', { name: 'Apply', exact: true }).count())) {
      await clk(main.getByRole('button', { name: /Edit Pattern/i }).first()).catch(() => {}); await page.waitForTimeout(500); pin = await patIn();
    }
    if (!pin) { E9[p] = 'no pattern box'; continue; }
    await setVal(pin, p);
    await clk(main.getByRole('button', { name: 'Apply', exact: true }).first()); await page.waitForTimeout(600);
    E9[p] = (await L.condText()).split('\n').filter(l => /Criteria Pattern \(|invalid|paren|unused|missing|mix|bracket|unknown|refer|must|every|between/i.test(l)).slice(0, 4);
  }
  log('E9', E9); await shot('s14-e9', { full: true });
  await clk(main.getByRole('button', { name: 'Remove condition' }).nth(1)); await page.waitForTimeout(600);
  log('E10', (await L.condText()).split('\n').filter(l => /Criteria Pattern|refer|unknown/i.test(l)).slice(0, 4));
  await shot('s14-e10', { full: true });
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
  await clk(main.getByRole('button', { name: 'Add field' }).first()); await page.waitForTimeout(500);
  await L.choose(main.locator('button[aria-label="— select field —"]').last(), 'Description');
  await main.locator('xpath=//button[@aria-label="Remove Description"]/..//input | //button[@aria-label="Remove Description"]/..//textarea').first().fill('QA WF G4');
  await main.getByRole('button', { name: 'Save & Activate' }).first().dblclick({ force: true });
  await page.waitForTimeout(4000); log('G4_url', page.url()); log('G4_fix', ((await main.innerText()).split('Fix these before saving:')[1] || '').slice(0, 300));
};
