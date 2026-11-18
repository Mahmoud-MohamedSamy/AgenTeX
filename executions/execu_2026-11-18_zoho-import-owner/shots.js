const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/shots/';
for (const [n, id] of [['157', '1499272000000437116'], ['158', '1499272000000490166'], ['159', '1499272000000490200']]) {
  await openT(page, id); await page.keyboard.press('Escape').catch(()=>{});
  await page.screenshot({ path: D + 'z-' + n + '-ticket.png' });
  const t = await body(page); const i = t.indexOf('Ticket Owner'); out[n] = t.slice(Math.max(0, i - 50), i + 120);
}
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/data-administration/import', { waitUntil: 'commit' }).catch(()=>{});
await page.waitForTimeout(10000); await page.screenshot({ path: D + 'z-import-list.png' });
