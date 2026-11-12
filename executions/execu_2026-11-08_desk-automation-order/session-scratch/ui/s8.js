const { openEditor } = require('./lib-ed');
const clk = l => l.dispatchEvent('click');
module.exports = async (h) => {
  const { page, shot, log } = h; await openEditor(h, 'QA AO WF D2 editor');
  const main = page.locator('main').last(); const P = async () => (await main.innerText()).split('WHEN')[1].split('CONDITION')[0];
  await clk(main.getByRole('button', { name: 'Field Changed', exact: true }).first()); await page.waitForTimeout(500);
  // D3: open watch field picker (the button showing "Subject")
  const wf = main.locator('button:has-text("Subject"), [role=combobox]:has-text("Subject")').first();
  await wf.click({ force: true }).catch(() => clk(wf)); await page.waitForTimeout(800);
  const opts = await page.getByRole('option').allInnerTexts(); log('D3_count', opts.length); log('D3_watch', opts.slice(0, 120)); await shot('s8-watch');
  await page.keyboard.press('Escape');
  // D4/D5
  await clk(main.getByText('A Date-Time field', { exact: true })); await page.waitForTimeout(600);
  const df = main.locator('button:has-text("Pick a date field"), [role=combobox]:has-text("Pick a date field")').first();
  await df.click({ force: true }).catch(() => clk(df)); await page.waitForTimeout(800);
  log('D5_dates', await page.getByRole('option').allInnerTexts()); await shot('s8-dates'); await page.keyboard.press('Escape');
  // D8
  for (const t of ['Business hours', 'Elapsed time']) { await clk(main.getByRole('button', { name: t, exact: true }).first()); await page.waitForTimeout(500); log('D8_' + t, (await P()).split('\n').filter(l => /hour|elapsed|executed/i.test(l))); }
  // D9
  await clk(main.getByText('One time', { exact: true }).first()); await page.waitForTimeout(300); log('D9', (await P()).split('\n').filter(l => /fires|time|recurring/i.test(l)).slice(-5));
  // D4 save without date field
  await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(1500);
  log('D4_save', { toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), errs: (await main.innerText()).split('\n').filter(l => /pick|fix|required|need/i.test(l)).slice(0, 8), url: page.url() });
  await shot('s8-d4save', { full: true });
};
