// READ-ONLY: open Zoho Desk and report where we land.
module.exports = async ({ page, log }) => {
  await page.goto('https://desk.zoho.com/agent', { waitUntil: 'domcontentloaded', timeout: 90000 });
  for (let s = 0; s < 45; s++) { await page.waitForTimeout(1000); if (/Tickets|sign in|Sign in/i.test(await page.innerText('body').catch(() => ''))) break; }
  await page.waitForTimeout(6000);
  log('URL', page.url());
  log((await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 800));
};
