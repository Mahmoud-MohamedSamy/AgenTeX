// E2E journeys (each actor uses their own account through the API; screens of the same flows were checked in Phase 3).
const tStart = new Date(Date.now() - 3000);
// ---- start the timer journeys first
// E2E-02 waiting for customer: Ask documents (reply) → On Hold with reply trigger + auto-close after 2 min
const g2 = 'E2' + uid();
await mkBp(DEF(g2, [ST('Open'), ST('On Hold', { onReplyTransitionId: 'answered', autoTransitionId: 'autoclose', autoTransitionAfterMinutes: 2 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [
  TR('ask', 'Open', 'On Hold', { during: { deskItems: [{ kind: 'reply', mandatory: true }] } }), TR('answered', 'On Hold', 'Escalated'), TR('autoclose', 'On Hold', 'Closed'), TR('end', 'Escalated', 'Closed')]));
const e2 = await mkT(g2, 'no answer'); await waitIn(e2);
const e2run = await runT(e2, 'ask', 'Open', { reply: { content: 'QA BP R please send the documents', to: ['mahmoud.mmohamedsamy+qae1@gmail.com'] } }, A);
// E2E-03 escalation: limit 3 min + warning 2 min before + 2 levels + auto-move at the limit
const g3 = 'E3' + uid(); const lv = (timing, off) => ({ id: 'level-' + uid(), timing, offsetMinutes: off, recipients: { userIds: [U.B], teamIds: [], ticketOwner: true, transitionOwners: false }, templateId: TPL });
await mkBp(DEF(g3, [ST('Open', { slaMinutes: 3, slaPreExpiryMinutes: 2, slaPreExpiryEscalation: [aHook('e3warn-' + g3)], slaEscalation: [aHook('e3due-' + g3)], slaEscalationLevels: [lv('at', 0), lv('after', 1)], autoTransitionId: 'esc', autoTransitionAfterMinutes: 3 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('esc', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
const e3 = await mkT(g3, 'escalate'); await api('POST', `/desk/tickets/${e3}/assign`, { owner_id: U.A }); await waitIn(e3);
// ---- E2E-01 refund
{ const g = 'E1' + uid();
  await mkBp(DEF(g, [ST('Open'), ST('QA BP Verify'), ST('Escalated'), ST('QA BP Done', { isTerminal: true })], [
    TR('verify', 'Open', 'QA BP Verify', { during: { checklist: [{ id: 'docs', label: 'QA receipts checked', mandatory: true }], deskItems: [{ kind: 'comment', mandatory: true }] } }),
    TR('approve', 'QA BP Verify', 'Escalated', { before: { allowedUserIds: [U.A] }, during: { deskItems: [{ kind: 'resolution', mandatory: true }] }, after: [aNotify('QA BP R refund approved {{subject}}', { owner: true })] }),
    TR('pay', 'Escalated', 'QA BP Done', { during: { requiredFields: [{ name: 'qa_ndc_agency_code', required: true, datatype: { key: 'single_line' } }] }, after: [aSet('description', 'QA BP R refund paid'), aHook('e1pay-' + g)] }),
  ]));
  const t = await mkT(g, 'refund request'); const s0 = await waitIn(t); await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.B });
  const v = await runT(t, 'verify', 'Open', { checklist: { docs: true }, comment: { content: 'QA receipts ok' } }, B);
  const bApprove = await runT(t, 'approve', 'QA BP Verify', { resolution: { content: 'x' } }, B);
  const aApprove = await runT(t, 'approve', 'QA BP Verify', { resolution: { content: 'QA refund approved by A' } }, A);
  const pay = await runT(t, 'pay', 'Escalated', { fields: { qa_ndc_agency_code: 'PAY-1' } }, B); await sleep(12000);
  const f = await flds(t); const h = await histTxt(t); const hk = (await hooks(tStart)).filter(x => x.url.includes('e1pay-' + g)).length;
  const okAll = st(s0) === 'Open' && ok(v) && bApprove.s === 403 && ok(aApprove) && ok(pay) && !(await bstate(t)) && f.status === 'QA BP Done' && /refund paid/.test(f.description || '') && hk === 1;
  R('E2E-01', okAll ? 'PASS' : 'FAIL', `entered Open; B verifies → ${v.s}; B tries Approve → ${E(bApprove)}; A approves → ${aApprove.s}; B pays → ${pay.s}; final status ${f.status}, left blueprint ${!(await bstate(t))}, description "${f.description}", pay webhook ${hk}×; history lines ${(h.match(/blueprint_transition/g) || []).length} transitions, completed ${/completed/.test(h)}`); }
// ---- E2E-04 strict mode all-except replies
{ const g = 'E4' + uid(); await mkBp(DEF(g, S3(), [TR('go', 'Open', 'Escalated', { during: { deskItems: [{ kind: 'comment', mandatory: true }, { kind: 'attachment', mandatory: false }] } }), TR('end', 'Escalated', 'Closed', { during: { deskItems: [{ kind: 'resolution', mandatory: true }] } })], { strictMode: { scope: 'allExcept', actions: ['reply'] } }));
  const t = await mkT(g); await waitIn(t);
  const ed = await setF(t, { description: 'x' }, A), cm = await A('POST', `/desk/tickets/${t}/comments`, { content_html: '<p>x</p>' }), rs = await A('PUT', `/desk/tickets/${t}/resolution`, { resolution: 'x' });
  const f1 = await upload('qa-e4.txt', 'x', A); const go = await runT(t, 'go', 'Open', { comment: { content: 'QA via step' }, attachment_ids: [f1.id] }, A); await sleep(1500);
  const end = await runT(t, 'end', 'Escalated', { resolution: { content: 'QA resolved via step' } }, A); await sleep(1500);
  R('E2E-04', [ed, cm, rs].every(r => r.s === 403) && ok(go) && ok(end) && !(await bstate(t)) ? 'PASS' : 'FAIL', `by hand: edit ${ed.s}, comment ${cm.s}, resolution ${rs.s} (all should be refused); through steps: go ${E(go)}, end ${E(end)}; left blueprint ${!(await bstate(t))}`); }
// ---- E2E-05 cross-department + dynamic owners
{ const g = 'E5' + uid(); await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('review', 'Open', 'On Hold', { before: { allowedUserIds: [U.A] } }), TR('done', 'On Hold', 'Escalated'), TR('end', 'Escalated', 'Closed')], { dynamicOwners: true }));
  const t = await mkT(g); await waitIn(t);
  const set = await api('PUT', `/modules/${T}/records/${t}/blueprint/owners/review`, { userIds: [], teamIds: [], departmentOwners: [{ departmentId: TECH, access: 'full', userIds: [U.C], teamIds: [] }] }); await sleep(3000);
  const aSees = (await transIds(t, A)).includes('review'), cSees = (await transIds(t, C)).includes('review');
  const run = await runT(t, 'review', 'Open', {}, C); await sleep(3000);
  const shares = L((await api('GET', `/desk/tickets/${t}/shares`)).j?.data).map(s => (s.department_name || '') + ':' + s.access);
  R('E2E-05', ok(set) && !aSees && cSees && ok(run) ? 'PASS' : 'FAIL', `admin sets Tech (Full) as owner of "review" on this ticket → ${E(set)}; A (blueprint owner) still sees ${aSees}; Tech agent sees ${cSees} and runs → ${E(run)}; shares after the step ${shares.join(', ') || 'none'}`); }
// ---- E2E-07 change after the fact
{ const g = 'E7' + uid(); const b = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('end', 'Escalated', 'Closed')]));
  const t1 = await mkT(g, 'one'), t2 = await mkT(g, 'two'); await waitIn(t1); await waitIn(t2);
  const off = await putBp(b.id, null, false); const t3 = await mkT(g, 'while off'); await sleep(6000); const in3 = !!(await bstate(t3));
  const g1 = await getBp(b.id); const d = JSON.parse(JSON.stringify(g1.definition)); d.description = 'QA v2'; d.transitions.push(TR('fast', 'Open', 'Closed'));
  await api('PUT', `/modules/${T}/blueprints/${b.id}/draft`, { definition: d, revision: g1.revision }); const pub = await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: (await getBp(b.id)).revision });
  const offered = await transIds(t1);
  const vs = L((await api('GET', `/modules/${T}/blueprints/${b.id}/versions`)).j?.data); const first = vs.map(v => v.version ?? v.versionNumber).filter(x => x != null).sort((a, x) => a - x)[0];
  const rst = await api('POST', `/modules/${T}/blueprints/${b.id}/versions/${first}/restore`, {}); const pub2 = await api('POST', `/modules/${T}/blueprints/${b.id}/publish`, { revision: (await getBp(b.id)).revision });
  const del1 = await api('DELETE', `/modules/${T}/blueprints/${b.id}`);
  const rv = await api('POST', `/desk/blueprints/${b.id}/revoke`, { ticket_ids: null, after: null }); await sleep(2500);
  const del2 = await api('DELETE', `/modules/${T}/blueprints/${b.id}`); if (ok(del2)) { MADE.bps = MADE.bps.filter(x => x !== b.id); keep(); }
  R('E2E-07', ok(off) && !in3 && ok(pub) && ok(rst) && del1.s === 409 && ok(rv) && ok(del2) ? 'PASS' : 'FAIL', `deactivate with 2 inside → ${off.s}, new ticket entered ${in3}; v2 publish → ${pub.s} (old ticket now offered [${offered}]); restore v${first} → ${rst.s}, publish → ${pub2.s}; delete with tickets inside → ${del1.s}; revoke all → ${E(rv)}; delete → ${del2.s}`); }
