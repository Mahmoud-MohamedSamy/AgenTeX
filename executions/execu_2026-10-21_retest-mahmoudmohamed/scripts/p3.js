const id = 'cbd11c32-9131-41c6-b919-8507cfe5f508';
const out = {};
for (const u of [`/teamspaces/${id}`, `/teamspaces/${id}/access`, `/teamspaces/${id}/acl`, `/teamspaces/${id}/members`, `/teamspaces/${id}/permissions`]) { const r = await api('GET', u); out[u.split(id)[1] || '/'] = r.s + ' ' + r.t.slice(0, 500); }
const resp = []; const f = async r => { const u = r.url(); if (/teamspace/i.test(u) && u.includes('/api/')) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
await go('/settings', 7000); await page.getByText('Teamspace', { exact: true }).first().click(); await sleep(7000);
page.off('response', f);
out.page = (await txt()).split('Storage Requests')[1]?.slice(0, 800); out.resp = resp;
await shot('1172-01-teamspaces-page');
return done(out);
