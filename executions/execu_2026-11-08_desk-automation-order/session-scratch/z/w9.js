async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await f.getByText('Create', { exact: true }).first().click();
  await page.waitForTimeout(800);
  const btns = await f.$$eval('input[type=button],button', b => b.filter(x => x.offsetParent).map(x => (x.id || '') + ':' + (x.value || x.innerText).trim()));
  const nx = await f.$$('input[value=Next]:visible, button:has-text("Next"):visible');
  if (nx.length) await nx[nx.length - 1].click();
  await page.waitForTimeout(3000); await page.screenshot({ path: O + 'w9.png' });
  return { btns, text: (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n').split('Execute the rule when a record is deleted.').slice(-1)[0].slice(0, 1500) };
}
