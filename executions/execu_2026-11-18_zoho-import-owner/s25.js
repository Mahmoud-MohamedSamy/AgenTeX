const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
const row = page.locator('text=1499272000000506975').first();
await page.keyboard.press('Escape'); await page.waitForTimeout(1500); await row.click({ force: true }); await page.waitForTimeout(8000);
await page.screenshot({ path: D + 'shots/22-prev-detail.png', fullPage: true });
const t = await body(page); const i = t.indexOf('IMPORT DETAIL VIEW'); out.detail = t.slice(i, i + 1500);
out.links = (await page.locator('a:visible, button:visible, span:visible').allInnerTexts()).map(s => s.trim()).filter(s => /log|download|mapping|view|error/i.test(s)).slice(0, 20);
