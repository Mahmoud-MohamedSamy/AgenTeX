// AC — access and permissions (API side; screen side in Phase 3 ui checks).
const tag = 'AC' + uid();
const b = await mkBp(BASIC(tag)); const t = await mkT(tag); await waitIn(t);
const g = await getBp(b.id);
// AC-01 owner + Desk Admin can read / manage
const o1 = await api('GET', `/modules/${T}/blueprints?includeInactive=true`), b1 = await B('GET', `/modules/${T}/blueprints?includeInactive=true`);
R('AC-01', ok(o1) && ok(b1) ? 'PASS' : 'FAIL', `owner list ${o1.s}, Desk Administrator list ${b1.s}`);
// AC-02/03 Desk Agent reads
const reads = { list: await A('GET', `/modules/${T}/blueprints?includeInactive=true`), one: await A('GET', `/modules/${T}/blueprints/${b.id}`), versions: await A('GET', `/modules/${T}/blueprints/${b.id}/versions`), ro: await A('GET', `/modules/${T}/blueprints/read-only-agents?departmentId=${DEPT}`) };
const leak = Object.values(reads).some(r => ok(r) && JSON.stringify(r.j?.data || '').includes('QA BP R'));
R('AC-02', reads.list.s === 403 && !leak ? 'PASS' : 'FAIL', `Desk Agent list ${reads.list.s}; no blueprint data in responses: ${!leak} (menu/page text checked in Phase 3)`);
R('AC-03', Object.values(reads).every(r => r.s === 403 || r.s === 404) ? 'PASS' : 'FAIL', 'Desk Agent reads: ' + Object.entries(reads).map(([k, r]) => k + ' ' + r.s).join(', '));
// AC-04 writes
const def = g.definition;
const w = {
  create: await A('POST', `/modules/${T}/blueprints`, { definition: { ...def, name: 'QA BP R ' + tag + ' agent' }, isActive: false }),
  update: await A('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: { ...def, description: 'agent wrote' }, isActive: true, revision: g.revision }),
  sort: await A('PATCH', `/modules/${T}/blueprints/sort`, { departmentId: DEPT, ids: [b.id] }),
  draft: await A('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: def, revision: g.revision }),
  publish: await A('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: g.revision }),
  restore: await A('POST', `/modules/${T}/blueprints/${b.id}/versions/1/restore`, {}),
  include: await A('POST', `/desk/blueprints/${b.id}/include`, { ticket_ids: [t], state: 'Open' }),
  revokeAll: await A('POST', `/desk/blueprints/${b.id}/revoke`, { ticket_ids: null, after: null }),
  massInc: await A('POST', `/modules/${T}/blueprints/${b.id}/mass-include`, {}),
  massExc: await A('POST', `/modules/${T}/blueprints/${b.id}/mass-exclude`, {}),
  del: await A('DELETE', `/modules/${T}/blueprints/${b.id}`),
};
if (w.create.j?.data?.id) { MADE.bps.push(w.create.j.data.id); keep(); }
const g2 = await getBp(b.id); const stillIn = !!(await bstate(t));
const allRefused = Object.values(w).every(r => r.s === 403 || r.s === 401);
R('AC-04', allRefused && g2.revision === g.revision && stillIn ? 'PASS' : 'FAIL', Object.entries(w).map(([k, r]) => k + ' ' + r.s).join(', ') + `; revision unchanged ${g2.revision === g.revision}; ticket still inside ${stillIn}`);
// AC-05 revoke permission alone: Supervisor (C) has desk:ticket:blueprint_revoke without manage. Add C to the dept for this case only.
const dep = (await api('GET', '/desk/departments/' + DEPT)).j.data;
const addC = await api('PUT', '/desk/departments/' + DEPT, { ...dep, agent_user_ids: [...new Set([...dep.agent_user_ids, U.C])] });
await sleep(3000);
const t5 = await mkT(tag, 'ac05'); await waitIn(t5);
const c5list = await C('GET', `/modules/${T}/blueprints?includeInactive=true`);
const c5rev = await revoke1(t5, C); await sleep(1500); const out5 = !(await bstate(t5));
const dep2 = (await api('GET', '/desk/departments/' + DEPT)).j.data;
const rmC = await api('PUT', '/desk/departments/' + DEPT, { ...dep2, agent_user_ids: dep2.agent_user_ids.filter(x => x !== U.C) });
R('AC-05', c5list.s === 403 && ok(c5rev) && out5 ? 'PASS' : 'FAIL', `Supervisor (revoke only): designer list ${c5list.s}; revoke ticket ${E(c5rev)}; left blueprint ${out5}. (dept add ${addC.s} / remove ${rmC.s})`);
R('AC-06', 'BLOCKED', 'No Desk profile has "Manage blueprints" without "Revoke blueprint" (Admin has both, Supervisor only revoke, Agent/Light none); custom profiles would change shared accounts');
// AC-07 view-only member (stands in for Light Agent)
const voT = await transIds(t, VO); const voRun = await runT(t, 'go', 'Open', {}, VO); await sleep(1500);
const moved7 = st(await bstate(t)) !== 'Open';
both('AC-07', 'NDC-3065', voRun.s >= 400 && !moved7, `view-only member sees transitions [${voT.join(',')}]; run ${E(voRun)}; ticket moved ${moved7}`);
// AC-08 agent of another department, no share
const c8 = { state: await C('GET', `/modules/${T}/records/${t}/blueprint-state`), trans: await C('GET', `/modules/${T}/records/${t}/blueprint-transitions`), run: await runT(t, 'go', 'Open', {}, C) };
const leak8 = JSON.stringify([c8.state.j?.data, c8.trans.j?.data]).includes('QA BP R');
R('AC-08', [c8.state, c8.trans, c8.run].every(r => r.s === 403 || r.s === 404) && !leak8 ? 'PASS' : 'FAIL', `Supervisor of other depts: state ${c8.state.s}, transitions ${c8.trans.s}, run ${E(c8.run)}; data leak ${leak8}`);
// AC-09 other tenant (Anyware owner token, read-only calls + one write attempt on an NDC id)
try {
  const X = ANY();
  const x = { list: await X('GET', `/modules/${T}/blueprints?includeInactive=true`), one: await X('GET', `/modules/${T}/blueprints/${b.id}`), put: await X('PUT', `/modules/${T}/blueprints/${b.id}`, { definition: def, isActive: true, revision: g.revision }), state: await X('GET', `/modules/${T}/records/${t}/blueprint-state`), run: await runT(t, 'go', 'Open', {}, X) };
  const leak9 = Object.values(x).some(r => JSON.stringify(r.j?.data || '').includes('QA BP R'));
  const after9 = await getBp(b.id);
  R('AC-09', !leak9 && Object.values(x).every(r => r.s >= 400) && after9.revision === g.revision ? 'PASS' : 'FAIL', Object.entries(x).map(([k, r]) => k + ' ' + r.s).join(', ') + `; leak ${leak9}; unchanged ${after9.revision === g.revision}`);
  // headers trick: Anyware token but NDC tenant header
  const y = await X('GET', `/modules/${T}/blueprints/${b.id}`, undefined, { headers: { 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' } });
  R('API-02', y.s >= 400 && !JSON.stringify(y.j?.data || '').includes('QA BP R') ? 'PASS' : 'FAIL', `Anyware token with NDC tenant header → ${y.s}`, { partial: 'ids-from-other-tenant part in API checks' });
} catch (e) { R('AC-09', 'BLOCKED', 'Anyware sign-in failed: ' + e.message); }
// AC-10 no / bad token
const n1 = await api('GET', `/modules/${T}/blueprints`, undefined, { noAuth: true }), n2 = await api('GET', `/modules/${T}/blueprints`, undefined, { token: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.bad' }), n3 = await api('POST', `/desk/tickets/${t}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open' }, { noAuth: true });
R('AC-10', [n1, n2, n3].every(r => r.s === 401) ? 'PASS' : 'FAIL', `no token ${n1.s}, bad token ${n2.s}, run without token ${n3.s}`);
// AC-11 only Desk ticket blueprints
const all = await listBps(); const mk = [...new Set(all.map(x => x.definition?.moduleKey || x.moduleKey))];
R('AC-11', mk.every(k => k === 'desk_tickets') ? 'PASS' : 'FAIL', `${all.length} blueprints, module keys ${mk.join(',')}`);
// AC-12 enumeration
const rnd = crypto.randomUUID();
const e1 = await api('GET', `/modules/${T}/blueprints/${rnd}`), e2 = await A('GET', `/modules/${T}/blueprints/${rnd}`), e3 = await A('GET', `/modules/${T}/blueprints/${b.id}`), e4 = await runT(t, 'nope', 'Open');
R('AC-12', e1.s === 404 && e2.s === e3.s ? 'PASS' : 'FINDING', `owner random id ${e1.s}; agent random ${e2.s} vs agent real ${e3.s}; unknown transition ${E(e4)}`);
return await cleanup();
