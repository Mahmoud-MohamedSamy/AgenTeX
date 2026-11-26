const { execSync } = require('child_process');
const RUNDIR = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-24_desk-approvals';
const SEL = ['33e0d979-aab2-40b6-be6b-5ee858173248', 'bb716120-9d04-4903-bb4f-21ec02704f0b', '07a3848d-4e1d-4b66-b570-6b4dfdfe7268'];
const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
await go('/approvals?source=manual'); await sleep(4000);
for (const id of SEL) { const c = tid('approval-select-' + id); o['sel' + id.slice(0, 4)] = await c.count(); if (await c.count()) await c.first().check().catch(async () => c.first().click()); }
o.bar = (await tid('approvals-bulk-bar').innerText().catch(() => '')).slice(0, 60);
o.cancelMid = execSync(`node scripts/multi.js out/cancel-one.js`, { cwd: RUNDIR, env: { ...process.env, CID: SEL[2], CT: '28cb34c2-6da3-47c4-947a-d7cb293c2da8' } }).toString().trim().slice(0, 60);
await tid('approvals-bulk-approve').first().click(); await sleep(1500);
await page.getByRole('button', { name: /^Approve [0-9]+ items?/ }).first().click(); await sleep(7000);
o.result = ((await text()).match(/\d+ approved[^\n]{0,300}/) || [''])[0];
await shot('ui3-B-bulk-partial');
return o;
