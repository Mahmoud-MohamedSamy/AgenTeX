const TS = 'c7bb126d-0c55-489f-8924-5fd6f2a98507';
const rail = await page.evaluate(() => [...document.querySelectorAll('aside a, nav a, [data-sidebar] a')].map(a => a.getAttribute('aria-label') || a.title || a.innerText.trim()).filter(Boolean).slice(0, 40));
const resp = []; const fr = async r => { const q = r.request(); if (q.method() !== 'GET' && /teamspace/.test(q.url())) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 80) + ' ' + r.status()); }; page.on('response', fr);
await page.getByRole('button', { name: 'Save', exact: true }).last().click(); await sleep(3500); page.off('response', fr);
const mods = arr((await api('GET', `/teamspaces/${TS}/modules`)).j?.data).map(x => (x.moduleKey || x.name) + ' folder=' + String(x.folderId || '-').slice(0, 8));
return done({ rail, resp, mods });
