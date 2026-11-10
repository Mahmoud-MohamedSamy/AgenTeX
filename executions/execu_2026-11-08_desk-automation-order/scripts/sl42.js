// SL-42: merge two tickets that each have an SLA; record what the kept ticket's SLA does. Cleans up.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } }); const u = Math.random().toString(36).slice(2, 6), tag = 'SL42' + u; const R = {};
const p = await api('POST', '/desk/sla/policies', { department_id: A, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't', criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: 60, unit: 'minutes' }, resolution: { value: 3, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }] });
const mk = async s => (await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag + s), f('description', 'QA AO ' + tag + s), f('department', A), f('status', 'Open'), f('priority', 'high')] })).j.data.id;
const a = await mk('a'); await sleep(90000); const b = await mk('b'); await sleep(8000);
const sum = async id => { const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data; return { state: s?.state, obl: (s?.obligations || []).map(o => o.kind + ':' + o.state + ' due ' + (o.due_at || '').slice(11, 19)) }; };
R.before = { master_older: await sum(a), merged_newer: await sum(b) };
const m = await api('POST', '/desk/tickets/merge', { master_ticket_id: a, source_ticket_ids: [b], cc_list_from: 'target' });
R.merge = m.s + ' ' + m.t.slice(0, 250); await sleep(8000);
R.after = { master: await sum(a), merged: await sum(b) };
const st = (await api('GET', '/modules/' + M + '/records/' + b)).j?.data; R.mergedRecord = st ? (st.data || []).filter(d => /status|merged/.test(d.field)).map(d => d.field + '=' + d.value?.value) : 'gone';
R.cleanup = [(await api('DELETE', '/modules/' + M + '/records/' + a)).s, (await api('DELETE', '/modules/' + M + '/records/' + b)).s, (await api('DELETE', '/desk/sla/policies/' + p.j.data.id)).s];
return R;
