async (page, frame) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup/workflows/workflowrules', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(9000);
  await page.screenshot({ path: O + 'w1.png' });
  const f = frame();
  return { url: page.url(), frames: page.frames().map(x => x.url().slice(0, 100)), text: (await f.locator('body').innerText().catch(() => '')).slice(0, 1500) };
}
