const IMP='1499272000000485497';
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
const dl = page.waitForEvent('download', { timeout: 20000 }).catch(() => null);
await page.mouse.click(1181, 179);
const d = await dl;
if (d) { const p = D + 'data/failed-' + IMP + '.' + (d.suggestedFilename().split('.').pop()); await d.saveAs(p); out.saved = p; out.name = d.suggestedFilename(); }
else { await page.waitForTimeout(4000); out.pages = page.context().pages().map(p => p.url().slice(0, 150)); }
