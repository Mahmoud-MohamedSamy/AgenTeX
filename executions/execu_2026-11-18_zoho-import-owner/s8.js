const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.locator('[placeholder*="Find a module"]').first().click(); await page.waitForTimeout(1500);
await page.keyboard.type('Tickets'); await page.waitForTimeout(1500);
const opt = page.locator('li').filter({ hasText: /^Tickets$/ }); out.opts = await opt.count();
if (out.opts) { await opt.first().click(); } else { await page.keyboard.press('Enter'); }
await page.waitForTimeout(1500);
await page.setInputFiles('input[type=file]', D + 'data/A/Tickets.csv'); await page.waitForTimeout(5000);
await page.screenshot({ path: D + 'shots/05-A-uploaded.png' });
await page.getByText(/^Next$/).first().click(); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/06-A-module-mapping.png' });
out.txt = (await body(page)).slice(0, 1500);
