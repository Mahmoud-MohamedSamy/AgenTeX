const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} } await sleep(20000);
const J=r=>{try{return JSON.parse(r.t)}catch(e){return null}};
let r=await zapi('GET','/crm/v8/settings/global_picklists'); const gl=(J(r)||{}).global_picklists||[]; log('sets',r.s,gl.map(x=>x.display_label+'('+(x.pick_list_values_sorted_lexically)+')').join(', '));
r=await zapi('POST','/crm/v8/settings/global_picklists',{global_picklists:[{display_label:'QA RT19 GS Zsort',pick_list_values_sorted_lexically:false,pick_list_values:[{display_value:'Silver',actual_value:'Silver'},{display_value:'Platinum',actual_value:'Platinum'},{display_value:'Bronze',actual_value:'Bronze'}]}]});
log('create set',r.s,r.t.slice(0,300)); const gid=((J(r)||{}).global_picklists||[])[0]?.details?.id; if(gid) LZ('global set "QA RT19 GS Zsort" '+gid+' (entered order Silver, Platinum, Bronze)');
r=await zapi('POST','/crm/v8/settings/fields?module=Leads',{fields:[{field_label:'QA RT19 GS ZTier',data_type:'picklist',global_picklist:{id:gid}}]}); log('field',r.s,r.t.slice(0,300)); const fid=((J(r)||{}).fields||[])[0]?.details?.id; if(fid) LZ('Leads field "QA RT19 GS ZTier" '+fid);
r=await zapi('GET','/crm/v8/settings/fields?module=Leads'); const fld=((J(r)||{}).fields||[]).find(f=>f.id===fid); const api=fld&&fld.api_name; log('api_name',api, r.s);
const ids=[]; for (const [n,v] of [['Z1','Bronze'],['Z2','Platinum'],['Z3','Silver']]) { const x=await zapi('POST','/crm/v8/Leads',{data:[{Last_Name:'QA RT19 GS '+n,Company:'QA RT19 GS',[api]:v}]}); const id=(J(x)||{}).data?.[0]?.details?.id; ids.push(id); log('lead',n,x.s); if(id) LZ('lead "QA RT19 GS '+n+'" '+id+' ('+v+')'); }
fs.writeFileSync(RUN+'/out/gs/zoho-ids.json',JSON.stringify({gid,fid,api,ids},null,1));
return {gid,fid,api,ids};
