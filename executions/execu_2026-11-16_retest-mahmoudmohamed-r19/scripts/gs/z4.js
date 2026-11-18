const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19';
const fs=require('fs'); const LZ=m=>fs.appendFileSync(RUN+'/ledger-zoho.md','| '+new Date().toISOString().slice(11,16)+' | GS lane (Zoho CRM org946877290): '+m+' |\n');
const Z=JSON.parse(fs.readFileSync(RUN+'/out/gs/zoho-ids.json','utf8')); const api=Z.api;
for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} } await sleep(20000);
const J=r=>{try{return JSON.parse(r.t)}catch(e){return null}};
let r; for (const at of ['only_to_me','private']) { r=await zapi('POST','/crm/v8/settings/custom_views?module=Leads',{custom_views:[{name:'QA RT19 GS Zsort view',access_type:at,fields:[{api_name:'Last_Name'},{api_name:api}],criteria:{field:{api_name:'Last_Name'},comparator:'starts_with',value:'QA RT19 GS'},sort_by:{api_name:api},sort_order:'asc'}]}); log('cv',at,r.s,r.t.slice(0,300)); if(r.s<300) break; }
Z.cv=(J(r)||{}).custom_views?.[0]?.details?.id; if(Z.cv) LZ('Leads custom view "QA RT19 GS Zsort view" '+Z.cv+' (sorted asc by QA RT19 GS ZTier)'); fs.writeFileSync(RUN+'/out/gs/zoho-ids.json',JSON.stringify(Z,null,1));
if(Z.cv){ const q=await zapi('GET','/crm/v8/Leads?cvid='+Z.cv+'&fields=Last_Name,'+api+'&per_page=10'); log('cv records',q.s,((J(q)||{}).data||[]).map(x=>x.Last_Name+':'+x[api]).join(' | '));
 await page.goto('https://crm.zoho.com/crm/org946877290/tab/Leads/custom-view/'+Z.cv+'/list',{waitUntil:'commit',timeout:120000}); await sleep(20000); log('ui',(await text()).match(/QA RT19 GS Z\d[^\n]*/g)); await shot('zoho-2870-2-sorted-view.png'); }
return Z;
