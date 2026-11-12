async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  await f.fill('#ruleNameTmp', 'QA AO WF Z1'); await f.fill('#ruleDescTmp', '');
  await f.click('#showWFRuleStep2Btn'); await page.waitForTimeout(3000);
  await page.screenshot({ path: O + 'w8.png' });
  return (await f.locator('body').innerText()).replace(/\n{2,}/g, '\n').split('Basic Information').slice(-1)[0].slice(0, 1500);
}
