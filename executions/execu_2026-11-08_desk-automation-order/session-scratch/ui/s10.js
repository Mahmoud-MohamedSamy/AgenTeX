const { openEditor } = require('./lib-ed');
const clk = l => l.dispatchEvent('click');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF E editor', 'Edit');
  const main = page.locator('main').last();
  await clk(main.getByText(/No conditions — actions run/).first()); await page.waitForTimeout(800);
  await clk(main.getByText('Tickets matching certain conditions', { exact: true }).first()); await page.waitForTimeout(800);
  const C = async () => ((await main.innerText()).split('CONDITION')[1] || '').split('Instant actions')[0];
  const fieldCtl = main.locator('select, button, [role=combobox]').filter({ hasText: '— select field —' }).first();
  log('fieldCtlTag', await fieldCtl.evaluate(e => e.tagName + ' ' + (e.getAttribute('role') || '')));
  const isSelect = (await fieldCtl.evaluate(e => e.tagName)) === 'SELECT';
  let fields = [];
  if (isSelect) fields = await fieldCtl.locator('option').allInnerTexts();
  else { await fieldCtl.click({ force: true }); await page.waitForTimeout(800); fields = await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); }
  log('E_fieldCount', fields.length); log('E_fields', fields.map(f => f.split('\n')[0]).slice(0, 120));
  const pick = async (label) => {
    const ctl = main.locator('select, button, [role=combobox]').filter({ hasText: /— select field —|Subject|Priority|Status|Due Date|Ticket Owner|Tags|Skills|Contact Name|Email/ }).first();
    if (isSelect) await ctl.selectOption({ label }); else { await ctl.click({ force: true }); await page.waitForTimeout(500); await page.getByRole('option', { name: new RegExp('^' + label) }).first().click(); }
    await page.waitForTimeout(700);
    const opCtl = main.locator('select, button, [role=combobox]').filter({ hasText: /equals|is one of|contains|is|before|after|between|changed|empty/i }).first();
    let ops = [];
    if (await opCtl.count()) {
      if ((await opCtl.evaluate(e => e.tagName)) === 'SELECT') ops = await opCtl.locator('option').allInnerTexts();
      else { await opCtl.click({ force: true }); await page.waitForTimeout(500); ops = await page.getByRole('option').allInnerTexts(); await page.keyboard.press('Escape'); }
    }
    return { ops, panel: (await C()).split('\n').filter(Boolean).slice(0, 14) };
  };
  const E3 = {};
  for (const f of ['Subject', 'Priority', 'Due Date', 'Ticket Owner', 'Tags', 'Skills', 'Contact Name', 'Address']) {
    if (!fields.some(x => x.startsWith(f))) { E3[f] = 'not offered'; continue; }
    try { E3[f] = await pick(f); } catch (e) { E3[f] = 'ERR ' + String(e.message).slice(0, 150); }
  }
  log('E3', E3); await shot('s10-cond', { full: true });
};
