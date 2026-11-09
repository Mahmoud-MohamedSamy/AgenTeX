const C = []; const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 120)) : undefined });
const o = {}; const BH = '/iam/tenant/business-hours/profiles'; const HL = '/desk/holiday-lists';
const base = { preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '09:00', close: '17:00' }, hours_per_day: null, week_starts_on: 'sun', time_zone: 'Africa/Cairo' };
let r = await api('POST', BH, { name: 'QA GL BH', ...base }); const bhId = r.j && r.j.data && r.j.data.id; if (bhId) C.push({ k: 'bh', id: bhId });
o.W1_09 = { ...S(r), id: bhId, d: JSON.stringify(r.j && r.j.data).slice(0, 250) };
// multi-block (QA profile only)
const mb = { ...base, timing_mode: 'different', hours: null, hours_per_day: { mon: { open: '09:00', close: '13:00' } }, slots: null, slots_per_day: { mon: [{ open: '09:00', close: '13:00' }, { open: '14:00', close: '18:00' }], tue: [{ open: '22:00', close: '02:00' }] } };
r = await api('PUT', BH + '/' + bhId, { name: 'QA GL BH', ...mb }); const g = await api('GET', BH + '/' + bhId);
o.W1_10 = { put: S(r), slots_per_day: JSON.stringify(g.j && g.j.data && g.j.data.slots_per_day), hours_per_day: JSON.stringify(g.j && g.j.data && g.j.data.hours_per_day) };
// validation on new QA profiles only
const v1 = await api('POST', BH, { name: 'QA GL BH bad', ...base, hours: { open: '17:00', close: '09:00' } });
const v2 = await api('POST', BH, { name: '', ...base });
const v3 = await api('POST', BH, { name: 'QA GL BH tz', ...base, time_zone: 'Mars/Olympus' });
for (const v of [v1, v2, v3]) if (v.j && v.j.data && v.j.data.id) C.push({ k: 'bh', id: v.j.data.id });
o.W1_11 = { endBeforeStart: S(v1), emptyName: S(v2), badTz: S(v3) };
// holidays (QA list only)
r = await api('POST', HL, { name: 'QA GL Holidays', category: 'recurring', business_hour_profile_id: null }); const hl = r.j && r.j.data && r.j.data.id; if (hl) C.push({ k: 'hl', id: hl });
const h1 = await api('POST', HL + '/' + hl + '/holidays', { name: 'QA GL Xmas', start_date: '2026-12-25', end_date: null, occurrence: null });
const hid = h1.j && h1.j.data && (h1.j.data.id || (h1.j.data.holidays && h1.j.data.holidays[0] && h1.j.data.holidays[0].id));
const h2 = await api('PUT', HL + '/' + hl + '/holidays/' + hid, { name: 'QA GL Xmas 2', start_date: '2026-12-25', end_date: '2026-12-26', occurrence: null });
const hg = await api('GET', HL + '/' + hl);
o.W1_15 = { create: S(r), add: S(h1), hid, edit: S(h2), after: JSON.stringify(hg.j && hg.j.data && hg.j.data.holidays).slice(0, 200), count: hg.j && hg.j.data && hg.j.data.holiday_count };
const n1 = await api('POST', HL + '/' + hl + '/holidays', { name: 'QA GL nodate', start_date: null });
const n2 = await api('POST', HL + '/' + hl + '/holidays', { name: 'QA GL dup', start_date: '2026-12-25', end_date: null });
const n3 = await api('POST', HL + '/' + hl + '/holidays', { name: 'x'.repeat(300), start_date: '2026-11-20', end_date: null });
o.W1_18 = { noDate: S(n1), dupDate: S(n2), longName: S(n3) };
const rm = await api('DELETE', HL + '/' + hl + '/holidays/' + hid); o.W1_15.remove = S(rm);
const asg = await api('PUT', HL + '/' + hl, { name: 'QA GL Holidays', category: 'recurring', business_hour_profile_id: bhId });
const hg2 = await api('GET', HL + '/' + hl);
o.W1_16 = { put: S(asg), listBh: hg2.j && hg2.j.data && hg2.j.data.business_hour_profile_id === bhId };
const de = await api('POST', HL + '/' + hl + '/deactivate'); const g1 = await api('GET', HL + '/' + hl); const ac = await api('POST', HL + '/' + hl + '/activate'); const g2 = await api('GET', HL + '/' + hl);
o.W1_17 = { deactivate: S(de), activeAfterDe: g1.j && g1.j.data && g1.j.data.is_active, activate: S(ac), activeAfterAc: g2.j && g2.j.data && g2.j.data.is_active, holidaysKept: g2.j && g2.j.data && g2.j.data.holiday_count };
return done({ o, C });
