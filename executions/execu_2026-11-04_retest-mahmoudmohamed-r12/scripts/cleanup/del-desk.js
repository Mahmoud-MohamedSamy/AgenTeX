const fs = require('fs'); const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const A = 'b8941829-5e08-43e1-b8e0-89c33bb9903c', B = 'e95c1c91-00e6-41d1-ae35-7aef0c80db9b';
const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-04_retest-mahmoudmohamed-r12';
const res = {}; const put = (k, v) => (res[k] = res[k] || []).push(v);
const del = async (k, p, label) => { const r = await api('o', 'DELETE', 'desk:' + p); put(k, `${label} ${r.s}${r.s >= 300 && r.s !== 404 ? ' ' + (r.t || '').slice(0, 160) : ''}`); return r.s; };
// 1 blueprints (all ids from r11 + r12 ledgers)
const led = fs.readFileSync(D + '/ledger.md', 'utf8') + fs.readFileSync(D + '/../execu_2026-11-03_retest-mahmoudmohamed-r11/ledger.md', 'utf8');
const bps = [...new Set([...led.matchAll(/blueprint "(QA RT1[12][^"]*)" ([0-9a-f-]{36})/g)].map(m => m[2] + '|' + m[1]))];
for (const x of bps) { const [id, n] = x.split('|'); const g = await api('o', 'GET', `desk:/modules/${TK}/blueprints/${id}`); if (g.s === 404) { put('blueprints', n + ' already gone'); continue; }
  await api('o', 'POST', `desk:/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }); await del('blueprints', `/modules/${TK}/blueprints/${id}`, n); }
// 2 workflow rules
for (const [id, n] of [['62f78152-7033-4af8-b75f-551c219f85f6','2764 rule'],['2bb8296b-e17c-4ac0-a48d-2f87d5b786c5','WF EO2'],['3f8b0265-9431-48ad-8ff5-373dc70a9b38','WF EO5'],['edd5838d-a2f1-4df2-b1fb-32b9c4b3a9a6','WF EO3'],['ae19f6b9-0ac9-4f60-bd2f-765585ade51b','2794 team+agent'],['eab1fa40-ece3-46dc-9d98-5f50e7ff0465','2752 add skill']]) await del('workflowRules', `/workflow/rules/${id}`, n);
// 3 assignment rules, then team
for (const [id, n] of [['0c78dd01-e865-405e-a408-2332f6cbc43c','DA1'],['7274850e-5ca1-442e-9a10-cb5c2ac5dc41','DA3'],['b49224e5-e209-473b-a5ca-ee43adb635b8','DA team+move'],['417590f7-1d83-4e3f-8241-b3f3c291d8bd','RR1']]) await del('assignmentRules', `/desk/assignment-rules/${id}`, n);
await del('team', '/desk/teams/02586334-de4a-4428-b8df-22183ff9e244', 'QA RT12 2275 team');
// 4 tickets
const tks = JSON.parse(fs.readFileSync(D + '/scripts/cleanup/desk-tickets.json', 'utf8')); let ok = 0; const bad = [];
for (const [id, s] of tks) { const r = await api('o', 'DELETE', `desk:/modules/${TK}/records/${id}`); if (r.s < 300 || r.s === 404) ok++; else bad.push(s + ' ' + r.s + ' ' + (r.t || '').slice(0, 120)); }
res.tickets = { total: tks.length, deleted: ok, failed: bad };
// 5 SLA, business hours, templates
await del('sla', '/desk/sla/policies/eee9e74e-5e8d-45de-b414-e4f0e87be9ba', 'QA RT11 BH SLA'); await del('sla', '/desk/sla/policies/91b24877-8120-48f4-8b7f-c3bbaffa0df0', 'QA RT12 2774 SLA');
await del('businessHours', '/iam/tenant/business-hours/profiles/a8de8ae6-dff1-4e78-89c1-85dbf6492066', 'QA RT12 2799 BH');
await del('templates', '/desk/ticket-templates/34bfb232-03e8-43d9-9e17-b9070326cb5b', '2803 ADM template'); await del('templates', '/desk/ticket-templates/7de810ee-ebeb-47b5-912f-c577a5f6a1eb', '2803 wrong');
// 6 skills + type, prefs
for (const [id, n] of [['31c19ae1-2a31-462b-8fb3-68fd6d26a981','sk1'],['921d2517-0d33-459d-97f2-2f760a7c7d3d','sk2'],['21e9c438-87ed-49cd-a526-0a0db8f25d1a','sk3']]) await del('skills', `/desk/skills/${id}`, n);
await del('skillType', '/desk/skill-types/d35923cc-dec0-4dd8-b739-5e28ba563c83', 'QA RT12 2752 type');
put('prefs', 'skill ' + (await api('o', 'PUT', `desk:/desk/skill-preferences?department_id=${A}`, { auto_add: false, placement: 'bottom' })).s);
put('prefs', 'rr ' + (await api('o', 'PUT', `desk:/desk/departments/${A}/round-robin-preferences`, { assign_to_offline_agents: false, department_threshold_enabled: false, department_threshold: 40, agent_threshold_enabled: false, agent_thresholds: [], assign_backlogs: false, backlog_limit: 10, backlog_order: 'created_time', assign_on_closure: false, incoming_mode: 'immediate' })).s);
// 7 ADM layout restore
const ADM = 'd1e6505d-ad05-45d0-bd8a-8f3f1eca96cb'; const L = (await api('o', 'GET', `desk:/modules/${TK}/layouts/${ADM}`)).j?.data;
const p = await api('o', 'PUT', `desk:/modules/${TK}/layouts/${ADM}`, { ...L, departmentIds: [], defaultDepartmentIds: [] }); const L2 = (await api('o', 'GET', `desk:/modules/${TK}/layouts/${ADM}`)).j?.data;
res.admLayout = `${p.s} now dept=${JSON.stringify(L2?.departmentIds)} default=${JSON.stringify(L2?.defaultDepartmentIds)}`;
// 8 departments: agents [] then delete
for (const [id, n] of [[A, 'QA RT11 Dept A'], [B, 'QA RT11 Dept B']]) { const d = (await api('o', 'GET', `desk:/desk/departments/${id}`)).j?.data; put('departments', n + ' tickets=' + d?.ticket_count + ' agents=' + (d?.agent_user_ids || []).length);
  const s = await del('departments', `/desk/departments/${id}`, n); if (s >= 300 && s !== 404) { const u = await api('o', 'PATCH', `desk:/desk/departments/${id}`, { agent_user_ids: [] }); put('departments', n + ' agents→[] ' + u.s + ' ' + (u.t || '').slice(0, 120)); } }
fs.writeFileSync(D + '/scripts/cleanup/desk-result.json', JSON.stringify(res, null, 1));
return res;
