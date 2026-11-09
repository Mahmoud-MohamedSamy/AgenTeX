const gets = new Set(); page.on('request', r => { const u = r.url(); if (u.includes('/api/') && /report|dataset|catalog|semantic/i.test(u)) gets.add(r.method() + ' ' + u.replace(API, '').split('?')[0]); });
await go('/', 8000); await go('/reports', 15000); await shot('m14-reports');
const nb = page.getByRole('button', { name: /new report|create report/i }).first(); if (await nb.count()) { await nb.click(); await sleep(8000); await shot('m14-new'); }
return done({ url: page.url(), gets: [...gets], t: (await txt()).split('\n').filter(l => /QA RT r8|dataset|Choose/i.test(l)).slice(0, 10) });
