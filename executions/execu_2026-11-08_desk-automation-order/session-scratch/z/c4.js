async (page) => {
  const O = 'C:/Users/a/AppData/Local/Temp/claude/a6a908e6f46fe25f/65d82fca-bc8f-4885-a40f-d4fcb04afdac/scratchpad/z/';
  const errs = []; const h = r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().slice(0, 140)); }; page.on('response', h);
  const fails = []; const hf = r => fails.push(r.url().slice(0, 120)); page.on('requestfailed', hf);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(20000);
  page.off('response', h); page.off('requestfailed', hf);
  const f = page.frames().find(x => x !== page.mainFrame() && /ShowHomePage/.test(x.url()));
  const txt = f ? (await f.locator('body').innerText().catch(() => '')).slice(0, 800) : 'noframe';
  await page.screenshot({ path: O + 'c4.png' });
  return { txt, errs: errs.slice(0, 15), fails: fails.slice(0, 15) };
}
