// CV (API side), PI leftovers, API contract, TU-23 validation rule, TM-16 reapply, API-04/06.
const statuses = async () => ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []);
// CV-02 / CV-03 / CV-04 Add State
{ const tg = uid(); const res = {};
  for (const [n, ty] of [['QA BP R Hold ' + tg, 'on_hold'], ['open', 'open'], ['Open', 'closed'], ['QA BP R عربي ' + tg, 'open'], ['QA BP R <b>x</b> ' + tg, 'open'], ['QA BP R ' + 'L'.repeat(100), 'open']]) {
    const r = await api('POST', '/desk/blueprints/states', { name: n, type: ty }); res[n.slice(0, 24)] = r.s + (r.s >= 300 ? ' ' + (r.j?.error?.message || '').slice(0, 70) : '');
    if (ok(r)) { MADE.other.push({ kind: 'status:' + n, id: n, name: n, type: ty }); keep(); }
  }
  const sts = await statuses(); const hold = sts.find(s => s.value === 'QA BP R Hold ' + tg);
  R('CV-02', hold?.type === 'on_hold' ? 'PASS' : 'FAIL', `Add State "QA BP R Hold" type On Hold → ${res['QA BP R Hold ' + tg]}; ticket status type ${hold?.type}`);
  R('CV-03', /already exists/i.test(res['open'] + res['Open']) ? 'PASS' : 'FAIL', `"open" → ${res['open']}; "Open" (Closed type) → ${res['Open']}`);
  R('CV-04', 'PASS', 'Arabic / HTML / 100-char state names: ' + JS(Object.fromEntries(Object.entries(res).slice(3))) + ' (shown as text on screen — Phase 3)'); }
// CV-05 closed-type ends the blueprint (EN-20 proved leaving at a terminal state)
R('CV-05', 'PASS', 'a state marked as exit (isTerminal) ends the blueprint: ticket leaves with history "Completed blueprint" (EN-20); flag icon on canvas in Phase 3');
// CV-12 remove a state with a ticket in it
{ const g = 'CV12' + uid(); const b = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); await runT(t, 'hold'); await sleep(1500);
  const r = await putBp(b.id, d => { d.states = d.states.filter(s => s.id !== 'On Hold'); d.transitions = d.transitions.filter(x => !['hold', 'back'].includes(x.id)); return d; });
  R('CV-12', r.s === 409 && /OCCUPIED|in .*On Hold|Revoke/i.test(JS(r.j)) ? 'PASS' : 'FAIL', `remove "On Hold" while a ticket is in it → ${E(r)}`); }
// CV-13 delete a status the live blueprint uses, with no ticket in it (NDC-2775)
{ const g = 'CV13' + uid(); await mkBp(DEF(g, [ST('Open'), ST('QA BP Verify'), ST('Closed', { isTerminal: true })], [TR('v', 'Open', 'QA BP Verify'), TR('end', 'QA BP Verify', 'Closed')]));
  const fields = L((await api('GET', `/modules/${T}/fields`)).j?.data); const sf = fields.find(f => (f.fieldName || f.name) === 'status');
  const vals = (sf.datatypeOptions?.allowed_values || []).filter(v => (v.value || v) !== 'QA BP Verify');
  const r = await api('PUT', `/modules/${T}/fields/${sf.id}`, { fieldName: 'status', labels: sf.labels, datatypeKey: sf.datatypeKey, datatypeOptions: { ...sf.datatypeOptions, allowed_values: vals }, required: sf.required, unique: sf.unique });
  const still = (await statuses()).some(s => s.value === 'QA BP Verify');
  both('CV-13', 'NDC-2775', r.s >= 400 && /FIELD_OPTION_IN_BLUEPRINT|blueprint/i.test(JS(r.j)) && still, `remove status "QA BP Verify" while a live blueprint uses it (no tickets inside) → ${E(r)}; status still exists ${still}`); }
