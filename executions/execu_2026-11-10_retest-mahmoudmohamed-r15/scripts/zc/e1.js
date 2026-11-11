// NDC-2630: Zoho Compose window on a QA lead (nothing sent), sender list, Emails related list. Read-only.
module.exports = async ({ page, log, shot }) => {
  await require('./view.js')(page, 'QA RT15 2806 Green view');
  await page.getByText('QA RT15 2806 green lead', { exact: true }).locator('visible=true').first().click();
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(1500); if (/Send Email/i.test(await page.innerText('body').catch(() => ''))) break; }
  await page.waitForTimeout(3000); await shot('c-2630-record');
  const T = async () => ((await page.innerText('body').catch(() => '')) || '').replace(/\s+/g, ' ');
  log('emails section', (await T()).match(/.{0,80}Emails.{0,200}/)?.[0] || '-');
  await page.getByText('Send Email', { exact: true }).locator('visible=true').first().click(); await page.waitForTimeout(6000);
  await shot('c-2630-compose'); log('compose', (await T()).slice(-900));
  const from = page.getByText(/^From$/).locator('visible=true'); log('from label', await from.count());
};
