const out={};
const m=await api('GET','/modules');const mods=arr(m.j);
out.mods=mods.filter(x=>/task|call|event|ticket|contact/i.test(x.apiName||x.api_name||x.name||'')).map(x=>({id:x.id||x.moduleId,api:x.apiName||x.api_name,name:x.name||(x.labels&&x.labels.en)}));
for(const md of out.mods.filter(x=>/task|call|event/i.test(x.api||''))){const f=await api('GET',`/modules/${md.id}/fields`);const fs=arr(f.j);md.fields=fs.map(z=>z.apiName||z.api_name||z.fieldName).filter(Boolean);md.dept=fs.filter(z=>/depart/i.test(JSON.stringify(z))).map(z=>z.apiName||z.api_name);}
for(const p of ['/desk/activities','/desk/activities/stats','/desk/activities/reports','/desk/activities/count','/desk/tasks/count','/desk/activities/settings']){const r=await api('GET',p);out[p]=r.s;}
return out;