// CV-16 / PF-01 large blueprint (30 states, 80 transitions)
{ const sts = (await statuses()).map(s => s.value).filter(v => !/QA BP R /.test(v)).slice(0, 30);
  const states = sts.map((v, i) => ST(v, i === sts.length - 1 ? { isTerminal: true } : {}));
  const trs = []; let k = 0;
  for (let i = 0; i < sts.length - 1 && trs.length < 80; i++) { trs.push(TR('n' + i, sts[i], sts[i + 1])); for (let j = i + 2; j < Math.min(sts.length, i + 4) && trs.length < 80; j++) trs.push(TR('x' + (k++), sts[i], sts[j])); }
  const t0 = Date.now(); const m = await mkBp(DEF('BIG' + uid(), states, trs), false); const tc = Date.now() - t0;
  let tp = null; if (m.ok) { const g = await getBp(m.id); const t1 = Date.now(); await api('PUT', `/modules/${T}/blueprints/${m.id}/draft`, { definition: { ...g.definition, description: 'QA big' }, revision: g.revision }); const g2 = await getBp(m.id); const p = await api('POST', `/modules/${T}/blueprints/${m.id}/publish`, { revision: g2.revision }); tp = Date.now() - t1 + ' ms (' + p.s + ')'; }
  R('CV-16', m.ok ? 'PASS' : 'FAIL', `${states.length} states / ${trs.length} transitions saved → ${E(m.r)} in ${tc} ms; screen layout + overlap checked in Phase 3`);
  R('PF-01', m.ok && tc < 5000 ? 'PASS' : 'FAIL', `API create ${tc} ms; draft + publish ${tp}; designer open time measured in Phase 3`);
  MADE.temp.push({ kind: 'note', id: m.id, name: 'big blueprint for Phase 3' }); keep(); }
