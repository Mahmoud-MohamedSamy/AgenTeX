// RN — running transitions on tickets (API side; Steps card / form texts in Phase 3).
const sub = id => ({ id, name: 'QA ' + id, before: {}, during: {}, after: { actions: [] } });
// RN-02 flow for agents (NDC-3056): agent can read every state + transition + what each asks for
{ const g = 'RN2' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated', { before: { visibilityCriteria: { op: 'eq', field: 'priority', value: 'high' } }, during: { checklist: [{ id: 'k', label: 'QA check', mandatory: true }] } }), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); const s = await bstate(t, A);
  const allT = JS(s?.allTransitions || '');
  both('RN-02', 'NDC-3056', (s?.allStates || []).length === 4 && allT.includes('"go"') && allT.includes('QA check') && /priority/.test(allT), `Agent A reads ${(s?.allStates || []).length} states, ${(s?.allTransitions || []).length} transitions; conditions included ${/priority/.test(allT)}; items included ${allT.includes('QA check')}`); }
// RN-03/04/05/06/07/08/10
const g = 'RN' + uid();
await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed'), TR('back', 'On Hold', 'Open', { during: { checklist: [{ id: 'k', label: 'QA', mandatory: true }] } })]));
{ const t = await mkT(g, 'run'); await waitIn(t); const r = await runT(t, 'go', 'Open', {}, A); await sleep(2000);
  const h = await histTxt(t); R('RN-03', ok(r) && r.j?.data?.to_state === 'Escalated' && /blueprint_transition/.test(h) && await statusOf(t) === 'Escalated' ? 'PASS' : 'FAIL', `run → ${E(r)} ${JS(r.j?.data || {}).slice(0, 90)}; status ${await statusOf(t)}; history has transition line ${/blueprint_transition/.test(h)}`); }
{ const t = await mkT(g, 'req'); await waitIn(t); await runT(t, 'hold'); await sleep(1500); const r0 = await runT(t, 'back', 'On Hold'); const r1 = await runT(t, 'back', 'On Hold', { checklist: { k: true } });
  R('RN-04', r0.s === 422 && ok(r1) ? 'PASS' : 'FAIL', `required item empty → ${E(r0)}; filled → ${E(r1)}`); }
{ const t = await mkT(g, 'lock'); await waitIn(t);
  const p = await setF(t, { status: 'Closed' }), p2 = await api('PATCH', `/desk/tickets/${t}`, { status: 'Closed' }), cl = await api('POST', `/desk/tickets/${t}/close`, {});
  await sleep(1500); const s = await statusOf(t);
  R('RN-05', p.s >= 400 && p2.s >= 400 && s === 'Open' ? 'PASS' : 'FAIL', `record PATCH status → ${E(p)}; desk PATCH → ${E(p2)}; status still ${s} (inline / bulk in Phase 3)`);
  both('RN-06', 'NDC-2757', cl.s >= 400 && s === 'Open', `Close ticket on a ticket in a blueprint → ${E(cl)}; status ${s} (reply "send and close" + hidden button in Phase 3)`); }
{ const t = await mkT(g, 'stale'); await waitIn(t); const ra = await runT(t, 'go', 'Open', {}, A); const rb = await runT(t, 'hold', 'Open', {}, B);
  R('RN-07', ok(ra) && rb.s === 409 && code(rb) === 'BLUEPRINT_STATE_CHANGED' ? 'PASS' : 'FAIL', `A runs → ${E(ra)}; B runs from the old state → ${E(rb)}`); }
{ const t = await mkT(g, 'double'); await waitIn(t); const [x, y] = await Promise.all([runT(t, 'go'), runT(t, 'go')]); await sleep(2000);
  const moves = (await hist(t)).filter(h => h.action === 'ticket.blueprint_transition').length;
  R('RN-08', [x, y].filter(ok).length === 1 && moves === 1 ? 'PASS' : 'FAIL', `two runs at once → ${x.s}/${y.s}; transition lines in history ${moves}`); }
{ const t = await mkT(g, 'retry'); await waitIn(t); const id = crypto.randomUUID();
  const body = { run_id: id, expected_state_id: 'Open', fields: {} };
  const a = await api('POST', `/desk/tickets/${t}/blueprint-transitions/go`, body); const b = await api('POST', `/desk/tickets/${t}/blueprint-transitions/go`, body); await sleep(1500);
  const moves = (await hist(t)).filter(h => h.action === 'ticket.blueprint_transition').length;
  R('RN-10', ok(a) && ok(b) && moves === 1 ? 'PASS' : 'FAIL', `same run sent twice (retry after a lost answer) → ${a.s}/${b.s}; transition lines ${moves}; same result ${a.j?.data?.run_id === b.j?.data?.run_id}`); }
