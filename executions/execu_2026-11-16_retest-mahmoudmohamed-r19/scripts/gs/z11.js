page.setDefaultTimeout(10000);
const fs=require('fs'); const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads/custom-view/'+Z.cv+'/list',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} }
for(let k=0;k<20;k++){ await sleep(3000); if(/QA RT19 GS Zsort view/.test(await text())) break; } await sleep(3000);
await page.mouse.click(518,70); await sleep(2500); await page.mouse.click(595,250);
for(let k=0;k<15;k++){ await sleep(3000); if(/QA RT19 GS Zsort view/.test(await text())) break; } await sleep(3000);
log('url',page.url().slice(0,140));
const row=page.locator('tr:has-text("QA RT19 GS Zsort view")').first(); log('rowcount',await row.count());
if(await row.count()){ await row.hover(); await sleep(1500); await shot('zoho-gs-manage3.png'); log('rowhtml',(await row.innerHTML()).replace(/\s+/g,' ').match(/(title|aria-label|data-[a-z-]+)="[^"]*"/g)?.slice(0,30)); }
else { await shot('zoho-gs-manage3.png'); log((await text()).slice(-1000)); }
return {};
