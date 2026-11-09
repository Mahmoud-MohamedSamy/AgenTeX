const TK = X.TK; const A = X.ids.DEPT_A; const o = {}; const re = /^QA RT13 2754/;
const f = JSON.stringify([{ field: 'department', operator: 'equals', value: A }]); const L = arr((await api("o", "GET", `desk:/modules/${TK}/records?page=1&per_page=100&filters=${encodeURIComponent(f)}`)).j?.data);
const rows = L.map(x => [x.id, (x.data || []).find(y => y.field === 'subject')?.value?.value || '']); o.found = rows.length; o.notQA = rows.filter(r => !re.test(r[1])).map(r => r[1]);
let ok = 0; for (const [id, s] of rows.filter(r => re.test(r[1]))) { const r = await api('o', 'DELETE', `desk:/modules/${TK}/records/${id}`); if (r.s < 300) ok++; } o.deleted = ok;
const purge = async () => { const bin = arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => re.test(x.record_label || '')); for (let i = 0; i < bin.length; i += 25) await api('o', 'POST', 'desk:/audit/recycle-bin/delete', { ids: bin.slice(i, i + 25).map(x => x.id) }); return bin.length; };
o.purge1 = await purge(); await sleep(4000);
if (!o.notQA.length) { const d = (await api('o', 'GET', `desk:/desk/departments/${A}`)).j?.data; if ((d?.agent_user_ids || []).length) await api('o', 'PATCH', `desk:/desk/departments/${A}`, { name: d.name, description: d.description, visibility: d.visibility, routing_strategy: d.routing_strategy, is_active: d.is_active, agent_user_ids: [] }); const r = await api('o', 'DELETE', `desk:/desk/departments/${A}`); o.deptA = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); }
o.purge2 = await purge();
o.left = { deptA: (await api('o', 'GET', `desk:/desk/departments/${A}`)).s, bin: arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => re.test(x.record_label || '')).map(x => x.module_label + ':' + x.record_label) };
return o;
