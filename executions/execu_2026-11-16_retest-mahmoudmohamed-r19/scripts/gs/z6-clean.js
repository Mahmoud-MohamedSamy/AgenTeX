const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} } await sleep(20000);
const o={};
o.cv=(await zapi('DELETE','/crm/v8/settings/custom_views/'+Z.cv+'?module=Leads')).s;
o.leads=(await zapi('DELETE','/crm/v8/Leads?ids='+Z.ids.join(','))).s;
o.field=await zapi('DELETE','/crm/v8/settings/fields/'+Z.fid+'?module=Leads'); o.field=o.field.s+' '+o.field.t.slice(0,150);
o.set=await zapi('DELETE','/crm/v8/settings/global_picklists/'+Z.gid); o.set=o.set.s+' '+o.set.t.slice(0,150);
const rb=await zapi('GET','/crm/v8/settings/recycle_bin?per_page=200'); let items=[]; try{items=(JSON.parse(rb.t).recycle_bin||[]).filter(x=>/QA RT19 GS/.test(x.display_name||''));}catch(e){} o.binFound=rb.s+' '+items.map(x=>x.display_name+':'+x.id).join(',');
if(items.length){ const d=await zapi('DELETE','/crm/v8/settings/recycle_bin?ids='+items.map(x=>x.id).join(',')); o.purge=d.s+' '+d.t.slice(0,200); }
const rb2=await zapi('GET','/crm/v8/settings/recycle_bin?per_page=200'); try{o.binAfter=(JSON.parse(rb2.t).recycle_bin||[]).filter(x=>/QA RT19 GS/.test(x.display_name||'')).length;}catch(e){o.binAfter=rb2.s+' '+rb2.t.slice(0,100);}
const g=await zapi('GET','/crm/v8/settings/global_picklists'); o.setsAfter=(JSON.parse(g.t).global_picklists||[]).map(x=>x.display_label).join(', ');
const s=await zapi('GET','/crm/v8/Leads/search?word=QA%20RT19%20GS'); o.leadsSearch=s.s;
LZ('cleanup: view '+o.cv+', leads '+o.leads+', field '+String(o.field).slice(0,3)+', set '+String(o.set).slice(0,3)+', bin purge '+(o.purge||'n/a').slice(0,3)+', bin QA left '+o.binAfter);
return o;
