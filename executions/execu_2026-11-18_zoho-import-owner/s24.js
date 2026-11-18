const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
for (let i = 0; i < 1; i++) {
  const r = await api(page, 'GET', 'tickets?limit=10&sortBy=-createdTime');
  out.latest = (r.j && r.j.data || []).slice(0, 5).map(x => ({ id: x.id, n: x.ticketNumber, subj: x.subject, owner: x.assigneeId, created: x.createdTime, dept: x.departmentId }));
  if (out.latest.some(x => /QA RT22/.test(x.subj))) break;
  await page.waitForTimeout(10000);
}
await page.screenshot({ path: D + 'shots/21-A-detail.png', fullPage: true });
const t = await body(page); const i = t.indexOf('IMPORT DETAIL VIEW'); out.detail = t.slice(i, i + 1500);
