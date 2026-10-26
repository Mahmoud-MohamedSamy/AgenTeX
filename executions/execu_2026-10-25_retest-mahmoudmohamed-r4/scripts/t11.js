const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /teamspace|folder/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 80) + ' ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 160) : '')); }; page.on('response', fr);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(4000);
page.off('response', fr);
const toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim()));
const ts = arr((await api('GET', '/teamspaces')).j?.data).find(t => t.name === 'QA RT TS');
let tree = null; if (ts) { const f = await api('GET', `/teamspaces/${ts.id}/folders`); const m = await api('GET', `/teamspaces/${ts.id}/modules`); tree = { folders: arr(f.j?.data).map(x => x.id.slice(0, 8) + ' ' + x.name), modules: arr(m.j?.data).map(x => (x.moduleKey || x.name) + ' folder=' + (x.folderId || x.folder_id || '-').toString().slice(0, 8)) }; }
await shot('ts-07-saved');
return done({ resp, toasts, tsId: ts?.id, tree, url: page.url().replace(H, '') });
