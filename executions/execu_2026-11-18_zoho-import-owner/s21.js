const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.mouse.click(84, 837); await page.waitForTimeout(5000);
const t1 = await body(page); out.mid = t1.slice(t1.indexOf('Data Administration'), t1.indexOf('Data Administration') + 600);
const ok = page.getByText(/^(Confirm|Yes|Start|Proceed|OK)$/); if (await ok.count()) { out.confirm = await ok.first().innerText(); await ok.first().click(); await page.waitForTimeout(5000); }
await page.waitForTimeout(20000);
await page.screenshot({ path: D + 'shots/17-A-started.png' });
const t = await body(page); out.after = t.slice(t.indexOf('Data Administration'), t.indexOf('Data Administration') + 900);
