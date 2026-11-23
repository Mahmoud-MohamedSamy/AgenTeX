const TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf', CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4'; const o = {};
for (const [k, m] of Object.entries({ tasks: TASKS, contacts: CM })) { const a = arr((await api('GET', `/modules/${m}/records?take=200`)).j?.data); const q = a.filter(r => /QA WF/.test(JSON.stringify(r.data || []))); let d = 0; for (const r of q) if ((await api('DELETE', `/modules/${m}/records/${r.id}`)).s < 300) d++; o[k] = { scanned: a.length, qa: q.length, deleted: d }; }
await sleep(5000);
let purged = 0; for (let p = 0; p < 10; p++) { const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label]))); if (!items.length) break; const d = await api('POST', '/audit/recycle-bin/delete', { ids: items.slice(0, 50).map(i => i.id) }); if (d.s < 300) purged += Math.min(50, items.length); else break; await sleep(2000); }
o.binPurged = purged; ledger('CLEANUP run2 tasks/contacts ' + JSON.stringify(o));
return o;
