const out = {}; const LANG = process.env.LANG2 || 'en';
await page.goto(H + '/settings/automation/blueprints/5392f456-66f9-4bc7-aa95-99bad990f4d5', { waitUntil: 'commit' }); await page.evaluate(l => localStorage.setItem('anyware_language', l), LANG); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); const tt = await text(); if (/QA a3/.test(tt)) break; if (/502 Bad Gateway/.test(tt) && i % 5 == 4) await page.reload({ waitUntil: 'domcontentloaded' }); } await sleep(2000);
for (const s of ['Open', 'On Hold', 'Escalated', 'Closed']) {
  const pos={Open:[385,506],'On Hold':[650,506],Escalated:[905,506],Closed:[1160,506]}[s]; await page.mouse.click(pos[0],pos[1]); await sleep(2500);
  const panel = await page.evaluate(() => { const ins = [...document.querySelectorAll('input[type=number], select')]; return ins.map(e => { const lab = e.closest('label, div')?.parentElement?.innerText?.replace(/\s+/g, ' ').slice(0, 80); return e.tagName + ':' + (e.tagName === 'SELECT' ? e.options[e.selectedIndex]?.text + ' [' + [...e.options].map(o => o.text).join('/') + ']' : e.value) + ' | ' + lab; }); });
  out[s] = panel.filter(p => /Minute|Hour|Day|دقيق|ساع|يوم|أيام/.test(p) || /^INPUT/.test(p));
  await shot('3063-1-' + s.replace(' ', '') + '-' + LANG + '.png');
}
return out;
