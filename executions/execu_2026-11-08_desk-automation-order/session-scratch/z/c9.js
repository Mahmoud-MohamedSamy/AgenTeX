async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  globalThis.__posts = []; if (!globalThis.__wired) { globalThis.__wired = 1; page.on('request', r => { if (r.method() !== 'GET' && /workflow|fieldUpdate|Workflow/i.test(r.url())) globalThis.__posts.push(r.method() + ' ' + r.url().slice(0, 160) + ' ' + (r.postData() || '').slice(0, 1500)); }); }
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/workflows/rules', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(12000);
  await page.screenshot({ path: O + 'c9.png' });
  return page.url();
}
