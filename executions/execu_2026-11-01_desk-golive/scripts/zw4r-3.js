async (page) => {
  await page.getByRole('button', { name: 'Not Now' }).click().catch(() => {});
  let t = ''; for (let i = 0; i < 20; i++) { await page.waitForTimeout(1500); t = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' '); if (/Rating|feedback|Happiness Rating/i.test(t.slice(t.indexOf('Need Help') - 3000))) break; }
  await page.screenshot({ path: 'evidence/zoho-w4r/setup-happiness.png' });
  const main = await page.locator('[class*=setup] [class*=content], main, #setupContainer').last().innerText().catch(() => '');
  return { main: main.replace(/\s+/g, ' ').slice(0, 2000) };
}
