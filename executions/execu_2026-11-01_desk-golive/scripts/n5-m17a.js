const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Tickets/.test(t) && !/Loading/.test(t)) break; }
await sleep(2000); o.url = page.url().replace(H, ''); o.t = (await txt()).replace(/\s+/g, ' ').slice(0, 800);
o.links = await page.$$eval('a', as => as.map(a => a.getAttribute('href')).filter(h => h && /settings/.test(h))).then(l => [...new Set(l)].slice(0, 60));
return JSON.stringify(o);