R('RN-09', 'INCONCLUSIVE', 'Could not force a half-saved run through the API (every item is now checked before the move); message text checked in Phase 3 only if it can be provoked');
// RN-12 transition drafts
{ const gd = 'RN12' + uid(); await mkBp(DEF(gd, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }] } }), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(gd); await waitIn(t);
  const sv = await api('PUT', `/desk/tickets/${t}/blueprint-transitions/go/draft`, { expected_state_id: 'Open', comment: { content: 'QA BP R half typed' } });
  const l1 = (await api('GET', `/desk/tickets/${t}/blueprint-transitions/drafts`)).j?.data;
  const lA = (await api('GET', `/desk/tickets/${t}/blueprint-transitions/drafts`, undefined)).j?.data;
  const otherUser = (await A('GET', `/desk/tickets/${t}/blueprint-transitions/drafts`)).j?.data;
  await runT(t, 'hold'); await sleep(2000);
  const l2 = (await api('GET', `/desk/tickets/${t}/blueprint-transitions/drafts`)).j?.data;
  const stale = await api('PUT', `/desk/tickets/${t}/blueprint-transitions/go/draft`, { expected_state_id: 'Open', comment: { content: 'x' } });
  R('RN-12', ok(sv) && JS(l1).includes('half typed') && !JS(otherUser || '').includes('half typed') && JS(l2?.discarded || '').includes('go') && stale.s === 409 ? 'PASS' : 'FAIL', `save draft → ${E(sv)}; listed for me ${JS(l1).includes('half typed')}; visible to Agent A ${JS(otherUser || '').includes('half typed')}; after the ticket moved: discarded ${JS(l2?.discarded || l2).slice(0, 80)}; saving on the old state → ${E(stale)}`); }
// RN-13 common transition
{ const gc = 'RN13' + uid(); await mkBp(DEF(gc, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed'), { ...TR('cancel', null, 'Closed'), isCommon: true, fromStateId: null }]));
  const t = await mkT(gc); await waitIn(t); await runT(t, 'go'); await sleep(1500); const offered = await transIds(t); const r = await runT(t, 'cancel', 'Escalated'); await sleep(2000);
  R('RN-13', offered.includes('cancel') && ok(r) && !(await bstate(t)) && await statusOf(t) === 'Closed' ? 'PASS' : 'FAIL', `in Escalated offered [${offered}]; run Cancel → ${E(r)}; status ${await statusOf(t)}; left blueprint ${!(await bstate(t))}`); }
// RN-14 parallel steps
{ const gp = 'RN14' + uid(); await mkBp(DEF(gp, S3(), [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')] } }), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(gp); await waitIn(t); const off = await transIds(t); const r1 = await runT(t, 's1'); await sleep(2000); const mid = st(await bstate(t)); const off2 = await transIds(t);
  const r2 = await runT(t, 's2'); await sleep(2000); const end = st(await bstate(t));
  R('RN-14', ok(r1) && mid === 'Open' && ok(r2) && end === 'Escalated' ? 'PASS' : 'FAIL', `offered [${off}]; s1 → ${E(r1)}, state ${mid}, still offered [${off2}]; s2 → ${E(r2)}, state ${end}`); }
// RN-15 continuous (NDC-3031)
{ const gc = 'RN15' + uid(); await mkBp(DEF(gc, [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [TR('first', 'Open', 'Escalated', { during: { checklist: [{ id: 'k', label: 'QA', mandatory: true }] } }), TR('auto', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed', { during: { checklist: [{ id: 'k2', label: 'QA', mandatory: true }] } })], { continuous: true }));
  const t = await mkT(gc); await waitIn(t); const r = await runT(t, 'first', 'Open', { checklist: { k: true } }); const s = await waitState(t, 'On Hold', 30);
  both('RN-15', 'NDC-3031', st(s) === 'On Hold', `continuous: after "first" the no-item step ran by itself → state ${st(s)} (run ${E(r)})`); }
// RN-17 share limit: ticket already shared with 10 departments, owner from an 11th
{ const deps = L((await api('GET', '/desk/departments')).j?.data).filter(d => d.id !== DEPT && d.id !== TECH && d.is_active !== false).slice(0, 10);
  const gs = 'RN17' + uid(); await mkBp(DEF(gs, [...S3(), ST('On Hold')], [TR('hold', 'Open', 'On Hold'), TR('go', 'On Hold', 'Escalated', { before: { departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] } }), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(gs); await waitIn(t);
  const put = await api('PUT', `/desk/tickets/${t}/shares`, { shares: deps.map(d => ({ department_id: d.id, access: 'read_only' })) });
  const n = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).length;
  await runT(t, 'hold'); await sleep(5000);
  const h = await histTxt(t); const skipped = /share_skipped|10 shared/i.test(h);
  R('RN-17', n === 10 && skipped ? 'PASS' : (n === 10 ? 'FAIL' : 'INCONCLUSIVE'), `shared with ${n} departments first (${put.s}); entering the state with a Tech owner → history "share skipped" ${skipped}; Tech shared ${JS(L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).length)}`);
  await api('PUT', `/desk/tickets/${t}/shares`, { shares: [] }); }
return await cleanup();
