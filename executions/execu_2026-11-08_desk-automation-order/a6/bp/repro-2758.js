// NDC-2758 evidence: blueprint with entry criteria in an unknown shape -> 201, then a non-matching ticket enters it.
// Creates one QA blueprint + one QA ticket in QA WF Dept R, screenshots, then deletes both.
// Usage: TV_CACHE=<scratch>/.tv-token.json node repro-2758.js <outDir>
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const HOST = 'https://staging-desk.taviportal.com';
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const crit = { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA BP N2-ONLY ' };
  const def = { name: 'QA BP NDC-2758 evidence', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status',
    departmentId: tv.QA_DEPT, entryCriteria: crit,
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 }, slaClock: 'business' }, { id: 'Closed', name: 'Closed', position: { x: 300, y: 0 }, slaClock: 'business', isTerminal: true }],
    transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
  const r = await tv.blueprint(def, true);
  const bp = r.json && r.json.data && r.json.data.id;
  const log = { request: { method: 'POST', path: '/api/v1/modules/{tickets}/blueprints', entryCriteria: crit, isActive: true }, response: { status: r.status, id: bp, savedCriteria: r.json && r.json.data && r.json.data.definition && r.json.data.definition.entryCriteria } };
  const tickets = []; let st = null;
  try {
    const t = await tv.ticket('QA BP N2 other subject'); tickets.push(t);
    for (let i = 0; i < 15 && !st; i++) { await tv.sleep(1500); st = await tv.stateOf(t); }
    const tr = await tv.call('GET', `/modules/${tv.TICKETS}/records/${t}`);
    const num = (tr.json.data.data.find(x => x.field === 'ticket_number') || {}).value;
    log.ticket = { id: t, subject: 'QA BP N2 other subject', number: num, blueprintState: st && { blueprint: st.blueprintDefinitionId, activeStates: st.activeStates, enteredAt: st.enteredAt } };
    fs.writeFileSync(path.join(out, 'NDC-2758-api.json'), JSON.stringify(log, null, 2));
    console.log(JSON.stringify(log));
    const b = await chromium.launch({ headless: true, channel: 'msedge' });
    const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
    await pg.goto(`${HOST}/modules/${tv.TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    for (let i = 0; i < 45; i++) { await pg.waitForTimeout(1000); if (/Steps/.test(await pg.innerText('body').catch(() => ''))) break; }
    await pg.waitForTimeout(3000); await pg.screenshot({ path: path.join(out, 'NDC-2758-ticket.png') });
    console.log('ticket page has Steps:', /Steps/.test(await pg.innerText('body')), 'url', pg.url());
    await pg.goto(`${HOST}/settings/automation/blueprints/${bp}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    for (let i = 0; i < 45; i++) { await pg.waitForTimeout(1000); if (/Save and Publish/.test(await pg.innerText('body').catch(() => ''))) break; }
    await pg.waitForTimeout(3000); await pg.screenshot({ path: path.join(out, 'NDC-2758-designer.png') });
    const body = await pg.innerText('body'); const m = body.match(/Criteria[\s\S]{0,200}/); console.log('designer criteria text:', m ? m[0].replace(/\s+/g, ' ') : 'n/a');
    await b.close();
  } finally {
    console.log('cleanup:', await tv.cleanup(tickets, bp ? [bp] : []));
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
