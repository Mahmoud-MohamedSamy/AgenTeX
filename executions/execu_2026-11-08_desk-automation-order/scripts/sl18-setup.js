// SL-18 setup (owner): two SLA policies in QA AO Dept A, "first response only" ON and OFF, each with a ticket for the user's Gmail.
// An agent reply is sent on each ticket (meets the first response). The user then replies from Gmail; sl18-check.js reads the result.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', C = '43004ce2-577f-4eda-b00a-0750fe40c3d4', G = 'mahmoud.mmohamedsamy@gmail.com';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const u = Math.random().toString(36).slice(2, 6); const R = { u, t: {} };
const ok = (r, w) => { if (!r || r.s >= 300) throw new Error(w + ' ' + (r && r.s) + ' ' + (r && r.t.slice(0, 300))); return r; };
const ct = ok(await api('POST', '/modules/' + C + '/records', { data: [f('last_name', 'QA AO SL18 ' + u), f('email', G)] }), 'contact'); R.contact = ct.j.data.id;
for (const [k, fro] of [['on', true], ['off', false]]) {
  const tag = 'SL18' + k + u;
  const p = ok(await api('POST', '/desk/sla/policies', { department_id: A, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + tag, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: 4, unit: 'hours' }, resolution: { value: 2, unit: 'days' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: fro, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] }), 'policy');
  const t = ok(await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high'), f('contact_id', R.contact), f('email', G)] }), 'ticket');
  R.t[k] = { tag, policy: p.j.data.id, ticket: t.j.data.id, number: (t.j.data.data || []).find(d => d.field === 'ticket_number')?.value?.value };
}
await sleep(8000);
for (const k of ['on', 'off']) {
  const x = R.t[k];
  const r = await api('POST', '/desk/tickets/' + x.ticket + '/replies', { mode: 'reply', to: [G], subject: 'QA AO ' + x.tag + ' - please reply to this mail', body_html: '<p>QA AO ' + x.tag + ': this is an agent reply. Please reply to this email with any text.</p>' });
  x.reply = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 200) : '');
  await sleep(6000);
  const s = (await api('GET', '/desk/tickets/' + x.ticket + '/sla')).j?.data;
  x.obligations = (s?.obligations || []).map(o => o.kind + ':' + o.state + ':cycle' + o.cycle);
  if (!x.number) x.number = ((await api('GET', '/modules/' + M + '/records/' + x.ticket)).j?.data?.data || []).find(d => d.field === 'ticket_number')?.value?.value;
}
fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/sl18.json', JSON.stringify(R));
return R;
