// SL-27 (overdue ticket back from On Hold), SL-29 (manual due date then hold/resume), SL-38 (allowance used up), SL-60 (plan from
// another department), SL-61 (plan changed with running tickets), SL-42 (merge). Owner, QA AO Dept A/B. Records behaviour; cleans up.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', B = '4853562a-0b4d-45cb-ba34-9f2118fcd32c', M = '88e8ea44-1658-4df3-9930-d0902b91073d';
const ACC = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', CON = '0924eb24-e42a-4eab-8efd-e3428f19e882';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const u = Math.random().toString(36).slice(2, 6); const R = { u }; const made = [];
const ok = (r, w) => { if (!r || r.s >= 300) throw new Error(w + ' ' + (r && r.s) + ' ' + (r && r.t.slice(0, 300))); return r; };
const pol = async (tag, dept, respMin) => { const r = ok(await api('POST', '/desk/sla/policies', { department_id: dept, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + tag, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: respMin, unit: 'minutes' }, resolution: { value: 3, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] }), 'policy ' + tag); made.push(['policy', r.j.data.id]); return r.j.data.id; };
const tk = async (tag, extra = []) => { const r = ok(await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high'), ...extra] }), 'ticket'); made.push(['ticket', r.j.data.id]); return r.j.data.id; };
const sla = async id => (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data;
const sum = s => ({ state: s?.state, exec: s?.execution?.number, plan: s?.plan?.name || s?.support_plan?.name || s?.coverage?.reason, obl: (s?.obligations || []).map(o => o.kind + ':' + o.state + ' due ' + (o.due_at || '').slice(11, 19) + (o.breached_at ? ' breached' : '') + (o.paused_at ? ' paused' : '')) });
const status = async (id, v) => (await api('PATCH', '/modules/' + M + '/records/' + id, { data: [f('status', v)] })).s;
try {
  // SL-27 and SL-29 share a 1-minute response policy
  const t27 = 'SL27' + u; await pol(t27, A, 1);
  const a = await tk(t27), b = await tk(t27 + 'd');
  await sleep(5000);
  R['SL-29'] = { before: sum(await sla(b)) };
  const due = new Date(Date.now() + 5 * 3600000).toISOString();
  R['SL-29'].setDue = (await api('PATCH', '/modules/' + M + '/records/' + b, { data: [f('due_date', due)] })).s; await sleep(5000);
  R['SL-29'].afterManualDue = sum(await sla(b));
  await sleep(90000);
  R['SL-27'] = { overdue: sum(await sla(a)) };
  R['SL-27'].hold = await status(a, 'On Hold'); R['SL-29'].hold = await status(b, 'On Hold'); await sleep(40000);
  R['SL-27'].onHold = sum(await sla(a)); R['SL-29'].onHold = sum(await sla(b));
  R['SL-27'].resume = await status(a, 'Open'); R['SL-29'].resume = await status(b, 'Open'); await sleep(15000);
  R['SL-27'].afterResume = sum(await sla(a)); R['SL-29'].afterResume = sum(await sla(b));
  // SL-42: merge two tickets that each have an SLA
  const t42 = 'SL42' + u; await pol(t42, A, 60); const m1 = await tk(t42 + 'a'), m2 = await tk(t42 + 'b'); await sleep(6000);
  R['SL-42'] = { before: { a: sum(await sla(m1)), b: sum(await sla(m2)) } };
  let mr = await api('POST', '/desk/tickets/merge', { primary_ticket_id: m1, ticket_ids: [m2] });
  if (mr.s >= 400) { R['SL-42'].firstTry = mr.s + ' ' + mr.t.slice(0, 300); mr = await api('POST', '/desk/tickets/' + m1 + '/merge', { ticket_ids: [m2] }); }
  R['SL-42'].merge = mr.s + ' ' + mr.t.slice(0, 300); await sleep(6000);
  R['SL-42'].after = { a: sum(await sla(m1)), b: sum(await sla(m2)) };
  // SL-38, SL-60, SL-61: account, plans, contract
  const t38 = 'SL38' + u; const p38 = await pol(t38, A, 60);
  const acc = ok(await api('POST', '/modules/' + ACC + '/records', { data: [f('account_name', 'QA AO Account ' + t38)] }), 'account').j.data.id; made.push(['account', acc]);
  const plan = async (name, dept, body) => { const r = ok(await api('POST', '/desk/sla/support-plans', { department_id: dept, name, description: null, policy_id: body.policy_id, ...body }), 'plan ' + name); made.push(['plan', r.j.data.id]); return r.j.data.id; };
  const allow = await plan('QA AO Plan allow ' + u, A, { type: 'allowance', allowance: 1, cycle: 'monthly', policy_id: p38 });
  const today = new Date().toISOString().slice(0, 10), later = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
  const c = ok(await api('POST', '/modules/' + CON + '/records', { data: [f('contract_name', 'QA AO Contract ' + t38), f('department', A), f('account_id', acc), f('support_plan', allow), f('start_date', today), f('end_date', later)] }), 'contract').j.data.id; made.push(['contract', c]);
  R.attach = (await api('PUT', '/desk/sla/contracts/' + c + '/plan', { plan_id: allow })).s;
  const x1 = await tk(t38 + 'x1', [f('account_id', acc)]); await sleep(8000); const x2 = await tk(t38 + 'x2', [f('account_id', acc)]); await sleep(8000);
  R['SL-38'] = { first: sum(await sla(x1)), second: sum(await sla(x2)), usage: (await api('GET', '/desk/sla/support-plans/' + allow + '/usage')).t.slice(0, 300), coverage: (await api('GET', '/desk/sla/contracts/' + c + '/coverage')).t.slice(0, 300) };
  // SL-60: a plan from Dept B on this Dept A contract
  const pB = await pol('SL60' + u, B, 60); const planB = await plan('QA AO Plan B ' + u, B, { type: 'unlimited', policy_id: pB });
  const setB = await api('PUT', '/desk/sla/contracts/' + c + '/plan', { plan_id: planB });
  R['SL-60'] = { attachOtherDept: setB.s + ' ' + setB.t.slice(0, 250), coverage: (await api('GET', '/desk/sla/contracts/' + c + '/coverage')).t.slice(0, 300) };
  // SL-61: change the plan while x1 is running
  const unl = await plan('QA AO Plan unl ' + u, A, { type: 'unlimited', policy_id: p38 });
  const before61 = sum(await sla(x1)); const set = await api('PUT', '/desk/sla/contracts/' + c + '/plan', { plan_id: unl }); await sleep(8000);
  const x3 = await tk(t38 + 'x3', [f('account_id', acc)]); await sleep(8000);
  R['SL-61'] = { change: set.s, runningBefore: before61, runningAfter: sum(await sla(x1)), newTicket: sum(await sla(x3)), coverage: (await api('GET', '/desk/sla/contracts/' + c + '/coverage')).t.slice(0, 300) };
} catch (e) { R.error = e.message; }
R.cleanup = [];
const P = { ticket: id => '/modules/' + M + '/records/' + id, contract: id => '/modules/' + CON + '/records/' + id, plan: id => '/desk/sla/support-plans/' + id, policy: id => '/desk/sla/policies/' + id, account: id => '/modules/' + ACC + '/records/' + id };
for (const k of ['ticket', 'contract', 'plan', 'policy', 'account']) for (const [kind, id] of made.filter(x => x[0] === k)) { const d = await api('DELETE', P[kind](id)); if (d.s >= 300 && d.s !== 404) R.cleanup.push(kind + ' ' + id + ' ' + d.s + ' ' + d.t.slice(0, 120)); }
return R;
