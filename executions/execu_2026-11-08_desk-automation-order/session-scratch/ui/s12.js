const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF E7 editor', 'Edit');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions();
  await L.setCond(0, 'Subject', 'starts with', 'QA AO WF E7 ');
  log('E_row1', (await L.condText()).split('\n').filter(Boolean).slice(0, 12));
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: 'Add condition' }).first()); await page.waitForTimeout(600);
  log('E7_3rows', (await L.condText()).split('\n').filter(Boolean).slice(0, 40));
  log('aria', [...new Set(await main.locator('[aria-label]').evaluateAll(b => b.map(x => x.tagName + ':' + x.getAttribute('aria-label'))))]);
  log('inputs', await main.locator('input').evaluateAll(b => b.map(x => [x.type, x.placeholder, x.getAttribute('aria-label'), x.value].join('|'))));
  await shot('s12-3conds', { full: true });
};
