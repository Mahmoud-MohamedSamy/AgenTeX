// C20 second case: a ticket sits in state "QA BP Verify" when that status is removed from the Status field. Then the ticket,
// the designer (issue banner?) and a transition run are checked. All QA; status removed again and verified at the end.
// Usage: TV_CACHE=... UI_STATE=... node c20b.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const { call, sleep, QA_DEPT, TICKETS } = tv; const HOST = 'https://staging-desk.taviportal.com';
const OUT = path.resolve(__dirname, '../evidence/raw'); const R = {}; const B = [], T = [];
const BASE = ['Open', 'On Hold', 'Escalated', 'Closed', 'Reopened'];
const field = async () => (await call('GET', `/modules/${TICKETS}/fields`)).json.data.find(x => x.fieldName === 'status');
const put = (f, values) => call('PUT', `/modules/${TICKETS}/fields/${f.id}`, { fieldName: f.fieldName, labels: f.labels || {}, datatypeKey: f.datatypeKey, datatypeOptions: { ...f.datatypeOptions, allowed_values: values }, required: !!(f.config && f.config.required), unique: !!(f.config && f.config.unique) });
(async () => {
  const a = await call('POST', '/desk/blueprints/states', { name: 'QA BP Verify', type: 'open' }); R.addStatus = a.status;
  const st = (id, x, extra = {}) => ({ id, name: id, position: { x, y: 0 }, slaClock: 'business', ...extra });
  const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
  const c = await tv.blueprint({ name: 'QA BP C20c', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP C20c ' }, states: [st('Open', 0), st('QA BP Verify', 400), st('Closed', 800, { isTerminal: true })],
    transitions: [tr('v', 'Open', 'QA BP Verify'), tr('end', 'QA BP Verify', 'Closed')] }, true);
  const cid = c.json.data.id; B.push(cid);
  const f = await field(); const r = await put(f, f.datatypeOptions.allowed_values.filter(v => v !== 'QA BP Verify'));
  R.removeNoTicket = { status: r.status, error: r.json && r.json.error }; R.stillThere = (await field()).datatypeOptions.allowed_values.includes('QA BP Verify');
  const t = await tv.ticket('QA BP C20c ticket'); T.push(t); for (let i = 0; i < 15 && !(await tv.stateOf(t)); i++) await sleep(1500);
  const run = await call('POST', `/desk/tickets/${t}/blueprint-transitions/v`, { run_id: crypto.randomUUID(), expected_state_id: 'Open', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null });
  R.runIntoRemoved = { status: run.status, body: (run.text || '').slice(0, 300) };
  console.log('remove', JSON.stringify(R.removeNoTicket), 'run', JSON.stringify(R.runIntoRemoved));
  const rec = await call('GET', `/modules/${TICKETS}/records/${t}`); R.ticketStatus = (rec.json.data.data.find(x => x.field === 'status') || {}).value;
  const s1 = await tv.stateOf(t); R.stateAfter = s1 && s1.activeStates;
  const run2 = process.env.NO_RUN2 ? { status: 'skipped', text: '' } : await call('POST', `/desk/tickets/${t}/blueprint-transitions/end`, { run_id: crypto.randomUUID(), expected_state_id: 'QA BP Verify', fields: {}, checklist: {}, reply: null, comment: null, attachment_ids: [], resolution: null });
  R.runOut = { status: run2.status, body: (run2.text || '').slice(0, 250) };
  console.log('after', JSON.stringify({ ticketStatus: R.ticketStatus, stateAfter: R.stateAfter, runOut: R.runOut }));
  // designer check on the first (ticketless) case is the same blueprint once the ticket moved on; open it
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  try {
    await pg.goto(`${HOST}/modules/${TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 120000 }); for (let i = 0; i < 60; i++) { await pg.waitForTimeout(1000); if (/Steps|Status/.test(await pg.innerText('body').catch(() => ''))) break; } if (/Something went wrong/.test(await pg.innerText('body'))) { await pg.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }); await pg.waitForTimeout(15000); } await pg.waitForTimeout(4000); R.ticketUi = (await pg.innerText('body')).split('\n').filter(l => /QA BP Verify|Status|Steps/.test(l)).slice(0, 10);
    await pg.screenshot({ path: path.join(OUT, 'C20c-ticket.png') });
    await pg.goto(`${HOST}/settings/automation/blueprints/${cid}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    for (let i = 0; i < 45; i++) { await pg.waitForTimeout(1000); if (/Save and Publish/.test(await pg.innerText('body').catch(() => ''))) break; }
    await pg.waitForTimeout(2500); const tx = await pg.innerText('body');
    R.designer = tx.split('\n').filter(l => /issue|no longer|status|Verify/i.test(l)).slice(0, 10);
    await pg.screenshot({ path: path.join(OUT, 'C20c-designer.png') });
    await pg.goto('about:blank').catch(() => { });
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
  console.log('designer', JSON.stringify(R.designer));
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [await tv.cleanup(T, B)];
  try {
    const f = await field(); const keep = f.datatypeOptions.allowed_values.filter(v => !/^QA BP/.test(v));
    if (keep.length !== f.datatypeOptions.allowed_values.length) log.push('remove QA values ' + (await put(f, keep)).status);
    const now = (await field()).datatypeOptions.allowed_values; log.push('values-equal-baseline ' + (JSON.stringify(now) === JSON.stringify(BASE)));
  } catch (e) { log.push('ERR ' + e.message); }
  R.cleanup = log.join(', '); console.log('cleanup', R.cleanup); fs.writeFileSync(path.join(OUT, 'c20c.json'), JSON.stringify(R, null, 2));
});
