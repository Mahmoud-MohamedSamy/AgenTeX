async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  eval(require('fs').readFileSync(O + 'zapi.js', 'utf8').replace('async function zapi', 'globalThis.zapi = async function'));
  const fu = await zapi(page, 'GET', 'automationFieldUpdates/1475109000000570567');
  const tk = await zapi(page, 'GET', 'tickets/1475109000000570585');
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/automation/1475109000000426945/notifyrules', { waitUntil: 'domcontentloaded' });
  let ok = false;
  for (let k = 0; k < 4 && !ok; k++) {
    await page.waitForTimeout(12000);
    const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
    const t = f ? await f.locator('body').innerText().catch(() => '') : '';
    if (/Closing a ticket/.test(t)) ok = true; else await page.reload({ waitUntil: 'domcontentloaded' });
  }
  await page.screenshot({ path: O + 'c31a.png' });
  return { loaded: ok, fieldUpdate: fu.s + ' ' + JSON.stringify(fu.j).slice(0, 120), ticket: tk.s + ' trashed=' + (tk.j && tk.j.isTrashed) + ' ' + JSON.stringify(tk.j).slice(0, 80) };
}
