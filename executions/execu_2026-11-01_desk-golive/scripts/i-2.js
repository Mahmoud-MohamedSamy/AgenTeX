const o = {}; await go('/settings/personal/signatures', 12000);
o.links = await page.locator('a[href^="/settings"]').evaluateAll(as => as.map(a => (a.innerText || '').trim() + ' ' + a.getAttribute('href')).filter(x => /sign|mail|email|brand|channel/i.test(x)));
const reqs = []; page.on('request', r => { if (/\/api\//.test(r.url())) reqs.push(r.method() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '')); });
for (const l of o.links.slice(0, 6)) { const href = l.split(' ').pop(); if (!/sign/i.test(href)) continue; await go(href, 10000); o['t ' + href] = (await txt()).replace(/\s+/g, ' ').slice(0, 700); }
o.reqs = [...new Set(reqs)].filter(x => /sign/i.test(x));
return done(o);
