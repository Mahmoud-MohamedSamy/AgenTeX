// DOM probe for BlueprintScreenTest fixes (Anyware, owner UI session UI_STATE, one context). QA blueprint + ticket deleted after.
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/node_modules/playwright-core');
const { QA_DEPT, TICKETS } = tv; const OUT = path.resolve(__dirname, '../evidence/raw'); const R = {}; const B = [], T = [];
const H = 'https://staging-desk.taviportal.com';
(async () => {
  const st = (id, x, extra) => ({ id, name: id, position: { x, y: 0 }, ...extra });
  const r = await tv.blueprint({ name: 'QA BP probe screen', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP probe screen' }, states: [st('Open', 0, { slaMinutes: 120 }), st('Escalated', 400), st('Closed', 800, { isTerminal: true })],
    transitions: [{ id: 'go', name: 'QA go', fromStateId: 'Open', toStateId: 'Escalated', before: {}, during: {}, after: { actions: [] } }, { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] }, true);
  const bid = r.json.data.id; B.push(bid); const t = await tv.ticket('QA BP probe screen ticket'); T.push(t);
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const ctx = await b.newContext({ storageState: process.env.UI_STATE, viewport: { width: 1600, height: 1000 } }); const pg = await ctx.newPage();
  const waitText = async re => { for (let i = 0; i < 120; i++) { await pg.waitForTimeout(1000); if (re.test(await pg.innerText('body').catch(() => ''))) return true; } return false; };
  const btns = () => pg.evaluate(() => [...document.querySelectorAll('button')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); return { t: e.innerText.trim().slice(0, 40), aria: e.getAttribute('aria-label'), title: e.title, x: r.left | 0, y: r.top | 0 }; }));
  try {
    await pg.goto(`${H}/settings/automation/blueprints/${bid}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    R.designerLoaded = await waitText(/Escalated/); if (!R.designerLoaded) { await pg.screenshot({ path: path.join(OUT, 'probe-designer-timeout.png') }); await pg.reload({ waitUntil: 'domcontentloaded', timeout: 120000 }); R.designerLoaded2 = await waitText(/Escalated/); } await pg.waitForTimeout(3000); await pg.screenshot({ path: path.join(OUT, 'probe-designer.png') });
    R.toolbar = (await btns()).filter(x => x.y < 110);
    // open the Open state panel
    const node = pg.locator('.react-flow__node').filter({ hasText: 'Open' }).first();
    await node.click({ timeout: 10000 }).catch(e => R.nodeClickErr = e.message.slice(0, 100)); await pg.waitForTimeout(2500);
    R.panel = await pg.evaluate(() => [...document.querySelectorAll('input,select,textarea')].filter(e => e.getBoundingClientRect().left > 1250).map(e => ({ tag: e.tagName, type: e.type, ph: e.placeholder, aria: e.getAttribute('aria-label'), id: e.id, val: e.value,
      label: (e.labels && e.labels[0] && e.labels[0].innerText) || (e.closest('label') && e.closest('label').innerText.slice(0, 60)) || (e.parentElement && e.parentElement.innerText.slice(0, 80)) })));
    R.panelText = (await pg.innerText('body')).split('\n').filter(l => /limit|hour|minute|warn|time/i.test(l)).slice(0, 20);
    await pg.screenshot({ path: path.join(OUT, 'probe-state-panel.png') });
    if (process.env.SKIP_TICKET) return;
    // ticket Steps card
    await pg.goto(`${H}/modules/${TICKETS}/records/${t}`, { waitUntil: 'domcontentloaded', timeout: 120000 }); R.ticketLoaded = await waitText(/Steps/); await pg.waitForTimeout(3000);
    R.stepsButtons = (await btns()).filter(x => /go|Escalated|step|Run/i.test(x.t + ' ' + x.aria + ' ' + x.title));
    R.stepsText = ((await pg.innerText('body')).match(/Steps[\s\S]{0,300}/) || [''])[0];
    await pg.screenshot({ path: path.join(OUT, 'probe-steps.png') });
  } finally { await ctx.storageState({ path: process.env.UI_STATE }); await b.close(); }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  R.cleanup = await tv.cleanup(T, B); fs.writeFileSync(path.join(OUT, 'screen-probe.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1));
});
