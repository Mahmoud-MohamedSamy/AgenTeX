const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6', S='e383aea4-539f-488b-a316-483b3895e432', A1='876ce871-2b02-4854-89a7-68050391c62b';
const o={};
const g=async p=>{const r=await api('GET',p);o[p]={s:r.s,t:r.t.slice(0,700)};};
for (const p of [`/desk/skills/${S}`,`/desk/skills/${S}/usage`,`/desk/skills/${S}/related-rules`,`/desk/skills/criteria-fields?department_id=${D}`,`/desk/agents/${A1}/skills`,`/desk/agents/${A1}/skills?department_id=${D}`,`/desk/skills/order?department_id=${D}`,`/desk/skill-types`,`/desk/skills/limits?department_id=${D}`]) await g(p);
const all=await api('GET',`/desk/skills?department_id=${D}`); const sk=all.j.data.skills; o.count=sk.length; o.keys=Object.keys(all.j.data); o.active=sk.filter(x=>x.is_active).length;
return o;
