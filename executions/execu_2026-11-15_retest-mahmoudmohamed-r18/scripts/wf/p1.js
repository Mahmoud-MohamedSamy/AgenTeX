const all=arr((await api('GET','/workflow/rules?take=200')).j?.data);
const tw=all.filter(r=>/test workflow/i.test(r.name)).map(r=>({id:r.id.slice(0,8),name:r.name,active:r.isActive,depts:r.departmentIds}));
const a=all.filter(r=>r.isActive).map(r=>({id:r.id.slice(0,8),name:r.name,depts:r.departmentIds,trig:r.trigger.kind,acts:r.actions.map(x=>x.type)}));
const fc=all.filter(r=>/FieldChanged|DateField/.test(r.trigger.kind)).map(r=>[r.name,r.trigger.kind,r.trigger.fieldNames||r.trigger.dateFieldName,r.trigger.offsetSeconds]).slice(0,10);
const s=all.find(r=>r.actions.some(x=>x.type==='FieldUpdate'));
return {tw,a,fc,fuSample:s&&s.actions.find(x=>x.type==='FieldUpdate')};
