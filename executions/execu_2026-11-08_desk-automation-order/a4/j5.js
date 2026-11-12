// J5 (user: "do what is right"): hours 01:00-23:00 (fits Shift-01), offset 6 business hours, due after 01:00 so the 23:00-01:00 closed gap sits inside the window.
// Expect: business rule fires at F (~now+12m); wall-clock rule fires 2h later. Hours reverted to 24_7 right after the business rule fires.
const B = { preset: 'custom', days_active: ['mon','tue','wed','thu','fri','sat','sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' };
const B247 = { preset: '24_7', days_active: B.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: 'mon', time_zone: 'Africa/Cairo' };
const waitFor = async p => { for (let i = 0; i < 30; i++) { const d = (await api('GET', '/desk/business-hours')).j?.data; if (d && d.preset === p) return i * 5 + 's ' + d.preset + ' open=' + d.is_open_now; await sleep(5000); } return 'timeout'; };
const mark = t => [{ type: 'AddTicketComment', commentBody: `QA AO WF ${t} fired`, commentPublic: false }];
const R = {}; const OFF = 6 * 3600;
try {
  R.set = (await api('PUT', '/iam/tenant/business-hours', B)).s; R.seen = await waitFor('custom');
  const now = Date.now(); const close = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), new Date(now).getUTCDate(), 21, 0);
  const F = now + 12 * 60e3; const due = new Date(close + 2 * 3600e3 + (OFF * 1000 - (close - F)));
  R.dueUtc = due.toISOString(); R.expectBusinessUtc = new Date(F).toISOString(); R.expectWallUtc = new Date(due - OFF * 1000).toISOString();
  const jb = await mkRule('BH J5 business', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -OFF, offsetMode: 'business_hours' }, mark('J5 business'));
  const jw = await mkRule('BH J5 wall', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -OFF, offsetMode: 'wall_clock' }, mark('J5 wall'));
  R.rules = [jb.s + (jb.err || ''), jw.s + (jw.err || '')];
  const t = await mkTicket('BH J5', { due_date: due.toISOString() }, 'business hours 6h');
  fs.writeFileSync('../a4/j5-out.json', JSON.stringify({ jb: jb.id, jw: jw.id, t: t.id, ...R }, null, 1));
  for (let i = 0; i < 60; i++) { await sleep(30000); const ex = await execs(t.id); const b = ex.filter(e => e.rule === jb.id), w = ex.filter(e => e.rule === jw.id);
    if (b.some(e => e.outcome === 'Fired')) { R.businessFiredSeenUtc = new Date().toISOString(); R.business = b.map(e => e.outcome + ' ' + e.actions); R.wallAtThatTime = w.map(e => e.outcome); break; } }
} finally {
  R.back = (await api('PUT', '/iam/tenant/business-hours', B247)).s; R.seenBack = await waitFor('24_7');
  fs.writeFileSync('../a4/j5-out.json', JSON.stringify({ ...JSON.parse(fs.readFileSync('../a4/j5-out.json', 'utf8') || '{}'), ...R }, null, 1));
}
log(JSON.stringify(R));
