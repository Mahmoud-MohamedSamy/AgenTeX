const res = {};
await page.locator('main input[aria-label="Dashboard name"]').fill('QA R2W5 Dashboard');
await page.locator('main button[aria-label="Add filter"]').first().click(); await sleep(1500);
const d = page.locator('[role=dialog]').first();
await d.locator('input').first().fill('QA Pick filter').catch(() => {});
const btns = await d.locator('button, select').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText.trim().slice(0, 30)) + (e.tagName === 'SELECT' ? ':' + [...e.options].map(o => o.text).join('/') : '')));
res.btns = btns;
const sel = d.locator('select');
if (await sel.count()) {
  const o0 = await sel.nth(0).evaluate(s => [...s.options].map(o => o.text)); res.fieldOpts = o0.slice(0, 30);
  const f = o0.find(x => /QA Pick/.test(x)); if (f) await sel.nth(0).selectOption({ label: f }); await sleep(800);
  if (await sel.count() > 1) { const o1 = await sel.nth(1).evaluate(s => [...s.options].map(o => o.text)); res.condOpts = o1; const c = o1.find(x => /^(is|equals|in)/i.test(x)) || o1[1]; if (c) await sel.nth(1).selectOption({ label: c }); }
} else {
  await d.locator('button', { hasText: 'Choose a field' }).first().click(); await sleep(1000);
  res.fieldOpts = await page.$$eval('[role=option], [cmdk-item]', os => os.map(o => o.innerText.trim())).then(a => a.slice(0, 40));
  await page.locator('[role=option], [cmdk-item]', { hasText: /QA Pick/ }).first().click().catch(() => {}); await sleep(800);
  await d.locator('button', { hasText: 'Choose a condition' }).first().click().catch(() => {}); await sleep(1000);
  res.condOpts = await page.$$eval('[role=option], [cmdk-item]', os => os.map(o => o.innerText.trim()));
  await page.locator('[role=option], [cmdk-item]').first().click().catch(() => {}); await sleep(800);
}
await shot('s03-filter-dialog');
await d.locator('button', { hasText: /^Save$/ }).click(); await sleep(2000);
res.after = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 500);
await shot('s03-filter-added');
return res;
