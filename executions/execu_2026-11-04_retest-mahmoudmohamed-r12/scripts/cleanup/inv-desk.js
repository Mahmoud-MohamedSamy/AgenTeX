const __dirname_out = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-04_retest-mahmoudmohamed-r12/scripts/cleanup/desk-tickets.json';
const o = {}; const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const re = /QA RT1[12]/;
const nm = x => x.name || x.title || x.subject || x.label || '';
const pick = (L) => arr(L).filter(x => re.test(nm(x))).map(x => [x.id, nm(x), x.is_active ?? x.active ?? '']);
const tryList = async (k, p) => { const r = await api('o', 'GET', 'desk:' + p); const L = r.j?.data?.rules || r.j?.data?.items || r.j?.data?.policies || r.j?.data?.blueprints || r.j?.data?.templates || r.j?.data?.teams || r.j?.data?.departments || r.j?.data?.profiles || r.j?.data || r.j; o[k] = { s: r.s, n: arr(L).length, qa: pick(L) }; };
o.me = (await api('o', 'GET', 'desk:/iam/me')).s;
for (const t of ['direct', 'round_robin', 'skill', 'load']) await tryList('assign_' + t, `/desk/assignment-rules?type=${t}`);
await tryList('wf', '/workflow/rules?module_id=' + TK + '&per_page=200');
await tryList('wf2', '/workflow/rules?per_page=200');
await tryList('bp', `/modules/${TK}/blueprints`);
await tryList('teams', '/desk/teams');
await tryList('depts', '/desk/departments');
await tryList('skills', '/desk/skills');
await tryList('skilltypes', '/desk/skill-types');
await tryList('sla', '/desk/sla/policies');
await tryList('bh', '/iam/tenant/business-hours/profiles');
await tryList('tpl', '/desk/ticket-templates');
await tryList('tpl2', `/modules/${TK}/templates`);
// tickets by subject search
const ids = new Map();
for (const q of ['QA RT11', 'QA RT12']) for (let pg = 1; pg <= 6; pg++) { const f = JSON.stringify([{ field: 'subject', operator: 'contains', value: q }]); const r = await api('o', 'GET', `desk:/modules/${TK}/records?page=${pg}&per_page=100&filters=${encodeURIComponent(f)}`); const L = r.j?.data?.records || r.j?.data || []; o['tk_s_' + q] = r.s; for (const x of L) { const d = Object.fromEntries((x.data || []).map(y => [y.field, y.value?.value])); if (re.test(d.subject || '')) ids.set(x.id, d.subject); } if (L.length < 100) break; }
o.tickets = ids.size; o.ticketSample = [...ids.values()].slice(0, 5);
require('fs').writeFileSync(__dirname_out, JSON.stringify([...ids.entries()]));
return o;
