// NDC-2850 setup + snapshot. Removed agent = Dev Team 2 (A3). Takeover = Mahmoud Samy.
const A3 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4', SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const CF = RUN + '/scripts/d3/2850.json'; const C = (() => { try { return JSON.parse(fs.readFileSync(CF, 'utf8')); } catch (e) { return {}; } })(); const sv2 = () => fs.writeFileSync(CF, JSON.stringify(C, null, 1));
const o = {};
// snapshot
const w = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data;
C.snap = { refs: w.references, depts: w.departments.map(d => d.department_id).filter(Boolean), open: w.departments.map(d => [d.department_id, d.open_tickets, d.open_activities]) };
const teams = (await api('GET', '/desk/teams')).j.data.teams; C.snap.teams = teams.filter(t => (t.sources || []).some(s => s.ref_id === A3)).map(t => ({ id: t.id, name: t.name, dept: t.department_id, sources: t.sources }));
C.snap.teamsCount = C.snap.teams.length;
// rr pools containing A3: scan each of its departments
const pools = [];
for (const d of C.snap.depts) { const r = (await api('GET', '/desk/assignment-rules?type=round_robin&department_id=' + d)).j?.data?.rules || []; for (const x of r) if (JSON.stringify(x).includes(A3)) pools.push({ id: x.id, name: x.name, dept: d, version: x.version, targets: x.targets }); }
C.snap.pools = pools;
o.snap = { refs: C.snap.refs, ndepts: C.snap.depts.length, teams: C.snap.teams.map(t => t.name), pools: pools.map(p => p.name) };
// departments
const mkD = async (name, ids) => { const r = await api('POST', '/desk/departments', { name, description: 'QA RT19 D3 lane NDC-2850', agent_user_ids: ids }); const id = r.j?.data?.id; LED(`department "${name}" ${id} created, agents ${ids.map(x => x === A3 ? 'Dev Team 2' : x === SAMY ? 'Mahmoud Samy' : x).join(' + ')} -> ${r.s}`); return id || ('ERR ' + E(r)); };
if (!C.D) C.D = await mkD('QA RT19 D3 Dept', [SAMY, A3]);
if (!C.DB) C.DB = await mkD('QA RT19 D3 Dept B', [A3]);
sv2();
const tag = C.tag || (C.tag = 'R19D3x' + Math.random().toString(36).slice(2, 6)); sv2();
const lvl = (timing, min, rec, owner) => ({ timing, offset: timing === 'at' ? null : { value: min, unit: 'minutes' }, recipients: rec.map(id => ({ kind: 'agent', id })), template_ref: null, actions: { assign_owner: owner, assign_team: null, set_priority: null } });
const pol = async (dept, name, key, resp, res) => { const r = await api('POST', '/desk/sla/policies', { department_id: dept, name, description: null, is_active: false, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + key, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: key }], pattern: null }, response: { value: 1, unit: 'minutes' }, resolution: { value: 3, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: resp, resolution: res } }] }); const id = r.j?.data?.id; LED(`SLA policy "${name}" ${id} (inactive) -> ${r.s}`); return id || ('ERR ' + E(r)); };
if (!C.P) C.P = await pol(C.D, 'QA RT19 D3 2850 takeover ' + tag, tag, [lvl('at', null, [A3], A3)], [lvl('before', 30, [A3, SAMY], null)]);
if (!C.PB) C.PB = await pol(C.DB, 'QA RT19 D3 2850 unassigned ' + tag, tag + 'B', [lvl('at', null, [A3], null), lvl('after', 5, [A3], A3)], []);
sv2();
const show = async id => { const p = (await api('GET', '/desk/sla/policies/' + id)).j?.data; const e = p.targets[0].escalations; return { active: p.is_active, resp: e.response.map(l => ({ t: l.timing, to: l.recipients.map(x => x.id === A3 ? 'DevTeam2' : x.id === SAMY ? 'Samy' : x.id), owner: l.actions?.assign_owner === A3 ? 'DevTeam2' : l.actions?.assign_owner === SAMY ? 'Samy' : l.actions?.assign_owner, en: l.enabled ?? l.is_active })), res: e.resolution.map(l => ({ t: l.timing, to: l.recipients.map(x => x.id === A3 ? 'DevTeam2' : x.id === SAMY ? 'Samy' : x.id), owner: l.actions?.assign_owner })), lvlKeys: Object.keys(e.response[0] || {}) }; };
o.C = { D: C.D, DB: C.DB, P: C.P, PB: C.PB, tag };
o.P = await show(C.P); o.PB = await show(C.PB);
const w2 = (await api('GET', '/desk/agents/' + A3 + '/workload')).j.data; o.refsNow = w2.references; o.myDepts = w2.departments.filter(d => [C.D, C.DB].includes(d.department_id));
return o;
