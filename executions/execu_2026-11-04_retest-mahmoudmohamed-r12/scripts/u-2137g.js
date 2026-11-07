const o = { errs: [] }; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
page.on('response', async r => { if (r.status() >= 400 && /api\/v1/.test(r.url())) o.errs.push(r.status() + ' ' + r.request().method() + ' ' + decodeURIComponent(r.url().replace(/^.*api\/v1/, '')).slice(0, 200) + ' ' + (await r.text().catch(() => '')).slice(0, 200)); });
await page.goto(H + '/modules/' + D, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.locator('[data-testid=board-column-total]').count()) break; } await sleep(15000);
await shot('2137-f-board-15s.png');
o.cardProbe = await page.evaluate(() => { const col = document.querySelector('[data-testid=board-column-caption]')?.closest('section, [class*=column], div[role=list], div'); const all = [...document.querySelectorAll('[data-testid]')].map(e => e.getAttribute('data-testid')); const uniq = [...new Set(all)].filter(t => !/sidebar|nav|menu|header/i.test(t)).slice(0, 40); return uniq; });
o.cardsText = await page.evaluate(() => [...document.querySelectorAll('[data-testid*=card i], [role=listitem], article')].slice(0, 5).map(e => (e.getAttribute('data-testid') || e.tagName) + ' :: ' + e.innerText.replace(/\s+/g, ' ').slice(0, 80)));
return o;
