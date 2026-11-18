const mine = ['cb0ea6e0-5ad9-4f60-83eb-cb469a56ac98', '2a67ad0b-e003-4241-873d-ff4c47c73a68', 'f31735f1-6a61-4a08-aff0-145e2ca0df9d', 'c68e757a-e7bc-4ce9-a4f7-067dfbdb51ce'];
const bin = await api('GET', '/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20BP&limit=100'); const it = L(bin.j?.data).filter(x => mine.includes(x.record_id));
const r = await api('POST', '/audit/recycle-bin/delete', { ids: it.map(x => x.id) }); LED('recycle bin purged ' + it.length + ' BP items (2 depts, 2 blueprints): ' + E(r));
await sleep(2000); const b2 = await api('GET', '/audit/recycle-bin/items?app_key=desk&q=QA%20RT21%20BP&limit=100');
return { purged: it.length, r: E(r), left: L(b2.j?.data).filter(x => /QA RT21 BP/.test(JSON.stringify(x))).length };
