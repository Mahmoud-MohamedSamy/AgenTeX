const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
const dd = page.locator('[data-id="dest_None_textBox"]');
await dd.nth(0).click(); await page.waitForTimeout(2500);
const vis = async () => page.$$eval('li, [role=option]', ls => ls.filter(l => l.offsetParent).map(l => l.innerText.trim()).filter(Boolean));
out.opts = (await vis()).slice(0, 120);
await page.screenshot({ path: D + 'shots/11-dd.png' });
