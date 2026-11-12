// J5 + P11 (user OK 12 Nov: change and revert). Default business hours -> 09:00-17:00 every day (Cairo); original saved to a4/bh-orig.json.
const PID = 'a0302234-3896-41de-9b85-443a555a7131', BH = '/iam/tenant/business-hours/profiles/' + PID;
const R = {};
const orig = (await api('GET', BH)).j?.data; fs.writeFileSync('../a4/bh-orig.json', JSON.stringify(orig, null, 1));
const body = { name: orig.name, preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'], timing_mode: 'same', hours: { open: '09:00', close: '17:00' }, hours_per_day: null, week_starts_on: orig.week_starts_on || 'mon', time_zone: 'Africa/Cairo' };
let u = await api('PUT', BH, body); if (u.s >= 300) u = await api('PATCH', BH, body); R.update = u.s + ' ' + (u.s >= 300 ? u.t.slice(0, 200) : '');
const now = (await api('GET', '/desk/business-hours')).j?.data; R.nowPreset = now.preset + ' open=' + now.is_open_now + ' hours=' + JSON.stringify(now.hours);
// P11: execution-time conditions
const C = (field, op, value) => ({ kind: 'Comparison', field, operator: op, negate: false, value });
const mark = t => [{ type: 'AddTicketComment', commentBody: `QA AO WF ${t} fired`, commentPublic: false }];
const p11 = {};
for (const [k, v] of [['P11in', 'business_hours'], ['P11out', 'outside_business_hours'], ['P11hol', 'holiday']]) p11[k] = await mkRule('BH ' + k, { kind: 'RecordCreated' }, mark(k), { criteria: C('executionTime', 'Equal', { kind: 'string', stringValue: v }) });
R.p11rules = Object.fromEntries(Object.entries(p11).map(([k, r]) => [k, r.s + (r.err || '')]));
const tp = await mkTicket('BH P11'); await sleep(15000);
const ep = await execs(tp.id); R.p11 = Object.fromEntries(Object.entries(p11).map(([k, r]) => [k, (ep.find(e => e.rule === r.id) || {}).outcome || 'no row']));
// J5: 2 hours before due_date counting business hours; control in wall-clock
const cairo = new Date(Date.now() + 2 * 3600e3); const minsNow = cairo.getUTCHours() * 60 + cairo.getUTCMinutes();
const left = 17 * 60 - minsNow - 7; R.cairoNow = cairo.toISOString().slice(11, 16); R.minutesLeftBeforeFire = left;
const tomorrow9 = new Date(Date.UTC(cairo.getUTCFullYear(), cairo.getUTCMonth(), cairo.getUTCDate() + 1, 7, 0));
const due = new Date(tomorrow9.getTime() + (120 - left) * 60e3); R.dueUtc = due.toISOString(); R.expectBusinessFireUtc = new Date(Date.now() + 7 * 60e3).toISOString(); R.expectWallFireUtc = new Date(due.getTime() - 7200e3).toISOString();
const jb = await mkRule('BH J5bh', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -7200, offsetMode: 'business_hours' }, mark('J5bh'));
const jw = await mkRule('BH J5wall', { kind: 'DateFieldRelative', dateFieldName: 'due_date', offsetSeconds: -7200, offsetMode: 'wall_clock' }, mark('J5wall'));
R.j5rules = [jb.s + (jb.err || ''), jw.s + (jw.err || '')];
const tj = await mkTicket('BH J5bh', { due_date: due.toISOString() }); const tj2 = await mkTicket('BH J5wall', { due_date: due.toISOString() });
fs.writeFileSync('../a4/bh1-out.json', JSON.stringify({ R, jb: jb.id, jw: jw.id, tj: tj.id, tj2: tj2.id }, null, 1));
log(JSON.stringify(R));
