// Clean business-clock measurement (approved tenant change, restored in finally): Default → 24 hours Mon–Fri, no holiday.
// One QA ticket in a business-clock blueprint state (5-day = 7200 min limit) AND a QA department SLA (resolution 120 business hours).
// Waits until the state's due time is no longer provisional, then compares both and screenshots the ticket.
// Usage: TV_CACHE=... UI_STATE=... node bh3.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const { call, sleep, QA_DEPT, TICKETS } = tv; const OUT = path.resolve(__dirname, '../evidence/raw'); const T = [], B = []; const R = { samples: [] };
const cairo = d => d && new Date(d.at || d).toLocaleString('en-GB', { timeZone: 'Africa/Cairo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
let base, prof, SLAID;
(async () => {
  base = (await call('GET', '/iam/tenant/business-hours/profiles')).json.data.find(p => p.is_default); prof = base.id;
  const p = await call('PUT', `/iam/tenant/business-hours/profiles/${prof}`, { name: base.name, preset: '24_5', days_active: ['mon', 'tue', 'wed', 'thu', 'fri'], timing_mode: 'same', hours: { open: '00:00', close: '23:59' }, hours_per_day: null, week_starts_on: base.week_starts_on, time_zone: base.time_zone });
  R.setHours = p.status; if (p.status >= 300) throw new Error('set hours ' + p.text.slice(0, 200));
  const pol = { department_id: QA_DEPT, name: 'QA BP BH3 SLA', description: 'QA automation - safe to delete', is_active: true,
    triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null },
    execute_only_with_account: false, resolution_from_created: true,
    targets: [{ name: 'QA target', sort_order: 0, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA BP BH3' }], pattern: null },
      response: { value: 1, unit: 'hours' }, resolution: { value: 120, unit: 'hours' }, calendar_mode: 'business', business_hours_id: null, first_response_only: true,
      escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }], accounts: [], support_plans: [] };
  const pr = await call('POST', '/desk/sla/policies', pol); SLAID = pr.json && pr.json.data && pr.json.data.id;
  const st = (id, extra) => ({ id, name: id, position: { x: id === 'Open' ? 0 : 400, y: 0 }, slaClock: 'business', ...extra });
  const r = await tv.blueprint({ name: 'QA BP BH3', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP BH3' }, states: [st('Open', { slaMinutes: 7200, slaPreExpiryMinutes: 1440 }), st('Closed', { isTerminal: true })],
    transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] }, true);
  if (r.json && r.json.data) B.push(r.json.data.id);
  const t = await tv.ticket('QA BP BH3 ticket'); T.push(t);
  for (let i = 0; i < 24; i++) {
    const s = await tv.stateOf(t);
    if (s) { R.samples.push({ sec: i * 5, due: cairo(s.escalation_due_at), provisional: s.escalation_due_at && s.escalation_due_at.provisional, warn: cairo(s.warning_due_at) }); if (s.escalation_due_at && s.escalation_due_at.provisional === false) break; }
    await sleep(5000);
  }
  const sl = await call('GET', `/desk/tickets/${t}/sla`);
  R.sla = ((sl.json && sl.json.data && sl.json.data.obligations) || []).map(o => ({ kind: o.kind, due: cairo(o.due_at) }));
  console.log('state samples', JSON.stringify(R.samples)); console.log('SLA', JSON.stringify(R.sla));
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  try {
    const waitSteps = async () => { for (let i = 0; i < 60; i++) { await pg.waitForTimeout(1000); if (/Steps/.test(await pg.innerText('body').catch(() => ''))) return; } };
    await pg.goto(`https://staging-desk.taviportal.com/modules/${TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 120000 }); await waitSteps();
    if (/Something went wrong/.test(await pg.innerText('body'))) { await pg.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }); await waitSteps(); }
    await pg.waitForTimeout(4000); await pg.screenshot({ path: path.join(OUT, 'BH3-ticket.png') });
    await pg.getByText('COVERED BY').first().scrollIntoViewIfNeeded().catch(() => { }); await pg.waitForTimeout(800); await pg.screenshot({ path: path.join(OUT, 'BH3-ticket-sla.png') });
    R.ui = (await pg.innerText('body')).split('\n').filter(l => /^Due |Warning|business time|Due 0|Due in/i.test(l.trim())).slice(0, 12);
    console.log('ui', JSON.stringify(R.ui));
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [];
  try {
    if (base) {
      log.push('restore ' + (await call('PUT', `/iam/tenant/business-hours/profiles/${prof}`, { name: base.name, preset: base.preset, days_active: base.days_active, timing_mode: base.timing_mode, hours: base.hours, hours_per_day: base.hours_per_day, week_starts_on: base.week_starts_on, time_zone: base.time_zone })).status);
      const a = (await call('GET', '/iam/tenant/business-hours/profiles')).json.data.find(p => p.is_default);
      log.push('restored-equal ' + ['preset', 'days_active', 'timing_mode', 'hours', 'hours_per_day', 'week_starts_on', 'time_zone'].every(k => JSON.stringify(a[k]) === JSON.stringify(base[k])));
    }
  } catch (e) { log.push('restore ERR ' + e.message); }
  log.push(await tv.cleanup(T, B)); if (SLAID) log.push('sla ' + (await call('DELETE', `/desk/sla/policies/${SLAID}`)).status);
  R.cleanup = log.join(', '); console.log('cleanup', R.cleanup); fs.writeFileSync(path.join(OUT, 'bh3.json'), JSON.stringify(R, null, 2));
});
