const reqs = []; const f = r => { const u = r.url(); if (/\/api\//.test(u) && r.status() >= 400 && !/iam\/auth/.test(u)) reqs.push(r.status() + ' ' + u.replace(H, '').slice(0, 120)); }; page.on('response', f);
await page.goto(H + '/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (/records/.test(t) || /don't have access/.test(t)) break; }
await sleep(3000); page.off('response', f);
const t = await txt(); const me = await api('GET', '/iam/me').catch(() => ({ s: 'x' }));
return done({ noAccess: /don't have access/.test(t), records: (t.match(/\d+ records/) || [])[0], errs: reqs.slice(0, 10), me: me.s });
