const { execSync } = require('child_process');
const RUNDIR = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-24_desk-approvals';
const PG = [{ id: '42a46379-7b5e-41e7-9738-93b77760989e', t: '0c2a06b4-fa60-407c-9fe8-df8351070a5d' }, { id: '0f30faa8-8b33-48c9-b349-b869e32160df', t: '28cb34c2-6da3-47c4-947a-d7cb293c2da8' }, { id: '12a37f10-6280-479a-9bfb-560aa601369f', t: 'a8dfd85b-d334-4902-bce3-a6746e46e50d' },
  { id: 'c3008862-f9c4-4f3e-bd66-f71104782d77', t: '928e975c-f055-4264-b1cf-a0e389d15d2b' }, { id: '33e0d979-aab2-40b6-be6b-5ee858173248', t: '41b88b33-f687-4e08-8ff8-c2689c8972e7' }, { id: 'bb716120-9d04-4903-bb4f-21ec02704f0b', t: '0c2a06b4-fa60-407c-9fe8-df8351070a5d' }];
const tid = s => page.locator(`[data-testid="${s}"]`);
const o = {};
await go('/approvals?source=manual'); await sleep(4000);
// E8 + E9: select 3, cancel #3 from another session, bulk approve
for (const p of [PG[0], PG[1], PG[3]]) { const c = tid('approval-select-' + p.id); o['sel' + p.id.slice(0, 4)] = await c.count(); if (await c.count()) await c.first().check().catch(async () => c.first().click()); }
await sleep(800); o.bulkBar = (await tid('approvals-bulk-bar').innerText().catch(() => 'no bar')).slice(0, 300);
o.cancelMid = execSync(`node scripts/multi.js out/cancel-one.js`, { cwd: RUNDIR, env: { ...process.env, CID: PG[3].id, CT: PG[3].t } }).toString().trim().slice(0, 200);
await tid('approvals-bulk-approve').first().click(); await sleep(1500);
const dlg = page.getByRole('dialog').last(); o.bulkDialog = (await dlg.innerText().catch(() => '')).slice(0, 500);
const ta = dlg.locator('textarea').first(); if (await ta.count()) await ta.fill('QA PA bulk approve comment');
await shot('ui2-B-bulk-dialog');
await page.getByRole('button', { name: /^Approve [0-9]+ items?/ }).first().click(); await sleep(6000);
o.bulkResult = ((await text()).match(/\d+ approved[^\n]{0,300}/) || [''])[0];
await shot('ui2-B-bulk-result');
// E11 bulk reject needs a reason
await go('/approvals?source=manual'); await sleep(3500);
for (const p of PG.slice(4, 6)) { const c = tid('approval-select-' + p.id); if (await c.count()) await c.first().check().catch(async () => c.first().click()); }
await tid('approvals-bulk-reject').first().click(); await sleep(1500);
const d2 = page.getByRole('dialog').last(); o.bulkRejectDialog = (await d2.innerText().catch(() => '')).slice(0, 500);
const save = page.getByRole('button', { name: /^Reject [0-9]+ items?/ }).first();
o.rejSaveEmpty = await save.isDisabled().catch(() => 'n/a');
const ta2 = d2.locator('textarea').first(); await ta2.fill('ab'); await sleep(300); o.rejSaveTwo = await save.isDisabled().catch(() => 'n/a'); o.rejMsgTwo = (await d2.innerText()).slice(0, 400);
await shot('ui2-B-bulk-reject-dialog');
await d2.getByRole('button', { name: /cancel/i }).first().click().catch(() => {});
// E10 limit text
o.selectPage = await tid('approvals-select-page').count();
// search by keyboard timing (C9): count list calls while typing
let calls = 0; page.on('request', r => { if (/\/desk\/approvals\?/.test(r.url())) calls++; });
await go('/approvals'); await sleep(3000); calls = 0;
const sb = page.getByPlaceholder(/number or subject/i).first(); await sb.click(); await sb.pressSequentially('QA PA R16', { delay: 60 }); await sleep(1500);
o.searchCalls = calls;
return o;
