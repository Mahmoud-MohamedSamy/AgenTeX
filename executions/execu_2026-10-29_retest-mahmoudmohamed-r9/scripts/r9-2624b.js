// NDC-2624 step 2: delete lead e647a303 → restore it from the Recycle Bin → read the timeline feed.
const L = 'e647a303-e5a7-46a0-b199-9ef1644ab3c0'; const out = {};
out.delete = (await api('o', 'DELETE', `/modules/${T.LEADS}/records/${L}`)).s; await sleep(5000);
let item = null; for (let i = 0; i < 8 && !item; i++) { const r = await api('o', 'GET', '/audit/recycle-bin/items?limit=200&app_key=crm'); item = arr(r.j?.data).find(x => x.record_id === L || JSON.stringify(x).includes(L)); if (!item) await sleep(4000); }
out.binItem = !!item;
if (item) { out.restore = (await api('o', 'POST', '/audit/recycle-bin/restore', { ids: [item.id] })).s; await sleep(8000); }
out.back = (await api('o', 'GET', `/modules/${T.LEADS}/records/${L}`)).s;
const f = arr((await api('o', 'GET', `/timeline/records/leads/${L}/feed`)).j?.data);
out.feed = f.map(e => e.entry_type + (e.payload_json ? ' ' + String(e.payload_json).replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 90) : '')).reverse();
return out;
