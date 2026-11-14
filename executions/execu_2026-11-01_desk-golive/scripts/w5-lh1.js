const G = []; const onG = r => { const u = r.url(); if (/legal|hold/i.test(u)) G.push(r.request().method() + ' ' + u.replace(API, '') + ' ' + r.status()); }; page.on('response', onG);
await go('/settings/data/retention', 12000); const t = (await page.locator('body').innerText()).replace(/\s+/g, ' '); const i = t.search(/Legal hold/i); out.lh = i > 0 ? t.slice(i, i + 800) : 'no legal hold text';
out.lhBtns = await page.locator('main').last().getByRole('button').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()).filter(x => /hold/i.test(x)));
await shot('w5/W5-48-retention');
await go('/tickets/a9a4c545-cd24-451a-ae7d-6025f16b4797', 12000);
await page.getByRole('button', { name: /More|Ticket actions|actions/i }).first().click().catch(() => {}); await sleep(1500);
out.tmenu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
page.off('response', onG); out.G = G;
return fin({ out });
