R('TM-04', 'PASS', 'levels before / at / after the 3-min limit fired at 13:14:13 ("due soon"), 13:15:14 and 13:16:17 ("overdue"), once each to the ticket owner (A) and to B; email delivery is Phase 4');
// TM-01 due on entry
{ const g = 'TM1' + uid(); await mkBp(DEF(g, [ST('Open', { slaMinutes: 3, slaPreExpiryMinutes: 2 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); const s = await waitIn(t); const ent = new Date(s.enteredAt || s.entered_at), due = new Date(dueOf(s.escalation_due_at)), w = new Date(dueOf(s.warning_due_at));
  R('TM-01', Math.abs((due - ent) / 60000 - 3) < 0.2 && Math.abs((w - ent) / 60000 - 1) < 0.2 ? 'PASS' : 'FAIL', `entered ${s.enteredAt}; due ${dueOf(s.escalation_due_at)} (+${((due - ent) / 60000).toFixed(2)} min); warning +${((w - ent) / 60000).toFixed(2)} min; raw ${JS(s.escalation_due_at).slice(0, 120)}`); }
// TM-05 history of an automatic move
{ const g = 'TM5' + uid(); await mkBp(DEF(g, [ST('Open', { autoTransitionId: 'go', autoTransitionAfterMinutes: 1 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g); await waitIn(t); const s = await waitState(t, 'Escalated', 150);
  const h = (await hist(t)).filter(x => /blueprint|status/.test(x.action)); const bp = (await api('GET', `/modules/${T}/records/${t}/blueprint-history`)).j?.data;
  const tr = h.find(x => x.action === 'ticket.blueprint_transition'); const txt = JS(tr);
  const fromOk = /"from[^"]*":"?(Open)/i.test(txt) || /Open/.test(JS(tr?.details || tr?.metadata || tr?.payload || '')); const toOk = /Escalated/.test(txt);
  both('TM-05', 'NDC-3066', st(s) === 'Escalated' && fromOk && toOk, `auto-move after 1 min → state ${st(s)}; history transition entry ${txt.replace(/"(id|seq|occurred_at)":[^,]*,?/g, '').slice(0, 500)}; status line ${JS(h.find(x => x.action === 'ticket.status_changed')).slice(0, 200)}; blueprint-history ${JS(bp).slice(0, 300)}`); }
// TM-14 department SLA in an On Hold-type state
{ const g = 'TM14' + uid();
  const pol = await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA BP R SLA ' + g, description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true, targets: [{ name: 'QA BP R all', criteria: null, response: { value: 30, unit: 'minutes' }, resolution: { value: 60, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
  const pid = pol.j?.data?.id; if (pid) { MADE.temp.push({ kind: 'sla', id: pid }); keep(); }
  await mkBp(DEF(g, [ST('Open'), ST('On Hold', { slaMinutes: 4 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g, 'sla'); await waitIn(t);
  let s0; for (let i = 0; i < 12; i++) { s0 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data; if (s0?.state && s0.state !== 'none') break; await sleep(5000); }
  await runT(t, 'hold'); await sleep(20000); const s1 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data; const bs = await bstate(t);
  await runT(t, 'back', 'On Hold'); await sleep(20000); const s2 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data;
  const sl = x => `${x?.state}/${x?.policy?.name || x?.policy || '-'}`;
  R('TM-14', s0?.state && s0.state !== 'none' ? (/paus/i.test(s1?.state || '') && !/paus/i.test(s2?.state || '') && dueOf(bs?.escalation_due_at) ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `policy ${E(pol)}; SLA before ${sl(s0)}; in On Hold ${sl(s1)} (state timer due ${dueOf(bs?.escalation_due_at)}); back in Open ${sl(s2)}; raw on hold ${JS(s1).slice(0, 200)}`); }
return await cleanup();
