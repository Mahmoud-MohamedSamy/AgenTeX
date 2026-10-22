const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '8e8227b2-a494-47e3-a368-4e2880e49c39';
const resp = []; const f = async r => { const q = r.request(); if (/^(PATCH|PUT|POST)$/.test(q.method()) && q.url().includes('/modules/')) resp.push({ m: q.method(), u: q.url().replace(H + '/api/v1', ''), body: (q.postData() || '').slice(0, 800), s: r.status(), res: (await r.text().catch(() => '')).slice(0, 800) }); }; page.on('response', f);
await page.getByText('Standard (Default)').first().click(); await sleep(1500);
await page.locator('[role=listbox] [role=option]').filter({ hasText: /^\s*1\s*$/ }).first().click(); await sleep(2000);
await page.locator('[role=dialog]').getByRole('button', { name: 'Change pipeline' }).click(); await sleep(6000);
page.off('response', f);
const g = await api('GET', `/modules/${D}/records/${R}`);
return done({ resp, api: g.j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => x.field + '=' + x.value.value), toasts: await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts(), head: (await txt()).split('Timeline')[1]?.slice(0, 120) });
