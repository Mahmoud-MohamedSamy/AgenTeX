const o = {}; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (/records/i.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'Kanban view' }).click(); for (let i = 0; i < 60; i++) { await sleep(2000); if ((await page.locator('[data-rbd-droppable-id], [data-kanban-column], [data-testid*=column i]').count()) > 0) break; } await sleep(5000);
o.url = page.url(); await shot('2137-d-board.png');
o.cols = await page.evaluate(() => [...document.querySelectorAll('[data-rbd-droppable-id], [data-kanban-column], [data-testid*=column i], [data-testid*=kanban i]')].slice(0, 6).map(e => (e.getAttribute('data-testid') || e.getAttribute('data-rbd-droppable-id') || '') + ' :: ' + e.innerText.replace(/\s+/g, ' ').slice(0, 80)));
o.testids = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-testid]')].map(e => e.getAttribute('data-testid')))].filter(t => /kanban|column|card|board|lane/i.test(t)).slice(0, 20));
o.text = (await text()).slice(-1200);
return o;
