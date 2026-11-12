async (page, frame) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/workflows/rules', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(12000);
  await page.screenshot({ path: O + 'w3.png' });
  return { url: page.url(), text: (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(-2000) };
}
