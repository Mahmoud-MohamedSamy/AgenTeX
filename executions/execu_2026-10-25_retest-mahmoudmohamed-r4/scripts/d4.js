const d = page.locator('[role=dialog]').last();
await d.locator('#module-label-input').fill('QA RT Agents Only'); await d.locator('#module-singular-input').fill('QA RT Agent Only'); await sleep(300);
await d.getByText('Desk Agent', { exact: true }).click(); await sleep(300);
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /modules|permission|acl/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 70) + ' ' + r.status() + ' ' + (q.postData() || '').slice(0, 120)); }; page.on('response', fr);
await d.getByRole('button', { name: 'Create', exact: true }).click(); await sleep(5000); page.off('response', fr);
const m = arr((await api('GET', '/modules')).j?.data).find(x => x.labels?.en === 'QA RT Agents Only');
let acl = null; if (m) { const a = await api('GET', `/modules/${m.id}/acl`); acl = a.s + ' ' + a.t.slice(0, 300); const p = await api('GET', `/modules/${m.id}/permissions`); acl += ' | perms ' + p.s + ' ' + p.t.slice(0, 200); }
await shot('2220-02-created');
return done({ resp, id: m?.id, key: m?.moduleKey, lastMod: m?.lastModifiedByName, acl });
