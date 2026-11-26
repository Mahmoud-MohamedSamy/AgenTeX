// TM — timers (calendar clock, minute limits). Everything starts together, then one wait, then checks.
const t0 = new Date(Date.now() - 3000);
const P = {}; // per-case data
const assignA = async t => { await api('POST', `/desk/tickets/${t}/assign`, { owner_id: U.A }); };
// A: warning (1 min) + run-out (3 min) actions
{ const g = 'TMA' + uid(); P.A = { g };
  await mkBp(DEF(g, [ST('Open', { slaMinutes: 3, slaPreExpiryMinutes: 2, slaPreExpiryEscalation: [aHook('warn-' + g), aNotify('QA BP R warn ' + g, { owner: true })], slaEscalation: [aHook('due-' + g), aNotify('QA BP R due ' + g, { owner: true }), aSet('priority', 'urgent')] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  P.A.t = await mkT(g); await assignA(P.A.t); P.A.s = await waitIn(P.A.t); }
// B: escalation levels before / at / after + a level with a template id that does not exist
{ const g = 'TMB' + uid(); P.B = { g }; const lv = (timing, off, tpl = TPL) => ({ id: 'level-' + uid(), timing, offsetMinutes: off, recipients: { userIds: [U.B], teamIds: [], ticketOwner: true, transitionOwners: false }, templateId: tpl });
  const m = await mkBp(DEF(g, [ST('Open', { slaMinutes: 3, slaEscalationLevels: [lv('before', 1), lv('at', 0), lv('after', 1)] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  P.B.save = E(m.r); P.B.t = await mkT(g); await assignA(P.B.t); await waitIn(P.B.t);
  const g2 = 'TMBX' + uid(); P.B.g2 = g2; const m2 = await mkBp(DEF(g2, [ST('Open', { slaMinutes: 2, slaEscalationLevels: [lv('at', 0, crypto.randomUUID())] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  P.B.save2 = E(m2.r); if (m2.ok) { P.B.t2 = await mkT(g2); await assignA(P.B.t2); await waitIn(P.B.t2); } }
// C: auto-move after 2 min without limit; auto-move at the limit (3 min)
{ const g = 'TMC' + uid(); P.C = { g };
  await mkBp(DEF(g, [ST('Open', { autoTransitionId: 'go', autoTransitionAfterMinutes: 2 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated', { after: [aHook('auto-' + g)] }), TR('end', 'Escalated', 'Closed')]));
  P.C.t = await mkT(g); P.C.s = await waitIn(P.C.t);
  const g2 = 'TMC2' + uid(); P.C.g2 = g2; await mkBp(DEF(g2, [ST('Open', { slaMinutes: 3, autoTransitionId: 'go', autoTransitionAfterMinutes: 3 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  P.C.t2 = await mkT(g2); await waitIn(P.C.t2); }
// D: leave before due; E: revoke before due
for (const k of ['D', 'E']) { const g = 'TM' + k + uid(); P[k] = { g };
  await mkBp(DEF(g, [ST('Open', { slaMinutes: 2, slaPreExpiryMinutes: 1, slaPreExpiryEscalation: [aHook('warn-' + g)], slaEscalation: [aHook('due-' + g)], autoTransitionId: 'go', autoTransitionAfterMinutes: 2 }), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('hold', 'Open', 'On Hold'), TR('end', 'Escalated', 'Closed'), TR('end2', 'On Hold', 'Closed')]));
  P[k].t = await mkT(g); await waitIn(P[k].t); }
await sleep(15000); P.D.leave = E(await runT(P.D.t, 'hold')); P.E.rev = E(await revoke1(P.E.t));
// F: department SLA + On Hold-type blueprint state with its own limit
{ const g = 'TMF' + uid(); P.F = { g };
  const pol = await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA BP R SLA ' + g, description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true, targets: [{ name: 'QA BP R t ' + g, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: g }], pattern: null }, response: { value: 30, unit: 'minutes' }, resolution: { value: 60, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
  P.F.pol = E(pol); P.F.polId = pol.j?.data?.id; if (P.F.polId) { MADE.temp.push({ kind: 'sla', id: P.F.polId }); keep(); }
  await mkBp(DEF(g, [ST('Open'), ST('On Hold', { slaMinutes: 4 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  P.F.t = await mkT(g, 'sla', { description: 'QA BP R ' + g }); await waitIn(P.F.t); await sleep(20000);
  P.F.sla0 = (await api('GET', `/desk/tickets/${P.F.t}/sla`)).j?.data;
  await runT(P.F.t, 'hold'); await sleep(15000); P.F.sla1 = (await api('GET', `/desk/tickets/${P.F.t}/sla`)).j?.data; P.F.bs1 = await bstate(P.F.t); }
// H: 10 tickets due in the same minute
{ const g = 'TMH' + uid(); P.H = { g, t: [] };
  await mkBp(DEF(g, [ST('Open', { slaMinutes: 2, slaEscalation: [aHook('h-' + g)] }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  for (let i = 0; i < 10; i++) P.H.t.push(await mkT(g, 'n' + i)); }
log('all timers started; waiting');
await sleep(300000);
// F resume
await runT(P.F.t, 'back', 'On Hold'); await sleep(15000); P.F.sla2 = (await api('GET', `/desk/tickets/${P.F.t}/sla`)).j?.data;
await sleep(30000);
const hk = await hooks(t0);
const n = p => hk.filter(x => x.url.includes(p)).length;
// TM-01
const sA = P.A.s; const ent = new Date(sA?.enteredAt || sA?.entered_at), due = new Date(sA?.escalation_due_at);
R('TM-01', Math.abs((due - ent) / 60000 - 3) < 0.2 ? 'PASS' : 'FAIL', `entered ${sA?.enteredAt}; due ${sA?.escalation_due_at} (${((due - ent) / 60000).toFixed(2)} min for a 3 min limit); warning ${sA?.warning_due_at}`);
// TM-02 / TM-03
const bA = (await bells(A)); const wA = bA.filter(b => JS(b).includes('QA BP R warn ' + P.A.g)).length, dA = bA.filter(b => JS(b).includes('QA BP R due ' + P.A.g)).length;
const fA = await flds(P.A.t);
both('TM-02', 'NDC-2788', n('warn-' + P.A.g) === 1 && wA === 1, `warning actions: webhook ${n('warn-' + P.A.g)}×, notification to owner ${wA}×`);
R('TM-03', n('due-' + P.A.g) === 1 && dA === 1 && fA.priority === 'urgent' ? 'PASS' : 'FAIL', `run-out actions: webhook ${n('due-' + P.A.g)}×, notification ${dA}×, field update priority=${fA.priority}; Steps data now ${JS((await bstate(P.A.t))?.slaDueAt || '').slice(0, 60)}`);
RG('NDC-2540', n('due-' + P.A.g) === 1 ? 'PASS' : 'FAIL', 'state escalation webhook sent ' + n('due-' + P.A.g) + '×');
// TM-04 levels
const bAll = [...await bells(A), ...await bells(B)].filter(b => JS(b).includes(P.B.g));
const lvB = bAll.map(b => (b.title || '').slice(0, 70) + ' @' + String(b.created_at || '').slice(11, 19));
R('TM-04', bAll.length >= 3 ? 'PASS' : 'FAIL', `levels before/at/after (save ${P.B.save}): notifications to owner A + B: ${bAll.length} [${lvB.join(' | ')}]; email delivery checked in Phase 4`);
const bX = [...await bells(A)].filter(b => JS(b).includes(P.B.g2 || 'zz'));
R('ST-07', 'FINDING', `a level whose template id does not exist is saved (${P.B.save2}); at runtime that level gave ${bX.length} notification(s) to the owner — the designer shows "This email template was deleted"`);
// TM-05 auto-move
const hC = await hist(P.C.t); const tr = hC.find(h => h.action === 'ticket.blueprint_transition'); const sC = await bstate(P.C.t);
const fromTo = JS(tr).match(/"(from|from_state|fromState)[^"]*":"([^"]+)"/g);
both('TM-05', 'NDC-3066', st(sC) === 'Escalated' && n('auto-' + P.C.g) === 1 && /Open/.test(JS(tr)) && /Escalated/.test(JS(tr)), `auto-move after 2 min (no limit): state ${st(sC)}, after-action webhook ${n('auto-' + P.C.g)}×; history line ${JS(tr).slice(0, 220)}; at-the-limit variant state ${st(await bstate(P.C.t2))}`);
// TM-09 / TM-10
R('TM-09', n('warn-' + P.D.g) + n('due-' + P.D.g) === 0 && st(await bstate(P.D.t)) === 'On Hold' ? 'PASS' : 'FAIL', `left Open after 15 s (${P.D.leave}): warning/run-out webhooks afterwards ${n('warn-' + P.D.g)}/${n('due-' + P.D.g)}; auto-move did not fire: state ${st(await bstate(P.D.t))}`);
R('TM-10', n('warn-' + P.E.g) + n('due-' + P.E.g) === 0 && !(await bstate(P.E.t)) ? 'PASS' : 'FAIL', `revoked after 15 s (${P.E.rev}): webhooks afterwards ${n('warn-' + P.E.g)}/${n('due-' + P.E.g)}; status ${await statusOf(P.E.t)}`);
// TM-14 department SLA paused in On Hold state, state timer runs
const sl = x => JS(x).replace(/"(id|ticket_id|policy_id|target_id)":"[^"]*",?/g, '').slice(0, 260);
const paused = /paus/i.test(JS(P.F.sla1)); const resumed = !/"paused":true|"is_paused":true/.test(JS(P.F.sla2));
const stateDue = P.F.bs1?.escalation_due_at;
R('TM-14', P.F.polId && paused && resumed && stateDue ? 'PASS' : (P.F.polId ? 'FAIL' : 'BLOCKED'), `QA SLA policy ${P.F.pol}; before On Hold: ${sl(P.F.sla0)}; in On Hold: ${sl(P.F.sla1)}; state timer in On Hold due ${stateDue}; after back to Open: ${sl(P.F.sla2)}`);
// TM-18 burst
const hh = hk.filter(x => x.url.includes('h-' + P.H.g)); const per = P.H.t.map(t => hh.filter(x => x.body.includes(t)).length);
R('TM-18', per.every(c => c === 1) ? 'PASS' : 'FAIL', `10 tickets with a 2 min limit: escalation webhook per ticket ${JS(per)}; last arrival ${hh.map(x => x.at).sort().pop()}`);
// cleanup SLA policy
if (P.F.polId) { const d = await api('DELETE', `/desk/sla/policies/${P.F.polId}`); log('sla policy delete', d.s); MADE.temp = MADE.temp.filter(x => x.id !== P.F.polId); keep(); }
return await cleanup();
