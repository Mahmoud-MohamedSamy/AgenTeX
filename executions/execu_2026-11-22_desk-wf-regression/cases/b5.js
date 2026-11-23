// Batch 5 (run 2): business hours — TD-06, TD-07, CF-10 (+TC-08 outside). Tenant hours are 24/7; switched to custom 01:00-23:00 Cairo
// for a few minutes (now ~23:15 Cairo = closed) and a QA holiday list for today linked to the default profile; both restored at the end.
const out = {}; const R = {}; const TK = {};
const mark = FU({ qa_ndc_agency_code: 'WF' });
const CR = { kind: 'RecordCreated' };
const DT = (sec, mode) => ({ kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: sec, offsetMode: mode || 'wall_clock' });
const rule = async (k, trig, actions, o = {}) => { const r = await mkRule(k, trig, actions || [mark], o); R[k] = r.id; if (!r.id) out[k + ' save'] = r.s + ' ' + r.err; return r; };
const tk = async (k, tag, vals, suf) => { const t = await mkTicket(tag, { department: DEPT2, ...(vals || {}) }, suf); TK[k] = t.id; return t.id; };
const at = s => new Date(Date.now() + s * 1000).toISOString();
const ex1 = async (k, r) => (await execs(TK[k], R[r])).map(e => outcome(e) + (e.scheduledFor || e.scheduledAt || e.runAt || e.dueAt ? '@' + (e.scheduledFor || e.scheduledAt || e.runAt || e.dueAt) : ''));
const orig = (await api('GET', '/desk/business-hours')).j?.data; fs.writeFileSync(RUN + '/out/bh-orig.json', JSON.stringify(orig, null, 1));
ledger('business hours saved out/bh-orig.json preset=' + orig.preset);
// rules
await rule('TD06b', DT(-60, 'business_hours')); await rule('TD06w', DT(-60));
await rule('TD06days', DT(-86400, 'business_hours'));
await rule('CF10in', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('business_hours')) });
await rule('CF10out', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('outside_business_hours')) });
await rule('CF10hol', CR, [mark], { criteria: cmp('executionTime', 'Equal', S('holiday')) });
out.TD06days = R.TD06days ? 'saved (days in business mode accepted by API)' : out['TD06days save'];
// phase 1: 24/7 (= TD-07 "no business hours": counting falls back to wall clock)
await tk('TD07b', 'TD06b', { due_date: at(150) }, 'p1'); await tk('TD07w', 'TD06w', { due_date: at(150) }, 'p1');
await tk('CF10a', 'CF10in', {}, 'p1'); await tk('CF10b', 'CF10out', {}, 'p1'); await tk('CF10c', 'CF10hol', {}, 'p1');
await sleep(20000);
out.p1 = { in: await fired(TK.CF10a, R.CF10in), out: await fired(TK.CF10b, R.CF10out), hol: await fired(TK.CF10c, R.CF10hol) };
// phase 2: custom 01:00-23:00 (closed now)
const set = await api('PUT', '/iam/tenant/business-hours', { preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: 'same', hours: { open: '01:00', close: '23:00' }, hours_per_day: null, week_starts_on: orig.week_starts_on || 'mon', time_zone: orig.time_zone || 'Africa/Cairo' });
out.set = set.s + ' ' + (set.s >= 300 ? set.t.slice(0, 200) : ''); ledger('business hours set custom 01:00-23:00 ' + set.s);
try {
  const now = (await api('GET', '/desk/business-hours')).j?.data; out.nowOpen = now && now.is_open_now + ' next ' + now.next_opens_at;
  await tk('TD06b', 'TD06b', { due_date: at(150) }, 'p2'); await tk('TD06w', 'TD06w', { due_date: at(150) }, 'p2');
  await tk('CF10d', 'CF10in', {}, 'p2'); await tk('CF10e', 'CF10out', {}, 'p2');
  await sleep(20000);
  out.p2 = { in: await fired(TK.CF10d, R.CF10in), out: await fired(TK.CF10e, R.CF10out), pendB: await ex1('TD06b', 'TD06b'), pendW: await ex1('TD06w', 'TD06w') };
  // holiday today on the default profile (back to 24/7 first so only the holiday decides)
  await api('PUT', '/iam/tenant/business-hours', { preset: '24_7', days_active: orig.days_active, timing_mode: null, hours: null, hours_per_day: null, week_starts_on: orig.week_starts_on, time_zone: orig.time_zone });
  const today = new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10);
  const prof = arr((await api('GET', '/iam/tenant/business-hours/profiles')).j?.data).find(p => p.is_default);
  const hl = await api('POST', '/desk/holiday-lists', { name: 'QA WF HOL today', description: null, is_active: true, category: 'year_specific', business_hour_profile_id: prof && prof.id, detached: false, holidays: [{ name: 'QA WF today', start_date: today, end_date: null, occurrence: 'year_specific' }] });
  const HL = hl.j?.data?.id || hl.j?.data?.list?.id; out.hol = hl.s + ' ' + (HL || hl.t.slice(0, 250)); if (HL) ledger(`holiday list "QA WF HOL today" ${HL} (linked to default profile)`);
  if (HL) { await tk('CF10f', 'CF10hol', {}, 'p3'); await tk('CF10g', 'CF10in', {}, 'p3'); await sleep(20000); out.p3 = { hol: await fired(TK.CF10f, R.CF10hol), in: await fired(TK.CF10g, R.CF10in) }; const d = await api('DELETE', '/desk/holiday-lists/' + HL); out.holDel = d.s; ledger('holiday list deleted ' + d.s); }
} finally {
  const back = await api('PUT', '/iam/tenant/business-hours', { preset: orig.preset, days_active: orig.days_active, timing_mode: orig.timing_mode, hours: orig.hours, hours_per_day: orig.hours_per_day, week_starts_on: orig.week_starts_on, time_zone: orig.time_zone, ...(orig.slots ? { slots: orig.slots } : {}) });
  const fin = (await api('GET', '/desk/business-hours')).j?.data; out.restored = back.s + ' → ' + fin.preset + ' ' + JSON.stringify(fin.hours); ledger('business hours restored ' + out.restored);
}
await sleep(120000);
out.final = { p1b: await fired(TK.TD07b, R.TD06b), p1w: await fired(TK.TD07w, R.TD06w), p2b: await ex1('TD06b', 'TD06b'), p2w: await fired(TK.TD06w, R.TD06w) };
out.R = R; out.TK = TK;
fs.writeFileSync(RUN + '/out/b5.json', JSON.stringify(out, null, 1));
return out;
