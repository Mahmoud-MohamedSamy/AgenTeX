const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2810-ids.json','utf8'));
let links=[]; for (let p=1;p<=10;p++){ const r=await api('GET','/desk/integrations/crm/links?page_size=100&page='+p); const a=arr(r.j&&r.j.data); links=links.concat(a); if(a.length<100) break; }
const la = links.find(l=>l.desk_record_id===I.A.id), lb = links.find(l=>l.desk_record_id===I.B.id);
I.A.crm = la && la.crm_record_id; I.B.crm = lb && lb.crm_record_id;
if (I.A.crm) LED('CRM contact (synced from Desk) "QA RT15 2810 A" '+I.A.crm); if (I.B.crm) LED('CRM contact (synced from Desk) "QA RT15 2810 B" '+I.B.crm);
fs.writeFileSync(RUN+'/out/2810-ids.json', JSON.stringify(I,null,1));
return {links:links.length, A: la && {crm:la.crm_record_id, status:la.sync_status, mod:la.crm_module_key}, B: lb && {crm:lb.crm_record_id, status:lb.sync_status}};
