await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('[data-title="Setup (S)"]').first().click(); await page.waitForTimeout(6000);
const s = page.locator('input[placeholder*="earch"]').first(); await s.fill('Web Forms'); await page.waitForTimeout(3000);
const h = page.getByText(/^Web Forms$/); out.n = await h.count(); if (out.n) { await h.first().click(); await page.waitForTimeout(10000); }
out.url = page.url(); const t = await body(page); const i = t.indexOf('Web Form'); out.txt = t.slice(i, i + 1500);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-webforms.png' });
