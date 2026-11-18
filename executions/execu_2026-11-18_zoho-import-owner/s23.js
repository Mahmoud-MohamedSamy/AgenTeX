const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.locator('text=1499272000000485446').first().click({ timeout: 15000 }).catch(e => out.clickErr = String(e).slice(0, 100));
await page.waitForTimeout(10000);
await page.screenshot({ path: D + 'shots/20-A-result.png', fullPage: true });
const t = await body(page); const i = t.indexOf('Data Administration'); out.txt = t.slice(i, i + 2500);
const r = await api(page, 'GET', 'tickets/search?subject=QA%20RT22*&limit=20');
out.search = { s: r.s, d: (r.j && r.j.data || []).map(x => ({ n: x.ticketNumber, subj: x.subject, owner: x.assigneeId, created: x.createdTime })) };
