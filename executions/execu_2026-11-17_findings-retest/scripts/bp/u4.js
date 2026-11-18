const fs = require('fs'); const J = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/scripts/bp/f04.json', 'utf8'));
const out = {}; const net = []; page.on('response', r => { if (/blueprint-transitions|\/desk\/tickets\/[0-9a-f-]{36}$|\/records\/[0-9a-f-]{36}$/.test(r.url()) && r.request().method() !== 'OPTIONS') net.push(new Date().toISOString().slice(11, 19) + ' ' + r.request().method() + ' ' + r.url().split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, '{id}') + ' ' + r.status()); });
const pick = t => (t.match(/This ticket is not available[^.]*|Permission denied\.?|You can read this ticket[^.]*\.|QA RT21 BP F04 tk K1[^#]{0,30}/g) || []).slice(0, 4).join(' / ');
// control first
await page.goto(H + '/views/all/tickets/' + J.c1, { waitUntil: 'domcontentloaded' }); await sleep(12000);
out.control = pick((await text()).replace(/\s+/g, ' ')); await shot('F04-0-control-no-bp.png');
await page.goto(H + '/views/all/tickets/' + J.k1, { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT21 BP F04 tk K1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(5000);
let t = (await text()).replace(/\s+/g, ' '); out.before = pick(t); let i = t.search(/Steps/); out.stepsBefore = t.slice(i, i + 140);
const b = page.getByRole('button', { name: 'QA onlyA', exact: true }).first(); out.btn = await b.count(); out.tBefore = new Date().toISOString();
await shot('F04-1-before.png');
if (out.btn) { await b.click(); await sleep(2000); await shot('F04-2-run-panel.png'); const run = page.getByRole('button', { name: 'Run', exact: true }).last(); out.runBtn = await run.count(); if (out.runBtn) { out.tRun = new Date().toISOString(); await run.click(); await sleep(8000); } }
t = (await text()).replace(/\s+/g, ' '); out.after = pick(t); i = t.search(/Steps/); out.stepsAfter = t.slice(i, i + 140); await shot('F04-3-after-run.png');
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(12000); out.tReload = new Date().toISOString(); t = (await text()).replace(/\s+/g, ' '); out.reload = pick(t);
await shot('F04-4-reload.png');
out.net = net; return out;
