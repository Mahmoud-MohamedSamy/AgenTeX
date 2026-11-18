const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.getByText(/^Create$/).first().click(); await page.waitForTimeout(1000);
const nones = page.getByText(/^None$/); out.n = await nones.count();
await nones.first().click(); await page.waitForTimeout(2000);
out.opts1 = (await page.$$eval('li', ls => ls.map(l => l.innerText.trim()).filter(Boolean))).slice(0, 80);
await page.screenshot({ path: D + 'shots/09-dd.png' });
