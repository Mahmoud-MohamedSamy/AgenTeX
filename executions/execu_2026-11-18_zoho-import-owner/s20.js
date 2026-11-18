const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.getByText(/^Next$/).first().click(); await page.waitForTimeout(10000);
await page.screenshot({ path: D + 'shots/16-A-review.png', fullPage: true });
const t = await body(page); const i = t.indexOf('Review'); out.after = t.slice(i, i + 2000);
out.btns = (await page.locator('button:visible').allInnerTexts()).map(s => s.trim()).filter(Boolean);
