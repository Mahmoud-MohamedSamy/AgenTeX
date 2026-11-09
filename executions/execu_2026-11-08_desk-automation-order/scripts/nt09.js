// NT-09 part 1 (owner): a ticket in QA AO Dept A with a task, a call and an event owned by Test User 1; then each is completed by the owner.
// Part 2 (nt09b.js as Test User 1) reads Test User 1's bell. Run: node api.js ndc-staging-owner nt09.js && node api.js "Test User 1" nt09b.js
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', TU1 = '876ce871-2b02-4854-89a7-68050391c62b';
const MOD = { task: 'd120a6c2-2596-4254-968b-a1bcd3a000bf', call: 'f7e488b5-0232-42fd-811c-1f24356af653', event: '6fb19115-9356-40f0-b064-840d8f1fad93' };
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const u = Math.random().toString(36).slice(2, 6); const R = { u };
const rules = ((await api('GET', '/desk/notification-rules/departments/' + A)).j?.data?.rules || []).filter(x => /activity/.test(x.key)).map(x => x.key + '=' + x.is_enabled); R.rules = rules;
const t = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO NT09' + u), f('description', 'QA AO NT09' + u), f('department', A), f('status', 'Open'), f('priority', 'high')] });
R.ticket = t.j?.data?.id;
const soon = new Date(Date.now() + 3 * 3600000).toISOString(), later = new Date(Date.now() + 4 * 3600000).toISOString();
const ct = await api('POST', '/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records', { data: [f('last_name', 'QA AO NT09 ' + u)] }); R.contact = ct.j?.data?.id;
const link = [f('ticket_id', R.ticket), f('related_to', R.ticket), f('owner', TU1), f('department', A)];
const body = {
  task: [f('subject', 'QA AO NT09task' + u), f('due_date', soon), f('status', 'Not Started'), f('priority', 'normal'), ...link],
  call: [f('subject', 'QA AO NT09call' + u), f('call_start_time', soon), f('call_status', 'scheduled'), f('call_type', 'outbound'), f('contact_id', R.contact), ...link],
  event: [f('title', 'QA AO NT09event' + u), f('from_time', soon), f('to_time', later), f('status', 'scheduled'), f('contact_id', R.contact), ...link]
};
R.on = []; for (const k of ['agent.activity_assigned', 'agent.activity_completed']) R.on.push(k + ' ' + (await api('PUT', '/desk/notification-rules/departments/' + A + '/rules/' + k, { is_enabled: true, template_id: null })).s); await sleep(70000);
R.made = {};
for (const k of Object.keys(body)) { const r = await api('POST', '/modules/' + MOD[k] + '/records', { data: body[k] }); R.made[k] = { s: r.s, id: r.j?.data?.id, err: r.s >= 300 ? r.t.slice(0, 200) : undefined }; }
await sleep(20000);
// complete each, as the owner (someone other than Test User 1)
const done = { task: [f('status', 'Completed')], call: [f('call_status', 'completed')], event: [f('status', 'completed')] };
R.completed = {};
for (const k of Object.keys(R.made)) if (R.made[k].id) { const r = await api('PATCH', '/modules/' + MOD[k] + '/records/' + R.made[k].id, { data: done[k] }); R.completed[k] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); }
await sleep(20000); R.off = []; for (const k of ['agent.activity_assigned', 'agent.activity_completed']) R.off.push(k + ' ' + (await api('PUT', '/desk/notification-rules/departments/' + A + '/rules/' + k, { is_enabled: false, template_id: null })).s);
fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad/nt09.json', JSON.stringify(R));
return R;
