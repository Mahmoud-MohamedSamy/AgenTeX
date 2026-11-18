const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.waitForTimeout(15000);
await page.screenshot({ path: D + 'shots/08-A-mapping.png', fullPage: true });
const t = await body(page); const i = t.indexOf('Module Names'); out.txt = t.slice(i, i + 3000);
