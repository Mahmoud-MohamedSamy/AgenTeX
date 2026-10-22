const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', PS = '5170500c-b335-479c-96d1-ed138965c345', P1 = '640e03a4-9c24-4b06-8d7d-5c1db2711b9b';
const get = async p => Object.fromEntries((await api('GET', `/modules/${D}/stage-probability?pipeline_id=${p}`)).j.data.map(x => [x.stageValue, x.probability + '/' + x.forecastCategory]));
const before = { std: await get(PS), p1: await get(P1) };
const row = page.locator('[role=dialog] tr').filter({ hasText: /^\s*qualification/ }).first();
const inp = row.locator('input').first(); await inp.fill('15');
const sel = row.locator('select'); const nsel = await sel.count();
// forecast control: select or buttons
let fc = 'n/a';
if (nsel) { fc = await sel.last().evaluate(s => [...s.options].map(o => o.text).join(',')); await sel.last().selectOption({ label: 'Best Case' }); }
else { const b = row.getByText('Best Case', { exact: true }); if (await b.count()) { await b.click(); fc = 'clicked'; } }
await shot('1308-02-std-15-bestcase');
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '') + ' ' + (q.postData()||'').slice(0, 300) + ' → ' + r.status()); }; page.on('response', f);
await page.locator('[role=dialog]').getByRole('button', { name: 'Save probabilities' }).click(); await sleep(3500);
page.off('response', f);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts();
const after = { std: await get(PS), p1: await get(P1) };
return done({ nsel, fc, before, after, resp, toasts });
