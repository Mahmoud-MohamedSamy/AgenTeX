// Batch 1 (API, NDC-Staging): A11, B2, B5, B6, C5/I3, C12, C18, J14, J15, H6, H8, H9, H10, I4, I9, I14, I15, J5.
try {
  // A11: Desk list only has desk ticket blueprints
  const all = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data);
  out('A11', { count: all.length, moduleKeys: [...new Set(all.map(b => b.moduleKey || b.definition?.moduleKey))] });
  // B2: in-progress count
  const b2 = await mkBp(BASIC('B2')); const t1 = await mkT('B2', 'one'), t2 = await mkT('B2', 'two'); await waitIn(t1); await waitIn(t2); await sleep(3000);
  const row = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).find(b => b.id === b2.id);
  out('B2', { listCount: row?.inProgressCount ?? row?.in_progress_count, actual: [await bstate(t1), await bstate(t2)].filter(Boolean).length });
  // B6: deactivate / activate
  const g = await getBp(b2.id); const off = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { definition: g.definition || g, isActive: false });
  const offNow = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).find(b => b.id === b2.id)?.isActive;
  const tOff = await mkT('B2', 'while inactive'); await sleep(8000); const inOff = !!(await bstate(tOff));
  const on = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { definition: g.definition || g, isActive: true });
  const onNow = L((await api('GET', `/modules/${TK}/blueprints?includeInactive=true`)).j?.data).find(b => b.id === b2.id)?.isActive;
  out('B6', { off: E(off), offNow, ticketEnteredWhileInactive: inOff, on: E(on), onNow, stillInAfterToggle: !!(await bstate(t1)) });
  // B5: no department
  const d5 = BASIC('B5'); delete d5.departmentId; const b5 = await mkBp(d5); const t5 = await mkT('B5'); await sleep(8000);
  out('B5', { create: E(b5.r), stored: (await getBp(b5.id))?.departmentId ?? (await getBp(b5.id))?.definition?.departmentId ?? null, ticketEntered: !!(await bstate(t5)) });
  // C5 / I3: layout
  const lays = L((await api('GET', `/modules/${TK}/layouts`)).j?.data); const L1 = lays[0], L2 = lays[1];
  if (L1 && L2) { const b3 = await mkBp({ ...BASIC('C5'), layoutId: L1.id }); const g3 = await getBp(b3.id);
    const ta = await mkT('C5', 'layout one', { layout_id: L1.id }); const tb = await mkT('C5', 'layout two', { layout_id: L2.id }); await sleep(8000);
    const lf = async id => (await api('GET', `/modules/${TK}/records/${id}`)).j?.data?.layoutId || (await api('GET', `/modules/${TK}/records/${id}`)).j?.data?.layout_id;
    out('C5_I3', { create: E(b3.r), storedLayout: (g3?.layoutId || g3?.definition?.layoutId) === L1.id, layoutName: g3?.layoutName || g3?.definition?.layoutName, L1: L1.name, L2: L2.name, ticketL1: { layout: await lf(ta), entered: !!(await bstate(ta)) }, ticketL2: { layout: await lf(tb), entered: !!(await bstate(tb)) } });
  } else out('C5_I3', 'only ' + lays.length + ' layout(s)');
  // C12: terminal flag stored
  out('C12', { isTerminal: ((await getBp(b2.id))?.definition?.states || (await getBp(b2.id))?.states || []).find(s => s.id === 'Closed')?.isTerminal });
  // C18 / J14: parallel steps (subTransitions)
  const sub = (id) => ({ id, name: 'QA ' + id, before: {}, during: {}, after: { actions: [] } });
  const p1 = await mkBp(DEF('C18a', [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1')] } }), TR('end', 'Escalated', 'Closed')]), false);
  const p2 = await mkBp(DEF('C18', [ST('Open'), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')] } }), TR('end', 'Escalated', 'Closed')]));
  const tp = await mkT('C18'); await waitIn(tp); const before = await trans(tp);
  const r1 = await runT(tp, 's1'); await sleep(2000); const mid = await bstate(tp); const r2 = await runT(tp, 's2'); await sleep(2000); const after = await bstate(tp);
  out('C18', { oneStep: E(p1.r), twoSteps: E(p2.r) }); out('J14', { offered: before, s1: E(r1), afterS1: mid?.activeStates, s2: E(r2), afterS2: after?.activeStates });
  // J15: continuous - second step asks for nothing and is the only transition, so it runs on its own
  const c = await mkBp(DEF('J15', [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [TR('first', 'Open', 'Escalated', { during: { checklist: [{ id: 'k', label: 'QA check', mandatory: true }] } }), TR('auto', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed', { during: { checklist: [{ id: 'k2', label: 'QA', mandatory: true }] } })], { continuous: true }));
  const tc = await mkT('J15'); await waitIn(tc); const rc = await runT(tc, 'first', 'Open', { checklist: { k: true } }); await sleep(6000);
  out('J15', { create: E(c.r), run: E(rc), stateNow: (await bstate(tc))?.activeStates, status: (await flds(tc)).status });
  // H8: read-only keys in PUT
  const g8 = await getBp(b2.id); const h8 = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { id: '00000000-0000-0000-0000-000000000000', in_progress_count: 999, createdAt: '2000-01-01T00:00:00Z', definition: g8.definition || g8, isActive: true });
  const a8 = await getBp(b2.id); out('H8', { put: E(h8), idKept: a8?.id === b2.id, created: a8?.createdAt, count: a8?.inProgressCount ?? a8?.in_progress_count });
  // H6: two writers with the same base
  const base = await getBp(b2.id); const v1 = { ...(base.definition || base), description: 'QA H6 tab one' }, v2 = { ...(base.definition || base), description: 'QA H6 tab two' };
  const w1 = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { definition: v1, isActive: true, rowVersion: base.rowVersion, row_version: base.row_version });
  const w2 = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { definition: v2, isActive: true, rowVersion: base.rowVersion, row_version: base.row_version });
  out('H6', { baseVersionField: base.rowVersion ?? base.row_version ?? base.version ?? null, first: E(w1), second: E(w2), final: (await getBp(b2.id))?.definition?.description });
  // H9 / H10: new version removes 'go' and renames Escalated's display name, ticket t1 sits at Open
  const g9 = await getBp(b2.id); const d9 = JSON.parse(JSON.stringify(g9.definition || g9));
  d9.transitions = d9.transitions.filter(t => t.id !== 'go').concat([TR('go2', 'Open', 'Escalated')]); d9.states = d9.states.map(s => s.id === 'Escalated' ? { ...s, name: 'Escalated QA renamed' } : s);
  const p9 = await api('PUT', `/modules/${TK}/blueprints/${b2.id}`, { definition: d9, isActive: true });
  out('H9_H10', { publish: E(p9), t1Transitions: await trans(t1), runOld: E(await runT(t1, 'go')), runNew: E(await runT(t1, 'go2')), statusAfter: (await flds(t1)).status, stateAfter: (await bstate(t1))?.activeStates });
  // I4: edit to match later
  const t4 = await mkT('I4X', 'no match'); await sleep(5000); const pt = await api('PATCH', `/modules/${TK}/records/${t4}`, { data: [{ field: 'subject', value: enc('QA BP B2 now matches') }] }); await sleep(8000);
  out('I4', { patch: E(pt), entered: !!(await bstate(t4)) });
  // I9: include a ticket that is in another blueprint
  out('I9', E(await api('POST', `/desk/blueprints/${c.id}/include`, { state_id: 'Open', ticket_ids: [t2] })) + ' ' + JSON.stringify((await api('POST', `/desk/blueprints/${c.id}/include`, { state_id: 'Open', ticket_ids: [t2] })).j?.data || {}).slice(0, 300));
  // I14: CRM-style mass-include route
  const tm = await mkT('I14X', 'outside'); const mi = await api('POST', `/modules/${TK}/blueprints/${p2.id}/mass-include`, { recordIds: [tm], record_ids: [tm], stateId: 'Open' }); await sleep(3000);
  const me = await api('POST', `/modules/${TK}/blueprints/${p2.id}/mass-exclude`, { recordIds: [tp], record_ids: [tp] });
  out('I14', { massInclude: E(mi), entered: !!(await bstate(tm)), massExclude: E(me), excluded: !(await bstate(tp)) });
  // I15: merge a ticket that is in a blueprint into another ticket
  const m1 = await mkT('B2', 'merge source'), m2 = await mkT('I15X', 'merge target'); await waitIn(m1);
  const mg = await api('POST', `/desk/tickets/${m2}/merge`, { source_ticket_ids: [m1], ticket_ids: [m1] }); await sleep(4000);
  out('I15', { merge: E(mg), sourceState: await bstate(m1), sourceHist: (await hist(m1)).slice(0, 5) });
  // J5: reply with send-and-close on a ticket in a blueprint
  const t5b = await mkT('B2', 'reply close', { email: GMAIL }); await waitIn(t5b);
  const rp = await api('POST', `/desk/tickets/${t5b}/replies`, { mode: 'reply', to: [GMAIL], subject: 'QA BP J5 reply', body_html: '<p>QA BP J5 reply and close</p>', close_ticket: true, status_after: 'Closed' }); await sleep(4000);
  out('J5', { reply: E(rp), status: (await flds(t5b)).status, inBlueprint: !!(await bstate(t5b)), message: rp.j?.data?.message || rp.j?.meta?.message || null });
} catch (e) { out('ERROR', String(e.stack || e).slice(0, 400)); }
out('cleanup', await cleanAll());
fs.writeFileSync('../a6/b1-out.json', JSON.stringify(R, null, 1)); log(JSON.stringify(R, null, 1));
