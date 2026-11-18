const TAG='B1';
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.mouse.click(75, 837); await page.waitForTimeout(8000);
let t = await body(page); out.step = /Start Import/.test(t) ? 'review' : 'other';
await page.screenshot({ path: D + 'shots/' + TAG + '-review.png' });
if (out.step === 'review') { await page.mouse.click(84, 837); await page.waitForTimeout(30000); }
await page.screenshot({ path: D + 'shots/' + TAG + '-after.png' });
t = await body(page); const i = t.indexOf('IMPORT ID'); out.list = t.slice(i, i + 300);
