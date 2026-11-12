const { openEditor } = require('./lib-ed');
const clk = l => l.dispatchEvent('click');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF E3 editor', 'Edit');
  const main = page.locator('main').last();
  await clk(main.getByText(/No conditions — actions run/).first()); await page.waitForTimeout(800);
  await clk(main.getByText('Tickets matching certain conditions', { exact: true }).first()); await page.waitForTimeout(800);
  log('ariaButtons', [...new Set(await main.locator('button[aria-label]').evaluateAll(b => b.map(x => x.getAttribute('aria-label'))))].slice(0, 40));
  const openOpts = async (btn) => { await btn.click({ force: true }); await page.waitForTimeout(600); const o = await page.locator('[role=option]').allInnerTexts(); return o; };
  const choose = async (btn, label) => { await btn.click({ force: true }); await page.waitForTimeout(500); await page.locator(`xpath=//*[@role='option'][starts-with(normalize-space(.),'${label}')]`).first().click(); await page.waitForTimeout(600); };
  // field button of row 1: the button that currently shows the field name / placeholder
  const fieldBtn = () => main.locator('button[aria-label="Field"], button[aria-label="Condition field"]').first();
  const hasFieldAria = await fieldBtn().count();
  const fb = hasFieldAria ? fieldBtn : () => main.getByRole('button', { name: /— select field —/ }).first();
  const E3 = {};
  let cur = null;
  for (const f of ['Subject', 'Priority', 'Due Date', 'Ticket Owner', 'Skills', 'Contact', 'Status']) {
    try {
      const btn = main.locator('button[aria-label="— select field —"]').first();
      await choose(btn, f); cur = f;
      const op = main.getByRole('button', { name: 'Operator' }).first();
      const before = await op.innerText().catch(() => '?');
      const ops = await openOpts(op); await page.keyboard.press('Escape');
      E3[f] = { defaultOp: before.trim(), ops: ops.map(o => o.trim()) };
    } catch (e) { E3[f] = 'ERR ' + String(e.message).split('\n')[0].slice(0, 160); }
  }
  log('E3', E3); await shot('s11-e3', { full: true });
};
