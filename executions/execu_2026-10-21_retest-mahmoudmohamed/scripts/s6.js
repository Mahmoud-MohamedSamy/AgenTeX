const resp = []; const f = async r => { const u = r.url(); if (/iam\/users|directory|agents/.test(u)) resp.push(r.request().method() + ' ' + u.replace(API, '').slice(0, 120) + ' ' + r.status()); }; page.on('response', f);
await go('/views/all', 12000);
const fb = page.getByRole('button', { name: /Filter/i }).first(); await fb.click(); await sleep(2000);
const own = page.getByText('Ticket Owner', { exact: true }).first(); await own.click(); await sleep(2500);
const panel = (await txt()).split('Ticket Owner')[1]?.slice(0, 900);
await shot('2218-01-owner-filter');
page.off('response', f);
return done({ resp, panel });
