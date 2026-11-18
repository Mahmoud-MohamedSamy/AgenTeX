const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads/custom-view/'+Z.cv+'/list',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} }
for(let k=0;k<20;k++){ await sleep(3000); if(/QA RT19 GS Zsort view/.test(await text())) break; } await sleep(3000);
const tab=page.getByText('QA RT19 GS Zsort view',{exact:true}).first(); await tab.hover(); await sleep(1000); await shot('zoho-gs-hover.png');
await tab.click(); await sleep(2000); log('menu1',(await text()).match(/^(Edit|Clone|Delete View|Close View|Pin|Delete)$/gm)); await shot('zoho-gs-tabclick.png');
let del=page.getByText(/^Delete( View)?$/).first();
if(!(await del.count())){ await tab.click({button:'right'}); await sleep(1500); del=page.getByText(/^Delete( View)?$/).first(); log('menu2',(await text()).match(/^(Edit|Clone|Delete View|Close View|Pin|Delete)$/gm)); }
if(await del.count()){ await del.click(); await sleep(2000); await shot('zoho-gs-viewdel.png'); log('confirm',(await text()).match(/[^\n]*(delete|Delete)[^\n]*/g)); const yes=page.getByRole('button',{name:/^(Delete|Yes|OK|Yes, Delete)$/}).last(); if(await yes.count()){ await yes.click(); await sleep(5000);} }
const cvs=await zapi('GET','/crm/v8/settings/custom_views?module=Leads'); const left=(JSON.parse(cvs.t).custom_views||[]).filter(x=>/QA RT19 GS/.test(x.name||x.display_value||'')).length;
LZ('custom view delete via UI (retry) → QA views left '+left);
return {left};
