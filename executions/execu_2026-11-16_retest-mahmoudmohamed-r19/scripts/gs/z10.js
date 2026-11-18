page.setDefaultTimeout(10000);
const Z=JSON.parse(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads/custom-view/'+Z.cv+'/list',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} }
for(let k=0;k<20;k++){ await sleep(3000); if(/QA RT19 GS Zsort view/.test(await text())) break; } await sleep(3000);
await page.mouse.click(518,70); await sleep(2500); await page.mouse.click(595,250); await sleep(10000);
await shot('zoho-gs-manage2.png'); const t=await text(); log(t.slice(t.indexOf('Manage')>0?t.indexOf('Manage'):0).slice(0,800));
return {};
