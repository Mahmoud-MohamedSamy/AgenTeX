const resp = []; const fr = async r => { const q = r.request(); if (q.method() === 'DELETE' && /teamspaces/.test(q.url())) resp.push(q.url().replace(H + '/api/v1', '') + ' ' + r.status()); }; page.on('response', fr);
await page.getByRole('button', { name: 'Delete teamspace' }).click(); await sleep(3000); page.off('response', fr);
const list = arr((await api('GET', '/teamspaces')).j?.data).map(t => t.name);
await shot('1689-04-deleted');
return done({ resp, url: page.url().replace(H, ''), list, toasts: await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim())) });
