// SL-51, SL-58, NT-30 (owner; user approved suspending "ZZ Sweep Tavi Probe" and reactivating it after, 9 Nov 2026).
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', ZZ = '5b3f7466-2fa7-4115-8ee0-f97c52cbb2c1', SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e';
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const u = Math.random().toString(36).slice(2, 6); const R = { u }; const made = [];
const user = async () => { const r = await api('GET', '/iam/users/' + ZZ); return r.j?.data?.status || r.s + ' ' + r.t.slice(0, 120); };
R.statusBefore = await user();
try {
  const tag = 'SL58' + u;
  const lvl = { timing: 'at', offset: null, recipients: [{ kind: 'agent', id: ZZ }, { kind: 'agent', id: SAMY }], template_ref: null, actions: { assign_owner: ZZ, assign_team: null, set_priority: null } };
  const p = await api('POST', '/desk/sla/policies', { department_id: A, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + tag, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: 1, unit: 'minutes' }, resolution: { value: 2, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [lvl], resolution: [] } }] });
  R.policy = p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 250) : ''); if (p.j?.data?.id) made.push(['policy', p.j.data.id]);
  // SL-51: suspend the agent who is a recipient and a reassign target
  const sus = await api('PATCH', '/iam/users/' + ZZ, { status: 'Suspended' }); R.suspend = sus.s + ' ' + sus.t.slice(0, 300); R.statusSuspended = await user();
  R.policyAfterSuspend = p.j?.data?.id ? (await api('GET', '/desk/sla/policies/' + p.j.data.id)).t.match(/"(recipients|assign_owner|warnings?|invalid[a-z_]*)":[^\]]{0,160}/g) : null;
  // SL-58: escalation fires with the suspended agent
  const t = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high')] }); made.push(['ticket', t.j.data.id]);
  await sleep(150000);
  const s = (await api('GET', '/desk/tickets/' + t.j.data.id + '/sla')).j?.data; const fr = (s?.obligations || []).find(o => o.kind === 'first_response') || {};
  const feed = (await api('GET', '/desk/tickets/' + t.j.data.id + '/activity')).j;
  R['SL-58'] = { level: fr.escalation_level_reached, events: JSON.stringify(feed).match(/"action":"sla\.escalation[^}]*\}[^}]*\}/g)?.map(x => x.slice(0, 600)) };
  const rec = (await api('GET', '/modules/' + M + '/records/' + t.j.data.id)).j?.data?.data || []; R['SL-58'].ownerNow = rec.find(d => d.field === 'owner' || d.field === 'owner_id')?.value?.value;
  // NT-30: assign a ticket to the suspended agent
  const t2 = await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO NT30' + u), f('description', 'QA AO NT30' + u), f('department', A), f('status', 'Open'), f('priority', 'high')] }); made.push(['ticket', t2.j.data.id]);
  const as = await api('POST', '/desk/tickets/' + t2.j.data.id + '/assign', { owner_id: ZZ, team_id: null }); R['NT-30'] = { assign: as.s + ' ' + as.t.slice(0, 250) };
} catch (e) { R.error = e.message; }
finally {
  const re = await api('PATCH', '/iam/users/' + ZZ, { status: 'Active' }); R.reactivate = re.s + ' ' + re.t.slice(0, 150); R.statusAfter = await user();
}
R.cleanup = [];
for (const k of ['ticket', 'policy']) for (const [kind, id] of made.filter(x => x[0] === k)) { const d = await api('DELETE', kind === 'ticket' ? '/modules/' + M + '/records/' + id : '/desk/sla/policies/' + id); if (d.s >= 300 && d.s !== 404) R.cleanup.push(kind + ' ' + d.s); }
return R;
