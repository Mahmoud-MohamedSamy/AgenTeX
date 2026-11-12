const { openEditor } = require('./lib-ed');
const clk = l => l.dispatchEvent('click');
const ACT = /^(Field Update|Owner Assignment|Webhook|Email|Task|Create Record|Add Tags|Remove Tags|Send happiness email|Update related record|Add comment|Send email reply|Add followers|Mark as spam|Share ticket|Add skills|Remove skills|Recalculate skills|Reassign ticket based on skills|Change layout)$/;
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF D10 editor', 'Delete');
  const main = page.locator('main').last();
  await clk(main.getByRole('button', { name: 'Add action' }).first()); await page.waitForTimeout(700);
  const offered = (await main.getByRole('button').allInnerTexts()).map(t => t.split('\n')[0].trim()).filter(t => ACT.test(t));
  log('D10_offered_on_Delete', [...new Set(offered)]);
  await shot('s9-d10-picker', { full: true });
  await clk(main.getByRole('button', { name: 'Close' }).first()).catch(() => {});
  // E1
  await clk(main.getByText(/No conditions — actions run/).first()); await page.waitForTimeout(700);
  const C = async () => ((await main.innerText()).split('CONDITION')[1] || '').split('Instant actions')[0];
  log('E1_panel', (await C()).slice(0, 700));
  await clk(main.getByText('Tickets matching certain conditions', { exact: true }).first()); await page.waitForTimeout(700);
  log('E1_matching', (await C()).slice(0, 1200)); await shot('s9-cond', { full: true });
};
