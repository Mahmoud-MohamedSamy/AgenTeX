const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.mouse.click(606, 437); await sleep(1200);
const sopts = await page.evaluate(() => [...document.querySelectorAll('[role=option], [role=menuitem], [cmdk-item]')].filter(e => e.offsetParent).map(e => e.innerText.trim()).slice(0, 12));
await shot('1302-03c-stage-options');
const o = page.locator('[role=option]:visible').first(); if (await o.count()) { await o.click(); await sleep(800); }
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/records$/.test(q.url().split('?')[0])) resp.push({ s: r.status(), res: (await r.text().catch(() => '')).slice(0, 300) }); }; page.on('response', f);
await page.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000);
page.off('response', f);
const toasts = await page.evaluate(() => [...document.querySelectorAll('[data-sonner-toast]')].map(t => t.innerText.trim()));
await shot('1302-04-saved');
let stored = null; const id = resp[0]?.res?.match(/"id":"([0-9a-f-]{36})"/)?.[1];
if (id) stored = Object.fromEntries(((await api('GET', `/modules/${D}/records/${id}`)).j?.data?.data || []).filter(x => /^(pipeline|stage)$/.test(x.field)).map(x => [x.field, x.value.value]));
return done({ sopts, resp, toasts, id, stored, url: page.url().replace(H, '') });
