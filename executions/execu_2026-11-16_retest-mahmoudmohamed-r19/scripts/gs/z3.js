const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8'));
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} } await sleep(20000);
const J=r=>{try{return JSON.parse(r.t)}catch(e){return null}};
let r=await zapi('GET','/crm/v8/settings/fields/'+Z.fid+'?module=Leads'); const api=(J(r)||{}).fields?.[0]?.api_name; log('api',r.s,api); Z.api=api;
const vals=['Bronze','Platinum','Silver']; for (let i=0;i<3;i++){ const x=await zapi('PUT','/crm/v8/Leads',{data:[{id:Z.ids[i],[api]:vals[i]}]}); log('upd',x.s,x.t.slice(0,120)); }
r=await zapi('POST','/crm/v8/settings/custom_views?module=Leads',{custom_views:[{name:'QA RT19 GS Zsort view',fields:[{api_name:'Last_Name'},{api_name:api}],criteria:{field:{api_name:'Last_Name'},comparator:'starts_with',value:'QA RT19 GS'},sort_by:{api_name:api},sort_order:'asc'}]});
log('cv',r.s,r.t.slice(0,400)); Z.cv=(J(r)||{}).custom_views?.[0]?.details?.id; if(Z.cv) LZ('Leads custom view "QA RT19 GS Zsort view" '+Z.cv);
fs.writeFileSync(RUN+'/out/gs/zoho-ids.json',JSON.stringify(Z,null,1));
if(Z.cv){ const q=await zapi('GET','/crm/v8/Leads?cvid='+Z.cv+'&fields=Last_Name,'+api+'&sort_by=&per_page=10'); log('cv records',q.s,q.t.slice(0,600)); }
return Z;
