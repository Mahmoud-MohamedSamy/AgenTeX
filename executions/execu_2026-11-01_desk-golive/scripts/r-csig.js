const o = {};
for (const p of ['/mail/signatures', '/mail/signatures/me', '/mail/signatures/company', '/mail/signatures/tenant', '/mail/settings', '/desk/settings/email', '/desk/mail/settings', '/mail/signature-settings']) { const r = await api('GET', p); o[p] = r.s + ' ' + r.t.slice(0, 500); }
const dl = await api('GET', '/desk/departments/2a73bbc0-efb3-4250-bf9b-2fdc98236794'); o.mkt = dl.s + ' ' + JSON.stringify(dl.j && dl.j.data && Object.fromEntries(Object.entries(dl.j.data).filter(([k]) => /sig/i.test(k)))).slice(0, 400);
const b = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.src)); o.hits = [];
for (const src of b) { const t = await (await fetch(src)).text().catch(() => ''); const m = t.match(/.{0,60}signatures[^`'"]{0,40}.{0,60}/g) || []; o.hits.push(...m.filter(x => /get|post|put|patch|\$\{/.test(x)).slice(0, 15)); }
return done(o);
