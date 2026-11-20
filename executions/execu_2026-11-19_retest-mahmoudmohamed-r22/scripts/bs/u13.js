const out = {}; const BP = '5392f456-66f9-4bc7-aa95-99bad990f4d5';
await page.goto(H + '/settings/automation/blueprints/' + BP, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'ar')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); const tt = await text(); if (/QA a3/.test(tt)) break; if (/502 Bad Gateway/.test(tt) && i % 5 == 4) await page.reload({ waitUntil: 'domcontentloaded' }); } await sleep(2000);
for (const s of ['Open', 'On Hold', 'Escalated']) {
  const n = page.locator('.react-flow__node').filter({ hasText: s === 'Escalated' ? 'Escalat' : s }).first(); await n.click(); await sleep(2500);
  out[s] = await page.locator('select').evaluateAll(es => es.filter(e => e.options.length === 3).map(e => { const inp = e.parentElement?.querySelector('input') || e.previousElementSibling?.querySelector?.('input') || e.parentElement?.parentElement?.querySelector('input'); return (inp ? inp.value : '?') + ' ' + e.options[e.selectedIndex].text + ' [' + [...e.options].map(o => o.text).join('/') + ']'; }));
  out[s + '_txt'] = (await text()).replace(/\s+/g, ' ').match(/(حد الوقت|المهلة|الوقت).{0,250}/)?.[0];
  await shot('3063-ar-' + s.replace(' ', '') + '.png');
}
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return out;
