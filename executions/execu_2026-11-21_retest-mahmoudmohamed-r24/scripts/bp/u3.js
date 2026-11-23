const out = {};
for (const [k, id] of [['role', 'f2b2c1f5-56fd-4098-91e8-8a8704f78898'], ['cs', 'f85fde0c-1152-4743-95f6-801f19e99b33']]) {
  await page.goto(H + '/settings/automation/blueprints/' + id, { waitUntil: 'domcontentloaded' });
  for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA onlyA/.test(await text())) break; }
  await page.getByText('QA onlyA', { exact: true }).first().click(); await sleep(3000);
  const sel = page.locator('select', { has: page.locator('option', { hasText: /Add owner/ }) }).first();
  out[k] = await sel.evaluate(s => [...s.options].map(o => o.text)).catch(e => 'ERR ' + e.message.slice(0, 80));
  if (k === 'cs') { await sel.scrollIntoViewIfNeeded().catch(() => {}); await shot('3065-8-designer-cs-owner-options.png'); }
}
return out;
