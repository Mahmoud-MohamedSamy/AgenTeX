module.exports = async ({ page, go, log }) => {
  await go('/hq'); await page.waitForTimeout(5000);
  const t = await page.locator('body').innerText(); log('onlineLine', t.split('\n').filter(l => /online|offline|available/i.test(l)).slice(0, 6));
  for (let i = 0; i < 16; i++) { await page.waitForTimeout(15000); if (i % 4 === 3) await page.reload().catch(() => {}); }
  log('stayed', '4 min');
};
