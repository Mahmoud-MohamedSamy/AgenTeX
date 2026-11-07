// NDC-2774 r12: default business hours 24x7 -> Mon-Fri 24 h (approved, restored in finally); blueprint state 7200 business min + SLA 120 business h in QA RT11 Dept A.
// Tickets at +0.6 s and +6 s after the change (dev's runs 1 and 3) and a control at ~+60 s. Expected due = 120 working hours (weekend skipped).
const fs = require('fs'); const o = { log: [] }; const A = X.ids.DEPT_A; const P = 'QA RT12 2774 ';
const tz = 'Africa/Cairo'; const fmt = d => d ? new Date(d.at || d).toLocaleString('en-GB', { timeZone: tz, weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null;
const addWork = (start, hours) => { let t = new Date(start).getTime(), left = hours * 3600e3; while (left > 0) { const d = new Date(t); const wd = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(d); const step = Math.min(left, 60e3); if (wd !== 'Sat' && wd !== 'Sun') left -= step; t += step; } return new Date(t); };
let base, prof, sla, bp; const T = [];
try {
  const ps = await api('o', 'GET', 'desk:/iam/tenant/business-hours/profiles'); base = arr(ps.j?.data).find(p => p.is_default); prof = base.id;
  fs.writeFileSync('../2774-bh-backup.json', JSON.stringify(base)); o.base = { preset: base.preset, days: base.days_active, tz: base.time_zone };
  const pol = { department_id: A, name: P + 'SLA', description: 'QA retest r12 - safe to delete', is_active: true, triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null }, execute_only_with_account: false, resolution_from_created: true,
    targets: [{ name: 'QA target', sort_order: 0, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: P.trim() }], pattern: null }, response: { value: 1, unit: 'hours' }, resolution: { value: 120, unit: 'hours' }, calendar_mode: 'business', business_hours_id: null, first_response_only: true, escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }], accounts: [], support_plans: [] };
  const pr = await api('o', 'POST', 'desk:/desk/sla/policies', pol); sla = pr.j?.data?.id; o.sla = X.err(pr); if (sla) ledger('NDC-2774: SLA policy "QA RT12 2774 SLA" ' + sla + ' (Dept A)');
  const def = X.bp('2774 bp', { marker: P.trim() }).state('Open', { slaMinutes: 7200, slaPreExpiryMinutes: 1440 }).terminal('Closed').tr('end', 'Open', 'Closed').build();
  const b = await X.createBp(def, true); bp = b.j?.data?.id; o.bp = X.err(b);
  await sleep(5000);
  const t0 = Date.now();
  const p = await api('o', 'PUT', `desk:/iam/tenant/business-hours/profiles/${prof}`, { name: base.name, preset: '24_5', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '00:00', close: '23:59' }, hours_per_day: null, week_starts_on: base.week_starts_on, time_zone: base.time_zone });
  o.setHours = p.s; ledger('NDC-2774: default business hours 24x7 -> Mon-Fri 24h at ' + new Date(t0).toISOString() + ' (backup ../2774-bh-backup.json)');
  const mk = async (sfx, at) => { while (Date.now() - t0 < at) await sleep(50); const c = Date.now(); const r = await X.ticket(P + sfx); return { id: r.j?.data?.id, createdAt: c, offset: ((c - t0) / 1000).toFixed(1) }; };
  T.push(await mk('run1 +0.6s', 600)); T.push(await mk('run3 +6s', 6000)); T.push(await mk('control +60s', 60000));
  for (const t of T) {
    let s = null; for (let i = 0; i < 18; i++) { s = await X.state(t.id); if (s && s.escalation_due_at && s.escalation_due_at.provisional === false) break; await sleep(5000); }
    const sl = await api('o', 'GET', `desk:/desk/tickets/${t.id}/sla`); const ob = (sl.j?.data?.obligations || []).map(x => x.kind + ' ' + fmt(x.due_at));
    t.expected = fmt(addWork(t.createdAt, 120)); t.calendar = fmt(new Date(t.createdAt + 120 * 3600e3));
    t.blueprintDue = fmt(s && s.escalation_due_at); t.provisional = s && s.escalation_due_at && s.escalation_due_at.provisional; t.sla = ob; t.created = fmt(t.createdAt);
  }
  o.tickets = T;
} catch (e) { o.error = String(e.stack || e).slice(0, 500); }
finally {
  if (base) { const r = await api('o', 'PUT', `desk:/iam/tenant/business-hours/profiles/${prof}`, { name: base.name, preset: base.preset, days_active: base.days_active, timing_mode: base.timing_mode, hours: base.hours, hours_per_day: base.hours_per_day, week_starts_on: base.week_starts_on, time_zone: base.time_zone }); const a = arr((await api('o', 'GET', 'desk:/iam/tenant/business-hours/profiles')).j?.data).find(x => x.is_default);
    o.restore = r.s + ' equal=' + ['preset', 'days_active', 'timing_mode', 'hours', 'hours_per_day', 'week_starts_on', 'time_zone'].every(k => JSON.stringify(a[k]) === JSON.stringify(base[k])); ledger('NDC-2774: business hours restored ' + o.restore); }
}
return o;
