const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, log, shot } = h; const B = process.env.BR;
  log('ua', await page.evaluate(() => navigator.userAgent.slice(-40)));
  log('listRows', (await page.getByRole('row').count()) - 1);
  await openEditor(h, 'QA AO WF O13 ' + B, 'Create');
  const L = require('./lib-cond')(page); const { main, clk } = L;
  await L.openConditions(); await L.setCond(0, 'Subject', 'starts with', 'QA AO WF O13 ');
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(600);
  await clk(main.getByRole('button', { name: /^Field Update/ }).first()); await page.waitForTimeout(800);
  await clk(main.getByRole('button', { name: 'Add field' }).last()); await page.waitForTimeout(500);
  await main.locator('xpath=//button[@aria-label="Remove Subject"]/..//input | //button[@aria-label="Remove Subject"]/..//textarea').last().fill('QA AO WF O13 done');
  await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(4000);
  log('afterSave', page.url().replace(/^https:\/\/[^/]+/, '').slice(0, 60));
  await page.locator('input[placeholder^="Search rules"]').first().fill('QA AO WF O13 ' + B).catch(() => {}); await page.waitForTimeout(2000);
  log('found', (await page.getByRole('row').allInnerTexts()).filter(r => r.includes('O13')).map(r => r.replace(/\s+/g, ' ').slice(0, 90)));
  await shot('o13-' + B);
};
