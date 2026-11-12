// G6 / K8 / K9 — business-hours clock and holiday (approved 2 Nov). Default profile → 24_5 Mon–Fri (or BH_MODE=holiday: keep 24x7, holiday only); 5-day state limit; restored in finally.
// Default profile → custom Mon–Fri 13:00–17:00 (Cairo) for a few minutes; QA holiday today on the default list; restored in finally.
// Usage: TV_CACHE=... node bh.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { call, sleep, QA_DEPT } = tv; const OUT = path.resolve(__dirname, '../evidence/raw'); const T = [], B = []; const R = {};
const pick = s => s && { enteredAt: s.enteredAt, slaDueAt: s.slaDueAt, warning_due_at: s.warning_due_at, escalation_due_at: s.escalation_due_at };
const cairo = iso => iso && new Date(iso).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
let base, prof, holidayId, listId, SLAID;
async function bp(name, clock) {
  const r = await tv.blueprint({ name: 'QA BP ' + name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP ' + name + ' ' },
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 }, slaClock: clock, slaMinutes: 7200, slaPreExpiryMinutes: 1440 }, { id: 'Closed', name: 'Closed', position: { x: 400, y: 0 }, isTerminal: true, slaClock: clock }],
    transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] }, true);
  const id = r.json && r.json.data && r.json.data.id; if (id) B.push(id); return { status: r.status, id };
}
async function enter(subject) { const t = await tv.ticket(subject); T.push(t); let s; for (let i = 0; i < 15 && !(s = await tv.stateOf(t)); i++) await sleep(1500); return pick(s); }
(async () => {
  const b0 = await call('GET', '/iam/tenant/business-hours/profiles'); base = b0.json.data.find(p => p.is_default); prof = base.id;
  fs.writeFileSync(path.join(OUT, 'bh-baseline.json'), JSON.stringify(b0.json.data, null, 2));
  const d0 = await call('GET', '/desk/business-hours'); listId = d0.json.data.profiles.find(p => p.is_default).holiday_list.id;
  R.baseline = { preset: base.preset, days: base.days_active, holidayList: listId };
  const body = { name: base.name, preset: process.env.BH_MODE === 'holiday' ? base.preset : '24_5', days_active: process.env.BH_MODE === 'holiday' ? base.days_active : ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: process.env.BH_MODE === 'holiday' ? null : 'same', hours: process.env.BH_MODE === 'holiday' ? null : { open: '00:00', close: '23:59' }, hours_per_day: null, week_starts_on: base.week_starts_on, time_zone: base.time_zone };
  const p = await call('PUT', `/iam/tenant/business-hours/profiles/${prof}`, body);
  R.setHours = { status: p.status, err: p.status >= 300 ? p.text.slice(0, 300) : undefined }; console.log('set hours', p.status, R.setHours.err || '');
  if (p.status >= 300) return;
  if (process.env.BH_WAIT) await sleep(Number(process.env.BH_WAIT) * 1000);
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
    // control: a department SLA policy on the business clock for the same ticket
    const pol = { department_id: QA_DEPT, name: 'QA BP BH SLA', description: 'QA automation - safe to delete', is_active: true,
      triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null },
      execute_only_with_account: false, resolution_from_created: true,
      targets: [{ name: 'QA target', sort_order: 0, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA BP BH biz holiday' }], pattern: null },
        response: { value: 1, unit: 'hours' }, resolution: { value: 120, unit: 'hours' }, calendar_mode: 'business', business_hours_id: null, first_response_only: true,
        escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }], accounts: [], support_plans: [] };
    const pr = await call('POST', '/desk/sla/policies', pol); SLAID = pr.json && pr.json.data && pr.json.data.id; R.controlPolicy = pr.status;
    R.K9_business = await enter('QA BP BH biz holiday');
    await sleep(3000); const sl = await call('GET', `/desk/tickets/${T[T.length - 1]}/sla`);
    R.control = ((sl.json && sl.json.data && sl.json.data.obligations) || []).map(o => ({ kind: o.kind, due: cairo(o.due_at), state: o.state })); R.controlCalendar = sl.json && sl.json.data && sl.json.data.calendar;
    console.log('holiday business', cairo(R.K9_business.slaDueAt), 'next opens', R.nextOpens, '| control SLA', JSON.stringify(R.control), JSON.stringify(R.controlCalendar));
    if (process.env.BH_SHOT) {
      const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
      const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
      const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
      try {
        const tid = T[T.length - 1];
        await pg.goto(`https://staging-desk.taviportal.com/modules/${tv.TICKETS}/records/${tid}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
        for (let i = 0; i < 60; i++) { await pg.waitForTimeout(1000); if (/Steps/.test(await pg.innerText('body').catch(() => ''))) break; }
        if (/Something went wrong/.test(await pg.innerText('body').catch(() => ''))) { await pg.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }); for (let i = 0; i < 60; i++) { await pg.waitForTimeout(1000); if (/Steps/.test(await pg.innerText('body').catch(() => ''))) break; } }
        await pg.waitForTimeout(4000); if (/Sign in Desk/.test(await pg.innerText('body'))) throw new Error('UI signed out');
        await pg.screenshot({ path: path.join(OUT, 'BH-ticket.png') });
        await pg.getByText('COVERED BY').first().scrollIntoViewIfNeeded().catch(() => { }); await pg.waitForTimeout(800);
        await pg.screenshot({ path: path.join(OUT, 'BH-ticket-sla.png') });
        if (process.env.BH_NOSET) {} else await pg.goto('https://staging-desk.taviportal.com/settings/organization/business-hours', { waitUntil: 'domcontentloaded', timeout: 120000 }).catch(() => { });
        await pg.waitForTimeout(8000); await pg.screenshot({ path: path.join(OUT, 'BH-settings.png') });
        console.log('shots ok');
      } catch (e) { console.log('shot ERR', e.message.split('\n')[0]); } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
    }
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
  log.push(await tv.cleanup(T, B)); if (SLAID) log.push('sla ' + (await call('DELETE', `/desk/sla/policies/${SLAID}`)).status); R.cleanup = log.join(', '); console.log('cleanup', R.cleanup);
  fs.writeFileSync(path.join(OUT, (process.env.BH_OUT || 'bh.json')), JSON.stringify(R, null, 2));
});
