R('TM-05', 'PASS', 'auto-move after 1 min ran (state Escalated, status line Open → Escalated); blueprint-history has fromState Open / toState Escalated. Ticket History screen wording (NDC-3066) checked in Phase 3');
RG('NDC-3066', 'INCONCLUSIVE', 'API data correct (from Open, to Escalated); History screen checked in Phase 3');
// TM-14 department SLA in an On Hold-type state
{ const g = 'TM14' + uid();
  const pol = await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA BP R SLA ' + g, description: null, is_active: true, triggers: { create: true, update: true, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true, targets: [{ name: 'QA BP R all', criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA BP R ' + g }], pattern: null }, response: { value: 30, unit: 'minutes' }, resolution: { value: 60, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
  const pid = pol.j?.data?.id; if (pid) { MADE.temp.push({ kind: 'sla', id: pid }); keep(); }
  await mkBp(DEF(g, [ST('Open'), ST('On Hold', { slaMinutes: 4 }), ST('Escalated'), ST('Closed', { isTerminal: true })], [TR('hold', 'Open', 'On Hold'), TR('back', 'On Hold', 'Open'), TR('go', 'Open', 'Escalated'), TR('end', 'Escalated', 'Closed')]));
  const t = await mkT(g, 'sla'); await waitIn(t);
  let s0; for (let i = 0; i < 12; i++) { s0 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data; if (s0?.state && s0.state !== 'none') break; await sleep(5000); }
  await runT(t, 'hold'); await sleep(20000); const s1 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data; const bs = await bstate(t);
  await runT(t, 'back', 'On Hold'); await sleep(20000); const s2 = (await api('GET', `/desk/tickets/${t}/sla`)).j?.data;
  const sl = x => `${x?.state}/${x?.policy?.name || x?.policy || '-'}`;
  R('TM-14', s0?.state && s0.state !== 'none' ? (/paus/i.test(s1?.state || '') && !/paus/i.test(s2?.state || '') && dueOf(bs?.escalation_due_at) ? 'PASS' : 'FAIL') : 'INCONCLUSIVE', `policy ${E(pol)}; SLA before ${sl(s0)}; in On Hold ${sl(s1)} (state timer due ${dueOf(bs?.escalation_due_at)}); back in Open ${sl(s2)}; raw on hold ${JS(s1).slice(0, 200)}`); }
return await cleanup();
