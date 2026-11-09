module.exports = async ({ page, shot, log, args }) => {
  const fails = []; page.on('requestfailed', r => fails.push(r.url().slice(0, 120) + ' ' + (r.failure() || {}).errorText));
  await page.goto(args[0] || 'https://crm.zoho.com/crm/org943261092/tab/Leads', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(Number(args[1] || 20000));
  log('URL', page.url()); log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2500));
  log('FAILS', fails.slice(0, 15).join('\n'));
  await shot(args[2] || 'probe');
};
