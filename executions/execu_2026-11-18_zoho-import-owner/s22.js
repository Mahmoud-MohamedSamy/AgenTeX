const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/data-administration/import', { waitUntil: 'commit' }).catch(()=>{});
await page.waitForTimeout(10000);
await page.getByText('1499272000000506975').first().click(); await page.waitForTimeout(10000);
await page.screenshot({ path: D + 'shots/19-prev-import.png', fullPage: true });
const t = await body(page); const i = t.indexOf('1499272000000506975'); out.txt = t.slice(i, i + 3000);
