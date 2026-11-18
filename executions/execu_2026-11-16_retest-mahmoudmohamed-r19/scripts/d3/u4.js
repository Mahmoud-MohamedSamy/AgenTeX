const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/screenshots/raw/';
const blocked = [];
await ctx.route(u => /\/api\//.test(u.href), async r => { const m = r.request().method(); const uu = r.request().url(); if (m !== 'GET' && (m === 'DELETE' || /reassign|anonymi|remove|suspend|deactiv|\/status|\/members/i.test(uu))) { blocked.push(m + ' BLOCKED ' + uu.split('/api/')[1]); return r.abort(); } return r.continue(); });
await page.goto(H + '/settings/users-control/agents', { waitUntil: 'domcontentloaded' });
await page.getByText('Dev Team 2', { exact: true }).first().waitFor({ timeout: 90000 }); await sleep(2000);
const row = page.locator('tr').filter({ hasText: 'Dev Team 2' }).first();
await row.hover(); await sleep(800);
const btns = await row.locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim().slice(0, 30)));
await row.locator('button').last().click(); await sleep(1500);
const menuT = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.screenshot({ path: RAW + '2850-1-menu.png' });
await page.getByRole('menuitem', { name: /Remove from Desk/ }).first().click().catch(async () => page.getByText(/Remove from Desk/).last().click());
await page.getByText(/Open work by department|owns no open tickets|Checking this agent/).first().waitFor({ timeout: 60000 }).catch(() => {}); await sleep(6000);
const dlg = page.getByRole('dialog').last();
const t1 = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ');
const cbN = await dlg.getByRole('checkbox').count(); const checked = cbN ? await dlg.getByRole('checkbox').first().isChecked() : null;
const selects = await dlg.locator('select').count();
await page.screenshot({ path: RAW + '2850-2-remove-dialog.png' });
// scroll the dialog to my departments
const mine = dlg.getByText('QA RT19 D3 Dept', { exact: true }).first(); const mineN = await mine.count(); if (mineN) { await mine.scrollIntoViewIfNeeded(); await sleep(800); await page.screenshot({ path: RAW + '2850-3-remove-dialog-mydept.png' }); }
const opts = mineN ? await mine.locator('xpath=ancestor::*[.//select][1]').locator('select').first().evaluate(s => [...s.options].map(o => o.text)).catch(() => []) : [];
await dlg.getByRole('button', { name: /Cancel/ }).first().click().catch(() => {}); await sleep(1500);
return { btns, menuT, cbN, checked, selects, mineN, opts, dialog: t1.slice(0, 3500), blocked };
