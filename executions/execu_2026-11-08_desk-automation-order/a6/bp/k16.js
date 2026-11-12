// K16: department SLA and blueprint state limit both overdue — shown separately, times not mixed up.
// QA SLA policy (minutes) + QA blueprint (state limit 1 min) + QA ticket in QA WF Dept R; all deleted after. ONE browser context.
// Usage: TV_CACHE=... UI_STATE=... node k16.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const { call, sleep, TICKETS, QA_DEPT } = tv; const HOST = 'https://staging-desk.taviportal.com';
const OUT = path.resolve(__dirname, '../evidence/raw'); const T = [], B = [], SLA = []; const R = {};
(async () => {
  const pol = { department_id: QA_DEPT, name: 'QA BP K16 SLA', description: 'QA automation - safe to delete', is_active: true,
    triggers: { create: true, update: false, field_update: null, customer_reply: false, agent_response: false, private_thread: null, comment: null },
    execute_only_with_account: false, resolution_from_created: true,
    targets: [{ name: 'QA target', sort_order: 0, criteria: { conditions: [{ field_key: 'subject', operator: 'contains', value: 'QA BP K16' }], pattern: null },
      response: { value: 1, unit: 'minutes' }, resolution: { value: 2, unit: 'minutes' }, calendar_mode: 'calendar', business_hours_id: null, first_response_only: true,
      escalate_on_business_hours: false, escalations: { response: [], resolution: [] } }], accounts: [], support_plans: [] };
  const pr = await call('POST', '/desk/sla/policies', pol); const pid = pr.json && pr.json.data && pr.json.data.id; if (pid) SLA.push(pid);
  R.policy = { status: pr.status, err: pid ? undefined : (pr.text || '').slice(0, 300) }; console.log('policy', JSON.stringify(R.policy));
  if (!pid) return;
  const st = (id, extra = {}) => ({ id, name: id, position: { x: id === 'Open' ? 0 : 400, y: 0 }, slaClock: 'calendar', ...extra });
  const r = await tv.blueprint({ name: 'QA BP K16', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP K16' },
    states: [st('Open', { slaMinutes: 1, slaEscalation: [{ kind: 'setField', field: 'description', value: 'QA K16 state overdue' }] }), st('Closed', { isTerminal: true })],
    transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] }, true);
  const bid = r.json && r.json.data && r.json.data.id; if (bid) B.push(bid); R.blueprint = r.status;
  const t = await tv.ticket('QA BP K16 both overdue'); T.push(t);
  let s; for (let i = 0; i < 15 && !(s = await tv.stateOf(t)); i++) await sleep(1500);
  const sla0 = await call('GET', `/desk/tickets/${t}/sla`);
  R.atStart = { state: s && { enteredAt: s.enteredAt, slaDueAt: s.slaDueAt, escalation_due_at: s.escalation_due_at }, sla: (sla0.text || '').slice(0, 1200) };
  console.log('start', JSON.stringify(R.atStart).slice(0, 900));
  await sleep(200000);
  const s1 = await tv.stateOf(t); const sla1 = await call('GET', `/desk/tickets/${t}/sla`);
  const rec = await call('GET', `/modules/${TICKETS}/records/${t}`); const desc = (rec.json.data.data.find(x => x.field === 'description') || {}).value;
  R.after = { state: s1 && { activeStates: s1.activeStates, slaDueAt: s1.slaDueAt, escalation_due_at: s1.escalation_due_at }, sla: (sla1.text || '').slice(0, 1500), description: desc };
  console.log('after', JSON.stringify(R.after).slice(0, 1500));
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  try {
    await pg.goto(`${HOST}/modules/${TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    for (let i = 0; i < 40; i++) { await pg.waitForTimeout(1000); if (/Steps/.test(await pg.innerText('body').catch(() => ''))) break; }
    await pg.waitForTimeout(3000);
    const txt = await pg.innerText('body'); if (/Sign in Desk/.test(txt)) throw new Error('signed out');
    R.ui = txt.split('\n').map(l => l.trim()).filter(l => /overdue|violat|due|breach|SLA|Steps|Time limit|ago|late/i.test(l)).slice(0, 30);
    await pg.screenshot({ path: path.join(OUT, 'K16-ticket.png') });
    // scroll the property panel down to the SLA card
    await pg.getByText('SLA', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => { }); await pg.waitForTimeout(800);
    await pg.screenshot({ path: path.join(OUT, 'K16-ticket-sla.png') });
    console.log('ui', JSON.stringify(R.ui));
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = []; log.push(await tv.cleanup(T, B)); for (const id of SLA) log.push('sla ' + (await call('DELETE', `/desk/sla/policies/${id}`)).status);
  R.cleanup = log.join(', '); console.log('cleanup', R.cleanup);
  fs.writeFileSync(path.join(OUT, 'K16.json'), JSON.stringify(R, null, 2));
});
