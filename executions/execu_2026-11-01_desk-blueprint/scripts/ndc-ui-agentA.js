// A2 + A5 on NDC-Staging as Agent A (Desk Agent): one browser sign-in. Owner creates a QA blueprint + ticket owned by A by API; deleted after.
const n = require('./ndc'); const fs = require('fs'); const path = require('path');
const { chromium } = require('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/node_modules/playwright-core');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const OUT = path.resolve(__dirname, '../evidence/raw'); const HOST = 'https://staging-desk.taviportal.com';
const SCR_STATE = 'C:/Users/Dell/AppData/Local/Temp/claude/D--Software-Testing-Automation-Agentex-Installation-Agentex-Installation/e12f27e4-edb0-452a-a10f-0861faf81818/scratchpad/ui-ndc-A.json';
const v = x => ({ kind: 'string', value: String(x) }); const R = {}; let bid, t;
function pw(email) { for (const line of fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/docs/Credentials/TAVI Desk Credentials.csv', 'utf8').split(/\r?\n/)) { const c = line.split(','); const i = c.indexOf(email); if (i >= 0) return c[i + 1]; } }
(async () => {
  const mark = 'QA BP UIA ' + Date.now().toString().slice(-6);
  const def = { name: 'QA BP UI agent', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: n.CS, entryCriteria: { op: 'contains', field: 'subject', value: mark },
    states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 } }, { id: 'Escalated', name: 'Escalated', position: { x: 300, y: 0 } }, { id: 'Closed', name: 'Closed', position: { x: 600, y: 0 }, isTerminal: true }],
    transitions: [{ id: 'go', name: 'QA go for A', fromStateId: 'Open', toStateId: 'Escalated', before: { allowedUserIds: [n.ID.A] }, during: {}, after: { actions: [] } }, { id: 'end', name: 'QA end', fromStateId: 'Escalated', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] };
  const c = await n.call('owner', 'POST', `/modules/${TK}/blueprints`, { definition: def, isActive: true }); bid = c.json.data.id;
  const r = await n.call('owner', 'POST', `/modules/${TK}/records`, { data: [['subject', mark + ' ticket'], ['department', n.CS], ['status', 'Open'], ['owner', n.ID.A]].map(([f, x]) => ({ field: f, value: v(x) })) }); t = r.json.data.id;
  const b = await chromium.launch({ headless: true, channel: 'msedge', args: ['--disable-gpu'] });
  const have = fs.existsSync(SCR_STATE); const ctx = await b.newContext({ viewport: { width: 1600, height: 1000 }, ...(have ? { storageState: SCR_STATE } : {}) }); const pg = await ctx.newPage();
  const bpData = []; pg.on('response', async res => { if (/\/blueprints(\?|\/|$)/.test(res.url()) && !/blueprint-(state|transitions)/.test(res.url())) bpData.push(res.status() + ' ' + res.url().replace(HOST, '').slice(0, 90)); });
  try {
    if (!have) { await pg.goto(HOST + '/', { waitUntil: 'domcontentloaded', timeout: 120000 }); await pg.waitForSelector('input[type=password]', { timeout: 200000 }).catch(async e => { await pg.screenshot({ path: path.join(OUT, 'A-signin-timeout.png') }); throw e; });
    await pg.fill('input[autocomplete~="username"], input[type=email]', n.U.A); await pg.fill('input[type=password]', pw(n.U.A)); await pg.locator('form button[type=submit]').first().click();
    let txt = ''; for (let i = 0; i < 90; i++) { await pg.waitForTimeout(1000); txt = await pg.innerText('body').catch(() => ''); if (/invalid email or password|session limit|too many/i.test(txt)) break;
      if (/Choose an organization/i.test(txt)) { await pg.getByText(/NDC/i).first().click().catch(() => { }); continue; } if (!/sign in|signing in/i.test(txt)) break; }
    await pg.waitForTimeout(5000); txt = await pg.innerText('body').catch(() => ''); if (/sign in|invalid email|session limit|too many/i.test(txt)) throw new Error('A sign-in failed: ' + txt.slice(0, 120).replace(/\s+/g, ' ')); await ctx.storageState({ path: SCR_STATE }); }
    const visit = async (p, shot, re = /permission|access|Steps|Blueprints|Status/) => { await pg.goto(HOST + p, { waitUntil: 'domcontentloaded', timeout: 120000 }); for (let i = 0; i < 100; i++) { await pg.waitForTimeout(1000); const x = await pg.innerText('body').catch(() => ''); if (i > 8 && re.test(x.replace(/Skip to content[\s\S]{0,400}?Scheduled Replies/, ''))) break; } await pg.waitForTimeout(3000); const tx = await pg.innerText('body').catch(() => ''); await pg.screenshot({ path: path.join(OUT, shot) }); return tx; };
    // A2
    const setTx = await visit('/settings/automation', 'A2-settings-automation.png');
    R.A2_menuHasBlueprints = /Blueprints/.test(setTx); R.A2_settingsSnippet = setTx.replace(/\s+/g, ' ').slice(0, 300);
    for (const [k, p] of [['list', '/settings/automation/blueprints'], ['one', '/settings/automation/blueprints/' + bid], ['new', '/settings/automation/blueprints/new']]) {
      const tx = await visit(p, `A2-${k}.png`); R['A2_' + k] = { noAccess: /don.t have access|not have access|no access|permission/i.test(tx), showsBpName: tx.includes('QA BP UI agent'), snippet: tx.replace(/\s+/g, ' ').slice(0, 260) };
    }
    R.A2_blueprintResponses = [...new Set(bpData)];
    // A5
    const tTx = await visit(`/views/all/tickets/${t}`, 'A5-ticket.png', /Steps|QA go for A|not found|permission/i);
    R.A5 = { steps: /Steps/.test(tTx), button: tTx.includes('QA go for A'), noDesignerLink: !/Edit blueprint|Open designer/i.test(tTx), snippet: (tTx.match(/Steps[\s\S]{0,200}/) || [''])[0].replace(/\s+/g, ' ') };
  } finally { await ctx.storageState({ path: SCR_STATE }).catch(() => { }); await b.close(); }
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  if (t) { await n.call('owner', 'POST', `/desk/tickets/${t}/blueprint/revoke`, {}); R.delT = (await n.call('owner', 'DELETE', `/modules/${TK}/records/${t}`)).status; }
  if (bid) R.delB = (await n.call('owner', 'DELETE', `/modules/${TK}/blueprints/${bid}`)).status;
  fs.writeFileSync(path.join(OUT, 'ndc-ui-agentA.json'), JSON.stringify(R, null, 1)); console.log(JSON.stringify(R, null, 1));
});
