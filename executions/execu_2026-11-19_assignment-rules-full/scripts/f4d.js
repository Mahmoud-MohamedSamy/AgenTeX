const st = {}; let tp = 1, n = 0;
for (let i = 1; i <= tp && i <= 80; i++) { const r = await api('GET', '/modules/' + T + '/records?page_size=100&page=' + i); tp = r.j?.meta?.total_pages || tp; for (const x of arr(r.j?.data ?? r.j)) { const f = fl(x); n++; if (f.department === IDS.DA && (f.owner === IDS.A1 || (f.owner && f.owner.id === IDS.A1))) { st[f.status] = (st[f.status] || 0) + 1; } } }
const ss = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []; const type = {}; for (const s of ss) type[s.value] = s.type;
const byType = {}; for (const [k, v] of Object.entries(st)) byType[type[k] || '?'] = (byType[type[k] || '?'] || 0) + v;
return { scanned: n, pages: tp, byStatus: st, byType, workload: await wlo(IDS.A1, IDS.DA) };
