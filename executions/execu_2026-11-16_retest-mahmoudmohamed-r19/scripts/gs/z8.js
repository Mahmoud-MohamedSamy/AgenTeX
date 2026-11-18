const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads/custom-view/'+Z.cv+'/list',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} }
for(let k=0;k<20;k++){ await sleep(3000); if(/QA RT19 GS Zsort view/.test(await text())) break; } await sleep(3000);
// the "..." next to the view tab
const tab=page.getByText('QA RT19 GS Zsort view',{exact:true}).first(); const bb=await tab.boundingBox(); log('tab',bb);
await page.mouse.click(bb.x+bb.width+28, bb.y+bb.height/2); await sleep(2000); await shot('zoho-gs-viewmenu.png'); log('menu',(await text()).match(/(Edit|Clone|Delete View|Close View|Pin)[^\n]*/g));
const del=page.getByText('Delete View',{exact:true}).first(); if(await del.count()){ await del.click(); await sleep(2000); await shot('zoho-gs-viewdel.png'); log('confirm',(await text()).match(/[^\n]*(delete|Delete)[^\n]*/g)); const yes=page.getByRole('button',{name:/^(Delete|Yes|OK)$/}).last(); if(await yes.count()){ await yes.click(); await sleep(5000);} }
const cvs=await zapi('GET','/crm/v8/settings/custom_views?module=Leads'); const left=(JSON.parse(cvs.t).custom_views||[]).filter(x=>/QA RT19 GS/.test(x.name||x.display_value||'')).length;
const g=await zapi('GET','/crm/v8/settings/global_picklists'); const sets=(JSON.parse(g.t).global_picklists||[]).map(x=>x.display_label).join(', ');
LZ('custom view delete via UI → QA views left '+left+'; sets now: '+sets);
return {left,sets};
