const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '').slice(0, 120) + ' ' + (q.postData()||'').slice(0, 300) + ' → ' + r.status() + ' ' + (await r.text().catch(()=>'')).slice(0, 300)); }; page.on('response', f);
await page.mouse.click(837, 349); await sleep(3000);
const dl = await page.locator('[role=dialog]').allInnerTexts();
await shot('1311-02-after-click');
page.off('response', f);
return done({ dl, resp, toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), head: (await txt()).split('Timeline')[1]?.slice(0, 120) });
