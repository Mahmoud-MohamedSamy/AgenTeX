const o = {}; const bad = [];
if (ST.N.a4) o.k7cancel = E(await api.A('POST', `/desk/tickets/${ST.N.t1}/approvals/${ST.N.a4}/cancel`, {}));
const left = ((await inbox('O', { list: 'all_pending', q: 'QA PA', page_size: 100 })).d?.approvals || []); o.pendingLeft = left.length;
const tids = new Set([ST.N.t1, ST.N.t3, ST.tickets['QA PA bpN 1']].filter(Boolean));
for (let p = 1; p <= 3; p++) { const r = await api.O('GET', `/modules/${T}/records?search=${encodeURIComponent('QA PA')}&page_size=100&page=${p}`); const a = arr(r.j?.data); for (const x of a) if (/QA PA/.test(JSON.stringify(x.data || x))) tids.add(x.id); if (a.length < 100) break; }
let td = 0; for (const id of tids) { const r = await api.O('DELETE', `/modules/${T}/records/${id}`); if (r.s < 300 || r.s === 404) td++; else bad.push(E(r)); } o.tickets = td + '/' + tids.size;
if (ST.N.bp) { const g = (await api.O('GET', `/modules/${T}/blueprints/${ST.N.bp}`)).j?.data; if (g) await api.O('PUT', `/modules/${T}/blueprints/${ST.N.bp}`, { definition: g.definition, isActive: false, revision: g.revision }); o.bp = (await api.O('DELETE', `/modules/${T}/blueprints/${ST.N.bp}`)).s; }
if (ST.N.form) { await api.O('POST', `/web-forms/${ST.N.form}/disable`); o.form = (await api.O('DELETE', '/web-forms/' + ST.N.form)).s; }
await sleep(8000); let pg = 0;
for (let k = 0; k < 6; k++) { const it = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA/.test(JSON.stringify([i.record_label, i.name, i.title]))); if (!it.length) break; const d = await api.O('POST', '/audit/recycle-bin/delete', { ids: it.map(i => i.id) }); if (d.s < 300) pg += it.length; await sleep(3000); }
o.purged = pg;
o.binLeft = arr((await api.O('GET', '/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=workflow&limit=200')).j?.data).filter(i => /QA PA/.test(JSON.stringify([i.record_label, i.name, i.title]))).length;
o.formsLeft = arr((await api.O('GET', '/web-forms?app_key=desk')).j?.data?.forms || (await api.O('GET', '/web-forms?app_key=desk')).j?.data).filter(f => /^QA PA/.test(f.name)).length;
o.pendingAfter = ((await inbox('O', { list: 'all_pending', q: 'QA PA', page_size: 100 })).d?.approvals || []).length;
o.supervisorPerm = (await api.O('GET', '/iam/profiles/44444444-4444-4444-4444-444444444404/permissions')).t.includes('desk:approvals:view_department');
const tech = (await inbox('O', { list: 'all_pending', source: 'web_form', page_size: 100 })).d?.approvals || []; o.protected = ST.PROTECTED.map(id => tech.find(x => x.id === id)?.status || 'missing');
o.errors = bad; ledger('CLEANUP not-run cases ' + JSON.stringify(o)); return o;
