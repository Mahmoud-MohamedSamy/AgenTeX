await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/channels/webforms', { waitUntil: 'commit' }).catch(()=>{});
await page.reload({ waitUntil: 'commit' }).catch(()=>{}); await page.waitForTimeout(30000);
await page.getByText('Not Now').first().click({ timeout: 3000 }).catch(()=>{});
out.url = page.url(); const t = await body(page); const i = t.indexOf('Workstation'); out.txt = t.slice(i, i + 1200);
await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_direct-assign-sources/out/z-webforms3.png' });
