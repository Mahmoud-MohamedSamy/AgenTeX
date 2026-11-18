await page.locator('[data-title="Setup (S)"]').first().click(); await page.waitForTimeout(8000);
out.url = page.url();
const s = page.locator('input[placeholder*="earch"]').first(); if (await s.count()) { await s.fill('Import'); await page.waitForTimeout(3000); }
out.txt = (await body(page)).slice(0, 1200);
const hits = page.getByText(/^Import$/); out.n = await hits.count();
if (out.n) { await hits.first().click(); await page.waitForTimeout(10000); out.url2 = page.url(); out.txt2 = (await body(page)).slice(0, 1500); }
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/shots/03-import.png' });
