const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const blocked = [];
await ctx.route(u => /\/api\//.test(u.href), async r => { const m = r.request().method(); const uu = r.request().url(); if (m !== 'GET' && (m === 'DELETE' || /reassign|anonymi|remove|suspend|deactiv|\/status|\/members/i.test(uu))) { blocked.push(m + ' BLOCKED'); return r.abort(); } return r.continue(); });
await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' });
await page.getByText('Dev Team 2', { exact: true }).first().waitFor({ timeout: 90000 }); await sleep(2000);
const row = page.locator('tr').filter({ hasText: 'Dev Team 2' }).first();
const rowT = (await row.innerText()).replace(/\s+/g, ' ').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<e>');
await row.locator('button').last().click(); await sleep(1500);
await page.getByRole('menuitem', { name: /Remove from Desk/ }).first().click().catch(async () => page.getByText(/Remove from Desk/).last().click());
await page.getByText(/Open work by department/i).first().waitFor({ timeout: 60000 }).catch(() => {}); await sleep(5000);
const dlg = page.getByRole('dialog').last();
const hint = dlg.getByText(/pass to the agent you choose/).first(); const hn = await hint.count();
if (hn) { await hint.evaluate(x => x.scrollIntoView({ block: 'end' })); await sleep(1000); }
await page.screenshot({ path: RAW + '2850-7-dialog-hint.png' });
const t = (await dlg.innerText()).replace(/\s+/g, ' '); const i = t.indexOf('Update rules');
await dlg.getByRole('button', { name: /Cancel/ }).first().click().catch(() => {}); await sleep(1000);
return { rowT, hn, tail: t.slice(i, i + 700), blocked };
