// Rechecks NDC-2780 (name rules), NDC-2782 (department move), NDC-2775 (status in use removed). Cleans up.
const TK = 'e8e5e302-3873-4e32-b945-c9cd25c7659d', QD = '9a7e391c-be72-49e4-a1cf-763e5c88e23d', TECH = '258a87d2-5b80-458c-8aa2-bfa7657f7eee';
const st = (id, x = {}) => ({ id, name: id, position: { x: 0, y: 0 }, slaClock: 'calendar', ...x });
const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
const def = (name, key, states, trs) => ({ name, description: 'QA', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QD, entryCriteria: { op: 'contains', field: 'subject', value: key }, states, transitions: trs });
const R = {}; const made = { bps: [], tickets: [] }; const save = () => fs.writeFileSync('../a6/bugs1-made.json', JSON.stringify(made));
const mkBp = async (d, act = true) => { const r = await api('POST', `/modules/${TK}/blueprints`, { definition: d, isActive: act }); if (r.j?.data?.id) { made.bps.push(r.j.data.id); save(); } return r; };
const enc = v => ({ kind: 'string', value: v });
const mkT = async (subj, dept = QD) => { const r = await api('POST', `/modules/${TK}/records`, { data: [['subject', subj], ['status', 'Open'], ['department', dept]].map(([f, v]) => ({ field: f, value: enc(v) })) }); if (r.j?.data?.id) { made.tickets.push(r.j.data.id); save(); } return r.j?.data?.id; };
const state = async id => { for (let i = 0; i < 10; i++) { const s = arr((await api('GET', `/modules/${TK}/records/${id}/blueprint-state`)).j?.data?.states)[0]; if (s) return s; await sleep(2000); } return null; };
const val = v => v && (v.value ?? v.items);
const fields = async id => Object.fromEntries(((await api('GET', `/modules/${TK}/records/${id}`)).j?.data?.data || []).map(x => [x.field, val(x.value)]));
const S2 = [st('Open'), st('Escalated'), st('Closed', { isTerminal: true })], T2 = [tr('go', 'Open', 'Escalated'), tr('end', 'Escalated', 'Closed')];
// NDC-2780
R.n2780 = {};
for (const [k, n] of [['special', 'QA BP A6 name <b>x</b> @#$%'], ['len61', 'QA BP A6 ' + 'x'.repeat(52)], ['len60', 'QA BP A6 ' + 'y'.repeat(51)]]) { const r = await mkBp(def(n, 'QA BP A6N ', S2, T2), false); R.n2780[k] = r.s + ' len=' + n.length + (r.s >= 300 ? ' ' + (r.j?.error?.message || '').slice(0, 120) + ' ' + JSON.stringify(r.j?.error?.details || '').slice(0, 120) : ''); }
// NDC-2782
const b2 = await mkBp(def('QA BP A6 move', 'QA BP A6M ', S2, T2)); R.n2782 = { bp: b2.s };
const tm = await mkT('QA BP A6M move ticket'); const s0 = await state(tm); R.n2782.entered = !!s0;
const run = await api('POST', `/desk/tickets/${tm}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} }); R.n2782.ran = run.s;
R.n2782.before = (await fields(tm)).status;
const mv = await api('POST', `/desk/tickets/${tm}/move`, { department_id: TECH, owner_id: null, team_id: null }); R.n2782.move = mv.s + (mv.s >= 300 ? ' ' + mv.t.slice(0, 160) : '');
await sleep(4000); const f2 = await fields(tm); R.n2782.after = { status: f2.status, inBlueprint: !!arr((await api('GET', `/modules/${TK}/records/${tm}/blueprint-state`)).j?.data?.states)[0] };
log(JSON.stringify(R, null, 1));
