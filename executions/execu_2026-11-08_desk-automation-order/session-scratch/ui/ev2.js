module.exports = async ({ page, go, shot, txt, log }) => {
  const T = '88e8ea44-1658-4df3-9930-d0902b91073d', T7 = 'b99fbebc-d245-47ef-a3e1-d30533d6da85';
  await go(`/modules/${T}/records/${T7}`); await page.waitForTimeout(5000);
  for (let k = 0; k < 3; k++) { const h = page.getByText('HISTORY', { exact: true }).first(); if (await h.isVisible().catch(() => false)) { await h.click(); break; } await page.mouse.click(1415, 172); await page.waitForTimeout(600); }
  await page.waitForTimeout(3000);
  const body = await page.locator('body').innerText(); const i = body.indexOf('Ticket History -'); log('history', body.slice(i, i + 2500));
  await shot('ev-d07-history-top');
  await page.mouse.move(1050, 600); for (let k = 0; k < 6; k++) { await page.mouse.wheel(0, 400); await page.waitForTimeout(300); }
  await page.waitForTimeout(800); await shot('ev-d07-history-bottom');
};
