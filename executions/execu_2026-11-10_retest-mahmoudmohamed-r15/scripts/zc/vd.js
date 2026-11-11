module.exports = async ({ page, log, shot, args }) => {
  const id = args[0];
  await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads/custom-view/' + id + '/list', { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let i = 0; i < 30; i++) { await page.waitForTimeout(2000); if (/Total Records/.test(await page.innerText('body').catch(() => ''))) break; }
  await page.waitForTimeout(3000); await shot('c-vd-' + id);
  const t = await page.innerText('body').catch(() => ''); log('has QA RT15 view name', (t.match(/QA RT15 \d+ [A-Za-z ]*view/) || [''])[0]);
};
