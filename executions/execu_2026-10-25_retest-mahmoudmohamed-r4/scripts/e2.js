// NDC-1602: confirm Empty Bin (user asked 26 Oct to retest it), record the bin calls, then count what is left.
const net = []; const t0 = {};
const onRq = r => { if (/recycle-bin/.test(r.url()) && r.method() !== 'GET') { t0[r.url() + r.method()] = Date.now(); let ids = null; try { ids = (JSON.parse(r.postData() || '{}').ids || []).length; } catch (e) { } net.push({ m: r.method(), u: r.url().replace(/^.*\/api\/v1/, '').replace(/\?.*/, ''), ids, body: ids === null ? (r.postData() || '').slice(0, 150) : undefined }); } };
const onRs = async r => { const q = r.request(); if (/recycle-bin/.test(r.url()) && q.method() !== 'GET') { const e = net.find(x => x.u === r.url().replace(/^.*\/api\/v1/, '').replace(/\?.*/, '') && x.s === undefined); if (e) { e.s = r.status(); e.ms = Date.now() - t0[r.url() + q.method()]; e.resp = (await r.text().catch(() => '')).slice(0, 300); } } };
page.on('request', onRq); page.on('response', onRs);
const d = page.locator('[role=dialog],[role=alertdialog]').last();
await d.locator('input').first().fill('DELETE'); await sleep(500); await shot('1602-r2-03-typed');
const tc = Date.now(); await d.getByRole('button', { name: 'Empty Bin' }).click();
await sleep(2500); await shot('1602-r2-04-after-2s'); const t2 = (await txt()).split('\n').filter(l => /working|removed|deleted|failed|timed out|error|items|processed/i.test(l)).slice(0, 10);
await sleep(12000); await shot('1602-r2-05-after-15s'); const t15 = (await txt()).split('\n').filter(l => /working|removed|deleted|failed|timed out|error|items|processed/i.test(l)).slice(0, 10);
await sleep(45000); await shot('1602-r2-06-after-60s'); const t60 = (await txt()).split('\n').filter(l => /working|removed|deleted|failed|timed out|error|items|processed/i.test(l)).slice(0, 10);
page.off('request', onRq); page.off('response', onRs);
let n = 0, cur = '', left = []; for (let i = 0; i < 60; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); const a = arr(r.j?.data); n += a.length; left.push(...a.map(x => x.record_label)); cur = r.j?.meta?.next_cursor; if (!cur || !a.length) break; }
return done({ clickedAt: new Date(tc).toISOString(), net, t2, t15, t60, leftApi: n, leftSample: left.slice(0, 10) });
