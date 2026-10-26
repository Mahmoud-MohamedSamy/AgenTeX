const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', ID = 'c2989364-a234-49a7-a14b-8a29cc1aa5ad';
const out = {}; out.del = (await api('DELETE', `/modules/${L}/records/${ID}`)).s;
await sleep(2000); const bin = arr((await api('GET', '/audit/recycle-bin/items?app_key=crm&limit=200')).j?.data).find(x => x.record_id === ID || /1337 u2 plain/.test(x.record_label || ''));
out.bin = bin && (bin.id + ' ' + bin.record_label);
if (bin) { const r = await api('POST', '/audit/recycle-bin/restore', { ids: [bin.id] }); out.restore = r.s + ' ' + r.t.slice(0, 150); }
await sleep(3000); await page.reload({ waitUntil: 'commit' }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/Updated|ago|just now/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const t = await txt(); out.rawInFeed = (t.match(/audit\.[a-z_.]+/g) || []).slice(0, 10); out.lines = t.split('\n').filter(l => /QA RT 1337|restored|deleted a/i.test(l)).slice(0, 8);
await shot('1344-03-feed-restore');
return done(out);
