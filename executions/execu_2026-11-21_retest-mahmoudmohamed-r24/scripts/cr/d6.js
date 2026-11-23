eval(fs.readFileSync('cr/lib.js','utf8'));const o={};
const mods=arr((await api('GET','/modules?take=200')).j?.data);o.mods=mods.map(m=>[m.id,(m.labels?.en||m.apiName)]);
const LEADS=mods.find(m=>(m.labels?.en||m.apiName)==='Leads')?.id;
for(const m of mods.filter(m=>/^(Leads|Deals|Tasks|Calls|Contacts|Accounts|Meetings)$/.test((m.labels?.en||m.apiName)))){const f=arr((await api('GET',`/modules/${m.id}/fields?take=400`)).j?.data);o[(m.labels?.en||m.apiName)]={req:f.filter(x=>x.required&&x.status==='active').map(x=>[x.apiName,x.datatypeKey,x.isSystemManaged]),toLeads:f.filter(x=>JSON.stringify(x.datatypeOptions||{}).includes(LEADS)).map(x=>[x.apiName,x.datatypeKey,x.required]),layouts:arr((await api('GET',`/modules/${m.id}/layouts`)).j?.data).map(l=>[l.id,l.name,l.isDefault])};}
const rb=(await api('GET','/workflow/rules/2bb194a7-5fa0-4370-921e-5d8a93b03972')).j?.data;o.ruleB={moduleId:rb.moduleId,departmentIds:rb.departmentIds,trigger:rb.trigger,criteria:rb.criteria,mode:rb.mode};
return o;