// ---- E2E-08 negative recovery
{ const g = 'E8' + uid(); const bad = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const good = await mkBp(DEF(g, [...S3(), ST('On Hold')], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); await runT(t, 'hold'); await sleep(1500);
  const rm = await putBp(good.id, d => { d.states = d.states.filter(s => s.id !== 'On Hold'); d.transitions = d.transitions.filter(x => !['hold', 'back'].includes(x.id)); return d; });
  const rv = await revoke1(t); await sleep(1500);
  const rm2 = await putBp(good.id, d => { d.states = d.states.filter(s => s.id !== 'On Hold'); d.transitions = d.transitions.filter(x => !['hold', 'back'].includes(x.id)); return d; });
  R('E2E-08', !bad.ok && rm.s === 409 && ok(rv) && ok(rm2) ? 'PASS' : 'FAIL', `blueprint with an unreachable state → ${bad.ok ? 'SAVED' : code(bad.r)}; remove On Hold with a ticket inside → ${E(rm)}; revoke → ${rv.s}; remove again → ${rm2.s}`); }
// ---- E2E-06 chat
R('E2E-06', 'BLOCKED', 'needs a live chat conversation from the Omni Channel widget (visitor side); not created in this run — NDC-3047 not re-verified (RG-37)');
RG('NDC-3047', 'BLOCKED', 'chat-created ticket entry needs a visitor chat (widget); not run');
// ---- finish the timer journeys
await sleep(Math.max(0, 300000 - (Date.now() - tStart.getTime())));
const hk = await hooks(tStart);
const s2 = await bstate(e2); const f2 = await flds(e2);
R('E2E-02', ok(e2run) && f2.status === 'Closed' ? 'PARTIAL' : 'FAIL', `agent asked for documents (required reply) → ${E(e2run)}; no customer answer → auto-closed after 2 min: status ${f2.status}, in blueprint ${!!s2}. Customer-answer branch not run (needs a customer reply from the Help Center / mailbox)`);
const bl = [...await bells(A), ...await bells(B)].filter(b => JS(b).includes(g3));
R('E2E-03', hk.filter(x => x.url.includes('e3warn-' + g3)).length === 1 && hk.filter(x => x.url.includes('e3due-' + g3)).length === 1 && st(await bstate(e3)) === 'Escalated' ? 'PASS' : 'FAIL', `warning webhook ${hk.filter(x => x.url.includes('e3warn-' + g3)).length}×, run-out webhook ${hk.filter(x => x.url.includes('e3due-' + g3)).length}×, level notifications ${bl.length}, state after the limit ${st(await bstate(e3))}`);
return await cleanup();
