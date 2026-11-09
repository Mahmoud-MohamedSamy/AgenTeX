const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b';
await page.goto(H + '/settings/modules-and-fields/' + M, { waitUntil: 'domcontentloaded' }); await sleep(6000);
const tabs = await page.$$eval('[role=tab], nav a, button', bs => bs.map(b => b.innerText.trim()).filter(t => t && t.length < 40));
const res = { tabs: [...new Set(tabs)] };
await shot('c01-module-page');
res.tabTexts = {};
for (const t of ['Layouts', 'Fields', 'Layout Rules', 'Validation Rules', 'Record Locking Configuration', 'Map Dependency Fields', 'Links', 'Buttons', 'Summary']) {
  const el = page.locator('[role=tab], button, a', { hasText: new RegExp('^\s*' + t + '\s*$') }).first();
  if (!(await el.count())) { res.tabTexts[t] = 'NO TAB'; continue; }
  await el.click().catch(() => {}); await sleep(3000);
  const txt = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ');
  const i = txt.indexOf(t);
  res.tabTexts[t] = { inDev: /In Development/i.test(txt), url: page.url().replace(H, ''), text: txt.slice(Math.max(0, txt.lastIndexOf('Summary')), Math.max(0, txt.lastIndexOf('Summary')) + 600) };
  await shot('c01-tab-' + t.replace(/\s+/g, '-').toLowerCase());
}
return res;
