const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', PQ = '57aeb866-ba75-49d4-962b-fc9140d073ad';
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '') + ' ' + (q.postData()||'').slice(0, 400) + ' → ' + r.status() + ' ' + (await r.text().catch(()=>'')).slice(0, 500)); }; page.on('response', f);
await page.locator('[role=dialog]').last().getByRole('button', { name: 'Delete' }).click(); await sleep(4000);
const dlg2 = await page.locator('[role=dialog]').allInnerTexts();
await shot('1325-07-after-delete-click');
page.off('response', f);
return done({ resp, dlg2, toasts: await page.locator('[data-sonner-toast]').allInnerTexts() });
