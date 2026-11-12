const { openEditor } = require('./lib-ed');
const NL = String.fromCharCode(10);
module.exports = async (h) => {
  const { page, ctx, shot, log } = h;
  await openEditor(h, 'QA AO WF D3 G9', 'Field Changed');
  const main = page.locator('main').last(); const clk = l => l.dispatchEvent('click');
  await main.getByText(/This rule will be executed/).first().click().catch(() => {}); await page.waitForTimeout(800);
  const wf = main.locator('button[aria-label="Watch field"]').first();
  log('D3_btn', await wf.count());
  if (await wf.count()) { await wf.click({ force: true }); await page.waitForTimeout(1200); const o = (await page.locator('xpath=//*[@role="option"]').allInnerTexts()).map(x => x.split(NL)[0]); log('D3_count', o.length); log('D3_sample', o.slice(0, 40)); log('D3_system', o.filter(x => /Created Time|Modified Time|Ticket Number/.test(x))); await page.keyboard.press('Escape'); }
  await shot('s28-d3', { full: true });
  // G9: drop the session, then save
  await ctx.clearCookies(); await page.evaluate(() => { try { sessionStorage.clear(); Object.keys(localStorage).filter(k => !/workflow-rule-draft/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) {} });
  await clk(main.getByRole('button', { name: 'Save & Activate' }).first()); await page.waitForTimeout(4000);
  log('G9', { url: page.url(), toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), signin: await page.locator('input[type=password]').count(), drafts: await page.evaluate(() => Object.keys(localStorage).filter(k => /draft/.test(k))) });
  await shot('s28-g9', { full: true });
};
