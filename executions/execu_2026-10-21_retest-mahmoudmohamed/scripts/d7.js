const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '') + ' ' + (q.postData()||'').slice(0, 400) + ' → ' + r.status() + ' ' + (await r.text().catch(()=>'')).slice(0, 300)); }; page.on('response', f);
const d = page.locator('[role=dialog]').last();
await d.locator('input').first().fill('qa_rt_1295');
await shot('1295-03-typed');
await d.getByRole('button', { name: 'Save' }).click(); await sleep(4000);
page.off('response', f);
await shot('1295-04-after-create');
return done({ resp, toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), board: (await txt()).split('New Pipeline')[1]?.slice(0, 400) });
