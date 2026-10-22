await page.setViewportSize({ width: 1280, height: 720 });
const ts = await api('GET', '/teamspaces');
let users = null; for (const u of ['/iam/users?limit=100', '/iam/users?page=1&page_size=100', '/users?limit=100']) { const r = await api('GET', u); if (r.s === 200) { users = arr(r.j.data).map(x => (x.email || x.user_email) + ' | ' + (x.profiles || []).map(p => p.name || p).join(',') + ' | ' + (x.status || '')); break; } }
return done({ ts: arr(ts.j.data).map(t => t.id + ' ' + t.name + ' access=' + (t.accessibility || t.access || t.accessMode || JSON.stringify(t).slice(0, 0))), tsRaw: JSON.stringify(arr(ts.j.data)[0]).slice(0, 600), users });
