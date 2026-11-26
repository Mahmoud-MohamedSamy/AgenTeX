const o = {}; const bad = [];
let r = 0; for (const id of ST.WF || []) { const d = await api.O('DELETE', '/workflow/rules/' + id); if (d.s < 300 || d.s === 404) r++; else bad.push('rule ' + d.s); }
for (const x of arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=200&skip=0`)).j?.data).concat(arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=200&skip=200`)).j?.data)).filter(x => /^QA RT27/.test(x.name))) { const d = await api.O('DELETE', '/workflow/rules/' + x.id); if (d.s < 300) r++; }
o.rules = r;
let t = 0; for (const id of [...(ST.T3230 || []), ...(ST.TSLA || [])]) { const d = await api.O('DELETE', `/modules/${T}/records/${id}`); if (d.s < 300 || d.s === 404) t++; else bad.push('ticket ' + d.s); } o.tickets = t;
o.sla = ST.SLA ? (await api.O('DELETE', '/desk/sla/policies/' + ST.SLA)).s : 'none';
o.sandbox = ST.SB ? E(await api.O('DELETE', '/desk/data/sandboxes/' + ST.SB)) : 'none';
o.backup = ST.BK ? E(await api.O('DELETE', '/desk/data/backups/' + ST.BK)) : 'none';
await sleep(10000); let pg = 0;
for (let k = 0; k < 15; k++) { const it = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA RT27|RT27 3230/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; for (let j = 0; j < it.length; j += 50) { const d = await api.O('POST', '/audit/recycle-bin/delete', { ids: it.slice(j, j + 50).map(i => i.id) }); if (d.s < 300) pg += Math.min(50, it.length - j); } await sleep(3000); }
o.purged = pg;
const all = []; for (let skip = 0; skip < 1000; skip += 100) { const a = arr((await api.O('GET', `/workflow/rules?moduleId=${T}&take=100&skip=${skip}`)).j?.data); all.push(...a); if (a.length < 100) break; }
o.left = { qaRules: all.filter(x => /^QA RT27/.test(x.name)).length, totalRules: all.length, sla: arr((await api.O('GET', '/desk/sla/policies')).j?.data).filter(p => /QA RT27/.test(p.name)).length,
  sandboxes: arr((await api.O('GET', '/desk/data/sandboxes')).j?.data).length, backups: arr((await api.O('GET', '/desk/data/backups')).j?.data).map(b => b.id.slice(0, 8) + ' ' + b.status),
  bin: arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA RT27/.test(JSON.stringify([i.record_label, i.name, i.title]))).length };
o.errors = bad.slice(0, 10); ledger('CLEANUP r27 ' + JSON.stringify(o)); return o;
