const I = JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-13_retest-mahmoudmohamed-r17/out/ids.json', 'utf8')).A35;
const w = []; page.on('response', r => { if (r.request().method() === 'DELETE' || /recycle|delete/.test(r.url()) && r.request().method() !== 'GET') w.push(r.request().method() + ' ' + r.url().replace(/^.*api\/v1/, '').slice(0, 100) + ' ' + r.status()); });
await page.goto(H + '/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records/' + I.tasks[0], { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT17 2635 task A/.test(await text())) break; } await sleep(3000);
await page.getByRole('button', { name: 'Delete', exact: true }).first().click(); await sleep(1500);
const d = page.locator('[role=alertdialog],[role=dialog]').last(); log('confirm', (await d.innerText().catch(() => '')).replace(/\n/g, ' | ').slice(0, 250)); await shot('2635-task-delete-confirm.png');
await d.getByRole('button', { name: /delete/i }).last().click(); await sleep(5000);
log('after url', page.url()); await shot('2635-task-deleted.png'); log('writes', w);
await page.goto(H + '/views/all/tickets/' + I.ticket, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA RT17 2635 ticket/.test(await text())) break; } await sleep(4000);
log('tabs after', ((await text()).match(/\d*\s*ACTIVITY[^\n]*/gi) || [])); await shot('2635-ticket-tabs-after.png');
