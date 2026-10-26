// Read-only UI tour: nav links, activities page, API calls each page makes
const calls = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !/heartbeat|presence|\/iam\//.test(u)) calls.push(r.method() + ' ' + u.replace(API, '')); }; page.on('request', f);
const out = {};
await go('/hq', 8000);
out.links = await page.$$eval('a[href]', as => [...new Set(as.map(a => a.getAttribute('href') + ' | ' + (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 40)))]);
const actLink = out.links.find(l => /activit/i.test(l));
out.actLink = actLink;
if (actLink) { calls.length = 0; await go(actLink.split(' | ')[0], 10000); out.actUrl = page.url(); out.actText = (await txt()).slice(0, 2500); out.actCalls = [...new Set(calls)]; out.actShot = await shot('tavi-activities-list'); }
page.off('request', f);
return done(out);
