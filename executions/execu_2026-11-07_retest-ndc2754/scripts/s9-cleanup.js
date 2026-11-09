const fs = require('fs'); const RUN = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-07_retest-ndc2754/';
const D = JSON.parse(fs.readFileSync(RUN + 'data.json', 'utf8')); const TK = X.TK; const o = {}; const re = /^QA RT13 2754/;
await api('o', 'POST', `desk:/desk/blueprints/${D.bpId}/revoke`, { ticket_ids: null, after: null }); o.bp = (await api('o', 'DELETE', `desk:/modules/${TK}/blueprints/${D.bpId}`)).s;
const ids = new Map(); const f = JSON.stringify([{ field: 'subject', operator: 'contains', value: 'QA RT13 2754' }]);
for (let p = 1; p <= 3; p++) { const L = (await api('o', 'GET', `desk:/modules/${TK}/records?page=${p}&per_page=100&filters=${encodeURIComponent(f)}`)).j?.data?.records || []; for (const x of L) { const s = (x.data || []).find(y => y.field === 'subject')?.value?.value || ''; if (re.test(s)) ids.set(x.id, s); } if (L.length < 100) break; }
let ok = 0; const bad = []; for (const [id, s] of ids) { const r = await api('o', 'DELETE', `desk:/modules/${TK}/records/${id}`); r.s < 300 ? ok++ : bad.push(s + ' ' + r.s); } o.tickets = { found: ids.size, deleted: ok, bad };
const purge = async () => { const bin = arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => re.test(x.record_label || '')); for (let i = 0; i < bin.length; i += 25) await api('o', 'POST', 'desk:/audit/recycle-bin/delete', { ids: bin.slice(i, i + 25).map(x => x.id) }); return bin.length; };
o.purge1 = await purge(); await sleep(4000);
o.team = (await api('o', 'DELETE', `desk:/desk/teams/${D.teamId}`)).s;
for (const [k, id] of [['A', X.ids.DEPT_A], ['B', X.ids.DEPT_B]]) { const d = (await api('o', 'GET', `desk:/desk/departments/${id}`)).j?.data;
  if ((d?.agent_user_ids || []).length) await api('o', 'PATCH', `desk:/desk/departments/${id}`, { name: d.name, description: d.description, visibility: d.visibility, routing_strategy: d.routing_strategy, is_active: d.is_active, agent_user_ids: [] });
  const r = await api('o', 'DELETE', `desk:/desk/departments/${id}`); o['dept' + k] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); }
o.purge2 = await purge();
// verify
o.left = { tickets: ((await api('o', 'GET', `desk:/modules/${TK}/records?page=1&per_page=100&filters=${encodeURIComponent(f)}`)).j?.data?.records || []).length,
  bp: (await api('o', 'GET', `desk:/modules/${TK}/blueprints/${D.bpId}`)).s, team: arr((await api('o', 'GET', 'desk:/desk/teams')).j?.data?.teams || (await api('o', 'GET', 'desk:/desk/teams')).j?.data).filter(x => re.test(x.name)).length,
  depts: arr((await api('o', 'GET', 'desk:/desk/departments')).j?.data?.departments || (await api('o', 'GET', 'desk:/desk/departments')).j?.data).filter(x => re.test(x.name)).length,
  bin: arr((await api('o', 'GET', 'desk:/audit/recycle-bin/items?app_key=desk&limit=200')).j?.data).filter(x => re.test(x.record_label || '')).length };
return o;
