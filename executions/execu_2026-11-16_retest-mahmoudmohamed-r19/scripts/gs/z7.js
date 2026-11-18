const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} } await sleep(20000);
const o={};
const cvs=await zapi('GET','/crm/v8/settings/custom_views?module=Leads'); let mine=[]; try{ mine=(JSON.parse(cvs.t).custom_views||[]).filter(x=>/QA RT19 GS/.test(x.name||x.display_value||'')); }catch(e){} o.cvsMine=cvs.s+' '+mine.map(x=>x.id+':'+(x.name||x.display_value)).join(',');
for (const v of mine) { const d=await zapi('DELETE','/crm/v8/settings/custom_views/'+v.id+'?module=Leads'); o['del '+v.id]=d.s+' '+d.t.slice(0,250); }
const g=await zapi('GET','/crm/v8/settings/global_picklists'); o.setsAfter=(JSON.parse(g.t).global_picklists||[]).map(x=>x.display_label).join(', ');
const f=await zapi('GET','/crm/v8/settings/fields?module=Leads'); o.fieldLeft=(JSON.parse(f.t).fields||[]).filter(x=>/QA RT19 GS/.test(x.field_label)).length;
LZ('cleanup check: custom views '+JSON.stringify(o).slice(0,300));
return o;
