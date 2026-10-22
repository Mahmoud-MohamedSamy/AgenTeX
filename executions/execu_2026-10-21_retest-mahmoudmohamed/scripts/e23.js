const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', PQ = '57aeb866-ba75-49d4-962b-fc9140d073ad';
const d = page.locator('[role=dialog]').last();
const sels = d.locator('select'); const n = await sels.count();
const info = await sels.evaluateAll(es => es.map(e => [...e.options].map(o => o.text).join('|')));
if (n >= 4) { await sels.nth(0).selectOption({ label: 'Standard' }); await sleep(800);
  await sels.nth(1).selectOption({ label: 'closed_won' }); await sels.nth(2).selectOption({ label: 'closed_lost' }); await sels.nth(3).selectOption({ label: 'needs_analysis' }); }
await sleep(800); await shot('1325-08-transfer-mapped');
const resp = []; const f = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/')) resp.push(q.method() + ' ' + q.url().replace(H + '/api/v1', '') + ' ' + (q.postData()||'').slice(0, 400) + ' → ' + r.status() + ' ' + (await r.text().catch(()=>'')).slice(0, 400)); }; page.on('response', f);
if (n >= 4) { await d.getByRole('button', { name: 'Transfer and Delete' }).click(); await sleep(5000); }
page.off('response', f);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts();
await shot('1325-09-after-transfer');
const pn = { '5170500c-b335-479c-96d1-ed138965c345': 'Standard', '640e03a4-9c24-4b06-8d7d-5c1db2711b9b': '1', [PQ]: 'QA RT 1325 pipeline (deleted)' };
const recs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data).filter(r => /QA RT 1325/.test(JSON.stringify(r.data))).map(r => { const g = k => (r.data.find(x => x.field === k) || {}).value?.value; return g('deal_name') + ' → ' + (pn[g('pipeline')] || g('pipeline')) + ' / ' + g('stage'); });
const gone = await api('GET', `/modules/${D}/pipelines/${PQ}`);
return done({ n, info, resp, toasts, recs, deletedPipeline: gone.s });
