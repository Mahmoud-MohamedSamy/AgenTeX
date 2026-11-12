// G6 / K8 / K9 — business-hours clock and holiday. Approved by the user 2 Nov 2026 (tenant-wide, restored at the end).
// Default profile → custom Mon–Fri 13:00–17:00 (Cairo) for a few minutes; QA holiday today on the default list; restored in finally.
// Usage: TV_CACHE=... node bh.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { call, sleep, QA_DEPT } = tv; const OUT = path.resolve(__dirname, '../evidence/raw'); const T = [], B = []; const R = {};
const pick = s => s && { enteredAt: s.enteredAt, slaDueAt: s.slaDueAt, warning_due_at: s.warning_due_at, escalation_due_at: s.escalation_due_at };
const cairo = iso => iso && new Date(iso).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
let base, prof, holidayId, listId;
async function bp(name, clock) {
  const r = await tv.blueprint({ name: 'QA BP ' + name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + name + ' ' },
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 }, slaClock: clock, slaMinutes: 60, slaPreExpiryMinutes: 30 }, { id: 'Closed', name: 'Closed', position: { x: 400, y: 0 }, isTerminal: true, slaClock: clock }],
    transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] }, true);
  const id = r.json && r.json.data && r.json.data.id; if (id) B.push(id); return { status: r.status, id };
}
async function enter(subject) { const t = await tv.ticket(subject); T.push(t); let s; for (let i = 0; i < 15 && !(s = await tv.stateOf(t)); i++) await sleep(1500); return pick(s); }
(async () => {
  const b0 = await call('GET', '/iam/tenant/business-hours/profiles'); base = b0.json.data.find(p => p.is_default); prof = base.id;
  fs.writeFileSync(path.join(OUT, 'bh-baseline.json'), JSON.stringify(b0.json.data, null, 2));
  const d0 = await call('GET', '/desk/business-hours'); listId = d0.json.data.profiles.find(p => p.is_default).holiday_list.id;
  R.baseline = { preset: base.preset, days: base.days_active, holidayList: listId };
  const body = { name: base.name, preset: 'custom', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '13:00', close: '17:00' }, hours_per_day: null, week_starts_on: base.week_starts_on, time_zone: base.time_zone };
  const p = await call('PUT', `/iam/tenant/business-hours/profiles/${prof}`, body);
  R.setHours = { status: p.status, err: p.status >= 300 ? p.text.slice(0, 300) : undefined }; console.log('set hours', p.status, R.setHours.err || '');
  if (p.status >= 300) return;
  const bpB = await bp('BH biz', 'business'), bpC = await bp('BH cal', 'calendar'); R.blueprints = [bpB.status, bpC.status];
  // G6 + K8: entered now (~11:00 Mon, outside 13:00–17:00)
  R.K8_business = await enter('QA BP BH biz one'); R.G6_calendar = await enter('QA BP BH cal one');
  console.log('business', cairo(R.K8_business.slaDueAt), 'warn', cairo(R.K8_business.warning_due_at && R.K8_business.warning_due_at.at || R.K8_business.warning_due_at));
  console.log('calendar', cairo(R.G6_calendar.slaDueAt));
  // K9: today becomes a holiday on the default list
  const h = await call('POST', `/desk/holiday-lists/${listId}/holidays`, { name: 'QA BP holiday', start_date: today, end_date: today });
  holidayId = h.json && h.json.data && (h.json.data.id || (h.json.data.holidays || []).find(x => x.name === 'QA BP holiday')?.id);
  R.addHoliday = { status: h.status, id: holidayId, err: h.status >= 300 ? h.text.slice(0, 300) : undefined }; console.log('holiday', h.status, R.addHoliday.err || '');
  if (h.status < 300) {
    await sleep(3000);
    const dh = await call('GET', '/desk/business-hours'); R.todaysHolidays = dh.json.data.todays_holidays; R.isOpenNow = dh.json.data.is_open_now; R.nextOpens = cairo(dh.json.data.next_opens_at);
    R.K9_business = await enter('QA BP BH biz holiday');
    console.log('holiday business', cairo(R.K9_business.slaDueAt), 'next opens', R.nextOpens, 'todays', JSON.stringify(R.todaysHolidays).slice(0, 200));
  }
  R.readable = { K8_business_due: cairo(R.K8_business.slaDueAt), G6_calendar_due: cairo(R.G6_calendar.slaDueAt), K9_business_due: R.K9_business && cairo(R.K9_business.slaDueAt) };
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [];
  try { if (holidayId) log.push('holiday ' + (await call('DELETE', `/desk/holiday-lists/${listId}/holidays/${holidayId}`)).status); } catch (e) { log.push('holiday ERR ' + e.message); }
  try {
    if (base) {
      const rb = { name: base.name, preset: base.preset, days_active: base.days_active, timing_mode: base.timing_mode, hours: base.hours, hours_per_day: base.hours_per_day, week_starts_on: base.week_starts_on, time_zone: base.time_zone };
      log.push('restore ' + (await call('PUT', `/iam/tenant/business-hours/profiles/${prof}`, rb)).status);
      const a = (await call('GET', '/iam/tenant/business-hours/profiles')).json.data.find(p => p.is_default);
      const same = ['preset', 'days_active', 'timing_mode', 'hours', 'hours_per_day', 'week_starts_on', 'time_zone'].every(k => JSON.stringify(a[k]) === JSON.stringify(base[k]));
      log.push('restored-equal ' + same);
      const d = (await call('GET', '/desk/business-hours')).json.data; log.push('holidays-left ' + d.todays_holidays.length);
    }
  } catch (e) { log.push('restore ERR ' + e.message); }
  log.push(await tv.cleanup(T, B)); R.cleanup = log.join(', '); console.log('cleanup', R.cleanup);
  fs.writeFileSync(path.join(OUT, 'bh.json'), JSON.stringify(R, null, 2));
});
