const f=arr((await api('GET','/modules/'+L+'/fields')).j.data).filter(x=>['first_name','phone'].includes(x.fieldName));
const bf=JSON.parse(fs.readFileSync(RUN+'/baseline/fields-leads.json','utf8'));
const ev=await api('GET','/audit/events?module_key=leads&from=2026-11-11T09:50:00Z&limit=100'); const es=arr(ev.j&&ev.j.data).filter(e=>/first_name|phone|Full Name|Phone/i.test(JSON.stringify(e.target_label)+JSON.stringify(e.changes||'').slice(0,400))&&/field/i.test(e.target_type));
return {fields:f.map(x=>({n:x.fieldName,rv:x.rowVersion,was:(bf.find(y=>y.id===x.id)||{}).rv,at:x.lastModifiedAt,by:x.lastModifiedByName})), audit:es.slice(0,6).map(e=>({at:e.occurred_at,who:e.actor_label,act:e.action,t:e.target_label,ch:JSON.stringify(e.changes).slice(0,200)}))};
