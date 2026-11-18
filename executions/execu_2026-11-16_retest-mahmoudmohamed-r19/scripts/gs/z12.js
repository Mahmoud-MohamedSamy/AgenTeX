const fs=require('fs'); const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){} } await sleep(20000);
const g=await zapi('GET','/crm/v8/settings/global_picklists'); const sets=(JSON.parse(g.t).global_picklists||[]).map(x=>x.display_label);
const cvs=await zapi('GET','/crm/v8/settings/custom_views?module=Leads'); const v=(JSON.parse(cvs.t).custom_views||[]).filter(x=>/QA RT19 GS/.test(x.name||x.display_value||'')).map(x=>x.id);
const s=await zapi('GET','/crm/v8/Leads/search?word=QA%20RT19%20GS'); const rb=await zapi('GET','/crm/v8/settings/recycle_bin?per_page=200'); const bin=(JSON.parse(rb.t||'{}').recycle_bin||[]).filter(x=>/QA RT19 GS/.test(x.display_name||'')).length;
const f=await zapi('GET','/crm/v8/settings/fields?module=Leads'); const fl=(JSON.parse(f.t).fields||[]).filter(x=>/QA RT19 GS/.test(x.field_label)).length;
LZ('final check: QA set present='+sets.includes('QA RT19 GS Zsort')+', QA views '+v.length+' ('+v.join(',')+'), leads search '+s.s+', bin QA '+bin+', QA fields '+fl);
return {setPresent:sets.includes('QA RT19 GS Zsort'),views:v,leads:s.s,bin,fields:fl};
