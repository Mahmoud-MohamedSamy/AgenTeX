const o = {}; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', V = '568be7a1-729a-4ecc-976c-59296c7af9b2';
for (const u of [`/modules/${D}?view=${V}`, `/modules/${D}?viewId=${V}`, `/modules/${D}/views/${V}`]) {
  await page.goto(H + u, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (/Kanban View/.test(await text()) && /EGP|\$|Amount|Sum/.test(await text())) break; } await sleep(3000);
  const t = await text(); o[u] = { kanban: /Kanban View/.test(t), url: page.url(), snippet: (t.match(/Kanban View[\s\S]{0,500}/) || [''])[0].slice(0, 500) };
  if (o[u].kanban) { await shot('2137-b-board.png'); o.dom = await page.evaluate(() => { const els = [...document.querySelectorAll('[data-testid], [class*=kanban], [class*=column]')].slice(0, 30); return els.map(e => (e.getAttribute('data-testid') || e.className.toString().slice(0, 60)) + ' :: ' + e.innerText.replace(/\s+/g, ' ').slice(0, 50)); }); break; }
}
return o;
