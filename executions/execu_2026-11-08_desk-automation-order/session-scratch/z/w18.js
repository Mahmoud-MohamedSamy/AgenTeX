async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await f.getByText('Cancel', { exact: true }).filter({ visible: true }).first().click().catch(() => {});
  await page.waitForTimeout(600);
  await f.locator('#step3Btn').click().catch(async () => { await page.mouse.click(325, 842); });
  await page.waitForTimeout(3000);
  await f.evaluate(() => { [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).forEach(e => e.scrollTop = e.scrollHeight); });
  await page.waitForTimeout(800);
  await page.screenshot({ path: O + 'w18.png' });
  const t = (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n');
  return t.split(/\n4\n/).slice(-1)[0].slice(0, 1500);
}
