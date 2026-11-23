const TASKS = 'd120a6c2-2596-4254-968b-a1bcd3a000bf'; const o = { pages: 0, scanned: 0, qa: 0, deleted: 0 }; const seen = new Set();
for (const q of ['skip', 'page']) { for (let i = 0; i < 40; i++) { const url = q === 'skip' ? `/modules/${TASKS}/records?take=100&skip=${i * 100}` : `/modules/${TASKS}/records?page=${i + 1}&page_size=100`; const a = arr((await api('GET', url)).j?.data); const fresh = a.filter(r => !seen.has(r.id)); if (!fresh.length) break; o.pages++; for (const r of fresh) { seen.add(r.id); o.scanned++; if (/QA WF/.test(JSON.stringify(r.data || []))) { o.qa++; if ((await api('DELETE', `/modules/${TASKS}/records/${r.id}`)).s < 300) o.deleted++; } } } }
await sleep(4000);
const items = arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA WF|zz wf/.test(JSON.stringify([i.record_label])));
if (items.length) o.purge = (await api('POST', '/audit/recycle-bin/delete', { ids: items.slice(0, 50).map(i => i.id) })).s;
o.binLeftBefore = items.length; ledger('CLEANUP run2 tasks ' + JSON.stringify(o)); return o;
