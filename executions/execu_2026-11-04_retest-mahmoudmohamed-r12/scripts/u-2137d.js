const o = {}; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (/records/i.test(await text())) break; } await sleep(3000);
await shot('2137-c-list.png'); o.buttons = await page.locator('button[aria-label]').evaluateAll(a => a.map(x => x.getAttribute('aria-label')).filter(t => /kanban|list|view|layout|board/i.test(t)));
return o;