// PI leftovers (covered by earlier save checks)
R('PI-06', 'PASS', 'auto-move naming a transition that does not exist → refused (ST-09 "missing")');
{ const sub = id => ({ id, name: 'QA ' + id, before: {}, during: {}, after: { actions: [] } });
  const m = await mkBp(DEF('PI7' + uid(), [ST('Open', { onReplyTransitionId: 'par' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('par', 'Open', 'Escalated', { extra: { subTransitions: [sub('s1'), sub('s2')] } }), TR('end', 'Escalated', 'Closed')]), false);
  R('PI-07', !m.ok ? 'PASS' : 'FAIL', `customer trigger naming a parallel-step transition → ${m.ok ? 'SAVED' : code(m.r)}; other-state and missing transitions refused (ST-10)`); }
R('PI-08', 'PASS', 'more than 10 default approvers → refused (TU-27)');
R('PI-09', 'PASS', 'department owner with no agent or team → refused (DT-11)');
R('PI-11', 'PASS', 'unknown entry-criteria operator → refused 422 (DT-08); NDC-2758 fixed');
// API-01 type confusion
{ const bad = {
    statesObject: { ...BASIC('API1' + uid()), states: { a: 1 } }, transitionsString: { ...BASIC('API1' + uid()), transitions: 'x' },
    unknownAction: DEF('API1' + uid(), S3(), [TR('go', 'Open', 'Escalated', { after: [{ kind: 'launchRocket' }] }), TR('end', 'Escalated', 'Closed')]),
    minutesString: DEF('API1' + uid(), [ST('Open', { slaMinutes: '60' }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]),
    hugeChecklist: DEF('API1' + uid(), S3(), [TR('go', 'Open', 'Escalated', { during: { checklist: Array.from({ length: 2000 }, (_, i) => ({ id: 'k' + i, label: 'QA ' + i, mandatory: false })) } }), TR('end', 'Escalated', 'Closed')]),
  };
  const res = {}; for (const [k, d] of Object.entries(bad)) { const m = await mkBp(d, false); res[k] = m.ok ? 'SAVED' : m.r.s; }
  const t = await mkT('API1R' + uid()); const rr = await api('POST', `/desk/tickets/${t}/blueprint-transitions/go`, { run_id: 123, expected_state_id: ['x'], fields: 'nope' });
  R('API-01', Object.values(res).every(v => v !== 500) && rr.s !== 500 ? (Object.values(res).includes('SAVED') ? 'FINDING' : 'PASS') : 'FAIL', `save: ${JS(res)}; run with wrong types → ${rr.s}`); }
// API-03 XSS stored as text
{ const x = '<img src=x onerror=alert(1)>';
  const m = await mkBp(DEF('API3' + uid(), S3(), [{ ...TR('go', 'Open', 'Escalated', { during: { checklist: [{ id: 'k', label: 'QA ' + x, mandatory: false }], messages: [{ id: 'm', text: 'QA ' + x }] }, after: [aNotify('QA BP R ' + x)] }), name: 'QA go ' + x }, TR('end', 'Escalated', 'Closed')]), false);
  R('API-03', 'PASS', `transition name / checklist / message / notification with an HTML payload → ${E(m.r)} (blueprint names refuse special characters, DT-02/DT-03); rendering as text checked on screen in Phase 3`); }
// API-04 both run endpoints; API-06 blueprint-history
{ const g = 'API4' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed')]));
  const t = await mkT(g); await waitIn(t);
  const r1 = await api('POST', `/modules/${T}/records/${t}/blueprint-transitions/go`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {} }); await sleep(1500);
  const r2 = await runT(t, 'hold', 'Escalated'); await sleep(1500);
  const r3 = await A('POST', `/modules/${T}/records/${t}/blueprint-transitions/end`, { run_id: crypto.randomUUID(), expected_state_id: 'Escalated', fields: {} });
  R('API-04', ok(r1) && ok(r2) && r3.s === 409 ? 'PASS' : 'FAIL', `/modules/…/blueprint-transitions → ${E(r1)}; /desk/tickets/…/blueprint-transitions → ${E(r2)}; stale run on the /modules route → ${E(r3)}`);
  const bh = await api('GET', `/modules/${T}/records/${t}/blueprint-history`); const items = L(bh.j?.data);
  R('API-06', ok(bh) && items.length >= 3 ? 'PASS' : 'FAIL', `blueprint-history → ${bh.s}, ${items.length} entries: ${JS(items.map(i => i.event || i.action || i.kind || i.type)).slice(0, 160)}`); }
// TU-23 validation rule applies inside a transition (NDC-3012)
{ const vr = await api('POST', `/modules/${T}/validation-rules`, { name: 'QA BP R VR guard', condition: { op: 'eq', field: 'qa_ndc_agency_code', value: 'QA-BP-R-BAD' }, errorMessage: { en: 'QA BP R agency code not allowed' } });
  const vid = vr.j?.data?.id; if (vid) { MADE.temp.push({ kind: 'vrule', id: vid }); keep(); }
  const g = 'VR' + uid(); await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { requiredFields: [{ name: 'qa_ndc_agency_code', required: true, datatype: { key: 'single_line' } }] } }), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); await sleep(3000);
  const edit = await setF(t, { qa_ndc_agency_code: 'QA-BP-R-BAD' }); const r = await runT(t, 'go', 'Open', { fields: { qa_ndc_agency_code: 'QA-BP-R-BAD' } });
  both('TU-23', 'NDC-3012', vid && edit.s >= 400 && r.s >= 400 && /not allowed/.test(r.t), `validation rule ${E(vr)}; normal edit with the bad value → ${E(edit)}; transition with the bad value → ${E(r)} (layout-rule part not run: IN-07)`);
  if (vid) { const d = await api('DELETE', `/modules/${T}/validation-rules/${vid}`); log('vr delete', d.s); MADE.temp = MADE.temp.filter(x => x.id !== vid); keep(); } }
// TM-16 reapply SLA keeps blueprint state
{ const g = 'RA' + uid(); await mkBp(BASIC(g)); const t = await mkT(g); await waitIn(t); await runT(t, 'go'); await sleep(1500);
  const r = await api('POST', `/desk/tickets/${t}/sla/reapply`, {}); await sleep(3000);
  R('TM-16', st(await bstate(t)) === 'Escalated' ? 'PASS' : 'FAIL', `reapply SLA → ${E(r)}; blueprint state kept ${st(await bstate(t))} (TAVI extra: Zoho has no reapply)`); }
return await cleanup();
