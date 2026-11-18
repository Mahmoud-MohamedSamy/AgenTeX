await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases', { waitUntil: 'commit' }).catch(()=>{}); await page.waitForTimeout(8000);
await page.locator('[data-title="Setup (S)"]').first().click(); await page.waitForTimeout(6000);
await page.getByText('Not Now').first().click({ timeout: 2000 }).catch(()=>{});
const s = page.locator('input[placeholder*="earch"]').first(); await s.fill('Assignment Rules'); await page.waitForTimeout(3000);
await page.getByText(/^Assignment Rules$/).first().click(); await page.waitForTimeout(15000);
out.url = page.url(); const t = await body(page); const i = t.indexOf('Workstation'); out.txt = t.slice(i, i + 1500);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-ar.png' });
