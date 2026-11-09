// SL-15, SL-16, SL-20, SL-53, SL-65 as owner (business hours need the owner). Run: node api.js ndc-staging-owner sl-bh.js
// Creates QA AO business-hours sets, a holiday list, policies and tickets in QA AO Dept A, records results, then removes everything it made.
const DEPT = '93949fbd-f9df-4e2e-ae45-00b8dc38385b', M = '88e8ea44-1658-4df3-9930-d0902b91073d', BH = '/iam/tenant/business-hours/profiles';
const uid = () => Math.random().toString(36).slice(2, 7);
const made = []; const R = {};
const ok = (r, what) => { if (!r || r.s >= 300) throw new Error(what + ' ' + (r && r.s) + ' ' + (r && r.t.slice(0, 300))); return r; };
const f = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const trig = { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null };
async function hours(name, close) {
  const r = ok(await api('POST', BH, { name: 'QA AO BH ' + name, preset: 'custom', days_active: ['sun', 'mon', 'tue', 'wed', 'thu'], timing_mode: 'same', hours: { open: '09:00', close: close || '17:00' }, hours_per_day: null, week_starts_on: 'sun', time_zone: 'Africa/Cairo' }), 'hours');
  made.push(['bh', r.j.data.id]); return r.j.data.id;
}
async function policy(tag, bh, respMin, resMin, esc, onBh) {
  const t = { name: 't ' + tag, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: tag }], pattern: null }, response: { value: respMin, unit: 'minutes' }, resolution: { value: resMin, unit: 'minutes' }, calendar_mode: 'business', business_hours_id: bh, first_response_only: true, escalate_on_business_hours: !!onBh, escalations: esc || { response: [], resolution: [] } };
  const r = ok(await api('POST', '/desk/sla/policies', { department_id: DEPT, name: 'QA AO ' + tag, description: null, is_active: true, triggers: trig, execute_only_with_account: false, resolution_from_created: false, targets: [t] }), 'policy');
  made.push(['policy', r.j.data.id]); return r.j.data.id;
}
async function ticket(tag) {
  const r = ok(await api('POST', '/modules/' + M + '/records', { data: [f('subject', 'QA AO ' + tag), f('department', DEPT), f('status', 'Open'), f('priority', 'high')] }), 'ticket');
  made.push(['ticket', r.j.data.id]); return r.j.data.id;
}
async function sla(id) { for (let i = 0; i < 20; i++) { const r = await api('GET', '/desk/tickets/' + id + '/sla'); if (r.j && r.j.data && r.j.data.state === 'applied') return r.j.data; await sleep(2000); } return (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data; }
const ob = (s, k) => (s?.obligations || []).find(o => o.kind === k) || {};
// Expected: add `min` open minutes (Sun–Thu 09:00–close Cairo, minus holidays) to `from`.
function addOpen(from, min, close = 17, hol = []) {
  let t = new Date(from.getTime()); let left = min;
  const cairo = d => new Date(d.getTime() + 2 * 3600000); // Cairo is UTC+2 in November
  for (let guard = 0; guard < 20000 && left > 0; guard++) {
    const c = cairo(t); const day = c.getUTCDay(); const ymd = c.toISOString().slice(0, 10); const h = c.getUTCHours() + c.getUTCMinutes() / 60;
    const open = day >= 0 && day <= 4 && !hol.includes(ymd) && h >= 9 && h < close;
    if (open) left--;
    t = new Date(t.getTime() + 60000);
  }
  return t;
}
const diffMin = (a, b) => Math.round((new Date(a) - new Date(b)) / 60000);
try {
  // SL-15: business-hours due maths across the close of day
  { const tag = 'SL15' + uid(); const bh = await hours(tag); await policy(tag, bh, 180, 600); const start = new Date(); const id = await ticket(tag); const s = await sla(id);
    const exp = addOpen(start, 180); const got = ob(s, 'first_response').due_at; const expRes = addOpen(start, 600); const gotRes = ob(s, 'resolution').due_at;
    R['SL-15'] = { created: start.toISOString(), response_due: got, expected: exp.toISOString(), off_min: diffMin(got, exp), resolution_due: gotRes, expected_res: expRes.toISOString(), off_res_min: diffMin(gotRes, expRes), pass: Math.abs(diffMin(got, exp)) <= 2 && Math.abs(diffMin(gotRes, expRes)) <= 2 }; }
  // SL-16: holiday tomorrow is skipped (NDC-2774 check too)
  { const tag = 'SL16' + uid(); const bh = await hours(tag);
    const tomorrow = new Date(Date.now() + 2 * 3600000 + 86400000).toISOString().slice(0, 10);
    const hl = ok(await api('POST', '/desk/holiday-lists', { name: 'QA AO HOL ' + tag, description: null, is_active: true, category: 'year_specific' }), 'holiday list'); const hlId = hl.j.data.id; made.push(['hol', hlId]);
    R.holidayAdd = (await api('POST', '/desk/holiday-lists/' + hlId + '/holidays', { name: 'QA AO ' + tag, start_date: tomorrow, end_date: tomorrow, occurrence: 'year_specific' })).s;
    let link = await api('PUT', '/desk/business-hours/' + bh + '/holiday-lists', { holiday_list_ids: [hlId] }); if (link.s >= 300) link = await api('PUT', '/desk/business-hours/' + bh + '/holiday-list', { holiday_list_id: hlId }); R.linkBody = link.t.slice(0, 200); R.linkedNow = (await api('GET', '/desk/business-hours/' + bh + '/holiday-lists')).t.slice(0, 200);
    R.holidayLink = link.s;
    await policy(tag, bh, 600, 1200); const start = new Date(); const id = await ticket(tag); const s = await sla(id);
    const exp = addOpen(start, 600, 17, [tomorrow]); const noHol = addOpen(start, 600); const got = ob(s, 'first_response').due_at;
    R['SL-16'] = { holiday: tomorrow, response_due: got, expected_skipping_holiday: exp.toISOString(), if_holiday_ignored: noHol.toISOString(), off_min: diffMin(got, exp), pass: Math.abs(diffMin(got, exp)) <= 2 }; }
  // SL-20: escalation offset counted in business time
  { const tag = 'SL20' + uid(); const bh = await hours(tag);
    const lvl = { timing: 'after', offset: { value: 120, unit: 'minutes' }, recipients: [{ kind: 'ticket_owner' }], template_ref: null, actions: { assign_owner: null, assign_team: null, set_priority: null } };
    await policy(tag, bh, 60, 600, { response: [lvl], resolution: [] }, true); const start = new Date(); const id = await ticket(tag); const s = await sla(id);
    const fr = ob(s, 'first_response');
    R['SL-20'] = { response_due: fr.due_at, obligation_keys: Object.keys(fr), escalation_fields: Object.fromEntries(Object.entries(fr).filter(([k]) => /escal|level|next|fire/i.test(k))), expected_level1_at: addOpen(new Date(fr.due_at), 120).toISOString(), note: 'record only: shows whether the next escalation time is exposed' }; }
  // SL-53: deleting a business-hours set used by a target (NDC-2216)
  { const tag = 'SL53' + uid(); const bh = await hours(tag); await policy(tag, bh, 60, 600); const d = await api('DELETE', BH + '/' + bh);
    if (d.s < 300) made.splice(made.findIndex(x => x[1] === bh), 1);
    R['SL-53'] = { delete_status: d.s, body: d.t.slice(0, 300), pass: d.s >= 400 && d.s < 500 }; }
  // SL-65: changing the hours while a ticket runs
  { const tag = 'SL65' + uid(); const bh = await hours(tag); await policy(tag, bh, 180, 600); const id = await ticket(tag); const a = await sla(id);
    const before = ob(a, 'first_response').due_at;
    const cur = ok(await api('GET', BH + '/' + bh), 'read hours').j.data;
    const upd = await api('PUT', BH + '/' + bh, { ...cur, hours: { open: '09:00', close: '18:00' } });
    await sleep(20000); const b = (await api('GET', '/desk/tickets/' + id + '/sla')).j?.data;
    R['SL-65'] = { update_status: upd.s, before, after: ob(b, 'first_response').due_at, changed: before !== ob(b, 'first_response').due_at, note: 'record: Zoho does not recalculate running tickets (check)' }; }
} catch (e) { R.error = e.message; }
// cleanup: tickets, policies, then holiday lists and hours
const order = ['ticket', 'policy', 'hol', 'bh']; R.cleanup = [];
for (const k of order) for (const [kind, id] of made.filter(x => x[0] === k)) {
  const p = kind === 'ticket' ? '/modules/' + M + '/records/' + id : kind === 'policy' ? '/desk/sla/policies/' + id : kind === 'hol' ? '/desk/holiday-lists/' + id : BH + '/' + id;
  const d = await api('DELETE', p); if (d.s >= 300 && d.s !== 404) R.cleanup.push(kind + ' ' + id + ' ' + d.s);
}
return R;
