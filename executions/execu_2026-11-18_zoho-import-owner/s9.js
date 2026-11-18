const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
for (let i=0;i<20;i++){ const t=await body(page); if(!/Please wait until we proceed/.test(t)) break; await page.waitForTimeout(3000); }
await page.screenshot({ path: D + 'shots/07-A-mapping.png', fullPage: true });
out.txt = ((await body(page)).split('New import')[1]||'').slice(0, 2500);
