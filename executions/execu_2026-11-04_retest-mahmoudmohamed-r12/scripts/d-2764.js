// NDC-2764 r12: workflow rule (RecordUpdated, subject StartsWith "QA RT12 2764 ") sets status=Closed + description; blueprint in QA RT11 Dept A holds Status. Expect: status stays blueprint state, description set, rule history says skipped.
const TK = X.TK; const P = 'QA RT12 2764 ';
const body = { moduleId: TK, layoutId: '', name: 'QA RT12 2764 rule', description: 'QA retest r12 - safe to delete', mode: 'Recurring', isActive: true, trigger: { kind: 'RecordUpdated' },
  criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: P, caseInsensitive: false },
  actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { status: { kind: 'string', stringValue: 'Closed' }, description: { kind: 'string', stringValue: 'r12-2764-rule-ran' } } }] };
const rr = await api('o', 'POST', 'desk:/workflow/rules', body); log('rule', X.err(rr)); const ruleId = rr.j?.data?.id; if (ruleId) ledger(`NDC-2764: workflow rule "QA RT12 2764 rule" ${ruleId}`);
if (!ruleId) return { rule: rr.t.slice(0, 400) };
const d = X.bp('2764 bp', { marker: P }).state('Open').state('Escalated').terminal('Closed').tr('go', 'Open', 'Escalated').tr('end', 'Escalated', 'Closed').build();
const b = await X.createBp(d, true); log('bp', X.err(b));
// control ticket outside blueprint (subject starts with prefix but blueprint marker differs? same prefix → would enter). Use a second department for control.
const t = await X.ticket(P + 'in bp'); const tid = t.j?.data?.id; log('ticket', X.err(t));
const s0 = await X.waitState(tid, 30000); log('state0', s0 && s0.currentStateId || s0);
const pt = await api('o', 'PATCH', `desk:/modules/${TK}/records/${tid}`, { data: [{ field: 'status', value: { kind: 'string', value: 'Closed' } }] }); log('direct PATCH status', X.err(pt));
const go = await X.run(tid, 'go', 'Open'); log('run go', X.err(go));
await sleep(15000);
const f = await X.fields(tid); const s1 = await X.state(tid);
log('after', { status: f.status, description: f.description, inBlueprint: !!s1, state: s1 && (s1.currentStateId || s1.activeStates) });
// control: same rule on a ticket in Dept B (no blueprint) → status should become Closed
const c = await X.ticket(P + 'control', { department: X.ids.DEPT_B }); const cid = c.j?.data?.id; await sleep(3000);
const cu = await api('o', 'PATCH', `desk:/modules/${TK}/records/${cid}`, { data: [{ field: 'priority', value: { kind: 'string', value: 'High' } }] }); log('control update', X.err(cu));
await sleep(15000); const cf = await X.fields(cid); log('control after', { status: cf.status, description: cf.description });
// rule history
for (const p of [`desk:/workflow/rules/${ruleId}/executions?limit=20`, `desk:/workflow/rules/${ruleId}/history?limit=20`, `desk:/workflow/executions?rule_id=${ruleId}&limit=20`]) { const h = await api('o', 'GET', p); log('hist ' + p.split('/').slice(-1)[0], h.s, h.t.slice(0, 1200)); if (h.s === 200) break; }
return { ruleId, bp: b.j?.data?.id, tid, cid };
