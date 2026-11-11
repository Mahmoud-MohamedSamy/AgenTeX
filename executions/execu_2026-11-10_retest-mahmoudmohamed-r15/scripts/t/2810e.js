// CRM side: delete B's CRM contact
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' CRM '+m+'\n');
const I=JSON.parse(fs.readFileSync(RUN+'/out/2810-ids.json','utf8'));
const ms = arr((await api('GET','/modules')).j.data); const c = ms.find(m=>(m.key||m.moduleKey||m.api_name||m.apiName)==='contacts') || ms.find(m=>/Customers/.test(JSON.stringify(m.labels||m.name||'')));
const mid = c && (c.id||c.moduleId);
const g = await api('GET','/modules/'+mid+'/records/'+I.B.crm);
const d = await api('DELETE','/modules/'+mid+'/records/'+I.B.crm);
LED('deleted CRM contact "QA RT15 2810 B" '+I.B.crm+' (module '+mid+') '+d.s);
return {module: c && (c.key||c.moduleKey||c.apiName)+' '+mid, get:g.s, del:d.s, t:d.t.slice(0,200), at:new Date().toISOString()};
