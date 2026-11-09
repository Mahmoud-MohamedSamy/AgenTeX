// SL-22 (template per escalation level, default template) and SL-57 (template deleted after it is chosen). Run: node api.js ndc-staging-owner sl-mail.js
// Escalations go to agent "Mahmoud Samy" (the user's Gmail), who is in QA AO Dept A. Records the feed; mail is checked in Gmail by tag.
const A = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e';
const u = Math.random().toString(36).slice(2, 6); const R = { tags: {} }; const made = [];
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const ok = (r, w) => { if (!r || r.s >= 300) throw new Error(w + ' ' + (r && r.s) + ' ' + (r && r.t.slice(0, 300))); return r; };
const tpl = async (name, subj) => { const r = ok(await api('POST', '/desk/email-templates', { name, module: 'desk_tickets', notification_type: 'agent', use_case: 'ticket.sla_escalation', subject: subj, body_html: '<p>QA AO body: [{{ticket.subject}}] obligation [{{sla.obligation}}] level [{{sla.level}}] due [{{sla.due_at}}] policy [{{sla.policy}}] link [{{ticket.agent_link}}]</p>' }), 'template ' + name); made.push(['tpl', r.j.data.id]); return r.j.data.id; };
const lvl = (timing, min, ref) => ({ timing, offset: timing === 'at' ? null : { value: min, unit: 'minutes' }, recipients: [{ kind: 'agent', id: SAMY }], template_ref: ref, actions: { assign_owner: null, assign_team: null, set_priority: null } });
const policy = async (tag, levels) => { const r = ok(await api('POST', '/desk/sla/policies', { department_id: A, name: 'QA AO ' + tag, description: null, is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: false, targets: [{ name: 't ' + tag, criteria: { conditions: [{ field_key: 'description', operator: 'contains', value: tag }], pattern: null }, response: { value: 1, unit: 'minutes' }, resolution: { value: 2, unit: 'hours' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: levels, resolution: [] } }] }), 'policy ' + tag); made.push(['policy', r.j.data.id]); return r.j.data.id; };
const ticket = async tag => { const r = ok(await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('description', 'QA AO ' + tag), f('department', A), f('status', 'Open'), f('priority', 'high')] }), 'ticket'); made.push(['ticket', r.j.data.id]); return r.j.data.id; };
try {
  const t22 = 'SL22' + u, t57 = 'SL57' + u;
  const tplA = await tpl('QA AO Tpl ' + t22, 'QA AO ' + t22 + ' custom: #{{ticket.number}} level {{sla.level}} ({{sla.timing}})');
  R.policy22 = (await policy(t22, [lvl('at', null, tplA), lvl('after', 1, null)]));
  const tplB = await tpl('QA AO Tpl ' + t57, 'QA AO ' + t57 + ' custom (deleted later)');
  R.policy57 = await policy(t57, [lvl('at', null, tplB)]);
  const del = await api('DELETE', '/desk/email-templates/' + tplB); R.deleteTemplateInUse = del.s + ' ' + del.t.slice(0, 250);
  if (del.s < 300) made.splice(made.findIndex(x => x[1] === tplB), 1);
  R.policy57AfterDelete = (await api('GET', '/desk/sla/policies/' + R.policy57)).t.match(/"template_ref":[^,}]*/g);
  const k22 = await ticket(t22), k57 = await ticket(t57); R.tags = { SL22: t22, SL57: t57 };
  await sleep(240000);
  for (const [k, id] of [['SL-22', k22], ['SL-57', k57]]) {
    const s = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data; const fr = (s?.obligations || []).find(o => o.kind === 'first_response') || {};
    const feed = (await api('GET', '/desk/tickets/' + id + '/activity')).t;
    R[k] = { level: fr.escalation_level_reached, state: fr.state, sla_events: (feed.match(/"action":"sla\.[a-z_.]+"/g) || []).join(' '), detail: (feed.match(/"(skipped|recipients|delivered|sent|template)[^"]*":[^\]}]{0,200}/g) || []).slice(0, 6) };
  }
} catch (e) { R.error = e.message; }
R.cleanup = [];
for (const k of ['ticket', 'policy', 'tpl']) for (const [kind, id] of made.filter(x => x[0] === k)) { const p = kind === 'ticket' ? '/modules/' + M + '/records/' + id : kind === 'policy' ? '/desk/sla/policies/' + id : '/desk/email-templates/' + id; const d = await api('DELETE', p); if (d.s >= 300 && d.s !== 404) R.cleanup.push(kind + ' ' + id + ' ' + d.s); }
return R;
